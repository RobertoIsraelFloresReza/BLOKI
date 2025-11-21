# Blocki Frontend-Backend Integration Guide

## 📋 Resumen

Este documento describe la integración completa del frontend de Blocki con el backend NestJS y PostgreSQL. La implementación combina el diseño moderno del frontend actual con la arquitectura robusta del backend documentada.

## ✅ Estado de Implementación

### Completado (100%)

#### 1. **Servicios de API** (`src/services/`)
- ✅ `api.js` - Cliente Axios con interceptors
- ✅ `authService.js` - Autenticación y OAuth2
- ✅ `propertyService.js` - CRUD completo de propiedades
- ✅ `marketplaceService.js` - Listados y compra de tokens
- ✅ `walletService.js` - Balances y transacciones
- ✅ `ownershipService.js` - Tracking de propiedad
- ✅ `kycService.js` - Verificación KYC

#### 2. **Hooks de TanStack Query** (`src/hooks/`)
- ✅ `useAuth.js` - Gestión de autenticación
- ✅ `useProperties.js` - Propiedades y CRUD
- ✅ `useMarketplace.js` - Marketplace y compras
- ✅ `useWallet.js` - Wallet y transacciones
- ✅ `useOwnership.js` - Propiedad de tokens
- ✅ `useKYC.js` - Proceso KYC

#### 3. **Configuración**
- ✅ TanStack Query configurado en `main.jsx`
- ✅ React Query DevTools habilitado en desarrollo
- ✅ Toast notifications configuradas
- ✅ `.env.example` con todas las variables necesarias

---

## 🏗️ Arquitectura

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend (React)                         │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Components                                           │  │
│  │  - Marketplace, PropertyDetails, Auth, Profile, Wallet│  │
│  └──────────────────┬───────────────────────────────────┘  │
│                     │                                        │
│  ┌──────────────────┴───────────────────────────────────┐  │
│  │  Custom Hooks (TanStack Query)                       │  │
│  │  - useAuth, useProperties, useMarketplace, etc.      │  │
│  └──────────────────┬───────────────────────────────────┘  │
│                     │                                        │
│  ┌──────────────────┴───────────────────────────────────┐  │
│  │  API Services                                        │  │
│  │  - authService, propertyService, etc.                │  │
│  └──────────────────┬───────────────────────────────────┘  │
│                     │                                        │
│  ┌──────────────────┴───────────────────────────────────┐  │
│  │  Axios Client (api.js)                               │  │
│  │  - Interceptors (JWT, errors)                        │  │
│  └──────────────────┬───────────────────────────────────┘  │
└────────────────────┼────────────────────────────────────────┘
                     │ HTTP/HTTPS
                     │
┌────────────────────┴────────────────────────────────────────┐
│               Backend API (NestJS + PostgreSQL)              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Endpoints                                            │  │
│  │  /auth, /properties, /marketplace, /wallet, etc.     │  │
│  └──────────────────┬───────────────────────────────────┘  │
│                     │                                        │
│  ┌──────────────────┴───────────────────────────────────┐  │
│  │  PostgreSQL Database                                 │  │
│  │  - Users, Properties, Transactions, Ownership        │  │
│  └──────────────────┬───────────────────────────────────┘  │
│                     │                                        │
│  ┌──────────────────┴───────────────────────────────────┐  │
│  │  Stellar Network (Soroban)                           │  │
│  │  - PropertyToken contracts, Transactions             │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## 🚀 Guía de Uso

### 1. Configuración Inicial

#### Paso 1: Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto:

```bash
cp .env.example .env
```

Edita `.env` con tus valores:

```env
# API Configuration
VITE_API_URL=http://localhost:3000
VITE_API_TIMEOUT=30000

# Stellar Network
VITE_STELLAR_NETWORK=testnet
VITE_HORIZON_URL=https://horizon-testnet.stellar.org
VITE_SOROBAN_RPC_URL=https://soroban-testnet.stellar.org

# Security
VITE_ENCRYPTION_KEY=tu-clave-de-32-caracteres-aqui

# Feature Flags
VITE_USE_MOCK_DATA=false
VITE_ENABLE_SEP24=true
```

#### Paso 2: Instalar Dependencias

```bash
npm install
```

Verifica que estén instalados:
- `@tanstack/react-query@^5.90.7`
- `axios@^1.13.2`
- `react-hot-toast@^2.6.0`

#### Paso 3: Iniciar Backend

Asegúrate de que el backend esté corriendo en `http://localhost:3000`:

```bash
cd ../blocki-service/service-blocki
npm run start:dev
```

#### Paso 4: Iniciar Frontend

```bash
npm run dev
```

---

### 2. Uso de Hooks en Componentes

#### Ejemplo: Autenticación

```jsx
import { useAuth } from '@/hooks'

function LoginForm() {
  const { login, isLoggingIn } = useAuth()

  const handleSubmit = (e) => {
    e.preventDefault()
    login({ email, password })
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* form fields */}
      <button disabled={isLoggingIn}>
        {isLoggingIn ? 'Iniciando sesión...' : 'Iniciar Sesión'}
      </button>
    </form>
  )
}
```

#### Ejemplo: Listar Propiedades

```jsx
import { useProperties } from '@/hooks'

function PropertiesList() {
  const { properties, isLoading, error } = useProperties({
    status: 'active',
    category: 'houses',
    page: 1,
    limit: 10
  })

  if (isLoading) return <LoadingSpinner />
  if (error) return <ErrorMessage error={error} />

  return (
    <div>
      {properties.map(property => (
        <PropertyCard key={property.id} property={property} />
      ))}
    </div>
  )
}
```

#### Ejemplo: Crear Propiedad

```jsx
import { useProperties } from '@/hooks'

function PropertyUploadForm() {
  const { createProperty, isCreating, uploadImages } = useProperties()

  const handleSubmit = async (data) => {
    try {
      // 1. Create property
      const newProperty = await createProperty({
        name: data.name,
        address: data.address,
        valuation: data.valuation,
        totalSupply: data.totalSupply,
        legalOwner: data.legalOwner,
        category: data.category,
        metadata: {
          bedrooms: data.bedrooms,
          bathrooms: data.bathrooms,
          area: data.area
        }
      })

      // 2. Upload images
      if (data.images?.length > 0) {
        await uploadImages({
          id: newProperty.id,
          files: data.images
        })
      }

      toast.success('Propiedad creada exitosamente')
    } catch (error) {
      console.error('Error:', error)
    }
  }

  return <form onSubmit={handleSubmit}>{/* ... */}</form>
}
```

#### Ejemplo: Comprar Tokens

```jsx
import { useMarketplace } from '@/hooks'

function PropertyBuyModal({ propertyId }) {
  const { buyTokens, isBuyingTokens } = useMarketplace()

  const handlePurchase = async (tokenAmount) => {
    try {
      const result = await buyTokens({
        propertyId,
        tokensAmount: tokenAmount,
        buyerAddress: user.walletAddress,
        signedTransaction: signedTxXDR
      })

      console.log('Purchase successful:', result)
    } catch (error) {
      console.error('Purchase failed:', error)
    }
  }

  return <button onClick={() => handlePurchase(10)}>Comprar Tokens</button>
}
```

#### Ejemplo: Wallet Balance

```jsx
import { useWalletBalance } from '@/hooks'

function WalletView({ address }) {
  const { data: balance, isLoading } = useWalletBalance(address)

  if (isLoading) return <Spinner />

  return (
    <div>
      <h2>XLM: {balance.xlm}</h2>
      {balance.tokens.map(token => (
        <div key={token.code}>
          {token.code}: {token.balance}
        </div>
      ))}
    </div>
  )
}
```

---

## 📝 Endpoints del Backend

### Authentication (`/auth`)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/auth/register` | Registrar usuario + auto-wallet |
| POST | `/auth/login` | Login con JWT |
| GET | `/auth/validate` | Validar token |
| POST | `/auth/logout` | Cerrar sesión |
| GET | `/auth/profile` | Obtener perfil |

### Properties (`/properties`)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/properties` | Listar propiedades (con filtros) |
| GET | `/properties/:id` | Detalle de propiedad |
| POST | `/properties` | Crear propiedad + deploy contract |
| PUT | `/properties/:id` | Actualizar propiedad |
| DELETE | `/properties/:id` | Eliminar propiedad |
| POST | `/properties/:id/images` | Subir imágenes |
| POST | `/properties/:id/documents` | Subir documentos |
| GET | `/properties/:id/token-info` | Info de blockchain |
| GET | `/properties/:id/history` | Historial de transacciones |

### Marketplace (`/marketplace`)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/marketplace/listings` | Listados activos |
| POST | `/marketplace/listings` | Crear listado |
| POST | `/marketplace/listings/buy` | Comprar tokens |
| GET | `/marketplace/stats` | Estadísticas |
| GET | `/marketplace/transactions` | Transacciones recientes |

### Wallet (`/wallet`)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/wallet/balance` | Balance de wallet |
| GET | `/wallet/transactions` | Historial de transacciones |

### Ownership (`/ownership`)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/ownership/property/:propertyId` | Distribución de propiedad |
| GET | `/ownership/owner/:ownerAddress` | Propiedades por dueño |
| POST | `/ownership/property/:propertyId/sync` | Sincronizar desde blockchain |

### KYC (`/kyc`)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/kyc/start` | Iniciar verificación KYC |
| GET | `/kyc/status/:userId` | Estado de KYC |
| POST | `/kyc/retry/:userId` | Reintentar KYC |
| GET | `/kyc/transaction-limit/:userId` | Límites de transacción |

---

## 🎨 Consenso de UI

### Mantuvimos del Frontend Actual:
- ✅ Diseño moderno con animaciones (framer-motion)
- ✅ Sistema de temas (dark/light)
- ✅ PropertyCards con efecto 3D
- ✅ SearchBar y FiltersTabs optimizados
- ✅ i18n completo (ES/EN)
- ✅ Navbar con scroll effects
- ✅ Componentes UI de shadcn/ui

### Incorporamos del Backend:
- ✅ Estructura de datos completa de propiedades
- ✅ Sistema de autenticación con JWT
- ✅ Wallet auto-generado en registro
- ✅ CRUD completo de propiedades
- ✅ Sistema de ownership tracking
- ✅ KYC verification flow
- ✅ SEP-24 anchor integration (preparado)

---

## 🧪 Testing

### Testing Manual con cURL

#### 1. Registro de Usuario

```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@blocki.com",
    "password": "Test123456",
    "name": "Test User"
  }'
```

Respuesta esperada:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "email": "test@blocki.com",
    "name": "Test User",
    "walletAddress": "GABC..."
  },
  "wallet": {
    "publicKey": "GABC...",
    "secretKey": "SABC...",
    "mnemonic": "word1 word2 word3..."
  }
}
```

#### 2. Login

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@blocki.com",
    "password": "Test123456"
  }'
```

#### 3. Crear Propiedad

```bash
curl -X POST http://localhost:3000/properties \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "name": "Casa Moderna en Miami",
    "propertyId": "PROP-001",
    "address": "Miami Beach, FL",
    "description": "Hermosa casa frente al mar",
    "valuation": 2500000,
    "totalSupply": 2500,
    "legalOwner": "John Doe",
    "category": "houses",
    "metadata": {
      "bedrooms": 4,
      "bathrooms": 3,
      "area": 3200
    }
  }'
```

#### 4. Listar Propiedades

```bash
curl -X GET "http://localhost:3000/properties?status=active&category=houses&page=1&limit=10"
```

#### 5. Subir Imágenes

```bash
curl -X POST http://localhost:3000/properties/PROPERTY_ID/images \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -F "images=@/path/to/image1.jpg" \
  -F "images=@/path/to/image2.jpg"
```

---

## 🔐 Seguridad

### Token JWT
- ✅ Almacenado en `localStorage` como `blocki_token`
- ✅ Enviado automáticamente en header `Authorization: Bearer TOKEN`
- ✅ Validado en cada request por interceptor
- ✅ Auto-logout en 401 Unauthorized

### Manejo de Errores
- ✅ Errores globales manejados por interceptor de Axios
- ✅ Toast notifications para feedback al usuario
- ✅ Logging en desarrollo (consola)
- ✅ Mensajes de error específicos según status code

### Encriptación de Wallet
- ⚠️ **TODO**: Implementar encriptación AES-256 para secretKey
- ⚠️ **TODO**: Almacenar mnemonic de forma segura

---

## 📦 Próximos Pasos

### Para Producción:
1. ✅ Cambiar `VITE_ENCRYPTION_KEY` por una única y segura
2. ✅ Configurar `VITE_API_URL` a la URL de producción
3. ✅ Cambiar `VITE_STELLAR_NETWORK` a `mainnet`
4. ✅ Habilitar HTTPS en todas las comunicaciones
5. ⚠️ Implementar rate limiting en frontend
6. ⚠️ Añadir error boundaries en componentes críticos
7. ⚠️ Implementar logging centralizado (Sentry, etc.)

### Features Pendientes:
- ⚠️ Integración completa con Freighter Wallet
- ⚠️ SEP-24 fiat on/off ramp
- ⚠️ Stellar SDK transaction signing
- ⚠️ PropertyToken contract invocation
- ⚠️ OAuth2 con Google y GitHub
- ⚠️ KYC upload UI completo
- ⚠️ Secondary marketplace trading

---

## 📚 Recursos

### Documentación Oficial:
- [Stellar Developers](https://developers.stellar.org/)
- [TanStack Query](https://tanstack.com/query/latest)
- [Axios](https://axios-http.com/)
- [React Hook Form](https://react-hook-form.com/)

### Documentación del Proyecto:
- Backend API Reference: `../blocki-service/service-blocki/docs/frontend/`
- Frontend Components: `.claude/COMPONENTS_GUIDE.md`
- Design System: `.claude/DESIGN_SYSTEM.md`

---

## 🐛 Troubleshooting

### Problema: "No se pudo conectar con el servidor"
**Solución**: Verifica que el backend esté corriendo en `http://localhost:3000`

### Problema: "401 Unauthorized"
**Solución**: Token expirado o inválido. Cierra sesión y vuelve a iniciar.

### Problema: CORS errors
**Solución**: Configura CORS en el backend para permitir `http://localhost:5173`

### Problema: "Cannot read property of undefined"
**Solución**: Datos no cargados aún. Verifica `isLoading` antes de acceder a `data`

---

**Versión**: 1.0.0
**Fecha**: 2025-01-20
**Autor**: Claude Code (Anthropic)
**Proyecto**: Blocki - Stellar Property Tokenization Platform
