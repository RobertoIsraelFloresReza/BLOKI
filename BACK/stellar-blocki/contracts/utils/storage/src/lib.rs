#![no_std]
use soroban_sdk::{contracttype, Address, Env, Symbol};

// SECURITY: Production-grade TTL settings
// Persistent storage should last ~1 year minimum (17M ledgers = ~330 days)
const PERSISTENT_TTL_THRESHOLD: u32 = 518400;  // ~30 days (when to extend)
const PERSISTENT_TTL_EXTENSION: u32 = 17280000; // ~1000 days (extend to)

// Storage keys for different data types
#[derive(Clone)]
#[contracttype]
pub enum DataKey {
    // Instance storage (small, rarely changing)
    Admin,
    Initialized,

    // Persistent storage (user balances, ownerships)
    Balance(Address),
    Allowance(Address, Address), // (owner, spender)
    TotalMinted,                 // Total tokens minted
    OwnersList,                  // List of all token owners

    // Property storage
    PropertyData(Symbol),
    PropertyOwners(Symbol),

    // Marketplace storage
    Listing(u64),
    ListingCounter,
    MarketplaceAddress,          // Authorized marketplace contract

    // Escrow storage
    Escrow(u64),
    EscrowCounter,

    // Registry storage
    PropertyMetadata(Symbol),
    OwnershipHistory(Symbol),
    DocumentHash(Symbol),
}

// Instance Storage Helpers (for admin, config - small data)
pub fn set_admin(env: &Env, admin: &Address) {
    env.storage().instance().set(&DataKey::Admin, admin);
}

pub fn get_admin(env: &Env) -> Address {
    env.storage().instance().get(&DataKey::Admin).unwrap()
}

pub fn has_admin(env: &Env) -> bool {
    env.storage().instance().has(&DataKey::Admin)
}

pub fn set_initialized(env: &Env) {
    env.storage().instance().set(&DataKey::Initialized, &true);
}

pub fn is_initialized(env: &Env) -> bool {
    env.storage().instance().has(&DataKey::Initialized)
}

// Persistent Storage Helpers (for balances, ownership - bounded data)
pub fn set_balance(env: &Env, address: &Address, amount: i128) {
    let key = DataKey::Balance(address.clone());
    env.storage().persistent().set(&key, &amount);
    env.storage().persistent().extend_ttl(&key, PERSISTENT_TTL_THRESHOLD, PERSISTENT_TTL_EXTENSION);
}

pub fn get_balance(env: &Env, address: &Address) -> i128 {
    let key = DataKey::Balance(address.clone());
    env.storage().persistent().get(&key).unwrap_or(0)
}

pub fn set_allowance(env: &Env, owner: &Address, spender: &Address, amount: i128) {
    let key = DataKey::Allowance(owner.clone(), spender.clone());
    env.storage().persistent().set(&key, &amount);
    env.storage().persistent().extend_ttl(&key, PERSISTENT_TTL_THRESHOLD, PERSISTENT_TTL_EXTENSION);
}

pub fn get_allowance(env: &Env, owner: &Address, spender: &Address) -> i128 {
    let key = DataKey::Allowance(owner.clone(), spender.clone());
    env.storage().persistent().get(&key).unwrap_or(0)
}

// Counter helpers (for listings, escrows)
pub fn get_and_increment_counter(env: &Env, key: DataKey) -> u64 {
    let counter: u64 = env.storage().persistent().get(&key).unwrap_or(0);
    env.storage().persistent().set(&key, &(counter + 1));
    counter
}

// Generic persistent storage helpers
pub fn set_persistent<T: soroban_sdk::IntoVal<Env, soroban_sdk::Val> + soroban_sdk::TryFromVal<Env, soroban_sdk::Val>>(
    env: &Env,
    key: &DataKey,
    value: &T,
) {
    env.storage().persistent().set(key, value);
    env.storage().persistent().extend_ttl(key, PERSISTENT_TTL_THRESHOLD, PERSISTENT_TTL_EXTENSION);
}

pub fn get_persistent<T: soroban_sdk::TryFromVal<Env, soroban_sdk::Val>>(
    env: &Env,
    key: &DataKey,
) -> Option<T> {
    env.storage().persistent().get(key)
}

pub fn has_persistent(env: &Env, key: &DataKey) -> bool {
    env.storage().persistent().has(key)
}

pub fn remove_persistent(env: &Env, key: &DataKey) {
    env.storage().persistent().remove(key);
}

// Temporary storage helpers (for caching, short-lived data)
pub fn set_temporary<T: soroban_sdk::IntoVal<Env, soroban_sdk::Val>>(
    env: &Env,
    key: &DataKey,
    value: &T,
    ttl: u32,
) {
    env.storage().temporary().set(key, value);
    env.storage().temporary().extend_ttl(key, ttl, ttl + 100);
}

pub fn get_temporary<T: soroban_sdk::TryFromVal<Env, soroban_sdk::Val>>(
    env: &Env,
    key: &DataKey,
) -> Option<T> {
    env.storage().temporary().get(key)
}
