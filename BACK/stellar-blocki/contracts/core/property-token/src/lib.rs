#![no_std]

use soroban_sdk::{contract, contractimpl, contracttype, token, Address, Env, String, Symbol, Vec};
use stellar_property_errors::Error;
use stellar_property_events as events;
use stellar_property_storage::{self as storage, DataKey};

// SECURITY: Maximum number of token owners to prevent unbounded storage
const MAX_OWNERS: u32 = 1000;

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct TokenMetadata {
    pub property_id: Symbol,
    pub name: String,
    pub symbol: String,
    pub decimals: u32,
    pub total_supply: i128,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct OwnershipInfo {
    pub owner: Address,
    pub balance: i128,
    pub percentage: i128,
}

#[contract]
pub struct PropertyTokenContract;

#[contractimpl]
impl PropertyTokenContract {
    /// Initialize the token contract with property metadata
    pub fn initialize(
        env: Env,
        admin: Address,
        property_id: Symbol,
        name: String,
        symbol: String,
        total_supply: i128,
    ) -> Result<(), Error> {
        // Check if already initialized
        if storage::is_initialized(&env) {
            return Err(Error::AlreadyInitialized);
        }

        // Validate inputs
        if total_supply <= 0 {
            return Err(Error::InvalidAmount);
        }

        admin.require_auth();

        // Store admin
        storage::set_admin(&env, &admin);

        // Store token metadata
        let metadata = TokenMetadata {
            property_id: property_id.clone(),
            name,
            symbol,
            decimals: 7, // Standard for Stellar assets
            total_supply,
        };

        env.storage()
            .instance()
            .set(&Symbol::new(&env, "metadata"), &metadata);

        // Mark as initialized
        storage::set_initialized(&env);

        Ok(())
    }

    /// Mint tokens to an address with ownership percentage
    pub fn mint(
        env: Env,
        to: Address,
        amount: i128,
        percentage: i128,
    ) -> Result<(), Error> {
        let admin = storage::get_admin(&env);
        admin.require_auth();

        // Validations
        if amount <= 0 {
            return Err(Error::InvalidAmount);
        }

        if percentage <= 0 || percentage > 10000 {
            // Using basis points (10000 = 100%)
            return Err(Error::InvalidPercentage);
        }

        // Check if minting would exceed total supply
        let metadata: TokenMetadata = env
            .storage()
            .instance()
            .get(&Symbol::new(&env, "metadata"))
            .unwrap();

        let current_supply = Self::total_minted(env.clone());
        let new_total = current_supply.checked_add(amount)
            .ok_or(Error::InvalidAmount)?;

        if new_total > metadata.total_supply {
            return Err(Error::MintExceedsSupply);
        }

        // Mint tokens
        let current_balance = storage::get_balance(&env, &to);
        let new_balance = current_balance.checked_add(amount)
            .ok_or(Error::InvalidAmount)?;
        storage::set_balance(&env, &to, new_balance);

        // Update total minted
        env.storage().persistent().set(&DataKey::TotalMinted, &new_total);

        // Track owner if new
        Self::add_owner_to_list(&env, &to)?;

        // Emit mint event
        events::mint(&env, to.clone(), amount);

        Ok(())
    }

    /// Transfer tokens from one address to another
    pub fn transfer(
        env: Env,
        from: Address,
        to: Address,
        amount: i128,
    ) -> Result<(), Error> {
        from.require_auth();

        if amount <= 0 {
            return Err(Error::InvalidAmount);
        }

        // Check balance
        let from_balance = storage::get_balance(&env, &from);
        if from_balance < amount {
            return Err(Error::InsufficientBalance);
        }

        // Update balances with checked arithmetic
        let new_from_balance = from_balance.checked_sub(amount)
            .ok_or(Error::InvalidAmount)?;
        storage::set_balance(&env, &from, new_from_balance);

        let to_balance = storage::get_balance(&env, &to);
        let new_to_balance = to_balance.checked_add(amount)
            .ok_or(Error::InvalidAmount)?;
        storage::set_balance(&env, &to, new_to_balance);

        // Track new owner if needed
        Self::add_owner_to_list(&env, &to)?;

        // Emit transfer event
        events::transfer(&env, from, to, amount);

        Ok(())
    }

    /// Transfer tokens on behalf of another address (requires allowance)
    pub fn transfer_from(
        env: Env,
        spender: Address,
        from: Address,
        to: Address,
        amount: i128,
    ) -> Result<(), Error> {
        spender.require_auth();

        if amount <= 0 {
            return Err(Error::InvalidAmount);
        }

        // Check allowance
        let allowance = storage::get_allowance(&env, &from, &spender);
        if allowance < amount {
            return Err(Error::InsufficientAllowance);
        }

        // Check balance
        let from_balance = storage::get_balance(&env, &from);
        if from_balance < amount {
            return Err(Error::InsufficientBalance);
        }

        // Update allowance with checked arithmetic
        let new_allowance = allowance.checked_sub(amount)
            .ok_or(Error::InvalidAmount)?;
        storage::set_allowance(&env, &from, &spender, new_allowance);

        // Update balances with checked arithmetic
        let new_from_balance = from_balance.checked_sub(amount)
            .ok_or(Error::InvalidAmount)?;
        storage::set_balance(&env, &from, new_from_balance);

        let to_balance = storage::get_balance(&env, &to);
        let new_to_balance = to_balance.checked_add(amount)
            .ok_or(Error::InvalidAmount)?;
        storage::set_balance(&env, &to, new_to_balance);

        // Track new owner if needed
        Self::add_owner_to_list(&env, &to)?;

        // Emit transfer event
        events::transfer(&env, from, to, amount);

        Ok(())
    }

    /// Approve spender to transfer tokens on behalf of owner
    pub fn approve(
        env: Env,
        owner: Address,
        spender: Address,
        amount: i128,
    ) -> Result<(), Error> {
        owner.require_auth();

        if amount < 0 {
            return Err(Error::InvalidAmount);
        }

        storage::set_allowance(&env, &owner, &spender, amount);

        Ok(())
    }

    /// Burn tokens from an address
    pub fn burn(env: Env, from: Address, amount: i128) -> Result<(), Error> {
        from.require_auth();

        if amount <= 0 {
            return Err(Error::InvalidAmount);
        }

        let balance = storage::get_balance(&env, &from);
        if balance < amount {
            return Err(Error::InsufficientBalance);
        }

        // Use checked arithmetic to prevent underflow
        let new_balance = balance.checked_sub(amount)
            .ok_or(Error::InvalidAmount)?;
        storage::set_balance(&env, &from, new_balance);

        events::burn(&env, from, amount);

        Ok(())
    }

    // ========== VIEW FUNCTIONS ==========

    /// Get balance of an address
    pub fn balance_of(env: Env, owner: Address) -> i128 {
        storage::get_balance(&env, &owner)
    }

    /// Get allowance of spender for owner
    pub fn allowance(env: Env, owner: Address, spender: Address) -> i128 {
        storage::get_allowance(&env, &owner, &spender)
    }

    /// Get ownership percentage for an address (in basis points: 10000 = 100%)
    pub fn get_ownership_percentage(env: Env, owner: Address) -> i128 {
        let balance = storage::get_balance(&env, &owner);
        let metadata: TokenMetadata = env
            .storage()
            .instance()
            .get(&Symbol::new(&env, "metadata"))
            .unwrap();

        if metadata.total_supply == 0 {
            return 0;
        }

        // Calculate percentage in basis points with checked arithmetic
        balance.checked_mul(10000)
            .and_then(|v| v.checked_div(metadata.total_supply))
            .unwrap_or(0)
    }

    /// List all owners with their balances (for small number of owners)
    /// Note: This is expensive and should be used sparingly
    pub fn list_all_owners(env: Env) -> Vec<OwnershipInfo> {
        let owners_list: Vec<Address> = env
            .storage()
            .persistent()
            .get(&DataKey::OwnersList)
            .unwrap_or(Vec::new(&env));

        let mut result = Vec::new(&env);

        for i in 0..owners_list.len() {
            let owner = owners_list.get(i).unwrap();
            let balance = storage::get_balance(&env, &owner);

            // Only include owners with non-zero balance
            if balance > 0 {
                let percentage = Self::get_ownership_percentage(env.clone(), owner.clone());
                result.push_back(OwnershipInfo {
                    owner,
                    balance,
                    percentage,
                });
            }
        }

        result
    }

    /// Get token metadata
    pub fn metadata(env: Env) -> TokenMetadata {
        env.storage()
            .instance()
            .get(&Symbol::new(&env, "metadata"))
            .unwrap()
    }

    /// Get total supply
    pub fn total_supply(env: Env) -> i128 {
        let metadata: TokenMetadata = env
            .storage()
            .instance()
            .get(&Symbol::new(&env, "metadata"))
            .unwrap();
        metadata.total_supply
    }

    /// Get total minted tokens
    fn total_minted(env: Env) -> i128 {
        env.storage()
            .persistent()
            .get(&DataKey::TotalMinted)
            .unwrap_or(0)
    }

    /// Add owner to tracking list if not already present
    /// SECURITY: Bounded to MAX_OWNERS to prevent unbounded storage growth
    fn add_owner_to_list(env: &Env, owner: &Address) -> Result<(), Error> {
        let mut owners_list: Vec<Address> = env
            .storage()
            .persistent()
            .get(&DataKey::OwnersList)
            .unwrap_or(Vec::new(env));

        // Check if owner already exists in list
        let mut exists = false;
        for i in 0..owners_list.len() {
            if owners_list.get(i).unwrap() == *owner {
                exists = true;
                break;
            }
        }

        // Add if new owner (with bounds check)
        if !exists {
            // SECURITY: Enforce maximum owners limit
            if owners_list.len() >= MAX_OWNERS {
                return Err(Error::InvalidAmount); // Reusing error code, consider adding MaxOwnersReached
            }
            owners_list.push_back(owner.clone());
            env.storage().persistent().set(&DataKey::OwnersList, &owners_list);
        }

        Ok(())
    }

    /// Get contract admin
    pub fn admin(env: Env) -> Address {
        storage::get_admin(&env)
    }

    // ========== SEP-41 STANDARD FUNCTIONS ==========

    /// Get token symbol (SEP-41)
    pub fn symbol(env: Env) -> String {
        let metadata: TokenMetadata = env
            .storage()
            .instance()
            .get(&Symbol::new(&env, "metadata"))
            .unwrap();
        metadata.symbol
    }

    /// Get token name (SEP-41)
    pub fn name(env: Env) -> String {
        let metadata: TokenMetadata = env
            .storage()
            .instance()
            .get(&Symbol::new(&env, "metadata"))
            .unwrap();
        metadata.name
    }

    /// Get token decimals (SEP-41)
    pub fn decimals(env: Env) -> u32 {
        let metadata: TokenMetadata = env
            .storage()
            .instance()
            .get(&Symbol::new(&env, "metadata"))
            .unwrap();
        metadata.decimals
    }

    /// Get balance (SEP-41 alias)
    pub fn balance(env: Env, id: Address) -> i128 {
        Self::balance_of(env, id)
    }
}

#[cfg(test)]
mod test {
    use super::*;
    use soroban_sdk::{testutils::Address as _, Env, String};

    #[test]
    fn test_initialize() {
        let env = Env::default();
        env.mock_all_auths(); // Mock authorization for testing

        let contract_id = env.register_contract(None, PropertyTokenContract);
        let client = PropertyTokenContractClient::new(&env, &contract_id);

        let admin = Address::generate(&env);
        let property_id = Symbol::new(&env, "PROP001");
        let name = String::from_str(&env, "Property Token");
        let symbol = String::from_str(&env, "PROP");
        let total_supply = 1_000_000_0000000; // 1M with 7 decimals

        client.initialize(&admin, &property_id, &name, &symbol, &total_supply);

        let metadata = client.metadata();
        assert_eq!(metadata.property_id, property_id);
        assert_eq!(metadata.total_supply, total_supply);
    }

    #[test]
    fn test_mint_and_balance() {
        let env = Env::default();
        env.mock_all_auths(); // Mock authorization for testing

        let contract_id = env.register_contract(None, PropertyTokenContract);
        let client = PropertyTokenContractClient::new(&env, &contract_id);

        let admin = Address::generate(&env);
        let user = Address::generate(&env);
        let property_id = Symbol::new(&env, "PROP001");
        let name = String::from_str(&env, "Property Token");
        let symbol = String::from_str(&env, "PROP");
        let total_supply = 1_000_000_0000000;

        client.initialize(&admin, &property_id, &name, &symbol, &total_supply);

        let mint_amount = 100_000_0000000; // 100k tokens (10%)
        client.mint(&user, &mint_amount, &1000); // 1000 basis points = 10%

        assert_eq!(client.balance_of(&user), mint_amount);
    }

    #[test]
    fn test_transfer() {
        let env = Env::default();
        env.mock_all_auths(); // Mock authorization for testing

        let contract_id = env.register_contract(None, PropertyTokenContract);
        let client = PropertyTokenContractClient::new(&env, &contract_id);

        let admin = Address::generate(&env);
        let user1 = Address::generate(&env);
        let user2 = Address::generate(&env);
        let property_id = Symbol::new(&env, "PROP001");
        let name = String::from_str(&env, "Property Token");
        let symbol = String::from_str(&env, "PROP");
        let total_supply = 1_000_000_0000000;

        client.initialize(&admin, &property_id, &name, &symbol, &total_supply);

        let mint_amount = 100_000_0000000;
        client.mint(&user1, &mint_amount, &1000);

        let transfer_amount = 25_000_0000000; // 25k tokens
        client.transfer(&user1, &user2, &transfer_amount);

        assert_eq!(client.balance_of(&user1), mint_amount - transfer_amount);
        assert_eq!(client.balance_of(&user2), transfer_amount);
    }

    #[test]
    fn test_approve_and_transfer_from() {
        let env = Env::default();
        env.mock_all_auths(); // Mock authorization for testing

        let contract_id = env.register_contract(None, PropertyTokenContract);
        let client = PropertyTokenContractClient::new(&env, &contract_id);

        let admin = Address::generate(&env);
        let owner = Address::generate(&env);
        let spender = Address::generate(&env);
        let recipient = Address::generate(&env);
        let property_id = Symbol::new(&env, "PROP001");
        let name = String::from_str(&env, "Property Token");
        let symbol = String::from_str(&env, "PROP");
        let total_supply = 1_000_000_0000000;

        client.initialize(&admin, &property_id, &name, &symbol, &total_supply);

        let mint_amount = 100_000_0000000;
        client.mint(&owner, &mint_amount, &1000);

        let allowance_amount = 50_000_0000000;
        client.approve(&owner, &spender, &allowance_amount);

        assert_eq!(client.allowance(&owner, &spender), allowance_amount);

        let transfer_amount = 25_000_0000000;
        client.transfer_from(&spender, &owner, &recipient, &transfer_amount);

        assert_eq!(client.balance_of(&owner), mint_amount - transfer_amount);
        assert_eq!(client.balance_of(&recipient), transfer_amount);
        assert_eq!(
            client.allowance(&owner, &spender),
            allowance_amount - transfer_amount
        );
    }

    #[test]
    #[should_panic(expected = "Error(Contract, #11)")]
    fn test_transfer_insufficient_balance() {
        let env = Env::default();
        env.mock_all_auths(); // Mock authorization for testing

        let contract_id = env.register_contract(None, PropertyTokenContract);
        let client = PropertyTokenContractClient::new(&env, &contract_id);

        let admin = Address::generate(&env);
        let user1 = Address::generate(&env);
        let user2 = Address::generate(&env);
        let property_id = Symbol::new(&env, "PROP001");
        let name = String::from_str(&env, "Property Token");
        let symbol = String::from_str(&env, "PROP");
        let total_supply = 1_000_000_0000000;

        client.initialize(&admin, &property_id, &name, &symbol, &total_supply);

        let mint_amount = 100_000_0000000;
        client.mint(&user1, &mint_amount, &1000);

        // Try to transfer more than balance
        let transfer_amount = 200_000_0000000;
        client.transfer(&user1, &user2, &transfer_amount);
    }

    #[test]
    fn test_ownership_percentage() {
        let env = Env::default();
        env.mock_all_auths(); // Mock authorization for testing

        let contract_id = env.register_contract(None, PropertyTokenContract);
        let client = PropertyTokenContractClient::new(&env, &contract_id);

        let admin = Address::generate(&env);
        let user = Address::generate(&env);
        let property_id = Symbol::new(&env, "PROP001");
        let name = String::from_str(&env, "Property Token");
        let symbol = String::from_str(&env, "PROP");
        let total_supply = 1_000_000_0000000;

        client.initialize(&admin, &property_id, &name, &symbol, &total_supply);

        let mint_amount = 100_000_0000000; // 10% of total
        client.mint(&user, &mint_amount, &1000);

        let percentage = client.get_ownership_percentage(&user);
        assert_eq!(percentage, 1000); // 1000 basis points = 10%
    }
}
