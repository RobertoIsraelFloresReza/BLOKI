#![no_std]

use soroban_sdk::{contract, contractimpl, contracttype, Address, Env, Symbol, Vec};
use stellar_property_errors::Error;
use stellar_property_storage::{self as storage, DataKey};

/// Price data structure from Redstone Oracle
#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct PriceData {
    pub asset: Symbol,
    pub price: i128,       // 7 decimals precision (1.0000000 = 10000000)
    pub timestamp: u64,
    pub confidence: u32,   // Basis points (100 = 1%)
}

/// Asset symbols enum
#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum Asset {
    XLM,
    USDC,
    BTC,
    ETH,
}

#[contract]
pub struct OracleConsumer;

#[contractimpl]
impl OracleConsumer {
    /// Initialize the oracle consumer contract
    pub fn initialize(env: Env, admin: Address) -> Result<(), Error> {
        if storage::is_initialized(&env) {
            return Err(Error::AlreadyInitialized);
        }

        admin.require_auth();

        storage::set_admin(&env, &admin);
        storage::set_initialized(&env);

        // Emit initialization event
        env.events().publish(
            (Symbol::new(&env, "oracle_init"),),
            admin,
        );

        Ok(())
    }

    /// Update price data (only admin or authorized oracle relayer)
    pub fn update_price(
        env: Env,
        asset: Symbol,
        price: i128,
        timestamp: u64,
        confidence: u32,
    ) -> Result<(), Error> {
        // Verify admin authorization
        let admin = storage::get_admin(&env);
        admin.require_auth();

        // Validate price data
        if price <= 0 {
            return Err(Error::InvalidAmount);
        }

        if confidence > 10000 {
            // Max 100% confidence
            return Err(Error::InvalidAmount);
        }

        // Create price data
        let price_data = PriceData {
            asset: asset.clone(),
            price,
            timestamp,
            confidence,
        };

        // Store price data in persistent storage
        let key = DataKey::PropertyData(Symbol::new(&env, "price"));
        let asset_key = (key, asset.clone());
        env.storage().persistent().set(&asset_key, &price_data);

        // Extend TTL for 30 days (518400 ledgers at 5s per ledger)
        env.storage().persistent().extend_ttl(&asset_key, 518400, 518400);

        // Emit price update event
        env.events().publish(
            (Symbol::new(&env, "price_updated"),),
            (asset, price, timestamp),
        );

        Ok(())
    }

    /// Get price (returns error if stale > 1 hour)
    pub fn get_price(env: Env, asset: Symbol) -> Result<PriceData, Error> {
        let key = DataKey::PropertyData(Symbol::new(&env, "price"));
        let asset_key = (key, asset.clone());

        match env.storage().persistent().get::<_, PriceData>(&asset_key) {
            Some(price_data) => {
                // Check if price is stale (> 1 hour = 3600 seconds)
                let current_time = env.ledger().timestamp();
                if current_time > price_data.timestamp && (current_time - price_data.timestamp) > 3600 {
                    return Err(Error::StalePrice);
                }
                Ok(price_data)
            }
            None => Err(Error::PriceNotFound),
        }
    }

    /// Get cached price (returns even if stale, for UI display)
    pub fn get_cached_price(env: Env, asset: Symbol) -> Result<PriceData, Error> {
        let key = DataKey::PropertyData(Symbol::new(&env, "price"));
        let asset_key = (key, asset);

        env.storage()
            .persistent()
            .get(&asset_key)
            .ok_or(Error::PriceNotFound)
    }

    /// Get multiple prices at once (returns error if any is stale)
    pub fn get_prices(env: Env, assets: Vec<Symbol>) -> Result<Vec<PriceData>, Error> {
        let mut prices: Vec<PriceData> = Vec::new(&env);

        for asset in assets.iter() {
            let price_data = Self::get_price(env.clone(), asset)?;
            prices.push_back(price_data);
        }

        Ok(prices)
    }

    /// Check if price data exists for an asset
    pub fn has_price(env: Env, asset: Symbol) -> bool {
        let key = DataKey::PropertyData(Symbol::new(&env, "price"));
        let asset_key = (key, asset);
        env.storage().persistent().has(&asset_key)
    }

    /// Get the age of price data in seconds
    pub fn get_price_age(env: Env, asset: Symbol) -> Result<u64, Error> {
        let price_data = Self::get_cached_price(env.clone(), asset)?;
        let current_time = env.ledger().timestamp();

        if current_time >= price_data.timestamp {
            Ok(current_time - price_data.timestamp)
        } else {
            Ok(0)
        }
    }

    /// Convert amount from one asset to another using oracle prices
    pub fn convert_price(
        env: Env,
        from_asset: Symbol,
        to_asset: Symbol,
        amount: i128,
    ) -> Result<i128, Error> {
        let from_price = Self::get_price(env.clone(), from_asset)?;
        let to_price = Self::get_price(env.clone(), to_asset)?;

        // Conversion formula: amount * from_price / to_price
        // Both prices are in 7 decimals, so we need to handle the math carefully
        let converted = (amount * from_price.price) / to_price.price;

        Ok(converted)
    }

    /// Update admin (only current admin)
    pub fn update_admin(env: Env, new_admin: Address) -> Result<(), Error> {
        let current_admin = storage::get_admin(&env);
        current_admin.require_auth();

        storage::set_admin(&env, &new_admin);

        env.events().publish(
            (Symbol::new(&env, "admin_updated"),),
            new_admin,
        );

        Ok(())
    }

    /// Get current admin
    pub fn get_admin(env: Env) -> Address {
        storage::get_admin(&env)
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use soroban_sdk::{testutils::Address as _, Env};

    #[test]
    fn test_initialize() {
        let env = Env::default();
        env.mock_all_auths();

        let admin = Address::generate(&env);
        let contract_id = env.register_contract(None, OracleConsumer);
        let client = OracleConsumerClient::new(&env, &contract_id);

        let result = client.initialize(&admin);
        assert!(result.is_ok());

        assert_eq!(client.get_admin(), admin);
    }

    #[test]
    fn test_update_and_get_price() {
        let env = Env::default();
        env.mock_all_auths();

        let admin = Address::generate(&env);
        let contract_id = env.register_contract(None, OracleConsumer);
        let client = OracleConsumerClient::new(&env, &contract_id);

        client.initialize(&admin);

        // Update XLM price to $0.12
        let asset = Symbol::new(&env, "XLM");
        let price = 1_200_000; // $0.12 with 7 decimals
        let timestamp = env.ledger().timestamp();
        let confidence = 100; // 1%

        let result = client.update_price(&asset, &price, &timestamp, &confidence);
        assert!(result.is_ok());

        // Get price
        let price_data = client.get_price(&asset);
        assert!(price_data.is_ok());

        let data = price_data.unwrap();
        assert_eq!(data.price, price);
        assert_eq!(data.timestamp, timestamp);
        assert_eq!(data.confidence, confidence);
    }

    #[test]
    #[should_panic(expected = "StalePrice")]
    fn test_stale_price_error() {
        let env = Env::default();
        env.mock_all_auths();

        let admin = Address::generate(&env);
        let contract_id = env.register_contract(None, OracleConsumer);
        let client = OracleConsumerClient::new(&env, &contract_id);

        client.initialize(&admin);

        // Update price with old timestamp
        let asset = Symbol::new(&env, "XLM");
        let old_timestamp = env.ledger().timestamp().saturating_sub(7200); // 2 hours ago

        client.update_price(&asset, &1_200_000, &old_timestamp, &100);

        // Should panic because stale
        client.get_price(&asset);
    }

    #[test]
    fn test_cached_price_returns_stale() {
        let env = Env::default();
        env.mock_all_auths();

        let admin = Address::generate(&env);
        let contract_id = env.register_contract(None, OracleConsumer);
        let client = OracleConsumerClient::new(&env, &contract_id);

        client.initialize(&admin);

        // Update price with old timestamp
        let asset = Symbol::new(&env, "XLM");
        let old_timestamp = env.ledger().timestamp().saturating_sub(7200); // 2 hours ago

        client.update_price(&asset, &1_200_000, &old_timestamp, &100);

        // get_cached_price should work even if stale
        let cached = client.get_cached_price(&asset);
        assert!(cached.is_ok());
    }

    #[test]
    fn test_convert_price() {
        let env = Env::default();
        env.mock_all_auths();

        let admin = Address::generate(&env);
        let contract_id = env.register_contract(None, OracleConsumer);
        let client = OracleConsumerClient::new(&env, &contract_id);

        client.initialize(&admin);

        let timestamp = env.ledger().timestamp();

        // Set XLM price to $0.12
        let xlm = Symbol::new(&env, "XLM");
        client.update_price(&xlm, &1_200_000, &timestamp, &100);

        // Set USDC price to $1.00
        let usdc = Symbol::new(&env, "USDC");
        client.update_price(&usdc, &10_000_000, &timestamp, &100);

        // Convert 100 XLM to USDC
        // 100 XLM * $0.12 / $1.00 = 12 USDC
        let amount_xlm = 100_0000000; // 100 XLM with 7 decimals
        let converted = client.convert_price(&xlm, &usdc, &amount_xlm);

        assert!(converted.is_ok());
        // Should be approximately 12 USDC
        let result = converted.unwrap();
        assert!(result > 11_0000000 && result < 13_0000000);
    }
}
