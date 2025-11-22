import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as StellarSdk from '@stellar/stellar-sdk';
import { Server as SorobanServer } from '@stellar/stellar-sdk/rpc';

@Injectable()
export class StellarService {
  private readonly logger = new Logger(StellarService.name);
  private rpcUrl: string;
  private networkPassphrase: string;
  private server: any;
  private readonly CONTRACTS: {
    PROPERTY_TOKEN: string;
    ESCROW: string;
    REGISTRY: string;
    MARKETPLACE: string;
    DEPLOYER: string;
  };
  private platformKeypair: StellarSdk.Keypair;

  constructor(private configService: ConfigService) {
    this.rpcUrl = this.configService.get<string>('STELLAR_RPC_URL') || 'https://soroban-testnet.stellar.org';
    this.networkPassphrase = this.configService.get<string>('STELLAR_NETWORK_PASSPHRASE') || StellarSdk.Networks.TESTNET;
    this.server = new SorobanServer(this.rpcUrl);

    this.CONTRACTS = {
      PROPERTY_TOKEN: this.configService.get<string>('PROPERTY_TOKEN_CONTRACT_ID') || '',
      ESCROW: this.configService.get<string>('ESCROW_CONTRACT_ID') || '',
      REGISTRY: this.configService.get<string>('REGISTRY_CONTRACT_ID') || '',
      MARKETPLACE: this.configService.get<string>('MARKETPLACE_CONTRACT_ID') || '',
      DEPLOYER: this.configService.get<string>('DEPLOYER_CONTRACT_ID') || '',
    };

    // Initialize platform keypair for deployer operations
    const platformSecretKey = this.configService.get<string>('PLATFORM_SECRET_KEY');
    if (platformSecretKey) {
      this.platformKeypair = StellarSdk.Keypair.fromSecret(platformSecretKey);
      this.logger.log(`Platform account loaded: ${this.platformKeypair.publicKey()}`);
    }
  }

  generateKeypair(): { publicKey: string; secretKey: string } {
    const keypair = StellarSdk.Keypair.random();
    return { publicKey: keypair.publicKey(), secretKey: keypair.secret() };
  }

  async fundAccount(publicKey: string): Promise<boolean> {
    try {
      this.logger.log(`Funding account ${publicKey} with Friendbot`);
      const response = await fetch(`https://friendbot.stellar.org?addr=${encodeURIComponent(publicKey)}`);
      if (response.ok) {
        this.logger.log(`Account ${publicKey} funded successfully`);
        return true;
      }
      throw new Error(`Friendbot failed: ${response.statusText}`);
    } catch (error) {
      this.logger.error(`Failed to fund account ${publicKey}:`, error.message);
      return false;
    }
  }

  private async waitForTransaction(hash: string, maxAttempts = 30): Promise<any> {
    let attempts = 0;
    while (attempts < maxAttempts) {
      const response = await this.server.getTransaction(hash);
      if (response.status !== 'NOT_FOUND') return response;
      await new Promise(resolve => setTimeout(resolve, 1000));
      attempts++;
    }
    throw new Error(`Transaction ${hash} not found after ${maxAttempts} attempts`);
  }

  private async submitTransaction(sourceKeypair: StellarSdk.Keypair, operation: StellarSdk.xdr.Operation): Promise<string> {
    const sourceAccount = await this.server.getAccount(sourceKeypair.publicKey());
    const transaction = new StellarSdk.TransactionBuilder(sourceAccount, {
      fee: '1000000',
      networkPassphrase: this.networkPassphrase,
    }).setTimeout(300).addOperation(operation).build();
    const preparedTx = await this.server.prepareTransaction(transaction);
    preparedTx.sign(sourceKeypair);
    const result = await this.server.sendTransaction(preparedTx);
    if (result.status === 'PENDING') {
      const txResponse = await this.waitForTransaction(result.hash);
      if (txResponse.status === 'SUCCESS') {
        this.logger.log(`Transaction successful: ${result.hash}`);
        return result.hash;
      }
      throw new Error(`Transaction failed: ${txResponse.status}`);
    }
    throw new Error(`Transaction error: ${result.status}`);
  }

  private async simulateCall(contractId: string, method: string, ...args: StellarSdk.xdr.ScVal[]): Promise<any> {
    const contract = new StellarSdk.Contract(contractId);
    const dummyAccount = await this.server.getAccount('GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWHF');
    const transaction = new StellarSdk.TransactionBuilder(dummyAccount, {
      fee: '100',
      networkPassphrase: this.networkPassphrase,
    }).addOperation(contract.call(method, ...args)).setTimeout(300).build();
    const simulated: any = await this.server.simulateTransaction(transaction);
    if (simulated.results && simulated.results.length > 0) {
      return StellarSdk.scValToNative(simulated.results[0].retval);
    }
    throw new Error('Simulation failed');
  }

  async deployPropertyToken(adminSecretKey: string, propertyId: number, name: string, symbol: string, totalSupply: number): Promise<{ txHash: string; contractId: string }> {
    try {
      const adminKeypair = StellarSdk.Keypair.fromSecret(adminSecretKey);

      // Verify platform keypair is initialized
      if (!this.platformKeypair) {
        this.logger.error('Platform keypair is not initialized. Check PLATFORM_SECRET_KEY in .env');
        throw new Error('Platform keypair is not configured');
      }

      // Generate random salt (32 bytes)
      const saltSource = `${propertyId}-${Date.now()}-${Math.random()}`;
      const salt = StellarSdk.hash(Buffer.from(saltSource));

      // Deploy contract with only property_id (as Symbol) and salt
      // IMPORTANT: Use platform keypair as it's the admin of the Deployer contract
      const deployOperation = new StellarSdk.Contract(this.CONTRACTS.DEPLOYER).call(
        'deploy_property_token',
        StellarSdk.nativeToScVal(`PROP${propertyId}`, { type: 'symbol' }),
        StellarSdk.xdr.ScVal.scvBytes(salt)
      );

      this.logger.log(`Deploying with platform account: ${this.platformKeypair.publicKey()}`);
      const deployTxHash = await this.submitTransaction(this.platformKeypair, deployOperation);
      this.logger.log(`Deploy transaction submitted: ${deployTxHash}`);

      // Get the deployed contract address from transaction result
      const txResponse = await this.server.getTransaction(deployTxHash);
      let deployedAddress: string;

      if (txResponse.returnValue) {
        // Extract the address from the return value
        const returnVal = txResponse.returnValue;
        deployedAddress = StellarSdk.Address.fromScVal(returnVal).toString();
        this.logger.log(`Deployed contract address: ${deployedAddress}`);
      } else {
        throw new Error('No return value from deploy transaction');
      }

      // Initialize the deployed contract
      // NOTE: The PropertyToken contract automatically mints all tokens to the admin during initialization
      // This follows a decentralized pattern where a single transaction signed by the user creates and mints tokens
      this.logger.log('Initializing deployed contract...');
      const initTxHash = await this.initializePropertyToken(
        adminSecretKey,
        deployedAddress,
        propertyId,
        name,
        symbol,
        totalSupply
      );
      this.logger.log(`Initialization transaction: ${initTxHash}`);
      this.logger.log(`All ${totalSupply} tokens automatically minted to admin during initialization`);

      return { txHash: initTxHash, contractId: deployedAddress };
    } catch (error) {
      this.logger.error('Failed to deploy PropertyToken:', error);
      throw error;
    }
  }

  async initializePropertyToken(adminSecretKey: string, contractId: string, propertyId: number, name: string, symbol: string, totalSupply: number): Promise<string> {
    const adminKeypair = StellarSdk.Keypair.fromSecret(adminSecretKey);
    const operation = new StellarSdk.Contract(contractId).call('initialize', new StellarSdk.Address(adminKeypair.publicKey()).toScVal(), StellarSdk.nativeToScVal(`PROP${propertyId}`, { type: 'symbol' }), StellarSdk.nativeToScVal(name, { type: 'string' }), StellarSdk.nativeToScVal(symbol, { type: 'string' }), StellarSdk.nativeToScVal(totalSupply * 10000000, { type: 'i128' }));
    return await this.submitTransaction(adminKeypair, operation);
  }

  async mintPropertyTokens(adminSecretKey: string, contractId: string, toAddress: string, amount: number, percentage: number): Promise<string> {
    const adminKeypair = StellarSdk.Keypair.fromSecret(adminSecretKey);
    const operation = new StellarSdk.Contract(contractId).call(
      'mint',
      new StellarSdk.Address(toAddress).toScVal(),
      StellarSdk.nativeToScVal(amount * 10000000, { type: 'i128' }),
      StellarSdk.nativeToScVal(percentage, { type: 'i128' })
    );
    return await this.submitTransaction(adminKeypair, operation);
  }

  async transferPropertyTokens(fromSecretKey: string, contractId: string, toAddress: string, amount: number): Promise<string> {
    const fromKeypair = StellarSdk.Keypair.fromSecret(fromSecretKey);
    const operation = new StellarSdk.Contract(contractId).call('transfer', new StellarSdk.Address(fromKeypair.publicKey()).toScVal(), new StellarSdk.Address(toAddress).toScVal(), StellarSdk.nativeToScVal(amount * 10000000, { type: 'i128' }));
    return await this.submitTransaction(fromKeypair, operation);
  }

  async getTokenBalance(contractId: string, ownerAddress: string): Promise<number> {
    try {
      const result = await this.simulateCall(contractId, 'balance', new StellarSdk.Address(ownerAddress).toScVal());
      return Number(result) / 10000000;
    } catch (error) {
      return 0;
    }
  }

  async getTokenInfo(contractId: string): Promise<{ propertyId: number; name: string; symbol: string; totalSupply: number; decimals: number }> {
    const result = await this.simulateCall(contractId, 'get_info');
    return {
      propertyId: Number(result.property_id),
      name: result.name,
      symbol: result.symbol,
      totalSupply: Number(result.total_supply) / 10000000,
      decimals: Number(result.decimals),
    };
  }

  async createListing(sellerSecretKey: string, tokenContractId: string, amount: number, pricePerToken: number, expirationDays: number): Promise<{ txHash: string; listingId: number }> {
    const sellerKeypair = StellarSdk.Keypair.fromSecret(sellerSecretKey);
    // Call the correct contract method: list_property
    const operation = new StellarSdk.Contract(this.CONTRACTS.MARKETPLACE).call(
      'list_property',
      new StellarSdk.Address(sellerKeypair.publicKey()).toScVal(),
      new StellarSdk.Address(tokenContractId).toScVal(),
      StellarSdk.nativeToScVal(amount * 10000000, { type: 'i128' }),
      StellarSdk.nativeToScVal(Math.round(pricePerToken * 10000000), { type: 'i128' })
    );
    const txHash = await this.submitTransaction(sellerKeypair, operation);

    // Get the listing ID from the transaction result
    const txResponse = await this.server.getTransaction(txHash);
    let listingId: number;

    if (txResponse.returnValue) {
      listingId = Number(StellarSdk.scValToNative(txResponse.returnValue));
      this.logger.log(`Listing created with ID: ${listingId}`);
    } else {
      // Fallback to timestamp if no return value
      listingId = Math.floor(Date.now() / 1000);
    }

    return { txHash, listingId };
  }

  async buyFromListing(buyerSecretKey: string, listingId: number, amount: number, usdcTokenAddress?: string): Promise<string> {
    const buyerKeypair = StellarSdk.Keypair.fromSecret(buyerSecretKey);
    const usdcAddress = usdcTokenAddress || this.configService.get<string>('USDC_MOCK_CONTRACT_ID');

    if (!usdcAddress) {
      throw new Error('USDC contract address not configured');
    }

    this.logger.log(`Buyer ${buyerKeypair.publicKey()} attempting to buy ${amount} tokens from listing ${listingId}`);

    const operation = new StellarSdk.Contract(this.CONTRACTS.MARKETPLACE).call(
      'buy_tokens',
      new StellarSdk.Address(buyerKeypair.publicKey()).toScVal(),
      StellarSdk.nativeToScVal(listingId, { type: 'u64' }),
      StellarSdk.nativeToScVal(amount * 10000000, { type: 'i128' }),
      new StellarSdk.Contract(usdcAddress).address().toScVal()
    );
    return await this.submitTransaction(buyerKeypair, operation);
  }

  /**
   * Mint USDC mock tokens to an address (for testing only)
   * In production, users would acquire USDC through other means
   */
  async mintUsdcMock(toAddress: string, amount: number): Promise<string> {
    const usdcContractId = this.configService.get<string>('USDC_MOCK_CONTRACT_ID');
    if (!usdcContractId) {
      throw new Error('USDC_MOCK_CONTRACT_ID not configured');
    }

    this.logger.log(`Minting ${amount} USDC mock tokens to ${toAddress}`);

    const operation = new StellarSdk.Contract(usdcContractId).call(
      'mint',
      new StellarSdk.Address(toAddress).toScVal(),
      StellarSdk.nativeToScVal(amount * 10000000, { type: 'i128' })
    );

    // Use platform keypair to mint (in this mock, anyone can mint, but we use platform for consistency)
    return await this.submitTransaction(this.platformKeypair, operation);
  }

  /**
   * Approve USDC allowance for marketplace contract
   * This allows the marketplace to transfer USDC from the buyer when purchasing tokens
   */
  async approveUsdcForMarketplace(buyerSecretKey: string, amount: number): Promise<string> {
    const usdcContractId = this.configService.get<string>('USDC_MOCK_CONTRACT_ID');
    if (!usdcContractId) {
      throw new Error('USDC_MOCK_CONTRACT_ID not configured');
    }

    const buyerKeypair = StellarSdk.Keypair.fromSecret(buyerSecretKey);
    const marketplaceAddress = this.CONTRACTS.MARKETPLACE;

    this.logger.log(`Approving ${amount} USDC for marketplace on behalf of ${buyerKeypair.publicKey()}`);

    // Approve with high expiration ledger (1 year ~ 5256000 ledgers)
    const operation = new StellarSdk.Contract(usdcContractId).call(
      'approve',
      new StellarSdk.Address(buyerKeypair.publicKey()).toScVal(),
      new StellarSdk.Contract(marketplaceAddress).address().toScVal(),
      StellarSdk.nativeToScVal(amount * 10000000, { type: 'i128' }),
      StellarSdk.nativeToScVal(5256000, { type: 'u32' })
    );

    return await this.submitTransaction(buyerKeypair, operation);
  }

  async cancelListing(sellerSecretKey: string, listingId: number): Promise<string> {
    const sellerKeypair = StellarSdk.Keypair.fromSecret(sellerSecretKey);
    const operation = new StellarSdk.Contract(this.CONTRACTS.MARKETPLACE).call('cancel_listing', new StellarSdk.Address(sellerKeypair.publicKey()).toScVal(), StellarSdk.nativeToScVal(listingId, { type: 'u64' }));
    return await this.submitTransaction(sellerKeypair, operation);
  }

  async getListingInfo(listingId: number): Promise<{ seller: string; tokenContract: string; amount: number; pricePerToken: number; expiresAt: number; status: string }> {
    const result = await this.simulateCall(this.CONTRACTS.MARKETPLACE, 'get_listing', StellarSdk.nativeToScVal(listingId, { type: 'u64' }));
    return {
      seller: result.seller,
      tokenContract: result.token_contract,
      amount: Number(result.amount) / 10000000,
      pricePerToken: Number(result.price_per_token) / 10000000,
      expiresAt: Number(result.expires_at),
      status: result.status,
    };
  }

  async lockFunds(buyerSecretKey: string, sellerAddress: string, amount: number, lockDurationDays: number): Promise<{ txHash: string; escrowId: number }> {
    const buyerKeypair = StellarSdk.Keypair.fromSecret(buyerSecretKey);
    const unlockTime = Math.floor(Date.now() / 1000) + (lockDurationDays * 24 * 60 * 60);
    const operation = new StellarSdk.Contract(this.CONTRACTS.ESCROW).call('lock_funds', new StellarSdk.Address(buyerKeypair.publicKey()).toScVal(), new StellarSdk.Address(sellerAddress).toScVal(), StellarSdk.nativeToScVal(amount * 10000000, { type: 'i128' }), StellarSdk.nativeToScVal(unlockTime, { type: 'u64' }));
    const txHash = await this.submitTransaction(buyerKeypair, operation);
    return { txHash, escrowId: Math.floor(Date.now() / 1000) };
  }

  async releaseFunds(buyerSecretKey: string, escrowId: number): Promise<string> {
    const buyerKeypair = StellarSdk.Keypair.fromSecret(buyerSecretKey);
    const operation = new StellarSdk.Contract(this.CONTRACTS.ESCROW).call('release_funds', new StellarSdk.Address(buyerKeypair.publicKey()).toScVal(), StellarSdk.nativeToScVal(escrowId, { type: 'u64' }));
    return await this.submitTransaction(buyerKeypair, operation);
  }

  async refundEscrow(sellerSecretKey: string, escrowId: number): Promise<string> {
    const sellerKeypair = StellarSdk.Keypair.fromSecret(sellerSecretKey);
    const operation = new StellarSdk.Contract(this.CONTRACTS.ESCROW).call('refund', new StellarSdk.Address(sellerKeypair.publicKey()).toScVal(), StellarSdk.nativeToScVal(escrowId, { type: 'u64' }));
    return await this.submitTransaction(sellerKeypair, operation);
  }

  async getEscrowInfo(escrowId: number): Promise<{ buyer: string; seller: string; amount: number; unlockTime: number; status: string }> {
    const result = await this.simulateCall(this.CONTRACTS.ESCROW, 'get_escrow', StellarSdk.nativeToScVal(escrowId, { type: 'u64' }));
    return {
      buyer: result.buyer,
      seller: result.seller,
      amount: Number(result.amount) / 10000000,
      unlockTime: Number(result.unlock_time),
      status: result.status,
    };
  }

  async registerProperty(adminSecretKey: string, propertyId: number, legalId: string, ownerAddress: string, valuation: number): Promise<string> {
    const adminKeypair = StellarSdk.Keypair.fromSecret(adminSecretKey);
    const operation = new StellarSdk.Contract(this.CONTRACTS.REGISTRY).call('register_property', new StellarSdk.Address(adminKeypair.publicKey()).toScVal(), StellarSdk.nativeToScVal(propertyId, { type: 'u64' }), StellarSdk.nativeToScVal(legalId, { type: 'string' }), new StellarSdk.Address(ownerAddress).toScVal(), StellarSdk.nativeToScVal(Math.round(valuation * 100), { type: 'i128' }));
    return await this.submitTransaction(adminKeypair, operation);
  }

  async verifyProperty(adminSecretKey: string, propertyId: number): Promise<string> {
    const adminKeypair = StellarSdk.Keypair.fromSecret(adminSecretKey);
    const operation = new StellarSdk.Contract(this.CONTRACTS.REGISTRY).call('verify_property', new StellarSdk.Address(adminKeypair.publicKey()).toScVal(), StellarSdk.nativeToScVal(propertyId, { type: 'u64' }));
    return await this.submitTransaction(adminKeypair, operation);
  }

  async getPropertyFromRegistry(propertyId: number): Promise<{ legalId: string; owner: string; valuation: number; verified: boolean; registeredAt: number }> {
    const result = await this.simulateCall(this.CONTRACTS.REGISTRY, 'get_property', StellarSdk.nativeToScVal(propertyId, { type: 'u64' }));
    return {
      legalId: result.legal_id,
      owner: result.owner,
      valuation: Number(result.valuation) / 100,
      verified: result.verified,
      registeredAt: Number(result.registered_at),
    };
  }

  async isPropertyVerified(propertyId: number): Promise<boolean> {
    try {
      const result = await this.simulateCall(this.CONTRACTS.REGISTRY, 'is_verified', StellarSdk.nativeToScVal(propertyId, { type: 'u64' }));
      return Boolean(result);
    } catch (error) {
      return false;
    }
  }
}
