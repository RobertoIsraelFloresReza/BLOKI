import { Injectable, Logger, BadRequestException } from '@nestjs/common';
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
import { SwapQuoteDto, SwapQuoteResponseDto } from './dto/swap-quote.dto';
import { ExecuteSwapDto, ExecuteSwapResponseDto } from './dto/execute-swap.dto';

@Injectable()
export class SoroswapService {
  private readonly logger = new Logger(SoroswapService.name);
  private server: rpc.Server;
  private networkPassphrase: string;
  private marketplaceContractId: string;
  private soroswapRouterAddress: string;

  constructor(private configService: ConfigService) {
    const rpcUrl = this.configService.get<string>('STELLAR_RPC_URL') || 'https://soroban-testnet.stellar.org';
    this.server = new rpc.Server(rpcUrl);
    this.networkPassphrase = this.configService.get<string>(
      'STELLAR_NETWORK_PASSPHRASE',
    ) || 'Test SDF Network ; September 2015';
    this.marketplaceContractId = this.configService.get<string>(
      'MARKETPLACE_CONTRACT_ID',
    ) || '';

    // Soroswap Router testnet address
    this.soroswapRouterAddress =
      this.configService.get<string>('SOROSWAP_ROUTER_ADDRESS') ||
      'CCMAPXWVZD4USEKDWRYS7DA4Y3D7E2SDMGBFJUCEXTC7VN6CUBGWPFUS';
  }

  /**
   * Get a swap quote without executing the transaction
   */
  async getSwapQuote(
    dto: SwapQuoteDto,
  ): Promise<SwapQuoteResponseDto> {
    try {
      this.logger.log(
        `Getting swap quote: ${dto.amountIn} tokens from ${dto.propertyToken} to ${dto.targetToken}`,
      );

      // Call marketplace contract's get_swap_quote function
      const contract = new Contract(this.marketplaceContractId);
      const propertyTokenAddress = new Address(dto.propertyToken);
      const targetTokenAddress = new Address(dto.targetToken);

      // Convert amount to i128 with 7 decimals
      const amountInStroops = Math.floor(dto.amountIn * 10000000);

      // Create a temporary keypair for simulation (view-only call)
      const tempKeypair = Keypair.random();
      const sourceAccount = await this.server.getAccount(
        tempKeypair.publicKey(),
      );

      const transaction = new TransactionBuilder(sourceAccount, {
        fee: BASE_FEE,
        networkPassphrase: this.networkPassphrase,
      })
        .addOperation(
          contract.call(
            'get_swap_quote',
            propertyTokenAddress.toScVal(),
            targetTokenAddress.toScVal(),
            nativeToScVal(amountInStroops, { type: 'i128' }),
          ),
        )
        .setTimeout(30)
        .build();

      // Simulate the transaction to get quote
      const simulatedTx = await this.server.simulateTransaction(transaction);

      if (
        'result' in simulatedTx &&
        simulatedTx.result &&
        'retval' in simulatedTx.result
      ) {
        const amountOutStroops = scValToNative(simulatedTx.result.retval);
        const amountOut = amountOutStroops / 10000000;

        // Calculate price impact
        const priceImpact = this.calculatePriceImpact(dto.amountIn, amountOut);

        return {
          amountOut,
          path: [dto.propertyToken, dto.targetToken],
          priceImpact,
          slippage: this.configService.get<number>(
            'SOROSWAP_SLIPPAGE_TOLERANCE',
          ) || 0.5,
        };
      }

      throw new Error('Failed to get swap quote from contract');
    } catch (error) {
      this.logger.error(`Error getting swap quote: ${error.message}`);
      throw new BadRequestException(
        `Failed to get swap quote: ${error.message}`,
      );
    }
  }

  /**
   * Execute a swap transaction
   */
  async executeSwap(
    dto: ExecuteSwapDto,
  ): Promise<ExecuteSwapResponseDto> {
    try {
      this.logger.log(
        `Executing swap: ${dto.amountIn} tokens from ${dto.propertyToken} to ${dto.targetToken}`,
      );

      const sellerKeypair = Keypair.fromSecret(dto.sellerSecretKey);
      const sourceAccount = await this.server.getAccount(
        sellerKeypair.publicKey(),
      );

      const contract = new Contract(this.marketplaceContractId);
      const sellerAddress = new Address(sellerKeypair.publicKey());
      const propertyTokenAddress = new Address(dto.propertyToken);
      const targetTokenAddress = new Address(dto.targetToken);

      // Convert amounts to i128 with 7 decimals
      const amountInStroops = Math.floor(dto.amountIn * 10000000);
      const minAmountOutStroops = Math.floor(dto.minAmountOut * 10000000);

      const transaction = new TransactionBuilder(sourceAccount, {
        fee: BASE_FEE,
        networkPassphrase: this.networkPassphrase,
      })
        .addOperation(
          contract.call(
            'swap_tokens_for_usdc',
            sellerAddress.toScVal(),
            propertyTokenAddress.toScVal(),
            targetTokenAddress.toScVal(),
            nativeToScVal(amountInStroops, { type: 'i128' }),
            nativeToScVal(minAmountOutStroops, { type: 'i128' }),
          ),
        )
        .setTimeout(300)
        .build();

      // Prepare and sign transaction
      const preparedTx = await this.server.prepareTransaction(transaction);
      preparedTx.sign(sellerKeypair);

      // Send transaction
      const result = await this.server.sendTransaction(preparedTx);

      // Wait for confirmation
      const confirmedTx = await this.pollTransactionStatus(result.hash);

      if (confirmedTx.status === 'SUCCESS' && confirmedTx.returnValue) {
        const amountOutStroops = scValToNative(confirmedTx.returnValue);
        const amountOut = amountOutStroops / 10000000;

        this.logger.log(
          `Swap executed successfully: ${result.hash}, received ${amountOut} USDC`,
        );

        return {
          transactionId: result.hash,
          amountOut,
          success: true,
        };
      }

      throw new Error('Swap transaction failed');
    } catch (error) {
      this.logger.error(`Error executing swap: ${error.message}`);
      throw new BadRequestException(`Failed to execute swap: ${error.message}`);
    }
  }

  /**
   * Calculate price impact percentage
   */
  private calculatePriceImpact(amountIn: number, amountOut: number): number {
    // Simplified price impact calculation
    // In production, this would use pool reserves and AMM formulas
    const expectedRate = 1; // 1:1 for simplicity
    const actualRate = amountOut / amountIn;
    const impact = ((expectedRate - actualRate) / expectedRate) * 100;
    return Math.abs(parseFloat(impact.toFixed(2)));
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

    throw new Error(
      `Transaction ${hash} not found after ${maxAttempts} attempts`,
    );
  }
}
