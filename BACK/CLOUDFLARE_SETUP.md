# Cloudflare R2 Setup Guide

Este proyecto utiliza **Cloudflare R2** para almacenar imágenes, documentos y otros archivos multimedia de forma eficiente y económica.

## 🚀 Configuración Rápida

### 1. Crear Cuenta y Bucket en Cloudflare

1. Ve a [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Navega a **R2** en el menú lateral
3. Click en **Create bucket**
4. Nombre del bucket: `blocki-stellar` (o el nombre que prefieras)
5. Selecciona la región más cercana a tus usuarios
6. Click en **Create bucket**

### 2. Generar API Tokens

1. En la página de R2, ve a **Manage R2 API Tokens**
2. Click en **Create API token**
3. Nombre del token: `blocki-backend-access`
4. Permisos:
   - ✅ Object Read & Write
   - ✅ Bucket Access: Select bucket(s) → `blocki-stellar`
5. Click en **Create API Token**
6. **IMPORTANTE**: Copia y guarda:
   - **Access Key ID** → `CLOUDFLARE_R2_ACCESS_KEY`
   - **Secret Access Key** → `CLOUDFLARE_R2_SECRET_KEY` (solo se muestra una vez)

### 3. Obtener Endpoint y Public URL

#### Endpoint (S3-compatible):
```
https://<ACCOUNT_ID>.r2.cloudflarestorage.com
```
Encuentra tu `ACCOUNT_ID` en:
- R2 Dashboard > Settings > Account ID

#### Public URL:
1. Ve a tu bucket → Settings
2. En **Public Access**, habilita **Allow Access**
3. Copia la **Public URL**: `https://pub-<HASH>.r2.dev`

### 4. Configurar Variables de Entorno

Edita el archivo `.env` en el backend:

```env
# Cloudflare R2 Storage
CLOUDFLARE_R2_ACCESS_KEY=your_access_key_id_here
CLOUDFLARE_R2_SECRET_KEY=your_secret_access_key_here
CLOUDFLARE_R2_BUCKET_NAME=blocki-stellar
CLOUDFLARE_R2_ENDPOINT=https://your_account_id.r2.cloudflarestorage.com
CLOUDFLARE_R2_PUBLIC_URL=https://pub-your_hash.r2.dev
```

### 5. Ejecutar Migración de Base de Datos

Crea la tabla `media` en PostgreSQL:

```bash
# Opción 1: Ejecutar directamente
psql -U your_user -d your_database -f src/migrations/CreateMediaTable.sql

# Opción 2: Usar TypeORM (si tienes configurado migrations)
npm run migration:run
```

### 6. Reiniciar el Backend

```bash
npm run start:dev
```

## 🧪 Probar la Configuración

### Opción 1: Usando cURL

```bash
# Subir una imagen a Cloudflare
curl -X POST http://localhost:3000/cloudflare/upload \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "files=@/path/to/image.jpg" \
  -F "folder=test"
```

### Opción 2: Desde el Frontend

1. Inicia el frontend: `npm run dev`
2. Ve a **Seller Dashboard** → **Upload Property**
3. Sube imágenes de prueba
4. Verifica en Cloudflare R2 Dashboard que los archivos aparezcan

## 📁 Estructura de Carpetas en R2

Las imágenes se organizan automáticamente por tipo:

```
blocki-stellar/
├── properties/
│   ├── uuid-1.jpg
│   ├── uuid-2.png
│   └── ...
├── valuations/
│   ├── uuid-3.pdf
│   └── ...
├── evaluators/
│   ├── uuid-4.png
│   └── ...
└── general/
    └── ...
```

## 🔒 Configuración de CORS (Opcional)

Si quieres acceder a las imágenes directamente desde el frontend:

1. Ve a tu bucket → Settings → CORS policy
2. Añade esta configuración:

```json
[
  {
    "AllowedOrigins": ["http://localhost:3001", "https://your-production-domain.com"],
    "AllowedMethods": ["GET", "HEAD"],
    "AllowedHeaders": ["*"],
    "ExposeHeaders": [],
    "MaxAgeSeconds": 3600
  }
]
```

## 📊 Costos Estimados

Cloudflare R2 es **muy económico** para proyectos de hackathon:

- **Almacenamiento**: $0.015 / GB / mes
- **Operaciones**:
  - Escritura (PUT): $4.50 / millón
  - Lectura (GET): $0.36 / millón
- **Transferencia**: ¡**GRATIS**! (a diferencia de S3)

**Ejemplo para el hackathon:**
- 1,000 propiedades × 5 imágenes × 2MB = 10GB
- Costo mensual: **~$0.15 USD** 😎

## 🛠️ Troubleshooting

### Error: "Faltan credenciales de Cloudflare R2"
- Verifica que las variables de entorno estén configuradas en `.env`
- Reinicia el servidor después de cambiar `.env`

### Error: "Access Denied" al subir archivos
- Verifica que el API Token tenga permisos de **Object Read & Write**
- Confirma que el bucket name en `.env` coincida con el bucket creado

### Imágenes no se muestran en el frontend
- Verifica que `CLOUDFLARE_R2_PUBLIC_URL` sea correcto
- Asegúrate que el bucket tenga **Public Access** habilitado
- Revisa la configuración de CORS

## 📚 Referencias

- [Cloudflare R2 Docs](https://developers.cloudflare.com/r2/)
- [S3 API Compatibility](https://developers.cloudflare.com/r2/api/s3/)
- [Pricing Calculator](https://developers.cloudflare.com/r2/pricing/)

---

**¿Necesitas ayuda?** Abre un issue en el repositorio o contacta al equipo de Blocki.
