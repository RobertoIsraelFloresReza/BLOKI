# 🔗 Frontend-Backend Integration - Complete Guide

## ✅ Cambios Completados

### 1. ✅ AdminSecretKey Ahora es Opcional

**Archivo:** `src/components/seller/PropertyUploadForm.jsx`

**Cambios:**
- ✅ Campo `adminSecretKey` ya NO es requerido
- ✅ Validación solo se ejecuta si el usuario ingresa un valor
- ✅ Toast de advertencia cuando se crea propiedad sin secret key
- ✅ Mensajes claros explicando que el campo es opcional

**Beneficios:**
- Permite crear propiedades para testing sin necesidad de Stellar keys
- El campo puede agregarse después para habilitar funcionalidad blockchain
- Flujo más flexible para desarrollo y pruebas

**Código:**
```javascript
// Validation - adminSecretKey is OPTIONAL
if (formData.adminSecretKey && !formData.adminSecretKey.startsWith('S')) {
  newErrors.adminSecretKey = 'Invalid Stellar secret key format (must start with S)'
}

// Only include in payload if provided
if (formData.adminSecretKey) {
  payload.adminSecretKey = formData.adminSecretKey
} else {
  toast('⚠️ Property will be created without blockchain deployment. Add secret key later to enable tokenization.', {
    duration: 5000,
    icon: '⚠️',
  })
}
```

---

### 2. ✅ Mensajes de Error y Success Mejorados

**Archivos modificados:**
- `src/hooks/useAuth.js` ✅ Ya tenía toasts
- `src/hooks/useProperties.js` ✅ Ya tenía toasts
- `src/components/seller/PropertyUploadForm.jsx` ✅ Actualizado para no duplicar toasts

**Mejoras:**
- ✅ Toasts centralizados en hooks (useAuth, useProperties)
- ✅ Mensajes claros y específicos según el tipo de error
- ✅ Success toasts con duración apropiada (4s)
- ✅ Error toasts con más contexto (6s)
- ✅ Eliminación de toasts duplicados en componentes

**Ejemplos de Mensajes:**

**Success:**
```javascript
✅ Property created successfully!
✅ Property updated successfully!
✅ Propiedad creada. Aparecerá en tu dashboard en unos momentos.
```

**Errors:**
```javascript
❌ Error creating property: [specific error message from backend]
❌ Error updating property: [specific error message from backend]
```

**Warnings:**
```javascript
⚠️ Property will be created without blockchain deployment. Add secret key later to enable tokenization.
```

---

### 3. ✅ SellerDashboard Conectado con API Real

**Archivo:** `src/pages/seller/SellerDashboard.jsx`

**Cambios:**
- ❌ Eliminado `MOCK_SELLER_PROPERTIES` (mock data)
- ✅ Usando `useProperties()` hook para fetch de datos reales
- ✅ Filtrado de propiedades por usuario actual
- ✅ Estados de loading y error implementados
- ✅ Cálculo dinámico de estadísticas (revenue, investors, etc)
- ✅ Auto-refresh al crear nueva propiedad

**Filtrado por Usuario:**
```javascript
// Filter properties to show only current user's properties
const userProperties = allProperties.filter(property => {
  // Match by user ID or legal owner
  return property.userId === user?.id ||
         property.legalOwner === user?.name ||
         property.legalOwner === user?.email
})
```

**Estadísticas Calculadas:**
```javascript
// Total properties
const totalProperties = userProperties.length

// Revenue: sum of (tokensSold * pricePerToken)
const totalRevenue = userProperties.reduce((sum, prop) => {
  const tokensSold = (prop.totalSupply || 0) - (prop.availableTokens || 0)
  const pricePerToken = (prop.valuation || 0) / (prop.totalSupply || 1)
  return sum + (tokensSold * pricePerToken)
}, 0)

// Investors (will be accurate when ownership table is connected)
const totalInvestors = userProperties.reduce((sum, prop) => {
  return sum + (prop.investors || 0)
}, 0)
```

**Estados UI:**
- ✅ Loading spinner mientras carga
- ✅ Error state con botón de reload
- ✅ Empty state si no hay propiedades
- ✅ Grid de propiedades con datos reales

---

### 4. ✅ PropertyDetails con Datos Reales

**Archivo:** `src/pages/property/PropertyDetails.jsx`

**Cambios:**
- ✅ Normalización completa de datos backend vs frontend
- ✅ Soporte para ambos schemas (backend y mock)
- ✅ Uso de imágenes reales del backend
- ✅ Fallback a placeholder si no hay imágenes

**Normalización de Datos:**
```javascript
// Normalize property data (backend schema vs frontend schema)
const title = property.name || property.title
const location = property.address || property.location
const price = property.valuation || property.price
const category = property.metadata?.category || property.category || 'houses'
const area = property.metadata?.area || property.area
const bedrooms = property.metadata?.bedrooms || property.bedrooms
const bathrooms = property.metadata?.bathrooms || property.bathrooms
const totalTokens = property.totalSupply || property.totalTokens || 0
const tokensAvailable = property.availableTokens || property.tokensAvailable || totalTokens
```

**Imágenes:**
```javascript
// Use real images from property or fallback to placeholder
const propertyImages = property.images && property.images.length > 0
  ? property.images
  : [property.image || '/blocki_general.jpg']
```

---

### 5. ✅ Rutas React Router Verificadas

**Archivo:** `src/App.jsx`

**Rutas Configuradas:**
- ✅ `/` - Marketplace (público)
- ✅ `/seller` - Seller Dashboard (requiere auth)
- ✅ `/wallet` - Wallet Page (requiere auth)
- ✅ `/profile` - Profile Page (requiere auth)
- ✅ `/auth` - Auth Page (login/register)
- ✅ `/auth/callback` - OAuth2 Callback

**Protección de Rutas:**
```javascript
// Protected routes redirect to /auth if not logged in
<Route
  path="/seller"
  element={
    user ? <SellerDashboard user={user} /> : <Navigate to="/auth" replace />
  }
/>
```

**Navegación:**
- ✅ Navbar usa `useNavigate()` de React Router
- ✅ URLs cambian al navegar
- ✅ Botón "atrás" del navegador funciona
- ✅ Links directos funcionan
- ✅ Refresh mantiene la página

---

## 🧪 Testing End-to-End Guide

### Flujo Completo: Register → Login → Upload Property → Ver en Marketplace

#### Test 1: Registro de Usuario (Register)

**Pasos:**
1. Abrir `https://blocki.tech/auth`
2. Click en tab "Registrarse"
3. Llenar formulario:
   - Nombre: "Test User"
   - Email: "test@example.com"
   - Password: "Password123"
4. Click en "Registrarse"

**Resultado Esperado:**
- ✅ Toast: "¡Cuenta creada exitosamente!"
- ✅ Redirect automático a `/` (Marketplace)
- ✅ Usuario aparece en Navbar (nombre o email)
- ✅ Token JWT guardado en localStorage (`blocki_token`)
- ✅ User data guardado en localStorage (`blocki_user`)

**Verificar en DevTools:**
```javascript
localStorage.getItem('blocki_token')  // Debe tener un JWT
localStorage.getItem('blocki_user')   // Debe tener JSON con user data
```

---

#### Test 2: Login (si ya tienes cuenta)

**Pasos:**
1. Abrir `https://blocki.tech/auth`
2. Tab "Iniciar Sesión" (default)
3. Ingresar:
   - Email: "test@example.com"
   - Password: "Password123"
4. Click en "Iniciar Sesión"

**Resultado Esperado:**
- ✅ Toast: "¡Bienvenido!"
- ✅ Redirect a `/`
- ✅ Usuario autenticado en Navbar

---

#### Test 3: OAuth2 Login (Google)

**Pasos:**
1. Abrir `https://blocki.tech/auth`
2. Click en botón "Continue with Google"
3. Seleccionar cuenta de Google
4. Autorizar aplicación

**Resultado Esperado:**
- ✅ Redirect a Google OAuth
- ✅ Callback a `https://blocki.tech/auth/callback?token=...`
- ✅ Token decodificado y guardado
- ✅ Redirect final a `/` (Marketplace)
- ✅ Usuario autenticado

**Nota:** El backend ahora detecta el origen (localhost vs production) y redirige correctamente.

---

#### Test 4: Navegar a Seller Dashboard

**Pasos:**
1. Estando logueado, click en tab "Propiedades" (desktop) o "Store" (mobile)
2. URL debe cambiar a `https://blocki.tech/seller`

**Resultado Esperado:**
- ✅ URL: `https://blocki.tech/seller`
- ✅ Página muestra "Mis Propiedades"
- ✅ Si no tienes propiedades: Empty state con botón "Subir Propiedad"
- ✅ Si tienes propiedades: Grid de tus propiedades
- ✅ Estadísticas: Total Properties, Total Revenue, Total Investors

---

#### Test 5: Subir una Nueva Propiedad (SIN adminSecretKey)

**Pasos:**
1. En `/seller`, click en "Subir Propiedad"
2. Llenar formulario:
   - **Imágenes**: Subir 1-4 fotos
   - **Título**: "Casa de Prueba en Miami"
   - **Location**: "Miami, FL"
   - **Tipo**: Seleccionar "House"
   - **Precio**: 500000
   - **Area**: 2000
   - **Bedrooms**: 3
   - **Bathrooms**: 2
   - **Total Tokens**: 500
   - **Description**: "Propiedad de prueba"
   - **Admin Secret Key**: (DEJAR VACÍO)
3. Click en "Upload Property"

**Resultado Esperado:**
- ✅ Toast de advertencia: "⚠️ Property will be created without blockchain deployment..."
- ✅ Loading spinner mientras sube
- ✅ Toast de success: "Propiedad creada exitosamente" (del hook)
- ✅ Pantalla de éxito con resumen de la propiedad
- ✅ Click en "Continuar" regresa a Seller Dashboard
- ✅ Nueva propiedad aparece en la lista

**Console Debug:**
```
🔍 DEBUG PropertyUploadForm - Payload: { name, propertyId, address, ... }
🔍 DEBUG PropertyUploadForm - Response: { id, name, ... }
🔍 DEBUG useProperties - Property created: { ... }
🔍 DEBUG SellerDashboard - User properties: [...]
```

---

#### Test 6: Subir Propiedad (CON adminSecretKey)

**Pasos:**
1. Repetir Test 5 PERO:
   - **Admin Secret Key**: Ingresar `SABC123...` (tu Stellar secret key real)
2. Click en "Upload Property"

**Resultado Esperado:**
- ✅ NO toast de advertencia (porque sí incluiste secret key)
- ✅ Success: Propiedad creada
- ✅ Backend debería deployar contrato (si el backend está configurado para hacerlo)

---

#### Test 7: Ver Propiedad en Marketplace

**Pasos:**
1. Desde Seller Dashboard, click en tab "Marketplace" (navbar)
2. URL debe ser `https://blocki.tech/`
3. Buscar tu propiedad en el grid

**Resultado Esperado:**
- ✅ URL: `https://blocki.tech/`
- ✅ Tu propiedad aparece en el grid (puede tardar unos segundos en refrescar)
- ✅ PropertyCard muestra:
  - Imagen correcta
  - Título correcto
  - Location correcto
  - Precio correcto
  - Tokens disponibles

**Si no aparece:**
- Verificar console logs: `🔍 DEBUG Marketplace - Properties: [...]`
- Verificar que `legalOwner` coincide con tu nombre/email
- Hacer refresh manual (F5)

---

#### Test 8: Ver Detalles de Propiedad

**Pasos:**
1. En Marketplace, click en cualquier PropertyCard
2. Debería abrir PropertyDetails

**Resultado Esperado:**
- ✅ Galería de imágenes funcional
- ✅ Título, location, precio correctos
- ✅ Descripción visible
- ✅ Bedrooms, bathrooms, area correctos
- ✅ Progress bar de tokens vendidos
- ✅ Botón "Buy Tokens" (funcionalidad mock por ahora)

---

#### Test 9: Navegación con Browser Back Button

**Pasos:**
1. Navegar: Marketplace → PropertyDetails → Seller
2. Click botón "atrás" del navegador

**Resultado Esperado:**
- ✅ Debe regresar a la página anterior
- ✅ URL cambia correctamente
- ✅ Estado se mantiene (scroll position, etc)

---

#### Test 10: Direct URL Access

**Pasos:**
1. Abrir directamente `https://blocki.tech/seller` (estando logueado)

**Resultado Esperado:**
- ✅ Seller Dashboard se carga directamente
- ✅ Sin redirect innecesarios

**Pasos (sin login):**
1. Logout
2. Abrir directamente `https://blocki.tech/seller`

**Resultado Esperado:**
- ✅ Redirect a `https://blocki.tech/auth`
- ✅ Toast o mensaje indicando que necesitas login

---

#### Test 11: Refresh en Página Específica

**Pasos:**
1. Navegar a `https://blocki.tech/seller`
2. Presionar F5 (refresh)

**Resultado Esperado:**
- ✅ Página se mantiene en `/seller`
- ✅ NO redirect a `/`
- ✅ Datos se recargan correctamente

---

## 📊 Estado de Integración

### ✅ Completado (Sin Stellar)

- [x] Autenticación (Login/Register)
- [x] OAuth2 (Google) con detección de origen
- [x] Creación de propiedades (CRUD Create)
- [x] Lectura de propiedades (CRUD Read)
- [x] Marketplace con datos reales
- [x] Seller Dashboard con filtrado por usuario
- [x] PropertyDetails con normalización de datos
- [x] Navegación React Router completa
- [x] Mensajes toast claros y consistentes
- [x] AdminSecretKey opcional

### ⏳ Pendiente (Requiere Stellar/Backend)

- [ ] Actualizar propiedad (CRUD Update)
- [ ] Eliminar propiedad (CRUD Delete)
- [ ] Compra de tokens (Purchase flow)
- [ ] Ownership tracking (tabla de ownerships)
- [ ] Transaction history
- [ ] Wallet balance real
- [ ] KYC integration
- [ ] SEP-24 anchor integration

---

## 🔧 Troubleshooting

### Problema: No veo mis propiedades en Seller Dashboard

**Posibles causas:**
1. `legalOwner` en backend no coincide con `user.name` o `user.email`
2. `userId` no está siendo guardado en backend

**Solución:**
- Verificar console logs: `🔍 DEBUG SellerDashboard - User properties`
- Verificar que `legalOwner` en payload coincide con usuario actual
- Temporal: Editar filtro en `SellerDashboard.jsx` para incluir otros criterios

### Problema: Propiedad creada pero no aparece en Marketplace

**Posibles causas:**
1. Query no se ha refrescado
2. Propiedad tiene `status` diferente de 'active'

**Solución:**
- Hacer refresh manual (F5)
- Verificar en Network tab que la petición GET `/properties` incluye tu propiedad
- Verificar que `status` es `active` o está ausente

### Problema: Toast duplicados

**Causa:**
- Toasts definidos tanto en hook como en componente

**Solución:**
- Ya corregido: PropertyUploadForm ya NO tiene toasts duplicados
- Los toasts se manejan centralmente en hooks

### Problema: Imágenes no se muestran

**Causa:**
- Backend no está guardando/retornando URLs de imágenes correctamente

**Solución:**
- Verificar que `property.images` es un array de URLs
- Verificar endpoint POST `/properties/:id/images`
- Usar placeholder mientras tanto: `/blocki_general.jpg`

---

## 🚀 Próximos Pasos Recomendados

1. **Testing en Producción:**
   - Ejecutar todos los tests end-to-end listados arriba
   - Documentar cualquier error o comportamiento inesperado

2. **Backend Improvements:**
   - Agregar filtro `GET /properties?userId=X` para optimizar
   - Agregar endpoint `GET /users/:id/properties` específico
   - Implementar upload de imágenes real

3. **Frontend Polish:**
   - Mejorar mensajes de error con traducciones
   - Agregar loading skeletons en lugar de spinner
   - Implementar infinite scroll en Marketplace

4. **Stellar Integration (Siguiente Fase):**
   - Conectar Freighter wallet
   - Implementar purchase flow real con Stellar
   - Deploy de contratos con adminSecretKey
   - Tracking de ownership on-chain

---

## 📝 Notas Importantes

### LocalStorage Keys

**SIEMPRE usar estos nombres:**
```javascript
localStorage.getItem('blocki_token')   // JWT token
localStorage.getItem('blocki_user')    // User object JSON
```

**NUNCA usar:**
- `access_token` ❌
- `token` ❌
- `user` ❌

### Backend Schema Differences

**Backend usa:**
- `name` (no `title`)
- `address` (no `location`)
- `valuation` (no `price`)
- `totalSupply` (no `totalTokens`)
- `availableTokens` (no `tokensAvailable`)
- `metadata.category` (no root `category`)

**Frontend debe normalizar siempre:**
```javascript
const title = property.name || property.title
const location = property.address || property.location
// etc...
```

---

**Última actualización:** 2025-11-20
**Estado:** ✅ INTEGRACIÓN BÁSICA COMPLETA (Sin Stellar)
