#![no_std]

use soroban_sdk::{contract, contractimpl, Address, BytesN, Env, Symbol, Vec};
use stellar_property_errors::Error;
use stellar_property_events as events;
use stellar_property_storage::{self as storage, DataKey};

// SECURITY: Maximum deployed contracts to track
const MAX_DEPLOYED_CONTRACTS: u32 = 10000;

#[contract]
pub struct DeployerContract;

#[contractimpl]
impl DeployerContract {
    /// Initialize the deployer contract
    pub fn initialize(env: Env, admin: Address) -> Result<(), Error> {
        if storage::is_initialized(&env) {
            return Err(Error::AlreadyInitialized);
        }

        admin.require_auth();

        storage::set_admin(&env, &admin);
        storage::set_initialized(&env);

        Ok(())
    }

    /// Set the WASM hash for PropertyToken contract
    pub fn set_property_token_wasm(env: Env, wasm_hash: BytesN<32>) -> Result<(), Error> {
        let admin = storage::get_admin(&env);
        admin.require_auth();

        env.storage()
            .instance()
            .set(&Symbol::new(&env, "pt_wasm"), &wasm_hash);

        Ok(())
    }

    /// Deploy a new PropertyToken contract
    pub fn deploy_property_token(
        env: Env,
        property_id: Symbol,
        salt: BytesN<32>,
    ) -> Result<Address, Error> {
        let admin = storage::get_admin(&env);
        admin.require_auth();

        // Get WASM hash
        let wasm_hash: BytesN<32> = env
            .storage()
            .instance()
            .get(&Symbol::new(&env, "pt_wasm"))
            .ok_or(Error::InvalidWasmHash)?;

        // Check if already deployed
        let deploy_key = DataKey::PropertyData(property_id.clone());
        if storage::has_persistent(&env, &deploy_key) {
            return Err(Error::ContractAlreadyDeployed);
        }

        // Deploy contract
        let deployed_address = env
            .deployer()
            .with_current_contract(salt)
            .deploy(wasm_hash);

        // Store deployed contract address
        storage::set_persistent(&env, &deploy_key, &deployed_address);

        // Add to deployed contracts list
        let mut deployed_contracts: Vec<Address> = env
            .storage()
            .persistent()
            .get(&Symbol::new(&env, "contracts"))
            .unwrap_or(Vec::new(&env));

        // SECURITY: Enforce maximum deployed contracts
        if deployed_contracts.len() >= MAX_DEPLOYED_CONTRACTS {
            return Err(Error::InvalidAmount); // Reusing error code
        }

        deployed_contracts.push_back(deployed_address.clone());

        env.storage()
            .persistent()
            .set(&Symbol::new(&env, "contracts"), &deployed_contracts);

        // Emit event
        events::contract_deployed(&env, deployed_address.clone(), admin);

        Ok(deployed_address)
    }

    /// Deploy any contract with initialization parameters
    pub fn deploy_with_init(
        env: Env,
        wasm_hash: BytesN<32>,
        salt: BytesN<32>,
    ) -> Result<Address, Error> {
        let admin = storage::get_admin(&env);
        admin.require_auth();

        // Deploy contract
        let deployed_address = env
            .deployer()
            .with_current_contract(salt)
            .deploy(wasm_hash);

        // Add to deployed contracts list
        let mut deployed_contracts: Vec<Address> = env
            .storage()
            .persistent()
            .get(&Symbol::new(&env, "contracts"))
            .unwrap_or(Vec::new(&env));

        // SECURITY: Enforce maximum deployed contracts
        if deployed_contracts.len() >= MAX_DEPLOYED_CONTRACTS {
            return Err(Error::InvalidAmount); // Reusing error code
        }

        deployed_contracts.push_back(deployed_address.clone());

        env.storage()
            .persistent()
            .set(&Symbol::new(&env, "contracts"), &deployed_contracts);

        // Emit event
        events::contract_deployed(&env, deployed_address.clone(), admin);

        Ok(deployed_address)
    }

    // ========== VIEW FUNCTIONS ==========

    /// Get all deployed contracts
    pub fn get_deployed_contracts(env: Env) -> Vec<Address> {
        env.storage()
            .persistent()
            .get(&Symbol::new(&env, "contracts"))
            .unwrap_or(Vec::new(&env))
    }

    /// Get deployed contract address by property ID
    pub fn get_property_token_address(env: Env, property_id: Symbol) -> Option<Address> {
        let deploy_key = DataKey::PropertyData(property_id);
        storage::get_persistent(&env, &deploy_key)
    }

    /// Get count of deployed contracts
    pub fn get_deployed_count(env: Env) -> u32 {
        let contracts: Vec<Address> = env
            .storage()
            .persistent()
            .get(&Symbol::new(&env, "contracts"))
            .unwrap_or(Vec::new(&env));

        contracts.len()
    }

    /// Get contract admin
    pub fn admin(env: Env) -> Address {
        storage::get_admin(&env)
    }

    /// Get PropertyToken WASM hash
    pub fn get_property_token_wasm(env: Env) -> Option<BytesN<32>> {
        env.storage()
            .instance()
            .get(&Symbol::new(&env, "pt_wasm"))
    }
}

#[cfg(test)]
mod test {
    use super::*;
    use soroban_sdk::{testutils::Address as _, Address, BytesN, Env, Symbol};

    #[test]
    fn test_initialize() {
        let env = Env::default();
        let contract_id = env.register_contract(None, DeployerContract);
        let client = DeployerContractClient::new(&env, &contract_id);

        let admin = Address::generate(&env);
        client.initialize(&admin);

        assert_eq!(client.admin(), admin);
    }

    #[test]
    fn test_set_and_get_wasm_hash() {
        let env = Env::default();
        env.mock_all_auths();

        let contract_id = env.register_contract(None, DeployerContract);
        let client = DeployerContractClient::new(&env, &contract_id);

        let admin = Address::generate(&env);
        client.initialize(&admin);

        let wasm_hash = BytesN::from_array(&env, &[1u8; 32]);
        client.set_property_token_wasm(&wasm_hash);

        let stored_hash = client.get_property_token_wasm();
        assert!(stored_hash.is_some());
        assert_eq!(stored_hash.unwrap(), wasm_hash);
    }

    #[test]
    fn test_deploy_count() {
        let env = Env::default();
        let contract_id = env.register_contract(None, DeployerContract);
        let client = DeployerContractClient::new(&env, &contract_id);

        let admin = Address::generate(&env);
        client.initialize(&admin);

        assert_eq!(client.get_deployed_count(), 0);

        let deployed_contracts = client.get_deployed_contracts();
        assert_eq!(deployed_contracts.len(), 0);
    }

    #[test]
    #[should_panic(expected = "Error(InvalidWasmHash)")]
    fn test_deploy_without_wasm_hash() {
        let env = Env::default();
        env.mock_all_auths();

        let contract_id = env.register_contract(None, DeployerContract);
        let client = DeployerContractClient::new(&env, &contract_id);

        let admin = Address::generate(&env);
        client.initialize(&admin);

        // Try to deploy without setting WASM hash
        let property_id = Symbol::new(&env, "PROP001");
        let salt = BytesN::from_array(&env, &[0u8; 32]);

        client.deploy_property_token(&property_id, &salt);
    }
}
