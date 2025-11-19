import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import {
  AnchorTransactionEntity,
  AnchorTransactionType,
  AnchorTransactionStatus,
} from './entities/anchor-transaction.entity';
import { DepositDto } from './dto/deposit.dto';
import { WithdrawDto } from './dto/withdraw.dto';

interface AssetInfo {
  enabled: boolean;
  fee_fixed?: number;
  fee_percent?: number;
  min_amount?: number;
  max_amount?: number;
  fields?: Record<string, any>;
}

@Injectable()
export class AnchorsService {
  private readonly logger = new Logger(AnchorsService.name);
  private readonly platformAnchorUrl: string;
  private readonly supportedAssets: Map<string, AssetInfo>;

  constructor(
    @InjectRepository(AnchorTransactionEntity)
    private readonly transactionRepository: Repository<AnchorTransactionEntity>,
    private readonly configService: ConfigService,
  ) {
    this.platformAnchorUrl = this.configService.get<string>(
      'PLATFORM_ANCHOR_URL',
      'http://localhost:3000',
    );

    // Initialize supported assets
    this.supportedAssets = new Map([
      [
        'USD',
        {
          enabled: true,
          fee_fixed: 5,
          fee_percent: 0.5,
          min_amount: 10,
          max_amount: 10000,
        },
      ],
      [
        'MXN',
        {
          enabled: true,
          fee_fixed: 50,
          fee_percent: 0.5,
          min_amount: 100,
          max_amount: 100000,
        },
      ],
    ]);
  }

  /**
   * SEP-24: Get anchor info
   */
  getInfo(): any {
    const deposit: Record<string, AssetInfo> = {};
    const withdraw: Record<string, AssetInfo> = {};

    this.supportedAssets.forEach((info, assetCode) => {
      deposit[assetCode] = { ...info };
      withdraw[assetCode] = { ...info };
    });

    return {
      deposit,
      withdraw,
      fee: {
        enabled: true,
        description: 'Fees vary by asset and amount',
      },
      features: {
        account_creation: true,
        claimable_balances: true,
      },
    };
  }

  /**
   * SEP-24: Initiate interactive deposit
   */
  async depositInteractive(dto: DepositDto): Promise<{
    type: string;
    url: string;
    id: string;
  }> {
    this.logger.log(`Initiating deposit for ${dto.account} - ${dto.asset_code}`);

    // Validate asset
    const assetInfo = this.supportedAssets.get(dto.asset_code);
    if (!assetInfo || !assetInfo.enabled) {
      throw new BadRequestException(`Asset ${dto.asset_code} not supported for deposits`);
    }

    // Validate amount if provided
    if (dto.amount) {
      const amount = parseFloat(dto.amount);
      if (assetInfo.min_amount && amount < assetInfo.min_amount) {
        throw new BadRequestException(`Minimum deposit amount is ${assetInfo.min_amount}`);
      }
      if (assetInfo.max_amount && amount > assetInfo.max_amount) {
        throw new BadRequestException(`Maximum deposit amount is ${assetInfo.max_amount}`);
      }
    }

    // Calculate expiration (1 hour from now)
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1);

    // Create transaction record
    const transaction = this.transactionRepository.create({
      stellarAddress: dto.account,
      type: AnchorTransactionType.DEPOSIT,
      status: AnchorTransactionStatus.INCOMPLETE,
      assetCode: dto.asset_code,
      amount: dto.amount || '0',
      feeFixed: assetInfo.fee_fixed?.toString(),
      feePercent: assetInfo.fee_percent?.toString(),
      expiresAt,
      metadata: {
        email: dto.email_address,
        callback: dto.on_change_callback,
        lang: dto.lang || 'en',
      },
    });

    await this.transactionRepository.save(transaction);

    // Generate interactive URL
    const interactiveUrl = `${this.platformAnchorUrl}/anchors/deposit/${transaction.id}`;
    transaction.interactiveUrl = interactiveUrl;
    await this.transactionRepository.save(transaction);

    this.logger.log(`Deposit transaction created: ${transaction.id}`);

    return {
      type: 'interactive_customer_info_needed',
      url: interactiveUrl,
      id: transaction.id,
    };
  }

  /**
   * SEP-24: Initiate interactive withdrawal
   */
  async withdrawInteractive(dto: WithdrawDto): Promise<{
    type: string;
    url: string;
    id: string;
    account_id?: string;
  }> {
    this.logger.log(`Initiating withdrawal for ${dto.account} - ${dto.asset_code}`);

    // Validate asset
    const assetInfo = this.supportedAssets.get(dto.asset_code);
    if (!assetInfo || !assetInfo.enabled) {
      throw new BadRequestException(`Asset ${dto.asset_code} not supported for withdrawals`);
    }

    // Validate amount if provided
    if (dto.amount) {
      const amount = parseFloat(dto.amount);
      if (assetInfo.min_amount && amount < assetInfo.min_amount) {
        throw new BadRequestException(`Minimum withdrawal amount is ${assetInfo.min_amount}`);
      }
      if (assetInfo.max_amount && amount > assetInfo.max_amount) {
        throw new BadRequestException(`Maximum withdrawal amount is ${assetInfo.max_amount}`);
      }
    }

    // Calculate expiration (1 hour from now)
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1);

    // Create transaction record
    const transaction = this.transactionRepository.create({
      stellarAddress: dto.account,
      type: AnchorTransactionType.WITHDRAWAL,
      status: AnchorTransactionStatus.INCOMPLETE,
      assetCode: dto.asset_code,
      amount: dto.amount || '0',
      feeFixed: assetInfo.fee_fixed?.toString(),
      feePercent: assetInfo.fee_percent?.toString(),
      expiresAt,
      to: {
        type: dto.type,
        dest: dto.dest,
        dest_extra: dto.dest_extra,
      },
      metadata: {
        callback: dto.on_change_callback,
        lang: dto.lang || 'en',
      },
    });

    await this.transactionRepository.save(transaction);

    // Generate interactive URL
    const interactiveUrl = `${this.platformAnchorUrl}/anchors/withdraw/${transaction.id}`;
    transaction.interactiveUrl = interactiveUrl;
    await this.transactionRepository.save(transaction);

    this.logger.log(`Withdrawal transaction created: ${transaction.id}`);

    return {
      type: 'interactive_customer_info_needed',
      url: interactiveUrl,
      id: transaction.id,
      account_id: dto.account,
    };
  }

  /**
   * SEP-24: Get transaction status
   */
  async getTransaction(id: string, stellarAddress?: string): Promise<any> {
    const transaction = await this.transactionRepository.findOne({
      where: { id },
    });

    if (!transaction) {
      throw new NotFoundException(`Transaction not found: ${id}`);
    }

    // Verify ownership if stellarAddress provided
    if (stellarAddress && transaction.stellarAddress !== stellarAddress) {
      throw new NotFoundException(`Transaction not found: ${id}`);
    }

    // Format response according to SEP-24
    return {
      transaction: {
        id: transaction.id,
        kind: transaction.type,
        status: transaction.status,
        status_eta: this.getEstimatedCompletionTime(transaction),
        amount_in: transaction.amount,
        amount_out: this.calculateAmountOut(transaction),
        amount_fee: this.calculateFee(transaction),
        started_at: transaction.startedAt?.toISOString(),
        completed_at: transaction.completedAt?.toISOString(),
        stellar_transaction_id: transaction.stellarTxId,
        external_transaction_id: transaction.externalTxId,
        from: transaction.from,
        to: transaction.to,
        message: transaction.message,
      },
    };
  }

  /**
   * SEP-24: Get transactions for an account
   */
  async getTransactions(
    stellarAddress: string,
    assetCode?: string,
    limit: number = 20,
  ): Promise<any> {
    const queryBuilder = this.transactionRepository
      .createQueryBuilder('transaction')
      .where('transaction.stellarAddress = :stellarAddress', { stellarAddress })
      .orderBy('transaction.createdAt', 'DESC')
      .take(limit);

    if (assetCode) {
      queryBuilder.andWhere('transaction.assetCode = :assetCode', { assetCode });
    }

    const transactions = await queryBuilder.getMany();

    return {
      transactions: transactions.map((tx) => ({
        id: tx.id,
        kind: tx.type,
        status: tx.status,
        amount_in: tx.amount,
        amount_out: this.calculateAmountOut(tx),
        amount_fee: this.calculateFee(tx),
        started_at: tx.startedAt?.toISOString(),
        completed_at: tx.completedAt?.toISOString(),
        message: tx.message,
      })),
    };
  }

  /**
   * Update transaction status (for internal use)
   */
  async updateTransactionStatus(
    id: string,
    status: AnchorTransactionStatus,
    data?: Partial<AnchorTransactionEntity>,
  ): Promise<AnchorTransactionEntity> {
    const transaction = await this.transactionRepository.findOne({ where: { id } });

    if (!transaction) {
      throw new NotFoundException(`Transaction not found: ${id}`);
    }

    transaction.status = status;

    if (status === AnchorTransactionStatus.COMPLETED) {
      transaction.completedAt = new Date();
    }

    if (status === AnchorTransactionStatus.PENDING_USER_TRANSFER_START) {
      transaction.startedAt = new Date();
    }

    // Update additional fields
    if (data) {
      Object.assign(transaction, data);
    }

    await this.transactionRepository.save(transaction);

    this.logger.log(`Transaction ${id} updated to status: ${status}`);

    return transaction;
  }

  /**
   * Helper: Calculate amount after fees
   */
  private calculateAmountOut(transaction: AnchorTransactionEntity): string {
    const amount = parseFloat(transaction.amount);
    const fee = this.calculateFeeAmount(transaction);
    return (amount - fee).toFixed(7);
  }

  /**
   * Helper: Calculate fee
   */
  private calculateFee(transaction: AnchorTransactionEntity): string {
    return this.calculateFeeAmount(transaction).toFixed(7);
  }

  /**
   * Helper: Calculate fee amount
   */
  private calculateFeeAmount(transaction: AnchorTransactionEntity): number {
    const amount = parseFloat(transaction.amount);
    const feeFixed = parseFloat(transaction.feeFixed || '0');
    const feePercent = parseFloat(transaction.feePercent || '0');

    return feeFixed + (amount * feePercent) / 100;
  }

  /**
   * Helper: Get estimated completion time
   */
  private getEstimatedCompletionTime(transaction: AnchorTransactionEntity): number | undefined {
    if (transaction.status === AnchorTransactionStatus.COMPLETED) {
      return undefined;
    }

    // Estimate 1-24 hours for completion
    const hoursToComplete = transaction.type === AnchorTransactionType.DEPOSIT ? 1 : 24;
    const eta = new Date();
    eta.setHours(eta.getHours() + hoursToComplete);

    return Math.floor(eta.getTime() / 1000);
  }

  /**
   * Cleanup expired transactions
   */
  async cleanupExpiredTransactions(): Promise<number> {
    const result = await this.transactionRepository
      .createQueryBuilder()
      .update(AnchorTransactionEntity)
      .set({ status: AnchorTransactionStatus.EXPIRED })
      .where('expiresAt < :now', { now: new Date() })
      .andWhere('status IN (:...statuses)', {
        statuses: [
          AnchorTransactionStatus.INCOMPLETE,
          AnchorTransactionStatus.PENDING_USER_TRANSFER_START,
        ],
      })
      .execute();

    this.logger.log(`Expired ${result.affected} anchor transactions`);
    return result.affected || 0;
  }
}
