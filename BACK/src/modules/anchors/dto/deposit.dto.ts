import { IsString, IsNotEmpty, IsOptional, IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class DepositDto {
  @ApiProperty({
    description: 'Stellar account address',
    example: 'GABC123...',
  })
  @IsString()
  @IsNotEmpty()
  account: string;

  @ApiProperty({
    description: 'Asset code to deposit',
    example: 'USD',
  })
  @IsString()
  @IsNotEmpty()
  asset_code: string;

  @ApiProperty({
    description: 'Amount to deposit',
    example: '100.50',
    required: false,
  })
  @IsOptional()
  @IsString()
  amount?: string;

  @ApiProperty({
    description: 'Language for UI (ISO 639-1)',
    example: 'en',
    required: false,
  })
  @IsOptional()
  @IsString()
  lang?: string;

  @ApiProperty({
    description: 'Email address',
    example: 'user@example.com',
    required: false,
  })
  @IsOptional()
  @IsString()
  email_address?: string;

  @ApiProperty({
    description: 'Callback URL after completion',
    example: 'https://app.example.com/deposit-complete',
    required: false,
  })
  @IsOptional()
  @IsString()
  on_change_callback?: string;
}
