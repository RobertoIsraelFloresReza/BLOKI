# QUICK START GUIDE - service-blocki

## Inicio Rápido (5 minutos)

### 1. Instalar Dependencias
```bash
cd D:\reps\stellar\service-blocki
npm install
```

### 2. Configurar Variables de Entorno
```bash
# El archivo .env ya existe con configuración de testnet
# Verificar que contenga:
- STELLAR_NETWORK=testnet
- JWT_SECRET (cambiar en producción)
- DATABASE_URL (PostgreSQL)
- REDIS_HOST y REDIS_PORT
```

### 3. Compilar y Ejecutar
```bash
# Build (ya verificado ✅)
npm run build

# Desarrollo con hot-reload
npm run start:dev

# El servidor inicia en: http://localhost:4000
# Swagger: http://localhost:4000/api/docs
```

---

## Probar los 16 Endpoints CORE

### 1. AUTH - Registro con Stellar Wallet
```bash
curl -X POST http://localhost:4000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "SecurePass123!"
  }'

# Response:
{
  "user": {
    "id": 1,
    "email": "john@example.com",
    "stellarPublicKey": "GABC123...",
    "kycStatus": "not_started"
  },
  "access_token": "eyJhbGciOiJI...",
  "stellarWallet": {
    "publicKey": "GABC123...",
    "encryptedSecretKey": "iv:tag:encrypted"
  }
}
```

### 2. AUTH - Login
```bash
curl -X POST http://localhost:4000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePass123!"
  }'

# Guarda el access_token para los siguientes requests
export TOKEN="eyJhbGciOiJI..."
```

### 3. AUTH - Perfil (/auth/me)
```bash
curl -X GET http://localhost:4000/auth/me \
  -H "Authorization: Bearer $TOKEN"
```

### 4. WALLET - Balance
```bash
curl -X GET http://localhost:4000/wallet/balance \
  -H "Authorization: Bearer $TOKEN"

# Response:
{
  "publicKey": "GABC123...",
  "nativeBalance": "10000.0000000",
  "assets": [],
  "sequence": "123456789"
}
```

### 5. WALLET - Transacciones
```bash
curl -X GET "http://localhost:4000/wallet/transactions?page=1&limit=20" \
  -H "Authorization: Bearer $TOKEN"
```

### 6. PROPERTIES - Listar Todas (Público)
```bash
curl -X GET http://localhost:4000/properties
```

### 7. PROPERTIES - Mis Propiedades Tokenizadas
```bash
curl -X GET http://localhost:4000/properties/my-owned \
  -H "Authorization: Bearer $TOKEN"
```

### 8. PROPERTIES - Mis Inversiones
```bash
curl -X GET http://localhost:4000/properties/my-investments \
  -H "Authorization: Bearer $TOKEN"
```

### 9. PROPERTIES - Crear Propiedad
```bash
curl -X POST http://localhost:4000/properties \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "propertyId": "PROP001",
    "name": "Beach House Miami",
    "description": "Luxury 3BR beachfront",
    "address": "123 Ocean Drive, Miami, FL",
    "totalSupply": 1000000,
    "valuation": 500000,
    "legalOwner": "John Doe LLC",
    "adminSecretKey": "SDXXXXX...",
    "metadata": "{\"bedrooms\": 3}"
  }'
```

### 10. PROPERTIES - Detalle por ID
```bash
curl -X GET http://localhost:4000/properties/1
```

### 11. MARKETPLACE - Listings
```bash
curl -X GET http://localhost:4000/marketplace/listings
```

### 12. MARKETPLACE - Comprar Tokens
```bash
curl -X POST http://localhost:4000/marketplace/listings/buy \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "listingId": 1,
    "amount": 1000,
    "buyerSecretKey": "SDXXXXX..."
  }'
```

### 13. KYC - Iniciar Verificación
```bash
curl -X POST http://localhost:4000/kyc/start \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 1
  }'

# Response:
{
  "success": true,
  "sessionId": "kyc_session_...",
  "redirectUrl": "https://verify.synaps.io/...",
  "message": "KYC process initiated"
}
```

### 14. KYC - Verificar Estado
```bash
curl -X GET http://localhost:4000/kyc/status/1 \
  -H "Authorization: Bearer $TOKEN"
```

### 15. ANCHORS - Deposit SEP-24
```bash
curl -X POST http://localhost:4000/anchors/sep24/transactions/deposit/interactive \
  -H "Content-Type: application/json" \
  -d '{
    "account": "GABC123...",
    "asset_code": "USD",
    "amount": "100.00"
  }'

# Response:
{
  "type": "interactive_customer_info_needed",
  "url": "https://anchor.example.com/deposit/abc123",
  "id": "abc123"
}
```

### 16. UPLOADS - Subir Imágenes
```bash
curl -X POST http://localhost:4000/properties/1/images \
  -H "Authorization: Bearer $TOKEN" \
  -F "images=@/path/to/image1.jpg" \
  -F "images=@/path/to/image2.jpg"
```

---

## Swagger UI (Recomendado)

La forma más fácil de probar todos los endpoints:

1. Abrir: http://localhost:4000/api/docs
2. Hacer clic en "Authorize" (candado verde)
3. Ingresar: `Bearer {tu_access_token}`
4. Probar cada endpoint con los ejemplos precargados

---

## Verificación de Seguridad

### Rate Limiting
```bash
# Intentar >100 requests en 15 minutos
for i in {1..110}; do
  curl -X GET http://localhost:4000/properties
done

# Después de 100, recibirás:
{
  "statusCode": 429,
  "message": "Too many requests from this IP, please try again after 15 minutes"
}
```

### Headers de Seguridad (Helmet.js)
```bash
curl -I http://localhost:4000/api/docs

# Deberías ver:
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Strict-Transport-Security: max-age=...
```

### CORS
```bash
# Desde origen permitido
curl -X GET http://localhost:4000/properties \
  -H "Origin: http://localhost:3000"
# ✅ Permitido

# Desde origen NO permitido
curl -X GET http://localhost:4000/properties \
  -H "Origin: http://evil.com"
# ❌ Bloqueado por CORS
```

---

## Troubleshooting

### Error: "Cannot find module '@stellar/stellar-sdk'"
```bash
npm install @stellar/stellar-sdk --save
```

### Error: "connect ECONNREFUSED" (PostgreSQL)
```bash
# Verificar que PostgreSQL esté corriendo
# Verificar DB_HOST, DB_PORT en .env
```

### Error: "connect ECONNREFUSED" (Redis)
```bash
# Verificar que Redis esté corriendo
# Verificar REDIS_HOST, REDIS_PORT en .env
```

### Error: "Account not found" en /wallet/balance
```bash
# La cuenta Stellar no existe o no está fondeada
# En testnet, Friendbot debería fondear automáticamente en register
# Si falla, fondear manualmente:
curl "https://friendbot.stellar.org?addr=GABC123..."
```

---

## Base de Datos

### Ejecutar Migraciones (si existen)
```bash
npm run migration:run
```

### Verificar Tablas
```sql
-- Conectar a PostgreSQL
psql -h 158.69.218.237 -p 4011 -U VBxm3vHt -d blocki_db

-- Listar tablas
\dt

-- Ver usuarios
SELECT id, email, "stellarPublicKey", "kycStatus" FROM "user";

-- Ver propiedades
SELECT id, name, "contractId", verified FROM properties;
```

---

## Logs y Debugging

### Logs en Consola
```bash
npm run start:dev

# Verás:
🚀 Stellar Property Tokenization API running on: http://localhost:4000
📚 Swagger documentation: http://localhost:4000/api/docs
[Nest] LOG [StellarService] Funding account GABC123... with Friendbot
[Nest] LOG [AuthService] User registered successfully: john@example.com
```

### Logs Detallados
```typescript
// En .env
LOG_LEVEL=debug

// Logs incluirán:
- [AuthService] Generating Stellar keypair...
- [StellarService] Deploying PropertyToken...
- [WalletService] Fetching balance for GABC123...
```

---

## Testing (Cuando se implementen)

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Coverage
npm run test:cov
# Target: 70%+
```

---

## Deployment a Producción

### Checklist Pre-Deployment
- [ ] Cambiar `STELLAR_NETWORK=mainnet`
- [ ] Actualizar `STELLAR_RPC_URL` a mainnet
- [ ] Generar `JWT_SECRET` fuerte (32+ chars)
- [ ] Configurar backups PostgreSQL
- [ ] Configurar Redis persistence
- [ ] SSL/TLS en servidor
- [ ] Rate limiting ajustado (500 req/15min)
- [ ] Logging a archivo/servicio externo (Sentry)
- [ ] Variables sensibles en secrets manager

### Build para Producción
```bash
npm run build
npm run start:prod
```

### Docker (Opcional)
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
RUN npm run build
EXPOSE 4000
CMD ["npm", "run", "start:prod"]
```

```bash
docker build -t service-blocki:latest .
docker run -p 4000:4000 --env-file .env service-blocki:latest
```

---

## Recursos Adicionales

- **Documentación Completa:** BACKEND_IMPLEMENTATION_REPORT.md
- **Resumen:** RESUMEN_FINAL.md
- **Swagger UI:** http://localhost:4000/api/docs
- **Stellar Docs:** https://developers.stellar.org
- **SEP-24 Spec:** https://github.com/stellar/stellar-protocol/blob/master/ecosystem/sep-0024.md

---

## Soporte

¿Problemas? Revisa en orden:
1. BACKEND_IMPLEMENTATION_REPORT.md (sección Troubleshooting)
2. Logs en consola
3. Swagger UI (http://localhost:4000/api/docs)
4. Variables .env correctas
5. PostgreSQL y Redis corriendo

---

**¡Listo para empezar! 🚀**

```bash
npm run start:dev
# Abre: http://localhost:4000/api/docs
```

*service-blocki v1.0.0 - 19 Nov 2025*
