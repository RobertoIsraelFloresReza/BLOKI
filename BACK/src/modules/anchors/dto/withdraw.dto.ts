import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class WithdrawDto {
  @ApiProperty({
    description: 'Stellar account address',
    example: 'GABC123...',
  })
  @IsString()
  @IsNotEmpty()
  account: string;

  @ApiProperty({
    description: 'Asset code to withdraw',
    example: 'USD',
  })
  @IsString()
  @IsNotEmpty()
  asset_code: string;

  @ApiProperty({
    description: 'Amount to withdraw',
    example: '100.50',
    required: false,
  })
  @IsOptional()
  @IsString()
  amount?: string;

  @ApiProperty({
    description: 'Type of withdrawal (bank_account, cash, mobile_money, etc.)',
    example: 'bank_account',
    required: false,
  })
  @IsOptional()
  @IsString()
  type?: string;

  @ApiProperty({
    description: 'Destination (bank account, phone number, etc.)',
    example: '1234567890',
    required: false,
  })
  @IsOptional()
  @IsString()
  dest?: string;

  @ApiProperty({
    description: 'Additional destination info',
    example: 'SWIFT: ABCDUS33',
    required: false,
  })
  @IsOptional()
  @IsString()
  dest_extra?: string;

  @ApiProperty({
    description: 'Language for UI (ISO 639-1)',
    example: 'en',
    required: false,
  })
  @IsOptional()
  @IsString()
  lang?: string;

  @ApiProperty({
    description: 'Callback URL after completion',
    example: 'https://app.example.com/withdraw-complete',
    required: false,
  })
  @IsOptional()
  @IsString()
  on_change_callback?: string;
}
