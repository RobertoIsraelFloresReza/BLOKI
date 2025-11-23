/**
 * Script para probar la subida de archivos a Cloudflare R2
 *
 * Uso:
 *   node test-upload-cloudflare.js <ruta-del-archivo>
 *
 * Ejemplo:
 *   node test-upload-cloudflare.js ./package.json
 *   node test-upload-cloudflare.js ./README.md
 */

const fs = require('fs');
const path = require('path');

// Configuración
const API_URL = 'https://api.blocki.levsek.com.mx/cloudflare/upload';
const FILE_PATH = process.argv[2] || './package.json'; // Archivo por defecto

async function uploadFileToCloudflare(filePath) {
  try {
    console.log('🚀 === TEST DE SUBIDA A CLOUDFLARE R2 ===\n');

    // Verificar que el archivo existe
    if (!fs.existsSync(filePath)) {
      throw new Error(`❌ Archivo no encontrado: ${filePath}`);
    }

    const fileBuffer = fs.readFileSync(filePath);
    const fileName = path.basename(filePath);
    const fileSize = (fileBuffer.length / 1024).toFixed(2);

    console.log(`📁 Archivo: ${fileName}`);
    console.log(`📊 Tamaño: ${fileSize} KB`);
    console.log(`🌐 Endpoint: ${API_URL}\n`);

    // Crear FormData
    const FormData = require('form-data');
    const formData = new FormData();
    formData.append('files', fileBuffer, fileName);

    console.log('⏳ Subiendo archivo...\n');

    // Hacer la petición
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Accept': '*/*',
        ...formData.getHeaders(),
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const result = await response.json();

    console.log('✅ === SUBIDA EXITOSA ===\n');
    console.log('📋 Respuesta del servidor:');
    console.log(JSON.stringify(result, null, 2));

    if (Array.isArray(result) && result[0]?.url) {
      console.log('\n🔗 URL del archivo:');
      console.log(result[0].url);
    }

    return result;

  } catch (error) {
    console.error('\n❌ === ERROR ===');
    console.error(error.message);

    if (error.cause) {
      console.error('\nDetalles:', error.cause);
    }

    process.exit(1);
  }
}

// Ejecutar
console.log('\n');
uploadFileToCloudflare(FILE_PATH);
