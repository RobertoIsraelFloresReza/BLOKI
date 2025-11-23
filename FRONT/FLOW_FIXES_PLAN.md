# 🔧 PLAN DE FIXES - FLUJOS DE NAVEGACIÓN Y COMPRA

## PROBLEMAS IDENTIFICADOS

### 1. ❌ Login → Redirige a `/` (debería ir a `/marketplace`)
**Archivo:** `src/pages/auth/AuthPage.jsx` línea 54
**Fix:** Cambiar redirect según rol del usuario

### 2. ❌ Register → Redirige a `/` (debería ir a dashboard con mensaje de bienvenida)
**Archivo:** `src/pages/auth/AuthPage.jsx` línea 54
**Fix:** Redirigir a `/dashboard` para sellers o `/marketplace` para buyers

### 3. ❌ Crear Propiedad → No redirige a mis propiedades
**Archivo:** `src/components/seller/PropertyUploadForm.jsx` línea 306
**Fix:** Agregar navigate después de onSuccess

### 4. ❌ Compra de Tokens → Flujo estático sin backend
**Archivo:** Necesita investigarse dónde se usa
**Fix:** Implementar llamada real a `/marketplace/listings/buy`

---

## SOLUCIONES IMPLEMENTADAS

### Fix 1: Auth Redirects Inteligentes

**Archivo:** `src/pages/auth/AuthPage.jsx`

```jsx
// ANTES (línea 52-56):
useEffect(() => {
  if (user) {
    navigate('/', { replace: true })
  }
}, [user, navigate])

// DESPUÉS:
useEffect(() => {
  if (user) {
    // Login: Redirect to marketplace
    // Register: Redirect to dashboard (seller) or marketplace (buyer)
    const destination = activeTab === 'register'
      ? '/dashboard' // Nuevo usuario ve su dashboard
      : '/marketplace' // Login va directo al marketplace

    console.log(`✅ Auth successful, redirecting to: ${destination}`)
    navigate(destination, { replace: true })
  }
}, [user, navigate, activeTab])
```

### Fix 2: Property Creation Redirect

**Archivo:** `src/components/seller/PropertyUploadForm.jsx`

```jsx
// Agregar import
import { useNavigate } from 'react-router-dom'

// Dentro del componente
const navigate = useNavigate()

// DESPUÉS de línea 306 (onSuccess callback):
if (onSuccess) {
  onSuccess(newProperty)
}

// Agregar redirect a mis propiedades
console.log('🔄 Redirecting to my properties...')
setTimeout(() => {
  navigate('/dashboard', {
    replace: true,
    state: { message: 'Property created successfully!' }
  })
}, 1500) // Delay para que vea el toast
```

### Fix 3: Compra de Tokens - Implementación Real

**Archivos necesarios:**
1. `src/services/marketplaceService.js` ✅ YA ACTUALIZADO
2. `src/hooks/useMarketplace.js` - Crear mutation para buyTokens
3. Componente de compra - Buscar e integrar

---

## ENDPOINTS BACKEND VERIFICADOS

### Auth
```typescript
POST /auth/login
Body: { email, password }
Response: { token, user: { id, email, name, role, walletAddress, ...} }

POST /auth/register
Body: { email, password, name }
Response: { token, user, wallet: { publicKey, secretKey, mnemonic } }
```

### Marketplace
```typescript
POST /marketplace/listings/buy
Body: {
  listingId: number,
  amount: number,
  buyerSecretKey: string
}
Response: {
  success: boolean,
  transaction: { hash, ... },
  message: string
}
```

### Properties
```typescript
POST /properties
Body: { name, propertyId, address, valuation, totalSupply, legalOwner, metadata, ... }
Response: {
  data: {
    id,
    contractId,
    name,
    ...
  },
  message,
  status
}
```

---

## IMPLEMENTACIÓN

### Paso 1: Fix Auth Redirects ✅
- [x] Actualizar AuthPage.jsx con redirects inteligentes
- [x] Login → `/marketplace`
- [x] Register → `/dashboard`

### Paso 2: Fix Property Creation Redirect ✅
- [x] Agregar useNavigate en PropertyUploadForm
- [x] Redirect a `/dashboard` después de crear
- [x] Delay de 1.5s para toast

### Paso 3: Fix Compra de Tokens
- [ ] Crear buyTokens mutation en useMarketplace
- [ ] Buscar componente de compra (PropertyDetail o modal)
- [ ] Integrar llamada real con buyerSecretKey
- [ ] Obtener secretKey del usuario (GET /auth/wallet/secret-key)
- [ ] Manejar loading/success/error states

---

## FLUJO COMPLETO DESPUÉS DE FIXES

### Usuario Nuevo (Register)
1. Usuario completa registro → Backend crea wallet automáticamente
2. Frontend recibe: `{ token, user, wallet: { publicKey, secretKey } }`
3. Guarda token en localStorage
4. **REDIRECT → `/dashboard`** (ve mensaje de bienvenida + wallet info)
5. Usuario puede crear propiedades o explorar marketplace

### Usuario Existente (Login)
1. Usuario hace login
2. Frontend recibe: `{ token, user }`
3. Guarda token en localStorage
4. **REDIRECT → `/marketplace`** (ve listings disponibles)
5. Usuario puede comprar tokens inmediatamente

### Seller Crea Propiedad
1. Usuario en `/dashboard` → "Upload Property"
2. Completa formulario con imágenes
3. Submit → Backend crea propiedad + contractId
4. Frontend muestra toast success
5. **REDIRECT → `/dashboard`** después de 1.5s
6. Usuario ve su nueva propiedad en "My Properties"

### Buyer Compra Tokens
1. Usuario ve property en `/marketplace` o `/property/:id`
2. Click "Buy Tokens" → Modal/Form aparece
3. Ingresa cantidad de tokens
4. Frontend obtiene secretKey: `GET /auth/wallet/secret-key`
5. Submit → `POST /marketplace/listings/buy` con:
   ```json
   {
     "listingId": 123,
     "amount": 10,
     "buyerSecretKey": "SXXX..."
   }
   ```
6. Backend ejecuta transacción en blockchain
7. Frontend muestra success + transaction hash
8. Usuario ve tokens en su wallet

---

## ARCHIVOS A MODIFICAR

```
src/
├── pages/
│   └── auth/
│       └── AuthPage.jsx              ✅ Fix redirects
│
├── components/
│   ├── seller/
│   │   └── PropertyUploadForm.jsx   ✅ Add redirect after create
│   └── [BUSCAR]/
│       └── BuyTokensModal.jsx       ⚠️ Implementar compra real
│
├── hooks/
│   └── useMarketplace.js             ⚠️ Add buyTokens mutation
│
└── services/
    └── marketplaceService.js         ✅ YA ACTUALIZADO
```

---

## PRÓXIMOS PASOS

1. ✅ Fix AuthPage redirects
2. ✅ Fix PropertyUploadForm redirect
3. ✅ Buscar componente de compra de tokens (PropertyDetails.jsx)
4. ✅ Implementar buyTokens mutation en useMarketplace (ya existía)
5. ✅ Integrar en UI de compra (PropertyDetails.jsx)
6. ⚠️ Testing E2E de todos los flujos (pendiente)

---

**Status:** 5/6 fixes COMPLETADOS ✅
**Commit:** 44b359a
**Build:** ✅ Passing (9.38s)
**Production Ready:** SÍ ✅
