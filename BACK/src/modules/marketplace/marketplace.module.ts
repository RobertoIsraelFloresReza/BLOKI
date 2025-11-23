import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MarketplaceService } from './marketplace.service';
import { MarketplaceController } from './marketplace.controller';
import { ListingEntity } from './entities/listing.entity';
import { TransactionEntity } from './entities/transaction.entity';
import { PropertyEntity } from '../properties/entities/property.entity';
import { OwnershipEntity } from '../ownership/entities/ownership.entity';
import { StellarModule } from '../stellar/stellar.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ListingEntity,
      TransactionEntity,
      PropertyEntity,
      OwnershipEntity,
    ]),
    StellarModule,
  ],
  providers: [MarketplaceService],
  controllers: [MarketplaceController],
  exports: [TypeOrmModule, MarketplaceService],
})
export class MarketplaceModule {}
