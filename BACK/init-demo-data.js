/**
 * Script para Inicializar Datos de Demo
 * Crea propiedades, las tokeniza y crea listings
 * Ejecutar: node init-demo-data.js
 */

const API_URL = 'http://localhost:4000';

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

async function makeRequest(method, endpoint, data = null, token = null) {
  const headers = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const options = {
    method,
    headers,
  };

  if (data) {
    options.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(`${API_URL}${endpoint}`, options);
    const json = await response.json();
    return { status: response.status, data: json };
  } catch (error) {
    return { status: 500, error: error.message };
  }
}

async function createAdminUser() {
  log('\n=== Creando Usuario Administrador ===', 'cyan');

  const userData = {
    name: 'Admin Demo',
    email: 'admin@blocki.com',
    password: 'Admin123!',
  };

  // Intentar registrar
  let result = await makeRequest('POST', '/auth/register', userData);

  if (result.status === 409) {
    log('⚠ Usuario admin ya existe, haciendo login...', 'yellow');
  } else if (result.status === 200) {
    log('✓ Usuario admin creado', 'green');
  } else {
    log('✗ Error creando admin', 'red');
    return null;
  }

  // Login
  result = await makeRequest('POST', '/auth/login', {
    email: userData.email,
    password: userData.password,
  });

  if (result.status === 200) {
    const token = result.data.data.access_token;
    log(`✓ Login exitoso - Token obtenido`, 'green');
    return token;
  } else {
    log('✗ Error en login', 'red');
    return null;
  }
}

async function createProperty(token, propertyData) {
  log(`\n→ Creando propiedad: ${propertyData.title}`, 'yellow');

  const result = await makeRequest('POST', '/properties', propertyData, token);

  if (result.status === 200 || result.status === 201) {
    log(`✓ Propiedad creada - ID: ${result.data.data.id}`, 'green');
    return result.data.data;
  } else {
    log(`✗ Error creando propiedad: ${JSON.stringify(result)}`, 'red');
    return null;
  }
}

async function tokenizeProperty(token, propertyId, tokenizationData) {
  log(`\n→ Tokenizando propiedad ID: ${propertyId}`, 'yellow');

  const result = await makeRequest(
    'POST',
    `/properties/${propertyId}/tokenize`,
    tokenizationData,
    token
  );

  if (result.status === 200 || result.status === 201) {
    log(`✓ Propiedad tokenizada`, 'green');
    log(`  Contract ID: ${result.data.data.tokenContractId || 'Pending'}`, 'cyan');
    return result.data.data;
  } else {
    log(`✗ Error tokenizando: ${JSON.stringify(result)}`, 'red');
    return null;
  }
}

async function createListing(token, listingData) {
  log(`\n→ Creando listing para propiedad ID: ${listingData.propertyId}`, 'yellow');

  const result = await makeRequest('POST', '/marketplace/listings', listingData, token);

  if (result.status === 200 || result.status === 201) {
    log(`✓ Listing creado - ID: ${result.data.data.id}`, 'green');
    log(`  Precio: $${listingData.pricePerToken} por token`, 'cyan');
    log(`  Total tokens: ${listingData.tokensForSale}`, 'cyan');
    return result.data.data;
  } else {
    log(`✗ Error creando listing: ${JSON.stringify(result)}`, 'red');
    return null;
  }
}

async function initializeDemoData() {
  log('\n╔════════════════════════════════════════════════╗', 'blue');
  log('║     INICIALIZACIÓN DE DATOS DE DEMO - BLOCKI  ║', 'blue');
  log('╚════════════════════════════════════════════════╝', 'blue');

  // 1. Crear admin y obtener token
  const token = await createAdminUser();
  if (!token) {
    log('\n❌ No se pudo obtener token de admin, abortando...', 'red');
    return;
  }

  // 2. Crear propiedades de ejemplo
  log('\n' + '='.repeat(50), 'blue');
  log('CREANDO PROPIEDADES', 'blue');
  log('='.repeat(50), 'blue');

  const properties = [
    {
      title: 'Casa en La Molina, Lima',
      description: 'Casa moderna de 3 pisos con jardín y piscina. Zona residencial premium.',
      location: 'La Molina, Lima, Perú',
      totalValue: 450000.0,
      images: [
        'https://images.unsplash.com/photo-1568605114967-8130f3a36994',
        'https://images.unsplash.com/photo-1580587771525-78b9dba3b914',
      ],
    },
    {
      title: 'Departamento en Miraflores',
      description: 'Departamento de lujo con vista al mar. 180m2, 3 dormitorios, 2 baños.',
      location: 'Miraflores, Lima, Perú',
      totalValue: 320000.0,
      images: [
        'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00',
        'https://images.unsplash.com/photo-1512917774080-9991f1c4c750',
      ],
    },
    {
      title: 'Casa de Playa en Asia',
      description: 'Casa de playa con acceso privado. 4 habitaciones, terraza con vista al mar.',
      location: 'Asia, Lima, Perú',
      totalValue: 280000.0,
      images: [
        'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2',
        'https://images.unsplash.com/photo-1564013799919-ab600027ffc6',
      ],
    },
  ];

  const createdProperties = [];
  for (const propData of properties) {
    const property = await createProperty(token, propData);
    if (property) {
      createdProperties.push(property);
    }
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  // 3. Tokenizar propiedades
  log('\n' + '='.repeat(50), 'blue');
  log('TOKENIZANDO PROPIEDADES', 'blue');
  log('='.repeat(50), 'blue');

  const tokenizedProperties = [];
  for (let i = 0; i < createdProperties.length; i++) {
    const property = createdProperties[i];
    const tokenizationData = {
      tokenName: `PROP${i + 1}`,
      tokenSymbol: `P${i + 1}`,
      totalSupply: 10000, // 10,000 tokens = 100% de la propiedad
      pricePerToken: property.totalValue / 10000,
    };

    const tokenized = await tokenizeProperty(token, property.id, tokenizationData);
    if (tokenized) {
      tokenizedProperties.push({ ...property, tokenized });
    }
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  // 4. Crear listings
  log('\n' + '='.repeat(50), 'blue');
  log('CREANDO LISTINGS EN MARKETPLACE', 'blue');
  log('='.repeat(50), 'blue');

  for (const property of tokenizedProperties) {
    const listingData = {
      propertyId: property.id,
      tokensForSale: 2500, // 25% de la propiedad
      pricePerToken: property.totalValue / 10000,
    };

    await createListing(token, listingData);
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  // Resumen final
  log('\n╔════════════════════════════════════════════════╗', 'blue');
  log('║              RESUMEN DE INICIALIZACIÓN         ║', 'blue');
  log('╚════════════════════════════════════════════════╝', 'blue');

  log(`\n✅ Propiedades creadas: ${createdProperties.length}`, 'green');
  log(`✅ Propiedades tokenizadas: ${tokenizedProperties.length}`, 'green');

  log('\n🎉 INICIALIZACIÓN COMPLETA!', 'green');
  log('\nAhora puedes:', 'cyan');
  log('  1. Ver las propiedades: GET /properties', 'yellow');
  log('  2. Ver los listings: GET /marketplace/listings', 'yellow');
  log('  3. Comprar fracciones (25%): POST /marketplace/listings/buy', 'yellow');

  log('\n👤 Credenciales Admin:', 'cyan');
  log('  Email: admin@blocki.com', 'yellow');
  log('  Password: Admin123!', 'yellow');
  log(`  Token: ${token.substring(0, 50)}...\n`, 'yellow');

  log('📝 Ejemplo de compra:', 'cyan');
  log(`
curl -X POST http://localhost:4000/marketplace/listings/buy \\
  -H "Authorization: Bearer ${token.substring(0, 50)}..." \\
  -H "Content-Type: application/json" \\
  -d '{
    "listingId": 1,
    "tokensAmount": 2500,
    "buyerAddress": "TU_STELLAR_ADDRESS"
  }'
  `, 'yellow');
}

// Ejecutar
initializeDemoData().catch(error => {
  log(`\n❌ Error fatal: ${error.message}`, 'red');
  console.error(error);
  process.exit(1);
});
