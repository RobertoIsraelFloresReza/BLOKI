import { IsString, IsOptional, IsBoolean, IsNumber, Min } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdatePropertyDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  address?: string;

  @ApiPropertyOptional()
  @IsNumber()
  @Min(0)
  @IsOptional()
  valuation?: number;

  @ApiPropertyOptional()
  @IsNumber()
  @Min(1)
  @IsOptional()
  totalSupply?: number;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  legalOwner?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  valuationDocument?: string;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  evaluatorId?: number;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  verificationId?: string;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  verified?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  metadata?: any;
}
