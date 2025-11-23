#!/bin/bash

###############################################################################
# ZK Circuits Build and Trusted Setup Script
#
# This script compiles Circom circuits and executes the trusted setup ceremony
# for generating proving and verification keys using Groth16.
#
# Prerequisites:
#   - Node.js >= 18
#   - circom compiler
#   - snarkjs
#
# Usage:
#   ./build.sh [circuit_name]
#
# Examples:
#   ./build.sh kyc_verification
#   ./build.sh all  # Build all circuits
###############################################################################

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Directories
CIRCUITS_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BUILD_DIR="${CIRCUITS_DIR}/build"
TEST_DIR="${CIRCUITS_DIR}/test"

# Powers of Tau parameters
# For testnet: use 12 (supports up to 2^12 = 4096 constraints)
# For production: use 14-16 (supports more constraints)
POT_POWER=12
POT_FILE="pot${POT_POWER}_final.ptau"

# Circuit names
CIRCUITS=("kyc_verification" "accredited_investor" "ownership_proof")

###############################################################################
# Helper Functions
###############################################################################

print_header() {
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}  $1${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_info() {
    echo -e "${YELLOW}ℹ $1${NC}"
}

check_dependencies() {
    print_header "Checking Dependencies"

    # Check Node.js
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed"
        exit 1
    fi
    print_success "Node.js: $(node --version)"

    # Check circom
    if ! command -v circom &> /dev/null; then
        print_error "circom is not installed"
        print_info "Install with: npm install -g circom"
        exit 1
    fi
    print_success "circom: $(circom --version)"

    # Check snarkjs
    if ! command -v snarkjs &> /dev/null; then
        print_error "snarkjs is not installed"
        print_info "Install with: npm install -g snarkjs"
        exit 1
    fi
    print_success "snarkjs installed"

    echo ""
}

setup_directories() {
    print_header "Setting Up Directories"

    mkdir -p "${BUILD_DIR}"
    mkdir -p "${TEST_DIR}"

    print_success "Build directory: ${BUILD_DIR}"
    print_success "Test directory: ${TEST_DIR}"
    echo ""
}

powers_of_tau() {
    print_header "Powers of Tau Ceremony (Phase 1)"

    if [ -f "${BUILD_DIR}/${POT_FILE}" ]; then
        print_info "Powers of Tau file already exists, skipping..."
        return
    fi

    print_info "Generating Powers of Tau for 2^${POT_POWER} constraints..."

    # Start Powers of Tau ceremony
    snarkjs powersoftau new bn128 ${POT_POWER} "${BUILD_DIR}/pot${POT_POWER}_0000.ptau" -v

    # First contribution (in production, this would be distributed)
    print_info "Adding first contribution..."
    snarkjs powersoftau contribute \
        "${BUILD_DIR}/pot${POT_POWER}_0000.ptau" \
        "${BUILD_DIR}/pot${POT_POWER}_0001.ptau" \
        --name="First contribution" \
        -v -e="$(date +%s)random-entropy-$(openssl rand -hex 32)"

    # Prepare phase 2
    print_info "Preparing phase 2..."
    snarkjs powersoftau prepare phase2 \
        "${BUILD_DIR}/pot${POT_POWER}_0001.ptau" \
        "${BUILD_DIR}/${POT_FILE}" \
        -v

    # Verify the final ptau
    print_info "Verifying Powers of Tau..."
    snarkjs powersoftau verify "${BUILD_DIR}/${POT_FILE}"

    # Cleanup intermediate files
    rm -f "${BUILD_DIR}/pot${POT_POWER}_0000.ptau"
    rm -f "${BUILD_DIR}/pot${POT_POWER}_0001.ptau"

    print_success "Powers of Tau ceremony completed!"
    echo ""
}

compile_circuit() {
    local circuit_name=$1

    print_header "Compiling Circuit: ${circuit_name}"

    local circuit_file="${CIRCUITS_DIR}/${circuit_name}.circom"

    if [ ! -f "${circuit_file}" ]; then
        print_error "Circuit file not found: ${circuit_file}"
        return 1
    fi

    print_info "Compiling ${circuit_name}.circom..."

    # Compile circuit to R1CS, WASM, and generate witness calculator
    circom "${circuit_file}" \
        --r1cs \
        --wasm \
        --sym \
        --c \
        -o "${BUILD_DIR}" \
        -l "${CIRCUITS_DIR}/../node_modules"

    print_success "Circuit compiled successfully!"

    # Print circuit info
    print_info "Circuit information:"
    snarkjs r1cs info "${BUILD_DIR}/${circuit_name}.r1cs"

    echo ""
}

trusted_setup() {
    local circuit_name=$1

    print_header "Trusted Setup (Phase 2): ${circuit_name}"

    # Check if Powers of Tau file exists
    if [ ! -f "${BUILD_DIR}/${POT_FILE}" ]; then
        print_error "Powers of Tau file not found. Run Powers of Tau ceremony first."
        return 1
    fi

    print_info "Generating initial zkey..."
    snarkjs groth16 setup \
        "${BUILD_DIR}/${circuit_name}.r1cs" \
        "${BUILD_DIR}/${POT_FILE}" \
        "${BUILD_DIR}/${circuit_name}_0000.zkey"

    # Second contribution (circuit-specific)
    print_info "Adding circuit-specific contribution..."
    snarkjs zkey contribute \
        "${BUILD_DIR}/${circuit_name}_0000.zkey" \
        "${BUILD_DIR}/${circuit_name}_final.zkey" \
        --name="Second contribution" \
        -v -e="$(date +%s)more-random-entropy-$(openssl rand -hex 32)"

    # Export verification key
    print_info "Exporting verification key..."
    snarkjs zkey export verificationkey \
        "${BUILD_DIR}/${circuit_name}_final.zkey" \
        "${BUILD_DIR}/${circuit_name}_verification_key.json"

    # Verify the zkey
    print_info "Verifying zkey..."
    snarkjs zkey verify \
        "${BUILD_DIR}/${circuit_name}.r1cs" \
        "${BUILD_DIR}/${POT_FILE}" \
        "${BUILD_DIR}/${circuit_name}_final.zkey"

    # Export Solidity verifier (for reference)
    print_info "Generating Solidity verifier (reference)..."
    snarkjs zkey export solidityverifier \
        "${BUILD_DIR}/${circuit_name}_final.zkey" \
        "${BUILD_DIR}/${circuit_name}_verifier.sol"

    # Cleanup intermediate files
    rm -f "${BUILD_DIR}/${circuit_name}_0000.zkey"

    print_success "Trusted setup completed for ${circuit_name}!"
    echo ""
}

generate_test_proof() {
    local circuit_name=$1

    print_header "Generating Test Proof: ${circuit_name}"

    print_info "Creating test input..."

    # Create test input based on circuit type
    case ${circuit_name} in
        kyc_verification)
            cat > "${BUILD_DIR}/input_test.json" <<EOF
{
  "kycId": "123456789",
  "kycStatus": "1",
  "userSecret": "987654321",
  "kycTimestamp": "$(date +%s)"
}
EOF
            ;;
        accredited_investor)
            cat > "${BUILD_DIR}/input_test.json" <<EOF
{
  "investorId": "123456789",
  "annualIncome": "2500000000000",
  "netWorth": "15000000000000",
  "userSecret": "987654321",
  "isJointIncome": "0"
}
EOF
            ;;
        ownership_proof)
            cat > "${BUILD_DIR}/input_test.json" <<EOF
{
  "ownerId": "123456789",
  "tokenBalance": "10000000000",
  "userSecret": "987654321",
  "balanceTimestamp": "$(date +%s)",
  "minBalance": "1000000000",
  "tokenAddress": "111111111"
}
EOF
            ;;
    esac

    print_info "Generating witness..."
    node "${BUILD_DIR}/${circuit_name}_js/generate_witness.js" \
        "${BUILD_DIR}/${circuit_name}_js/${circuit_name}.wasm" \
        "${BUILD_DIR}/input_test.json" \
        "${BUILD_DIR}/witness.wtns"

    print_info "Generating proof..."
    snarkjs groth16 prove \
        "${BUILD_DIR}/${circuit_name}_final.zkey" \
        "${BUILD_DIR}/witness.wtns" \
        "${BUILD_DIR}/proof_test.json" \
        "${BUILD_DIR}/public_test.json"

    print_info "Verifying proof..."
    snarkjs groth16 verify \
        "${BUILD_DIR}/${circuit_name}_verification_key.json" \
        "${BUILD_DIR}/public_test.json" \
        "${BUILD_DIR}/proof_test.json"

    print_success "Test proof generated and verified successfully!"
    echo ""
}

build_circuit() {
    local circuit_name=$1

    compile_circuit "${circuit_name}"
    trusted_setup "${circuit_name}"
    generate_test_proof "${circuit_name}"
}

build_all() {
    print_header "Building All Circuits"

    for circuit in "${CIRCUITS[@]}"; do
        build_circuit "${circuit}"
    done

    print_success "All circuits built successfully!"
}

###############################################################################
# Main Execution
###############################################################################

main() {
    echo ""
    print_header "ZK Circuits Build Script"
    echo ""

    check_dependencies
    setup_directories
    powers_of_tau

    if [ $# -eq 0 ] || [ "$1" == "all" ]; then
        build_all
    else
        build_circuit "$1"
    fi

    print_header "Build Summary"
    echo ""
    echo "Built files location: ${BUILD_DIR}"
    echo ""
    echo "Key files:"
    for circuit in "${CIRCUITS[@]}"; do
        if [ -f "${BUILD_DIR}/${circuit}_final.zkey" ]; then
            echo -e "  ${GREEN}✓${NC} ${circuit}:"
            echo "    - ${BUILD_DIR}/${circuit}.wasm"
            echo "    - ${BUILD_DIR}/${circuit}_final.zkey"
            echo "    - ${BUILD_DIR}/${circuit}_verification_key.json"
        fi
    done
    echo ""

    print_success "ZK Circuits build completed successfully!"
    echo ""
}

# Run main function
main "$@"
