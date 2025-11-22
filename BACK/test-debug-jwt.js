/**
 * Script para debug del JWT token
 */

const fs = require('fs');
const jwt = require('jsonwebtoken');

try {
  const authData = JSON.parse(fs.readFileSync('.test-auth-data.json', 'utf-8'));

  console.log('\n🔍 TOKEN JWT:');
  console.log(authData.token);

  console.log('\n📦 PAYLOAD DECODED:');
  const decoded = jwt.decode(authData.token);
  console.log(JSON.stringify(decoded, null, 2));

  console.log('\n✅ Campos disponibles en JWT:');
  Object.keys(decoded).forEach(key => {
    console.log(`   - ${key}: ${decoded[key]}`);
  });

  if (!decoded.stellarPublicKey && !decoded.walletAddress) {
    console.log('\n⚠️  WARNING: JWT no tiene stellarPublicKey ni walletAddress!');
  }

} catch (error) {
  console.error('Error:', error.message);
}
