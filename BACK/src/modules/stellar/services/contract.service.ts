import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  Contract,
  Address,
  nativeToScVal,
  scValToNative,
  TransactionBuilder,
  BASE_FEE,
  Keypair,
  rpc,
} from '@stellar/stellar-sdk';

export interface DeployPropertyTokenDto {
  propertyId: string;
  totalSupply: number;
  owner: string;
}

export interface MintTokensDto {
  contractId: string;
  to: string;
  amount: number;
  percentage: number;
}

export interface CreateListingDto {
  tokenContractId: string;
  tokensAmount: number;
  pricePerToken: number;
}

@Injectable()
export class ContractService {
  private readonly logger = new Logger(ContractService.name);
  private server: rpc.Server;
  private networkPassphrase: string;
  private platformKeypair: Keypair;

  // Contract IDs (will be populated from env)
  private deployerContractId: string;
  private marketplaceContractId: string;
  private escrowContractId: string;
  private registryContractId: string;

  constructor(private configService: ConfigService) {
    const rpcUrl = this.configService.get<string>('STELLAR_RPC_URL') || 'https://soroban-testnet.stellar.org:443';
    this.server = new rpc.Server(rpcUrl);
    this.networkPassphrase = this.configService.get<string>(
      'STELLAR_NETWORK_PASSPHRASE',
    ) || 'Test SDF Network ; September 2015';

    // Initialize platform keypair
    const platformSecret = this.configService.get<string>(
      'PLATFORM_SECRET_KEY',
    );
    if (platformSecret) {
      this.platformKeypair = Keypair.fromSecret(platformSecret);
    }

    // Load contract IDs
    this.deployerContractId = this.configService.get<string>(
      'PROPERTY_TOKEN_DEPLOYER_ID',
    ) || '';
    this.marketplaceContractId = this.configService.get<string>(
      'MARKETPLACE_CONTRACT_ID',
    ) || '';
    this.escrowContractId = this.configService.get<string>(
      'ESCROW_CONTRACT_ID',
    ) || '';
    this.registryContractId = this.configService.get<string>(
      'REGISTRY_CONTRACT_ID',
    ) || '';
  }

  /**
   * Deploy a new PropertyToken contract using the deployer
   */
  async deployPropertyToken(
    dto: DeployPropertyTokenDto,
  ): Promise<string> {
    try {
      if (!this.deployerContractId) {
        throw new Error('Deployer contract ID not configured');
      }

      this.logger.log(
        `Deploying PropertyToken for property ${dto.propertyId}`,
      );

      const sourceAccount = await this.server.getAccount(
        this.platformKeypair.publicKey(),
      );

      const contract = new Contract(this.deployerContractId);

      // Generate salt for unique deployment
      const salt = Buffer.from(dto.propertyId).toString('hex');

      const transaction = new TransactionBuilder(sourceAccount, {
        fee: BASE_FEE,
        networkPassphrase: this.networkPassphrase,
      })
        .addOperation(
          contract.call(
            'deploy_property_token',
            nativeToScVal(dto.propertyId, { type: 'string' }),
            nativeToScVal(salt, { type: 'bytes' }),
          ),
        )
        .setTimeout(300)
        .build();

      const preparedTx = await this.server.prepareTransaction(transaction);
      preparedTx.sign(this.platformKeypair);

      const result = await this.server.sendTransaction(preparedTx);

      // Wait for confirmation
      const confirmedTx = await this.pollTransactionStatus(result.hash);

      // Extract contract ID from result
      if (confirmedTx.status === 'SUCCESS' && confirmedTx.returnValue) {
        const contractId = scValToNative(confirmedTx.returnValue);
        this.logger.log(
          `PropertyToken deployed successfully: ${contractId}`,
        );
        return contractId;
      }

      throw new Error('Failed to deploy PropertyToken contract');
    } catch (error) {
      this.logger.error(
        `Failed to deploy PropertyToken: ${error.message}`,
      );
      throw error;
    }
  }

  /**
   * Mint tokens to an address
   */
  async mintTokens(dto: MintTokensDto): Promise<string> {
    try {
      this.logger.log(
        `Minting ${dto.amount} tokens to ${dto.to} on contract ${dto.contractId}`,
      );

      const sourceAccount = await this.server.getAccount(
        this.platformKeypair.publicKey(),
      );

      const contract = new Contract(dto.contractId);
      const toAddress = new Address(dto.to);

      const transaction = new TransactionBuilder(sourceAccount, {
        fee: BASE_FEE,
        networkPassphrase: this.networkPassphrase,
      })
        .addOperation(
          contract.call(
            'mint',
            toAddress.toScVal(),
            nativeToScVal(dto.amount, { type: 'i128' }),
            nativeToScVal(dto.percentage, { type: 'u32' }),
          ),
        )
        .setTimeout(300)
        .build();

      const preparedTx = await this.server.prepareTransaction(transaction);
      preparedTx.sign(this.platformKeypair);

      const result = await this.server.sendTransaction(preparedTx);
      const confirmedTx = await this.pollTransactionStatus(result.hash);

      if (confirmedTx.status === 'SUCCESS') {
        this.logger.log(`Tokens minted successfully: ${result.hash}`);
        return result.hash;
      }

      throw new Error('Failed to mint tokens');
    } catch (error) {
      this.logger.error(`Failed to mint tokens: ${error.message}`);
      throw error;
    }
  }

  /**
   * Create a marketplace listing
   */
  async createListing(dto: CreateListingDto): Promise<number> {
    try {
      if (!this.marketplaceContractId) {
        throw new Error('Marketplace contract ID not configured');
      }

      this.logger.log(
        `Creating listing for ${dto.tokensAmount} tokens at ${dto.pricePerToken} USDC each`,
      );

      const sourceAccount = await this.server.getAccount(
        this.platformKeypair.publicKey(),
      );

      const contract = new Contract(this.marketplaceContractId);

      const transaction = new TransactionBuilder(sourceAccount, {
        fee: BASE_FEE,
        networkPassphrase: this.networkPassphrase,
      })
        .addOperation(
          contract.call(
            'list_property',
            nativeToScVal(dto.tokenContractId, { type: 'address' }),
            nativeToScVal(dto.tokensAmount, { type: 'u32' }),
            nativeToScVal(dto.pricePerToken, { type: 'i128' }),
          ),
        )
        .setTimeout(300)
        .build();

      const preparedTx = await this.server.prepareTransaction(transaction);
      preparedTx.sign(this.platformKeypair);

      const result = await this.server.sendTransaction(preparedTx);
      const confirmedTx = await this.pollTransactionStatus(result.hash);

      if (confirmedTx.status === 'SUCCESS' && confirmedTx.returnValue) {
        const listingId = scValToNative(confirmedTx.returnValue);
        this.logger.log(`Listing created successfully: ${listingId}`);
        return listingId;
      }

      throw new Error('Failed to create listing');
    } catch (error) {
      this.logger.error(`Failed to create listing: ${error.message}`);
      throw error;
    }
  }

  /**
   * Lock funds in escrow
   */
  async lockEscrow(
    buyer: string,
    amount: number,
    listingId: number,
  ): Promise<string> {
    try {
      if (!this.escrowContractId) {
        throw new Error('Escrow contract ID not configured');
      }

      this.logger.log(
        `Locking ${amount} USDC in escrow for listing ${listingId}`,
      );

      const sourceAccount = await this.server.getAccount(
        this.platformKeypair.publicKey(),
      );

      const contract = new Contract(this.escrowContractId);
      const buyerAddress = new Address(buyer);

      const transaction = new TransactionBuilder(sourceAccount, {
        fee: BASE_FEE,
        networkPassphrase: this.networkPassphrase,
      })
        .addOperation(
          contract.call(
            'lock_funds',
            buyerAddress.toScVal(),
            nativeToScVal(amount, { type: 'i128' }),
            nativeToScVal(listingId, { type: 'u64' }),
          ),
        )
        .setTimeout(300)
        .build();

      const preparedTx = await this.server.prepareTransaction(transaction);
      preparedTx.sign(this.platformKeypair);

      const result = await this.server.sendTransaction(preparedTx);
      const confirmedTx = await this.pollTransactionStatus(result.hash);

      if (confirmedTx.status === 'SUCCESS') {
        this.logger.log(`Funds locked in escrow: ${result.hash}`);
        return result.hash;
      }

      throw new Error('Failed to lock funds in escrow');
    } catch (error) {
      this.logger.error(`Failed to lock escrow: ${error.message}`);
      throw error;
    }
  }

  /**
   * Buy tokens from marketplace
   */
  async buyTokens(listingId: number, amount: number): Promise<string> {
    try {
      if (!this.marketplaceContractId) {
        throw new Error('Marketplace contract ID not configured');
      }

      this.logger.log(
        `Buying ${amount} tokens from listing ${listingId}`,
      );

      const sourceAccount = await this.server.getAccount(
        this.platformKeypair.publicKey(),
      );

      const contract = new Contract(this.marketplaceContractId);

      const transaction = new TransactionBuilder(sourceAccount, {
        fee: BASE_FEE,
        networkPassphrase: this.networkPassphrase,
      })
        .addOperation(
          contract.call(
            'buy_tokens',
            nativeToScVal(listingId, { type: 'u64' }),
            nativeToScVal(amount, { type: 'u32' }),
          ),
        )
        .setTimeout(300)
        .build();

      const preparedTx = await this.server.prepareTransaction(transaction);
      preparedTx.sign(this.platformKeypair);

      const result = await this.server.sendTransaction(preparedTx);
      const confirmedTx = await this.pollTransactionStatus(result.hash);

      if (confirmedTx.status === 'SUCCESS') {
        this.logger.log(`Tokens purchased successfully: ${result.hash}`);
        return result.hash;
      }

      throw new Error('Failed to buy tokens');
    } catch (error) {
      this.logger.error(`Failed to buy tokens: ${error.message}`);
      throw error;
    }
  }

  /**
   * Poll transaction status until confirmed
   */
  private async pollTransactionStatus(
    hash: string,
  ): Promise<rpc.Api.GetTransactionResponse> {
    let attempts = 0;
    const maxAttempts = 20;

    while (attempts < maxAttempts) {
      const response = await this.server.getTransaction(hash);

      if (response.status !== 'NOT_FOUND') {
        return response;
      }

      await new Promise((resolve) => setTimeout(resolve, 1000));
      attempts++;
    }

    throw new Error(`Transaction ${hash} not found after ${maxAttempts} attempts`);
  }
}
