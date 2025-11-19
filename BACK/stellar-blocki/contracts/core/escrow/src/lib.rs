#![no_std]

use soroban_sdk::{contract, contractimpl, contracttype, token, Address, Env};
use stellar_property_errors::Error;
use stellar_property_events as events;
use stellar_property_storage::{self as storage, DataKey};

// DeFindex yield integration (design phase - not yet implemented)
mod yield_integration;

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum EscrowStatus {
    Locked,
    Released,
    Refunded,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct EscrowData {
    pub buyer: Address,
    pub seller: Address,
    pub amount: i128,
    pub token: Address, // USDC token address
    pub listing_id: u64,
    pub status: EscrowStatus,
    pub created_at: u64,
    pub timeout_at: u64,
}

#[contract]
pub struct EscrowContract;

#[contractimpl]
impl EscrowContract {
    /// Initialize the escrow contract
    pub fn initialize(
        env: Env,
        admin: Address,
        usdc_token: Address,
        marketplace_contract: Address,
    ) -> Result<(), Error> {
        if storage::is_initialized(&env) {
            return Err(Error::AlreadyInitialized);
        }

        admin.require_auth();

        storage::set_admin(&env, &admin);

        // Store USDC token address
        env.storage()
            .instance()
            .set(&DataKey::PropertyData(soroban_sdk::Symbol::new(&env, "usdc")), &usdc_token);

        // Store marketplace contract address (authorized to release funds)
        env.storage()
            .instance()
            .set(&DataKey::MarketplaceAddress, &marketplace_contract);

        storage::set_initialized(&env);

        Ok(())
    }

    /// Lock funds in escrow for a listing
    pub fn lock_funds(
        env: Env,
        buyer: Address,
        seller: Address,
        amount: i128,
        listing_id: u64,
        timeout_duration: u64,
    ) -> Result<u64, Error> {
        buyer.require_auth();

        if amount <= 0 {
            return Err(Error::InvalidAmount);
        }

        // Get USDC token
        let usdc_token: Address = env
            .storage()
            .instance()
            .get(&DataKey::PropertyData(soroban_sdk::Symbol::new(&env, "usdc")))
            .unwrap();

        // Get next escrow ID
        let escrow_id = storage::get_and_increment_counter(&env, DataKey::EscrowCounter);

        // Get current timestamp
        let current_time = env.ledger().timestamp();

        // Create escrow data
        let escrow_data = EscrowData {
            buyer: buyer.clone(),
            seller: seller.clone(),
            amount,
            token: usdc_token.clone(),
            listing_id,
            status: EscrowStatus::Locked,
            created_at: current_time,
            timeout_at: current_time + timeout_duration,
        };

        // Store escrow data
        storage::set_persistent(&env, &DataKey::Escrow(escrow_id), &escrow_data);

        // Transfer USDC from buyer to contract
        let token_client = token::TokenClient::new(&env, &usdc_token);
        token_client.transfer(&buyer, &env.current_contract_address(), &amount);

        // Emit event
        events::funds_locked(&env, escrow_id, buyer, amount);

        Ok(escrow_id)
    }

    /// Release funds to seller (called by marketplace after successful purchase)
    pub fn release_to_seller(env: Env, escrow_id: u64) -> Result<(), Error> {
        // SECURITY: Verify caller is authorized (marketplace or admin only)
        let marketplace: Address = env
            .storage()
            .instance()
            .get(&DataKey::MarketplaceAddress)
            .unwrap();

        let admin = storage::get_admin(&env);

        // Require authorization from either marketplace or admin
        // This prevents unauthorized release of funds
        let mut authorized = false;

        // Check if admin is calling
        if storage::has_admin(&env) {
            admin.require_auth();
            authorized = true;
        }

        // TODO: In production with cross-contract calls, also check:
        // if env.invoker() == marketplace { authorized = true; }

        if !authorized {
            return Err(Error::NotAuthorized);
        }

        // Get escrow data
        let mut escrow_data: EscrowData = storage::get_persistent(&env, &DataKey::Escrow(escrow_id))
            .ok_or(Error::EscrowNotFound)?;

        // Check status
        if escrow_data.status != EscrowStatus::Locked {
            return Err(Error::EscrowNotLocked);
        }

        // Update status
        escrow_data.status = EscrowStatus::Released;
        storage::set_persistent(&env, &DataKey::Escrow(escrow_id), &escrow_data);

        // Transfer funds to seller
        let token_client = token::TokenClient::new(&env, &escrow_data.token);
        token_client.transfer(
            &env.current_contract_address(),
            &escrow_data.seller,
            &escrow_data.amount,
        );

        // Emit event
        events::funds_released(&env, escrow_id, escrow_data.seller, escrow_data.amount);

        Ok(())
    }

    /// Refund funds to buyer (called if purchase fails or timeout)
    pub fn refund_to_buyer(env: Env, escrow_id: u64) -> Result<(), Error> {
        // Get escrow data
        let mut escrow_data: EscrowData = storage::get_persistent(&env, &DataKey::Escrow(escrow_id))
            .ok_or(Error::EscrowNotFound)?;

        // Check if timeout reached or admin authorized
        let current_time = env.ledger().timestamp();
        let admin = storage::get_admin(&env);

        if current_time < escrow_data.timeout_at {
            // Only admin can refund before timeout
            admin.require_auth();
        } else {
            // After timeout, buyer can request refund
            escrow_data.buyer.require_auth();
        }

        // Check status
        if escrow_data.status != EscrowStatus::Locked {
            return Err(Error::EscrowNotLocked);
        }

        // Update status
        escrow_data.status = EscrowStatus::Refunded;
        storage::set_persistent(&env, &DataKey::Escrow(escrow_id), &escrow_data);

        // Transfer funds back to buyer
        let token_client = token::TokenClient::new(&env, &escrow_data.token);
        token_client.transfer(
            &env.current_contract_address(),
            &escrow_data.buyer,
            &escrow_data.amount,
        );

        // Emit event
        events::funds_refunded(&env, escrow_id, escrow_data.buyer, escrow_data.amount);

        Ok(())
    }

    // ========== VIEW FUNCTIONS ==========

    /// Get escrow status
    pub fn get_escrow_status(env: Env, escrow_id: u64) -> Result<EscrowStatus, Error> {
        let escrow_data: EscrowData = storage::get_persistent(&env, &DataKey::Escrow(escrow_id))
            .ok_or(Error::EscrowNotFound)?;

        Ok(escrow_data.status)
    }

    /// Get escrow data
    pub fn get_escrow_data(env: Env, escrow_id: u64) -> Result<EscrowData, Error> {
        let escrow_data: EscrowData = storage::get_persistent(&env, &DataKey::Escrow(escrow_id))
            .ok_or(Error::EscrowNotFound)?;

        Ok(escrow_data)
    }

    /// Check if escrow is timed out
    pub fn is_timed_out(env: Env, escrow_id: u64) -> Result<bool, Error> {
        let escrow_data: EscrowData = storage::get_persistent(&env, &DataKey::Escrow(escrow_id))
            .ok_or(Error::EscrowNotFound)?;

        let current_time = env.ledger().timestamp();
        Ok(current_time >= escrow_data.timeout_at)
    }

    /// Get contract admin
    pub fn admin(env: Env) -> Address {
        storage::get_admin(&env)
    }
}

#[cfg(test)]
mod test {
    use super::*;
    use soroban_sdk::{testutils::{Address as _, Ledger, LedgerInfo}, Address, Env};

    fn create_token_contract<'a>(env: &Env, admin: &Address) -> token::StellarAssetClient<'a> {
        token::StellarAssetClient::new(env, &env.register_stellar_asset_contract_v2(admin.clone()).address())
    }

    #[test]
    fn test_initialize() {
        let env = Env::default();
        let contract_id = env.register_contract(None, EscrowContract);
        let client = EscrowContractClient::new(&env, &contract_id);

        let admin = Address::generate(&env);
        let usdc_admin = Address::generate(&env);
        let usdc_token = create_token_contract(&env, &usdc_admin);

        client.initialize(&admin, &usdc_token.address);

        assert_eq!(client.admin(), admin);
    }

    #[test]
    fn test_lock_and_release_funds() {
        let env = Env::default();
        env.mock_all_auths();

        let contract_id = env.register_contract(None, EscrowContract);
        let client = EscrowContractClient::new(&env, &contract_id);

        let admin = Address::generate(&env);
        let buyer = Address::generate(&env);
        let seller = Address::generate(&env);
        let usdc_admin = Address::generate(&env);
        let usdc_token = create_token_contract(&env, &usdc_admin);

        // Mint USDC to buyer
        usdc_token.mint(&buyer, &1000_0000000);

        client.initialize(&admin, &usdc_token.address);

        // Lock funds
        let amount = 500_0000000;
        let listing_id = 1;
        let timeout = 86400; // 24 hours

        let escrow_id = client.lock_funds(&buyer, &seller, &amount, &listing_id, &timeout);

        // Check escrow status
        let status = client.get_escrow_status(&escrow_id);
        assert_eq!(status, EscrowStatus::Locked);

        // Check contract received funds
        assert_eq!(usdc_token.balance(&contract_id), amount);

        // Release funds to seller
        client.release_to_seller(&escrow_id);

        // Check status updated
        let status = client.get_escrow_status(&escrow_id);
        assert_eq!(status, EscrowStatus::Released);

        // Check seller received funds
        assert_eq!(usdc_token.balance(&seller), amount);
        assert_eq!(usdc_token.balance(&contract_id), 0);
    }

    #[test]
    fn test_refund_after_timeout() {
        let env = Env::default();
        env.mock_all_auths();

        let contract_id = env.register_contract(None, EscrowContract);
        let client = EscrowContractClient::new(&env, &contract_id);

        let admin = Address::generate(&env);
        let buyer = Address::generate(&env);
        let seller = Address::generate(&env);
        let usdc_admin = Address::generate(&env);
        let usdc_token = create_token_contract(&env, &usdc_admin);

        usdc_token.mint(&buyer, &1000_0000000);

        client.initialize(&admin, &usdc_token.address);

        let amount = 500_0000000;
        let listing_id = 1;
        let timeout = 10; // 10 seconds

        let escrow_id = client.lock_funds(&buyer, &seller, &amount, &listing_id, &timeout);

        // Advance time past timeout
        env.ledger().set(LedgerInfo {
            timestamp: env.ledger().timestamp() + timeout + 1,
            protocol_version: 20,
            sequence_number: env.ledger().sequence(),
            network_id: Default::default(),
            base_reserve: 10,
            min_temp_entry_ttl: 10,
            min_persistent_entry_ttl: 10,
            max_entry_ttl: 3110400,
        });

        // Refund to buyer
        client.refund_to_buyer(&escrow_id);

        // Check status
        let status = client.get_escrow_status(&escrow_id);
        assert_eq!(status, EscrowStatus::Refunded);

        // Check buyer received refund
        assert_eq!(usdc_token.balance(&buyer), 1000_0000000);
        assert_eq!(usdc_token.balance(&contract_id), 0);
    }

    #[test]
    #[should_panic(expected = "Error(EscrowNotFound)")]
    fn test_get_nonexistent_escrow() {
        let env = Env::default();
        let contract_id = env.register_contract(None, EscrowContract);
        let client = EscrowContractClient::new(&env, &contract_id);

        let admin = Address::generate(&env);
        let usdc_admin = Address::generate(&env);
        let usdc_token = create_token_contract(&env, &usdc_admin);

        client.initialize(&admin, &usdc_token.address);

        // Try to get nonexistent escrow
        client.get_escrow_status(&999);
    }
}
