import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, Length, Matches } from 'class-validator';

export class ChallengeRequestDto {
  @ApiProperty({
    description: 'Stellar public key (G...)',
    example: 'GAJCCCRIRXAYEU2XHYWUC2O2FXVYVCBYBHGZFQUZAX5FD5OCWXQJB47K',
  })
  @IsString()
  @IsNotEmpty()
  @Length(56, 56)
  @Matches(/^G[A-Z0-9]{55}$/, {
    message: 'Invalid Stellar public key format',
  })
  publicKey: string;
}

export class VerifySignatureDto {
  @ApiProperty({
    description: 'Stellar public key (G...)',
    example: 'GAJCCCRIRXAYEU2XHYWUC2O2FXVYVCBYBHGZFQUZAX5FD5OCWXQJB47K',
  })
  @IsString()
  @IsNotEmpty()
  @Length(56, 56)
  @Matches(/^G[A-Z0-9]{55}$/, {
    message: 'Invalid Stellar public key format',
  })
  publicKey: string;

  @ApiProperty({
    description: 'Signature of the challenge (hex encoded)',
    example: '3a4f5e6d7c8b9a0e1f2d3c4b5a6f7e8d9c0b1a2f3e4d5c6b7a8f9e0d1c2b3a4f...',
  })
  @IsString()
  @IsNotEmpty()
  signature: string;

  @ApiProperty({
    description: 'Challenge to verify (hex encoded)',
    example: '1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b',
  })
  @IsString()
  @IsNotEmpty()
  challenge: string;
}

export class ChallengeResponseDto {
  @ApiProperty({
    description: 'Challenge nonce to sign with wallet',
    example: '1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b',
  })
  challenge: string;

  @ApiProperty({
    description: 'Challenge expiration timestamp',
    example: '2025-11-13T18:30:00.000Z',
  })
  expiresAt: Date;
}

export class VerifyResponseDto {
  @ApiProperty({
    description: 'Session token for authentication',
    example: 'a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2',
  })
  sessionToken: string;

  @ApiProperty({
    description: 'User information',
  })
  user: {
    stellarAddress: string;
    email: string;
    userType: string;
    kycStatus: string;
  };
}
