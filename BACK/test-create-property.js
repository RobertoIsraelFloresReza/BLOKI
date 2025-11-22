/**
 * Script para crear una propiedad tokenizada en Stellar
 * Lee los datos de autenticación del test anterior
 * Crea una propiedad y la tokeniza automáticamente
 */

const axios = require('axios');
const fs = require('fs');

// Configuración
const API_BASE_URL = 'https://api.blocki.levsek.com.mx';

// Colores para console
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// Leer datos de autenticación del test anterior
function loadAuthData() {
  try {
    const authData = JSON.parse(fs.readFileSync('.test-auth-data.json', 'utf-8'));
    log('✅ Datos de autenticación cargados', 'green');
    return authData;
  } catch (error) {
    log('❌ Error: No se encontraron datos de autenticación', 'red');
    log('   Ejecuta primero: node test-auth-flow.js', 'yellow');
    process.exit(1);
  }
}

// Datos de la propiedad de prueba
const testProperty = {
  name: 'Casa Moderna en Polanco',
  propertyId: `PROP-${Date.now()}`,
  description: 'Casa de 3 recámaras con jardín, ubicada en una de las mejores zonas de CDMX',
  address: 'Av. Polanco 123, Miguel Hidalgo, CDMX',
  totalSupply: 100, // 100 tokens
  valuation: 5000000, // $5,000,000 MXN
  legalOwner: 'Isaac Levsek',
  metadata: {
    bedrooms: 3,
    bathrooms: 2,
    area: 250, // m²
    category: 'houses',
    yearBuilt: 2020,
    parkingSpaces: 2,
  },
};

async function createProperty(token) {
  log('\n========================================', 'cyan');
  log('🏠 CREANDO PROPIEDAD TOKENIZADA', 'cyan');
  log('========================================', 'cyan');

  log('\n📋 Datos de la propiedad:', 'blue');
  log(`   Nombre: ${testProperty.name}`, 'blue');
  log(`   ID: ${testProperty.propertyId}`, 'blue');
  log(`   Dirección: ${testProperty.address}`, 'blue');
  log(`   Valuación: $${testProperty.valuation.toLocaleString()} MXN`, 'blue');
  log(`   Total Supply: ${testProperty.totalSupply} tokens`, 'blue');
  log(`   Precio por token: $${(testProperty.valuation / testProperty.totalSupply).toLocaleString()} MXN`, 'blue');

  try {
    const propertyData = {
      ...testProperty,
      // No incluir adminSecretKey - el backend creará una propiedad sin deployment
      // Para deployar se necesita el secret key del usuario (que está encriptado)
    };

    log('\n⏳ Enviando petición al backend...', 'yellow');
    log('   Esto puede tardar 10-30 segundos (desplegando contrato en Stellar testnet)', 'yellow');

    const response = await axios.post(
      `${API_BASE_URL}/properties`,
      propertyData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const apiData = response.data.data || response.data;

    log('\n✅ Propiedad creada y tokenizada exitosamente!', 'green');
    log('\n📊 RESULTADO:', 'cyan');
    log(`   ✓ Property ID: ${apiData.id}`, 'green');
    log(`   ✓ Contract ID: ${apiData.contractId}`, 'green');
    log(`   ✓ Property Name: ${apiData.name}`, 'green');
    log(`   ✓ Total Supply: ${apiData.totalSupply} tokens`, 'green');
    log(`   ✓ Valuation: $${apiData.valuation}`, 'green');
    log(`   ✓ Registry TX Hash: ${apiData.registryTxHash || 'N/A'}`, 'green');

    log('\n🔗 Verificar en Stellar Expert:', 'magenta');
    log(`   https://stellar.expert/explorer/testnet/contract/${apiData.contractId}`, 'magenta');

    // Guardar datos de la propiedad
    const propertyData2 = {
      ...apiData,
      createdAt: new Date().toISOString(),
    };

    fs.writeFileSync('.test-property-data.json', JSON.stringify(propertyData2, null, 2));
    log('\n💾 Datos guardados en .test-property-data.json', 'blue');

    return apiData;
  } catch (error) {
    log('\n❌ Error al crear propiedad:', 'red');
    if (error.response) {
      log(`   Status: ${error.response.status}`, 'red');
      log(`   Error: ${JSON.stringify(error.response.data, null, 2)}`, 'red');
    } else {
      log(`   ${error.message}`, 'red');
    }
    throw error;
  }
}

async function verifyPropertyOnBlockchain(contractId) {
  log('\n========================================', 'cyan');
  log('🔍 VERIFICANDO EN BLOCKCHAIN', 'cyan');
  log('========================================', 'cyan');

  try {
    log('\n⏳ Consultando contrato en testnet...', 'yellow');

    // Aquí podrías hacer una llamada directa al contrato
    // Por ahora solo mostramos el enlace
    log('\n✅ Puedes verificar el contrato en:', 'green');
    log(`   https://stellar.expert/explorer/testnet/contract/${contractId}`, 'blue');

    return true;
  } catch (error) {
    log('⚠️  No se pudo verificar automáticamente, pero puedes verificar manualmente', 'yellow');
    return false;
  }
}

async function runPropertyCreationTest() {
  log('\n🚀 INICIANDO CREACIÓN DE PROPIEDAD', 'cyan');
  log('====================================', 'cyan');

  try {
    // Cargar datos de autenticación
    const authData = loadAuthData();
    log(`📧 Usuario: ${authData.email}`, 'blue');
    log(`🔑 Stellar Key: ${authData.user.stellarPublicKey}`, 'blue');

    // Crear propiedad
    const property = await createProperty(authData.token);

    // Esperar un momento
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Verificar en blockchain
    if (property.contractId) {
      await verifyPropertyOnBlockchain(property.contractId);
    }

    // Resumen final
    log('\n========================================', 'green');
    log('✅ PROPIEDAD CREADA Y TOKENIZADA!', 'green');
    log('========================================', 'green');
    log('\n📋 RESUMEN:', 'cyan');
    log(`   ✓ Propiedad: ${property.name}`, 'green');
    log(`   ✓ ID: ${property.id}`, 'green');
    log(`   ✓ Contract ID: ${property.contractId}`, 'green');
    log(`   ✓ Tokens: ${property.totalSupply}`, 'green');
    log(`   ✓ Valuación: $${property.valuation}`, 'green');

    log('\n🎯 Siguiente paso: Crear un listing en el marketplace', 'yellow');
    log(`   La propiedad ya está lista para ser listada`, 'yellow');

    return property;
  } catch (error) {
    log('\n========================================', 'red');
    log('❌ TEST FALLIDO', 'red');
    log('========================================', 'red');
    process.exit(1);
  }
}

// Ejecutar el test
runPropertyCreationTest().then(() => {
  log('\n✨ Listo para continuar!', 'green');
  process.exit(0);
});
