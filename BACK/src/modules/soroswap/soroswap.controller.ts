import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { SoroswapService } from './soroswap.service';
import { SwapQuoteDto } from './dto/swap-quote.dto';
import { ExecuteSwapDto } from './dto/execute-swap.dto';

@Controller('soroswap')
export class SoroswapController {
  constructor(private readonly soroswapService: SoroswapService) {}

  @Get('quote')
  async getQuote(
    @Query('propertyToken') propertyToken: string,
    @Query('targetToken') targetToken: string,
    @Query('amountIn') amountIn: string,
  ) {
    const dto: SwapQuoteDto = {
      propertyToken,
      targetToken,
      amountIn: parseFloat(amountIn),
    };
    return this.soroswapService.getSwapQuote(dto);
  }

  @Post('swap')
  async executeSwap(@Body() body: ExecuteSwapDto) {
    return this.soroswapService.executeSwap(body);
  }
}
