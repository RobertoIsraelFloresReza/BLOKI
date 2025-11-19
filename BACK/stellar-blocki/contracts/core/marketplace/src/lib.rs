#![no_std]

use soroban_sdk::{contract, contractimpl, contracttype, token, Address, Env, Symbol, Vec};
use stellar_property_errors::Error;
use stellar_property_events as events;
use stellar_property_storage::{self as storage, DataKey};

// SECURITY: Maximum trade history entries to prevent unbounded storage
const MAX_TRADE_HISTORY: u32 = 10000;

// Import contract clients for cross-contract calls
// NOTE: These imports require compiled WASM files
// For now, we'll define placeholder clients until contracts are built
// TODO: Uncomment when contracts are compiled

// mod escrow {
//     soroban_sdk::contractimport!(
//         file = "../escrow/target/wasm32-unknown-unknown/release/escrow_contract.wasm"
//     );
// }
// use escrow::Client as EscrowContractClient;

// mod property_token {
//     soroban_sdk::contractimport!(
//         file = "../property-token/target/wasm32-unknown-unknown/release/property_token.wasm"
//     );
// }
// use property_token::Client as PropertyTokenContractClient;

// mod registry {
//     soroban_sdk::contractimport!(
//         file = "../registry/target/wasm32-unknown-unknown/release/ownership_registry.wasm"
//     );
// }
// use registry::{Client as OwnershipRegistryContractClient, OwnerInfo};

// Temporary: Define struct locally until we can import from compiled contract
#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct OwnerInfo {
    pub owner: Address,
    pub percentage: i128,
}

mod swap;

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum ListingStatus {
    Active,
    Cancelled,
    Completed,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct Listing {
    pub id: u64,
    pub seller: Address,
    pub token: Address,           // Property token contract
    pub amount: i128,              // Amount of tokens for sale
    pub price_per_token: i128,     // Price in USDC per token
    pub status: ListingStatus,
    pub created_at: u64,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct Trade {
    pub listing_id: u64,
    pub buyer: Address,
    pub seller: Address,
    pub amount: i128,
    pub price: i128,
    pub timestamp: u64,
}

#[contract]
pub struct MarketplaceContract;

#[contractimpl]
impl MarketplaceContract {
    /// Initialize the marketplace contract
    pub fn initialize(
        env: Env,
        admin: Address,
        escrow_contract: Address,
        registry_contract: Address,
    ) -> Result<(), Error> {
        if storage::is_initialized(&env) {
            return Err(Error::AlreadyInitialized);
        }

        admin.require_auth();

        storage::set_admin(&env, &admin);

        // Store escrow and registry contract addresses
        env.storage()
            .instance()
            .set(&Symbol::new(&env, "escrow"), &escrow_contract);
        env.storage()
            .instance()
            .set(&Symbol::new(&env, "registry"), &registry_contract);

        storage::set_initialized(&env);

        Ok(())
    }

    /// List property tokens for sale
    pub fn list_property(
        env: Env,
        seller: Address,
        token: Address,
        amount: i128,
        price_per_token: i128,
    ) -> Result<u64, Error> {
        seller.require_auth();

        // Validations
        if amount <= 0 {
            return Err(Error::InvalidListingAmount);
        }

        if price_per_token <= 0 {
            return Err(Error::InvalidPrice);
        }

        // Check seller has enough tokens
        let token_client = token::TokenClient::new(&env, &token);
        let seller_balance = token_client.balance(&seller);

        if seller_balance < amount {
            return Err(Error::InsufficientBalance);
        }

        // Transfer tokens to marketplace for escrow
        token_client.transfer(&seller, &env.current_contract_address(), &amount);

        // Create listing
        let listing_id = storage::get_and_increment_counter(&env, DataKey::ListingCounter);

        let listing = Listing {
            id: listing_id,
            seller: seller.clone(),
            token: token.clone(),
            amount,
            price_per_token,
            status: ListingStatus::Active,
            created_at: env.ledger().timestamp(),
        };

        // Store listing
        storage::set_persistent(&env, &DataKey::Listing(listing_id), &listing);

        // Emit event
        events::listing_created(&env, listing_id, seller, token, amount, price_per_token);

        Ok(listing_id)
    }

    /// Buy tokens from a listing
    pub fn buy_tokens(
        env: Env,
        buyer: Address,
        listing_id: u64,
        amount: i128,
        usdc_token: Address,
    ) -> Result<(), Error> {
        buyer.require_auth();

        // ===== CHECKS =====
        if amount <= 0 {
            return Err(Error::InvalidAmount);
        }

        // Get listing
        let mut listing: Listing = storage::get_persistent(&env, &DataKey::Listing(listing_id))
            .ok_or(Error::ListingNotFound)?;

        // Check listing is active
        if listing.status != ListingStatus::Active {
            return Err(Error::ListingCancelled);
        }

        // Check amount available
        if amount > listing.amount {
            return Err(Error::InvalidListingAmount);
        }

        // Calculate total price with checked arithmetic
        let total_price = amount.checked_mul(listing.price_per_token)
            .ok_or(Error::InvalidAmount)?;

        // Get escrow and registry contracts
        let _escrow_contract: Address = env
            .storage()
            .instance()
            .get(&Symbol::new(&env, "escrow"))
            .unwrap();

        let _registry_contract: Address = env
            .storage()
            .instance()
            .get(&Symbol::new(&env, "registry"))
            .unwrap();

        // Verify buyer has sufficient USDC allowance for this contract
        let usdc_client = token::TokenClient::new(&env, &usdc_token);
        let buyer_allowance = usdc_client.allowance(&buyer, &env.current_contract_address());
        if buyer_allowance < total_price {
            return Err(Error::InsufficientBalance);
        }

        // ===== EFFECTS =====
        // Update listing state BEFORE external calls
        let new_listing_amount = listing.amount.checked_sub(amount)
            .ok_or(Error::InvalidAmount)?;
        listing.amount = new_listing_amount;

        if listing.amount == 0 {
            listing.status = ListingStatus::Completed;
        }

        storage::set_persistent(&env, &DataKey::Listing(listing_id), &listing);

        // Record trade
        let trade = Trade {
            listing_id,
            buyer: buyer.clone(),
            seller: listing.seller.clone(),
            amount,
            price: total_price,
            timestamp: env.ledger().timestamp(),
        };

        let trade_key = DataKey::PropertyData(Symbol::new(&env, "trade"));
        let mut trades: Vec<Trade> = storage::get_persistent(&env, &trade_key)
            .unwrap_or(Vec::new(&env));

        // SECURITY: Enforce maximum trade history with FIFO eviction
        if trades.len() >= MAX_TRADE_HISTORY {
            // Remove oldest trade (index 0) when limit reached
            trades.remove(0);
        }

        trades.push_back(trade);
        storage::set_persistent(&env, &trade_key, &trades);

        // ===== INTERACTIONS =====
        // TODO: Uncomment when contract clients are available

        // 1. Lock USDC funds in escrow
        // let escrow_client = EscrowContractClient::new(&env, &escrow_contract);
        // let escrow_id = escrow_client.lock_funds(
        //     &buyer,
        //     &listing.seller,
        //     &total_price,
        //     &listing_id,
        //     &86400, // 24 hour timeout
        // );

        // 2. Transfer property tokens from marketplace to buyer
        let token_client = token::TokenClient::new(&env, &listing.token);
        token_client.transfer(&env.current_contract_address(), &buyer, &amount);

        // 3. Release USDC from escrow to seller
        // escrow_client.release_to_seller(&escrow_id);

        // 4. Sync ownership with registry
        // Self::sync_ownership_with_registry(&env, &listing.token, &registry_contract)?;

        // Emit event
        events::tokens_purchased(&env, listing_id, buyer, listing.seller, amount, total_price);

        Ok(())
    }

    /// Internal helper to sync ownership with registry after transfer
    /// TODO: Uncomment when contract clients are available
    fn sync_ownership_with_registry(
        _env: &Env,
        _token_contract: &Address,
        _registry_contract: &Address,
    ) -> Result<(), Error> {
        // TODO: Implement when contracts are compiled
        // Get property ID from token contract metadata
        // let token_client = PropertyTokenContractClient::new(env, token_contract);
        // let metadata = token_client.metadata();

        // Get all current owners from token contract
        // let owners_info = token_client.list_all_owners();

        // Convert to registry format
        // let mut registry_owners = Vec::new(env);
        // for i in 0..owners_info.len() {
        //     let owner_info = owners_info.get(i).unwrap();
        //     registry_owners.push_back(OwnerInfo {
        //         owner: owner_info.owner,
        //         percentage: owner_info.percentage,
        //     });
        // }

        // Update registry
        // let registry_client = OwnershipRegistryContractClient::new(env, registry_contract);
        // registry_client.update_ownership(&metadata.property_id, &registry_owners)?;

        Ok(())
    }

    /// Cancel a listing
    pub fn cancel_listing(env: Env, listing_id: u64) -> Result<(), Error> {
        // Get listing
        let mut listing: Listing = storage::get_persistent(&env, &DataKey::Listing(listing_id))
            .ok_or(Error::ListingNotFound)?;

        // Only seller can cancel
        listing.seller.require_auth();

        // Check listing is active
        if listing.status != ListingStatus::Active {
            return Err(Error::ListingCancelled);
        }

        // Return tokens to seller
        let token_client = token::TokenClient::new(&env, &listing.token);
        token_client.transfer(
            &env.current_contract_address(),
            &listing.seller,
            &listing.amount,
        );

        // Update listing status
        listing.status = ListingStatus::Cancelled;
        storage::set_persistent(&env, &DataKey::Listing(listing_id), &listing);

        // Emit event
        events::listing_cancelled(&env, listing_id, listing.seller);

        Ok(())
    }

    // ========== VIEW FUNCTIONS ==========

    /// Get listing details
    pub fn get_listing(env: Env, listing_id: u64) -> Result<Listing, Error> {
        storage::get_persistent(&env, &DataKey::Listing(listing_id))
            .ok_or(Error::ListingNotFound)
    }

    /// Get all active listings for a property token
    pub fn get_listings(env: Env, token: Address) -> Vec<Listing> {
        // This is a simplified implementation
        // In production, you'd need to maintain an index of listings by token
        let mut listings = Vec::new(&env);

        // Get listing counter to know how many listings exist
        let counter: u64 = env
            .storage()
            .persistent()
            .get(&DataKey::ListingCounter)
            .unwrap_or(0);

        // Iterate through all listings (not efficient, but works for demo)
        for i in 0..counter {
            if let Some(listing) = storage::get_persistent::<Listing>(&env, &DataKey::Listing(i)) {
                if listing.token == token && listing.status == ListingStatus::Active {
                    listings.push_back(listing);
                }
            }
        }

        listings
    }

    /// Get price history for a property token
    pub fn get_price_history(env: Env, _token: Address) -> Vec<Trade> {
        // Simplified: return all trades
        let trade_key = DataKey::PropertyData(Symbol::new(&env, "trade"));
        storage::get_persistent(&env, &trade_key).unwrap_or(Vec::new(&env))
    }

    /// Calculate total market cap (sum of all active listings value)
    pub fn calculate_market_cap(env: Env) -> i128 {
        let counter: u64 = env
            .storage()
            .persistent()
            .get(&DataKey::ListingCounter)
            .unwrap_or(0);

        let mut total_value: i128 = 0;

        for i in 0..counter {
            if let Some(listing) = storage::get_persistent::<Listing>(&env, &DataKey::Listing(i)) {
                if listing.status == ListingStatus::Active {
                    // Use checked arithmetic to prevent overflow
                    let listing_value = listing.amount.checked_mul(listing.price_per_token)
                        .unwrap_or(0);
                    total_value = total_value.checked_add(listing_value)
                        .unwrap_or(total_value);
                }
            }
        }

        total_value
    }

    /// Get contract admin
    pub fn admin(env: Env) -> Address {
        storage::get_admin(&env)
    }

    /// Get escrow contract address
    pub fn escrow_contract(env: Env) -> Address {
        env.storage()
            .instance()
            .get(&Symbol::new(&env, "escrow"))
            .unwrap()
    }

    /// Get registry contract address
    pub fn registry_contract(env: Env) -> Address {
        env.storage()
            .instance()
            .get(&Symbol::new(&env, "registry"))
            .unwrap()
    }

    // ========== SOROSWAP INTEGRATION ==========

    /// Swap property tokens for USDC using Soroswap DEX
    /// Allows sellers to instantly convert tokens to USDC without listing
    pub fn swap_tokens_for_usdc(
        env: Env,
        seller: Address,
        property_token: Address,
        usdc_token: Address,
        amount_in: i128,
        min_usdc_out: i128,
    ) -> Result<i128, Error> {
        seller.require_auth();

        swap::swap_property_token_for_usdc(
            &env,
            &seller,
            &property_token,
            &usdc_token,
            amount_in,
            min_usdc_out,
        )
    }

    /// Get quote for swapping property tokens to USDC
    /// Useful for UI price display before executing swap
    pub fn get_swap_quote(
        env: Env,
        property_token: Address,
        usdc_token: Address,
        amount_in: i128,
    ) -> Result<i128, Error> {
        swap::get_swap_quote(&env, &property_token, &usdc_token, amount_in)
    }

    /// Swap property tokens for USDC via XLM (when no direct pool exists)
    pub fn swap_tokens_for_usdc_via_xlm(
        env: Env,
        seller: Address,
        property_token: Address,
        xlm_token: Address,
        usdc_token: Address,
        amount_in: i128,
        min_usdc_out: i128,
    ) -> Result<i128, Error> {
        seller.require_auth();

        swap::swap_property_token_for_usdc_via_xlm(
            &env,
            &seller,
            &property_token,
            &xlm_token,
            &usdc_token,
            amount_in,
            min_usdc_out,
        )
    }
}

#[cfg(test)]
mod test {
    use super::*;
    use soroban_sdk::{testutils::Address as _, token, Address, Env};

    fn create_token_contract<'a>(env: &Env, admin: &Address) -> token::StellarAssetClient<'a> {
        token::StellarAssetClient::new(
            env,
            &env.register_stellar_asset_contract_v2(admin.clone())
                .address(),
        )
    }

    #[test]
    fn test_initialize() {
        let env = Env::default();
        let contract_id = env.register_contract(None, MarketplaceContract);
        let client = MarketplaceContractClient::new(&env, &contract_id);

        let admin = Address::generate(&env);
        let escrow = Address::generate(&env);
        let registry = Address::generate(&env);

        client.initialize(&admin, &escrow, &registry);

        assert_eq!(client.admin(), admin);
        assert_eq!(client.escrow_contract(), escrow);
        assert_eq!(client.registry_contract(), registry);
    }

    #[test]
    fn test_list_and_buy_property() {
        let env = Env::default();
        env.mock_all_auths();

        let contract_id = env.register_contract(None, MarketplaceContract);
        let client = MarketplaceContractClient::new(&env, &contract_id);

        let admin = Address::generate(&env);
        let seller = Address::generate(&env);
        let buyer = Address::generate(&env);
        let escrow = Address::generate(&env);
        let registry = Address::generate(&env);

        // Create property token
        let token_admin = Address::generate(&env);
        let property_token = create_token_contract(&env, &token_admin);

        // Mint tokens to seller
        property_token.mint(&seller, &1000_0000000);

        client.initialize(&admin, &escrow, &registry);

        // Seller lists 250 tokens at 2000 USDC per token
        let amount = 250_0000000;
        let price_per_token = 2000_0000000;

        let listing_id = client.list_property(&seller, &property_token.address, &amount, &price_per_token);

        // Check listing was created
        let listing = client.get_listing(&listing_id);
        assert_eq!(listing.seller, seller);
        assert_eq!(listing.amount, amount);
        assert_eq!(listing.price_per_token, price_per_token);
        assert_eq!(listing.status, ListingStatus::Active);

        // Check tokens transferred to marketplace
        assert_eq!(property_token.balance(&contract_id), amount);

        // Buyer buys 100 tokens
        let buy_amount = 100_0000000;
        client.buy_tokens(&buyer, &listing_id, &buy_amount);

        // Check buyer received tokens
        assert_eq!(property_token.balance(&buyer), buy_amount);

        // Check listing updated
        let listing = client.get_listing(&listing_id);
        assert_eq!(listing.amount, amount - buy_amount);
        assert_eq!(listing.status, ListingStatus::Active);
    }

    #[test]
    fn test_cancel_listing() {
        let env = Env::default();
        env.mock_all_auths();

        let contract_id = env.register_contract(None, MarketplaceContract);
        let client = MarketplaceContractClient::new(&env, &contract_id);

        let admin = Address::generate(&env);
        let seller = Address::generate(&env);
        let escrow = Address::generate(&env);
        let registry = Address::generate(&env);

        let token_admin = Address::generate(&env);
        let property_token = create_token_contract(&env, &token_admin);

        property_token.mint(&seller, &1000_0000000);

        client.initialize(&admin, &escrow, &registry);

        let amount = 250_0000000;
        let price_per_token = 2000_0000000;

        let listing_id = client.list_property(&seller, &property_token.address, &amount, &price_per_token);

        // Cancel listing
        client.cancel_listing(&listing_id);

        // Check listing status
        let listing = client.get_listing(&listing_id);
        assert_eq!(listing.status, ListingStatus::Cancelled);

        // Check tokens returned to seller
        assert_eq!(property_token.balance(&seller), 1000_0000000);
        assert_eq!(property_token.balance(&contract_id), 0);
    }

    #[test]
    fn test_get_listings_by_token() {
        let env = Env::default();
        env.mock_all_auths();

        let contract_id = env.register_contract(None, MarketplaceContract);
        let client = MarketplaceContractClient::new(&env, &contract_id);

        let admin = Address::generate(&env);
        let seller = Address::generate(&env);
        let escrow = Address::generate(&env);
        let registry = Address::generate(&env);

        let token_admin = Address::generate(&env);
        let property_token = create_token_contract(&env, &token_admin);

        property_token.mint(&seller, &1000_0000000);

        client.initialize(&admin, &escrow, &registry);

        // Create multiple listings
        client.list_property(&seller, &property_token.address, &100_0000000, &1000_0000000);
        client.list_property(&seller, &property_token.address, &200_0000000, &1500_0000000);

        // Get listings for this token
        let listings = client.get_listings(&property_token.address);
        assert_eq!(listings.len(), 2);
    }

    #[test]
    fn test_calculate_market_cap() {
        let env = Env::default();
        env.mock_all_auths();

        let contract_id = env.register_contract(None, MarketplaceContract);
        let client = MarketplaceContractClient::new(&env, &contract_id);

        let admin = Address::generate(&env);
        let seller = Address::generate(&env);
        let escrow = Address::generate(&env);
        let registry = Address::generate(&env);

        let token_admin = Address::generate(&env);
        let property_token = create_token_contract(&env, &token_admin);

        property_token.mint(&seller, &1000_0000000);

        client.initialize(&admin, &escrow, &registry);

        // List tokens
        let amount1 = 100_0000000;
        let price1 = 1000_0000000;
        let amount2 = 200_0000000;
        let price2 = 1500_0000000;

        client.list_property(&seller, &property_token.address, &amount1, &price1);
        client.list_property(&seller, &property_token.address, &amount2, &price2);

        // Calculate market cap
        let market_cap = client.calculate_market_cap();
        let expected = (amount1 * price1) + (amount2 * price2);
        assert_eq!(market_cap, expected);
    }
}
