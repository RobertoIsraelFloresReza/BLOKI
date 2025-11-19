# Ejemplos de Uso API - Módulos Escrow y Registry

## Requisitos Previos

- Backend corriendo en http://localhost:3000
- Secret keys y addresses de Stellar válidas
- USDC o assets configurados en testnet

---

## MÓDULO ESCROW

### 1. Bloquear Fondos en Escrow

```bash
curl -X POST http://localhost:3000/escrow/lock \
  -H "Content-Type: application/json" \
  -d '{
    "buyerSecretKey": "SBXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
    "sellerAddress": "GBXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
    "amount": 1000.50,
    "lockDurationDays": 7
  }'
```

**Respuesta esperada:**
```json
{
  "txHash": "abc123def456...",
  "escrowId": 1698765432
}
```

### 2. Liberar Fondos al Vendedor

```bash
curl -X POST http://localhost:3000/escrow/release \
  -H "Content-Type: application/json" \
  -d '{
    "buyerSecretKey": "SBXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
    "escrowId": 1698765432
  }'
```

**Respuesta esperada:**
```json
{
  "txHash": "def789ghi012..."
}
```

### 3. Reembolsar Fondos al Comprador

```bash
curl -X POST http://localhost:3000/escrow/refund \
  -H "Content-Type: application/json" \
  -d '{
    "sellerSecretKey": "SCXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
    "escrowId": 1698765432
  }'
```

**Respuesta esperada:**
```json
{
  "txHash": "ghi345jkl678..."
}
```

### 4. Obtener Información del Escrow

```bash
curl -X GET http://localhost:3000/escrow/1698765432
```

**Respuesta esperada:**
```json
{
  "buyer": "GBXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  "seller": "GCXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  "amount": 1000.50,
  "unlockTime": 1699370232,
  "status": "locked"
}
```

### 5. Obtener Estado del Escrow

```bash
curl -X GET http://localhost:3000/escrow/1698765432/status
```

**Respuesta esperada:**
```json
{
  "status": "locked",
  "timedOut": false
}
```

### 6. Verificar si el Escrow Expiró

```bash
curl -X GET http://localhost:3000/escrow/1698765432/timed-out
```

**Respuesta esperada:**
```json
{
  "escrowId": 1698765432,
  "timedOut": false
}
```

---

## MÓDULO REGISTRY

### 1. Registrar Propiedad

```bash
curl -X POST http://localhost:3000/registry/register \
  -H "Content-Type: application/json" \
  -d '{
    "adminSecretKey": "SBXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
    "propertyId": 12345,
    "legalId": "RPP-2024-001234",
    "ownerAddress": "GBXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
    "valuation": 250000.00
  }'
```

**Respuesta esperada:**
```json
{
  "txHash": "jkl901mno234..."
}
```

### 2. Verificar Propiedad

```bash
curl -X POST http://localhost:3000/registry/verify \
  -H "Content-Type: application/json" \
  -d '{
    "adminSecretKey": "SBXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
    "propertyId": 12345
  }'
```

**Respuesta esperada:**
```json
{
  "txHash": "pqr567stu890..."
}
```

### 3. Actualizar Ownership (Placeholder)

```bash
curl -X POST http://localhost:3000/registry/ownership/update \
  -H "Content-Type: application/json" \
  -d '{
    "adminSecretKey": "SBXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
    "propertyId": 12345,
    "owners": [
      {
        "owner": "GBXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
        "percentage": 60
      },
      {
        "owner": "GCXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
        "percentage": 40
      }
    ]
  }'
```

**Respuesta esperada:**
```json
{
  "message": "Ownership update queued (not yet implemented in smart contract)",
  "owners": [
    { "owner": "GBXXXXX...", "percentage": 60 },
    { "owner": "GCXXXXX...", "percentage": 40 }
  ]
}
```

### 4. Obtener Datos de Propiedad

```bash
curl -X GET http://localhost:3000/registry/property/12345
```

**Respuesta esperada:**
```json
{
  "legalId": "RPP-2024-001234",
  "owner": "GBXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  "valuation": 250000.00,
  "verified": true,
  "registeredAt": 1698765432
}
```

### 5. Obtener Propietarios de Propiedad

```bash
curl -X GET http://localhost:3000/registry/property/12345/owners
```

**Respuesta esperada:**
```json
{
  "propertyId": 12345,
  "owners": [
    {
      "address": "GBXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
      "percentage": 100
    }
  ]
}
```

### 6. Verificar Ownership de un Address

```bash
curl -X GET http://localhost:3000/registry/property/12345/owner/GBXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX/verify
```

**Respuesta esperada:**
```json
{
  "propertyId": 12345,
  "ownerAddress": "GBXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  "isOwner": true
}
```

### 7. Obtener Historial de Propiedad

```bash
curl -X GET http://localhost:3000/registry/property/12345/history
```

**Respuesta esperada:**
```json
{
  "propertyId": 12345,
  "history": [
    {
      "timestamp": 1698765432,
      "event": "REGISTERED",
      "details": {
        "owner": "GBXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
        "valuation": 250000.00
      }
    }
  ]
}
```

### 8. Registrar Hash de Documento (Placeholder)

```bash
curl -X POST http://localhost:3000/registry/document/record \
  -H "Content-Type: application/json" \
  -d '{
    "adminSecretKey": "SBXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
    "propertyId": 12345,
    "documentHash": "a3c5e7f9b2d4a6c8e1f3b5d7a9c2e4f6b8d1a3c5e7f9b2d4a6c8e1f3b5d7a9c2"
  }'
```

**Respuesta esperada:**
```json
{
  "message": "Document hash recorded (off-chain)",
  "documentHash": "a3c5e7f9b2d4a6c8e1f3b5d7a9c2e4f6b8d1a3c5e7f9b2d4a6c8e1f3b5d7a9c2"
}
```

### 9. Verificar Estado de Verificación

```bash
curl -X GET http://localhost:3000/registry/property/12345/verified
```

**Respuesta esperada:**
```json
{
  "verified": true
}
```

---

## FLUJO COMPLETO: Tokenización de Propiedad con Escrow

### Paso 1: Registrar Propiedad en Registry

```bash
curl -X POST http://localhost:3000/registry/register \
  -H "Content-Type: application/json" \
  -d '{
    "adminSecretKey": "ADMIN_SECRET_KEY",
    "propertyId": 12345,
    "legalId": "RPP-2024-001234",
    "ownerAddress": "OWNER_PUBLIC_KEY",
    "valuation": 250000.00
  }'
```

### Paso 2: Verificar Propiedad

```bash
curl -X POST http://localhost:3000/registry/verify \
  -H "Content-Type: application/json" \
  -d '{
    "adminSecretKey": "ADMIN_SECRET_KEY",
    "propertyId": 12345
  }'
```

### Paso 3: Comprador Bloquea Fondos en Escrow

```bash
curl -X POST http://localhost:3000/escrow/lock \
  -H "Content-Type: application/json" \
  -d '{
    "buyerSecretKey": "BUYER_SECRET_KEY",
    "sellerAddress": "OWNER_PUBLIC_KEY",
    "amount": 25000.00,
    "lockDurationDays": 7
  }'
# Guarda el escrowId de la respuesta
```

### Paso 4: Verificar Estado del Escrow

```bash
curl -X GET http://localhost:3000/escrow/{escrowId}/status
```

### Paso 5: Comprador Libera Fondos al Vendedor

```bash
curl -X POST http://localhost:3000/escrow/release \
  -H "Content-Type: application/json" \
  -d '{
    "buyerSecretKey": "BUYER_SECRET_KEY",
    "escrowId": {escrowId}
  }'
```

### Paso 6: Verificar Ownership Actualizado

```bash
curl -X GET http://localhost:3000/registry/property/12345/owners
```

---

## TESTING CON SWAGGER

Alternativamente, puedes usar la interfaz Swagger para probar los endpoints:

**URL**: http://localhost:3000/api/docs

**Pasos**:
1. Abre la URL en tu navegador
2. Navega a la sección "Escrow" o "Registry"
3. Expande el endpoint que quieres probar
4. Click en "Try it out"
5. Completa los parámetros
6. Click en "Execute"
7. Revisa la respuesta

---

## CÓDIGOS DE RESPUESTA HTTP

### Exitosos
- `200 OK` - Operación completada exitosamente
- `201 Created` - Recurso creado exitosamente

### Errores
- `400 Bad Request` - Parámetros inválidos o operación falló
- `404 Not Found` - Recurso no encontrado
- `500 Internal Server Error` - Error del servidor

---

## NOTAS IMPORTANTES

1. **Secret Keys**: Reemplaza `SBXXXXXXXX` con secret keys reales de Stellar testnet
2. **Public Keys**: Reemplaza `GBXXXXXXXX` con public keys reales de Stellar testnet
3. **Escrow IDs**: Son timestamps unix, guárdalos después de crear un escrow
4. **Property IDs**: Usa números únicos para cada propiedad
5. **Amounts**: Los montos se manejan con decimales (ej: 1000.50)

---

## SOLUCIÓN DE PROBLEMAS

### Error: "Transaction failed"
- Verifica que las cuentas tengan fondos suficientes
- Asegúrate de usar testnet (no mainnet)
- Verifica que los secret keys sean correctos

### Error: "Property not found"
- Verifica que la propiedad esté registrada
- Usa el propertyId correcto
- Asegúrate de que la transacción de registro se completó

### Error: "Escrow not found"
- Verifica que el escrowId sea correcto
- Asegúrate de que la transacción de lock se completó
- Espera a que la transacción se confirme en la red

---

## VARIABLES DE ENTORNO NECESARIAS

Asegúrate de tener configurado en `.env`:

```bash
STELLAR_RPC_URL=https://soroban-testnet.stellar.org
STELLAR_NETWORK_PASSPHRASE=Test SDF Network ; September 2015
```

---

Generado: 2025-11-19
Para más información, consulta: ENDPOINTS_REPORT.md y COMPLETION_SUMMARY.md
