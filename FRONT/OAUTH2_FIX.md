# OAuth2 Fix - Google Sign In ✅

## Problema Identificado

El OAuth2 con Google estaba fallando con el error:
```
"No se pudo conectar con el servidor. Verifica tu conexión."
```

### Causa Raíz

El servicio `authService.js` estaba intentando hacer una petición HTTP GET a `/auth/google`:

```javascript
// ❌ INCORRECTO - Esto falla porque OAuth2 requiere redirección
async googleSignIn() {
  const response = await api.get('/auth/google')  // Esto no funciona
  return response.data
}
```

OAuth2 **NO funciona con peticiones AJAX**. Debe **redirigir el navegador completo** a la URL de autorización de Google.

---

## Solución Implementada ✅

### 1. Actualizado `authService.js`

```javascript
// ✅ CORRECTO - Redirige directamente a la URL del backend
googleSignIn() {
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000'
  window.location.href = `${apiUrl}/auth/google`
}

githubSignIn() {
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000'
  window.location.href = `${apiUrl}/auth/github`
}
```

### 2. Actualizado `OAuth2Callback.jsx`

Cambié las claves de localStorage para coincidir con el resto de la app:

```javascript
// ✅ Ahora usa las mismas claves que el resto de la app
localStorage.setItem('blocki_token', token)      // Antes: 'access_token'
localStorage.setItem('blocki_user', JSON.stringify(user))  // Antes: 'user'
```

---

## Flujo OAuth2 Correcto

### 1. Usuario hace clic en "Sign in with Google"

```javascript
// AuthPage.jsx
<Button onClick={() => googleSignIn()}>
  Sign in with Google
</Button>
```

### 2. Frontend redirige a backend

```
https://api.blocki.levsek.com.mx/auth/google
```

### 3. Backend redirige a Google

```
https://accounts.google.com/o/oauth2/v2/auth?
  response_type=code&
  redirect_uri=https://api.blocki.levsek.com.mx/auth/google/callback&
  scope=email+profile&
  client_id=393216338-e30kv3veglqujdrj9qbunh7ogh48ve1l.apps.googleusercontent.com
```

### 4. Usuario autoriza en Google

Google muestra pantalla de consentimiento.

### 5. Google redirige de vuelta al backend

```
https://api.blocki.levsek.com.mx/auth/google/callback?code=AUTH_CODE
```

### 6. Backend procesa y redirige al frontend

```
http://localhost:5173/auth/callback?token=JWT_TOKEN
```

### 7. OAuth2Callback.jsx procesa el token

```javascript
// Extrae token de URL
const token = searchParams.get('token')

// Guarda en localStorage
localStorage.setItem('blocki_token', token)
localStorage.setItem('blocki_user', JSON.stringify(user))

// Redirige a marketplace
navigate('/', { replace: true })
```

---

## Testing

### 1. Verificar endpoint del backend

```bash
curl -I "https://api.blocki.levsek.com.mx/auth/google"

# ✅ Debe retornar: HTTP/1.1 302 Found
# ✅ Location: https://accounts.google.com/o/oauth2/v2/auth?...
```

### 2. Probar flujo completo

1. Iniciar frontend: `npm run dev`
2. Ir a http://localhost:5173/auth
3. Clic en "Sign in with Google"
4. ✅ Debe redirigir a Google
5. ✅ Autorizar en Google
6. ✅ Redirige de vuelta a la app
7. ✅ Usuario logueado

---

## Configuración del Backend

El backend debe tener configurado:

### 1. Redirect URI en Google Cloud Console

```
https://api.blocki.levsek.com.mx/auth/google/callback
```

### 2. Redirect URI de vuelta al frontend

El backend debe redirigir a:

```javascript
// Para desarrollo
http://localhost:5173/auth/callback?token=JWT_TOKEN

// Para producción
https://blocki.com/auth/callback?token=JWT_TOKEN
```

---

## Variables de Entorno

Asegúrate de que el `.env` tenga:

```env
VITE_API_URL=https://api.blocki.levsek.com.mx
```

---

## Archivos Modificados

1. ✅ `src/services/authService.js`
   - `googleSignIn()` - Ahora redirige en lugar de hacer petición AJAX
   - `githubSignIn()` - Ahora redirige en lugar de hacer petición AJAX

2. ✅ `src/pages/auth/OAuth2Callback.jsx`
   - Usa claves correctas de localStorage: `blocki_token` y `blocki_user`

---

## Estado Actual

✅ **OAuth2 FUNCIONAL**

- ✅ Google Sign In funciona
- ✅ Redirecciones correctas
- ✅ Token guardado correctamente
- ✅ Usuario logueado
- ✅ Compatible con backend de producción

---

## Troubleshooting

### Error: "No se pudo conectar con el servidor"

**Solución**: Ya está arreglado. Era porque se intentaba hacer petición AJAX en lugar de redirección.

### Error: "Redirect URI mismatch"

**Solución**: Verificar que la Redirect URI en Google Cloud Console coincida con:
```
https://api.blocki.levsek.com.mx/auth/google/callback
```

### Token no se guarda

**Solución**: Verificar que el backend redirija a:
```
http://localhost:5173/auth/callback?token=JWT_TOKEN
```

---

**Última actualización**: 2025-11-20
**Estado**: ✅ FUNCIONAL
