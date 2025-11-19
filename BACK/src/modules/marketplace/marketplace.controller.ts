import { Controller, Get, Post, Body, Param, Query, ParseIntPipe, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { MarketplaceService } from './marketplace.service';
import { CreateListingDto } from './dto/create-listing.dto';
import { BuyTokensDto } from './dto/buy-tokens.dto';
import { ListingStatus } from './entities/listing.entity';
import { Pausable } from '../../common/decorators/pausable.decorator';

@ApiTags('Marketplace')
@Controller('marketplace')
export class MarketplaceController {
  constructor(private readonly marketplaceService: MarketplaceService) {}

  @Post('listings')
  @Pausable()
  @ApiOperation({ summary: 'Crear nuevo listing' })
  createListing(@Body() createListingDto: CreateListingDto) {
    return this.marketplaceService.createListing(createListingDto);
  }

  @Post('listings/buy')
  @Pausable()
  @ApiOperation({ summary: 'Comprar tokens de un listing' })
  buyTokens(@Body() buyTokensDto: BuyTokensDto) {
    return this.marketplaceService.buyTokens(buyTokensDto);
  }

  @Get('listings')
  @ApiOperation({ summary: 'Obtener todos los listings' })
  @ApiQuery({ name: 'status', required: false, enum: ListingStatus })
  findAll(@Query('status') status?: ListingStatus) {
    return this.marketplaceService.findAll(status);
  }

  @Get('listings/:id')
  @ApiOperation({ summary: 'Obtener listing por ID' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.marketplaceService.findOne(id);
  }

  @Delete('listings/:id')
  @Pausable()
  @ApiOperation({ summary: 'Cancelar listing' })
  cancelListing(
    @Param('id', ParseIntPipe) id: number,
    @Body('sellerSecretKey') sellerSecretKey: string,
  ) {
    return this.marketplaceService.cancelListing(id, sellerSecretKey);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Obtener estadísticas del marketplace' })
  getStats() {
    return this.marketplaceService.getMarketplaceStats();
  }

  @Get('transactions')
  @ApiOperation({ summary: 'Obtener transacciones recientes del marketplace' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  getTransactions(@Query('limit') limit?: number) {
    return this.marketplaceService.getRecentTransactions(limit || 50);
  }

  @Get('listings/:id/transactions')
  @ApiOperation({ summary: 'Obtener transacciones de un listing con paginación' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'offset', required: false, type: Number })
  getListingTransactions(
    @Param('id', ParseIntPipe) id: number,
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
  ) {
    return this.marketplaceService.getListingTransactions(
      id,
      limit ? parseInt(limit.toString()) : 100,
      offset ? parseInt(offset.toString()) : 0,
    );
  }
}
