import { Injectable, Logger, BadRequestException, NotFoundException } from '@nestjs/common';
import { StellarService } from '../stellar/stellar.service';
import {
  RegisterPropertyDto,
  VerifyPropertyDto,
  UpdateOwnershipDto,
  RecordDocumentDto,
} from './dto';

@Injectable()
export class RegistryService {
  private readonly logger = new Logger(RegistryService.name);

  constructor(private readonly stellarService: StellarService) {}

  /**
   * Register a property in the blockchain registry
   * @param dto Property registration parameters
   * @returns Transaction hash
   */
  async registerProperty(dto: RegisterPropertyDto): Promise<{ txHash: string }> {
    try {
      this.logger.log(`Registering property ${dto.propertyId} (Legal ID: ${dto.legalId})`);

      const txHash = await this.stellarService.registerProperty(
        dto.adminSecretKey,
        dto.propertyId,
        dto.legalId,
        dto.ownerAddress,
        dto.valuation,
      );

      this.logger.log(`Property ${dto.propertyId} registered successfully. TxHash: ${txHash}`);
      return { txHash };
    } catch (error) {
      this.logger.error(`Failed to register property ${dto.propertyId}:`, error.message);
      throw new BadRequestException(`Failed to register property: ${error.message}`);
    }
  }

  /**
   * Verify a property in the registry
   * @param dto Property verification parameters
   * @returns Transaction hash
   */
  async verifyProperty(dto: VerifyPropertyDto): Promise<{ txHash: string }> {
    try {
      this.logger.log(`Verifying property ${dto.propertyId}`);

      const txHash = await this.stellarService.verifyProperty(
        dto.adminSecretKey,
        dto.propertyId,
      );

      this.logger.log(`Property ${dto.propertyId} verified successfully. TxHash: ${txHash}`);
      return { txHash };
    } catch (error) {
      this.logger.error(`Failed to verify property ${dto.propertyId}:`, error.message);
      throw new BadRequestException(`Failed to verify property: ${error.message}`);
    }
  }

  /**
   * Update ownership records in registry
   * Note: This is a placeholder as the current smart contract doesn't have this method
   * @param dto Ownership update parameters
   * @returns Success message
   */
  async updateOwnership(dto: UpdateOwnershipDto): Promise<{ message: string; owners: any[] }> {
    try {
      this.logger.log(`Updating ownership for property ${dto.propertyId}`);

      // Validate that percentages add up to 100
      const totalPercentage = dto.owners.reduce((sum, owner) => sum + owner.percentage, 0);
      if (Math.abs(totalPercentage - 100) > 0.01) {
        throw new BadRequestException(`Total ownership percentage must equal 100% (current: ${totalPercentage}%)`);
      }

      // Note: The current smart contract doesn't have an update_ownership method
      // This would require updating the smart contract or implementing off-chain tracking
      this.logger.warn('Update ownership is not implemented in the smart contract yet');

      return {
        message: 'Ownership update queued (not yet implemented in smart contract)',
        owners: dto.owners,
      };
    } catch (error) {
      this.logger.error(`Failed to update ownership for property ${dto.propertyId}:`, error.message);
      throw new BadRequestException(`Failed to update ownership: ${error.message}`);
    }
  }

  /**
   * Get property data from registry
   * @param propertyId Property ID
   * @returns Property information
   */
  async getProperty(propertyId: number): Promise<{
    legalId: string;
    owner: string;
    valuation: number;
    verified: boolean;
    registeredAt: number;
  }> {
    try {
      this.logger.log(`Fetching property ${propertyId} from registry`);

      const property = await this.stellarService.getPropertyFromRegistry(propertyId);

      return property;
    } catch (error) {
      this.logger.error(`Failed to get property ${propertyId}:`, error.message);
      throw new NotFoundException(`Property not found: ${error.message}`);
    }
  }

  /**
   * Get property owners from registry
   * Note: This is a placeholder as the current smart contract stores only one owner
   * @param propertyId Property ID
   * @returns Property owners
   */
  async getPropertyOwners(propertyId: number): Promise<{
    propertyId: number;
    owners: Array<{ address: string; percentage: number }>;
  }> {
    try {
      this.logger.log(`Fetching owners for property ${propertyId}`);

      const property = await this.getProperty(propertyId);

      // Current smart contract only tracks single owner
      return {
        propertyId,
        owners: [
          {
            address: property.owner,
            percentage: 100,
          },
        ],
      };
    } catch (error) {
      this.logger.error(`Failed to get owners for property ${propertyId}:`, error.message);
      throw new NotFoundException(`Property owners not found: ${error.message}`);
    }
  }

  /**
   * Verify if an address owns a property
   * @param propertyId Property ID
   * @param ownerAddress Owner address to verify
   * @returns Whether the address owns the property
   */
  async verifyOwnership(propertyId: number, ownerAddress: string): Promise<boolean> {
    try {
      this.logger.log(`Verifying ownership of property ${propertyId} for ${ownerAddress}`);

      const property = await this.getProperty(propertyId);

      return property.owner.toLowerCase() === ownerAddress.toLowerCase();
    } catch (error) {
      this.logger.error(`Failed to verify ownership:`, error.message);
      return false;
    }
  }

  /**
   * Get property ownership history
   * Note: This is a placeholder - would require event indexing or off-chain storage
   * @param propertyId Property ID
   * @returns Property history
   */
  async getPropertyHistory(propertyId: number): Promise<{
    propertyId: number;
    history: Array<{
      timestamp: number;
      event: string;
      details: any;
    }>;
  }> {
    try {
      this.logger.log(`Fetching history for property ${propertyId}`);

      const property = await this.getProperty(propertyId);

      // Placeholder: In production, this would query an event indexer
      return {
        propertyId,
        history: [
          {
            timestamp: property.registeredAt,
            event: 'REGISTERED',
            details: {
              owner: property.owner,
              valuation: property.valuation,
            },
          },
        ],
      };
    } catch (error) {
      this.logger.error(`Failed to get history for property ${propertyId}:`, error.message);
      throw new NotFoundException(`Property history not found: ${error.message}`);
    }
  }

  /**
   * Record legal document hash in registry
   * Note: This is a placeholder as the current smart contract doesn't have this method
   * @param dto Document recording parameters
   * @returns Success message
   */
  async recordLegalDocument(dto: RecordDocumentDto): Promise<{
    message: string;
    documentHash: string;
  }> {
    try {
      this.logger.log(`Recording legal document for property ${dto.propertyId}`);

      // Verify property exists
      await this.getProperty(dto.propertyId);

      // Note: The current smart contract doesn't have a record_document method
      // This would require updating the smart contract or implementing off-chain storage
      this.logger.warn('Record legal document is not implemented in the smart contract yet');

      return {
        message: 'Document hash recorded (off-chain)',
        documentHash: dto.documentHash,
      };
    } catch (error) {
      this.logger.error(`Failed to record document for property ${dto.propertyId}:`, error.message);
      throw new BadRequestException(`Failed to record document: ${error.message}`);
    }
  }

  /**
   * Check if a property is verified
   * @param propertyId Property ID
   * @returns Verification status
   */
  async isPropertyVerified(propertyId: number): Promise<{ verified: boolean }> {
    try {
      const verified = await this.stellarService.isPropertyVerified(propertyId);

      return { verified };
    } catch (error) {
      this.logger.error(`Failed to check verification status for property ${propertyId}:`, error.message);
      return { verified: false };
    }
  }
}
