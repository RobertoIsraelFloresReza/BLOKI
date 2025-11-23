import { Controller, Get, Param, Query } from '@nestjs/common';
import { OracleService } from './oracle.service';

@Controller('oracle')
export class OracleController {
  constructor(private readonly oracleService: OracleService) {}

  @Get('price/:asset')
  async getPrice(@Param('asset') asset: string) {
    return this.oracleService.getPrice(asset);
  }

  @Get('valuation/:propertyId')
  async getValuation(
    @Param('propertyId') propertyId: string,
    @Query('sqft') sqft: string,
    @Query('locationMultiplier') locationMultiplier?: string,
  ) {
    const valuation = await this.oracleService.getPropertyValuation(
      propertyId,
      parseInt(sqft),
      locationMultiplier ? parseInt(locationMultiplier) : 100,
    );
    return { propertyId, valuation };
  }
}
