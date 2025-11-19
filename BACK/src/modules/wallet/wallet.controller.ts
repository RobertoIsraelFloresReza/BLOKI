import {
  Controller,
  Get,
  Query,
  UseGuards,
  Request,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { WalletService } from './wallet.service';
import { AuthGuard } from '../auth/guard/auth.guard';

@ApiTags('Wallet')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Get('balance')
  @ApiOperation({
    summary: 'Get wallet balance',
    description:
      'Retrieve native and asset balances for authenticated user Stellar account',
  })
  @ApiResponse({
    status: 200,
    description: 'Balance retrieved successfully',
    schema: {
      example: {
        publicKey: 'GABC123...',
        nativeBalance: '1000.0000000',
        assets: [
          {
            assetCode: 'USD',
            assetIssuer: 'GDUKMGUGDZQK6YHYA5Z6AY2G4XDSZPSZ3SW5UN3ARVMO6QSRDWP5YLEX',
            balance: '500.0000000',
          },
        ],
      },
    },
  })
  async getBalance(@Request() req) {
    const stellarPublicKey = req.user.stellarPublicKey;
    return this.walletService.getBalance(stellarPublicKey);
  }

  @Get('transactions')
  @ApiOperation({
    summary: 'Get wallet transaction history',
    description: 'Retrieve paginated transaction history (max 100 per request)',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number (default: 1)',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Results per page (max: 100, default: 20)',
  })
  @ApiResponse({
    status: 200,
    description: 'Transactions retrieved successfully',
    schema: {
      example: {
        data: [
          {
            id: 'abc123',
            type: 'payment',
            from: 'GABC...',
            to: 'GDEF...',
            amount: '100.0000000',
            assetCode: 'XLM',
            createdAt: '2024-03-20T10:00:00Z',
            txHash: 'abc123def456...',
          },
        ],
        meta: {
          page: 1,
          limit: 20,
          total: 45,
          pages: 3,
        },
      },
    },
  })
  async getTransactions(
    @Request() req,
    @Query('page', new ParseIntPipe({ optional: true })) page?: number,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
  ) {
    const stellarPublicKey = req.user.stellarPublicKey;
    const effectivePage = page || 1;
    const effectiveLimit = Math.min(limit || 20, 100); // Max 100

    return this.walletService.getTransactions(
      stellarPublicKey,
      effectivePage,
      effectiveLimit,
    );
  }
}
