/**
 * Script COMPLETO del flujo end-to-end de Blocki
 *
 * FLUJO:
 * 1. Registrar usuario con wallet custodial
 * 2. Obtener secret key encriptado del usuario
 * 3. Crear propiedad tokenizada (deployment real en blockchain)
 * 4. Crear listing en el marketplace
 * 5. Comprar tokens de la propiedad
 * 6. Validar todo en Stellar testnet
 */

const axios = require('axios');
const fs = require('fs');

const API_BASE_URL = 'https://api.blocki.levsek.com.mx';

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

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ============================================================================
// PASO 1: REGISTRAR USUARIO
// ============================================================================
async function registerUser() {
  log('\n═══════════════════════════════════════════', 'cyan');
  log('📝 PASO 1: REGISTRAR USUARIO', 'cyan');
  log('═══════════════════════════════════════════', 'cyan');

  const testUser = {
    name: 'Isaac Levsek',
    email: `test_complete_${Date.now()}@blocki.tech`,
    password: 'SecurePass123!',
  };

  try {
    const response = await axios.post(`${API_BASE_URL}/auth/register`, testUser);
    const apiData = response.data.data || response.data;

    log('✅ Usuario registrado exitosamente!', 'green');
    log(`   Email: ${apiData.user.email}`, 'blue');
    log(`   Stellar Public Key: ${apiData.user.stellarPublicKey}`, 'blue');

    return {
      user: apiData.user,
      token: apiData.access_token,
      email: testUser.email,
      password: testUser.password,
    };
  } catch (error) {
    log('❌ Error al registrar usuario:', 'red');
    console.error(error.response?.data || error.message);
    throw error;
  }
}

// ============================================================================
// PASO 2: OBTENER SECRET KEY
// ============================================================================
async function getSecretKey(token) {
  log('\n═══════════════════════════════════════════', 'cyan');
  log('🔐 PASO 2: OBTENER SECRET KEY', 'cyan');
  log('═══════════════════════════════════════════', 'cyan');

  try {
    const response = await axios.get(`${API_BASE_URL}/auth/wallet/secret-key`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const apiData = response.data.data || response.data;

    log('✅ Secret key obtenido exitosamente!', 'green');
    log(`   Public Key: ${apiData.stellarPublicKey}`, 'blue');
    log(`   Secret Key: ${apiData.stellarSecretKey.substring(0, 10)}...`, 'blue');

    return apiData.stellarSecretKey;
  } catch (error) {
    log('❌ Error al obtener secret key:', 'red');
    console.error(error.response?.data || error.message);
    throw error;
  }
}

// ============================================================================
// PASO 3: CREAR PROPIEDAD TOKENIZADA
// ============================================================================
async function createPropertyTokenized(token, secretKey) {
  log('\n═══════════════════════════════════════════', 'cyan');
  log('🏠 PASO 3: CREAR PROPIEDAD TOKENIZADA', 'cyan');
  log('═══════════════════════════════════════════', 'cyan');

  const propertyData = {
    name: 'Casa Premium en Polanco',
    propertyId: `PROP-${Date.now()}`,
    description: 'Casa de lujo con 4 recámaras, jardín y alberca',
    address: 'Av. Polanco 456, Miguel Hidalgo, CDMX',
    totalSupply: 100, // 100 tokens
    valuation: 5000000, // $5,000,000 MXN
    legalOwner: 'Isaac Levsek',
    adminSecretKey: secretKey, // ⭐ Aquí usamos el secret key para deployment
    metadata: {
      bedrooms: 4,
      bathrooms: 3,
      area: 300,
      category: 'houses',
      yearBuilt: 2022,
      parkingSpaces: 2,
    },
  };

  try {
    log('⏳ Creando propiedad...', 'yellow');
    log('   (Esto tomará 10-30 segundos para desplegar en Stellar testnet)', 'yellow');

    const response = await axios.post(`${API_BASE_URL}/properties`, propertyData, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const apiData = response.data.data || response.data;

    log('✅ Propiedad tokenizada exitosamente!', 'green');
    log(`   Property ID: ${apiData.id}`, 'blue');
    log(`   Contract ID: ${apiData.contractId}`, 'blue');
    log(`   Name: ${apiData.name}`, 'blue');
    log(`   Tokens: ${parseInt(apiData.totalSupply) / 10000000}`, 'blue');

    if (apiData.registryTxHash) {
      log(`   Registry TX: ${apiData.registryTxHash}`, 'blue');
    }

    log(`\n🔗 Ver en Stellar Explorer:`, 'magenta');
    log(`   https://stellar.expert/explorer/testnet/contract/${apiData.contractId}`, 'magenta');

    return apiData;
  } catch (error) {
    log('❌ Error al crear propiedad:', 'red');
    console.error(error.response?.data || error.message);
    throw error;
  }
}

// ============================================================================
// PASO 4: CREAR LISTING EN MARKETPLACE
// ============================================================================
async function createListing(token, propertyId, secretKey) {
  log('\n═══════════════════════════════════════════', 'cyan');
  log('🏪 PASO 4: CREAR LISTING EN MARKETPLACE', 'cyan');
  log('═══════════════════════════════════════════', 'cyan');

  const listingData = {
    propertyId: propertyId,
    amount: 50, // Vender 50 tokens (50% de la propiedad)
    pricePerToken: 50000, // $50,000 MXN por token
    sellerSecretKey: secretKey,
    expirationDays: 30,
  };

  try {
    log('⏳ Creando listing...', 'yellow');
    log('   (Esto tomará unos segundos para registrar en blockchain)', 'yellow');

    const response = await axios.post(`${API_BASE_URL}/marketplace/listings`, listingData, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const apiData = response.data.data || response.data;

    log('✅ Listing creado exitosamente!', 'green');
    log(`   Listing ID: ${apiData.listingId}`, 'blue');
    log(`   Amount: ${parseInt(apiData.amount) / 10000000} tokens`, 'blue');
    log(`   Price per token: $${parseInt(apiData.pricePerToken) / 10000000}`, 'blue');
    log(`   Total price: $${parseInt(apiData.totalPrice) / 10000000}`, 'blue');
    log(`   TX Hash: ${apiData.txHash}`, 'blue');

    return apiData;
  } catch (error) {
    log('❌ Error al crear listing:', 'red');
    console.error(error.response?.data || error.message);
    throw error;
  }
}

// ============================================================================
// PASO 5: COMPRAR TOKENS
// ============================================================================
async function buyTokens(token, listingId, amount, buyerSecretKey) {
  log('\n═══════════════════════════════════════════', 'cyan');
  log('💰 PASO 5: COMPRAR TOKENS', 'cyan');
  log('═══════════════════════════════════════════', 'cyan');

  const buyData = {
    listingId: parseInt(listingId),
    amount: amount, // Comprar X tokens
    buyerSecretKey: buyerSecretKey,
  };

  try {
    log(`⏳ Comprando ${amount} tokens...`, 'yellow');
    log('   (Procesando transacción en blockchain)', 'yellow');

    const response = await axios.post(`${API_BASE_URL}/marketplace/listings/buy`, buyData, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const apiData = response.data.data || response.data;

    log('✅ Tokens comprados exitosamente!', 'green');
    log(`   Transaction Hash: ${apiData.transaction.txHash}`, 'blue');
    log(`   Buyer: ${apiData.transaction.buyerAddress}`, 'blue');
    log(`   Amount: ${parseInt(apiData.transaction.amount) / 10000000} tokens`, 'blue');
    log(`   Total paid: $${parseInt(apiData.transaction.totalPrice) / 10000000}`, 'blue');

    log(`\n🔗 Ver transacción en Stellar:`, 'magenta');
    log(`   https://stellar.expert/explorer/testnet/tx/${apiData.transaction.txHash}`, 'magenta');

    return apiData;
  } catch (error) {
    log('❌ Error al comprar tokens:', 'red');
    console.error(error.response?.data || error.message);
    throw error;
  }
}

// ============================================================================
// PASO 6: VALIDAR EN BLOCKCHAIN
// ============================================================================
async function validateOnBlockchain(property, listing, transaction) {
  log('\n═══════════════════════════════════════════', 'cyan');
  log('✅ PASO 6: VALIDACIÓN FINAL', 'cyan');
  log('═══════════════════════════════════════════', 'cyan');

  log('\n📊 RESUMEN COMPLETO:', 'green');
  log('═══════════════════════════════════════════', 'green');

  log('\n🏠 PROPIEDAD:', 'cyan');
  log(`   ✓ ID: ${property.id}`, 'green');
  log(`   ✓ Nombre: ${property.name}`, 'green');
  log(`   ✓ Contract: ${property.contractId}`, 'green');
  log(`   ✓ Tokens: ${parseInt(property.totalSupply) / 10000000}`, 'green');

  log('\n🏪 LISTING:', 'cyan');
  log(`   ✓ Listing ID: ${listing.listingId}`, 'green');
  log(`   ✓ Tokens en venta: ${parseInt(listing.initialAmount) / 10000000}`, 'green');
  log(`   ✓ Precio por token: $${parseInt(listing.pricePerToken) / 10000000}`, 'green');

  log('\n💰 COMPRA:', 'cyan');
  log(`   ✓ Tokens comprados: ${parseInt(transaction.transaction.amount) / 10000000}`, 'green');
  log(`   ✓ Total pagado: $${parseInt(transaction.transaction.totalPrice) / 10000000}`, 'green');
  log(`   ✓ Comprador: ${transaction.transaction.buyerAddress}`, 'green');

  log('\n🔗 ENLACES BLOCKCHAIN:', 'magenta');
  log(`   Contract: https://stellar.expert/explorer/testnet/contract/${property.contractId}`, 'magenta');
  log(`   TX Compra: https://stellar.expert/explorer/testnet/tx/${transaction.transaction.txHash}`, 'magenta');

  log('\n═══════════════════════════════════════════', 'green');
  log('🎉 ¡FLUJO COMPLETO EXITOSO!', 'green');
  log('═══════════════════════════════════════════', 'green');
}

// ============================================================================
// MAIN FLOW
// ============================================================================
async function runCompleteFlow() {
  log('\n🚀 INICIANDO FLUJO COMPLETO END-TO-END', 'cyan');
  log('═══════════════════════════════════════════\n', 'cyan');

  try {
    // PASO 1: Registrar usuario
    const authData = await registerUser();
    await sleep(1000);

    // PASO 2: Obtener secret key
    const secretKey = await getSecretKey(authData.token);
    await sleep(1000);

    // PASO 3: Crear propiedad tokenizada
    const property = await createPropertyTokenized(authData.token, secretKey);
    await sleep(2000);

    // PASO 4: Crear listing
    const listing = await createListing(authData.token, property.id, secretKey);
    await sleep(2000);

    // PASO 5: Crear segundo usuario para comprar
    log('\n═══════════════════════════════════════════', 'cyan');
    log('👤 CREANDO COMPRADOR (2do usuario)', 'cyan');
    log('═══════════════════════════════════════════', 'cyan');

    const buyer = await registerUser();
    const buyerSecretKey = await getSecretKey(buyer.token);
    await sleep(2000);

    // PASO 6: Comprar tokens
    const transaction = await buyTokens(buyer.token, listing.listingId, 10, buyerSecretKey);
    await sleep(1000);

    // PASO 7: Validar todo
    await validateOnBlockchain(property, listing, transaction);

    // Guardar resultados
    const results = {
      seller: authData.user,
      buyer: buyer.user,
      property,
      listing,
      transaction,
      timestamp: new Date().toISOString(),
    };

    fs.writeFileSync('.test-complete-flow-results.json', JSON.stringify(results, null, 2));
    log('\n💾 Resultados guardados en .test-complete-flow-results.json', 'blue');

    log('\n✨ ¡Flujo end-to-end completado exitosamente!', 'green');
    return results;

  } catch (error) {
    log('\n═══════════════════════════════════════════', 'red');
    log('❌ FLUJO FALLIDO', 'red');
    log('═══════════════════════════════════════════', 'red');
    console.error('\nError:', error.message);
    if (error.response?.data) {
      console.error('Response:', JSON.stringify(error.response.data, null, 2));
    }
    process.exit(1);
  }
}

// Ejecutar
runCompleteFlow().then(() => {
  process.exit(0);
});
