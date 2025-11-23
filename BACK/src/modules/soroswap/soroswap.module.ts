import { Module } from '@nestjs/common';
import { SoroswapService } from './soroswap.service';
import { SoroswapController } from './soroswap.controller';

@Module({
  controllers: [SoroswapController],
  providers: [SoroswapService],
  exports: [SoroswapService],
})
export class SoroswapModule {}
