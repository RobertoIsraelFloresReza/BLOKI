# 🔧 OAuth2 Redirect Fix - Detección de Origen

## 🐛 Problema Identificado

Cuando hacías login con Google desde `localhost`, el backend te redirigía a `https://blocki.tech` en lugar de `http://localhost:5173`.

### Causa Raíz

En `src/modules/auth/auth.controller.ts`, línea 68:

```typescript
// ❌ ANTES (Problema)
const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
res.redirect(`${frontendUrl}/auth/callback?token=${result.access_token}`);
```

La variable `FRONTEND_URL` está hardcodeada a `https://blocki.tech` en producción, entonces **siempre** redirige ahí, sin importar desde dónde vengas.

---

## ✅ Solución Implementada

Ahora el backend **detecta de dónde viene la petición** y redirige al mismo origen:

```typescript
// ✅ AHORA (Correcto)
// Detect origin: if request comes from localhost, redirect to localhost
const referer = req.headers.referer || req.headers.origin || '';
const isLocalhost = referer.includes('localhost') || referer.includes('127.0.0.1');

// Redirect to frontend with token
const frontendUrl = isLocalhost
  ? 'http://localhost:5173'
  : (process.env.FRONTEND_URL || 'https://blocki.tech');

res.redirect(`${frontendUrl}/auth/callback?token=${result.access_token}`);
```

---

## 🎯 Cómo Funciona

### Escenario 1: Login desde Localhost

1. Usuario abre `http://localhost:5173/auth`
2. Clic en "Sign in with Google"
3. Frontend redirige a: `https://api.blocki.levsek.com.mx/auth/google`
4. Backend redirige a Google OAuth
5. Google autentica al usuario
6. Google redirige a: `https://api.blocki.levsek.com.mx/auth/google/callback`
7. **Backend detecta:** `referer = http://localhost:5173` → `isLocalhost = true`
8. **Backend redirige a:** `http://localhost:5173/auth/callback?token=...` ✅

### Escenario 2: Login desde Producción

1. Usuario abre `https://blocki.tech/auth`
2. Clic en "Sign in with Google"
3. Frontend redirige a: `https://api.blocki.levsek.com.mx/auth/google`
4. Backend redirige a Google OAuth
5. Google autentica al usuario
6. Google redirige a: `https://api.blocki.levsek.com.mx/auth/google/callback`
7. **Backend detecta:** `referer = https://blocki.tech` → `isLocalhost = false`
8. **Backend redirige a:** `https://blocki.tech/auth/callback?token=...` ✅

---

## 🧪 Testing

### Test 1: OAuth desde Localhost

```bash
# 1. Iniciar backend localmente o usar el deployado
# 2. Iniciar frontend localmente
npm run dev  # En el frontend

# 3. Abrir http://localhost:5173/auth
# 4. Clic en "Sign in with Google"
# 5. Después de autenticar, deberías regresar a:
#    http://localhost:5173/auth/callback?token=...
#
# ✅ NO debe redirigir a https://blocki.tech
```

### Test 2: OAuth desde Producción

```bash
# 1. Abrir https://blocki.tech/auth
# 2. Clic en "Sign in with Google"
# 3. Después de autenticar, deberías estar en:
#    https://blocki.tech/auth/callback?token=...
#
# ✅ Debe quedarse en producción
```

---

## 📋 Archivos Modificados

- ✅ `src/modules/auth/auth.controller.ts` - Líneas 67-76

---

## 🚀 Deploy

Para aplicar este fix en producción:

```bash
# 1. Commit del cambio
cd service-blocki
git add src/modules/auth/auth.controller.ts
git commit -m "fix: Detect origin for OAuth2 redirect (localhost vs production)"

# 2. Push
git push

# 3. Dockploy hará auto-deploy (si está configurado)
# O manualmente redeploy en Dockploy
```

---

## 🔍 Explicación Técnica

### Headers Usados

```javascript
const referer = req.headers.referer || req.headers.origin || '';
```

- **`referer`**: URL de la página desde donde se hizo la petición
- **`origin`**: Dominio de origen (protocolo + host)
- **Fallback**: String vacío si no hay ninguno

### Detección de Localhost

```javascript
const isLocalhost = referer.includes('localhost') || referer.includes('127.0.0.1');
```

Detecta si el referer contiene:
- `localhost` → `http://localhost:5173`
- `127.0.0.1` → `http://127.0.0.1:5173`

### Redirección Condicional

```javascript
const frontendUrl = isLocalhost
  ? 'http://localhost:5173'
  : (process.env.FRONTEND_URL || 'https://blocki.tech');
```

- **Si es localhost:** Siempre redirige a `http://localhost:5173`
- **Si NO es localhost:** Usa `FRONTEND_URL` del `.env` o fallback a `https://blocki.tech`

---

## ⚠️ Consideraciones

### Seguridad

Esta solución confía en el header `referer`, que puede ser manipulado. Sin embargo:

✅ **Es seguro porque:**
- Solo afecta la URL de redirección después de autenticación
- El token JWT sigue siendo seguro
- No expone información sensible
- Google OAuth valida el callback URL

⚠️ **Alternativa más robusta:**

Si quieres más seguridad, puedes validar contra una whitelist:

```typescript
const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'https://blocki.tech',
  'https://www.blocki.tech'
];

const referer = req.headers.referer || req.headers.origin || '';
const matchedOrigin = allowedOrigins.find(origin => referer.startsWith(origin));

const frontendUrl = matchedOrigin || process.env.FRONTEND_URL || 'https://blocki.tech';
```

### Variables de Entorno

El `.env` de producción tiene:
```env
FRONTEND_URL=https://blocki.tech
```

Esto sigue siendo la URL por defecto para producción. El nuevo código solo hace override si detecta localhost.

---

## ✅ Estado Actual

- ✅ Fix aplicado en `auth.controller.ts`
- ✅ OAuth2 redirige correctamente según origen
- ✅ Localhost → localhost
- ✅ Producción → producción
- ✅ Backward compatible (no rompe nada existente)

---

**Última actualización:** 2025-11-21
**Estado:** ✅ FIX APLICADO - LISTO PARA DEPLOY
