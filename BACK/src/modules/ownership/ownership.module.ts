import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OwnershipService } from './ownership.service';
import { OwnershipController } from './ownership.controller';
import { OwnershipEntity } from './entities/ownership.entity';
import { PropertyEntity } from '../properties/entities/property.entity';
import { StellarModule } from '../stellar/stellar.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([OwnershipEntity, PropertyEntity]),
    StellarModule,
  ],
  providers: [OwnershipService],
  controllers: [OwnershipController],
  exports: [TypeOrmModule],
})
export class OwnershipModule {}
