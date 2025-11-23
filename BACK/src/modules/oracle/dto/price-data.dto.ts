import { IsString, IsNumber, IsOptional, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PriceDataDto {
  @ApiProperty({ description: 'Asset symbol (XLM, USDC, BTC, etc.)', example: 'XLM' })
  @IsString()
  asset: string;

  @ApiProperty({ description: 'Price in USD with 7 decimals', example: 1200000 })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({ description: 'Timestamp of price data', example: 1700000000 })
  @IsNumber()
  timestamp: number;

  @ApiProperty({ description: 'Confidence level in basis points (100 = 1%)', example: 100 })
  @IsNumber()
  @Min(0)
  confidence: number;
}

export class GetPriceDto {
  @ApiProperty({ description: 'Asset symbol', example: 'XLM' })
  @IsString()
  asset: string;
}

export class UpdatePriceDto {
  @ApiProperty({ description: 'Asset symbol', example: 'XLM' })
  @IsString()
  asset: string;

  @ApiProperty({ description: 'Price in USD with 7 decimals', example: 1200000 })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({ description: 'Timestamp of price data', example: 1700000000 })
  @IsNumber()
  timestamp: number;

  @ApiProperty({ description: 'Confidence level in basis points', example: 100 })
  @IsNumber()
  @Min(0)
  confidence: number;
}

export class ConvertPriceDto {
  @ApiProperty({ description: 'Source asset symbol', example: 'XLM' })
  @IsString()
  fromAsset: string;

  @ApiProperty({ description: 'Target asset symbol', example: 'USDC' })
  @IsString()
  toAsset: string;

  @ApiProperty({ description: 'Amount to convert', example: 100 })
  @IsNumber()
  @Min(0)
  amount: number;
}

export class PriceResponseDto {
  @ApiProperty()
  asset: string;

  @ApiProperty({ description: 'Price in USD' })
  price: number;

  @ApiProperty({ description: 'Price formatted for display' })
  priceFormatted: string;

  @ApiProperty()
  timestamp: number;

  @ApiProperty({ description: 'Age of price data in seconds' })
  age: number;

  @ApiProperty()
  confidence: number;

  @ApiProperty({ description: 'Whether price is stale (> 1 hour)' })
  isStale: boolean;
}

export class ConvertPriceResponseDto {
  @ApiProperty()
  fromAsset: string;

  @ApiProperty()
  toAsset: string;

  @ApiProperty()
  amount: number;

  @ApiProperty()
  convertedAmount: number;

  @ApiProperty()
  fromPrice: number;

  @ApiProperty()
  toPrice: number;

  @ApiProperty()
  rate: number;
}
