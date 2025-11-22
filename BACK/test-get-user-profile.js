/**
 * Script para verificar el perfil del usuario y su Stellar Public Key
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
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function checkUserProfile() {
  try {
    const authData = JSON.parse(fs.readFileSync('.test-auth-data.json', 'utf-8'));

    log('\n🔍 Verificando perfil del usuario...', 'cyan');

    const response = await axios.get(`${API_BASE_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${authData.token}`,
      },
    });

    const apiData = response.data.data || response.data;

    log('\n✅ Perfil del usuario:', 'green');
    console.log(JSON.stringify(apiData, null, 2));

    if (!apiData.stellarPublicKey) {
      log('\n⚠️  WARNING: El usuario NO tiene stellarPublicKey!', 'red');
      log('   Esto causará problemas al crear propiedades', 'red');
    } else {
      log(`\n✅ Stellar Public Key encontrado: ${apiData.stellarPublicKey}`, 'green');
    }

  } catch (error) {
    log('❌ Error:', 'red');
    console.error(error.response?.data || error.message);
  }
}

checkUserProfile();
