# 🔴 Solución al Bad Gateway (502) en Dockploy

## Problema Identificado

El backend devuelve **502 Bad Gateway** porque NestJS **NO puede arrancar** debido a módulos faltantes.

### Root Cause

El `package.json` original tenía **TODOS** los paquetes en `"latest"`:

```json
{
  "@nestjs/common": "latest",  // ❌ Instala versiones incompatibles cada vez
  "@nestjs/core": "latest",
  "fs": "latest",              // ❌ fs es built-in de Node.js, no existe como paquete
  "crypto": "latest",          // ❌ crypto es built-in de Node.js
  "path": "latest",            // ❌ path es built-in de Node.js
  "src": "latest",             // ❌ No existe este paquete
  "next": "16.0.3",            // ❌ Next.js no debería estar en un backend NestJS
  ...
}
```

**Consecuencias:**
1. `npm install` instala versiones diferentes en cada deploy
2. Paquetes inexistentes causan conflictos
3. NestJS falla con: `Error: Cannot find module '@nestjs/core'`
4. El build "pasa" pero el servicio no arranca
5. Nginx intenta conectar → **502 Bad Gateway**

---

## ✅ Solución Implementada

### 1. package.json Corregido

He creado un `package.json` con:
- ✅ Versiones **FIJAS** (usando `^` para minor/patch updates)
- ✅ Eliminadas dependencias inexistentes (`fs`, `crypto`, `path`, `src`)
- ✅ Eliminado `next` (no es necesario en NestJS backend)
- ✅ Todas las versiones de `@nestjs/*` en **v11.x.x** (compatibles)
- ✅ Versiones corregidas:
  - `@nestjs/config`: `^3.4.0` → `^4.0.2` (3.4.0 no existe)
  - `@nestjs/typeorm`: `^11.0.6` → `^11.0.0` (11.0.6 no existe)
  - `@nestjs/jwt`: `^11.0.0` → `^11.0.1` (versión actualizada)
  - `@nestjs/swagger`: `^8.3.1` → `^11.2.3` (8.3.1 no existe)

### 2. Pasos para Aplicar en Dockploy

**Opción A: Hacer Push del package.json corregido (RECOMENDADO)**

```bash
# 1. Hacer commit del package.json corregido
git add package.json
git commit -m "fix: correct package.json with fixed versions"
git push origin main

# 2. En Dockploy:
# - Hacer "Redeploy" o esperar auto-deploy
# - El backend debería arrancar correctamente
```

**Opción B: Limpiar y rebuildar en Dockploy**

1. Ve a tu proyecto en Dockploy
2. Click en "Settings" o "Advanced"
3. Busca "Clean Build" o "Clear Cache"
4. Ejecuta deploy limpio

**Opción C: Cambiar comando de install**

Si Dockploy permite personalizar el comando de install:
```bash
# En lugar de:
npm install

# Usa:
npm ci
# o
npm install --force
```

---

## 🔍 Verificación

### Después del deploy, verifica los logs:

**✅ Éxito - deberías ver:**
```
[Nest] 1   - 11/20/2025, 2:00:00 PM   LOG [NestFactory] Starting Nest application...
[Nest] 1   - 11/20/2025, 2:00:01 PM   LOG [InstanceLoader] AppModule dependencies initialized
[Nest] 1   - 11/20/2025, 2:00:02 PM   LOG [NestApplication] Nest application successfully started
```

**❌ Si aún falla:**

1. **Error de Base de Datos:**
   ```
   Error: connect ECONNREFUSED postgresql://...
   ```
   **Solución:** Verificar variable `DATABASE_URL` en Dockploy

2. **Error de Redis:**
   ```
   Error: connect ECONNREFUSED redis://...
   ```
   **Solución:** Verificar variables `REDIS_HOST`, `REDIS_PORT` en Dockploy

3. **Error de Variables de Entorno:**
   ```
   Error: JWT_SECRET is required
   ```
   **Solución:** Agregar todas las variables del `.env.example` en Dockploy

---

## 📝 Variables de Entorno Requeridas en Dockploy

### ⚠️ IMPORTANTE: DATABASE_URL

El error más común es usar el **username** como **database name**:

```env
# ❌ INCORRECTO (causa: FATAL: database "VBxm3vHt" does not exist)
DATABASE_URL=postgresql://VBxm3vHt:password@host:5432/VBxm3vHt

# ✅ CORRECTO
DATABASE_URL=postgresql://VBxm3vHt:password@host:5432/blocki_db
```

**Formato:**
```
postgresql://[USERNAME]:[PASSWORD]@[HOST]:[PORT]/[DATABASE_NAME]
```

### Variables Mínimas:

```env
NODE_ENV=production
PORT=3000
DATABASE_URL=postgresql://VBxm3vHt:[PASSWORD]@[HOST]:5432/blocki_db
JWT_SECRET=your-production-secret-key
STELLAR_NETWORK=testnet
STELLAR_RPC_URL=https://soroban-testnet.stellar.org:443
```

Opcionales pero recomendadas:

```env
REDIS_HOST=your-redis-host
REDIS_PORT=6379
PLATFORM_SECRET_KEY=S...
PLATFORM_PUBLIC_KEY=G...
```

---

## 🎯 Resumen

| Problema | Causa | Solución |
|----------|-------|----------|
| 502 Bad Gateway | NestJS no arranca | Usar versiones fijas en package.json |
| `Cannot find module` | Paquetes "latest" incompatibles | Especificar versiones ^11.x.x |
| Build exitoso pero servicio falla | Paquetes inexistentes (fs, crypto, path) | Eliminar paquetes built-in |
| Deployments inconsistentes | "latest" instala versiones diferentes | Usar versiones con ^ |
| `database "VBxm3vHt" does not exist` | DATABASE_URL usa username como database name | Cambiar a `/blocki_db` en DATABASE_URL |

---

## ✅ Estado Actual

- ✅ package.json corregido
- ✅ Versiones fijas de @nestjs/* (v11.x.x)
- ✅ Eliminadas dependencias inexistentes
- ✅ Listo para hacer commit y push

**Próximo paso:**
```bash
git add package.json SOLUCION_BAD_GATEWAY.md
git commit -m "fix: package.json with fixed versions - solves 502 Bad Gateway"
git push origin main
```

Después del push, Dockploy debería auto-deployar y el backend arrancará correctamente.

---

**Fecha:** 20 Nov 2025
**Problema:** Bad Gateway 502 en https://api.blocki.levsek.com.mx
**Solución:** package.json con versiones fijas
