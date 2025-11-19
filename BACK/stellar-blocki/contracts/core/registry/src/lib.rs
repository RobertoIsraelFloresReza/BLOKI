#![no_std]

use soroban_sdk::{contract, contractimpl, contracttype, Address, BytesN, Env, String, Symbol, Vec};
use stellar_property_errors::Error;
use stellar_property_events as events;
use stellar_property_storage::{self as storage, DataKey};

// SECURITY: Maximum ownership history records per property to prevent unbounded storage
const MAX_OWNERSHIP_HISTORY: u32 = 5000;
// SECURITY: Maximum number of concurrent owners per property
const MAX_CONCURRENT_OWNERS: u32 = 100;

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct PropertyMetadata {
    pub property_id: Symbol,
    pub address: String,
    pub valuation: i128,
    pub legal_id: String,
    pub verified: bool,
    pub verification_date: u64,
    pub token_contract: Address,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct OwnershipRecord {
    pub timestamp: u64,
    pub owner: Address,
    pub percentage: i128,
    pub tx_hash: BytesN<32>,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct OwnerInfo {
    pub owner: Address,
    pub percentage: i128,
}

#[contract]
pub struct OwnershipRegistryContract;

#[contractimpl]
impl OwnershipRegistryContract {
    /// Initialize the registry contract
    pub fn initialize(env: Env, admin: Address) -> Result<(), Error> {
        if storage::is_initialized(&env) {
            return Err(Error::AlreadyInitialized);
        }

        admin.require_auth();

        storage::set_admin(&env, &admin);
        storage::set_initialized(&env);

        Ok(())
    }

    /// Register a new property in the registry
    pub fn register_property(
        env: Env,
        property_id: Symbol,
        owner: Address,
        address: String,
        valuation: i128,
        legal_id: String,
        token_contract: Address,
    ) -> Result<(), Error> {
        let admin = storage::get_admin(&env);
        admin.require_auth();

        // Check if property already exists
        if storage::has_persistent(&env, &DataKey::PropertyMetadata(property_id.clone())) {
            return Err(Error::PropertyAlreadyExists);
        }

        if valuation <= 0 {
            return Err(Error::InvalidPropertyData);
        }

        // Create property metadata
        let metadata = PropertyMetadata {
            property_id: property_id.clone(),
            address,
            valuation,
            legal_id,
            verified: false, // Initially not verified
            verification_date: 0,
            token_contract: token_contract.clone(),
        };

        // Store property metadata
        storage::set_persistent(&env, &DataKey::PropertyMetadata(property_id.clone()), &metadata);

        // Create initial ownership record
        let initial_record = OwnershipRecord {
            timestamp: env.ledger().timestamp(),
            owner: owner.clone(),
            percentage: 10000, // 100% (in basis points)
            tx_hash: BytesN::from_array(&env, &[0u8; 32]), // Placeholder
        };

        // Store ownership history (initially just owner with 100%)
        let mut history = Vec::new(&env);
        history.push_back(initial_record);
        storage::set_persistent(&env, &DataKey::OwnershipHistory(property_id.clone()), &history);

        // Emit event
        events::property_registered(&env, property_id, owner, valuation);

        Ok(())
    }

    /// Verify a property (only admin)
    pub fn verify_property(env: Env, property_id: Symbol) -> Result<(), Error> {
        let admin = storage::get_admin(&env);
        admin.require_auth();

        // Get property metadata
        let mut metadata: PropertyMetadata = storage::get_persistent(
            &env,
            &DataKey::PropertyMetadata(property_id.clone()),
        )
        .ok_or(Error::PropertyNotFound)?;

        // Update verification status
        metadata.verified = true;
        metadata.verification_date = env.ledger().timestamp();

        // Store updated metadata
        storage::set_persistent(&env, &DataKey::PropertyMetadata(property_id), &metadata);

        Ok(())
    }

    /// Update ownership after a transfer (called by marketplace or admin)
    pub fn update_ownership(
        env: Env,
        property_id: Symbol,
        new_holders: Vec<OwnerInfo>,
    ) -> Result<(), Error> {
        // Allow both admin and marketplace to update ownership
        // In production, verify caller is authorized marketplace contract
        // For now, anyone can call this (marketplace will be the primary caller)

        // Verify property exists
        if !storage::has_persistent(&env, &DataKey::PropertyMetadata(property_id.clone())) {
            return Err(Error::PropertyNotFound);
        }

        // SECURITY: Validate number of concurrent owners
        if new_holders.len() > MAX_CONCURRENT_OWNERS {
            return Err(Error::InvalidOwnershipData);
        }

        // Validate total percentage = 100% with checked arithmetic
        let mut total_percentage: i128 = 0;
        for holder in new_holders.iter() {
            total_percentage = total_percentage.checked_add(holder.percentage)
                .ok_or(Error::InvalidPercentage)?;
        }

        if total_percentage != 10000 {
            return Err(Error::InvalidPercentage);
        }

        // Get existing history
        let mut history: Vec<OwnershipRecord> = storage::get_persistent(
            &env,
            &DataKey::OwnershipHistory(property_id.clone()),
        )
        .unwrap_or(Vec::new(&env));

        // Add new records
        let current_time = env.ledger().timestamp();
        for holder in new_holders.iter() {
            // SECURITY: Enforce maximum history with FIFO eviction
            if history.len() >= MAX_OWNERSHIP_HISTORY {
                // Remove oldest record when limit reached
                history.remove(0);
            }

            let record = OwnershipRecord {
                timestamp: current_time,
                owner: holder.owner.clone(),
                percentage: holder.percentage,
                tx_hash: BytesN::from_array(&env, &[0u8; 32]), // Placeholder
            };
            history.push_back(record);

            // Emit event for each new owner
            events::ownership_updated(&env, property_id.clone(), holder.owner.clone(), holder.percentage);
        }

        // Store updated history
        storage::set_persistent(&env, &DataKey::OwnershipHistory(property_id), &history);

        Ok(())
    }

    /// Record a legal document hash for a property
    pub fn record_legal_document(
        env: Env,
        property_id: Symbol,
        document_hash: BytesN<32>,
    ) -> Result<(), Error> {
        let admin = storage::get_admin(&env);
        admin.require_auth();

        // Verify property exists
        if !storage::has_persistent(&env, &DataKey::PropertyMetadata(property_id.clone())) {
            return Err(Error::PropertyNotFound);
        }

        // Store document hash
        storage::set_persistent(&env, &DataKey::DocumentHash(property_id.clone()), &document_hash);

        // Emit event
        events::document_recorded(&env, property_id, document_hash.to_array());

        Ok(())
    }

    // ========== VIEW FUNCTIONS ==========

    /// Verify ownership of a property by an address
    pub fn verify_ownership(env: Env, property_id: Symbol, user: Address) -> (bool, i128) {
        // Get ownership history
        let history: Option<Vec<OwnershipRecord>> =
            storage::get_persistent(&env, &DataKey::OwnershipHistory(property_id));

        if history.is_none() {
            return (false, 0);
        }

        let history = history.unwrap();

        // Find most recent record for user
        let mut percentage: i128 = 0;
        let mut found = false;

        for i in (0..history.len()).rev() {
            let record = history.get(i).unwrap();
            if record.owner == user {
                percentage = record.percentage;
                found = true;
                break;
            }
        }

        (found, percentage)
    }

    /// Get current property owners with their percentages
    pub fn get_property_owners(env: Env, property_id: Symbol) -> Vec<OwnerInfo> {
        let history: Vec<OwnershipRecord> = storage::get_persistent(
            &env,
            &DataKey::OwnershipHistory(property_id),
        )
        .unwrap_or(Vec::new(&env));

        // Get unique owners with their latest percentages
        let mut owners = Vec::new(&env);
        let mut seen_owners: Vec<Address> = Vec::new(&env);

        // Iterate from most recent to oldest
        for i in (0..history.len()).rev() {
            let record = history.get(i).unwrap();

            // Check if we've already seen this owner
            let mut already_seen = false;
            for j in 0..seen_owners.len() {
                if seen_owners.get(j).unwrap() == record.owner {
                    already_seen = true;
                    break;
                }
            }

            if !already_seen && record.percentage > 0 {
                seen_owners.push_back(record.owner.clone());
                owners.push_back(OwnerInfo {
                    owner: record.owner,
                    percentage: record.percentage,
                });
            }
        }

        owners
    }

    /// Get full ownership history for a property
    pub fn get_property_history(env: Env, property_id: Symbol) -> Vec<OwnershipRecord> {
        storage::get_persistent(&env, &DataKey::OwnershipHistory(property_id))
            .unwrap_or(Vec::new(&env))
    }

    /// Get property metadata
    pub fn get_property_metadata(env: Env, property_id: Symbol) -> Result<PropertyMetadata, Error> {
        storage::get_persistent(&env, &DataKey::PropertyMetadata(property_id))
            .ok_or(Error::PropertyNotFound)
    }

    /// Get legal document hash for a property
    pub fn get_document_hash(env: Env, property_id: Symbol) -> Option<BytesN<32>> {
        storage::get_persistent(&env, &DataKey::DocumentHash(property_id))
    }

    /// Check if property is verified
    pub fn is_verified(env: Env, property_id: Symbol) -> Result<bool, Error> {
        let metadata: PropertyMetadata =
            storage::get_persistent(&env, &DataKey::PropertyMetadata(property_id))
                .ok_or(Error::PropertyNotFound)?;

        Ok(metadata.verified)
    }

    /// Get contract admin
    pub fn admin(env: Env) -> Address {
        storage::get_admin(&env)
    }
}

#[cfg(test)]
mod test {
    use super::*;
    use soroban_sdk::{testutils::Address as _, Address, BytesN, Env, String, Symbol};

    #[test]
    fn test_initialize() {
        let env = Env::default();
        let contract_id = env.register_contract(None, OwnershipRegistryContract);
        let client = OwnershipRegistryContractClient::new(&env, &contract_id);

        let admin = Address::generate(&env);
        client.initialize(&admin);

        assert_eq!(client.admin(), admin);
    }

    #[test]
    fn test_register_property() {
        let env = Env::default();
        env.mock_all_auths();

        let contract_id = env.register_contract(None, OwnershipRegistryContract);
        let client = OwnershipRegistryContractClient::new(&env, &contract_id);

        let admin = Address::generate(&env);
        let owner = Address::generate(&env);
        let token_contract = Address::generate(&env);

        client.initialize(&admin);

        let property_id = Symbol::new(&env, "PROP001");
        let address = String::from_str(&env, "123 Main St, CDMX");
        let valuation = 5_000_000_0000000; // $5M
        let legal_id = String::from_str(&env, "REG-2024-001");

        client.register_property(
            &property_id,
            &owner,
            &address,
            &valuation,
            &legal_id,
            &token_contract,
        );

        // Verify property was registered
        let metadata = client.get_property_metadata(&property_id);
        assert_eq!(metadata.property_id, property_id);
        assert_eq!(metadata.valuation, valuation);
        assert_eq!(metadata.verified, false);

        // Check ownership
        let (is_owner, percentage) = client.verify_ownership(&property_id, &owner);
        assert!(is_owner);
        assert_eq!(percentage, 10000); // 100%
    }

    #[test]
    fn test_verify_property() {
        let env = Env::default();
        env.mock_all_auths();

        let contract_id = env.register_contract(None, OwnershipRegistryContract);
        let client = OwnershipRegistryContractClient::new(&env, &contract_id);

        let admin = Address::generate(&env);
        let owner = Address::generate(&env);
        let token_contract = Address::generate(&env);

        client.initialize(&admin);

        let property_id = Symbol::new(&env, "PROP001");
        client.register_property(
            &property_id,
            &owner,
            &String::from_str(&env, "Address"),
            &5_000_000_0000000,
            &String::from_str(&env, "LEGAL-001"),
            &token_contract,
        );

        // Initially not verified
        assert_eq!(client.is_verified(&property_id), false);

        // Verify property
        client.verify_property(&property_id);

        // Now verified
        assert_eq!(client.is_verified(&property_id), true);
    }

    #[test]
    fn test_update_ownership() {
        let env = Env::default();
        env.mock_all_auths();

        let contract_id = env.register_contract(None, OwnershipRegistryContract);
        let client = OwnershipRegistryContractClient::new(&env, &contract_id);

        let admin = Address::generate(&env);
        let owner1 = Address::generate(&env);
        let owner2 = Address::generate(&env);
        let token_contract = Address::generate(&env);

        client.initialize(&admin);

        let property_id = Symbol::new(&env, "PROP001");
        client.register_property(
            &property_id,
            &owner1,
            &String::from_str(&env, "Address"),
            &5_000_000_0000000,
            &String::from_str(&env, "LEGAL-001"),
            &token_contract,
        );

        // Update ownership: owner1 75%, owner2 25%
        let mut new_holders = Vec::new(&env);
        new_holders.push_back(OwnerInfo {
            owner: owner1.clone(),
            percentage: 7500,
        });
        new_holders.push_back(OwnerInfo {
            owner: owner2.clone(),
            percentage: 2500,
        });

        client.update_ownership(&property_id, &new_holders);

        // Verify new ownership
        let (is_owner1, percentage1) = client.verify_ownership(&property_id, &owner1);
        assert!(is_owner1);
        assert_eq!(percentage1, 7500);

        let (is_owner2, percentage2) = client.verify_ownership(&property_id, &owner2);
        assert!(is_owner2);
        assert_eq!(percentage2, 2500);
    }

    #[test]
    fn test_record_legal_document() {
        let env = Env::default();
        env.mock_all_auths();

        let contract_id = env.register_contract(None, OwnershipRegistryContract);
        let client = OwnershipRegistryContractClient::new(&env, &contract_id);

        let admin = Address::generate(&env);
        let owner = Address::generate(&env);
        let token_contract = Address::generate(&env);

        client.initialize(&admin);

        let property_id = Symbol::new(&env, "PROP001");
        client.register_property(
            &property_id,
            &owner,
            &String::from_str(&env, "Address"),
            &5_000_000_0000000,
            &String::from_str(&env, "LEGAL-001"),
            &token_contract,
        );

        // Record document
        let doc_hash = BytesN::from_array(&env, &[1u8; 32]);
        client.record_legal_document(&property_id, &doc_hash);

        // Verify document was recorded
        let stored_hash = client.get_document_hash(&property_id);
        assert!(stored_hash.is_some());
        assert_eq!(stored_hash.unwrap(), doc_hash);
    }

    #[test]
    fn test_get_property_owners() {
        let env = Env::default();
        env.mock_all_auths();

        let contract_id = env.register_contract(None, OwnershipRegistryContract);
        let client = OwnershipRegistryContractClient::new(&env, &contract_id);

        let admin = Address::generate(&env);
        let owner1 = Address::generate(&env);
        let owner2 = Address::generate(&env);
        let token_contract = Address::generate(&env);

        client.initialize(&admin);

        let property_id = Symbol::new(&env, "PROP001");
        client.register_property(
            &property_id,
            &owner1,
            &String::from_str(&env, "Address"),
            &5_000_000_0000000,
            &String::from_str(&env, "LEGAL-001"),
            &token_contract,
        );

        // Update with multiple owners
        let mut new_holders = Vec::new(&env);
        new_holders.push_back(OwnerInfo {
            owner: owner1.clone(),
            percentage: 6000,
        });
        new_holders.push_back(OwnerInfo {
            owner: owner2.clone(),
            percentage: 4000,
        });

        client.update_ownership(&property_id, &new_holders);

        // Get all owners
        let owners = client.get_property_owners(&property_id);
        assert_eq!(owners.len(), 2);
    }
}
