import { Controller, Get, Post, Body, Param, ParseIntPipe, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { RegistryService } from './registry.service';
import {
  RegisterPropertyDto,
  VerifyPropertyDto,
  UpdateOwnershipDto,
  RecordDocumentDto,
} from './dto';

@ApiTags('Registry')
@Controller('registry')
export class RegistryController {
  constructor(private readonly registryService: RegistryService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Register a property in the blockchain registry',
    description: 'Records property information on-chain including legal ID, owner, and valuation',
  })
  @ApiResponse({
    status: 201,
    description: 'Property registered successfully',
    schema: {
      example: {
        txHash: 'abc123...xyz',
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Invalid parameters or registration failed' })
  async registerProperty(@Body() dto: RegisterPropertyDto) {
    return this.registryService.registerProperty(dto);
  }

  @Post('verify')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Verify a property in the registry',
    description: 'Marks a property as verified after legal validation',
  })
  @ApiResponse({
    status: 200,
    description: 'Property verified successfully',
    schema: {
      example: {
        txHash: 'abc123...xyz',
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Verification failed' })
  async verifyProperty(@Body() dto: VerifyPropertyDto) {
    return this.registryService.verifyProperty(dto);
  }

  @Post('ownership/update')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Update ownership records in registry',
    description: 'Updates the ownership distribution for a property (placeholder - not yet implemented in smart contract)',
  })
  @ApiResponse({
    status: 200,
    description: 'Ownership update queued',
    schema: {
      example: {
        message: 'Ownership update queued (not yet implemented in smart contract)',
        owners: [
          { owner: 'GBXXXXX...', percentage: 60 },
          { owner: 'GCXXXXX...', percentage: 40 },
        ],
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Invalid ownership percentages or update failed' })
  async updateOwnership(@Body() dto: UpdateOwnershipDto) {
    return this.registryService.updateOwnership(dto);
  }

  @Get('property/:propertyId')
  @ApiOperation({
    summary: 'Get property data from registry',
    description: 'Retrieve complete property information from the blockchain',
  })
  @ApiParam({ name: 'propertyId', description: 'Property ID', example: 12345 })
  @ApiResponse({
    status: 200,
    description: 'Property data retrieved successfully',
    schema: {
      example: {
        legalId: 'RPP-2024-001234',
        owner: 'GBXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
        valuation: 250000.00,
        verified: true,
        registeredAt: 1698765432,
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Property not found' })
  async getProperty(@Param('propertyId', ParseIntPipe) propertyId: number) {
    return this.registryService.getProperty(propertyId);
  }

  @Get('property/:propertyId/owners')
  @ApiOperation({
    summary: 'Get property owners from registry',
    description: 'Retrieve the list of owners and their ownership percentages',
  })
  @ApiParam({ name: 'propertyId', description: 'Property ID', example: 12345 })
  @ApiResponse({
    status: 200,
    description: 'Property owners retrieved successfully',
    schema: {
      example: {
        propertyId: 12345,
        owners: [
          { address: 'GBXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX', percentage: 100 },
        ],
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Property not found' })
  async getPropertyOwners(@Param('propertyId', ParseIntPipe) propertyId: number) {
    return this.registryService.getPropertyOwners(propertyId);
  }

  @Get('property/:propertyId/owner/:ownerAddress/verify')
  @ApiOperation({
    summary: 'Verify if address owns property',
    description: 'Check if a specific address is an owner of the property',
  })
  @ApiParam({ name: 'propertyId', description: 'Property ID', example: 12345 })
  @ApiParam({
    name: 'ownerAddress',
    description: 'Owner Stellar address',
    example: 'GBXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'
  })
  @ApiResponse({
    status: 200,
    description: 'Ownership verification completed',
    schema: {
      example: {
        propertyId: 12345,
        ownerAddress: 'GBXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
        isOwner: true,
      },
    },
  })
  async verifyOwnership(
    @Param('propertyId', ParseIntPipe) propertyId: number,
    @Param('ownerAddress') ownerAddress: string,
  ) {
    const isOwner = await this.registryService.verifyOwnership(propertyId, ownerAddress);
    return { propertyId, ownerAddress, isOwner };
  }

  @Get('property/:propertyId/history')
  @ApiOperation({
    summary: 'Get property ownership history',
    description: 'Retrieve the historical timeline of property events and ownership changes',
  })
  @ApiParam({ name: 'propertyId', description: 'Property ID', example: 12345 })
  @ApiResponse({
    status: 200,
    description: 'Property history retrieved successfully',
    schema: {
      example: {
        propertyId: 12345,
        history: [
          {
            timestamp: 1698765432,
            event: 'REGISTERED',
            details: {
              owner: 'GBXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
              valuation: 250000.00,
            },
          },
        ],
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Property not found' })
  async getPropertyHistory(@Param('propertyId', ParseIntPipe) propertyId: number) {
    return this.registryService.getPropertyHistory(propertyId);
  }

  @Post('document/record')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Record legal document hash in registry',
    description: 'Store a hash of a legal document associated with a property (placeholder - not yet implemented in smart contract)',
  })
  @ApiResponse({
    status: 200,
    description: 'Document hash recorded',
    schema: {
      example: {
        message: 'Document hash recorded (off-chain)',
        documentHash: 'a3c5e7f9b2d4a6c8e1f3b5d7a9c2e4f6b8d1a3c5e7f9b2d4a6c8e1f3b5d7a9c2',
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Failed to record document' })
  async recordDocument(@Body() dto: RecordDocumentDto) {
    return this.registryService.recordLegalDocument(dto);
  }

  @Get('property/:propertyId/verified')
  @ApiOperation({
    summary: 'Check if property is verified',
    description: 'Quick check to see if a property has been verified',
  })
  @ApiParam({ name: 'propertyId', description: 'Property ID', example: 12345 })
  @ApiResponse({
    status: 200,
    description: 'Verification status retrieved',
    schema: {
      example: {
        verified: true,
      },
    },
  })
  async isPropertyVerified(@Param('propertyId', ParseIntPipe) propertyId: number) {
    return this.registryService.isPropertyVerified(propertyId);
  }
}
