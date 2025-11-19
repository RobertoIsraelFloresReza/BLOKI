import { Controller, Get, Post, Body, Param, ParseIntPipe, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { EscrowService } from './escrow.service';
import { LockFundsDto, ReleaseFundsDto, RefundEscrowDto } from './dto';

@ApiTags('Escrow')
@Controller('escrow')
export class EscrowController {
  constructor(private readonly escrowService: EscrowService) {}

  @Post('lock')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Lock funds in escrow for a transaction',
    description: 'Creates an escrow transaction where funds are locked until released by buyer or refunded by seller',
  })
  @ApiResponse({
    status: 201,
    description: 'Funds locked successfully',
    schema: {
      example: {
        txHash: 'abc123...xyz',
        escrowId: 1698765432,
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Invalid parameters or transaction failed' })
  async lockFunds(@Body() dto: LockFundsDto) {
    return this.escrowService.lockFunds(dto);
  }

  @Post('release')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Release escrowed funds to seller',
    description: 'Buyer authorizes the release of escrowed funds to the seller',
  })
  @ApiResponse({
    status: 200,
    description: 'Funds released successfully',
    schema: {
      example: {
        txHash: 'abc123...xyz',
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Invalid escrow ID or unauthorized' })
  async releaseToSeller(@Body() dto: ReleaseFundsDto) {
    return this.escrowService.releaseToSeller(dto);
  }

  @Post('refund')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Refund escrowed funds to buyer',
    description: 'Seller authorizes the refund of escrowed funds back to the buyer',
  })
  @ApiResponse({
    status: 200,
    description: 'Funds refunded successfully',
    schema: {
      example: {
        txHash: 'abc123...xyz',
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Invalid escrow ID or unauthorized' })
  async refundToBuyer(@Body() dto: RefundEscrowDto) {
    return this.escrowService.refundToBuyer(dto);
  }

  @Get(':escrowId')
  @ApiOperation({
    summary: 'Get escrow details',
    description: 'Retrieve complete information about an escrow transaction',
  })
  @ApiParam({ name: 'escrowId', description: 'Escrow ID', example: 1698765432 })
  @ApiResponse({
    status: 200,
    description: 'Escrow information retrieved successfully',
    schema: {
      example: {
        buyer: 'GBXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
        seller: 'GCXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
        amount: 1000.50,
        unlockTime: 1698765432,
        status: 'locked',
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Escrow not found' })
  async getEscrowInfo(@Param('escrowId', ParseIntPipe) escrowId: number) {
    return this.escrowService.getEscrowInfo(escrowId);
  }

  @Get(':escrowId/status')
  @ApiOperation({
    summary: 'Get escrow status',
    description: 'Get the current status of an escrow transaction',
  })
  @ApiParam({ name: 'escrowId', description: 'Escrow ID', example: 1698765432 })
  @ApiResponse({
    status: 200,
    description: 'Escrow status retrieved successfully',
    schema: {
      example: {
        status: 'locked',
        timedOut: false,
      },
    },
  })
  async getStatus(@Param('escrowId', ParseIntPipe) escrowId: number) {
    return this.escrowService.getEscrowStatus(escrowId);
  }

  @Get(':escrowId/timed-out')
  @ApiOperation({
    summary: 'Check if escrow is timed out',
    description: 'Verify if the escrow has passed its unlock time',
  })
  @ApiParam({ name: 'escrowId', description: 'Escrow ID', example: 1698765432 })
  @ApiResponse({
    status: 200,
    description: 'Timeout status retrieved successfully',
    schema: {
      example: {
        escrowId: 1698765432,
        timedOut: false,
      },
    },
  })
  async isTimedOut(@Param('escrowId', ParseIntPipe) escrowId: number) {
    const timedOut = await this.escrowService.isTimedOut(escrowId);
    return { escrowId, timedOut };
  }
}
