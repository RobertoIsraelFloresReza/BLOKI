import {
  Controller,
  Post,
  Get,
  Query,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { AnchorsService } from './anchors.service';
import { DepositDto } from './dto/deposit.dto';
import { WithdrawDto } from './dto/withdraw.dto';

@ApiTags('Anchors (SEP-24)')
@Controller('anchors')
export class AnchorsController {
  constructor(private readonly anchorsService: AnchorsService) {}

  @Get('sep24/info')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'SEP-24: Get anchor information and supported assets' })
  @ApiResponse({
    status: 200,
    description: 'Anchor info retrieved successfully',
    schema: {
      example: {
        deposit: {
          USD: {
            enabled: true,
            fee_fixed: 5,
            fee_percent: 0.5,
            min_amount: 10,
            max_amount: 10000,
          },
        },
        withdraw: {
          USD: {
            enabled: true,
            fee_fixed: 5,
            fee_percent: 0.5,
            min_amount: 10,
            max_amount: 10000,
          },
        },
      },
    },
  })
  getInfo() {
    return this.anchorsService.getInfo();
  }

  @Get('sep24/transactions/deposit/interactive')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'SEP-24: Initiate interactive deposit flow' })
  @ApiQuery({ name: 'account', required: true, description: 'Stellar account address' })
  @ApiQuery({ name: 'asset_code', required: true, description: 'Asset to deposit' })
  @ApiQuery({ name: 'amount', required: false, description: 'Amount to deposit' })
  @ApiQuery({ name: 'lang', required: false, description: 'Language code (ISO 639-1)' })
  @ApiQuery({ name: 'email_address', required: false, description: 'User email' })
  @ApiQuery({ name: 'on_change_callback', required: false, description: 'Callback URL' })
  @ApiResponse({
    status: 200,
    description: 'Interactive deposit URL generated',
    schema: {
      example: {
        type: 'interactive_customer_info_needed',
        url: 'https://anchor.example.com/deposit/abc123',
        id: 'abc123',
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Invalid request' })
  async depositInteractive(@Query() query: DepositDto) {
    if (!query.account || !query.asset_code) {
      throw new BadRequestException('account and asset_code are required');
    }
    return this.anchorsService.depositInteractive(query);
  }

  @Post('sep24/transactions/deposit/interactive')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'SEP-24: Initiate interactive deposit flow (POST)' })
  @ApiResponse({ status: 200, description: 'Interactive deposit URL generated' })
  async depositInteractivePost(@Body() dto: DepositDto) {
    return this.anchorsService.depositInteractive(dto);
  }

  @Get('sep24/transactions/withdraw/interactive')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'SEP-24: Initiate interactive withdrawal flow' })
  @ApiQuery({ name: 'account', required: true, description: 'Stellar account address' })
  @ApiQuery({ name: 'asset_code', required: true, description: 'Asset to withdraw' })
  @ApiQuery({ name: 'amount', required: false, description: 'Amount to withdraw' })
  @ApiQuery({ name: 'type', required: false, description: 'Withdrawal type' })
  @ApiQuery({ name: 'dest', required: false, description: 'Destination account' })
  @ApiQuery({ name: 'dest_extra', required: false, description: 'Additional destination info' })
  @ApiQuery({ name: 'lang', required: false, description: 'Language code (ISO 639-1)' })
  @ApiQuery({ name: 'on_change_callback', required: false, description: 'Callback URL' })
  @ApiResponse({
    status: 200,
    description: 'Interactive withdrawal URL generated',
    schema: {
      example: {
        type: 'interactive_customer_info_needed',
        url: 'https://anchor.example.com/withdraw/abc123',
        id: 'abc123',
        account_id: 'GABC123...',
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Invalid request' })
  async withdrawInteractive(@Query() query: WithdrawDto) {
    if (!query.account || !query.asset_code) {
      throw new BadRequestException('account and asset_code are required');
    }
    return this.anchorsService.withdrawInteractive(query);
  }

  @Post('sep24/transactions/withdraw/interactive')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'SEP-24: Initiate interactive withdrawal flow (POST)' })
  @ApiResponse({ status: 200, description: 'Interactive withdrawal URL generated' })
  async withdrawInteractivePost(@Body() dto: WithdrawDto) {
    return this.anchorsService.withdrawInteractive(dto);
  }

  @Get('sep24/transaction')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'SEP-24: Get transaction status' })
  @ApiQuery({ name: 'id', required: true, description: 'Transaction ID' })
  @ApiQuery({ name: 'stellar_transaction_id', required: false, description: 'Stellar tx hash' })
  @ApiQuery({ name: 'external_transaction_id', required: false, description: 'External tx ID' })
  @ApiResponse({
    status: 200,
    description: 'Transaction status retrieved',
    schema: {
      example: {
        transaction: {
          id: 'abc123',
          kind: 'deposit',
          status: 'completed',
          amount_in: '100.0000000',
          amount_out: '99.5000000',
          amount_fee: '0.5000000',
          started_at: '2024-03-20T10:00:00Z',
          completed_at: '2024-03-20T11:00:00Z',
        },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Transaction not found' })
  async getTransaction(
    @Query('id') id?: string,
    @Query('stellar_transaction_id') stellarTxId?: string,
    @Query('external_transaction_id') externalTxId?: string,
  ) {
    if (!id && !stellarTxId && !externalTxId) {
      throw new BadRequestException('Must provide id, stellar_transaction_id, or external_transaction_id');
    }

    // For now, only support lookup by id
    if (!id) {
      throw new BadRequestException('Only id lookup is currently supported');
    }

    return this.anchorsService.getTransaction(id);
  }

  @Get('sep24/transactions')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'SEP-24: Get transactions for an account' })
  @ApiQuery({ name: 'account', required: true, description: 'Stellar account address' })
  @ApiQuery({ name: 'asset_code', required: false, description: 'Filter by asset' })
  @ApiQuery({ name: 'limit', required: false, description: 'Max results (default: 20)' })
  @ApiResponse({
    status: 200,
    description: 'Transactions retrieved',
    schema: {
      example: {
        transactions: [
          {
            id: 'abc123',
            kind: 'deposit',
            status: 'completed',
            amount_in: '100.0000000',
            amount_out: '99.5000000',
            amount_fee: '0.5000000',
          },
        ],
      },
    },
  })
  async getTransactions(
    @Query('account') account: string,
    @Query('asset_code') assetCode?: string,
    @Query('limit') limit?: string,
  ) {
    if (!account) {
      throw new BadRequestException('account is required');
    }

    const limitNum = limit ? parseInt(limit, 10) : 20;

    return this.anchorsService.getTransactions(account, assetCode, limitNum);
  }

  // Admin endpoint for testing
  @Post('admin/cleanup-expired')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Cleanup expired transactions (Admin only)' })
  @ApiResponse({ status: 200, description: 'Cleanup completed' })
  // @UseGuards(AdminGuard) // Uncomment when admin guard is implemented
  async cleanupExpiredTransactions() {
    const count = await this.anchorsService.cleanupExpiredTransactions();
    return {
      success: true,
      expiredCount: count,
    };
  }
}
