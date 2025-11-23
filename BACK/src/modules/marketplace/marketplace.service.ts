import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { ListingEntity, ListingStatus } from './entities/listing.entity';
import { TransactionEntity } from './entities/transaction.entity';
import { PropertyEntity } from '../properties/entities/property.entity';
import { OwnershipEntity } from '../ownership/entities/ownership.entity';
import { CreateListingDto } from './dto/create-listing.dto';
import { BuyTokensDto } from './dto/buy-tokens.dto';
import { StellarService } from '../stellar/stellar.service';
import { Keypair } from '@stellar/stellar-sdk';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class MarketplaceService {
  private readonly logger = new Logger(MarketplaceService.name);

  constructor(
    @InjectRepository(ListingEntity)
    private listingRepository: Repository<ListingEntity>,
    @InjectRepository(TransactionEntity)
    private transactionRepository: Repository<TransactionEntity>,
    @InjectRepository(PropertyEntity)
    private propertyRepository: Repository<PropertyEntity>,
    @InjectRepository(OwnershipEntity)
    private ownershipRepository: Repository<OwnershipEntity>,
    private stellarService: StellarService,
  ) {}

  async createListing(createListingDto: CreateListingDto): Promise<ListingEntity> {
    const property = await this.propertyRepository.findOne({
      where: { id: createListingDto.propertyId },
    });

    if (!property) throw new NotFoundException('Property not found');

    const sellerKeypair = Keypair.fromSecret(createListingDto.sellerSecretKey);
    const sellerAddress = sellerKeypair.publicKey();

    const result = await this.stellarService.createListing(
      createListingDto.sellerSecretKey,
      property.contractId,
      createListingDto.amount,
      createListingDto.pricePerToken,
      createListingDto.expirationDays || 30,
    );

    const listing = this.listingRepository.create({
      listingId: result.listingId.toString(),
      propertyId: property.id,
      sellerAddress,
      amount: (createListingDto.amount * 10000000).toString(),
      initialAmount: (createListingDto.amount * 10000000).toString(),
      pricePerToken: (createListingDto.pricePerToken * 10000000).toString(),
      totalPrice: (createListingDto.amount * createListingDto.pricePerToken * 10000000).toString(),
      status: ListingStatus.ACTIVE,
      txHash: result.txHash,
    });

    return this.listingRepository.save(listing);
  }

  async buyTokens(buyTokensDto: BuyTokensDto) {
    try {
      const listing = await this.listingRepository.findOne({
        where: { id: buyTokensDto.listingId },
        relations: ['property'],
      });

      if (!listing) throw new NotFoundException('Listing not found');
      if (listing.status !== ListingStatus.ACTIVE) throw new BadRequestException('Listing not active');

      this.logger.log(`Attempting to buy ${buyTokensDto.amount} tokens from listing ${buyTokensDto.listingId}`);

      const buyerKeypair = Keypair.fromSecret(buyTokensDto.buyerSecretKey);

      // Calculate total price needed
      const pricePerToken = parseFloat(listing.pricePerToken);
      const totalPrice = buyTokensDto.amount * pricePerToken;

      this.logger.log(`Total price: ${totalPrice} USDC (${buyTokensDto.amount} tokens × ${pricePerToken} USDC/token)`);

      // Approve USDC allowance for marketplace (in testnet, this auto-mints if needed)
      try {
        this.logger.log(`Approving ${totalPrice} USDC for marketplace...`);
        await this.stellarService.approveUsdcForMarketplace(buyTokensDto.buyerSecretKey, totalPrice);
        this.logger.log('USDC allowance approved');
      } catch (error) {
        this.logger.error(`Failed to approve USDC allowance: ${error.message}`);
        throw new BadRequestException(`Failed to approve USDC allowance: ${error.message}`);
      }

      const txHash = await this.stellarService.buyFromListing(
        buyTokensDto.buyerSecretKey,
        parseInt(listing.listingId),
        buyTokensDto.amount,
      );

      this.logger.log(`Buy transaction successful: ${txHash}`);

    const transaction = this.transactionRepository.create({
      txHash,
      listingId: listing.id,
      buyerAddress: buyerKeypair.publicKey(),
      sellerAddress: listing.sellerAddress,
      amount: (buyTokensDto.amount * 10000000).toString(),
      pricePerToken: listing.pricePerToken,
      totalPrice: (buyTokensDto.amount * parseFloat(listing.pricePerToken)).toString(),
    });

    await this.transactionRepository.save(transaction);

    const newAmount = parseFloat(listing.amount) / 10000000 - buyTokensDto.amount;
    listing.amount = (newAmount * 10000000).toString();
    if (newAmount <= 0) listing.status = ListingStatus.SOLD;

      await this.listingRepository.save(listing);
      return { transaction, listing };
    } catch (error) {
      this.logger.error(`Error in buyTokens: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findAll(status?: ListingStatus): Promise<ListingEntity[]> {
    return this.listingRepository.find({
      where: status ? { status } : {},
      relations: ['property'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<ListingEntity> {
    // Do NOT load all transactions - can cause unbounded storage issues
    const listing = await this.listingRepository.findOne({
      where: { id },
      relations: ['property'],
    });
    if (!listing) throw new NotFoundException('Listing not found');
    return listing;
  }

  /**
   * Get transactions for a listing with pagination
   * Prevents unbounded storage issues
   */
  async getListingTransactions(
    listingId: number,
    limit: number = 100,
    offset: number = 0,
  ): Promise<{ transactions: TransactionEntity[]; total: number }> {
    const [transactions, total] = await this.transactionRepository.findAndCount({
      where: { listingId },
      order: { createdAt: 'DESC' },
      take: Math.min(limit, 100), // Max 100 per request
      skip: offset,
    });

    return { transactions, total };
  }

  async cancelListing(id: number, sellerSecretKey: string): Promise<ListingEntity> {
    const listing = await this.findOne(id);

    if (listing.status !== ListingStatus.ACTIVE) {
      throw new BadRequestException('Listing is not active');
    }

    const sellerKeypair = Keypair.fromSecret(sellerSecretKey);
    const sellerAddress = sellerKeypair.publicKey();

    if (listing.sellerAddress !== sellerAddress) {
      throw new BadRequestException('Only the seller can cancel this listing');
    }

    try {
      const txHash = await this.stellarService.cancelListing(
        sellerSecretKey,
        parseInt(listing.listingId),
      );

      listing.status = ListingStatus.CANCELLED;
      listing.txHash = txHash;

      return this.listingRepository.save(listing);
    } catch (error) {
      this.logger.error(`Failed to cancel listing: ${error.message}`);
      throw new BadRequestException(`Failed to cancel listing: ${error.message}`);
    }
  }

  async getMarketplaceStats(): Promise<any> {
    const totalListings = await this.listingRepository.count();
    const activeListings = await this.listingRepository.count({
      where: { status: ListingStatus.ACTIVE },
    });
    const soldListings = await this.listingRepository.count({
      where: { status: ListingStatus.SOLD },
    });
    const totalTransactions = await this.transactionRepository.count();

    const totalVolumeResult = await this.transactionRepository
      .createQueryBuilder('transaction')
      .select('SUM(CAST(transaction.totalPrice AS DECIMAL))', 'total')
      .getRawOne();

    const totalVolume = totalVolumeResult?.total || '0';

    const propertiesWithListings = await this.listingRepository
      .createQueryBuilder('listing')
      .select('COUNT(DISTINCT listing.propertyId)', 'count')
      .getRawOne();

    return {
      totalListings,
      activeListings,
      soldListings,
      totalTransactions,
      totalVolume: totalVolume.toString(),
      propertiesWithListings: parseInt(propertiesWithListings?.count || '0'),
      cancelledListings: await this.listingRepository.count({
        where: { status: ListingStatus.CANCELLED },
      }),
    };
  }

  async getRecentTransactions(limit: number = 50): Promise<TransactionEntity[]> {
    return this.transactionRepository.find({
      relations: ['listing', 'listing.property'],
      order: { createdAt: 'DESC' },
      take: Math.min(limit, 100), // Max 100
    });
  }

  /**
   * Cleanup old transactions (older than 1 year)
   * Runs daily at 3 AM
   */
  @Cron(CronExpression.EVERY_DAY_AT_3AM)
  async cleanupOldTransactions(): Promise<number> {
    this.logger.log('Running cleanup of old transactions...');

    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

    try {
      const result = await this.transactionRepository.delete({
        createdAt: LessThan(oneYearAgo),
      });

      const deletedCount = result.affected || 0;

      if (deletedCount > 0) {
        this.logger.log(`Cleaned up ${deletedCount} old transactions (>1 year)`);
      }

      return deletedCount;
    } catch (error) {
      this.logger.error(`Failed to cleanup old transactions: ${error.message}`);
      return 0;
    }
  }

  /**
   * Manual cleanup trigger (admin endpoint)
   */
  async manualCleanupOldTransactions(daysOld: number = 365): Promise<number> {
    this.logger.log(`Manual cleanup requested for transactions older than ${daysOld} days`);

    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);

    const result = await this.transactionRepository.delete({
      createdAt: LessThan(cutoffDate),
    });

    const deletedCount = result.affected || 0;
    this.logger.log(`Manually cleaned up ${deletedCount} transactions`);

    return deletedCount;
  }
}
