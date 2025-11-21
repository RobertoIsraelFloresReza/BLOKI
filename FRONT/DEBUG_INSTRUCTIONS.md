# 🐛 Instrucciones de Debug - Propiedades No Se Muestran

## 🔍 Problema Identificado

La propiedad se crea sin error, pero no aparece en el marketplace.

**Causa Sospechada:** El backend retorna `{data: [], status: 200, message: "success"}` pero el hook esperaba un array directo.

---

## ✅ Fixes Aplicados

### 1. Hook useProperties (src/hooks/useProperties.js)
```javascript
// ✅ ANTES: properties: query.data?.data || []
// ✅ AHORA: properties: query.data?.data || query.data || []
```

### 2. Debug Logs Agregados

**En 4 lugares:**

1. **propertyService.js** - Ver request/response del backend
2. **useProperties.js** - Ver datos que llegan de TanStack Query
3. **PropertyUploadForm.jsx** - Ver payload y respuesta de creación
4. **Marketplace.jsx** - Ver qué propiedades recibe el componente

---

## 🧪 Cómo Probar y Debug

### Paso 1: Limpiar Cache
```bash
# Eliminar node_modules/.vite para limpiar cache
rm -rf node_modules/.vite

# Reiniciar servidor
npm run dev
```

### Paso 2: Abrir DevTools
1. Ir a: `http://localhost:5173`
2. Presionar `F12` para abrir DevTools
3. Ir a la tab **Console**
4. Limpiar console: `Ctrl+L` o clic en 🚫

### Paso 3: Crear Propiedad

1. **Login/Register** primero
2. Ir a: `http://localhost:5173/seller`
3. Llenar el formulario:

   ```
   Property ID: TEST-001
   Title: Casa de Prueba Debug
   Location: Miami, FL
   Category: Houses
   Bedrooms: 3
   Bathrooms: 2
   Area: 2000
   Property Valuation: 500000
   Total Tokens: 500
   Admin Secret Key: SA... (tu stellar secret key)
   ```

4. Clic en "Upload Property"

### Paso 4: Revisar Console Logs

Deberías ver en la consola:

```
🔍 DEBUG PropertyUploadForm - Payload: {
  name: "Casa de Prueba Debug",
  propertyId: "TEST-001",
  address: "Miami, FL",
  valuation: 500000,
  totalSupply: 500,
  adminSecretKey: "SA...",
  category: "houses",
  metadata: {
    bedrooms: 3,
    bathrooms: 2,
    area: 2000
  }
}

🔍 DEBUG propertyService - Create payload: {
  name: "Casa de Prueba Debug",
  propertyId: "TEST-001",
  address: "Miami, FL",
  valuation: 500000,
  totalSupply: 500,
  adminSecretKey: "SA...",
  metadata: {
    bedrooms: 3,
    bathrooms: 2,
    area: 2000,
    category: "houses"  // ✅ Category movido a metadata
  }
  // ✅ category NO existe en root
}

🔍 DEBUG propertyService - Create response: {
  id: 1,
  name: "Casa de Prueba Debug",
  propertyId: "TEST-001",
  address: "Miami, FL",
  valuation: 500000,
  totalSupply: 500,
  availableTokens: 500,
  contractId: "CBQHNAXSI55GX2GN...",
  stellarPublicKey: "GA...",
  images: [],
  metadata: {
    category: "houses",
    bedrooms: 3,
    bathrooms: 2,
    area: 2000
  },
  createdAt: "2025-11-21T...",
  updatedAt: "2025-11-21T..."
}

🔍 DEBUG PropertyUploadForm - Response: {...}
```

### Paso 5: Ir al Marketplace

1. Después de crear, deberías ser redirigido automáticamente
2. O ir manualmente a: `http://localhost:5173/`
3. Revisar console nuevamente

Deberías ver:

```
🔍 DEBUG useProperties - Raw result: {
  data: [
    {
      id: 1,
      name: "Casa de Prueba Debug",
      address: "Miami, FL",
      valuation: 500000,
      totalSupply: 500,
      availableTokens: 500,
      images: [],
      metadata: {
        category: "houses",
        bedrooms: 3,
        bathrooms: 2,
        area: 2000
      }
    }
  ],
  status: 200,
  message: "success"
}

🔍 DEBUG useProperties - result.data: [...]

🔍 DEBUG Marketplace - Properties: [...]
🔍 DEBUG Marketplace - isLoading: false
🔍 DEBUG Marketplace - error: null
🔍 DEBUG Marketplace - allProperties: [...]
```

---

## 🔍 Qué Buscar en los Logs

### ✅ Señales de Éxito

1. **Payload tiene category en metadata** (no en root)
2. **Response tiene id y contractId**
3. **useProperties retorna array con propiedades**
4. **Marketplace recibe array no vacío**
5. **PropertyCard se renderiza en el grid**

### ❌ Señales de Error

1. **"category should not exist"** → category no se movió a metadata
2. **"adminSecretKey should not be empty"** → falta secret key
3. **useProperties retorna array vacío `[]`** → problema con el hook
4. **Marketplace properties = `[]`** → problema con normalización de datos
5. **Error 401** → token expirado, hacer login nuevamente

---

## 🛠️ Troubleshooting

### Error: Propiedad se crea pero no aparece

**Posible Causa 1: Cache de TanStack Query**

```javascript
// En DevTools Console, ejecutar:
window.location.reload()
```

**Posible Causa 2: Backend retorna estructura diferente**

Verificar con cURL:
```bash
curl https://api.blocki.levsek.com.mx/properties
```

Debería retornar:
```json
{
  "data": [
    {
      "id": 1,
      "name": "Casa de Prueba Debug",
      ...
    }
  ],
  "status": 200,
  "message": "success"
}
```

Si retorna solo `[]` (array directo), entonces necesitamos ajustar el hook.

**Posible Causa 3: La propiedad se creó con otro usuario**

El backend podría filtrar propiedades por usuario. Verificar en console:
- El userId en el token
- Las propiedades tienen ownerId

### Error: "Network Error" o "Failed to fetch"

```bash
# Verificar que el backend esté up
curl https://api.blocki.levsek.com.mx/health

# Debería retornar: {"status":"ok"}
```

### Error: Token expirado

```javascript
// En DevTools Console:
localStorage.removeItem('blocki_token')
localStorage.removeItem('blocki_user')

// Luego hacer login nuevamente
```

---

## 📸 Compartir Resultados

Si el problema persiste, por favor comparte:

1. **Screenshot de la Console** con todos los logs 🔍
2. **Screenshot del Network tab** (F12 → Network)
   - Filtrar por: `/properties`
   - Ver Request y Response
3. **cURL test:**
   ```bash
   curl https://api.blocki.levsek.com.mx/properties
   ```

---

## 🧹 Remover Debug Logs (Después de Arreglar)

Una vez que funcione, eliminar los console.log:

```bash
# Buscar todos los debug logs
grep -r "🔍 DEBUG" src/
```

Eliminar estas líneas:
- `src/hooks/useProperties.js:24-25`
- `src/services/propertyService.js:75,77`
- `src/components/seller/PropertyUploadForm.jsx:165,167`
- `src/pages/marketplace/Marketplace.jsx:248-253`

---

## ✅ Checklist de Validación

- [ ] Console muestra "DEBUG PropertyUploadForm - Payload"
- [ ] Console muestra "DEBUG propertyService - Create response"
- [ ] Response tiene `id` y `contractId`
- [ ] Console muestra "DEBUG useProperties - Raw result"
- [ ] result.data es un array con al menos 1 propiedad
- [ ] Console muestra "DEBUG Marketplace - Properties"
- [ ] allProperties es un array con al menos 1 propiedad
- [ ] PropertyCard se renderiza en el grid
- [ ] Puedo ver la propiedad en el marketplace

---

**Última actualización:** 2025-11-21
**Estado:** 🐛 DEBUG MODE ACTIVADO
