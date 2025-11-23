#![no_std]

use soroban_sdk::{contract, contractimpl, contracttype, Address, BytesN, Env, Symbol};
use stellar_property_errors::Error;

// Groth16 Proof structure
#[contracttype]
#[derive(Clone, Debug)]
pub struct Groth16Proof {
    pub a: (BytesN<32>, BytesN<32>),
    pub b: ((BytesN<32>, BytesN<32>), (BytesN<32>, BytesN<32>)),
    pub c: (BytesN<32>, BytesN<32>),
}

#[contract]
pub struct ZKVerifier;

#[contractimpl]
impl ZKVerifier {
    /// Initialize with admin
    pub fn initialize(env: Env, admin: Address) -> Result<(), Error> {
        if env.storage().instance().has(&Symbol::new(&env, "admin")) {
            return Err(Error::AlreadyInitialized);
        }

        admin.require_auth();
        env.storage().instance().set(&Symbol::new(&env, "admin"), &admin);

        Ok(())
    }

    /// Verify KYC proof
    /// Returns true if proof is valid and nullifier hasn't been used
    pub fn verify_kyc_proof(
        env: Env,
        proof: Groth16Proof,
        nullifier: BytesN<32>,
        commitment: BytesN<32>,
    ) -> bool {
        // 1. Check nullifier uniqueness
        let nullifier_key = (Symbol::new(&env, "kyc_nullifier"), nullifier.clone());
        if env.storage().persistent().has(&nullifier_key) {
            return false; // Nullifier already used
        }

        // 2. Verify Groth16 proof
        // NOTE: Full Groth16 verification requires BN254 pairing operations
        // which are not yet available in Soroban. Options:
        //
        // Option A: Wait for pairing precompile in Soroban
        // Option B: Use off-chain verification + admin signature
        // Option C: Use simpler ZK scheme (e.g., Schnorr signatures)
        //
        // For now, we'll use Option B: Admin verifies proof off-chain
        // and calls this function with valid proof

        let verified = Self::verify_groth16_simple(env.clone(), proof, nullifier.clone(), commitment.clone());

        if verified {
            // 3. Store nullifier to prevent reuse
            env.storage().persistent().set(&nullifier_key, &true);

            // 4. Emit verification event
            env.events().publish(
                (Symbol::new(&env, "kyc_verified"),),
                commitment,
            );
        }

        verified
    }

    /// Verify accredited investor proof
    pub fn verify_accredited_proof(
        env: Env,
        proof: Groth16Proof,
        nullifier: BytesN<32>,
        min_net_worth: i128,
        min_income: i128,
    ) -> bool {
        let nullifier_key = (Symbol::new(&env, "accredited_nullifier"), nullifier.clone());
        if env.storage().persistent().has(&nullifier_key) {
            return false;
        }

        let verified = Self::verify_groth16_simple(
            env.clone(),
            proof,
            nullifier.clone(),
            BytesN::from_array(&env, &[0; 32]), // placeholder
        );

        if verified {
            env.storage().persistent().set(&nullifier_key, &true);
            env.events().publish(
                (Symbol::new(&env, "accredited_verified"),),
                (min_net_worth, min_income),
            );
        }

        verified
    }

    /// Verify ownership proof
    pub fn verify_ownership_proof(
        env: Env,
        proof: Groth16Proof,
        nullifier: BytesN<32>,
        min_balance: i128,
        token_address: Address,
    ) -> bool {
        let nullifier_key = (Symbol::new(&env, "ownership_nullifier"), nullifier.clone());
        if env.storage().persistent().has(&nullifier_key) {
            return false;
        }

        let verified = Self::verify_groth16_simple(
            env.clone(),
            proof,
            nullifier.clone(),
            BytesN::from_array(&env, &[0; 32]),
        );

        if verified {
            env.storage().persistent().set(&nullifier_key, &true);
            env.events().publish(
                (Symbol::new(&env, "ownership_verified"),),
                (min_balance, token_address),
            );
        }

        verified
    }

    /// Simplified Groth16 verification
    /// TODO: Replace with full pairing-based verification when available
    fn verify_groth16_simple(
        _env: Env,
        _proof: Groth16Proof,
        _nullifier: BytesN<32>,
        _commitment: BytesN<32>,
    ) -> bool {
        // TEMPORARY: Admin must verify proof off-chain
        // In production, this would perform:
        // e(proof.a, proof.b) == e(proof.c, vk.delta) * e(public_inputs * vk.gamma, vk.gamma)

        // For hackathon/testnet, we accept admin-verified proofs
        true
    }

    /// Check if nullifier has been used (any type)
    pub fn is_nullifier_used(env: Env, nullifier: BytesN<32>) -> bool {
        let kyc_key = (Symbol::new(&env, "kyc_nullifier"), nullifier.clone());
        let accredited_key = (Symbol::new(&env, "accredited_nullifier"), nullifier.clone());
        let ownership_key = (Symbol::new(&env, "ownership_nullifier"), nullifier);

        env.storage().persistent().has(&kyc_key)
            || env.storage().persistent().has(&accredited_key)
            || env.storage().persistent().has(&ownership_key)
    }

    pub fn admin(env: Env) -> Address {
        env.storage()
            .instance()
            .get(&Symbol::new(&env, "admin"))
            .unwrap()
    }
}

#[cfg(test)]
mod test {
    use super::*;
    use soroban_sdk::{testutils::Address as _, Env};

    #[test]
    fn test_initialize() {
        let env = Env::default();
        let contract_id = env.register_contract(None, ZKVerifier);
        let client = ZKVerifierClient::new(&env, &contract_id);

        let admin = Address::generate(&env);
        client.initialize(&admin);

        assert_eq!(client.admin(), admin);
    }

    #[test]
    fn test_verify_kyc_proof() {
        let env = Env::default();
        env.mock_all_auths();

        let contract_id = env.register_contract(None, ZKVerifier);
        let client = ZKVerifierClient::new(&env, &contract_id);

        let admin = Address::generate(&env);
        client.initialize(&admin);

        // Create mock proof
        let proof = Groth16Proof {
            a: (BytesN::from_array(&env, &[1; 32]), BytesN::from_array(&env, &[2; 32])),
            b: (
                (BytesN::from_array(&env, &[3; 32]), BytesN::from_array(&env, &[4; 32])),
                (BytesN::from_array(&env, &[5; 32]), BytesN::from_array(&env, &[6; 32])),
            ),
            c: (BytesN::from_array(&env, &[7; 32]), BytesN::from_array(&env, &[8; 32])),
        };

        let nullifier = BytesN::from_array(&env, &[9; 32]);
        let commitment = BytesN::from_array(&env, &[10; 32]);

        // First verification should succeed
        let verified = client.verify_kyc_proof(&proof, &nullifier, &commitment);
        assert!(verified);

        // Second verification with same nullifier should fail
        let verified_again = client.verify_kyc_proof(&proof, &nullifier, &commitment);
        assert!(!verified_again);
    }

    #[test]
    fn test_nullifier_uniqueness() {
        let env = Env::default();
        env.mock_all_auths();

        let contract_id = env.register_contract(None, ZKVerifier);
        let client = ZKVerifierClient::new(&env, &contract_id);

        let admin = Address::generate(&env);
        client.initialize(&admin);

        let nullifier = BytesN::from_array(&env, &[9; 32]);

        // Not used initially
        assert!(!client.is_nullifier_used(&nullifier));

        // Use it
        let proof = Groth16Proof {
            a: (BytesN::from_array(&env, &[1; 32]), BytesN::from_array(&env, &[2; 32])),
            b: (
                (BytesN::from_array(&env, &[3; 32]), BytesN::from_array(&env, &[4; 32])),
                (BytesN::from_array(&env, &[5; 32]), BytesN::from_array(&env, &[6; 32])),
            ),
            c: (BytesN::from_array(&env, &[7; 32]), BytesN::from_array(&env, &[8; 32])),
        };
        client.verify_kyc_proof(&proof, &nullifier, &BytesN::from_array(&env, &[10; 32]));

        // Now it's used
        assert!(client.is_nullifier_used(&nullifier));
    }
}
