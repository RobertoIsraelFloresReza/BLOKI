import { Controller, Get, Query } from '@nestjs/common';
import { DeFindexService } from './defindex.service';

@Controller('defindex')
export class DeFindexController {
  constructor(private readonly defindexService: DeFindexService) {}

  @Get('vaults')
  async getVaults() {
    return this.defindexService.getVaults();
  }

  @Get('estimate')
  async estimateYield(
    @Query('amount') amount: string,
    @Query('duration') duration: string,
  ) {
    return this.defindexService.estimateYield(
      parseFloat(amount),
      parseInt(duration),
    );
  }
}
