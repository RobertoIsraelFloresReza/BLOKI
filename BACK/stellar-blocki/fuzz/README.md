# Fuzzing Tests para Smart Contracts Soroban

Este directorio contiene fuzz targets para verificar la robustez de los contratos inteligentes.

## Instalación

```bash
# Instalar cargo-fuzz
cargo install cargo-fuzz

# Verificar instalación
cargo fuzz --version
```

## Fuzz Targets

### 1. fuzz_property_transfer
Tests de fuzzing para `PropertyToken::transfer()`:
- Invariante: balance nunca negativo
- Invariante: total supply constante
- Invariante: transfer atómico
- Edge cases: amount=0, amount=u128::MAX

```bash
cargo fuzz run fuzz_property_transfer -- -max_total_time=600
```

### 2. fuzz_marketplace_buy
Tests de fuzzing para `Marketplace::buy_tokens()`:
- Invariante: buyer tiene fondos suficientes
- Invariante: operación atómica (todo o nada)
- Invariante: ownership total = 100%
- Edge cases: cantidad=0, precio=0, overflow

```bash
cargo fuzz run fuzz_marketplace_buy -- -max_total_time=600
```

### 3. fuzz_escrow_lock
Tests de fuzzing para `Escrow::lock_funds()`:
- Invariante: amount > 0
- Invariante: timeout en el futuro
- Invariante: balance escrow consistente
- Edge cases: timeout pasado, amount máximo

```bash
cargo fuzz run fuzz_escrow_lock -- -max_total_time=600
```

### 4. fuzz_registry_register
Tests de fuzzing para `Registry::register_property()`:
- Invariante: property_id único
- Invariante: registro inmutable
- Invariante: ownership total = 100%
- Edge cases: id=0, value=0, metadata vacía

```bash
cargo fuzz run fuzz_registry_register -- -max_total_time=600
```

## Ejecutar Todos los Tests

```bash
# Desde el directorio fuzz/
./run_all_fuzz_tests.sh
```

## Resultados

Los crashers y outputs se guardan en:
- `fuzz/artifacts/fuzz_property_transfer/` - Crashes encontrados
- `fuzz/corpus/fuzz_property_transfer/` - Inputs que pasan

## Invariantes Críticos

### PropertyToken
1. **Balance nunca negativo**: `balance(addr) >= 0` siempre
2. **Total supply constante**: `sum(all balances) = total_supply`
3. **Transfer atómico**: Todo o nada, sin estados intermedios

### Marketplace
1. **Fondos suficientes**: Buyer balance >= total_cost antes de buy
2. **Operación atómica**: Si falla, NO hay cambios de estado
3. **Ownership = 100%**: Suma de todos los owners siempre 100%

### Escrow
1. **Balance consistente**: escrow_balance = sum(locked_funds)
2. **Timeout válido**: timeout_ledger > current_ledger
3. **Refund solo después timeout**: refund permitido solo si expiró

### Registry
1. **Property ID único**: No duplicados permitidos
2. **Registro inmutable**: Una vez registrado, no cambia
3. **Ownership total = 100%**: Siempre suma 100%

## Reportar Crashers

Si se encuentra un crash:
1. Revisar `fuzz/artifacts/*/crash-*`
2. Reproducir: `cargo fuzz run target_name artifact_file`
3. Documentar en issue de GitHub
4. Aplicar fix en contrato
5. Re-ejecutar fuzzing para verificar

## Coverage Goal

- Mínimo: 10M iteraciones por target
- Recomendado: 100M+ iteraciones para producción
- Duración: 10 minutos por target (600 segundos)

## Comandos Útiles

```bash
# Ejecutar target específico por 10 minutos
cargo fuzz run fuzz_property_transfer -- -max_total_time=600

# Ejecutar con 10M iteraciones
cargo fuzz run fuzz_property_transfer -- -runs=10000000

# Reproducir un crash
cargo fuzz run fuzz_property_transfer fuzz/artifacts/fuzz_property_transfer/crash-xyz

# Ver estadísticas
cargo fuzz coverage fuzz_property_transfer
```

## CI/CD Integration

Los fuzz tests se ejecutan en CI/CD con:
- 1M iteraciones por target
- Timeout de 5 minutos
- Fail si se encuentra algún crash
