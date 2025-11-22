const StellarSdk = require('@stellar/stellar-sdk');
const { Server } = require('@stellar/stellar-sdk/rpc');
require('dotenv').config();

const MARKETPLACE_ID = process.env.MARKETPLACE_CONTRACT_ID;
const ADMIN_PUBLIC = process.env.PLATFORM_PUBLIC_KEY;
const PLATFORM_SECRET = process.env.PLATFORM_SECRET_KEY;
const ESCROW_ID = process.env.ESCROW_CONTRACT_ID;
const REGISTRY_ID = process.env.REGISTRY_CONTRACT_ID;

async function initMarketplace() {
  console.log('🚀 Inicializando Marketplace contract...');
  console.log('Marketplace ID:', MARKETPLACE_ID);
  console.log('Admin Public:', ADMIN_PUBLIC);
  console.log('Escrow ID:', ESCROW_ID);
  console.log('Registry ID:', REGISTRY_ID);

  const server = new Server('https://soroban-testnet.stellar.org');
  const platformKeypair = StellarSdk.Keypair.fromSecret(PLATFORM_SECRET);

  // Create ScVal addresses using new Address constructor
  console.log('\n📝 Creating admin address...');
  const adminAddr = new StellarSdk.Address(ADMIN_PUBLIC).toScVal();

  console.log('📝 Decoding escrow contract...');
  const escrowAddr = StellarSdk.xdr.ScVal.scvAddress(
    StellarSdk.xdr.ScAddress.scAddressTypeContract(
      StellarSdk.StrKey.decodeContract(ESCROW_ID)
    )
  );

  console.log('📝 Decoding registry contract...');
  const registryAddr = StellarSdk.xdr.ScVal.scvAddress(
    StellarSdk.xdr.ScAddress.scAddressTypeContract(
      StellarSdk.StrKey.decodeContract(REGISTRY_ID)
    )
  );
  
  const contract = new StellarSdk.Contract(MARKETPLACE_ID);
  const operation = contract.call('initialize', adminAddr, escrowAddr, registryAddr);
  
  const account = await server.getAccount(platformKeypair.publicKey());
  const transaction = new StellarSdk.TransactionBuilder(account, {
    fee: '1000000',
    networkPassphrase: StellarSdk.Networks.TESTNET
  })
    .addOperation(operation)
    .setTimeout(300)
    .build();
  
  console.log('📝 Preparando transacción...');
  const prepared = await server.prepareTransaction(transaction);

  console.log('✍️  Firmando transacción...');
  prepared.sign(platformKeypair);
  
  const result = await server.sendTransaction(prepared);
  console.log(`📤 Transacción enviada: ${result.hash}`);
  
  // Wait for confirmation
  console.log('⏳ Esperando confirmación...');
  let status;
  let attempts = 0;
  do {
    await new Promise(resolve => setTimeout(resolve, 2000));
    status = await server.getTransaction(result.hash);
    attempts++;
    if (attempts > 30) {
      console.error('❌ Timeout');
      process.exit(1);
    }
  } while (status.status === 'NOT_FOUND');
  
  if (status.status === 'SUCCESS') {
    console.log('✅ Marketplace inicializado!');
  } else {
    console.error('❌ Error:', status);
    process.exit(1);
  }
}

initMarketplace().catch(err => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
