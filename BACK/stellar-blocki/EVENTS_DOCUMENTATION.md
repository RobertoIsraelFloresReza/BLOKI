# Smart Contract Events Documentation

This document describes all events emitted by the Stellar Property Tokenization smart contracts for indexer integration.

## PropertyToken Contract Events

Contract ID: `CBFAXO5UUXHXCSJW63E4LTZPHWTRCAVJIUGJOHU23EAW2I2IATE2XZKF`

### Transfer Event
**Topic**: `transfer`
**Emitted when**: Tokens are transferred between addresses
```rust
topics: (symbol_short!("transfer"), from: Address, to: Address)
data: amount: i128
```

### Mint Event
**Topic**: `mint`
**Emitted when**: New tokens are minted to an address
```rust
topics: (symbol_short!("mint"), to: Address)
data: amount: i128
```

### Burn Event
**Topic**: `burn`
**Emitted when**: Tokens are burned from an address
```rust
topics: (symbol_short!("burn"), from: Address)
data: amount: i128
```

---

## Escrow Contract Events

Contract ID: `CARJ2AEKS5PLMF6BNHZKPRGX2VJT5JG7BDOPYHQIGQY4WI7JL2ALWBLS`

### Funds Locked Event
**Topic**: `esc_lock`
**Emitted when**: Funds are locked in escrow
```rust
topics: (symbol_short!("esc_lock"), escrow_id: u64, buyer: Address)
data: amount: i128
```

### Funds Released Event
**Topic**: `esc_rel`
**Emitted when**: Escrow funds are released to seller
```rust
topics: (symbol_short!("esc_rel"), escrow_id: u64, seller: Address)
data: amount: i128
```

### Funds Refunded Event
**Topic**: `esc_ref`
**Emitted when**: Escrow funds are refunded to buyer
```rust
topics: (symbol_short!("esc_ref"), escrow_id: u64, buyer: Address)
data: amount: i128
```

---

## Registry Contract Events

Contract ID: `CDLPZNUOIUPA3G4NZHZ6MWJ4LOVSGJ5XMNKGQLOLDSJYKMFCUPX5ZKR4`

### Property Registered Event
**Topic**: `prop_reg`
**Emitted when**: A new property is registered
```rust
topics: (symbol_short!("prop_reg"), property_id: Symbol, owner: Address)
data: valuation: i128
```

### Ownership Updated Event
**Topic**: `own_upd`
**Emitted when**: Property ownership is updated
```rust
topics: (symbol_short!("own_upd"), property_id: Symbol, new_owner: Address)
data: percentage: i128
```

### Document Recorded Event
**Topic**: `doc_rec`
**Emitted when**: A legal document hash is recorded
```rust
topics: (symbol_short!("doc_rec"), property_id: Symbol)
data: document_hash: [u8; 32]
```

---

## Marketplace Contract Events

Contract ID: `CATAB6XXHBTB3UTHBYB4T2W6FDFCDRNLNISYTPSKEXWL7AUG3PALB4NV`

### Listing Created Event
**Topic**: `list_new`
**Emitted when**: A new listing is created
```rust
topics: (symbol_short!("list_new"), listing_id: u64, seller: Address)
data: (token: Address, amount: i128, price: i128)
```

### Tokens Purchased Event
**Topic**: `purchase`
**Emitted when**: Tokens are purchased from a listing
```rust
topics: (symbol_short!("purchase"), listing_id: u64, buyer: Address)
data: (seller: Address, amount: i128, price: i128)
```

### Listing Cancelled Event
**Topic**: `list_cncl`
**Emitted when**: A listing is cancelled
```rust
topics: (symbol_short!("list_cncl"), listing_id: u64)
data: seller: Address
```

---

## Deployer Contract Events

Contract ID: `CB5W6PUHE6OT2PQK2PC4XU5OMEQXNFEW4AVXBBH7IHT2LBJJFEX4OXPQ`

### Contract Deployed Event
**Topic**: `deployed`
**Emitted when**: A new contract is deployed
```rust
topics: (symbol_short!("deployed"), contract_id: Address)
data: deployer: Address
```

---

## Indexer Integration Notes

### Event Monitoring Strategy

1. **Subscribe to all contracts** listed above
2. **Filter by topics** to identify event types
3. **Parse data fields** according to type specifications
4. **Track ledger sequences** for proper ordering

### Key Data to Index

#### PropertyToken Contract
- All transfers for transaction history
- Mints for tokenization events
- Burns for token destruction

#### Escrow Contract
- Locked funds for pending transactions
- Released/Refunded status for transaction completion

#### Registry Contract
- Property registrations for property catalog
- Ownership updates for ownership tracking
- Document hashes for legal compliance

#### Marketplace Contract
- Active listings for marketplace UI
- Purchase events for transaction history
- Price data for analytics

### Example SubQuery Mapping

```typescript
// project.yaml
dataSources:
  - kind: substrate/Soroban
    startBlock: <deployment_block>
    mapping:
      handlers:
        - handler: handleTransfer
          kind: substrate/EventHandler
          filter:
            contractId: CBFAXO5UUXHXCSJW63E4LTZPHWTRCAVJIUGJOHU23EAW2I2IATE2XZKF
            topics:
              - transfer

        - handler: handleListingCreated
          kind: substrate/EventHandler
          filter:
            contractId: CATAB6XXHBTB3UTHBYB4T2W6FDFCDRNLNISYTPSKEXWL7AUG3PALB4NV
            topics:
              - list_new
```

### GraphQL Schema Suggestions

```graphql
type PropertyToken @entity {
  id: ID!
  propertyId: String!
  totalSupply: BigInt!
  holders: [TokenHolder!]! @derivedFrom(field: "token")
}

type TokenHolder @entity {
  id: ID!
  token: PropertyToken!
  address: String!
  balance: BigInt!
  percentage: Int!
}

type Transfer @entity {
  id: ID!
  token: PropertyToken!
  from: String!
  to: String!
  amount: BigInt!
  timestamp: BigInt!
  blockNumber: BigInt!
  txHash: String!
}

type MarketplaceListing @entity {
  id: ID!
  listingId: BigInt!
  seller: String!
  token: PropertyToken!
  amount: BigInt!
  pricePerToken: BigInt!
  status: ListingStatus!
  createdAt: BigInt!
}

enum ListingStatus {
  ACTIVE
  COMPLETED
  CANCELLED
}

type Purchase @entity {
  id: ID!
  listing: MarketplaceListing!
  buyer: String!
  seller: String!
  amount: BigInt!
  totalPrice: BigInt!
  timestamp: BigInt!
}

type Property @entity {
  id: ID!
  propertyId: String!
  owner: String!
  valuation: BigInt!
  verified: Boolean!
  tokenContract: PropertyToken
}
```

---

## Testing Events

To test event emission on testnet:

```bash
# Listen to events for a specific contract
stellar events --start-ledger <ledger> --id <CONTRACT_ID>

# Example: Listen to PropertyToken events
stellar events --start-ledger latest --id CBFAXO5UUXHXCSJW63E4LTZPHWTRCAVJIUGJOHU23EAW2I2IATE2XZKF
```

---

## Notes for Backend Integration

- All contract IDs are available in `.env.contracts`
- TypeScript bindings generated in `service-blocki/packages/`
- Events are automatically emitted by contracts, no manual triggering needed
- Monitor events in real-time via Soroban RPC subscription
