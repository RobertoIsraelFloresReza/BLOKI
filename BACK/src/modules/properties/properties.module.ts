import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PropertiesService } from './properties.service';
import { PropertiesController } from './properties.controller';
import { PropertyEntity } from './entities/property.entity';
import { StellarModule } from '../stellar/stellar.module';
import { CloudflareModule } from '../cloudflare/cloudflare.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([PropertyEntity]),
    StellarModule,
    CloudflareModule,
  ],
  providers: [PropertiesService],
  controllers: [PropertiesController],
  exports: [TypeOrmModule],
})
export class PropertiesModule {}
