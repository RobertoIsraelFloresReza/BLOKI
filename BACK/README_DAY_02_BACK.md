# 🏗️ SERVICE-BLOCKI - DOCUMENTACIÓN TÉCNICA BACKEND
## Plataforma de Tokenización Inmobiliaria en Stellar Blockchain

> **Versión:** 2.0.0
> **Última actualización:** 21 de Enero 2025
> **Stack:** NestJS + TypeScript + PostgreSQL + Redis + Stellar/Soroban + Rust

---

## 📋 TABLA DE CONTENIDOS

1. [Visión General del Sistema](#1-visión-general-del-sistema)
2. [Arquitectura Completa](#2-arquitectura-completa)
3. [Smart Contracts en Soroban](#3-smart-contracts-en-soroban)
4. [Backend NestJS](#4-backend-nestjs)
5. [Base de Datos y Modelo de Datos](#5-base-de-datos-y-modelo-de-datos)
6. [Sistema de Autenticación](#6-sistema-de-autenticación)
7. [API REST Completa](#7-api-rest-completa)
8. [Flujos de Negocio](#8-flujos-de-negocio)
9. [Seguridad y Mejores Prácticas](#9-seguridad-y-mejores-prácticas)
10. [Despliegue y Operaciones](#10-despliegue-y-operaciones)
11. [Testing y Calidad](#11-testing-y-calidad)
12. [Troubleshooting](#12-troubleshooting)

---

## 1. VISIÓN GENERAL DEL SISTEMA

### 1.1 ¿Qué es Service-Blocki?

**Service-Blocki** es una plataforma empresarial de tokenización de bienes raíces construida sobre la blockchain de Stellar utilizando smart contracts en Soroban (Rust). Permite la propiedad fraccionada de inmuebles mediante tokens digitales, creando un mercado líquido y descentralizado para inversiones inmobiliarias.

### 1.2 Componentes Principales

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND                                 │
│                    (React/Next.js)                              │
└────────────────────────┬────────────────────────────────────────┘
                         │ HTTP/REST API
┌────────────────────────▼────────────────────────────────────────┐
│                      BACKEND API                                 │
│                   (NestJS + TypeScript)                         │
│  ┌──────────────┬──────────────┬──────────────┬──────────────┐ │
│  │ Auth Module  │ Properties   │ Marketplace  │ KYC Module   │ │
│  │              │ Module       │ Module       │              │ │
│  └──────────────┴──────────────┴──────────────┴──────────────┘ │
└────────────┬────────────────────────────────┬──────────────────┘
             │                                │
             │ SQL                            │ Stellar SDK
             ▼                                ▼
┌─────────────────────┐          ┌──────────────────────────────┐
│    PostgreSQL       │          │   STELLAR BLOCKCHAIN         │
│    + Redis          │          │   (Soroban Smart Contracts)  │
│                     │          │  ┌────────────────────────┐  │
│  - Users            │          │  │ PropertyToken (Rust)   │  │
│  - Properties       │          │  │ Marketplace (Rust)     │  │
│  - Listings         │          │  │ Escrow (Rust)          │  │
│  - Transactions     │          │  │ Registry (Rust)        │  │
│  - KYC Records      │          │  │ Deployer (Rust)        │  │
└─────────────────────┘          └──────────────────────────────┘
```

### 1.3 Tecnologías Core

| Capa | Tecnología | Versión | Propósito |
|------|-----------|---------|-----------|
| **Backend Framework** | NestJS | 11.x | API REST, IoC, Modularidad |
| **Lenguaje Backend** | TypeScript | 5.x | Type-safety, Developer Experience |
| **Runtime** | Node.js | 22.x | Ejecución JavaScript |
| **Base de Datos** | PostgreSQL | 16.x | Almacenamiento relacional |
| **Cache/Sesiones** | Redis | 7.x | Sesiones, challenges, cache |
| **ORM** | TypeORM | 0.3.x | Mapeo objeto-relacional |
| **Blockchain** | Stellar (Soroban) | Latest | Ledger descentralizado |
| **Smart Contracts** | Rust (no_std) | 1.75+ | Contratos Soroban |
| **SDK Blockchain** | @stellar/stellar-sdk | Latest | Integración Stellar |
| **File Storage** | Cloudflare R2 | - | Almacenamiento S3-compatible |
| **KYC Provider** | Veriff | - | Verificación de identidad |
| **Container** | Docker | Latest | Containerización |

### 1.4 Características Principales

#### ✅ Tokenización de Propiedades
- Creación de tokens ERC20-like para cada propiedad
- División en fracciones (ej: 1,000,000 tokens = 100% propiedad)
- Metadata on-chain y off-chain
- Registro legal inmutable

#### ✅ Marketplace Descentralizado
- Listado de tokens en venta
- Compra/venta con USDC
- Historial de precios y transacciones
- Integración con DEX (Soroswap ready)

#### ✅ Sistema de Escrow
- Lock de fondos USDC durante transacciones
- Liberación automática o manual
- Timeout y refunds
- Preparado para DeFindex (yield farming)

#### ✅ Registro Legal
- Registro inmutable de propiedades
- Historial completo de ownership
- Hashes de documentos legales
- Verificación administrativa

#### ✅ KYC/AML Compliance
- Integración con Veriff
- 3 niveles de verificación ($5K, $50K, Unlimited)
- Reintentos limitados
- Validación de límites por transacción

#### ✅ Fiat On/Off Ramps
- Protocolo SEP-24 (Stellar)
- Depósitos y retiros USD/MXN
- URLs interactivas para formularios
- Tracking de transacciones fiat

---

## 2. ARQUITECTURA COMPLETA

### 2.1 Arquitectura de Alto Nivel

```
┌───────────────────────────────────────────────────────────────────┐
│                        PRESENTATION LAYER                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐   │
│  │ REST API     │  │ WebSocket    │  │ Swagger UI           │   │
│  │ (Controllers)│  │ (Real-time)  │  │ (Documentation)      │   │
│  └──────────────┘  └──────────────┘  └──────────────────────┘   │
└────────────────────────────┬──────────────────────────────────────┘
                             │
┌────────────────────────────▼──────────────────────────────────────┐
│                        APPLICATION LAYER                           │
│  ┌──────────────────────────────────────────────────────────┐    │
│  │                    MODULES (NestJS)                       │    │
│  │  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ │    │
│  │  │  Auth  │ │Property│ │Market  │ │ Escrow │ │  KYC   │ │    │
│  │  └────────┘ └────────┘ └────────┘ └────────┘ └────────┘ │    │
│  │  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ │    │
│  │  │Registry│ │ Wallet │ │Anchors │ │ User   │ │ Admin  │ │    │
│  │  └────────┘ └────────┘ └────────┘ └────────┘ └────────┘ │    │
│  └──────────────────────────────────────────────────────────┘    │
│                                                                    │
│  ┌──────────────────────────────────────────────────────────┐    │
│  │                   CORE SERVICES                           │    │
│  │  - StellarService (Blockchain Integration)               │    │
│  │  - CloudflareService (File Storage)                      │    │
│  │  - LoggerService (Centralized Logging)                   │    │
│  └──────────────────────────────────────────────────────────┘    │
└────────────────────────────┬──────────────────────────────────────┘
                             │
┌────────────────────────────▼──────────────────────────────────────┐
│                        INFRASTRUCTURE LAYER                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐   │
│  │ PostgreSQL   │  │ Redis        │  │ Stellar Network      │   │
│  │ (TypeORM)    │  │ (Sessions)   │  │ (Soroban Contracts)  │   │
│  └──────────────┘  └──────────────┘  └──────────────────────┘   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐   │
│  │ Cloudflare R2│  │ Veriff API   │  │ External Anchors     │   │
│  │ (S3-like)    │  │ (KYC)        │  │ (SEP-24)             │   │
│  └──────────────┘  └──────────────┘  └──────────────────────┘   │
└───────────────────────────────────────────────────────────────────┘
```

### 2.2 Flujo de Datos en una Compra

```
┌──────────┐                                    ┌──────────────┐
│  BUYER   │                                    │   SELLER     │
└────┬─────┘                                    └──────┬───────┘
     │                                                 │
     │ 1. Approve USDC                                │
     │    POST /marketplace/listings/buy              │
     ▼                                                 │
┌─────────────────────────────────────────────────────▼───────┐
│                    BACKEND (NestJS)                          │
│  MarketplaceController.buyTokens()                          │
│         │                                                    │
│         ▼                                                    │
│  MarketplaceService.buyTokens()                             │
│         │                                                    │
│         ├─► 2. Validate listing exists (PostgreSQL)         │
│         ├─► 3. Check buyer KYC level                        │
│         ├─► 4. Approve USDC via StellarService              │
│         └─► 5. Call Marketplace.buy_tokens()                │
└────────────────────────┬─────────────────────────────────────┘
                         │
                         ▼
┌──────────────────────────────────────────────────────────────┐
│              STELLAR BLOCKCHAIN (Soroban)                    │
│                                                              │
│  Marketplace Contract:                                       │
│    6. Verify listing active                                  │
│    7. Calculate total price                                  │
│    8. Transfer USDC: buyer → seller                          │
│    9. Transfer PropertyTokens: marketplace → buyer           │
│   10. Update listing amount                                  │
│   11. Emit TradeExecuted event                               │
│                                                              │
│  PropertyToken Contract:                                     │
│   12. Update buyer balance                                   │
│   13. Add buyer to owners list                               │
│   14. Recalculate ownership percentages                      │
│                                                              │
│  Registry Contract:                                          │
│   15. Update ownership records                               │
│   16. Add to ownership history                               │
└────────────────────────┬─────────────────────────────────────┘
                         │
                         │ Transaction Hash
                         ▼
┌──────────────────────────────────────────────────────────────┐
│                    BACKEND (NestJS)                          │
│  17. Create TransactionEntity (PostgreSQL)                   │
│  18. Update ListingEntity amount                             │
│  19. Update/Create OwnershipEntity for buyer                 │
│  20. Return transaction details to buyer                     │
└──────────────────────────────────────────────────────────────┘
         │
         │ HTTP Response
         ▼
┌──────────────────────────────────────────────────────────────┐
│  BUYER receives:                                             │
│  {                                                           │
│    "transaction": {                                          │
│      "txHash": "abc123...",                                  │
│      "amount": "100000000000",                               │
│      "totalPrice": "500000000000"                            │
│    },                                                        │
│    "ownership": {                                            │
│      "balance": "100000000000",                              │
│      "percentage": "10.00"                                   │
│    }                                                         │
│  }                                                           │
└──────────────────────────────────────────────────────────────┘
```

### 2.3 Patrones de Diseño Implementados

| Patrón | Ubicación | Propósito |
|--------|-----------|-----------|
| **Dependency Injection** | Todo NestJS | Desacoplamiento, testabilidad |
| **Repository Pattern** | TypeORM entities | Abstracción de datos |
| **Service Layer** | `*.service.ts` | Lógica de negocio |
| **DTO Pattern** | `*.dto.ts` | Validación y transformación |
| **Factory Pattern** | Deployer contract | Creación de PropertyTokens |
| **Registry Pattern** | Registry contract | Registro centralizado |
| **Escrow Pattern** | Escrow contract | Custodia de fondos |
| **CEI Pattern** | Marketplace contract | Prevención reentrancy |
| **Guard Pattern** | `*.guard.ts` | Protección de rutas |
| **Interceptor Pattern** | `*.interceptor.ts` | Transformación HTTP |
| **Decorator Pattern** | `@Public()`, `@Roles()` | Metadata customizada |

---

## 3. SMART CONTRACTS EN SOROBAN

### 3.1 PropertyToken Contract

**📁 Ubicación:** `/stellar-blocki/contracts/core/property-token/src/lib.rs`

**🎯 Propósito:** Token SEP-41 compliant que representa propiedad fraccionada de un inmueble.

#### Estructura de Datos

```rust
// Storage Keys
pub enum DataKey {
    Admin,           // Address: Administrador del contrato
    PropertyId,      // String: ID único de la propiedad
    Name,            // String: Nombre del token
    Symbol,          // String: Símbolo (ej: "PROP1")
    TotalSupply,     // i128: Supply total (ej: 10^14 = 1M tokens * 10^7 decimals)
    Balance(Address),// i128: Balance de un owner
    Allowance(Address, Address), // i128: Allowance para transfers
    Owners,          // Vec<Address>: Lista de propietarios
    Ownership(Address), // i128: Porcentaje * 10^7
}

// Ownership Info (retornado en queries)
pub struct OwnershipInfo {
    pub owner: Address,
    pub balance: i128,
    pub percentage: i128,  // Porcentaje * 10^7 (ej: 25% = 250000000)
}
```

#### Funciones Principales

##### 1. `initialize()`
```rust
pub fn initialize(
    env: Env,
    admin: Address,
    property_id: String,
    name: String,
    symbol: String,
    total_supply: i128,
) -> Result<(), Error>
```

**Descripción:** Inicializa el token y minta automáticamente todo el supply al admin.

**Seguridad:**
- Solo se puede llamar una vez (AlreadyInitialized error)
- Requiere auth del admin
- Verifica total_supply > 0
- Usa checked_mul para prevenir overflow

**Flujo:**
1. Valida que no esté inicializado
2. Guarda metadata (admin, property_id, name, symbol, total_supply)
3. Minta total_supply al admin
4. Agrega admin a lista de owners
5. Establece ownership percentage = 100%

**Ejemplo de uso:**
```typescript
// Desde el backend (StellarService)
const result = await contract.invoke({
  method: 'initialize',
  args: [
    adminAddress,              // Address
    'PROP-2024-001',          // property_id
    'Luxury Villa Miami',     // name
    'PROP1',                  // symbol
    10000000n * 10000000n,    // total_supply (1M tokens * 7 decimals)
  ],
});
```

##### 2. `transfer()`
```rust
pub fn transfer(
    env: Env,
    from: Address,
    to: Address,
    amount: i128,
) -> Result<(), Error>
```

**Descripción:** Transfiere tokens de `from` a `to`.

**Seguridad:**
- Requiere auth de `from`
- Verifica balance suficiente
- Checked arithmetic
- Actualiza lista de owners si es nuevo
- Recalcula percentages

**Límites:**
- MAX_OWNERS = 1000 (previene DoS)

**Flujo:**
1. Valida amount > 0
2. Verifica balance[from] >= amount
3. Decrementa balance[from]
4. Incrementa balance[to]
5. Si to es nuevo owner, agrega a lista (max 1000)
6. Recalcula ownership percentages
7. Emite evento Transfer

##### 3. `approve()` y `transfer_from()`
```rust
pub fn approve(env: Env, owner: Address, spender: Address, amount: i128)
pub fn transfer_from(env: Env, spender: Address, from: Address, to: Address, amount: i128)
```

**Descripción:** Patrón allowance estándar para que contratos (ej: Marketplace) puedan transferir en nombre del owner.

**Uso típico:**
```typescript
// Usuario aprueba marketplace para transferir 100 tokens
await propertyToken.approve(owner, marketplaceAddress, 100n * 10000000n);

// Marketplace ejecuta transferencia
await propertyToken.transfer_from(
  marketplaceAddress,  // spender
  owner,               // from
  buyer,               // to
  100n * 10000000n     // amount
);
```

##### 4. `burn()`
```rust
pub fn burn(env: Env, from: Address, amount: i128) -> Result<(), Error>
```

**Descripción:** Destruye tokens, reduciendo total supply.

**Casos de uso:**
- Propiedad demolida
- Consolidación de tokens
- Buyback del emisor

##### 5. Query Functions

```rust
// Getters (no modifican estado)
pub fn balance_of(env: Env, owner: Address) -> i128
pub fn get_ownership_percentage(env: Env, owner: Address) -> i128
pub fn list_all_owners(env: Env) -> Vec<OwnershipInfo>
pub fn total_supply(env: Env) -> i128
pub fn name(env: Env) -> String
pub fn symbol(env: Env) -> String
pub fn admin(env: Env) -> Address
```

#### Tests Unitarios

**📁 Ubicación:** `/stellar-blocki/contracts/core/property-token/src/lib.rs` (módulo `#[cfg(test)]`)

```rust
#[test]
fn test_initialize() { /* Verifica inicialización correcta */ }

#[test]
fn test_transfer() { /* Verifica transferencias */ }

#[test]
fn test_approve_transfer_from() { /* Verifica allowances */ }

#[test]
fn test_burn() { /* Verifica quema de tokens */ }

#[test]
fn test_ownership_tracking() { /* Verifica lista de owners */ }

#[test]
fn test_max_owners_limit() { /* Verifica límite de 1000 owners */ }

#[test]
#[should_panic(expected = "InsufficientBalance")]
fn test_transfer_insufficient_balance() { /* ... */ }
```

**Ejecutar tests:**
```bash
cd stellar-blocki/contracts/core/property-token
cargo test
```

---

### 3.2 Marketplace Contract

**📁 Ubicación:** `/stellar-blocki/contracts/core/marketplace/src/lib.rs`

**🎯 Propósito:** Exchange descentralizado para trading de PropertyTokens contra USDC.

#### Estructura de Datos

```rust
pub enum DataKey {
    Admin,
    EscrowContract,
    RegistryContract,
    NextListingId,              // u64: Auto-increment
    Listing(u64),               // Listing struct
    TokenListings(Address),     // Vec<u64>: Listing IDs por token
    TradeHistory(Address),      // Vec<Trade>: Historial de trades
}

pub struct Listing {
    pub id: u64,
    pub seller: Address,
    pub token: Address,         // PropertyToken contract
    pub amount: i128,
    pub initial_amount: i128,
    pub price_per_token: i128,  // En USDC (7 decimals)
    pub active: bool,
    pub created_at: u64,        // Timestamp
}

pub struct Trade {
    pub listing_id: u64,
    pub buyer: Address,
    pub seller: Address,
    pub amount: i128,
    pub price_per_token: i128,
    pub total_price: i128,
    pub timestamp: u64,
}
```

#### Funciones Principales

##### 1. `list_property()`
```rust
pub fn list_property(
    env: Env,
    seller: Address,
    token: Address,
    amount: i128,
    price_per_token: i128,
) -> u64  // Returns listing_id
```

**Descripción:** Crea un listing de venta de tokens.

**Seguridad:**
- Requiere auth del seller
- Verifica balance suficiente en PropertyToken
- Verifica allowance suficiente para marketplace
- Ejecuta transfer_from para custodiar tokens

**Flujo:**
1. Valida amount > 0 y price_per_token > 0
2. Genera nuevo listing_id (auto-increment)
3. Verifica que seller tenga balance >= amount
4. Ejecuta PropertyToken.transfer_from(seller → marketplace)
5. Crea Listing struct y guarda
6. Agrega listing_id a TokenListings(token)
7. Emite evento ListingCreated
8. Retorna listing_id

**Ejemplo desde backend:**
```typescript
// 1. Usuario aprueba marketplace
await stellarService.approvePropertyTokens(
  sellerSecretKey,
  propertyTokenAddress,
  marketplaceAddress,
  amount
);

// 2. Crea listing
const listingId = await stellarService.createListing(
  sellerSecretKey,
  propertyTokenAddress,
  1000n * 10000000n,  // 1000 tokens
  5n * 10000000n      // 5 USDC por token
);
```

##### 2. `buy_tokens()`
```rust
pub fn buy_tokens(
    env: Env,
    buyer: Address,
    listing_id: u64,
    amount: i128,
    usdc_token: Address,
) -> Result<(), Error>
```

**Descripción:** Compra tokens de un listing activo.

**Seguridad:**
- **CEI Pattern** (Checks-Effects-Interactions)
- Verifica listing existe y está activo
- Verifica amount <= listing.amount
- Calcula total_price con checked_mul
- Actualiza estado ANTES de external calls
- Verifica allowance USDC del buyer

**Flujo (CEI Pattern):**

**CHECKS:**
1. Valida listing existe
2. Valida listing.active == true
3. Valida amount > 0 y amount <= listing.amount
4. Calcula total_price = amount * price_per_token
5. Verifica buyer != seller

**EFFECTS:**
6. Decrementa listing.amount
7. Si listing.amount == 0, marca listing.active = false
8. Guarda listing actualizado

**INTERACTIONS:**
9. Transfer USDC: buyer → seller (via USDC.transfer_from)
10. Transfer PropertyTokens: marketplace → buyer (via PropertyToken.transfer_from)
11. Actualiza Registry.update_ownership()

**POST-EFFECTS:**
12. Agrega Trade a TradeHistory
13. Emite evento TradeExecuted

**Prevención de Reentrancy:**
```rust
// ✅ CORRECTO: Estado actualizado ANTES de external calls
listing.amount = listing.amount.checked_sub(amount)?;
env.storage().persistent().set(&DataKey::Listing(listing_id), &listing);

// Ahora sí llamadas externas
usdc_token_client.transfer_from(&buyer, &listing.seller, &total_price);
property_token_client.transfer_from(&marketplace_addr, &buyer, &amount);
```

##### 3. `cancel_listing()`
```rust
pub fn cancel_listing(env: Env, listing_id: u64) -> Result<(), Error>
```

**Descripción:** Cancela listing y devuelve tokens al seller.

**Seguridad:**
- Solo el seller puede cancelar
- Solo si listing activo
- Devuelve tokens via transfer

##### 4. `swap_tokens_for_usdc()`
```rust
pub fn swap_tokens_for_usdc(
    env: Env,
    seller: Address,
    property_token: Address,
    usdc_token: Address,
    amount_in: i128,
    min_usdc_out: i128,
) -> Result<i128, Error>
```

**Descripción:** Integración con Soroswap para swaps instantáneos.

**Estado:** Preparado para integración futura.

##### 5. Query Functions

```rust
pub fn get_listing(env: Env, listing_id: u64) -> Listing
pub fn get_listings(env: Env, token: Address) -> Vec<Listing>
pub fn get_trade_history(env: Env, token: Address) -> Vec<Trade>
pub fn calculate_market_cap(env: Env, token: Address) -> i128
```

#### Límites de Storage

```rust
const MAX_TRADE_HISTORY: usize = 10000;

// FIFO eviction cuando se alcanza el límite
if trades.len() >= MAX_TRADE_HISTORY {
    trades.remove(0);  // Elimina el más antiguo
}
trades.push(new_trade);
```

---

### 3.3 Escrow Contract

**📁 Ubicación:** `/stellar-blocki/contracts/core/escrow/src/lib.rs`

**🎯 Propósito:** Custodia segura de USDC durante transacciones con mecanismo de timeout.

#### Estructura de Datos

```rust
pub enum DataKey {
    Admin,
    MarketplaceContract,
    NextEscrowId,
    Escrow(u64),
    UsdcToken,
}

pub struct Escrow {
    pub id: u64,
    pub buyer: Address,
    pub seller: Address,
    pub amount: i128,
    pub listing_id: u64,
    pub status: EscrowStatus,
    pub created_at: u64,
    pub timeout_at: u64,
}

pub enum EscrowStatus {
    Locked,
    Released,
    Refunded,
}
```

#### Funciones Principales

##### 1. `lock_funds()`
```rust
pub fn lock_funds(
    env: Env,
    buyer: Address,
    seller: Address,
    amount: i128,
    listing_id: u64,
    timeout_duration: u64,  // En segundos
) -> u64  // Returns escrow_id
```

**Descripción:** Lock de USDC del buyer hacia el escrow.

**Flujo:**
1. Valida amount > 0
2. Genera escrow_id
3. Calcula timeout_at = now + timeout_duration
4. Ejecuta USDC.transfer_from(buyer → escrow_contract)
5. Crea Escrow con status = Locked
6. Emite evento FundsLocked

**Timeout típico:** 7 días (604800 segundos)

##### 2. `release_to_seller()`
```rust
pub fn release_to_seller(env: Env, escrow_id: u64) -> Result<(), Error>
```

**Descripción:** Libera fondos al seller tras compra exitosa.

**Autorización:**
- Solo MarketplaceContract o Admin
- Solo si status == Locked

**Flujo:**
1. Valida escrow existe y está Locked
2. Verifica caller == marketplace || caller == admin
3. Ejecuta USDC.transfer(escrow → seller)
4. Actualiza status = Released
5. Emite evento FundsReleased

##### 3. `refund_to_buyer()`
```rust
pub fn refund_to_buyer(env: Env, escrow_id: u64) -> Result<(), Error>
```

**Descripción:** Devuelve fondos al buyer si timeout expiró.

**Condiciones:**
- Debe haber pasado timeout_at
- Status == Locked

**Flujo:**
1. Valida escrow existe y está Locked
2. Verifica now > timeout_at
3. Ejecuta USDC.transfer(escrow → buyer)
4. Actualiza status = Refunded
5. Emite evento FundsRefunded

##### 4. `is_timed_out()`
```rust
pub fn is_timed_out(env: Env, escrow_id: u64) -> bool
```

**Descripción:** Helper para verificar si timeout expiró.

#### Integración Futura: DeFindex

**Preparado para yield farming:**
```rust
// TODO: Depositar fondos en DeFindex mientras están en escrow
// Generar yield pasivo para buyer o protocolo
pub fn deposit_to_defindex(&self, amount: i128) { /* ... */ }
pub fn withdraw_from_defindex(&self, amount: i128) { /* ... */ }
```

---

### 3.4 Registry Contract

**📁 Ubicación:** `/stellar-blocki/contracts/core/registry/src/lib.rs`

**🎯 Propósito:** Registro legal inmutable de propiedades y ownership history.

#### Estructura de Datos

```rust
pub enum DataKey {
    Admin,
    Property(String),           // property_id → PropertyInfo
    OwnershipHistory(String),   // property_id → Vec<OwnershipRecord>
    LegalDocuments(String),     // property_id → Vec<String> (hashes)
}

pub struct PropertyInfo {
    pub property_id: String,
    pub owner: Address,         // Initial owner
    pub current_holders: Vec<OwnerInfo>,
    pub address: String,        // Physical address
    pub valuation: i128,        // En cents (7 decimals)
    pub legal_id: String,       // Registro público
    pub verified: bool,
    pub token_contract: Address,
    pub created_at: u64,
}

pub struct OwnerInfo {
    pub address: Address,
    pub percentage: i128,       // Percentage * 10^7
}

pub struct OwnershipRecord {
    pub timestamp: u64,
    pub holders: Vec<OwnerInfo>,
    pub transaction_hash: Option<String>,
}
```

#### Funciones Principales

##### 1. `register_property()`
```rust
pub fn register_property(
    env: Env,
    property_id: String,
    owner: Address,
    address: String,
    valuation: i128,
    legal_id: String,
    token_contract: Address,
) -> Result<(), Error>
```

**Descripción:** Registro inicial de propiedad.

**Seguridad:**
- Solo admin puede registrar
- property_id debe ser único
- Valida valuation > 0

**Flujo:**
1. Valida property_id no existe
2. Crea PropertyInfo con owner al 100%
3. Guarda en storage
4. Agrega primer OwnershipRecord
5. Emite evento PropertyRegistered

##### 2. `update_ownership()`
```rust
pub fn update_ownership(
    env: Env,
    property_id: String,
    new_holders: Vec<OwnerInfo>,
) -> Result<(), Error>
```

**Descripción:** Actualiza ownership tras trades en marketplace.

**Validaciones:**
- Sum de percentages debe ser 100% (1000000000 en i128)
- Max 100 concurrent owners (MAX_CONCURRENT_OWNERS)
- Max 5000 records en history (MAX_OWNERSHIP_HISTORY con FIFO)

**Flujo:**
1. Valida property existe
2. Valida sum(percentages) == 100%
3. Valida num holders <= 100
4. Actualiza current_holders
5. Agrega OwnershipRecord a history
6. Si history > 5000, elimina oldest (FIFO)

##### 3. `verify_property()`
```rust
pub fn verify_property(env: Env, property_id: String) -> Result<(), Error>
```

**Descripción:** Marca propiedad como verificada tras due diligence.

**Autorización:** Solo admin

##### 4. `record_legal_document()`
```rust
pub fn record_legal_document(
    env: Env,
    property_id: String,
    document_hash: String,
) -> Result<(), Error>
```

**Descripción:** Registra hash SHA256 de documentos legales.

**Casos de uso:**
- Escrituras
- Avalúos certificados
- Permisos de construcción
- Contratos de compraventa

**Ejemplo:**
```typescript
const documentHash = sha256(avaluoCertificadoPDF);
await registryContract.record_legal_document('PROP-2024-001', documentHash);
```

##### 5. Query Functions

```rust
pub fn get_property_info(env: Env, property_id: String) -> PropertyInfo
pub fn get_property_owners(env: Env, property_id: String) -> Vec<OwnerInfo>
pub fn get_property_history(env: Env, property_id: String) -> Vec<OwnershipRecord>
pub fn verify_ownership(env: Env, property_id: String, user: Address) -> (bool, i128)
pub fn get_legal_documents(env: Env, property_id: String) -> Vec<String>
```

#### Límites de Storage

```rust
const MAX_OWNERSHIP_HISTORY: usize = 5000;
const MAX_CONCURRENT_OWNERS: usize = 100;

// FIFO eviction en history
if history.len() >= MAX_OWNERSHIP_HISTORY {
    history.remove(0);
}
history.push(new_record);
```

---

### 3.5 Deployer Contract

**📁 Ubicación:** `/stellar-blocki/contracts/utils/deployer/src/lib.rs`

**🎯 Propósito:** Factory para deployar PropertyToken contracts con deterministic addressing.

#### Estructura de Datos

```rust
pub enum DataKey {
    Admin,
    PropertyTokenWasmHash,      // BytesN<32>: WASM hash
    DeployedContracts,          // Vec<Address>: Deployed contracts
    PropertyIdToAddress(String), // property_id → Address
}
```

#### Funciones Principales

##### 1. `set_property_token_wasm()`
```rust
pub fn set_property_token_wasm(env: Env, wasm_hash: BytesN<32>) -> Result<(), Error>
```

**Descripción:** Guarda hash del WASM de PropertyToken.

**Uso:**
```bash
# 1. Build contract
cd stellar-blocki/contracts/core/property-token
cargo build --release --target wasm32-unknown-unknown

# 2. Upload WASM y obtener hash
stellar contract install \
  --wasm target/wasm32-unknown-unknown/release/property_token.wasm \
  --network testnet

# Output: abc123...def (hash)

# 3. Guardar en deployer
stellar contract invoke \
  --id $DEPLOYER_CONTRACT_ID \
  --source admin \
  --network testnet \
  -- set_property_token_wasm --wasm_hash abc123...def
```

##### 2. `deploy_property_token()`
```rust
pub fn deploy_property_token(
    env: Env,
    property_id: String,
    salt: BytesN<32>,
) -> Address
```

**Descripción:** Deploys nuevo PropertyToken usando WASM hash guardado.

**Deterministic Addressing:**
```rust
let deployed_address = env.deployer()
    .with_current_contract(salt)
    .deploy(wasm_hash);
```

**Flujo:**
1. Valida wasm_hash existe
2. Valida property_id no deployado
3. Deploy contract con salt
4. Guarda deployed_address
5. Mapea property_id → Address
6. Retorna deployed_address

**Ejemplo desde backend:**
```typescript
const salt = crypto.randomBytes(32);
const propertyTokenAddress = await deployerContract.deploy_property_token(
  'PROP-2024-001',
  salt
);
// Returns: CDHFNDXSSSSKT53SEJDANUBHYIEJO54KFV7QSCMW6UUKWBAF6F5ZPN6I
```

##### 3. `get_property_token_address()`
```rust
pub fn get_property_token_address(env: Env, property_id: String) -> Address
```

**Descripción:** Query de address por property_id.

---

### 3.6 USDC Mock Contract

**📁 Ubicación:** `/stellar-blocki/contracts/core/usdc-mock/src/lib.rs`

**🎯 Propósito:** Token USDC simulado para testing en testnet.

**Funcionalidad:**
- Implementación completa de token SEP-41
- `mint()` sin restricciones (testing)
- `transfer()`, `approve()`, `transfer_from()`
- 7 decimals (igual que USDC real)

**⚠️ SOLO PARA TESTNET - En producción usar USDC nativo de Stellar**

---

### 3.7 Error Handling

**📁 Ubicación:** `/stellar-blocki/contracts/utils/errors/src/lib.rs`

Todos los contratos usan el mismo enum de errores:

```rust
#[derive(Copy, Clone, Debug, Eq, PartialEq, PartialOrd, Ord)]
#[repr(u32)]
pub enum Error {
    // General (1-10)
    AlreadyInitialized = 1,
    NotAuthorized = 2,
    InvalidAmount = 3,
    NotFound = 4,
    InsufficientFunds = 5,

    // Token (11-20)
    InsufficientBalance = 11,
    MintExceedsSupply = 12,
    InsufficientAllowance = 13,
    MaxOwnersReached = 14,

    // Property (21-30)
    PropertyNotFound = 21,
    PropertyAlreadyExists = 22,
    PropertyNotVerified = 23,

    // Marketplace (31-40)
    ListingNotFound = 31,
    ListingNotActive = 32,
    InvalidPrice = 33,
    InsufficientListingAmount = 34,
    BuyerIsSeller = 35,

    // Escrow (41-50)
    EscrowNotFound = 41,
    EscrowNotLocked = 42,
    EscrowTimeoutNotReached = 43,
    EscrowAlreadyProcessed = 44,

    // Registry (51-60)
    OwnershipNotFound = 51,
    InvalidOwnershipData = 52,
    PercentageSumInvalid = 53,
    TooManyOwners = 54,

    // Deployer (61-70)
    InvalidWasmHash = 61,
    ContractAlreadyDeployed = 62,
    DeploymentFailed = 63,
}
```

**Manejo en Rust:**
```rust
use crate::errors::Error;

pub fn transfer(env: Env, from: Address, to: Address, amount: i128) -> Result<(), Error> {
    if amount <= 0 {
        return Err(Error::InvalidAmount);
    }

    let balance = get_balance(&env, &from);
    if balance < amount {
        return Err(Error::InsufficientBalance);
    }

    // ... transfer logic
    Ok(())
}
```

**Propagación al backend:**
```typescript
try {
  await propertyToken.transfer(from, to, amount);
} catch (error) {
  // Error code en error.message
  if (error.message.includes('11')) {  // InsufficientBalance
    throw new BadRequestException('Balance insuficiente');
  }
}
```

---

### 3.8 Build y Deploy

#### Build Local

```bash
cd stellar-blocki

# Install Rust target
rustup target add wasm32-unknown-unknown

# Build todos los contratos
cargo build --release --target wasm32-unknown-unknown

# Outputs en:
# target/wasm32-unknown-unknown/release/property_token.wasm
# target/wasm32-unknown-unknown/release/marketplace.wasm
# target/wasm32-unknown-unknown/release/escrow.wasm
# target/wasm32-unknown-unknown/release/registry.wasm
# target/wasm32-unknown-unknown/release/deployer.wasm
# target/wasm32-unknown-unknown/release/usdc_mock.wasm
```

#### Deploy a Testnet

**Opción 1: Stellar CLI**
```bash
# Install WASM y obtener hash
stellar contract install \
  --wasm target/wasm32-unknown-unknown/release/marketplace.wasm \
  --source admin \
  --network testnet

# Output: WASM hash abc123...

# Deploy contract
stellar contract deploy \
  --wasm-hash abc123... \
  --source admin \
  --network testnet

# Output: Contract ID CATAB6XXHBTB3UTHBYB4T2W6FDFCDRNLNISYTPSKEXWL7AUG3PALB4NV
```

**Opción 2: Desde Backend**
```typescript
// StellarService tiene métodos helper
const contractId = await this.stellarService.deployContract(
  wasmBuffer,
  'admin-secret-key'
);
```

#### Inicialización

Tras deploy, cada contrato debe inicializarse:

```bash
# Deployer
stellar contract invoke \
  --id CB6L32U3SK3ZYLXVJB7BW6PYZBOUX5HXXRCDSRRNU7DAACHS66GUN5ZS \
  --source admin \
  --network testnet \
  -- initialize \
    --admin GADMIN123...

# Marketplace
stellar contract invoke \
  --id CATAB6XXHBTB3UTHBYB4T2W6FDFCDRNLNISYTPSKEXWL7AUG3PALB4NV \
  --source admin \
  --network testnet \
  -- initialize \
    --admin GADMIN123... \
    --escrow_contract CARJ2AEKS5PLMF6BNHZKPRGX2VJT5JG7BDOPYHQIGQY4WI7JL2ALWBLS \
    --registry_contract CDLPZNUOIUPA3G4NZHZ6MWJ4LOVSGJ5XMNKGQLOLDSJYKMFCUPX5ZKR4

# Registry
stellar contract invoke \
  --id CDLPZNUOIUPA3G4NZHZ6MWJ4LOVSGJ5XMNKGQLOLDSJYKMFCUPX5ZKR4 \
  --source admin \
  --network testnet \
  -- initialize \
    --admin GADMIN123...

# Escrow
stellar contract invoke \
  --id CARJ2AEKS5PLMF6BNHZKPRGX2VJT5JG7BDOPYHQIGQY4WI7JL2ALWBLS \
  --source admin \
  --network testnet \
  -- initialize \
    --admin GADMIN123... \
    --marketplace_contract CATAB6XXHBTB3UTHBYB4T2W6FDFCDRNLNISYTPSKEXWL7AUG3PALB4NV \
    --usdc_token CUSDC123...
```

#### Verificación

```bash
# Query contract info
stellar contract invoke \
  --id CATAB6XXHBTB3UTHBYB4T2W6FDFCDRNLNISYTPSKEXWL7AUG3PALB4NV \
  --network testnet \
  -- admin

# Output: GADMIN123...
```

---

## 4. BACKEND NESTJS

### 4.1 Estructura de Módulos

```
src/
├── main.ts                      # Bootstrap application
├── app.module.ts               # Root module
├── config/                     # Configuration
│   ├── type.orm.config.ts     # TypeORM config
│   ├── redis.config.ts        # Redis config
│   └── cloudflare.config.ts   # R2 config
├── common/                     # Shared utilities
│   ├── decorators/
│   │   ├── public.decorator.ts         # @Public()
│   │   └── roles.decorator.ts          # @Roles()
│   ├── guards/
│   │   ├── jwt-auth.guard.ts           # JWT validation
│   │   └── roles.guard.ts              # Role-based access
│   ├── exceptions/
│   │   └── http-exception.filter.ts    # Global exception handler
│   └── logger/
│       └── logger.service.ts           # Winston logger
├── interceptors/
│   ├── logging.interceptor.ts          # Request/response logging
│   └── transform.interceptor.ts        # Response transformation
└── modules/
    ├── auth/                   # Authentication
    ├── stellar/                # Blockchain integration
    ├── properties/             # Property management
    ├── marketplace/            # Trading
    ├── ownership/              # Ownership tracking
    ├── escrow/                 # Escrow operations
    ├── registry/               # Registry operations
    ├── kyc/                    # KYC verification
    ├── anchors/                # SEP-24 fiat rails
    ├── wallet/                 # Stellar wallet
    ├── evaluators/             # Property evaluators
    ├── cloudflare/             # File storage
    ├── admin/                  # Admin operations
    └── user/                   # User management
```

### 4.2 AppModule (Root)

**📁 Ubicación:** `/src/app.module.ts`

```typescript
@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // Database
    TypeOrmModule.forRootAsync({
      useFactory: () => typeOrmConfig,
    }),

    // Redis (Sessions)
    RedisModule.forRootAsync({
      useFactory: () => redisConfig,
    }),

    // Scheduling (Cron jobs)
    ScheduleModule.forRoot(),

    // Feature Modules
    AuthModule,
    StellarModule,
    PropertiesModule,
    MarketplaceModule,
    OwnershipModule,
    EscrowModule,
    RegistryModule,
    KycModule,
    AnchorsModule,
    WalletModule,
    EvaluatorsModule,
    CloudflareModule,
    AdminModule,
    UserModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,  // Global auth guard
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,  // Global logging
    },
    LoggerService,
  ],
})
export class AppModule {}
```

**Características:**
- ConfigModule global (acceso a .env en todos los módulos)
- TypeORM con auto-load de entities
- Redis para sesiones
- Schedule para cron jobs
- Global guards e interceptors

---

### 4.3 StellarService (Core Integration)

**📁 Ubicación:** `/src/modules/stellar/stellar.service.ts`

**🎯 Propósito:** Abstracción de todas las operaciones blockchain.

#### Configuración Inicial

```typescript
import {
  Keypair,
  Networks,
  SorobanRpc,
  TransactionBuilder,
  Operation,
  Asset,
  Contract,
  nativeToScVal,
  scValToNative,
} from '@stellar/stellar-sdk';

@Injectable()
export class StellarService {
  private server: SorobanRpc.Server;
  private networkPassphrase: string;

  constructor(private configService: ConfigService) {
    const rpcUrl = this.configService.get('STELLAR_RPC_URL');
    this.server = new SorobanRpc.Server(rpcUrl);

    const network = this.configService.get('STELLAR_NETWORK');
    this.networkPassphrase = network === 'testnet'
      ? Networks.TESTNET
      : Networks.PUBLIC;
  }
}
```

#### Métodos de Utilidad

##### 1. Generación de Keypairs

```typescript
generateKeypair(): { publicKey: string; secretKey: string } {
  const keypair = Keypair.random();
  return {
    publicKey: keypair.publicKey(),
    secretKey: keypair.secret(),
  };
}
```

**Uso:**
```typescript
const { publicKey, secretKey } = await stellarService.generateKeypair();
// publicKey: GABC123...
// secretKey: SDXYZ789...
```

##### 2. Fondeo de Cuentas (Testnet)

```typescript
async fundAccount(publicKey: string): Promise<boolean> {
  try {
    const response = await fetch(
      `https://friendbot.stellar.org?addr=${encodeURIComponent(publicKey)}`
    );
    const json = await response.json();
    return json.successful === true;
  } catch (error) {
    this.logger.error(`Error funding account: ${error.message}`);
    return false;
  }
}
```

**Uso:**
```typescript
const funded = await stellarService.fundAccount('GABC123...');
if (funded) {
  console.log('Account funded with 10,000 XLM');
}
```

#### Interacción con PropertyToken

##### 1. Deploy PropertyToken

```typescript
async deployPropertyToken(
  adminSecretKey: string,
  propertyId: string,
  name: string,
  symbol: string,
  totalSupply: bigint,
): Promise<string> {
  const adminKeypair = Keypair.fromSecret(adminSecretKey);
  const deployerAddress = this.configService.get('DEPLOYER_CONTRACT_ID');

  // Generate salt para deterministic addressing
  const salt = crypto.randomBytes(32);

  // Call deployer.deploy_property_token()
  const contract = new Contract(deployerAddress);
  const operation = contract.call(
    'deploy_property_token',
    nativeToScVal(propertyId, { type: 'string' }),
    nativeToScVal(salt, { type: 'bytes' }),
  );

  const txBuilder = new TransactionBuilder(
    await this.server.getAccount(adminKeypair.publicKey()),
    {
      fee: '100000',
      networkPassphrase: this.networkPassphrase,
    }
  );

  txBuilder.addOperation(operation);
  const tx = txBuilder.setTimeout(300).build();

  // Simulate
  const simulated = await this.server.simulateTransaction(tx);
  const prepared = SorobanRpc.assembleTransaction(tx, simulated);

  // Sign and submit
  prepared.sign(adminKeypair);
  const result = await this.server.sendTransaction(prepared);

  // Wait for confirmation
  let status = await this.server.getTransaction(result.hash);
  while (status.status === 'PENDING') {
    await new Promise(resolve => setTimeout(resolve, 1000));
    status = await this.server.getTransaction(result.hash);
  }

  if (status.status === 'SUCCESS') {
    // Extract deployed contract address from result
    const deployedAddress = scValToNative(status.returnValue);

    // Initialize PropertyToken
    await this.initializePropertyToken(
      adminSecretKey,
      deployedAddress,
      propertyId,
      name,
      symbol,
      totalSupply,
    );

    return deployedAddress;
  }

  throw new Error('Deployment failed');
}
```

##### 2. Initialize PropertyToken

```typescript
async initializePropertyToken(
  adminSecretKey: string,
  contractId: string,
  propertyId: string,
  name: string,
  symbol: string,
  totalSupply: bigint,
): Promise<string> {
  const adminKeypair = Keypair.fromSecret(adminSecretKey);
  const contract = new Contract(contractId);

  const operation = contract.call(
    'initialize',
    nativeToScVal(adminKeypair.publicKey(), { type: 'address' }),
    nativeToScVal(propertyId, { type: 'string' }),
    nativeToScVal(name, { type: 'string' }),
    nativeToScVal(symbol, { type: 'symbol' }),
    nativeToScVal(totalSupply, { type: 'i128' }),
  );

  return this.submitTransaction(adminKeypair, [operation]);
}
```

##### 3. Transfer PropertyTokens

```typescript
async transferPropertyTokens(
  fromSecretKey: string,
  contractId: string,
  toAddress: string,
  amount: bigint,
): Promise<string> {
  const fromKeypair = Keypair.fromSecret(fromSecretKey);
  const contract = new Contract(contractId);

  const operation = contract.call(
    'transfer',
    nativeToScVal(fromKeypair.publicKey(), { type: 'address' }),
    nativeToScVal(toAddress, { type: 'address' }),
    nativeToScVal(amount, { type: 'i128' }),
  );

  return this.submitTransaction(fromKeypair, [operation]);
}
```

##### 4. Query Token Balance

```typescript
async getTokenBalance(contractId: string, ownerAddress: string): Promise<number> {
  const contract = new Contract(contractId);

  const account = await this.server.getAccount(this.platformKeypair.publicKey());
  const txBuilder = new TransactionBuilder(account, {
    fee: '100000',
    networkPassphrase: this.networkPassphrase,
  });

  const operation = contract.call(
    'balance_of',
    nativeToScVal(ownerAddress, { type: 'address' }),
  );

  txBuilder.addOperation(operation);
  const tx = txBuilder.setTimeout(300).build();

  // Simulate (read-only, no firma ni submit)
  const simulated = await this.server.simulateTransaction(tx);

  if (simulated.results && simulated.results[0]) {
    const balance = scValToNative(simulated.results[0].retval);
    return Number(balance) / 10000000;  // Convert from 7 decimals
  }

  return 0;
}
```

#### Interacción con Marketplace

##### 1. Create Listing

```typescript
async createListing(
  sellerSecretKey: string,
  tokenContractId: string,
  amount: bigint,
  pricePerToken: bigint,
): Promise<number> {
  const sellerKeypair = Keypair.fromSecret(sellerSecretKey);
  const marketplaceAddress = this.configService.get('MARKETPLACE_CONTRACT_ID');

  // 1. Approve marketplace to transfer tokens
  await this.approvePropertyTokens(
    sellerSecretKey,
    tokenContractId,
    marketplaceAddress,
    amount,
  );

  // 2. Call marketplace.list_property()
  const contract = new Contract(marketplaceAddress);
  const operation = contract.call(
    'list_property',
    nativeToScVal(sellerKeypair.publicKey(), { type: 'address' }),
    nativeToScVal(tokenContractId, { type: 'address' }),
    nativeToScVal(amount, { type: 'i128' }),
    nativeToScVal(pricePerToken, { type: 'i128' }),
  );

  const txHash = await this.submitTransaction(sellerKeypair, [operation]);

  // Extract listing_id from return value
  const tx = await this.server.getTransaction(txHash);
  const listingId = scValToNative(tx.returnValue);

  return listingId;
}
```

##### 2. Buy Tokens

```typescript
async buyFromListing(
  buyerSecretKey: string,
  listingId: number,
  amount: bigint,
): Promise<string> {
  const buyerKeypair = Keypair.fromSecret(buyerSecretKey);
  const marketplaceAddress = this.configService.get('MARKETPLACE_CONTRACT_ID');
  const usdcAddress = this.configService.get('USDC_CONTRACT_ID');

  // 1. Get listing details para calcular total price
  const listing = await this.getListing(listingId);
  const totalPrice = BigInt(amount) * BigInt(listing.pricePerToken);

  // 2. Approve USDC
  await this.approveUsdcForMarketplace(buyerSecretKey, totalPrice);

  // 3. Call marketplace.buy_tokens()
  const contract = new Contract(marketplaceAddress);
  const operation = contract.call(
    'buy_tokens',
    nativeToScVal(buyerKeypair.publicKey(), { type: 'address' }),
    nativeToScVal(listingId, { type: 'u64' }),
    nativeToScVal(amount, { type: 'i128' }),
    nativeToScVal(usdcAddress, { type: 'address' }),
  );

  return this.submitTransaction(buyerKeypair, [operation]);
}
```

#### Interacción con Registry

```typescript
async registerProperty(
  adminSecretKey: string,
  propertyId: string,
  legalId: string,
  ownerAddress: string,
  valuation: bigint,
  tokenContract: string,
): Promise<string> {
  const adminKeypair = Keypair.fromSecret(adminSecretKey);
  const registryAddress = this.configService.get('REGISTRY_CONTRACT_ID');

  const contract = new Contract(registryAddress);
  const operation = contract.call(
    'register_property',
    nativeToScVal(propertyId, { type: 'string' }),
    nativeToScVal(ownerAddress, { type: 'address' }),
    nativeToScVal('Physical address here', { type: 'string' }),
    nativeToScVal(valuation, { type: 'i128' }),
    nativeToScVal(legalId, { type: 'string' }),
    nativeToScVal(tokenContract, { type: 'address' }),
  );

  return this.submitTransaction(adminKeypair, [operation]);
}
```

#### Helper: Submit Transaction

```typescript
private async submitTransaction(
  signer: Keypair,
  operations: Operation[],
): Promise<string> {
  const account = await this.server.getAccount(signer.publicKey());

  const txBuilder = new TransactionBuilder(account, {
    fee: '100000',
    networkPassphrase: this.networkPassphrase,
  });

  operations.forEach(op => txBuilder.addOperation(op));
  const tx = txBuilder.setTimeout(300).build();

  // Simulate
  const simulated = await this.server.simulateTransaction(tx);
  if (SorobanRpc.Api.isSimulationError(simulated)) {
    throw new Error(`Simulation failed: ${simulated.error}`);
  }

  // Assemble
  const prepared = SorobanRpc.assembleTransaction(tx, simulated);
  prepared.sign(signer);

  // Submit
  const result = await this.server.sendTransaction(prepared);

  // Poll for result
  let status = await this.server.getTransaction(result.hash);
  let attempts = 0;
  while (status.status === 'PENDING' && attempts < 30) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    status = await this.server.getTransaction(result.hash);
    attempts++;
  }

  if (status.status !== 'SUCCESS') {
    throw new Error(`Transaction failed: ${status.status}`);
  }

  return result.hash;
}
```

---

### 4.4 PropertiesModule

**📁 Ubicación:** `/src/modules/properties/`

#### Entity

```typescript
@Entity('properties')
export class PropertyEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, nullable: true })
  contractId: string;  // Stellar contract address

  @Column({ unique: true })
  propertyId: string;  // Business ID (PROP-2024-001)

  @Column()
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column()
  address: string;  // Physical address

  @Column({ type: 'bigint' })
  totalSupply: string;  // Total tokens

  @Column({ type: 'bigint' })
  valuation: string;  // Valuation in cents

  @Column({ default: 7 })
  decimals: number;

  @Column()
  legalOwner: string;  // Legal owner name

  @Column({ default: false })
  verified: boolean;

  @Column()
  adminAddress: string;  // Stellar address of admin

  @Column({ type: 'text', nullable: true })
  metadata: string;  // JSON string

  @Column({ nullable: true })
  registryTxHash: string;  // Registry registration tx

  @Column({ type: 'simple-array', nullable: true })
  images: string[];  // Cloudflare R2 URLs

  @Column({ nullable: true })
  valuationDocument: string;  // R2 URL

  @Column({ nullable: true })
  evaluatorId: number;

  @Column({ nullable: true })
  verificationId: number;

  @OneToMany(() => OwnershipEntity, ownership => ownership.property)
  ownerships: OwnershipEntity[];

  @OneToMany(() => ListingEntity, listing => listing.property)
  listings: ListingEntity[];

  @ManyToOne(() => EvaluatorEntity, { nullable: true })
  @JoinColumn({ name: 'evaluatorId' })
  evaluator: EvaluatorEntity;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
```

#### DTO: CreatePropertyDto

```typescript
export class CreatePropertyDto {
  @IsString()
  @IsNotEmpty()
  propertyId: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsNumber()
  @Min(1)
  totalSupply: number;  // Will be converted to bigint

  @IsNumber()
  @Min(1)
  valuation: number;

  @IsString()
  @IsNotEmpty()
  legalOwner: string;

  @IsString()
  @IsOptional()
  adminSecretKey?: string;  // If provided, deploy to blockchain

  @IsObject()
  @IsOptional()
  metadata?: {
    bedrooms?: number;
    bathrooms?: number;
    area?: number;
    amenities?: string[];
    yearBuilt?: number;
    propertyType?: string;
  };

  @IsNumber()
  @IsOptional()
  evaluatorId?: number;
}
```

#### Service

```typescript
@Injectable()
export class PropertiesService {
  constructor(
    @InjectRepository(PropertyEntity)
    private propertiesRepo: Repository<PropertyEntity>,
    private stellarService: StellarService,
    private cloudflareService: CloudflareService,
    private ownershipService: OwnershipService,
  ) {}

  async create(dto: CreatePropertyDto, userAddress: string): Promise<PropertyEntity> {
    let contractId: string | null = null;
    let registryTxHash: string | null = null;

    // Si se provee adminSecretKey, deployar a blockchain
    if (dto.adminSecretKey) {
      try {
        // 1. Deploy PropertyToken via Deployer
        contractId = await this.stellarService.deployPropertyToken(
          dto.adminSecretKey,
          dto.propertyId,
          dto.name,
          dto.propertyId.substring(0, 8),  // Symbol
          BigInt(dto.totalSupply) * BigInt(10000000),  // 7 decimals
        );

        // 2. Register in Registry
        registryTxHash = await this.stellarService.registerProperty(
          dto.adminSecretKey,
          dto.propertyId,
          `LEGAL-${dto.propertyId}`,
          userAddress,
          BigInt(dto.valuation) * BigInt(10000000),
          contractId,
        );
      } catch (error) {
        this.logger.error(`Blockchain deployment failed: ${error.message}`);
        // Continue sin contractId (se puede deployar después)
      }
    }

    // 3. Save to PostgreSQL
    const property = this.propertiesRepo.create({
      ...dto,
      contractId,
      adminAddress: userAddress,
      totalSupply: (BigInt(dto.totalSupply) * BigInt(10000000)).toString(),
      valuation: (BigInt(dto.valuation) * BigInt(100)).toString(),
      metadata: dto.metadata ? JSON.stringify(dto.metadata) : null,
      registryTxHash,
    });

    const saved = await this.propertiesRepo.save(property);

    // 4. Create initial ownership record (100% to admin)
    if (contractId) {
      await this.ownershipService.create({
        propertyId: saved.id,
        ownerAddress: userAddress,
        balance: saved.totalSupply,
        percentage: 100,
        lastTxHash: registryTxHash,
      });
    }

    return saved;
  }

  async addImages(propertyId: number, files: Express.Multer.File[]): Promise<string[]> {
    const property = await this.findOne(propertyId);

    const urls = await this.cloudflareService.uploadMultipleToCloudflare(
      files,
      'properties'
    );

    property.images = [...(property.images || []), ...urls];
    await this.propertiesRepo.save(property);

    return urls;
  }

  async addValuationDocument(
    propertyId: number,
    file: Express.Multer.File
  ): Promise<string> {
    const property = await this.findOne(propertyId);

    const { url } = await this.cloudflareService.uploadToCloudflare(file, 'valuations');

    property.valuationDocument = url;
    await this.propertiesRepo.save(property);

    return url;
  }

  async verifyProperty(
    propertyId: number,
    adminSecretKey: string
  ): Promise<PropertyEntity> {
    const property = await this.findOne(propertyId);

    if (!property.contractId) {
      throw new BadRequestException('Property not deployed to blockchain');
    }

    // Verify on blockchain
    await this.stellarService.verifyProperty(
      adminSecretKey,
      property.propertyId
    );

    property.verified = true;
    return this.propertiesRepo.save(property);
  }

  async findByOwner(ownerAddress: string): Promise<PropertyEntity[]> {
    return this.propertiesRepo.find({
      where: { adminAddress: ownerAddress },
      relations: ['ownerships', 'listings', 'evaluator'],
    });
  }

  async findInvestments(investorAddress: string): Promise<PropertyEntity[]> {
    // Properties donde el usuario tiene ownership > 0 pero no es admin
    return this.propertiesRepo
      .createQueryBuilder('property')
      .leftJoinAndSelect('property.ownerships', 'ownership')
      .where('ownership.ownerAddress = :address', { address: investorAddress })
      .andWhere('property.adminAddress != :address', { address: investorAddress })
      .getMany();
  }

  async findAll(filters?: {
    verified?: boolean;
    minValuation?: number;
    maxValuation?: number;
  }): Promise<PropertyEntity[]> {
    const qb = this.propertiesRepo.createQueryBuilder('property');

    if (filters?.verified !== undefined) {
      qb.andWhere('property.verified = :verified', { verified: filters.verified });
    }

    if (filters?.minValuation) {
      qb.andWhere('property.valuation >= :min', {
        min: (BigInt(filters.minValuation) * BigInt(100)).toString()
      });
    }

    if (filters?.maxValuation) {
      qb.andWhere('property.valuation <= :max', {
        max: (BigInt(filters.maxValuation) * BigInt(100)).toString()
      });
    }

    return qb.getMany();
  }

  async findOne(id: number): Promise<PropertyEntity> {
    const property = await this.propertiesRepo.findOne({
      where: { id },
      relations: ['ownerships', 'listings', 'evaluator'],
    });

    if (!property) {
      throw new NotFoundException(`Property ${id} not found`);
    }

    return property;
  }

  async getPropertyHistory(propertyId: string): Promise<any[]> {
    // Query blockchain registry para obtener ownership history
    return this.stellarService.getPropertyHistory(propertyId);
  }
}
```

#### Controller

```typescript
@Controller('properties')
@UseGuards(JwtAuthGuard)
export class PropertiesController {
  constructor(private propertiesService: PropertiesService) {}

  @Get()
  async findAll(@Query() filters: any) {
    return this.propertiesService.findAll(filters);
  }

  @Get('my-owned')
  async getMyProperties(@CurrentUser() user: UserEntity) {
    return this.propertiesService.findByOwner(user.stellarPublicKey);
  }

  @Get('my-investments')
  async getMyInvestments(@CurrentUser() user: UserEntity) {
    return this.propertiesService.findInvestments(user.stellarPublicKey);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.propertiesService.findOne(id);
  }

  @Post()
  async create(@Body() dto: CreatePropertyDto, @CurrentUser() user: UserEntity) {
    return this.propertiesService.create(dto, user.stellarPublicKey);
  }

  @Post(':id/images')
  @UseInterceptors(FilesInterceptor('images', 10))
  async uploadImages(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.propertiesService.addImages(id, files);
  }

  @Post(':id/valuation')
  @UseInterceptors(FileInterceptor('document'))
  async uploadValuation(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.propertiesService.addValuationDocument(id, file);
  }

  @Post(':id/verify')
  @Roles('admin')
  async verify(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: { adminSecretKey: string },
  ) {
    return this.propertiesService.verifyProperty(id, dto.adminSecretKey);
  }

  @Get(':propertyId/history')
  async getHistory(@Param('propertyId') propertyId: string) {
    return this.propertiesService.getPropertyHistory(propertyId);
  }
}
```

---

### 4.5 MarketplaceModule

**📁 Ubicación:** `/src/modules/marketplace/`

#### Entities

**ListingEntity:**
```typescript
@Entity('listings')
export class ListingEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  listingId: string;  // Blockchain listing ID

  @Column()
  propertyId: number;

  @ManyToOne(() => PropertyEntity, property => property.listings)
  @JoinColumn({ name: 'propertyId' })
  property: PropertyEntity;

  @Column()
  sellerAddress: string;

  @Column({ type: 'bigint' })
  amount: string;  // Current amount available

  @Column({ type: 'bigint' })
  initialAmount: string;  // Original amount listed

  @Column({ type: 'bigint' })
  pricePerToken: string;  // In USDC (7 decimals)

  @Column({ type: 'bigint' })
  totalPrice: string;  // amount * pricePerToken

  @Column({
    type: 'enum',
    enum: ['active', 'sold', 'cancelled'],
    default: 'active'
  })
  status: string;

  @Column({ nullable: true })
  txHash: string;

  @Column({ nullable: true })
  expiresAt: Date;

  @OneToMany(() => TransactionEntity, tx => tx.listing)
  transactions: TransactionEntity[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
```

**TransactionEntity:**
```typescript
@Entity('transactions')
export class TransactionEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  txHash: string;  // Stellar transaction hash

  @Column()
  listingId: number;

  @ManyToOne(() => ListingEntity, listing => listing.transactions)
  @JoinColumn({ name: 'listingId' })
  listing: ListingEntity;

  @Column()
  buyerAddress: string;

  @Column()
  sellerAddress: string;

  @Column({ type: 'bigint' })
  amount: string;

  @Column({ type: 'bigint' })
  pricePerToken: string;

  @Column({ type: 'bigint' })
  totalPrice: string;

  @Column({ nullable: true })
  escrowContractId: string;

  @Column({ type: 'text', nullable: true })
  metadata: string;  // JSON

  @CreateDateColumn()
  createdAt: Date;
}
```

#### Service

```typescript
@Injectable()
export class MarketplaceService {
  constructor(
    @InjectRepository(ListingEntity)
    private listingsRepo: Repository<ListingEntity>,
    @InjectRepository(TransactionEntity)
    private transactionsRepo: Repository<TransactionEntity>,
    private stellarService: StellarService,
    private propertiesService: PropertiesService,
    private ownershipService: OwnershipService,
    private kycService: KycService,
  ) {}

  async createListing(dto: {
    propertyId: number;
    sellerSecretKey: string;
    amount: number;
    pricePerToken: number;
    expirationDays?: number;
  }): Promise<ListingEntity> {
    const property = await this.propertiesService.findOne(dto.propertyId);

    if (!property.contractId) {
      throw new BadRequestException('Property not deployed');
    }

    // Validate seller ownership
    const ownership = await this.ownershipService.findByPropertyAndOwner(
      dto.propertyId,
      Keypair.fromSecret(dto.sellerSecretKey).publicKey()
    );

    if (!ownership || BigInt(ownership.balance) < BigInt(dto.amount) * BigInt(10000000)) {
      throw new BadRequestException('Insufficient balance');
    }

    // Call blockchain
    const blockchainListingId = await this.stellarService.createListing(
      dto.sellerSecretKey,
      property.contractId,
      BigInt(dto.amount) * BigInt(10000000),
      BigInt(dto.pricePerToken) * BigInt(10000000),
    );

    // Save to DB
    const listing = this.listingsRepo.create({
      listingId: blockchainListingId.toString(),
      propertyId: dto.propertyId,
      sellerAddress: Keypair.fromSecret(dto.sellerSecretKey).publicKey(),
      amount: (BigInt(dto.amount) * BigInt(10000000)).toString(),
      initialAmount: (BigInt(dto.amount) * BigInt(10000000)).toString(),
      pricePerToken: (BigInt(dto.pricePerToken) * BigInt(10000000)).toString(),
      totalPrice: (
        BigInt(dto.amount) * BigInt(dto.pricePerToken) * BigInt(10000000)
      ).toString(),
      expiresAt: dto.expirationDays
        ? new Date(Date.now() + dto.expirationDays * 24 * 60 * 60 * 1000)
        : null,
    });

    return this.listingsRepo.save(listing);
  }

  async buyTokens(dto: {
    listingId: number;
    buyerSecretKey: string;
    amount: number;
  }): Promise<{ transaction: TransactionEntity; listing: ListingEntity }> {
    const listing = await this.findOne(dto.listingId);

    if (listing.status !== 'active') {
      throw new BadRequestException('Listing not active');
    }

    const buyerAddress = Keypair.fromSecret(dto.buyerSecretKey).publicKey();
    const amountWithDecimals = BigInt(dto.amount) * BigInt(10000000);

    // Validate KYC
    const totalPrice =
      BigInt(amountWithDecimals) * BigInt(listing.pricePerToken) / BigInt(10000000);
    const canTransact = await this.kycService.canUserMakeTransaction(
      buyerAddress,
      Number(totalPrice) / 10000000
    );

    if (!canTransact) {
      throw new ForbiddenException('KYC required for this transaction amount');
    }

    // Call blockchain
    const txHash = await this.stellarService.buyFromListing(
      dto.buyerSecretKey,
      Number(listing.listingId),
      amountWithDecimals,
    );

    // Update listing
    const newAmount = BigInt(listing.amount) - amountWithDecimals;
    listing.amount = newAmount.toString();
    if (newAmount === BigInt(0)) {
      listing.status = 'sold';
    }
    await this.listingsRepo.save(listing);

    // Create transaction record
    const transaction = this.transactionsRepo.create({
      txHash,
      listingId: listing.id,
      buyerAddress,
      sellerAddress: listing.sellerAddress,
      amount: amountWithDecimals.toString(),
      pricePerToken: listing.pricePerToken,
      totalPrice: totalPrice.toString(),
    });
    await this.transactionsRepo.save(transaction);

    // Update ownership
    await this.ownershipService.updateAfterPurchase(
      listing.propertyId,
      buyerAddress,
      amountWithDecimals.toString(),
      txHash,
    );

    return { transaction, listing };
  }

  async cancelListing(listingId: number, sellerSecretKey: string): Promise<void> {
    const listing = await this.findOne(listingId);

    const sellerAddress = Keypair.fromSecret(sellerSecretKey).publicKey();
    if (listing.sellerAddress !== sellerAddress) {
      throw new ForbiddenException('Not listing owner');
    }

    // Call blockchain
    await this.stellarService.cancelListing(
      sellerSecretKey,
      Number(listing.listingId)
    );

    listing.status = 'cancelled';
    await this.listingsRepo.save(listing);
  }

  async findAll(filters?: {
    propertyId?: number;
    status?: string;
    minPrice?: number;
    maxPrice?: number;
  }): Promise<ListingEntity[]> {
    const qb = this.listingsRepo.createQueryBuilder('listing')
      .leftJoinAndSelect('listing.property', 'property');

    if (filters?.propertyId) {
      qb.andWhere('listing.propertyId = :propertyId', { propertyId: filters.propertyId });
    }

    if (filters?.status) {
      qb.andWhere('listing.status = :status', { status: filters.status });
    }

    if (filters?.minPrice) {
      qb.andWhere('listing.pricePerToken >= :min', {
        min: (BigInt(filters.minPrice) * BigInt(10000000)).toString()
      });
    }

    if (filters?.maxPrice) {
      qb.andWhere('listing.pricePerToken <= :max', {
        max: (BigInt(filters.maxPrice) * BigInt(10000000)).toString()
      });
    }

    return qb.orderBy('listing.createdAt', 'DESC').getMany();
  }

  async findOne(id: number): Promise<ListingEntity> {
    const listing = await this.listingsRepo.findOne({
      where: { id },
      relations: ['property', 'transactions'],
    });

    if (!listing) {
      throw new NotFoundException(`Listing ${id} not found`);
    }

    return listing;
  }

  async getTransactionsByListing(
    listingId: number,
    page: number = 1,
    limit: number = 50
  ): Promise<{ transactions: TransactionEntity[]; total: number }> {
    // Enforce pagination para prevenir unbounded queries
    const maxLimit = 100;
    const safeLimit = Math.min(limit, maxLimit);

    const [transactions, total] = await this.transactionsRepo.findAndCount({
      where: { listingId },
      order: { createdAt: 'DESC' },
      skip: (page - 1) * safeLimit,
      take: safeLimit,
    });

    return { transactions, total };
  }

  async getMarketplaceStats(): Promise<{
    totalVolume: string;
    activeListings: number;
    totalTransactions: number;
  }> {
    const [activeListings, totalTransactions] = await Promise.all([
      this.listingsRepo.count({ where: { status: 'active' } }),
      this.transactionsRepo.count(),
    ]);

    const volumeResult = await this.transactionsRepo
      .createQueryBuilder('tx')
      .select('SUM(tx.totalPrice)', 'total')
      .getRawOne();

    return {
      totalVolume: volumeResult?.total || '0',
      activeListings,
      totalTransactions,
    };
  }

  @Cron('0 3 * * *')  // Daily at 3 AM
  async cleanupOldTransactions() {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const deleted = await this.transactionsRepo
      .createQueryBuilder()
      .delete()
      .where('createdAt < :date', { date: thirtyDaysAgo })
      .execute();

    this.logger.log(`Deleted ${deleted.affected} old transactions`);
  }
}
```

---

### 4.6 KycModule

**📁 Ubicación:** `/src/modules/kyc/`

#### Entity

```typescript
@Entity('kyc_verifications')
export class KYCVerificationEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'userId' })
  user: UserEntity;

  @Column({
    type: 'enum',
    enum: ['level1', 'level2', 'level3'],
  })
  level: string;

  @Column({ default: 'veriff' })
  provider: string;

  @Column({ nullable: true })
  sessionId: string;  // Veriff session ID

  @Column({ nullable: true })
  externalVerificationId: string;  // Veriff verification ID

  @Column({
    type: 'enum',
    enum: ['not_started', 'pending', 'approved', 'rejected', 'expired'],
    default: 'not_started',
  })
  status: string;

  @Column({ nullable: true })
  verificationUrl: string;  // Interactive URL para usuario

  @Column({ type: 'text', nullable: true })
  verificationData: string;  // JSON con datos de Veriff

  @Column({ nullable: true })
  rejectionReason: string;

  @Column({ default: 0 })
  retryCount: number;

  @Column({ nullable: true })
  expiresAt: Date;

  @Column({ nullable: true })
  completedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
```

#### Service

```typescript
@Injectable()
export class KycService {
  private readonly VERIFF_API_URL = 'https://stationapi.veriff.com';
  private readonly MAX_RETRIES = 3;

  private readonly LIMITS = {
    level1: 5000,      // $5,000 monthly
    level2: 50000,     // $50,000 monthly
    level3: Infinity,  // Unlimited
  };

  constructor(
    @InjectRepository(KYCVerificationEntity)
    private kycRepo: Repository<KYCVerificationEntity>,
    private configService: ConfigService,
    private httpService: HttpService,
  ) {}

  async startKYCVerification(
    userId: number,
    level: 'level1' | 'level2' | 'level3'
  ): Promise<{ verificationUrl: string; sessionId: string }> {
    // Check existing verification
    const existing = await this.kycRepo.findOne({
      where: { userId, status: 'approved' },
    });

    if (existing && this.LIMITS[existing.level] >= this.LIMITS[level]) {
      throw new BadRequestException('Already verified at this level or higher');
    }

    // Create Veriff session
    const response = await this.httpService.post(
      `${this.VERIFF_API_URL}/v1/sessions`,
      {
        verification: {
          callback: `${this.configService.get('API_BASE_URL')}/kyc/webhook`,
          person: {
            // User data will be collected in Veriff UI
          },
          document: {
            country: 'US',  // Will be updated by user
            type: 'DRIVERS_LICENSE',
          },
          vendorData: JSON.stringify({ userId, level }),
        },
      },
      {
        headers: {
          'X-AUTH-CLIENT': this.configService.get('VERIFF_API_KEY'),
          'Content-Type': 'application/json',
        },
      }
    ).toPromise();

    const { id: sessionId, url: verificationUrl } = response.data.verification;

    // Save to DB
    const kyc = this.kycRepo.create({
      userId,
      level,
      sessionId,
      status: 'pending',
      verificationUrl,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),  // 7 days
    });

    await this.kycRepo.save(kyc);

    return { verificationUrl, sessionId };
  }

  async getKYCStatus(userId: number): Promise<KYCVerificationEntity> {
    const kyc = await this.kycRepo.findOne({
      where: { userId },
      order: { createdAt: 'DESC' },
    });

    if (!kyc) {
      throw new NotFoundException('No KYC verification found');
    }

    // Si está pending, poll Veriff
    if (kyc.status === 'pending' && kyc.sessionId) {
      await this.pollVeriffDecision(kyc);
    }

    return kyc;
  }

  async processKYCWebhook(payload: any, signature: string): Promise<void> {
    // Validate HMAC signature
    const expectedSignature = crypto
      .createHmac('sha256', this.configService.get('VERIFF_SECRET_KEY'))
      .update(JSON.stringify(payload))
      .digest('hex');

    if (signature !== expectedSignature) {
      throw new UnauthorizedException('Invalid signature');
    }

    const { id: sessionId, code, status, reason } = payload.verification;

    // Parse vendorData to get userId
    const vendorData = JSON.parse(payload.verification.vendorData || '{}');
    const userId = vendorData.userId;

    if (!userId) {
      this.logger.error('No userId in vendorData');
      return;
    }

    const kyc = await this.kycRepo.findOne({ where: { userId, sessionId } });

    if (!kyc) {
      this.logger.error(`KYC not found for userId ${userId} and sessionId ${sessionId}`);
      return;
    }

    // Update based on Veriff decision
    if (code === 9001 && status === 'approved') {
      kyc.status = 'approved';
      kyc.completedAt = new Date();
      kyc.externalVerificationId = payload.verification.id;
      kyc.verificationData = JSON.stringify(payload);
    } else if (status === 'declined') {
      kyc.status = 'rejected';
      kyc.rejectionReason = reason;
      kyc.verificationData = JSON.stringify(payload);
    }

    await this.kycRepo.save(kyc);

    // Update user KYC status
    await this.updateUserKYCStatus(userId, kyc.status);
  }

  async retryKYC(userId: number): Promise<{ verificationUrl: string }> {
    const lastKyc = await this.kycRepo.findOne({
      where: { userId },
      order: { createdAt: 'DESC' },
    });

    if (!lastKyc || lastKyc.status !== 'rejected') {
      throw new BadRequestException('No rejected KYC to retry');
    }

    if (lastKyc.retryCount >= this.MAX_RETRIES) {
      throw new BadRequestException('Max retries reached');
    }

    const { verificationUrl, sessionId } = await this.startKYCVerification(
      userId,
      lastKyc.level as any
    );

    lastKyc.retryCount += 1;
    await this.kycRepo.save(lastKyc);

    return { verificationUrl };
  }

  async canUserMakeTransaction(userAddress: string, amount: number): Promise<boolean> {
    const user = await this.userService.findByAddress(userAddress);
    if (!user) return false;

    const kyc = await this.kycRepo.findOne({
      where: { userId: user.id, status: 'approved' },
      order: { createdAt: 'DESC' },
    });

    if (!kyc) {
      return amount <= this.LIMITS.level1;  // No KYC = level1 limits
    }

    // Check monthly volume
    const monthlyVolume = await this.calculateMonthlyVolume(user.id);
    const limit = this.LIMITS[kyc.level];

    return monthlyVolume + amount <= limit;
  }

  private async pollVeriffDecision(kyc: KYCVerificationEntity): Promise<void> {
    try {
      const response = await this.httpService.get(
        `${this.VERIFF_API_URL}/v1/sessions/${kyc.sessionId}/decision`,
        {
          headers: {
            'X-AUTH-CLIENT': this.configService.get('VERIFF_API_KEY'),
          },
        }
      ).toPromise();

      const { status, code, reason } = response.data.verification;

      if (status === 'approved') {
        kyc.status = 'approved';
        kyc.completedAt = new Date();
      } else if (status === 'declined') {
        kyc.status = 'rejected';
        kyc.rejectionReason = reason;
      }

      kyc.verificationData = JSON.stringify(response.data);
      await this.kycRepo.save(kyc);
    } catch (error) {
      this.logger.error(`Error polling Veriff: ${error.message}`);
    }
  }

  private async calculateMonthlyVolume(userId: number): Promise<number> {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const transactions = await this.transactionsRepo.find({
      where: {
        buyerAddress: (await this.userService.findById(userId)).stellarPublicKey,
        createdAt: MoreThan(startOfMonth),
      },
    });

    return transactions.reduce((sum, tx) => sum + Number(tx.totalPrice) / 10000000, 0);
  }

  async fixExternalVerificationId(userId: number): Promise<void> {
    const kyc = await this.getKYCStatus(userId);

    if (!kyc.verificationUrl) {
      throw new BadRequestException('No verification URL');
    }

    // Extract session_id from JWT in URL
    const urlParams = new URL(kyc.verificationUrl).searchParams;
    const sessionToken = urlParams.get('session_token');

    if (sessionToken) {
      const decoded = jwt.decode(sessionToken);
      kyc.externalVerificationId = decoded?.session_id || null;
      await this.kycRepo.save(kyc);
    }
  }
}
```

---

## 5. BASE DE DATOS Y MODELO DE DATOS

### 5.1 Esquema PostgreSQL Completo

#### Tabla: `user`
```sql
CREATE TABLE "user" (
  id SERIAL PRIMARY KEY,
  stellar_public_key VARCHAR(56) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE,
  name VARCHAR(255),
  last_name VARCHAR(255),
  password VARCHAR(255),
  phone_number VARCHAR(20),
  role VARCHAR(20) DEFAULT 'user',  -- user, admin, evaluator
  status VARCHAR(20) DEFAULT 'active',
  kyc_status VARCHAR(20) DEFAULT 'not_verified',
  country VARCHAR(100),
  city VARCHAR(100),
  address TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### Tabla: `properties`
```sql
CREATE TABLE properties (
  id SERIAL PRIMARY KEY,
  contract_id VARCHAR(56) UNIQUE,
  property_id VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  address TEXT NOT NULL,
  total_supply BIGINT NOT NULL,
  valuation BIGINT NOT NULL,
  decimals INTEGER DEFAULT 7,
  legal_owner VARCHAR(255),
  verified BOOLEAN DEFAULT FALSE,
  admin_address VARCHAR(56) NOT NULL,
  metadata TEXT,  -- JSON string
  registry_tx_hash VARCHAR(64),
  images TEXT[],
  valuation_document VARCHAR(500),
  evaluator_id INTEGER REFERENCES evaluators(id),
  verification_id INTEGER,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### Tabla: `ownerships`
```sql
CREATE TABLE ownerships (
  id SERIAL PRIMARY KEY,
  property_id INTEGER REFERENCES properties(id) ON DELETE CASCADE,
  owner_address VARCHAR(56) NOT NULL,
  balance BIGINT NOT NULL,
  percentage DECIMAL(10, 2),
  last_tx_hash VARCHAR(64),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(property_id, owner_address)
);
```

#### Tabla: `listings`
```sql
CREATE TABLE listings (
  id SERIAL PRIMARY KEY,
  listing_id VARCHAR(20) NOT NULL,
  property_id INTEGER REFERENCES properties(id) ON DELETE CASCADE,
  seller_address VARCHAR(56) NOT NULL,
  amount BIGINT NOT NULL,
  initial_amount BIGINT NOT NULL,
  price_per_token BIGINT NOT NULL,
  total_price BIGINT NOT NULL,
  status VARCHAR(20) DEFAULT 'active',  -- active, sold, cancelled
  tx_hash VARCHAR(64),
  expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### Tabla: `transactions`
```sql
CREATE TABLE transactions (
  id SERIAL PRIMARY KEY,
  tx_hash VARCHAR(64) UNIQUE NOT NULL,
  listing_id INTEGER REFERENCES listings(id),
  buyer_address VARCHAR(56) NOT NULL,
  seller_address VARCHAR(56) NOT NULL,
  amount BIGINT NOT NULL,
  price_per_token BIGINT NOT NULL,
  total_price BIGINT NOT NULL,
  escrow_contract_id VARCHAR(56),
  metadata TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### Tabla: `kyc_verifications`
```sql
CREATE TABLE kyc_verifications (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES "user"(id),
  level VARCHAR(10) NOT NULL,  -- level1, level2, level3
  provider VARCHAR(20) DEFAULT 'veriff',
  session_id VARCHAR(100),
  external_verification_id VARCHAR(100),
  status VARCHAR(20) DEFAULT 'not_started',
  verification_url TEXT,
  verification_data TEXT,
  rejection_reason TEXT,
  retry_count INTEGER DEFAULT 0,
  expires_at TIMESTAMP,
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### Tabla: `anchor_transactions`
```sql
CREATE TABLE anchor_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stellar_address VARCHAR(56) NOT NULL,
  type VARCHAR(20) NOT NULL,  -- deposit, withdrawal
  status VARCHAR(50) DEFAULT 'incomplete',
  asset_code VARCHAR(10) NOT NULL,
  amount DECIMAL(20, 7) NOT NULL,
  fee_fixed DECIMAL(10, 2),
  fee_percent DECIMAL(5, 2),
  interactive_url TEXT,
  stellar_tx_id VARCHAR(64),
  external_tx_id VARCHAR(100),
  from_data TEXT,
  to_data TEXT,
  metadata TEXT,
  expires_at TIMESTAMP,
  started_at TIMESTAMP,
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### Tabla: `evaluators`
```sql
CREATE TABLE evaluators (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20),
  specialization VARCHAR(100),
  license_number VARCHAR(50),
  verified BOOLEAN DEFAULT FALSE,
  rating DECIMAL(3, 2),
  completed_evaluations INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### 5.2 Relaciones Clave

```
user (1) ----< (N) kyc_verifications
user (1) ----< (N) properties (via adminAddress)

properties (1) ----< (N) ownerships
properties (1) ----< (N) listings
properties (N) ----< (1) evaluators

listings (1) ----< (N) transactions

user (N) ----< (N) ownerships (via ownerAddress)
```

### 5.3 Índices Recomendados

```sql
-- Performance optimization
CREATE INDEX idx_properties_admin ON properties(admin_address);
CREATE INDEX idx_properties_verified ON properties(verified);
CREATE INDEX idx_ownerships_owner ON ownerships(owner_address);
CREATE INDEX idx_ownerships_property ON ownerships(property_id);
CREATE INDEX idx_listings_status ON listings(status);
CREATE INDEX idx_listings_property ON listings(property_id);
CREATE INDEX idx_transactions_buyer ON transactions(buyer_address);
CREATE INDEX idx_transactions_seller ON transactions(seller_address);
CREATE INDEX idx_kyc_user ON kyc_verifications(user_id);
CREATE INDEX idx_kyc_status ON kyc_verifications(status);
CREATE INDEX idx_anchors_address ON anchor_transactions(stellar_address);
```

### 5.4 Data Seed (DATABASE_SEED.sql)

El proyecto incluye datos de prueba completos:

**Users:**
- `admin@blocki.com` / `admin123` (Admin)
- `vendedor@blocki.com` / `vendedor123` (Property Owner)
- `comprador@blocki.com` / `comprador123` (Investor)
- `test-hacka@blocki.com` / `test123` (Test User)

**Properties:**
- 5 propiedades tokenizadas (casas, apartamentos, hotel, comercial)
- Total valuation: $5,350,000 USD

**Ownerships:**
- 7 registros de ownership distribuidos
- Ejemplos de propiedad fraccionada (50/50, 60/40, etc.)

**Listings:**
- 3 listings activos
- 1 listing sold (ejemplo histórico)

**Transactions:**
- 4 transacciones históricas de ejemplo

---

## 6. SISTEMA DE AUTENTICACIÓN

### 6.1 Stellar Wallet Authentication

#### Flujo Completo

```
┌────────────┐                           ┌────────────┐
│   CLIENT   │                           │  BACKEND   │
└──────┬─────┘                           └──────┬─────┘
       │                                        │
       │  1. Request Challenge                  │
       │  POST /auth/stellar/challenge          │
       │  { publicKey: "GABC..." }              │
       ├───────────────────────────────────────>│
       │                                        │
       │                              2. Generate random 32-byte challenge
       │                              3. Store in Redis with 5min TTL
       │                                        │
       │  Challenge response                    │
       │  { challenge: "base64..." }            │
       │<───────────────────────────────────────┤
       │                                        │
       │  4. Sign challenge with Stellar secret │
       │     const signature = keypair.sign(challenge)
       │                                        │
       │  5. Submit signature                   │
       │  POST /auth/stellar/verify             │
       │  {                                     │
       │    publicKey: "GABC...",               │
       │    signature: "base64...",             │
       │    challenge: "base64..."              │
       │  }                                     │
       ├───────────────────────────────────────>│
       │                                        │
       │                              6. Retrieve challenge from Redis
       │                              7. Verify signature using Stellar SDK
       │                              8. Find or create user
       │                              9. Generate session token
       │                              10. Store session in Redis (7 days)
       │                                        │
       │  Session token                         │
       │  {                                     │
       │    sessionToken: "...",                │
       │    user: { ... }                       │
       │  }                                     │
       │<───────────────────────────────────────┤
       │                                        │
       │  6. Use session token in headers       │
       │  Authorization: Bearer {sessionToken}  │
       │  All subsequent requests               │
       ├───────────────────────────────────────>│
       │                                        │
       │                              Validate session from Redis
       │                                        │
```

#### Implementación Backend

**📁 `/src/modules/auth/stellar-auth.service.ts`**

```typescript
@Injectable()
export class StellarAuthService {
  private readonly CHALLENGE_TTL = 300; // 5 minutes
  private readonly SESSION_TTL = 604800; // 7 days

  async generateChallenge(publicKey: string): Promise<string> {
    // Validate Stellar public key format
    if (!publicKey.startsWith('G') || publicKey.length !== 56) {
      throw new BadRequestException('Invalid Stellar public key');
    }

    // Generate random challenge
    const challenge = crypto.randomBytes(32).toString('base64');

    // Store in Redis
    await this.redis.set(
      `challenge:${publicKey}`,
      challenge,
      'EX',
      this.CHALLENGE_TTL
    );

    return challenge;
  }

  async verifySignature(
    publicKey: string,
    signature: string,
    challenge: string
  ): Promise<{ sessionToken: string; user: UserEntity }> {
    // Retrieve challenge from Redis
    const storedChallenge = await this.redis.get(`challenge:${publicKey}`);

    if (!storedChallenge || storedChallenge !== challenge) {
      throw new UnauthorizedException('Invalid or expired challenge');
    }

    // Verify signature
    try {
      const keypair = Keypair.fromPublicKey(publicKey);
      const valid = keypair.verify(
        Buffer.from(challenge, 'base64'),
        Buffer.from(signature, 'base64')
      );

      if (!valid) {
        throw new UnauthorizedException('Invalid signature');
      }
    } catch (error) {
      throw new UnauthorizedException('Signature verification failed');
    }

    // Delete used challenge
    await this.redis.del(`challenge:${publicKey}`);

    // Find or create user
    let user = await this.userService.findByAddress(publicKey);
    if (!user) {
      user = await this.userService.create({
        stellarPublicKey: publicKey,
        role: 'user',
      });
    }

    // Generate session token
    const sessionToken = crypto.randomBytes(32).toString('hex');

    // Store session in Redis
    await this.redis.set(
      `session:${sessionToken}`,
      JSON.stringify({
        stellarAddress: publicKey,
        email: user.email,
        userType: user.role,
        kycStatus: user.kycStatus,
        createdAt: new Date().toISOString(),
      }),
      'EX',
      this.SESSION_TTL
    );

    return { sessionToken, user };
  }

  async validateSession(sessionToken: string): Promise<SessionData | null> {
    const sessionData = await this.redis.get(`session:${sessionToken}`);
    return sessionData ? JSON.parse(sessionData) : null;
  }

  async logout(sessionToken: string): Promise<void> {
    await this.redis.del(`session:${sessionToken}`);
  }
}
```

### 6.2 JWT Authentication (Alternativo)

Para usuarios con email/password:

```typescript
@Injectable()
export class AuthService {
  async register(dto: RegisterDto): Promise<UserEntity> {
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    return this.userService.create({
      ...dto,
      password: hashedPassword,
    });
  }

  async login(email: string, password: string): Promise<{ token: string }> {
    const user = await this.userService.findByEmail(email);

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const token = this.jwtService.sign(payload);

    return { token };
  }
}
```

### 6.3 Guards y Decorators

**JwtAuthGuard (Global):**
```typescript
@Injectable()
export class JwtAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const isPublic = this.reflector.get<boolean>('isPublic', context.getHandler());

    if (isPublic) {
      return true;
    }

    const token = this.extractToken(request);
    if (!token) {
      throw new UnauthorizedException();
    }

    // Validate session or JWT
    const session = await this.stellarAuthService.validateSession(token);
    if (!session) {
      throw new UnauthorizedException();
    }

    request.user = session;
    return true;
  }
}
```

**@Public() Decorator:**
```typescript
export const Public = () => SetMetadata('isPublic', true);

// Uso:
@Public()
@Post('register')
async register(@Body() dto: RegisterDto) { ... }
```

**@Roles() Decorator:**
```typescript
export const Roles = (...roles: string[]) => SetMetadata('roles', roles);

@Roles('admin')
@Post('verify-property')
async verifyProperty() { ... }
```

---

## 7. API REST COMPLETA

### 7.1 Endpoints por Módulo

#### Auth Module

```
POST   /auth/register                     - Register with email/password
POST   /auth/login                        - Login tradicional
GET    /auth/me                           - Get current user

POST   /auth/stellar/challenge            - Generate challenge
POST   /auth/stellar/verify               - Verify signature
POST   /auth/stellar/logout               - Invalidate session
GET    /auth/stellar/profile              - Get profile
POST   /auth/stellar/refresh              - Refresh session
```

#### Properties Module

```
GET    /properties                        - List all (filterable)
  ?verified=true&minValuation=100000&maxValuation=5000000

GET    /properties/my-owned               - My owned properties
GET    /properties/my-investments         - My investments
GET    /properties/:id                    - Get details
GET    /properties/:propertyId/history    - Get ownership history

POST   /properties                        - Create property
  Body: {
    propertyId, name, description, address,
    totalSupply, valuation, legalOwner,
    adminSecretKey?, metadata?, evaluatorId?
  }

PATCH  /properties/:id                    - Update property
DELETE /properties/:id                    - Delete property

POST   /properties/:id/images             - Upload images (multipart)
  Content-Type: multipart/form-data
  Field: images[] (max 10)

POST   /properties/:id/valuation          - Upload valuation doc
  Content-Type: multipart/form-data
  Field: document

POST   /properties/:id/verify             - Verify property (admin)
  Body: { adminSecretKey }
```

#### Marketplace Module

```
GET    /marketplace/listings              - List all listings
  ?propertyId=1&status=active&minPrice=5&maxPrice=100

GET    /marketplace/listings/:id          - Get listing details
GET    /marketplace/transactions          - Recent transactions
GET    /marketplace/transactions/:listingId
                                          - Get listing transactions (paginated)
  ?page=1&limit=50

GET    /marketplace/stats                 - Marketplace statistics

POST   /marketplace/listings              - Create listing
  Body: {
    propertyId, sellerSecretKey, amount,
    pricePerToken, expirationDays?
  }

POST   /marketplace/listings/buy          - Buy tokens
  Body: {
    listingId, buyerSecretKey, amount
  }

DELETE /marketplace/listings/:id          - Cancel listing
  Body: { sellerSecretKey }
```

#### KYC Module

```
GET    /kyc/status/:userId                - Get KYC status

POST   /kyc/start                         - Start KYC verification
  Body: { userId, level }
  Response: { verificationUrl, sessionId }

POST   /kyc/webhook                       - Veriff webhook (internal)

POST   /kyc/retry/:userId                 - Retry KYC
POST   /kyc/fix/:userId                   - Fix externalVerificationId
```

#### Anchors Module (SEP-24)

```
GET    /anchors/info                      - Asset info

POST   /anchors/sep24/transactions/deposit/interactive
  Body: { account, asset_code, amount }
  Response: { type: "interactive_customer_info_needed", url, id }

POST   /anchors/sep24/transactions/withdraw/interactive
  Body: { account, asset_code, amount, type }

GET    /anchors/sep24/transaction         - Get transaction
  ?id=abc123

GET    /anchors/sep24/transactions        - List transactions
  ?account=GABC...&asset_code=USD
```

#### Wallet Module

```
GET    /wallet/balance                    - Get account balance
  ?address=GABC...

GET    /wallet/transactions               - Get transaction history
  ?address=GABC...&limit=100

POST   /wallet/send                       - Send XLM/tokens
  Body: {
    fromSecretKey, toAddress,
    amount, asset?, memo?
  }
```

#### Evaluators Module

```
GET    /evaluators                        - List evaluators
GET    /evaluators/:id                    - Get evaluator
POST   /evaluators                        - Create evaluator
PATCH  /evaluators/:id                    - Update evaluator
DELETE /evaluators/:id                    - Delete evaluator
```

#### Admin Module

```
GET    /admin/stats                       - Platform statistics
POST   /admin/pause                       - Pause system
POST   /admin/unpause                     - Unpause system
```

### 7.2 Swagger Documentation

El backend expone documentación interactiva en:
- **URL:** `http://localhost:3000/api/docs`
- **Framework:** `@nestjs/swagger`

**Configuración en main.ts:**

```typescript
const config = new DocumentBuilder()
  .setTitle('Blocki - Real Estate Tokenization API')
  .setDescription('API for tokenizing real estate properties on Stellar')
  .setVersion('2.0')
  .addBearerAuth()
  .addTag('auth', 'Authentication endpoints')
  .addTag('properties', 'Property management')
  .addTag('marketplace', 'Trading and listings')
  .addTag('kyc', 'KYC verification')
  .addTag('anchors', 'Fiat on/off ramps (SEP-24)')
  .build();

const document = SwaggerModule.createDocument(app, config);
SwaggerModule.setup('api/docs', app, document);
```

**Ejemplo de decoración:**

```typescript
@ApiTags('properties')
@Controller('properties')
export class PropertiesController {
  @ApiOperation({ summary: 'Create a new property' })
  @ApiBody({ type: CreatePropertyDto })
  @ApiResponse({ status: 201, description: 'Property created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Post()
  async create(@Body() dto: CreatePropertyDto) { ... }
}
```

---

## 8. FLUJOS DE NEGOCIO

### 8.1 Tokenización de Propiedad (End-to-End)

**Actores:** Property Owner, Admin, Evaluator

**Pasos:**

1. **Owner registra propiedad**
   ```http
   POST /properties
   {
     "propertyId": "PROP-2025-001",
     "name": "Casa en Miami",
     "totalSupply": 1000000,
     "valuation": 500000,
     "adminSecretKey": "SDXXXXX..."
   }
   ```
   - Backend deploya PropertyToken contract
   - Backend registra en Registry contract
   - Minta 1M tokens al owner

2. **Owner sube documentos**
   ```http
   POST /properties/1/images (fotos de la propiedad)
   POST /properties/1/valuation (avalúo certificado)
   ```

3. **Admin asigna evaluador**
   ```http
   PATCH /properties/1
   { "evaluatorId": 3 }
   ```

4. **Evaluador realiza valuación** (offline)

5. **Admin verifica propiedad**
   ```http
   POST /properties/1/verify
   { "adminSecretKey": "SDXXXXX..." }
   ```
   - Marca `verified = true` en Registry

6. **Propiedad lista para trading**

### 8.2 Compra de Tokens (Investor Flow)

**Actores:** Seller, Buyer

**Prerequisito:** Buyer completa KYC

1. **Seller crea listing**
   ```http
   POST /marketplace/listings
   {
     "propertyId": 1,
     "sellerSecretKey": "SDXXXXX...",
     "amount": 100000,
     "pricePerToken": 5
   }
   ```
   - Seller aprueba marketplace
   - Tokens transferidos a custodia del marketplace

2. **Buyer consulta listings**
   ```http
   GET /marketplace/listings?propertyId=1
   ```

3. **Buyer compra tokens**
   ```http
   POST /marketplace/listings/buy
   {
     "listingId": 1,
     "buyerSecretKey": "SDXXXXX...",
     "amount": 10000
   }
   ```
   - Backend valida KYC limits
   - Buyer aprueba USDC
   - Marketplace.buy_tokens() ejecutado
   - USDC: Buyer → Seller
   - Tokens: Marketplace → Buyer
   - Ownership actualizado

4. **Buyer verifica ownership**
   ```http
   GET /properties/my-investments
   ```

### 8.3 KYC Verification Flow

**Actor:** User

1. **User inicia KYC**
   ```http
   POST /kyc/start
   { "userId": 1, "level": "level2" }
   ```
   - Backend crea sesión en Veriff
   - Retorna interactive URL

2. **User redirigido a Veriff**
   - Captura selfie
   - Captura ID document
   - Completa formulario

3. **Veriff procesa verificación** (2-5 minutos)

4. **Veriff envía webhook**
   ```http
   POST /kyc/webhook
   ```
   - Backend valida HMAC signature
   - Actualiza status a `approved` o `rejected`

5. **User puede transaccionar**
   - `level1`: hasta $5K/mes
   - `level2`: hasta $50K/mes
   - `level3`: ilimitado

### 8.4 Fiat Deposit (SEP-24)

**Actor:** User

1. **User inicia depósito**
   ```http
   POST /anchors/sep24/transactions/deposit/interactive
   {
     "account": "GABC...",
     "asset_code": "USD",
     "amount": "1000"
   }
   ```
   - Backend crea AnchorTransaction
   - Retorna interactive URL

2. **User redirigido a anchor**
   - Proporciona datos bancarios
   - Realiza transferencia fiat

3. **Anchor procesa pago** (1-3 días hábiles)

4. **Anchor emite asset**
   - Stellar transaction a cuenta del user
   - Backend actualiza status a `completed`

5. **User recibe USD en wallet Stellar**

---

## 9. SEGURIDAD Y MEJORES PRÁCTICAS

### 9.1 Seguridad Backend

#### Helmet.js (HTTP Headers)

```typescript
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
    },
  },
  xFrameOptions: { action: 'sameorigin' },
  xContentTypeOptions: 'nosniff',
  xXssProtection: '1; mode=block',
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true,
  },
}));
```

#### Rate Limiting

```typescript
app.use(rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP',
}));
```

#### CORS

```typescript
app.enableCors({
  origin: process.env.CORS_ORIGINS?.split(',') || ['http://localhost:3001'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
});
```

#### Input Validation

```typescript
app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true,              // Strip unknown properties
    forbidNonWhitelisted: true,   // Throw error on unknown properties
    transform: true,              // Auto-transform payloads
    transformOptions: {
      enableImplicitConversion: true,
    },
  })
);
```

### 9.2 Seguridad Smart Contracts

#### Checked Arithmetic

```rust
// ❌ INCORRECTO: Overflow posible
let result = a + b;

// ✅ CORRECTO: Checked arithmetic
let result = a.checked_add(b)
  .ok_or(Error::Overflow)?;
```

#### Bounded Storage

```rust
const MAX_OWNERS: usize = 1000;
const MAX_TRADE_HISTORY: usize = 10000;

// FIFO eviction
if owners.len() >= MAX_OWNERS {
  return Err(Error::MaxOwnersReached);
}
```

#### CEI Pattern (Checks-Effects-Interactions)

```rust
pub fn buy_tokens(...) -> Result<(), Error> {
  // 1. CHECKS
  if amount <= 0 { return Err(Error::InvalidAmount); }
  let listing = get_listing(&env, listing_id)?;
  if !listing.active { return Err(Error::ListingNotActive); }

  // 2. EFFECTS (update state)
  listing.amount -= amount;
  set_listing(&env, listing_id, &listing);

  // 3. INTERACTIONS (external calls)
  usdc_token.transfer_from(&buyer, &seller, &total_price);
  property_token.transfer_from(&marketplace, &buyer, &amount);

  Ok(())
}
```

#### Authorization

```rust
pub fn admin_only_function(env: Env) -> Result<(), Error> {
  let admin = get_admin(&env);
  admin.require_auth();  // Throws if caller != admin

  // ... admin operations
  Ok(())
}
```

### 9.3 Secrets Management

**NO commitear en .env:**

```.gitignore
.env
.env.local
.env.production
*.pem
*.key
secrets/
```

**Usar variables de entorno:**

```bash
# Development: .env
STELLAR_RPC_URL=https://soroban-testnet.stellar.org

# Production: Sistema operativo o secrets manager
export STELLAR_RPC_URL="https://soroban-mainnet.stellar.org"
export DATABASE_URL="postgresql://..."
```

**Vault para producción:**

```typescript
import { Vault } from 'vault-client';

const vault = new Vault({
  endpoint: process.env.VAULT_ENDPOINT,
  token: process.env.VAULT_TOKEN,
});

const secret = await vault.read('secret/blocki/stellar');
const adminSecretKey = secret.data.admin_secret_key;
```

### 9.4 Auditoría y Logging

```typescript
@Injectable()
export class LoggerService {
  private logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json()
    ),
    transports: [
      new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
      new winston.transports.File({ filename: 'logs/combined.log' }),
    ],
  });

  logTransaction(tx: TransactionEntity) {
    this.logger.info('Transaction executed', {
      txHash: tx.txHash,
      buyer: tx.buyerAddress,
      seller: tx.sellerAddress,
      amount: tx.amount,
      totalPrice: tx.totalPrice,
    });
  }

  logKYCApproval(userId: number, level: string) {
    this.logger.info('KYC approved', { userId, level });
  }
}
```

---

## 10. DESPLIEGUE Y OPERACIONES

### 10.1 Docker Deployment

**docker-compose.yml:**

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:16-alpine
    container_name: blocki_postgres
    environment:
      POSTGRES_DB: stellar_tokenization
      POSTGRES_USER: stellar
      POSTGRES_PASSWORD: ${DATABASE_PASSWORD}
    ports:
      - "15432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./DATABASE_SEED.sql:/docker-entrypoint-initdb.d/seed.sql
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U stellar"]
      interval: 10s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    container_name: blocki_redis
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    command: redis-server --appendonly yes
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 3s
      retries: 5

  app:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: blocki_backend
    ports:
      - "3000:3000"
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
    env_file:
      - .env
    volumes:
      - ./logs:/app/logs
    restart: unless-stopped

volumes:
  postgres_data:
  redis_data:
```

**Dockerfile (Multi-stage):**

```dockerfile
# Stage 1: Build
FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Stage 2: Production
FROM node:22-alpine

WORKDIR /app

# Copy built app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nestjs -u 1001
USER nestjs

EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

CMD ["node", "dist/main.js"]
```

### 10.2 Comandos de Despliegue

```bash
# Development
docker-compose up -d postgres redis
npm run start:dev

# Production
docker-compose up -d --build

# Ver logs
docker-compose logs -f app

# Restart
docker-compose restart app

# Stop all
docker-compose down

# Clean volumes
docker-compose down -v
```

### 10.3 CI/CD (GitHub Actions)

**.github/workflows/deploy.yml:**

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '22'
      - run: npm ci
      - run: npm run test
      - run: npm run build

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to server
        env:
          SSH_PRIVATE_KEY: ${{ secrets.SSH_PRIVATE_KEY }}
          SERVER_HOST: ${{ secrets.SERVER_HOST }}
        run: |
          echo "$SSH_PRIVATE_KEY" > key.pem
          chmod 600 key.pem
          ssh -i key.pem user@$SERVER_HOST '
            cd /opt/blocki &&
            git pull &&
            docker-compose down &&
            docker-compose up -d --build
          '
```

### 10.4 Health Checks

**Endpoint:** `GET /health`

```typescript
@Controller('health')
export class HealthController {
  constructor(
    private stellarService: StellarService,
    @InjectConnection() private connection: Connection,
    private redis: Redis,
  ) {}

  @Get()
  async check(): Promise<HealthStatus> {
    const checks = await Promise.allSettled([
      this.checkDatabase(),
      this.checkRedis(),
      this.checkStellar(),
    ]);

    const status = checks.every(c => c.status === 'fulfilled')
      ? 'healthy'
      : 'unhealthy';

    return {
      status,
      timestamp: new Date().toISOString(),
      database: checks[0].status === 'fulfilled' ? 'connected' : 'disconnected',
      redis: checks[1].status === 'fulfilled' ? 'connected' : 'disconnected',
      stellar: checks[2].status === 'fulfilled' ? 'connected' : 'disconnected',
    };
  }

  private async checkDatabase(): Promise<void> {
    await this.connection.query('SELECT 1');
  }

  private async checkRedis(): Promise<void> {
    await this.redis.ping();
  }

  private async checkStellar(): Promise<void> {
    await this.stellarService.server.getHealth();
  }
}
```

### 10.5 Monitoring

**Métricas recomendadas:**

- **APM:** New Relic, Datadog, Sentry
- **Logs:** ELK Stack, CloudWatch
- **Uptime:** Pingdom, UptimeRobot
- **Performance:** Response times, throughput
- **Business:** Transactions/day, volume, active users

---

## 11. TESTING Y CALIDAD

### 11.1 Tests Incluidos

**Backend Tests:**
- `test-backend.js` - API endpoints
- `test-auth-flow.js` - Authentication
- `test-create-property.js` - Property creation
- `test-complete-flow.js` - End-to-end
- `test-simple-flow.js` - Basic operations

**Smart Contract Tests:**
- `test-contracts.js` - Integration tests
- Rust unit tests en cada contrato
- Fuzz tests en `/stellar-blocki/fuzz/`

### 11.2 Ejecutar Tests

```bash
# Unit tests (Rust)
cd stellar-blocki
cargo test

# Backend tests
npm test
npm run test:cov  # With coverage

# E2E tests
npm run test:e2e

# Fuzz tests
cd stellar-blocki/fuzz
cargo fuzz run fuzz_marketplace_buy
```

### 11.3 Code Quality

```bash
# Linting
npm run lint
npm run lint:fix

# Formatting
npm run format

# Type checking
npm run type-check
```

---

## 12. TROUBLESHOOTING

### 12.1 Problemas Comunes

#### Error: "Contract not initialized"
```bash
# Solución: Inicializar contrato
stellar contract invoke --id $CONTRACT_ID --source admin --network testnet -- initialize --admin $ADMIN_ADDRESS
```

#### Error: "Transaction simulation failed"
```bash
# Verificar:
1. Cuenta tiene balance XLM suficiente
2. Contract ID es correcto
3. Parámetros son válidos

# Debug:
stellar contract invoke --id $CONTRACT_ID --source admin --network testnet -- <function> <args> --debug
```

#### Error: "InsufficientBalance (Error 11)"
```bash
# Verificar balance del token
stellar contract invoke --id $TOKEN_CONTRACT --network testnet -- balance_of --owner $ADDRESS
```

#### Error: "Database connection failed"
```bash
# Verificar PostgreSQL está corriendo
docker-compose ps postgres

# Ver logs
docker-compose logs postgres

# Recrear contenedor
docker-compose down
docker-compose up -d postgres
```

#### Error: "Redis connection refused"
```bash
# Verificar Redis
redis-cli ping  # Debe retornar PONG

# Restart Redis
docker-compose restart redis
```

### 12.2 Logs y Debug

```bash
# Ver logs en tiempo real
tail -f logs/combined.log
tail -f logs/error.log

# Logs de Docker
docker-compose logs -f app

# Logs de PostgreSQL
docker-compose logs -f postgres

# Debug NestJS
DEBUG=* npm run start:dev
```

### 12.3 Soporte

- **GitHub Issues:** https://github.com/user/service-blocki/issues
- **Documentation:** `/docs` folder
- **Swagger API:** http://localhost:3000/api/docs

---

## 🎯 CONCLUSIÓN

Este proyecto implementa una plataforma completa de tokenización inmobiliaria con:

✅ **5 Smart Contracts en Rust** (PropertyToken, Marketplace, Escrow, Registry, Deployer)
✅ **Backend NestJS con 12+ módulos** (Auth, Properties, Marketplace, KYC, Anchors, etc.)
✅ **Base de datos PostgreSQL** con 8+ tablas relacionales
✅ **Sistema de autenticación dual** (Stellar Wallet + JWT)
✅ **Integración KYC** (Veriff con 3 niveles)
✅ **Fiat Rails** (SEP-24 para USD/MXN)
✅ **File Storage** (Cloudflare R2)
✅ **Testing completo** (Unit, Integration, E2E, Fuzz)
✅ **Docker deployment** (Multi-stage builds)
✅ **Seguridad enterprise-grade** (Helmet, Rate Limiting, CEI Pattern, Bounded Storage)

### Addresses en Testnet

```
Deployer:    CB6L32U3SK3ZYLXVJB7BW6PYZBOUX5HXXRCDSRRNU7DAACHS66GUN5ZS
Marketplace: CATAB6XXHBTB3UTHBYB4T2W6FDFCDRNLNISYTPSKEXWL7AUG3PALB4NV
Escrow:      CARJ2AEKS5PLMF6BNHZKPRGX2VJT5JG7BDOPYHQIGQY4WI7JL2ALWBLS
Registry:    CDLPZNUOIUPA3G4NZHZ6MWJ4LOVSGJ5XMNKGQLOLDSJYKMFCUPX5ZKR4
PropertyToken: CDHFNDXSSSSKT53SEJDANUBHYIEJO54KFV7QSCMW6UUKWBAF6F5ZPN6I
```

### Quick Start

```bash
# 1. Clone
git clone https://github.com/user/service-blocki.git
cd service-blocki

# 2. Install
npm install

# 3. Environment
cp .env.example .env
# Edit .env with your values

# 4. Start infrastructure
docker-compose up -d postgres redis

# 5. Seed database
psql -U stellar -d stellar_tokenization -f DATABASE_SEED.sql

# 6. Start backend
npm run start:dev

# 7. Access Swagger
open http://localhost:3000/api/docs
```

### Next Steps (Production)

- [ ] Actualizar a Stellar Mainnet
- [ ] Configurar dominio y SSL
- [ ] Implementar CI/CD completo
- [ ] Configurar monitoring (Sentry/Datadog)
- [ ] Auditoría de smart contracts
- [ ] Compliance legal por jurisdicción
- [ ] Backup y disaster recovery

---

**Documentación generada:** 21 de Enero 2025
**Versión:** 2.0.0
**Stack:** NestJS + TypeScript + PostgreSQL + Redis + Stellar/Soroban + Rust

**⭐ Para más información, consulta los archivos en `/docs`**
