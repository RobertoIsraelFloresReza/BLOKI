# Blocki - Democratizing Real Estate Investment on Stellar

---

## 1. Problem Statement

### What real-world problem are you solving?

Real estate investment has historically been inaccessible to most people due to high capital requirements, illiquidity, and geographic barriers. A typical property investment requires hundreds of thousands of dollars, locking out **90% of potential investors** who could benefit from real estate appreciation.

### For whom is this a problem?

- Retail investors in Latin America and emerging markets who want to diversify but lack $100K+ for property down payments.
- Diaspora communities who want to invest in their home countries but face remittance friction and trust issues.
- Property owners who need liquidity but don't want to sell entirely or take predatory loans.

### Why is this problem urgent or important now?

- **Inflation** is eroding savings globally, especially in LATAM where inflation rates exceed 50% annually in some countries.
- Traditional banks offer near-zero interest on savings while property values appreciate **8-15% annually**.
- Cross-border investment is expensive (**3-7% in fees**) and slow (**3-7 days** settlement).
- DeFi and tokenization technology is mature enough to solve this today.

---

## 2. Target User and User Need

### Who is your primary user?

**María**, a 32-year-old software engineer in Buenos Aires earning $2,500/month. She has $5,000 in savings being destroyed by 140% inflation, wants to invest in stable USD-denominated assets, but can't afford a full property and doesn't trust local banks.

### What is their core need or pain point?

- **Access:** Invest in premium real estate with just **$20 - $1,000**.
- **Liquidity:** Buy/sell fractions instantly, not wait months like traditional real estate.
- **Transparency:** See the real ownership percentage on the blockchain, not opaque fund structures.
- **Stability:** Protect savings with USD-pegged assets (USDC) backed by the value of a real property.

### How do they currently solve this?

- **REITs (FIBRAS):** High fees (2-3%), minimum $5K-10K, illiquid, opaque. (**They acquire fund shares, not a direct property percentage.**)
- **Crypto:** Too volatile for risk-averse savers.
- **Nothing:** Most just lose to inflation because barriers are too high.

---

## 3. Solution Overview

### 3.1 Main Idea

Blocki is a Stellar-powered platform that tokenizes premium real estate properties into fractional ownership tokens. This allows anyone to **acquire a percentage of the property's digital value** with as little as **$20 USDC**. Each property is deployed as a **Soroban smart contract** (`PropertyToken`), representing verifiable ownership stakes. Users can browse properties, purchase tokens with USDC via SEP-24 anchors, and trade tokens on a secondary marketplace—all settled in seconds on Stellar with near-zero fees.

> Note: Blocki focuses solely on the purchase and sale of the digital asset value representing a percentage of the property. Users are acquiring an ownership stake, they do not receive rental income or distributions based on asset leasing.
> 

### Core User Journey:

1. María connects her Freighter wallet (or creates one in-app).
2. Deposits $500 USDC via **credit/debit card**.
3. Browses the marketplace and finds the "Luxury Apartment Manhattan" ($1.8M property, 1000 tokens available).
4. Buys 500 tokens ($500) → Instantly owns **0.027%** of the property's value.
5. Sells tokens on the secondary market: She receives **48% liquidity instantly**, and the remainder is paid upon finding a new buyer.

### 3.2 Why Stellar?

Stellar is the perfect foundation for Blocki because:

| Aspect | Stellar Advantage |
| --- | --- |
| **Smart Contracts** | **Soroban:** Implementation of immutable `PropertyToken` contracts with built-in logic for compliance and ownership tracking. |
| **Stablecoin** | **USDC Native:** Stellar has native USDC with Circle, providing instant settlement and stability for property-backed investments. |
| **On/Off Ramp** | **SEP-24 Anchors:** Seamless fiat on/off ramps allowing users in LATAM to convert card payments to USDC and invest without deep crypto knowledge. |
| **Speed + Cost** | **5-second finality** and **$0.00001** transaction fees enable instant trading of high-value real estate fractions (vs. Ethereum's $50+ gas fees). |
| **Liquidity** | **Built-in DEX:** Stellar's native DEX allows token liquidity without complex AMM pools. |
| **Regulation** | **Compliance-Ready:** Soroban contracts can enforce KYC/AML requirements at the protocol level, meeting securities regulations. |

**Stellar Elements We're Using:**

- ✅ Soroban smart contracts (`PropertyToken`, `Marketplace`)
- ✅ Stellar USDC for all transactions
- ✅ SEP-24 anchors for fiat deposits (Card)
- ✅ Freighter wallet integration
- ✅ **Palta Labs** (or ecosystem tooling)
- ✅ Stellar testnet → mainnet deployment path

---

## 4. Core Features (Planned for the Hackathon)

### Feature 1: Property Tokenization & Marketplace

- **What users can do:** Browse verified properties, view details (valuation, location, ROI), **purchase a fractional percentage of ownership** with USDC.
- **How we know it works:** The user can complete the purchase flow, receive the `PropertyTokens` in their wallet, and see the updated ownership percentage on the blockchain.

### Feature 2: Soroban PropertyToken Smart Contract

- **What it does:** Each property is a Soroban contract with `buy_tokens()`, `balance_of()`, and `get_ownership_percentage()` functions.
- **How we know it works:** Contract deployed on testnet, users can invoke functions, ownership is tracked immutably, and it passes the Soroban test suite.

### Característica 3: SEP-24 Fiat On-Ramp (Card)

- **What users can do:** Deposit funds using a **credit/debit card** → funds are automatically converted to USDC → ready to invest in properties.
- **How we know it works:** The user completes KYC, initiates the deposit, and sees the USDC balance update in their wallet within 24 hours.

### Feature 4: Portfolio Dashboard

- **What users can do:** View all owned property tokens, total portfolio value, ownership percentages, and transaction history.
- **How we know it works:** The dashboard accurately reflects on-chain balances and updates in real-time.

### Stretch Goal: Secondary Marketplace Trading

- **What users can do:** List their property tokens for sale, buy from other users P2P, and access **split liquidity upon selling**: **48% instant settlement** and the remainder upon finding a new buyer, ensuring minimal delay.
- **How we know it works:** The order book shows listings, trades execute via the Stellar DEX or a custom marketplace contract, with guaranteed partial instant settlement.

---

## 5. MVP Architecture (Initial Idea)

### Stack Overview

| Component | Technologies | Purpose |
| --- | --- | --- |
| **Frontend** | React (Vite) + TailwindCSS v4 + Tanstak Query | Marketplace Interface, Wallet Integration (Freighter), Portfolio Dashboard, SEP-24 Deposit Modal. |
| **Backend** | NEST JS | REST API for property data, KYC Integration, SEP-24 Anchor Integration, Ownership Sync Service. |
| **Smart Contracts** | Soroban (Rust) | `PropertyToken.wasm` (Core contract for each property), `Marketplace.wasm` (Secondary trading - stretch goal). |
| **Data/Storage** | PostgreSQL, Stellar blockchain | Property metadata, KYC status; Source of truth for token ownership; Property legal documents. |
| **External Services** | SEP-24 Anchor, KYC Provider (Persona/Onfido), Palta Labs | USDC stability/settlement, Fiat On/Off Ramp (Card), Regulatory compliance. |

### Architecture Diagram

*The diagram (Mermaid) is omitted for text compatibility.*

---

## 6. Success Criteria for the Hackathon

Upon completion of Stellar Hack+, we will consider our MVP successful if:

- A user can browse properties with full details (images, valuation, token availability), simulating a good application navigation experience.
- The `PropertyToken` Soroban contract is deployed on testnet with verified ownership tracking and test coverage >80%.
- A user can view their portfolio showing all owned tokens, total value, and ownership percentages synced from the blockchain.

### Bonus Success Metrics:

- Smart contracts audited (basic security review).
- Implementation of AI to guide the user with their doubts.
- Implementation of Oauth2 as an additional security protocol.
- Implementation of language translation to English and Spanish for the complete web app.
- Use of the WhatsApp cloud API service for verification code.
- PWA (Progressive Web App).

---

## 7. Team

- **Team name:** Blocki
- **Members and roles:**
    - Isaac Jiménez Barcelata – Backend Developer / DevOps / Scrum Master
    - Israel Flores Reza – Product Manager / Full Stack Developer
    - Erick García Salgado – Full Stack Developer
    - Jonathan Ocampo Flores – Frontend Developer
    - Ángel Santiago Murga Arcos – Frontend Developer
- **Links:**
    - GitHub:
    - Demo:
    - Documentation: /docs/frontend (comprehensive API reference, SDK patterns, component examples)
- **Technical Readiness:**
    - ✅ Frontend: 35% complete (Marketplace, Auth, Profile, Wallet pages)
    - ✅ Backend Docs: 35% complete (10+ API endpoints documented)
    - ✅ Soroban Patterns: Documented (contract invocation)
- **Stellar Ecosystem Commitment:**
We're building on Stellar because it's the only blockchain that combines enterprise-grade compliance, instant settlement, and accessibility for emerging markets—exactly what real estate tokenization needs to go mainstream in LATAM and beyond. 🚀


