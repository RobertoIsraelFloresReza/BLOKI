/**
 * Script para probar el flujo de autenticación completo
 * 1. Registrar un usuario nuevo
 * 2. Hacer login con ese usuario
 * 3. Verificar el perfil
 */

const axios = require('axios');

// Configuración
const API_BASE_URL = 'https://api.blocki.levsek.com.mx';
// const API_BASE_URL = 'http://localhost:4000'; // Descomentar para local

// Colores para console
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

// Datos del usuario de prueba
const testUser = {
  name: 'Isaac Levsek',
  email: `test_${Date.now()}@blocki.tech`,
  password: 'SecurePass123!',
};

async function testRegister() {
  log('\n========================================', 'cyan');
  log('🔹 PASO 1: Registrando usuario nuevo', 'cyan');
  log('========================================', 'cyan');

  try {
    const response = await axios.post(`${API_BASE_URL}/auth/register`, testUser);

    // La API devuelve { data: { user, access_token, ... }, status, message }
    const apiData = response.data.data || response.data;

    // Verificar que tenemos datos
    if (!apiData || !apiData.user) {
      throw new Error('Respuesta inválida del servidor');
    }

    log('✅ Usuario registrado exitosamente!', 'green');
    log(`📧 Email: ${apiData.user.email}`, 'blue');
    log(`👤 Nombre: ${apiData.user.name}`, 'blue');
    log(`🔑 Stellar Public Key: ${apiData.user.stellarPublicKey}`, 'blue');
    log(`🎫 Token JWT: ${apiData.access_token.substring(0, 50)}...`, 'blue');

    if (apiData.stellarWallet) {
      log(`\n💼 Wallet creada automáticamente:`, 'yellow');
      log(`   Public Key: ${apiData.stellarWallet.publicKey}`, 'yellow');
      log(`   Secret Key: ENCRYPTED (segura)`, 'yellow');
    }

    return {
      user: apiData.user,
      token: apiData.access_token,
    };
  } catch (error) {
    log('❌ Error al registrar usuario:', 'red');
    if (error.response) {
      log(`   Status: ${error.response.status}`, 'red');
      log(`   Error: ${JSON.stringify(error.response.data, null, 2)}`, 'red');
    } else {
      log(`   ${error.message}`, 'red');
    }
    throw error;
  }
}

async function testLogin(email, password) {
  log('\n========================================', 'cyan');
  log('🔹 PASO 2: Haciendo login', 'cyan');
  log('========================================', 'cyan');

  try {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, {
      email,
      password,
    });

    const apiData = response.data.data || response.data;

    log('✅ Login exitoso!', 'green');
    log(`📧 Email: ${apiData.user.email}`, 'blue');
    log(`👤 Nombre: ${apiData.user.name}`, 'blue');
    log(`🔑 Stellar Public Key: ${apiData.user.stellarPublicKey}`, 'blue');
    log(`🎫 Token JWT: ${apiData.access_token.substring(0, 50)}...`, 'blue');

    return {
      user: apiData.user,
      token: apiData.access_token,
    };
  } catch (error) {
    log('❌ Error al hacer login:', 'red');
    if (error.response) {
      log(`   Status: ${error.response.status}`, 'red');
      log(`   Error: ${JSON.stringify(error.response.data, null, 2)}`, 'red');
    } else {
      log(`   ${error.message}`, 'red');
    }
    throw error;
  }
}

async function testGetProfile(token) {
  log('\n========================================', 'cyan');
  log('🔹 PASO 3: Obteniendo perfil del usuario', 'cyan');
  log('========================================', 'cyan');

  try {
    const response = await axios.get(`${API_BASE_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const apiData = response.data.data || response.data;

    log('✅ Perfil obtenido exitosamente!', 'green');
    log(`📧 Email: ${apiData.email}`, 'blue');
    log(`👤 Nombre: ${apiData.name}`, 'blue');
    log(`🔑 Stellar Public Key: ${apiData.stellarPublicKey}`, 'blue');
    log(`📊 KYC Status: ${apiData.kycStatus || 'pending'}`, 'blue');

    return apiData;
  } catch (error) {
    log('❌ Error al obtener perfil:', 'red');
    if (error.response) {
      log(`   Status: ${error.response.status}`, 'red');
      log(`   Error: ${JSON.stringify(error.response.data, null, 2)}`, 'red');
    } else {
      log(`   ${error.message}`, 'red');
    }
    throw error;
  }
}

async function runAuthFlowTest() {
  log('\n🚀 INICIANDO TEST DE AUTENTICACIÓN', 'cyan');
  log('====================================', 'cyan');
  log(`📍 API URL: ${API_BASE_URL}`, 'yellow');
  log(`📧 Test Email: ${testUser.email}`, 'yellow');

  try {
    // Paso 1: Registrar usuario
    const registerResult = await testRegister();

    // Esperar un momento
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Paso 2: Hacer login
    const loginResult = await testLogin(testUser.email, testUser.password);

    // Paso 3: Obtener perfil
    const profile = await testGetProfile(loginResult.token);

    // Resumen final
    log('\n========================================', 'green');
    log('✅ TEST COMPLETADO EXITOSAMENTE!', 'green');
    log('========================================', 'green');
    log('\n📋 RESUMEN:', 'cyan');
    log(`   ✓ Usuario registrado: ${registerResult.user.email}`, 'green');
    log(`   ✓ Login exitoso con JWT`, 'green');
    log(`   ✓ Perfil verificado`, 'green');
    log(`   ✓ Wallet Stellar creada: ${profile.stellarPublicKey}`, 'green');

    log('\n🎯 Siguiente paso: Crear una propiedad tokenizada', 'yellow');
    log(`   Usa este token JWT para autenticarte:`, 'yellow');
    log(`   ${loginResult.token.substring(0, 80)}...`, 'yellow');

    // Guardar datos para el siguiente paso
    const fs = require('fs');

    // IMPORTANTE: Usar el token del REGISTRO porque incluye stellarPublicKey
    // El token del login no lo incluye (bug del backend que debemos arreglar)
    const authData = {
      user: profile,
      token: registerResult.token, // Token del registro con stellarPublicKey
      tokenFromLogin: loginResult.token, // Token del login (sin stellarPublicKey)
      email: testUser.email,
      password: testUser.password,
    };
    fs.writeFileSync('.test-auth-data.json', JSON.stringify(authData, null, 2));
    log('\n💾 Datos guardados en .test-auth-data.json', 'blue');
    log('   ⚠️  Usando token del REGISTRO (tiene stellarPublicKey)', 'yellow');

    return authData;
  } catch (error) {
    log('\n========================================', 'red');
    log('❌ TEST FALLIDO', 'red');
    log('========================================', 'red');
    process.exit(1);
  }
}

// Ejecutar el test
runAuthFlowTest().then(() => {
  log('\n✨ Listo para continuar!', 'green');
  process.exit(0);
});
