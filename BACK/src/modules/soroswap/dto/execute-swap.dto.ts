import { IsString, IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ExecuteSwapDto {
  @ApiProperty({
    description: 'Seller secret key for signing transaction',
    example: 'SD4S4GFXXV3NVBXYJTTTURQBOIVQSETT572JPHPUUXTYXXD35XKG6FVQ',
  })
  @IsString()
  sellerSecretKey: string;

  @ApiProperty({
    description: 'Property token contract address',
    example: 'CDHFNDXSSSSKT53SEJDANUBHYIEJO54KFV7QSCMW6UUKWBAF6F5ZPN6I',
  })
  @IsString()
  propertyToken: string;

  @ApiProperty({
    description: 'Target token contract address (USDC)',
    example: 'CA3D5KRYM6CB7OWQ6TWYRR3Z4T7GNZLKERYNZGGA5SOAOPIFY6YQGAXE',
  })
  @IsString()
  targetToken: string;

  @ApiProperty({
    description: 'Amount of property tokens to swap',
    example: 100,
    minimum: 1,
  })
  @IsNumber()
  @Min(0.0000001)
  amountIn: number;

  @ApiProperty({
    description: 'Minimum amount out (slippage protection)',
    example: 95,
    minimum: 1,
  })
  @IsNumber()
  @Min(0.0000001)
  minAmountOut: number;
}

export class ExecuteSwapResponseDto {
  @ApiProperty({
    description: 'Transaction hash',
    example: 'abc123def456...',
  })
  transactionId: string;

  @ApiProperty({
    description: 'Actual amount received',
    example: 96.2,
  })
  amountOut: number;

  @ApiProperty({
    description: 'Success status',
    example: true,
  })
  success: boolean;
}
