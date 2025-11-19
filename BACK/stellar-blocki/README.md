# Stellar Property Tokenization - Smart Contracts

Smart contracts desarrollados en Rust/Soroban para la plataforma de tokenización de propiedades inmobiliarias.

## Contratos Desplegados (Testnet)

| Contrato | Contract ID | Explorer |
|----------|------------|----------|
| **PropertyToken** | `CBFAXO5UUXHXCSJW63E4LTZPHWTRCAVJIUGJOHU23EAW2I2IATE2XZKF` | [Ver](https://stellar.expert/explorer/testnet/contract/CBFAXO5UUXHXCSJW63E4LTZPHWTRCAVJIUGJOHU23EAW2I2IATE2XZKF) |
| **Escrow** | `CARJ2AEKS5PLMF6BNHZKPRGX2VJT5JG7BDOPYHQIGQY4WI7JL2ALWBLS` | [Ver](https://stellar.expert/explorer/testnet/contract/CARJ2AEKS5PLMF6BNHZKPRGX2VJT5JG7BDOPYHQIGQY4WI7JL2ALWBLS) |
| **Registry** | `CDLPZNUOIUPA3G4NZHZ6MWJ4LOVSGJ5XMNKGQLOLDSJYKMFCUPX5ZKR4` | [Ver](https://stellar.expert/explorer/testnet/contract/CDLPZNUOIUPA3G4NZHZ6MWJ4LOVSGJ5XMNKGQLOLDSJYKMFCUPX5ZKR4) |
| **Marketplace** | `CATAB6XXHBTB3UTHBYB4T2W6FDFCDRNLNISYTPSKEXWL7AUG3PALB4NV` | [Ver](https://stellar.expert/explorer/testnet/contract/CATAB6XXHBTB3UTHBYB4T2W6FDFCDRNLNISYTPSKEXWL7AUG3PALB4NV) |
| **Deployer** | `CB5W6PUHE6OT2PQK2PC4XU5OMEQXNFEW4AVXBBH7IHT2LBJJFEX4OXPQ` | [Ver](https://stellar.expert/explorer/testnet/contract/CB5W6PUHE6OT2PQK2PC4XU5OMEQXNFEW4AVXBBH7IHT2LBJJFEX4OXPQ) |

## Arquitectura

```
contracts/
├── core/
│   ├── property-token/    # Token ERC-20 para fracciones de propiedades
│   ├── marketplace/       # Compra/venta de tokens
│   ├── escrow/           # Manejo seguro de fondos
│   └── registry/         # Registro inmutable de propiedades
└── utils/
    ├── deployer/         # Factory para deploy dinámico
    ├── storage/          # Helpers de almacenamiento
    ├── events/           # Definiciones de eventos
    └── errors/           # Códigos de error compartidos
```

## Funcionalidades Principales

### 1. PropertyToken Contract
Token fungible que representa fracciones de una propiedad inmobiliaria.

**Funciones clave**:
- `initialize()` - Inicializar token con metadata de propiedad
- `mint()` - Acuñar tokens (solo admin)
- `transfer()` - Transferir tokens entre usuarios
- `approve()` / `transfer_from()` - Sistema de allowances
- `balance_of()` - Consultar balance
- `get_ownership_percentage()` - % de propiedad en basis points

**Eventos**:
- `transfer` - Transferencia de tokens
- `mint` - Acuñación de tokens
- `burn` - Quema de tokens

### 2. Escrow Contract
Gestión segura de fondos durante transacciones con timeouts automáticos.

**Funciones clave**:
- `lock_funds()` - Bloquear USDC en escrow
- `release_to_seller()` - Liberar fondos al vendedor
- `refund_to_buyer()` - Reembolsar al comprador
- `get_escrow_status()` - Estado del escrow

**Eventos**:
- `esc_lock` - Fondos bloqueados
- `esc_rel` - Fondos liberados
- `esc_ref` - Fondos reembolsados

### 3. Registry Contract
Registro inmutable de propiedades y ownership history.

**Funciones clave**:
- `register_property()` - Registrar nueva propiedad
- `verify_property()` - Verificar propiedad (solo admin)
- `update_ownership()` - Actualizar ownership después de transfer
- `record_legal_document()` - Registrar hash de documento legal
- `verify_ownership()` - Verificar ownership de usuario
- `get_property_owners()` - Lista actual de owners

**Eventos**:
- `prop_reg` - Propiedad registrada
- `own_upd` - Ownership actualizado
- `doc_rec` - Documento legal registrado

### 4. Marketplace Contract
Marketplace para compra/venta de tokens de propiedades.

**Funciones clave**:
- `list_property()` - Crear listing
- `buy_tokens()` - Comprar tokens de un listing
- `cancel_listing()` - Cancelar listing
- `get_listings()` - Obtener listings activos
- `get_price_history()` - Historial de precios
- `calculate_market_cap()` - Capitalización de mercado

**Eventos**:
- `list_new` - Nuevo listing creado
- `purchase` - Tokens comprados
- `list_cncl` - Listing cancelado

### 5. Deployer Contract
Factory contract para desplegar PropertyTokens dinámicamente.

**Funciones clave**:
- `set_property_token_wasm()` - Configurar WASM hash
- `deploy_property_token()` - Desplegar nuevo PropertyToken
- `get_deployed_contracts()` - Lista de contratos desplegados

**Eventos**:
- `deployed` - Nuevo contrato desplegado

## Desarrollo

### Requisitos
- Rust 1.90+
- Stellar CLI 23.1+
- Target `wasm32-unknown-unknown`

### Compilar Contratos

```bash
# Compilar workspace completo
cargo build --release --target wasm32-unknown-unknown

# Compilar contrato específico
cd contracts/core/property-token
stellar contract build

# Optimizar WASM
stellar contract optimize --wasm target/wasm32v1-none/release/property_token.wasm
```

### Tamaños de Contratos (Optimizados)

| Contrato | Tamaño | Funciones Exportadas |
|----------|--------|---------------------|
| property-token | 11.7 KB | 14 |
| escrow | 9.7 KB | 9 |
| registry | 11.9 KB | 13 |
| marketplace | 12.0 KB | 12 |
| deployer | 6.1 KB | 10 |

Todos bajo el límite de 64KB de Soroban ✅

### Tests

```bash
# Ejecutar todos los tests
cargo test --workspace

# Test de contrato específico
cargo test -p property-token
```

### Deploy a Testnet

```bash
# Generar cuenta con fondos
stellar keys generate platform --network testnet --fund

# Deploy contrato
stellar contract deploy \
  --wasm target/wasm32v1-none/release/property_token.optimized.wasm \
  --source platform \
  --network testnet
```

### Generar TypeScript Bindings

```bash
# Generar bindings para backend
stellar contract bindings typescript \
  --network testnet \
  --contract-id <CONTRACT_ID> \
  --output-dir ../service-blocki/packages/property-token
```

## Integración

### Backend (NestJS)

Los bindings TypeScript están disponibles en `service-blocki/packages/`:

```typescript
import { PropertyTokenClient } from 'property-token';

const client = new PropertyTokenClient({
  contractId: process.env.PROPERTY_TOKEN_CONTRACT_ID,
  networkPassphrase: 'Test SDF Network ; September 2015',
  rpcUrl: 'https://soroban-testnet.stellar.org:443',
});

// Consultar balance
const balance = await client.balance_of({ owner: userAddress });

// Transfer tokens
const tx = await client.transfer({
  from: senderAddress,
  to: receiverAddress,
  amount: BigInt(1000000000), // 100 tokens (7 decimals)
});
```

### Indexer (SubQuery)

Ver `EVENTS_DOCUMENTATION.md` para lista completa de eventos y schema GraphQL sugerido.

Configurar en `project.yaml`:

```yaml
dataSources:
  - kind: substrate/Soroban
    mapping:
      handlers:
        - handler: handleTransfer
          kind: substrate/EventHandler
          filter:
            contractId: CBFAXO5UUXHXCSJW63E4LTZPHWTRCAVJIUGJOHU23EAW2I2IATE2XZKF
            topics:
              - transfer
```

## Seguridad

### Características de Seguridad Implementadas

1. **Authorization**: Todos los métodos de escritura requieren `require_auth()`
2. **Validaciones**:
   - Amounts > 0
   - Percentages en rango válido (0-10000 basis points)
   - Balance checks antes de transfers
3. **Storage TTL**: Persistent storage con TTL extendido (1M ledgers ≈ 115 días)
4. **Error Handling**: Códigos de error específicos para debugging
5. **Immutability**: Registry mantiene historial inmutable

### Auditoría

Pendiente auditoría de seguridad vía [Stellar Audit Bank](https://stellar.org/foundation/stellar-audit-bank).

## Variables de Entorno

Todas las configuraciones están en `../.env.contracts`:

```bash
# Contract IDs
PROPERTY_TOKEN_CONTRACT_ID=CBFAXO5UUXHXCSJW63E4LTZPHWTRCAVJIUGJOHU23EAW2I2IATE2XZKF
ESCROW_CONTRACT_ID=CARJ2AEKS5PLMF6BNHZKPRGX2VJT5JG7BDOPYHQIGQY4WI7JL2ALWBLS
REGISTRY_CONTRACT_ID=CDLPZNUOIUPA3G4NZHZ6MWJ4LOVSGJ5XMNKGQLOLDSJYKMFCUPX5ZKR4
MARKETPLACE_CONTRACT_ID=CATAB6XXHBTB3UTHBYB4T2W6FDFCDRNLNISYTPSKEXWL7AUG3PALB4NV
DEPLOYER_CONTRACT_ID=CB5W6PUHE6OT2PQK2PC4XU5OMEQXNFEW4AVXBBH7IHT2LBJJFEX4OXPQ

# Network
STELLAR_NETWORK=testnet
STELLAR_RPC_URL=https://soroban-testnet.stellar.org:443
```

## Recursos

- **Soroban Docs**: https://developers.stellar.org/docs/smart-contracts
- **Stellar CLI**: https://developers.stellar.org/docs/tools/stellar-cli
- **Soroban SDK**: https://docs.rs/soroban-sdk/latest/soroban_sdk/
- **Contract Explorer**: https://stellar.expert/explorer/testnet

## Licencia

MIT License - Ver [LICENSE](LICENSE) para detalles.

## Soporte

Para reportar bugs o solicitar features, abrir un issue en el repositorio del proyecto.
