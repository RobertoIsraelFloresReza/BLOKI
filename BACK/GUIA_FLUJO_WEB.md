# GUÍA FLUJO COMPLETO - FRONTEND WEB

## BASE URL
```
https://api.blocki.levsek.com.mx
```

---

## FLUJO COMPLETO (7 PASOS)

### 1. REGISTRO USUARIO (Vendedor)
**Endpoint:** `POST /auth/register`

**Body:**
```json
{
  "name": "Isaac Levsek",
  "email": "test@blocki.tech",
  "password": "SecurePass123!"
}
```

**Response:**
```json
{
  "data": {
    "user": {
      "id": 123,
      "email": "test@blocki.tech",
      "stellarPublicKey": "GABC..."
    },
    "access_token": "eyJhbGc..."
  }
}
```

**Vista:** `/register` o `/signup`
- Form: name, email, password
- Guardar `access_token` en localStorage
- Guardar `user` en state
- Redirect a `/dashboard`

---

### 2. OBTENER SECRET KEY
**Endpoint:** `GET /auth/wallet/secret-key`

**Headers:**
```
Authorization: Bearer {access_token}
```

**Response:**
```json
{
  "data": {
    "stellarPublicKey": "GABC...",
    "stellarSecretKey": "SABC..."
  }
}
```

**Vista:** `/wallet/backup` o modal en dashboard
- Mostrar publicKey
- Mostrar secretKey (con copy button)
- Warning: "Guarda tu secret key en lugar seguro"
- Guardar `stellarSecretKey` en state (temporal)
- Button: "Ya guardé mi clave" → siguiente paso

---

### 3. CREAR PROPIEDAD TOKENIZADA
**Endpoint:** `POST /properties`

**Headers:**
```
Authorization: Bearer {access_token}
```

**Body:**
```json
{
  "name": "Casa Premium en Polanco",
  "propertyId": "PROP-1234567890",
  "description": "Casa de lujo con 4 recámaras",
  "address": "Av. Polanco 456, CDMX",
  "totalSupply": 100,
  "valuation": 5000000,
  "legalOwner": "Isaac Levsek",
  "adminSecretKey": "{stellarSecretKey}",
  "metadata": {
    "bedrooms": 4,
    "bathrooms": 3,
    "area": 300,
    "category": "houses",
    "yearBuilt": 2022,
    "parkingSpaces": 2
  }
}
```

**Response:**
```json
{
  "data": {
    "id": 456,
    "contractId": "CDHF...",
    "name": "Casa Premium en Polanco",
    "totalSupply": "1000000000",
    "registryTxHash": "abc123..."
  }
}
```

**Vista:** `/properties/create`
- Form con todos los campos
- Loading: "Desplegando en blockchain... (10-30 seg)"
- Success: Mostrar contractId y link a Stellar Explorer
- Link: `https://stellar.expert/explorer/testnet/contract/{contractId}`
- Guardar `property.id` para siguiente paso
- Button: "Crear Listing" → paso 4

---

### 4. CREAR LISTING EN MARKETPLACE
**Endpoint:** `POST /marketplace/listings`

**Headers:**
```
Authorization: Bearer {access_token}
```

**Body:**
```json
{
  "propertyId": 456,
  "amount": 50,
  "pricePerToken": 50000,
  "sellerSecretKey": "{stellarSecretKey}",
  "expirationDays": 30
}
```

**Response:**
```json
{
  "data": {
    "listingId": "1",
    "amount": "500000000",
    "pricePerToken": "500000000000",
    "totalPrice": "2500000000000000",
    "txHash": "def456..."
  }
}
```

**Vista:** `/listings/create` o modal en property detail
- Input: Cantidad de tokens a vender
- Input: Precio por token
- Mostrar: Total price calculado
- Loading: "Registrando en blockchain..."
- Success: Mostrar listingId y txHash
- Link: Ver en marketplace
- Redirect a `/marketplace`

---

### 5. REGISTRO COMPRADOR (2do Usuario)
**Endpoint:** `POST /auth/register`

**Body:** (igual que paso 1)

**Vista:** `/register` (mismo componente)
- Repetir paso 1 con otro email
- Guardar nuevo `access_token` en localStorage
- Guardar nuevo `user` en state

---

### 6. OBTENER SECRET KEY COMPRADOR
**Endpoint:** `GET /auth/wallet/secret-key`

**Vista:** `/wallet/backup` (mismo componente)
- Repetir paso 2
- Guardar `stellarSecretKey` del comprador

---

### 7. COMPRAR TOKENS
**Endpoint:** `POST /marketplace/listings/buy`

**Headers:**
```
Authorization: Bearer {access_token_comprador}
```

**Body:**
```json
{
  "listingId": 1,
  "amount": 10,
  "buyerSecretKey": "{stellarSecretKey_comprador}"
}
```

**Response:**
```json
{
  "data": {
    "transaction": {
      "txHash": "ghi789...",
      "buyerAddress": "GDEF...",
      "amount": "100000000",
      "totalPrice": "500000000000000"
    }
  }
}
```

**Vista:** `/marketplace` → click en listing → `/listings/{listingId}/buy`
- Mostrar listing details (property, price, tokens disponibles)
- Input: Cantidad de tokens a comprar
- Mostrar: Total a pagar calculado
- Loading: "Procesando compra en blockchain..."
- Success: Mostrar txHash
- Link: `https://stellar.expert/explorer/testnet/tx/{txHash}`
- Redirect a `/dashboard` o `/portfolio`

---

## RESUMEN DE VISTAS NECESARIAS

```
1. /register                    → Auth (Registro)
2. /wallet/backup              → Wallet (Mostrar secret key)
3. /properties/create          → Properties (Crear propiedad)
4. /listings/create            → Marketplace (Crear listing)
5. /marketplace                → Marketplace (Listar listings)
6. /listings/{id}/buy          → Marketplace (Comprar tokens)
7. /dashboard o /portfolio     → Portfolio (Ver propiedades)
```

---

## ESTADOS A GUARDAR

```javascript
// LocalStorage
localStorage.setItem('access_token', token);

// React State/Context
const [user, setUser] = useState({
  id: 123,
  email: "...",
  stellarPublicKey: "..."
});

const [secretKey, setSecretKey] = useState("SABC..."); // temporal

const [currentProperty, setCurrentProperty] = useState({
  id: 456,
  contractId: "CDHF...",
  name: "Casa Premium..."
});

const [currentListing, setCurrentListing] = useState({
  listingId: "1",
  amount: "500000000",
  pricePerToken: "500000000000"
});
```

---

## VALIDACIONES IMPORTANTES

1. **Secret Key:** NUNCA enviarlo a un servidor que no sea el propio backend
2. **Amounts:** Siempre dividir por `10000000` para mostrar valores legibles
3. **Loading states:** Operaciones blockchain toman 10-30 segundos
4. **Error handling:** Mostrar mensajes claros si falla
5. **Links blockchain:** Siempre proveer enlaces a Stellar Explorer

---

## TESTING RÁPIDO

```bash
# En service-blocki/
node test-complete-flow.js
```

Este script prueba TODO el flujo backend. Úsenlo para validar que endpoints funcionan.

---

## NOTAS FINALES

- **API Base:** `https://api.blocki.levsek.com.mx`
- **Network:** Stellar Testnet
- **Explorer:** `https://stellar.expert/explorer/testnet`
- **Divisor tokens:** `10000000` (7 decimales Stellar)
- **Loading:** Operaciones blockchain = 10-30 segundos

**¡LISTO PARA IMPLEMENTAR EN WEB! 🚀**
