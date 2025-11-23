pragma circom 2.0.0;

include "./node_modules/circomlib/circuits/poseidon.circom";
include "./node_modules/circomlib/circuits/comparators.circom";

/**
 * Ownership Proof Circuit
 *
 * This circuit proves that a user owns a minimum amount of tokens
 * without revealing their exact balance or identity.
 *
 * Use cases:
 *   - Prove ownership of property tokens for voting rights
 *   - Prove minimum stake for governance participation
 *   - Prove eligibility for exclusive features
 *
 * Private inputs:
 *   - ownerId: Unique identifier for the owner
 *   - tokenBalance: Current token balance (with 7 decimals)
 *   - userSecret: Secret known only to the user
 *   - balanceTimestamp: When balance was recorded
 *
 * Public inputs:
 *   - minBalance: Minimum required balance to prove (with 7 decimals)
 *   - tokenAddress: Address hash of the token contract
 *
 * Public outputs:
 *   - nullifier: Prevents proof reuse
 *   - commitment: Commitment to ownership status
 *   - hasMinBalance: Boolean indicating if user has minimum balance
 */
template OwnershipProof() {
    // Private inputs (sensitive ownership data)
    signal input ownerId;
    signal input tokenBalance;        // Balance with 7 decimals
    signal input userSecret;
    signal input balanceTimestamp;

    // Public inputs (verification parameters)
    signal input minBalance;          // Minimum required balance
    signal input tokenAddress;        // Hash of token contract address

    // Public outputs
    signal output nullifier;
    signal output commitment;
    signal output hasMinBalance;

    // Intermediate signals
    signal balanceValid;
    signal timestampValid;

    // Constraint 1: Token balance must be >= minimum required balance
    component balanceCheck = GreaterEqThan(64);
    balanceCheck.in[0] <== tokenBalance;
    balanceCheck.in[1] <== minBalance;
    balanceValid <== balanceCheck.out;

    // Constraint 2: Timestamp must be recent (positive and reasonable)
    component timestampCheck = GreaterThan(64);
    timestampCheck.in[0] <== balanceTimestamp;
    timestampCheck.in[1] <== 0;
    timestampValid <== timestampCheck.out;

    // Constraint 3: Both conditions must be met
    hasMinBalance <== balanceValid * timestampValid;

    // Generate commitment (binds all private inputs + public token address)
    component commitmentHasher = Poseidon(5);
    commitmentHasher.inputs[0] <== ownerId;
    commitmentHasher.inputs[1] <== tokenBalance;
    commitmentHasher.inputs[2] <== userSecret;
    commitmentHasher.inputs[3] <== balanceTimestamp;
    commitmentHasher.inputs[4] <== tokenAddress;
    commitment <== commitmentHasher.out;

    // Generate nullifier (prevents reuse for same token and user)
    // Nullifier includes tokenAddress to allow different proofs for different tokens
    component nullifierHasher = Poseidon(3);
    nullifierHasher.inputs[0] <== ownerId;
    nullifierHasher.inputs[1] <== userSecret;
    nullifierHasher.inputs[2] <== tokenAddress;
    nullifier <== nullifierHasher.out;

    // Constraint: Force valid proof (must have minimum balance)
    hasMinBalance === 1;
}

component main = OwnershipProof();
