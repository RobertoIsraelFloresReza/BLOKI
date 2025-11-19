import { Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { OwnershipService } from './ownership.service';

@ApiTags('Ownership')
@Controller('ownership')
export class OwnershipController {
  constructor(private readonly ownershipService: OwnershipService) {}

  @Get('property/:propertyId')
  @ApiOperation({ summary: 'Obtener ownership de una propiedad' })
  findByProperty(@Param('propertyId', ParseIntPipe) propertyId: number) {
    return this.ownershipService.findByProperty(propertyId);
  }

  @Get('owner/:ownerAddress')
  @ApiOperation({ summary: 'Obtener propiedades de un owner' })
  findByOwner(@Param('ownerAddress') ownerAddress: string) {
    return this.ownershipService.findByOwner(ownerAddress);
  }

  @Post('property/:propertyId/sync')
  @ApiOperation({ summary: 'Sincronizar ownership desde blockchain' })
  syncFromBlockchain(@Param('propertyId', ParseIntPipe) propertyId: number) {
    return this.ownershipService.syncOwnershipFromBlockchain(propertyId);
  }
}
