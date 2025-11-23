pragma circom 2.0.0;

include "./node_modules/circomlib/circuits/poseidon.circom";
include "./node_modules/circomlib/circuits/comparators.circom";

/**
 * Accredited Investor Verification Circuit
 *
 * This circuit proves that an investor meets accredited investor criteria
 * without revealing their exact financial details.
 *
 * Accredited investor criteria (simplified):
 *   - Annual income >= $200,000 (individual) or $300,000 (joint), OR
 *   - Net worth >= $1,000,000 (excluding primary residence)
 *
 * Private inputs:
 *   - investorId: Unique identifier for the investor
 *   - annualIncome: Annual income in USD (7 decimals)
 *   - netWorth: Net worth in USD (7 decimals)
 *   - userSecret: Secret known only to the user
 *   - isJointIncome: 1 if joint income, 0 if individual
 *
 * Public outputs:
 *   - nullifier: Prevents proof reuse
 *   - commitment: Commitment to accredited status
 *   - isAccredited: Boolean indicating if investor is accredited
 */
template AccreditedInvestor() {
    // Private inputs (sensitive financial data)
    signal input investorId;
    signal input annualIncome;      // USD with 7 decimals (e.g., 2500000000000 = $250,000)
    signal input netWorth;          // USD with 7 decimals
    signal input userSecret;
    signal input isJointIncome;     // 1 = joint, 0 = individual

    // Public outputs
    signal output nullifier;
    signal output commitment;
    signal output isAccredited;

    // Constants (with 7 decimals)
    var INDIVIDUALINCOMETHRESHOLD = 2000000000000;  // $200,000
    var JOINTINCOMETHRESHOLD = 3000000000000;       // $300,000
    var NETWORTHTHRESHOLD = 10000000000000;         // $1,000,000

    // Intermediate signals
    signal incomeThreshold;
    signal meetsIncomeRequirement;
    signal meetsNetWorthRequirement;
    signal isJoint;

    // Determine income threshold based on joint status
    // incomeThreshold = isJointIncome * JOINT + (1 - isJointIncome) * INDIVIDUAL
    isJoint <== isJointIncome;
    incomeThreshold <== isJoint * JOINTINCOMETHRESHOLD + (1 - isJoint) * INDIVIDUALINCOMETHRESHOLD;

    // Check if income meets threshold
    component incomeCheck = GreaterEqThan(64);
    incomeCheck.in[0] <== annualIncome;
    incomeCheck.in[1] <== incomeThreshold;
    meetsIncomeRequirement <== incomeCheck.out;

    // Check if net worth meets threshold
    component netWorthCheck = GreaterEqThan(64);
    netWorthCheck.in[0] <== netWorth;
    netWorthCheck.in[1] <== NETWORTHTHRESHOLD;
    meetsNetWorthRequirement <== netWorthCheck.out;

    // Investor is accredited if EITHER condition is met (OR logic)
    // OR can be implemented as: A OR B = A + B - A*B
    isAccredited <== meetsIncomeRequirement + meetsNetWorthRequirement - (meetsIncomeRequirement * meetsNetWorthRequirement);

    // Generate commitment (binds all private inputs)
    component commitmentHasher = Poseidon(5);
    commitmentHasher.inputs[0] <== investorId;
    commitmentHasher.inputs[1] <== annualIncome;
    commitmentHasher.inputs[2] <== netWorth;
    commitmentHasher.inputs[3] <== userSecret;
    commitmentHasher.inputs[4] <== isJointIncome;
    commitment <== commitmentHasher.out;

    // Generate nullifier (prevents reuse)
    component nullifierHasher = Poseidon(2);
    nullifierHasher.inputs[0] <== investorId;
    nullifierHasher.inputs[1] <== userSecret;
    nullifier <== nullifierHasher.out;

    // Constraint: Must be accredited to generate valid proof
    isAccredited === 1;
}

component main = AccreditedInvestor();
