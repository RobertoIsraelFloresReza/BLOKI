/**
 * Script para verificar si Friendbot está funcionando
 * y si las cuentas tienen fondos
 */

const axios = require('axios');
const fs = require('fs');

async function checkFriendbot() {
  // Leer usuario del test anterior
  const authData = JSON.parse(fs.readFileSync('.test-auth-data.json', 'utf-8'));
  const publicKey = authData.user.stellarPublicKey;

  console.log(`\n🔍 Verificando cuenta: ${publicKey}`);

  try {
    // 1. Verificar si la cuenta existe en Horizon
    console.log('\n1️⃣ Verificando en Horizon...');
    const horizonResponse = await axios.get(`https://horizon-testnet.stellar.org/accounts/${publicKey}`);

    console.log('✅ Cuenta encontrada en Horizon');
    console.log(`   Balances:`);
    horizonResponse.data.balances.forEach(balance => {
      console.log(`   - ${balance.asset_type === 'native' ? 'XLM' : balance.asset_code}: ${balance.balance}`);
    });

  } catch (error) {
    if (error.response?.status === 404) {
      console.log('⚠️  Cuenta NO existe en Horizon');
      console.log('\n2️⃣ Intentando fondear con Friendbot...');

      try {
        await axios.get(`https://friendbot.stellar.org?addr=${publicKey}`);
        console.log('✅ Cuenta fondeada exitosamente!');

        // Esperar un momento y verificar de nuevo
        await new Promise(resolve => setTimeout(resolve, 3000));
        const checkAgain = await axios.get(`https://horizon-testnet.stellar.org/accounts/${publicKey}`);
        console.log(`   Balance XLM: ${checkAgain.data.balances[0].balance}`);

      } catch (friendbotError) {
        console.log('❌ Error al fondear con Friendbot:', friendbotError.message);
      }
    } else {
      console.log('❌ Error:', error.message);
    }
  }
}

checkFriendbot();
