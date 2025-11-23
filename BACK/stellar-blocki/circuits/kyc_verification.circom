pragma circom 2.0.0;

include "./node_modules/circomlib/circuits/poseidon.circom";
include "./node_modules/circomlib/circuits/comparators.circom";

/**
 * KYC Verification Circuit
 *
 * This circuit proves that a user has passed KYC verification
 * without revealing their identity or KYC details.
 *
 * Private inputs:
 *   - kycId: Unique identifier for the KYC record
 *   - kycStatus: Status of KYC (1 = approved, 0 = rejected)
 *   - userSecret: Secret known only to the user
 *   - kycTimestamp: When KYC was approved
 *
 * Public outputs:
 *   - nullifier: Prevents proof reuse (hash of kycId + userSecret)
 *   - commitment: Commitment to KYC status (hash of all private inputs)
 *   - isValid: Boolean indicating if KYC is valid (1 = valid)
 */
template KYCVerification() {
    // Private inputs (sensitive data - not revealed on-chain)
    signal input kycId;
    signal input kycStatus;      // 1 = approved, 0 = rejected
    signal input userSecret;
    signal input kycTimestamp;

    // Public outputs (visible on-chain)
    signal output nullifier;
    signal output commitment;
    signal output isValid;

    // Intermediate signals
    signal kycApproved;

    // Constraint 1: KYC must be approved (status = 1)
    component isApproved = IsEqual();
    isApproved.in[0] <== kycStatus;
    isApproved.in[1] <== 1;
    kycApproved <== isApproved.out;

    // Constraint 2: Timestamp must be positive (valid)
    component isPositive = GreaterThan(64);
    isPositive.in[0] <== kycTimestamp;
    isPositive.in[1] <== 0;

    // Constraint 3: KYC must be both approved AND have valid timestamp
    isValid <== kycApproved * isPositive.out;

    // Generate commitment (binds all private inputs together)
    component commitmentHasher = Poseidon(4);
    commitmentHasher.inputs[0] <== kycId;
    commitmentHasher.inputs[1] <== kycStatus;
    commitmentHasher.inputs[2] <== userSecret;
    commitmentHasher.inputs[3] <== kycTimestamp;
    commitment <== commitmentHasher.out;

    // Generate nullifier (prevents double-spending/reuse of proof)
    // Nullifier = hash(kycId, userSecret)
    component nullifierHasher = Poseidon(2);
    nullifierHasher.inputs[0] <== kycId;
    nullifierHasher.inputs[1] <== userSecret;
    nullifier <== nullifierHasher.out;

    // Additional constraint: Force valid proof (isValid must be 1)
    isValid === 1;
}

component main = KYCVerification();
