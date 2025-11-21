# 🚀 Configuración de Dockploy - Variables de Entorno

## 🐛 Problemas Identificados

### 1. Network Error en Deploy
```
🔍 DEBUG Marketplace - error: {message: 'Network Error', name: 'AxiosError', code: 'ERR_NETWORK'}
```

**Causa:** El frontend desplegado no tiene configuradas las variables de entorno.

El archivo `.env` **NO se sube a git** (está en `.gitignore`), por lo tanto **NO existe en el deploy**.

### 2. OAuth2 Redirect a Producción
Cuando haces login con Google desde `localhost`, te redirige a `https://blocki.levsek.com.mx/auth/callback` en lugar de `http://localhost:5173/auth/callback`.

**Causa:** El backend tiene configurado el redirect URI a producción.

---

## ✅ Solución 1: Configurar Variables de Entorno en Dockploy

### Paso 1: Ir a Configuración del Proyecto en Dockploy

1. Abre tu proyecto en Dockploy
2. Ve a **Settings** o **Configuration**
3. Busca la sección **Environment Variables**

### Paso 2: Agregar Variables de Entorno

Agrega estas variables (copia y pega):

```env
# Backend API URL
VITE_API_URL=https://api.blocki.levsek.com.mx

# API Timeout
VITE_API_TIMEOUT=30000

# Stellar Network
VITE_STELLAR_NETWORK=testnet
VITE_HORIZON_URL=https://horizon-testnet.stellar.org
VITE_SOROBAN_RPC_URL=https://soroban-testnet.stellar.org
VITE_NETWORK_PASSPHRASE=Test SDF Network ; September 2015

# Security
VITE_ENCRYPTION_KEY=blocki-stellar-2025-hackathon-key

# Feature Flags
VITE_USE_MOCK_DATA=false
VITE_ENABLE_SEP24=true
VITE_ENABLE_KYC=true
VITE_ENABLE_FIAT_CONVERSION=true

# Freighter Wallet
VITE_FREIGHTER_ENABLED=true
```

### Paso 3: Redeploy

Después de agregar las variables:
1. Guarda los cambios
2. Haz **Redeploy** del proyecto
3. Espera a que termine el build

### Paso 4: Verificar

Una vez deployado:
1. Abre `https://blocki.levsek.com.mx` (o tu URL de producción)
2. Abre DevTools (F12) → Console
3. Ejecuta:
   ```javascript
   console.log(import.meta.env.VITE_API_URL)
   ```
4. Debería mostrar: `https://api.blocki.levsek.com.mx`

Si muestra `undefined`, las variables no se configuraron correctamente.

---

## ✅ Solución 2: Configurar OAuth2 Redirect en Backend

El backend necesita saber **a dónde redirigir** después de OAuth2.

### Backend Environment Variables

El ingeniero de backend necesita configurar en el backend:

```env
# Backend .env
FRONTEND_URL_DEV=http://localhost:5173
FRONTEND_URL_PROD=https://blocki.levsek.com.mx

# OAuth2 Redirect después de autenticar con Google
OAUTH2_REDIRECT_URL=${FRONTEND_URL_PROD}/auth/callback
```

### Backend Code (Ejemplo)

El backend debería tener algo así:

```javascript
// backend/src/auth/auth.controller.ts
@Get('google/callback')
async googleCallback(@Req() req, @Res() res) {
  const token = req.user.token

  // Determinar URL de frontend según entorno
  const frontendUrl = process.env.NODE_ENV === 'production'
    ? process.env.FRONTEND_URL_PROD
    : process.env.FRONTEND_URL_DEV

  // Redirigir con token
  return res.redirect(`${frontendUrl}/auth/callback?token=${token}`)
}
```

**Nota:** Esto lo debe configurar el ingeniero de backend.

---

## 🔧 Solución 3: Configuración Dual (Dev + Prod)

Si quieres que funcione en **ambos entornos** (local y producción):

### Opción A: Backend Multi-Environment

El backend puede detectar desde dónde viene la petición:

```javascript
// backend
@Get('google/callback')
async googleCallback(@Req() req, @Res() res) {
  const token = req.user.token

  // Detectar origen de la petición
  const referer = req.headers.referer || req.headers.origin
  const isLocalhost = referer?.includes('localhost')

  const frontendUrl = isLocalhost
    ? 'http://localhost:5173'
    : 'https://blocki.levsek.com.mx'

  return res.redirect(`${frontendUrl}/auth/callback?token=${token}`)
}
```

### Opción B: State Parameter en OAuth2

Pasar la URL de callback como `state` parameter:

```javascript
// frontend/authService.js
googleSignIn() {
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000'
  const callbackUrl = window.location.origin + '/auth/callback'

  // Pasar callback URL como state
  window.location.href = `${apiUrl}/auth/google?callback=${encodeURIComponent(callbackUrl)}`
}
```

```javascript
// backend
@Get('google/callback')
async googleCallback(@Req() req, @Res() res, @Query('callback') callbackUrl) {
  const token = req.user.token

  // Usar callback URL del query param
  const redirectUrl = callbackUrl || process.env.FRONTEND_URL_PROD

  return res.redirect(`${redirectUrl}?token=${token}`)
}
```

---

## 🧪 Testing de Variables de Entorno

### Test 1: Verificar que Build usa las variables

En Dockploy, después del build, deberías ver en los logs:

```bash
npm run build
vite v7.2.2 building for production...

# Las variables se "baken" en el build
transforming (x) with env variables...
```

### Test 2: Verificar en Runtime

Abre el frontend deployado y ejecuta en consola:

```javascript
// Deberían retornar valores, NO undefined
console.log(import.meta.env.VITE_API_URL)
console.log(import.meta.env.VITE_STELLAR_NETWORK)
console.log(import.meta.env.VITE_USE_MOCK_DATA)
```

### Test 3: Verificar Network Calls

1. Abre DevTools → **Network** tab
2. Intenta cargar el marketplace
3. Deberías ver:
   ```
   GET https://api.blocki.levsek.com.mx/properties
   Status: 200 OK
   ```

Si ves:
```
GET http://localhost:3000/properties
Status: Failed (ERR_NETWORK)
```

Entonces las variables NO están configuradas.

---

## 📋 Checklist de Deploy

- [ ] Variables de entorno agregadas en Dockploy
- [ ] Redeploy ejecutado
- [ ] Build exitoso (sin errores)
- [ ] `import.meta.env.VITE_API_URL` retorna URL correcta
- [ ] Network calls van a `https://api.blocki.levsek.com.mx`
- [ ] No hay "Network Error" en consola
- [ ] Marketplace carga propiedades
- [ ] OAuth2 redirige correctamente (backend config)

---

## 🐛 Troubleshooting

### Error: "Network Error" persiste

**Causa:** Variables de entorno no configuradas.

**Solución:**
1. Verifica que agregaste las variables en Dockploy
2. Haz redeploy
3. Limpia cache del navegador
4. Verifica en consola: `import.meta.env.VITE_API_URL`

### Error: OAuth2 redirige a producción desde localhost

**Causa:** Backend está hardcodeado con URL de producción.

**Solución:** Pide al ingeniero de backend que:
1. Use variable de entorno para el redirect URL
2. O detecte el origen de la petición
3. O use state parameter con callback URL

### Error: Variables están undefined en runtime

**Causa:** Las variables deben empezar con `VITE_`

**Solución:** Todas las variables de entorno en Vite **DEBEN** empezar con `VITE_`:

```env
✅ VITE_API_URL=...
❌ API_URL=...
❌ REACT_APP_API_URL=...
```

### Error: Build falla con EBADENGINE

**Causa:** Node.js version en Dockploy es v18, pero Vite recomienda v20+

**Solución:**
1. Actualiza Node.js version en Dockploy a v20 o v22
2. O ignora los warnings (el build funciona igual)

---

## 📸 Screenshots de Configuración (Ejemplo)

### Dockploy Environment Variables

```
┌─────────────────────────────────────────────────┐
│ Environment Variables                            │
├─────────────────────────────────────────────────┤
│ Key                    │ Value                  │
├─────────────────────────────────────────────────┤
│ VITE_API_URL           │ https://api.blocki...  │
│ VITE_API_TIMEOUT       │ 30000                  │
│ VITE_STELLAR_NETWORK   │ testnet                │
│ VITE_USE_MOCK_DATA     │ false                  │
└─────────────────────────────────────────────────┘
```

---

## 🔐 Seguridad

**IMPORTANTE:** Nunca pongas en variables de entorno:
- ❌ Stellar Secret Keys
- ❌ Private Keys
- ❌ Passwords
- ❌ API Secrets del backend

Solo pon:
- ✅ URLs públicas (API, Horizon, etc.)
- ✅ Network names (testnet, mainnet)
- ✅ Feature flags (true/false)
- ✅ Public keys (Stellar public keys)

---

## ✅ Resumen

**Problema:** Network Error porque `.env` no se sube a git.

**Solución:** Configurar variables de entorno en Dockploy manualmente.

**Pasos:**
1. Ir a Dockploy Settings → Environment Variables
2. Agregar todas las variables que empiecen con `VITE_`
3. Redeploy
4. Verificar que funcione

**OAuth2 Redirect:** Pide al backend que use variable de entorno para la redirect URL.

---

**Última actualización:** 2025-11-21
**Estado:** 📋 GUÍA DE CONFIGURACIÓN
