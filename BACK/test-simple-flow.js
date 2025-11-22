/**
 * Script SIMPLIFICADO del flujo (sin deployment blockchain)
 * Para verificar que el resto funciona correctamente
 */

const axios = require('axios');

const API_BASE_URL = 'https://api.blocki.levsek.com.mx';

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function simpleFlow() {
  log('\n🚀 FLUJO SIMPLIFICADO (Sin blockchain)', 'cyan');
  log('═══════════════════════════════════════════\n', 'cyan');

  try {
    // 1. Registrar usuario
    log('📝 Paso 1: Registrando usuario...', 'cyan');
    const registerRes = await axios.post(`${API_BASE_URL}/auth/register`, {
      name: 'Test User',
      email: `simple_test_${Date.now()}@blocki.tech`,
      password: 'SecurePass123!',
    });
    const user = registerRes.data.data || registerRes.data;
    log(`✅ Usuario registrado: ${user.user.email}`, 'green');
    log(`   Stellar Key: ${user.user.stellarPublicKey}`, 'blue');

    // 2. Obtener secret key
    log('\n🔐 Paso 2: Obteniendo secret key...', 'cyan');
    const secretRes = await axios.get(`${API_BASE_URL}/auth/wallet/secret-key`, {
      headers: { Authorization: `Bearer ${user.access_token}` },
    });
    const secretData = secretRes.data.data || secretRes.data;
    log(`✅ Secret key obtenido`, 'green');

    // 3. Crear propiedad SIN deployment (sin adminSecretKey)
    log('\n🏠 Paso 3: Creando propiedad (sin blockchain)...', 'cyan');
    const propertyRes = await axios.post(
      `${API_BASE_URL}/properties`,
      {
        name: 'Casa Test Simplificada',
        propertyId: `PROP-${Date.now()}`,
        description: 'Propiedad de prueba',
        address: 'Test Address 123',
        totalSupply: 100,
        valuation: 1000000,
        legalOwner: 'Test Owner',
        metadata: { category: 'houses' },
        // NO incluir adminSecretKey para que no intente hacer deployment
      },
      { headers: { Authorization: `Bearer ${user.access_token}` } }
    );
    const property = propertyRes.data.data || propertyRes.data;
    log(`✅ Propiedad creada (ID: ${property.id})`, 'green');
    log(`   Contract ID: ${property.contractId}`, 'blue');
    log(`   Status: PENDING (sin blockchain)`, 'yellow');

    // 4. Verificar que se puede listar todas las propiedades
    log('\n📋 Paso 4: Listando propiedades...', 'cyan');
    const listRes = await axios.get(`${API_BASE_URL}/properties`);
    const properties = listRes.data.data || listRes.data;
    log(`✅ Total propiedades: ${properties.length}`, 'green');

    log('\n═══════════════════════════════════════════', 'green');
    log('✅ FLUJO BÁSICO COMPLETADO EXITOSAMENTE', 'green');
    log('═══════════════════════════════════════════', 'green');

    log('\n📝 RESUMEN:', 'cyan');
    log(`   ✓ Usuario: ${user.user.email}`, 'green');
    log(`   ✓ Secret key: Obtenido correctamente`, 'green');
    log(`   ✓ Propiedad: Creada (ID ${property.id})`, 'green');
    log(`   ✓ API: Funcionando correctamente`, 'green');

    log('\n⚠️  NOTA: La propiedad está en estado PENDING', 'yellow');
    log('   Para tokenizarla en blockchain, se necesita:', 'yellow');
    log('   1. Verificar que el Deployer contract esté correcto', 'yellow');
    log('   2. Asegurar que la cuenta tenga fondos suficientes', 'yellow');
    log('   3. Revisar logs del backend para el error específico', 'yellow');

  } catch (error) {
    log('\n❌ ERROR', 'red');
    console.error(error.response?.data || error.message);
  }
}

simpleFlow();
