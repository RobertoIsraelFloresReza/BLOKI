# Cargo-Fuzz Setup Guide for Blocki Smart Contracts

## Prerequisites

```bash
# Install cargo-fuzz
cargo install cargo-fuzz

# Install nightly Rust (required for fuzzing)
rustup install nightly
rustup default nightly
```

## Setup for Each Contract

### 1. PropertyToken Fuzzing

```bash
cd contracts/core/property-token

# Initialize cargo-fuzz (creates fuzz/ directory)
cargo fuzz init

# This creates:
# - fuzz/Cargo.toml
# - fuzz/fuzz_targets/fuzz_target_1.rs
```

**Create fuzz target:** `fuzz/fuzz_targets/fuzz_mint.rs`
```rust
#![no_main]
use libfuzzer_sys::fuzz_target;
use property_token::{PropertyTokenContract, PropertyTokenContractClient};
use soroban_sdk::{testutils::Address as _, Address, Env, String, Symbol};

fuzz_target!(|data: &[u8]| {
    if data.len() < 16 { return; }

    let env = Env::default();
    env.mock_all_auths();

    let contract_id = env.register_contract(None, PropertyTokenContract);
    let client = PropertyTokenContractClient::new(&env, &contract_id);

    let admin = Address::generate(&env);
    let user = Address::generate(&env);

    // Initialize
    let property_id = Symbol::new(&env, "FUZZ");
    let name = String::from_str(&env, "Fuzz Token");
    let symbol = String::from_str(&env, "FUZZ");
    let total_supply = 1_000_000_0000000i128;

    let _ = client.try_initialize(&admin, &property_id, &name, &symbol, &total_supply);

    // Fuzz mint parameters from input data
    let amount = i128::from_le_bytes(data[0..16].try_into().unwrap());
    let percentage = (amount % 10001).abs(); // 0-10000 basis points

    // Try to mint with fuzzed values
    let _ = client.try_mint(&user, &amount, &percentage);
});
```

**Run fuzzing:**
```bash
cargo +nightly fuzz run fuzz_mint -- -max_total_time=300  # 5 minutes
```

---

### 2. Marketplace Fuzzing

**Create fuzz target:** `fuzz/fuzz_targets/fuzz_buy.rs`
```rust
#![no_main]
use libfuzzer_sys::fuzz_target;
use marketplace::{MarketplaceContract, MarketplaceContractClient};
use soroban_sdk::{testutils::Address as _, token, Address, Env};

fuzz_target!(|data: &[u8]| {
    if data.len() < 32 { return; }

    let env = Env::default();
    env.mock_all_auths();

    let contract_id = env.register_contract(None, MarketplaceContract);
    let client = MarketplaceContractClient::new(&env, &contract_id);

    // Setup
    let admin = Address::generate(&env);
    let escrow = Address::generate(&env);
    let registry = Address::generate(&env);

    let _ = client.try_initialize(&admin, &escrow, &registry);

    // Fuzz buy parameters
    let listing_id = u64::from_le_bytes(data[0..8].try_into().unwrap());
    let amount = i128::from_le_bytes(data[8..24].try_into().unwrap());

    let buyer = Address::generate(&env);
    let usdc = Address::generate(&env);

    // Try to buy with fuzzed values
    let _ = client.try_buy_tokens(&buyer, &listing_id, &amount, &usdc);
});
```

---

### 3. Escrow Fuzzing

**Create fuzz target:** `fuzz/fuzz_targets/fuzz_timeout.rs`
```rust
#![no_main]
use libfuzzer_sys::fuzz_target;
use escrow::{EscrowContract, EscrowContractClient};
use soroban_sdk::{testutils::Address as _, Address, Env};

fuzz_target!(|data: &[u8]| {
    if data.len() < 24 { return; }

    let env = Env::default();
    env.mock_all_auths();

    let contract_id = env.register_contract(None, EscrowContract);
    let client = EscrowContractClient::new(&env, &contract_id);

    let admin = Address::generate(&env);
    let usdc = Address::generate(&env);
    let marketplace = Address::generate(&env);

    let _ = client.try_initialize(&admin, &usdc, &marketplace);

    // Fuzz escrow parameters
    let amount = i128::from_le_bytes(data[0..16].try_into().unwrap());
    let timeout = u64::from_le_bytes(data[16..24].try_into().unwrap());

    let buyer = Address::generate(&env);
    let seller = Address::generate(&env);

    // Try to lock funds with fuzzed timeout
    let _ = client.try_lock_funds(&buyer, &seller, &amount, &1, &timeout);
});
```

---

### 4. Registry Fuzzing

**Create fuzz target:** `fuzz/fuzz_targets/fuzz_ownership.rs`
```rust
#![no_main]
use libfuzzer_sys::fuzz_target;
use registry::{OwnershipRegistryContract, OwnershipRegistryContractClient, OwnerInfo};
use soroban_sdk::{testutils::Address as _, Address, Env, Symbol, Vec};

fuzz_target!(|data: &[u8]| {
    if data.len() < 32 { return; }

    let env = Env::default();
    env.mock_all_auths();

    let contract_id = env.register_contract(None, OwnershipRegistryContract);
    let client = OwnershipRegistryContractClient::new(&env, &contract_id);

    let admin = Address::generate(&env);
    let _ = client.try_initialize(&admin);

    // Register property first
    let property_id = Symbol::new(&env, "PROP001");
    let owner = Address::generate(&env);

    // Fuzz ownership percentages
    let num_owners = (data.len() / 16).min(10); // Max 10 owners for fuzzing
    let mut holders = Vec::new(&env);

    for i in 0..num_owners {
        let offset = i * 16;
        if offset + 16 > data.len() { break; }

        let percentage = i128::from_le_bytes(data[offset..offset+16].try_into().unwrap())
            .abs() % 10001;

        holders.push_back(OwnerInfo {
            owner: Address::generate(&env),
            percentage,
        });
    }

    // Try to update ownership with fuzzed percentages
    let _ = client.try_update_ownership(&property_id, &holders);
});
```

---

### 5. Deployer Fuzzing

**Create fuzz target:** `fuzz/fuzz_targets/fuzz_deploy.rs`
```rust
#![no_main]
use libfuzzer_sys::fuzz_target;
use deployer::{DeployerContract, DeployerContractClient};
use soroban_sdk::{testutils::Address as _, Address, BytesN, Env, Symbol};

fuzz_target!(|data: &[u8]| {
    if data.len() < 64 { return; }

    let env = Env::default();
    env.mock_all_auths();

    let contract_id = env.register_contract(None, DeployerContract);
    let client = DeployerContractClient::new(&env, &contract_id);

    let admin = Address::generate(&env);
    let _ = client.try_initialize(&admin);

    // Fuzz WASM hash and salt
    let wasm_hash = BytesN::from_array(&env, &data[0..32].try_into().unwrap());
    let salt = BytesN::from_array(&env, &data[32..64].try_into().unwrap());

    let _ = client.try_set_property_token_wasm(&wasm_hash);

    // Try to deploy with fuzzed salt
    let property_id = Symbol::new(&env, "FUZZ");
    let _ = client.try_deploy_property_token(&property_id, &salt);
});
```

---

## Running All Fuzz Tests

**Script to run all fuzz tests for 5 minutes each:**

```bash
#!/bin/bash
# run_all_fuzz.sh

CONTRACTS=(
    "property-token:fuzz_mint"
    "marketplace:fuzz_buy"
    "escrow:fuzz_timeout"
    "registry:fuzz_ownership"
    "deployer:fuzz_deploy"
)

for contract_target in "${CONTRACTS[@]}"; do
    IFS=':' read -r contract target <<< "$contract_target"

    echo "========================================="
    echo "Fuzzing: $contract - $target"
    echo "========================================="

    cd "contracts/core/$contract" || continue

    cargo +nightly fuzz run "$target" -- \
        -max_total_time=300 \
        -rss_limit_mb=4096 \
        -timeout=10

    cd ../../..
done

echo "All fuzzing completed!"
```

**Make executable and run:**
```bash
chmod +x run_all_fuzz.sh
./run_all_fuzz.sh
```

---

## Fuzzing Best Practices

### 1. Corpus Management
```bash
# Minimize corpus after fuzzing
cargo fuzz cmin fuzz_mint

# Merge multiple corpora
cargo fuzz cmin fuzz_mint corpus1 corpus2
```

### 2. Coverage Analysis
```bash
# Generate coverage report
cargo fuzz coverage fuzz_mint

# View coverage with llvm-cov
llvm-cov show target/x86_64-unknown-linux-gnu/release/fuzz_mint \
    --format=html \
    -instr-profile=fuzz/coverage/fuzz_mint/coverage.profdata \
    > coverage.html
```

### 3. Continuous Fuzzing
```bash
# Run fuzzing continuously with multiple jobs
cargo fuzz run fuzz_mint -jobs=8 -- -max_total_time=0
```

### 4. Finding and Reproducing Crashes
```bash
# If fuzzing finds a crash, it saves to fuzz/artifacts/
# Reproduce crash:
cargo fuzz run fuzz_mint fuzz/artifacts/fuzz_mint/crash-xyz

# Debug crash:
cargo fuzz run fuzz_mint fuzz/artifacts/fuzz_mint/crash-xyz --debug
```

---

## Expected Results

After 5 minutes of fuzzing per contract, you should see:

```
#123456: cov: 1234 ft: 5678 corp: 42 exec/s: 1234 rss: 256Mb
DONE: 300 runs in 300 seconds
```

**Key Metrics:**
- `cov`: Code coverage (number of edges covered)
- `ft`: Features (unique code paths)
- `corp`: Corpus size (interesting inputs saved)
- `exec/s`: Executions per second
- `rss`: Memory usage

**Success Criteria:**
- ✅ No crashes or panics found
- ✅ Coverage >80% of public functions
- ✅ All arithmetic operations tested with edge cases
- ✅ All error paths triggered

---

## Integration with CI/CD

**GitHub Actions example:**

```yaml
name: Fuzz Testing

on:
  schedule:
    - cron: '0 0 * * 0'  # Weekly
  workflow_dispatch:

jobs:
  fuzz:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions-rs/toolchain@v1
        with:
          toolchain: nightly
          override: true

      - name: Install cargo-fuzz
        run: cargo install cargo-fuzz

      - name: Run fuzzing tests
        run: |
          cd contracts/core/property-token
          cargo +nightly fuzz run fuzz_mint -- -max_total_time=300

      - name: Upload artifacts
        if: failure()
        uses: actions/upload-artifact@v3
        with:
          name: fuzz-artifacts
          path: fuzz/artifacts/
```

---

## Notes

1. **WASM Target Limitation:** Fuzzing requires native compilation (x86_64), not wasm32-unknown-unknown. Fuzz targets are separate from contract code.

2. **Memory Limits:** Set appropriate RSS limits based on available RAM:
   ```bash
   cargo fuzz run target -- -rss_limit_mb=4096
   ```

3. **Deterministic Fuzzing:** Use `-seed` for reproducible fuzzing:
   ```bash
   cargo fuzz run target -- -seed=12345
   ```

4. **Dictionary Files:** Create dictionaries for better fuzzing:
   ```
   # fuzz/fuzz_targets/fuzz_mint.dict
   "PROP001"
   "10000"
   "0"
   "-1"
   ```

   Use with: `cargo fuzz run target -- -dict=fuzz_mint.dict`

---

## Troubleshooting

**Issue:** "error: no such subcommand: fuzz"
**Solution:** Install cargo-fuzz and use nightly Rust

**Issue:** "Address sanitizer error"
**Solution:** Reduce RSS limit or increase available memory

**Issue:** "Too many open files"
**Solution:** Increase file descriptor limit:
```bash
ulimit -n 4096
```

**Issue:** Fuzzing is slow
**Solution:**
- Use release mode: `cargo fuzz run --release target`
- Increase jobs: `cargo fuzz run target -jobs=4`
- Use faster dictionary

---

**Configuration completed. Ready for fuzzing execution.**
