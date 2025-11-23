import { IsString, IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SwapQuoteDto {
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
    description: 'Amount of property tokens to swap (with 7 decimals)',
    example: 100,
    minimum: 1,
  })
  @IsNumber()
  @Min(0.0000001)
  amountIn: number;
}

export class SwapQuoteResponseDto {
  @ApiProperty({
    description: 'Expected amount out in target token',
    example: 95.5,
  })
  amountOut: number;

  @ApiProperty({
    description: 'Swap path (array of token addresses)',
    example: ['PROPERTY_TOKEN_ADDRESS', 'USDC_ADDRESS'],
  })
  path: string[];

  @ApiProperty({
    description: 'Price impact percentage',
    example: 0.12,
  })
  priceImpact: number;

  @ApiProperty({
    description: 'Slippage tolerance percentage',
    example: 0.5,
  })
  slippage: number;
}
