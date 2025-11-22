#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, Address, Env, String, Symbol, Vec, Map};

// Simple USDC Mock token for testnet
// This implements a basic token contract for testing purposes only

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct AllowanceDataKey {
    pub from: Address,
    pub spender: Address,
}

#[contracttype]
pub enum DataKey {
    Admin,
    Name,
    Symbol,
    Decimals,
    TotalSupply,
    Balance(Address),
    Allowance(AllowanceDataKey),
}

#[contract]
pub struct UsdcMockToken;

#[contractimpl]
impl UsdcMockToken {
    /// Initialize the USDC mock token
    pub fn initialize(env: Env, admin: Address, name: String, symbol: String, decimals: u32) {
        if env.storage().instance().has(&DataKey::Admin) {
            panic!("Already initialized");
        }

        env.storage().instance().set(&DataKey::Admin, &admin);
        env.storage().instance().set(&DataKey::Name, &name);
        env.storage().instance().set(&DataKey::Symbol, &symbol);
        env.storage().instance().set(&DataKey::Decimals, &decimals);
        env.storage().persistent().set(&DataKey::TotalSupply, &0i128);
    }

    /// Mint tokens to any address (for testing only!)
    pub fn mint(env: Env, to: Address, amount: i128) {
        if amount <= 0 {
            panic!("Amount must be positive");
        }

        // Update balance
        let balance = Self::balance(env.clone(), to.clone());
        let new_balance = balance + amount;
        env.storage().persistent().set(&DataKey::Balance(to.clone()), &new_balance);

        // Update total supply
        let total_supply: i128 = env.storage().persistent().get(&DataKey::TotalSupply).unwrap_or(0);
        env.storage().persistent().set(&DataKey::TotalSupply, &(total_supply + amount));

        // Emit event
        env.events().publish((Symbol::new(&env, "mint"), to), amount);
    }

    /// Get balance of an address
    pub fn balance(env: Env, id: Address) -> i128 {
        env.storage()
            .persistent()
            .get(&DataKey::Balance(id))
            .unwrap_or(0)
    }

    /// Approve spender to use tokens
    pub fn approve(env: Env, from: Address, spender: Address, amount: i128, expiration_ledger: u32) {
        from.require_auth();

        let key = DataKey::Allowance(AllowanceDataKey {
            from: from.clone(),
            spender: spender.clone(),
        });

        env.storage().persistent().set(&key, &amount);
        env.storage().persistent().extend_ttl(&key, expiration_ledger, expiration_ledger);

        env.events().publish((Symbol::new(&env, "approve"), from, spender), amount);
    }

    /// Get allowance
    pub fn allowance(env: Env, from: Address, spender: Address) -> i128 {
        let key = DataKey::Allowance(AllowanceDataKey { from, spender });
        env.storage().persistent().get(&key).unwrap_or(0)
    }

    /// Transfer tokens from one address to another
    pub fn transfer(env: Env, from: Address, to: Address, amount: i128) {
        from.require_auth();

        if amount <= 0 {
            panic!("Amount must be positive");
        }

        let from_balance = Self::balance(env.clone(), from.clone());
        if from_balance < amount {
            panic!("Insufficient balance");
        }

        let to_balance = Self::balance(env.clone(), to.clone());

        env.storage().persistent().set(&DataKey::Balance(from.clone()), &(from_balance - amount));
        env.storage().persistent().set(&DataKey::Balance(to.clone()), &(to_balance + amount));

        env.events().publish((Symbol::new(&env, "transfer"), from, to), amount);
    }

    /// Transfer from (using allowance)
    pub fn transfer_from(env: Env, spender: Address, from: Address, to: Address, amount: i128) {
        spender.require_auth();

        if amount <= 0 {
            panic!("Amount must be positive");
        }

        let allowance_key = DataKey::Allowance(AllowanceDataKey {
            from: from.clone(),
            spender: spender.clone(),
        });

        let allowance: i128 = env.storage().persistent().get(&allowance_key).unwrap_or(0);
        if allowance < amount {
            panic!("Insufficient allowance");
        }

        let from_balance = Self::balance(env.clone(), from.clone());
        if from_balance < amount {
            panic!("Insufficient balance");
        }

        let to_balance = Self::balance(env.clone(), to.clone());

        // Update balances
        env.storage().persistent().set(&DataKey::Balance(from.clone()), &(from_balance - amount));
        env.storage().persistent().set(&DataKey::Balance(to.clone()), &(to_balance + amount));

        // Update allowance
        env.storage().persistent().set(&allowance_key, &(allowance - amount));

        env.events().publish((Symbol::new(&env, "transfer"), from, to), amount);
    }

    /// Get token name
    pub fn name(env: Env) -> String {
        env.storage()
            .instance()
            .get(&DataKey::Name)
            .unwrap_or(String::from_str(&env, "USDC Mock"))
    }

    /// Get token symbol
    pub fn symbol(env: Env) -> String {
        env.storage()
            .instance()
            .get(&DataKey::Symbol)
            .unwrap_or(String::from_str(&env, "USDC"))
    }

    /// Get token decimals
    pub fn decimals(env: Env) -> u32 {
        env.storage()
            .instance()
            .get(&DataKey::Decimals)
            .unwrap_or(7)
    }

    /// Get total supply
    pub fn total_supply(env: Env) -> i128 {
        env.storage().persistent().get(&DataKey::TotalSupply).unwrap_or(0)
    }

    /// Get admin address
    pub fn admin(env: Env) -> Address {
        env.storage().instance().get(&DataKey::Admin).unwrap()
    }
}
