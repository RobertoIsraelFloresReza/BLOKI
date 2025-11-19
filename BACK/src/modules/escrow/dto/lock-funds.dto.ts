import { IsString, IsNumber, IsPositive, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LockFundsDto {
  @ApiProperty({
    description: 'Secret key of the buyer who is locking funds',
    example: 'SBXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
  })
  @IsString()
  buyerSecretKey: string;

  @ApiProperty({
    description: 'Public address of the seller',
    example: 'GBXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
  })
  @IsString()
  sellerAddress: string;

  @ApiProperty({
    description: 'Amount to lock in escrow (in USDC)',
    example: 1000.50,
  })
  @IsNumber()
  @IsPositive()
  amount: number;

  @ApiProperty({
    description: 'Lock duration in days',
    example: 7,
    minimum: 1,
  })
  @IsNumber()
  @Min(1)
  lockDurationDays: number;
}

export class ReleaseFundsDto {
  @ApiProperty({
    description: 'Secret key of the buyer who authorized the release',
    example: 'SBXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
  })
  @IsString()
  buyerSecretKey: string;

  @ApiProperty({
    description: 'Escrow ID to release',
    example: 1698765432,
  })
  @IsNumber()
  @IsPositive()
  escrowId: number;
}

export class RefundEscrowDto {
  @ApiProperty({
    description: 'Secret key of the seller who authorizes refund',
    example: 'SBXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
  })
  @IsString()
  sellerSecretKey: string;

  @ApiProperty({
    description: 'Escrow ID to refund',
    example: 1698765432,
  })
  @IsNumber()
  @IsPositive()
  escrowId: number;
}

export class GetEscrowDto {
  @ApiProperty({
    description: 'Escrow ID to query',
    example: 1698765432,
  })
  @IsNumber()
  @IsPositive()
  escrowId: number;
}
