import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { StellarService } from '../stellar/stellar.service';
import { LockFundsDto, ReleaseFundsDto, RefundEscrowDto } from './dto';

@Injectable()
export class EscrowService {
  private readonly logger = new Logger(EscrowService.name);

  constructor(private readonly stellarService: StellarService) {}

  /**
   * Lock funds in escrow for a transaction
   * @param dto Lock funds parameters
   * @returns Transaction hash and escrow ID
   */
  async lockFunds(dto: LockFundsDto): Promise<{ txHash: string; escrowId: number }> {
    try {
      this.logger.log(`Locking ${dto.amount} USDC in escrow for ${dto.lockDurationDays} days`);

      const result = await this.stellarService.lockFunds(
        dto.buyerSecretKey,
        dto.sellerAddress,
        dto.amount,
        dto.lockDurationDays,
      );

      this.logger.log(`Funds locked successfully. Escrow ID: ${result.escrowId}, TxHash: ${result.txHash}`);
      return result;
    } catch (error) {
      this.logger.error('Failed to lock funds in escrow:', error.message);
      throw new BadRequestException(`Failed to lock funds: ${error.message}`);
    }
  }

  /**
   * Release escrowed funds to seller
   * @param dto Release funds parameters
   * @returns Transaction hash
   */
  async releaseToSeller(dto: ReleaseFundsDto): Promise<{ txHash: string }> {
    try {
      this.logger.log(`Releasing escrow ${dto.escrowId} to seller`);

      const txHash = await this.stellarService.releaseFunds(
        dto.buyerSecretKey,
        dto.escrowId,
      );

      this.logger.log(`Escrow ${dto.escrowId} released successfully. TxHash: ${txHash}`);
      return { txHash };
    } catch (error) {
      this.logger.error(`Failed to release escrow ${dto.escrowId}:`, error.message);
      throw new BadRequestException(`Failed to release funds: ${error.message}`);
    }
  }

  /**
   * Refund escrowed funds to buyer
   * @param dto Refund parameters
   * @returns Transaction hash
   */
  async refundToBuyer(dto: RefundEscrowDto): Promise<{ txHash: string }> {
    try {
      this.logger.log(`Refunding escrow ${dto.escrowId} to buyer`);

      const txHash = await this.stellarService.refundEscrow(
        dto.sellerSecretKey,
        dto.escrowId,
      );

      this.logger.log(`Escrow ${dto.escrowId} refunded successfully. TxHash: ${txHash}`);
      return { txHash };
    } catch (error) {
      this.logger.error(`Failed to refund escrow ${dto.escrowId}:`, error.message);
      throw new BadRequestException(`Failed to refund: ${error.message}`);
    }
  }

  /**
   * Get escrow status and details
   * @param escrowId Escrow ID
   * @returns Escrow information
   */
  async getEscrowInfo(escrowId: number): Promise<{
    buyer: string;
    seller: string;
    amount: number;
    unlockTime: number;
    status: string;
  }> {
    try {
      this.logger.log(`Fetching info for escrow ${escrowId}`);

      const info = await this.stellarService.getEscrowInfo(escrowId);

      return info;
    } catch (error) {
      this.logger.error(`Failed to get escrow info for ${escrowId}:`, error.message);
      throw new BadRequestException(`Failed to get escrow info: ${error.message}`);
    }
  }

  /**
   * Check if escrow has timed out
   * @param escrowId Escrow ID
   * @returns Whether escrow is timed out
   */
  async isTimedOut(escrowId: number): Promise<boolean> {
    try {
      const info = await this.getEscrowInfo(escrowId);
      const currentTime = Math.floor(Date.now() / 1000);

      return currentTime > info.unlockTime;
    } catch (error) {
      this.logger.error(`Failed to check timeout for escrow ${escrowId}:`, error.message);
      throw new BadRequestException(`Failed to check timeout: ${error.message}`);
    }
  }

  /**
   * Get escrow status (simplified)
   * @param escrowId Escrow ID
   * @returns Status string
   */
  async getEscrowStatus(escrowId: number): Promise<{ status: string; timedOut: boolean }> {
    try {
      const info = await this.getEscrowInfo(escrowId);
      const timedOut = await this.isTimedOut(escrowId);

      return {
        status: info.status,
        timedOut,
      };
    } catch (error) {
      this.logger.error(`Failed to get status for escrow ${escrowId}:`, error.message);
      throw new BadRequestException(`Failed to get status: ${error.message}`);
    }
  }
}
