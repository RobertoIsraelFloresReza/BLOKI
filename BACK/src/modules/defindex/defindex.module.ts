import { Module } from '@nestjs/common';
import { DeFindexService } from './defindex.service';
import { DeFindexController } from './defindex.controller';

@Module({
  controllers: [DeFindexController],
  providers: [DeFindexService],
  exports: [DeFindexService],
})
export class DeFindexModule {}
