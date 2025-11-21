# 📋 Guía de Testing Completa - Blocki Stellar Web App

## 🎯 Objetivo
Validar el flujo completo end-to-end desde el registro de usuario hasta la visualización de propiedades en el marketplace.

---

## 🔧 Pre-requisitos

### 1. Verificar Backend Desplegado
```bash
# Test backend health
curl -I https://api.blocki.levsek.com.mx/health

# ✅ Debe retornar: HTTP/1.1 200 OK
```

### 2. Verificar Variables de Entorno
Asegúrate de que `.env` tenga:
```env
VITE_API_URL=https://api.blocki.levsek.com.mx
VITE_USE_MOCK_DATA=false
VITE_STELLAR_NETWORK=testnet
```

### 3. Instalar Dependencias
```bash
npm install
```

### 4. Iniciar Frontend
```bash
npm run dev
```

✅ Frontend debe estar corriendo en: `http://localhost:5173`

---

## 🧪 Flujo de Testing End-to-End

### ✅ Paso 1: Registro de Usuario

#### 1.1 Probar Registro con cURL (Backend Test)
```bash
curl -X POST https://api.blocki.levsek.com.mx/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test-hacka@blocki.com",
    "password": "Secure123!",
    "name": "Test Hacka"
  }'
```

**Respuesta Esperada:**
```json
{
  "user": {
    "id": 9,
    "email": "test-hacka@blocki.com",
    "name": "Test Hacka",
    "stellarPublicKey": "GA...",
    "role": "user",
    "isActive": true,
    "emailVerified": false,
    "kycVerified": false
  },
  "stellarWallet": {
    "publicKey": "GA...",
    "secretKey": "SA..."  // ⚠️ GUARDAR ESTE SECRET KEY
  },
  "access_token": "eyJhbGciOiJIUzI1NiIs..."
}
```

**⚠️ IMPORTANTE:** Guarda el `stellarWallet.secretKey` - lo necesitarás para crear propiedades.

#### 1.2 Probar Registro en Frontend
1. Ir a: `http://localhost:5173/auth`
2. Clic en tab "Sign Up"
3. Llenar formulario:
   - Name: `Test Hacka`
   - Email: `test-hacka@blocki.com`
   - Password: `Secure123!`
4. Clic en "Sign Up"
5. **✅ Verificar:**
   - Registro exitoso
   - Redirección al marketplace
   - Usuario logueado (nombre aparece en navbar)
   - `localStorage` tiene `blocki_token` y `blocki_user`

**Inspeccionar localStorage:**
```javascript
// Abrir DevTools Console (F12)
console.log('Token:', localStorage.getItem('blocki_token'))
console.log('User:', localStorage.getItem('blocki_user'))
```

---

### ✅ Paso 2: Login de Usuario

#### 2.1 Probar Login con cURL
```bash
curl -X POST https://api.blocki.levsek.com.mx/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test-hacka@blocki.com",
    "password": "Secure123!"
  }'
```

**Respuesta Esperada:**
```json
{
  "user": {
    "id": 9,
    "email": "test-hacka@blocki.com",
    "name": "Test Hacka",
    "stellarPublicKey": "GA...",
    "role": "user"
  },
  "access_token": "eyJhbGciOiJIUzI1NiIs..."
}
```

#### 2.2 Probar Login en Frontend
1. Ir a: `http://localhost:5173/auth`
2. Clic en tab "Sign In"
3. Llenar formulario:
   - Email: `test-hacka@blocki.com`
   - Password: `Secure123!`
4. Clic en "Sign In"
5. **✅ Verificar:**
   - Login exitoso
   - Redirección al marketplace
   - Usuario logueado

---

### ✅ Paso 3: Obtener Stellar Secret Key

Si perdiste el `secretKey` del registro, puedes obtenerlo de la base de datos:

```bash
# Esto requiere acceso al backend - pide al admin que te proporcione tu secretKey
# O guárdalo desde el registro (paso 1.1)
```

**⚠️ Para testing, usa el secretKey que obtuviste en el paso 1.1**

---

### ✅ Paso 4: Crear Propiedad

#### 4.1 Probar Creación con cURL
```bash
# REEMPLAZA <TOKEN> con tu token del paso 2.1
# REEMPLAZA <SECRET_KEY> con el secretKey del paso 1.1

curl -X POST https://api.blocki.levsek.com.mx/properties \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN>" \
  -d '{
    "name": "Casa Moderna en Miami Beach",
    "propertyId": "PROP-001-TEST",
    "address": "Miami Beach, FL",
    "valuation": 2500000,
    "totalSupply": 2500,
    "adminSecretKey": "<SECRET_KEY>",
    "metadata": {
      "category": "houses",
      "bedrooms": 4,
      "bathrooms": 3,
      "area": 3200
    }
  }'
```

**Respuesta Esperada:**
```json
{
  "id": 1,
  "name": "Casa Moderna en Miami Beach",
  "propertyId": "PROP-001-TEST",
  "address": "Miami Beach, FL",
  "valuation": 2500000,
  "totalSupply": 2500,
  "availableTokens": 2500,
  "contractId": "CBQHNAXSI55GX2GN...",
  "stellarPublicKey": "GA...",
  "images": [],
  "metadata": {
    "category": "houses",
    "bedrooms": 4,
    "bathrooms": 3,
    "area": 3200
  },
  "createdAt": "2025-11-20T...",
  "updatedAt": "2025-11-20T..."
}
```

**✅ Verificar:**
- Status code: 201 Created
- Propiedad tiene `id`, `contractId`, `stellarPublicKey`
- `availableTokens` = `totalSupply`

#### 4.2 Probar Creación en Frontend

1. Asegúrate de estar logueado
2. Ir a: `http://localhost:5173/seller`
3. Llenar formulario:

   **Información Básica:**
   - Property ID: `PROP-002-TEST`
   - Title: `Penthouse en Buenos Aires`
   - Location: `Buenos Aires, Argentina`
   - Category: `Apartments`
   - Bedrooms: `4`
   - Bathrooms: `3`
   - Area: `2800` sqft

   **Tokenización:**
   - Property Valuation: `950000`
   - Total Tokens: `950`
   - **Stellar Admin Secret Key:** `SA...` (tu secretKey del paso 1.1)

4. (Opcional) Subir imágenes
5. Clic en "Upload Property"

**✅ Verificar:**
- Spinner de carga aparece
- Toast de éxito: "Property created successfully"
- Redirección al seller dashboard
- Propiedad aparece en la lista

---

### ✅ Paso 5: Ver Propiedades en Marketplace

#### 5.1 Probar GET Properties con cURL
```bash
curl https://api.blocki.levsek.com.mx/properties
```

**Respuesta Esperada:**
```json
[
  {
    "id": 1,
    "name": "Casa Moderna en Miami Beach",
    "address": "Miami Beach, FL",
    "valuation": 2500000,
    "totalSupply": 2500,
    "availableTokens": 2500,
    "images": [],
    "metadata": {
      "category": "houses",
      "bedrooms": 4,
      "bathrooms": 3,
      "area": 3200
    }
  },
  {
    "id": 2,
    "name": "Penthouse en Buenos Aires",
    "address": "Buenos Aires, Argentina",
    "valuation": 950000,
    "totalSupply": 950,
    "availableTokens": 950,
    "images": [],
    "metadata": {
      "category": "apartments",
      "bedrooms": 4,
      "bathrooms": 3,
      "area": 2800
    }
  }
]
```

#### 5.2 Verificar en Frontend
1. Ir a: `http://localhost:5173/`
2. **✅ Verificar:**
   - Las propiedades creadas aparecen en el grid
   - PropertyCards muestran la información correcta:
     - Título (name)
     - Ubicación (address)
     - Precio (valuation)
     - Tokens disponibles (availableTokens)
     - Categoría (metadata.category)
     - Área (metadata.area)
   - Status badge: "Available"
   - Price per token se calcula correctamente

#### 5.3 Probar Filtros
1. Clic en "Apartments" en los filtros
2. **✅ Verificar:** Solo el Penthouse aparece
3. Clic en "Houses" en los filtros
4. **✅ Verificar:** Solo la Casa Moderna aparece
5. Clic en "All" en los filtros
6. **✅ Verificar:** Ambas propiedades aparecen

#### 5.4 Probar Búsqueda
1. Escribir "Miami" en el search bar
2. **✅ Verificar:** Solo la Casa Moderna aparece
3. Borrar búsqueda
4. Escribir "Buenos Aires"
5. **✅ Verificar:** Solo el Penthouse aparece

---

### ✅ Paso 6: Ver Detalles de Propiedad

1. Clic en "View Details" de cualquier propiedad
2. **✅ Verificar:**
   - Redirección a página de detalles
   - Toda la información se muestra correctamente
   - Galería de imágenes funciona
   - Botón "Back" regresa al marketplace

---

### ✅ Paso 7: OAuth2 Google Sign In

#### 7.1 Verificar Endpoint OAuth2
```bash
curl -I https://api.blocki.levsek.com.mx/auth/google

# ✅ Debe retornar: HTTP/1.1 302 Found
# ✅ Location: https://accounts.google.com/o/oauth2/v2/auth?...
```

#### 7.2 Probar OAuth2 en Frontend
1. Ir a: `http://localhost:5173/auth`
2. Clic en "Sign in with Google"
3. **✅ Verificar:**
   - Redirección a Google
   - Pantalla de consentimiento de Google
   - Autorizar con tu cuenta Google
   - Redirección de vuelta a `http://localhost:5173/auth/callback?token=...`
   - Usuario logueado automáticamente
   - Redirección al marketplace

---

## 🧹 Limpieza de Datos de Testing

### Eliminar Usuario de Testing
```bash
# Requiere acceso al backend - pide al admin que elimine el usuario test
# O usa el endpoint DELETE /users/:id (si está implementado)
```

### Limpiar localStorage
```javascript
// En DevTools Console (F12)
localStorage.removeItem('blocki_token')
localStorage.removeItem('blocki_user')
```

---

## 🐛 Troubleshooting

### Error: "Token expired" / 401 Unauthorized
**Solución:** Haz login nuevamente para obtener un token válido.

### Error: "adminSecretKey should not be empty"
**Solución:** Asegúrate de incluir el `adminSecretKey` en el formulario. Debe empezar con "S".

### Error: "property category should not exist"
**Solución:** Ya está corregido en `propertyService.js` - category va en `metadata`.

### Error: Propiedades no aparecen en el marketplace
**Solución:**
1. Verifica que el backend tenga propiedades: `curl https://api.blocki.levsek.com.mx/properties`
2. Abre DevTools Console (F12) y busca errores
3. Verifica que `VITE_USE_MOCK_DATA=false` en `.env`
4. Recarga la página

### Error: OAuth2 no funciona
**Solución:** Verifica que la Redirect URI en Google Cloud Console sea: `https://api.blocki.levsek.com.mx/auth/google/callback`

### Error: Imagen no se sube
**Solución:**
1. Verifica que la imagen sea < 5MB
2. Verifica que el formato sea JPG, PNG, o WebP
3. Verifica que el endpoint `/properties/:id/upload-images` esté funcionando

---

## ✅ Checklist de Testing Completo

- [ ] Backend health check funciona
- [ ] Registro de usuario exitoso (cURL)
- [ ] Registro de usuario exitoso (Frontend)
- [ ] Login de usuario exitoso (cURL)
- [ ] Login de usuario exitoso (Frontend)
- [ ] Creación de propiedad exitosa (cURL)
- [ ] Creación de propiedad exitosa (Frontend)
- [ ] Propiedades aparecen en marketplace
- [ ] Filtros por categoría funcionan
- [ ] Búsqueda funciona
- [ ] Vista de detalles funciona
- [ ] OAuth2 Google Sign In funciona
- [ ] PropertyCard muestra datos correctos
- [ ] Price per token se calcula correctamente
- [ ] Status badges funcionan
- [ ] Responsive design funciona (mobile/tablet/desktop)

---

## 📊 Métricas de Éxito

### Performance
- ✅ Marketplace carga en < 2 segundos
- ✅ Creación de propiedad completa en < 5 segundos
- ✅ Login/Register completa en < 3 segundos

### Funcionalidad
- ✅ 0 errores en consola
- ✅ 0 warnings críticos
- ✅ Todos los endpoints funcionan correctamente

### UX
- ✅ Feedback visual en todas las acciones
- ✅ Mensajes de error claros
- ✅ Loading states en todos los formularios

---

## 📝 Notas Importantes

1. **Secret Key Security**: En producción, NUNCA pidas el `adminSecretKey` en el frontend. Debe manejarse exclusivamente en el backend.

2. **Image Upload**: Las imágenes se suben DESPUÉS de crear la propiedad usando el endpoint `/properties/:id/upload-images`.

3. **Token Expiration**: Los JWT tokens expiran después de 24 horas. Los usuarios deben hacer login nuevamente.

4. **Backend Schema**: El backend usa:
   - `name` (no `title`)
   - `address` (no `location`)
   - `valuation` (no `price`)
   - `totalSupply` (no `totalTokens`)
   - `metadata.category` (no root `category`)

5. **TanStack Query**: El frontend usa TanStack Query con cache automático de 5 minutos.

---

**Última actualización:** 2025-11-20
**Estado:** ✅ COMPLETO Y FUNCIONAL
