/**
 * Script para probar la subida de archivos a Cloudflare R2 (usando axios)
 *
 * Uso:
 *   node test-upload-axios.js <ruta-del-archivo>
 *
 * Ejemplo:
 *   node test-upload-axios.js ./package.json
 *   node test-upload-axios.js ./README.md
 */

const fs = require('fs');
const path = require('path');
const axios = require('axios');
const FormData = require('form-data');

// Configuración
const API_URL = 'https://api.blocki.levsek.com.mx/cloudflare/upload';
const FILE_PATH = process.argv[2] || './package.json'; // Archivo por defecto

async function uploadFileToCloudflare(filePath) {
  try {
    console.log('🚀 === TEST DE SUBIDA A CLOUDFLARE R2 (AXIOS) ===\n');

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
    const formData = new FormData();
    formData.append('files', fileBuffer, {
      filename: fileName,
      contentType: 'application/octet-stream'
    });

    console.log('⏳ Subiendo archivo...\n');

    // Hacer la petición con axios
    const response = await axios.post(API_URL, formData, {
      headers: {
        'Accept': '*/*',
        ...formData.getHeaders(),
      },
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
    });

    console.log('✅ === SUBIDA EXITOSA ===\n');
    console.log('📋 Respuesta del servidor:');
    console.log(JSON.stringify(response.data, null, 2));

    if (Array.isArray(response.data) && response.data[0]?.url) {
      console.log('\n🔗 URL del archivo:');
      console.log(response.data[0].url);
    }

    return response.data;

  } catch (error) {
    console.error('\n❌ === ERROR ===');

    if (error.response) {
      console.error(`HTTP ${error.response.status}: ${error.response.statusText}`);
      console.error('Respuesta:', error.response.data);
    } else if (error.request) {
      console.error('No se recibió respuesta del servidor');
      console.error(error.message);
    } else {
      console.error(error.message);
    }

    process.exit(1);
  }
}

// Ejecutar
console.log('\n');
uploadFileToCloudflare(FILE_PATH);
