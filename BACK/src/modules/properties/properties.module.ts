import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PropertiesService } from './properties.service';
import { PropertiesController } from './properties.controller';
import { PropertyEntity } from './entities/property.entity';
import { StellarModule } from '../stellar/stellar.module';
import { CloudflareModule } from '../cloudflare/cloudflare.module';
import { AuthModule } from '../auth/auth.module';
import { MarketplaceModule } from '../marketplace/marketplace.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([PropertyEntity]),
    StellarModule,
    CloudflareModule,
    AuthModule,
    forwardRef(() => MarketplaceModule),
  ],
  providers: [PropertiesService],
  controllers: [PropertiesController],
  exports: [TypeOrmModule, PropertiesService],
})
export class PropertiesModule {}
