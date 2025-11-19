import {
  Controller,
  Post,
  Get,
  Body,
  Headers,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiHeader,
} from '@nestjs/swagger';
import { StellarAuthService } from './stellar-auth.service';
import {
  ChallengeRequestDto,
  VerifySignatureDto,
  ChallengeResponseDto,
  VerifyResponseDto,
} from './dto/stellar-auth.dto';
import { StellarAuthGuard } from './guards/stellar-auth.guard';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('Stellar Authentication')
@Controller('auth/stellar')
export class StellarAuthController {
  constructor(private readonly stellarAuthService: StellarAuthService) {}

  @Public()
  @Post('challenge')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Request authentication challenge',
    description:
      'Generate a challenge nonce for the user to sign with their Stellar wallet',
  })
  @ApiResponse({
    status: 200,
    description: 'Challenge generated successfully',
    type: ChallengeResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid Stellar public key format',
  })
  async getChallenge(
    @Body() dto: ChallengeRequestDto,
  ): Promise<ChallengeResponseDto> {
    return await this.stellarAuthService.generateChallenge(dto.publicKey);
  }

  @Public()
  @Post('verify')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Verify signature and authenticate',
    description:
      'Verify the signed challenge and create an authenticated session',
  })
  @ApiResponse({
    status: 200,
    description: 'Authentication successful',
    type: VerifyResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid signature or expired challenge',
  })
  async verifySignature(
    @Body() dto: VerifySignatureDto,
  ): Promise<VerifyResponseDto> {
    const { sessionToken, user } =
      await this.stellarAuthService.verifySignature(dto);

    return {
      sessionToken,
      user: {
        stellarAddress: user.stellarAddress,
        email: user.email,
        userType: user.userType,
        kycStatus: user.kycStatus,
      },
    };
  }

  @UseGuards(StellarAuthGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Logout user',
    description: 'Invalidate the current session',
  })
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer <session_token>',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Logout successful',
  })
  async logout(@Headers('authorization') authHeader: string): Promise<{
    message: string;
  }> {
    const token = authHeader.startsWith('Bearer ')
      ? authHeader.substring(7)
      : authHeader;

    await this.stellarAuthService.invalidateSession(token);

    return {
      message: 'Logout successful',
    };
  }

  @UseGuards(StellarAuthGuard)
  @Get('profile')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get authenticated user profile',
    description: 'Retrieve profile information for the authenticated user',
  })
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer <session_token>',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'User profile retrieved successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid or expired session',
  })
  async getProfile(@Headers('authorization') authHeader: string): Promise<any> {
    const token = authHeader.startsWith('Bearer ')
      ? authHeader.substring(7)
      : authHeader;

    const user = await this.stellarAuthService.getUserProfile(token);

    return {
      stellarAddress: user.stellarAddress,
      email: user.email,
      userType: user.userType,
      kycStatus: user.kycStatus,
      fullName: user.fullName,
      phoneNumber: user.phoneNumber,
      country: user.country,
      metadata: user.metadata,
      createdAt: user.createdAt,
    };
  }

  @UseGuards(StellarAuthGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Refresh session',
    description: 'Extend the current session TTL',
  })
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer <session_token>',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Session refreshed successfully',
  })
  async refreshSession(@Headers('authorization') authHeader: string): Promise<{
    message: string;
  }> {
    const token = authHeader.startsWith('Bearer ')
      ? authHeader.substring(7)
      : authHeader;

    await this.stellarAuthService.refreshSession(token);

    return {
      message: 'Session refreshed successfully',
    };
  }
}
