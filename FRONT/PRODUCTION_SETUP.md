# Configuración para Backend en Producción 🚀

Este documento describe cómo configurar el frontend para conectarse al backend desplegado en **https://api.blocki.levsek.com.mx/**

---

## ✅ Backend Ya Configurado

El archivo `.env` ya está configurado para usar el backend de producción:

```env
VITE_API_URL=https://api.blocki.levsek.com.mx
VITE_USE_MOCK_DATA=false
```

---

## 🧪 Tests Exitosos con el Backend

### ✅ 1. Health Check
```bash
curl https://api.blocki.levsek.com.mx/
# ✅ Respuesta: 200 OK
```

### ✅ 2. Registro de Usuario
```bash
curl -X POST "https://api.blocki.levsek.com.mx/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@blocki.com",
    "password": "Test123456",
    "name": "Test User"
  }'

# ✅ Respuesta:
# - Usuario creado
# - JWT token generado
# - Stellar wallet auto-generado
# - Secret key encriptado
```

### ✅ 3. Login
```bash
curl -X POST "https://api.blocki.levsek.com.mx/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@blocki.com",
    "password": "Test123456"
  }'

# ✅ Respuesta: JWT token válido
```

### ✅ 4. Listar Propiedades
```bash
curl -X GET "https://api.blocki.levsek.com.mx/properties" \
  -H "Authorization: Bearer YOUR_TOKEN"

# ✅ Respuesta: Array de propiedades (vacío si no hay ninguna)
```

---

## 📝 Schema del Backend (Diferencias Importantes)

### Crear Propiedad

El backend tiene un schema específico que **difiere de la documentación inicial**:

```json
{
  "name": "Casa Moderna",
  "propertyId": "PROP-001",
  "address": "Miami Beach",
  "description": "Descripción de la propiedad",
  "valuation": 2500000,
  "totalSupply": 2500,
  "legalOwner": "Owner Name",
  "adminSecretKey": "STELLAR_SECRET_KEY_HERE",  // ⚠️ REQUERIDO
  "metadata": {
    "bedrooms": 4,
    "bathrooms": 3,
    "area": 3200,
    "category": "houses"  // ⚠️ Va en metadata, no en root
  }
}
```

**Importantes:**
1. ⚠️ **`adminSecretKey` es OBLIGATORIO** - Es el Stellar secret key del usuario (se obtiene del wallet en registro)
2. ⚠️ **`category` va en metadata** - NO como campo raíz
3. ✅ El backend encripta y guarda el `adminSecretKey` de forma segura

---

## 🔐 Manejo del Secret Key

### En Registro
Cuando un usuario se registra, el backend retorna:

```json
{
  "user": {...},
  "access_token": "...",
  "stellarWallet": {
    "publicKey": "GABC...",
    "encryptedSecretKey": "encrypted_data_here"
  }
}
```

### ⚠️ IMPORTANTE: Almacenamiento Temporal del Secret Key

El secret key encriptado debe:
1. **Guardarse en localStorage temporalmente** (solo para testing)
2. **Para producción**: Implementar almacenamiento seguro o pedirlo al usuario cada vez

### Flujo Recomendado

#### Opción 1: Guardar Encriptado (Desarrollo)
```javascript
// Después del registro
localStorage.setItem('blocki_encrypted_secret', wallet.encryptedSecretKey)

// Al crear propiedad
const encryptedSecret = localStorage.getItem('blocki_encrypted_secret')
// Enviar encryptedSecret al backend que lo desencripta
```

#### Opción 2: Pedir al Usuario (Producción)
```javascript
// Al crear propiedad
const secretKey = prompt('Ingresa tu Stellar Secret Key para firmar la transacción')
// Enviar secretKey al backend
```

#### Opción 3: Usar Freighter Wallet (Ideal)
```javascript
// Usar Freighter para firmar transacciones
// El secret key nunca sale de la wallet
```

---

## 🚀 Iniciar Desarrollo

```bash
# 1. El .env ya está configurado
cat .env
# Debería mostrar: VITE_API_URL=https://api.blocki.levsek.com.mx

# 2. Instalar dependencias (si no lo has hecho)
npm install

# 3. Iniciar servidor de desarrollo
npm run dev

# 4. Abrir navegador
# http://localhost:5173
```

---

## 🧪 Testing Manual en la Aplicación

### 1. Registro de Usuario
1. Ir a la página de registro
2. Llenar formulario
3. El backend auto-genera wallet Stellar
4. **IMPORTANTE**: Guardar el secret key mostrado

### 2. Crear Propiedad
1. Ir al dashboard de vendedor
2. Llenar formulario de propiedad
3. **Cuando se solicite, ingresar el secret key de Stellar**
4. La propiedad se creará y el contrato se desplegará

### 3. Ver Propiedades
1. Ir al marketplace
2. Deberías ver las propiedades creadas
3. Puedes filtrar por categoría, precio, etc.

---

## 🐛 Troubleshooting

### Error: "adminSecretKey should not be empty"
**Solución**: Asegúrate de enviar el secret key de Stellar del usuario al crear propiedades.

### Error: "property category should not exist"
**Solución**: No envíes `category` como campo raíz, envíalo dentro de `metadata`.

### Error: CORS
**Solución**: El backend ya tiene CORS configurado para aceptar requests desde cualquier origen.

### Error: 401 Unauthorized
**Solución**: El token JWT expiró. Vuelve a hacer login.

---

## 📊 Endpoints Disponibles

| Endpoint | Método | Autenticación | Estado |
|----------|--------|---------------|--------|
| `/` | GET | No | ✅ Funciona |
| `/auth/register` | POST | No | ✅ Funciona |
| `/auth/login` | POST | No | ✅ Funciona |
| `/auth/validate` | GET | Sí | ⏳ No probado |
| `/properties` | GET | Sí | ✅ Funciona |
| `/properties` | POST | Sí | ⚠️ Requiere adminSecretKey |
| `/properties/:id` | GET | Sí | ⏳ No probado |
| `/properties/:id/images` | POST | Sí | ⏳ No probado |

---

## 🔄 Próximos Pasos

1. ✅ **Frontend ya configurado** para usar backend de producción
2. ⏳ **Implementar flujo de secret key** en PropertyUploadForm
3. ⏳ **Agregar campo de secret key** en el formulario (temporal o modal)
4. ⏳ **Probar creación de propiedades** end-to-end
5. ⏳ **Probar upload de imágenes**

---

## 💡 Notas de Seguridad

### ⚠️ NUNCA en Producción
- NO guardar secret keys en localStorage sin encriptar
- NO enviar secret keys por URLs
- NO logear secret keys en consola

### ✅ Recomendado para Producción
- Usar Freighter Wallet para firmar transacciones
- Pedir confirmación al usuario antes de cada transacción
- Implementar 2FA para operaciones críticas
- Usar HSM (Hardware Security Module) para claves

---

**Última actualización**: 2025-11-20
**Backend URL**: https://api.blocki.levsek.com.mx/
**Estado**: ✅ Backend funcional, frontend configurado
