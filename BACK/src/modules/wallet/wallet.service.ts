import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as StellarSdk from '@stellar/stellar-sdk';

@Injectable()
export class WalletService {
  private readonly logger = new Logger(WalletService.name);
  private readonly horizonUrl: string;
  private readonly server: StellarSdk.Horizon.Server;

  constructor(private configService: ConfigService) {
    this.horizonUrl =
      this.configService.get<string>('HORIZON_URL') ||
      'https://horizon-testnet.stellar.org';
    this.server = new StellarSdk.Horizon.Server(this.horizonUrl);
  }

  async getBalance(publicKey: string) {
    try {
      this.logger.log(`Fetching balance for account: ${publicKey}`);

      const account = await this.server.loadAccount(publicKey);

      const nativeBalance = account.balances.find(
        (b) => b.asset_type === 'native',
      );

      const assetBalances = account.balances
        .filter((b) => b.asset_type !== 'native')
        .map((b: any) => ({
          assetCode: b.asset_code,
          assetIssuer: b.asset_issuer,
          balance: b.balance,
          limit: b.limit,
        }));

      return {
        publicKey,
        nativeBalance: nativeBalance ? (nativeBalance as any).balance : '0',
        assets: assetBalances,
        sequence: account.sequence,
      };
    } catch (error) {
      if (error.response && error.response.status === 404) {
        throw new NotFoundException(
          `Account ${publicKey} not found on Stellar network. It may need to be funded.`,
        );
      }
      this.logger.error(`Failed to fetch balance for ${publicKey}:`, error);
      throw error;
    }
  }

  async getTransactions(publicKey: string, page: number, limit: number) {
    try {
      this.logger.log(
        `Fetching transactions for ${publicKey} (page: ${page}, limit: ${limit})`,
      );

      // Calculate cursor for pagination
      const offset = (page - 1) * limit;

      // Fetch transactions from Horizon
      const transactionsPage = await this.server
        .transactions()
        .forAccount(publicKey)
        .order('desc')
        .limit(limit)
        .call();

      const transactions = transactionsPage.records.map((tx: any) => ({
        id: tx.id,
        hash: tx.hash,
        ledger: tx.ledger_attr,
        createdAt: tx.created_at,
        sourceAccount: tx.source_account,
        feePaid: tx.fee_charged,
        operationCount: tx.operation_count,
        successful: tx.successful,
        memoType: tx.memo_type,
        memo: tx.memo,
      }));

      // Get total count (approximate based on account data)
      const account = await this.server.loadAccount(publicKey);
      // Note: Horizon doesn't provide exact transaction count, so we estimate
      const total = transactions.length < limit ? offset + transactions.length : offset + limit + 1;

      return {
        data: transactions,
        meta: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      if (error.response && error.response.status === 404) {
        throw new NotFoundException(
          `Account ${publicKey} not found on Stellar network`,
        );
      }
      this.logger.error(
        `Failed to fetch transactions for ${publicKey}:`,
        error,
      );
      throw error;
    }
  }
}
