import { IsString, IsOptional, IsUrl, IsEmail, IsNumber, Min, Max, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateEvaluatorDto {
  @ApiProperty({ example: 'Real Estate Appraisers LLC' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ example: 'Leading property valuation company with 20+ years experience' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ example: 'https://storage.com/logos/evaluator1.png' })
  @IsUrl()
  @IsOptional()
  logo?: string;

  @ApiPropertyOptional({ example: 'https://realestateappraisers.com' })
  @IsUrl()
  @IsOptional()
  website?: string;

  @ApiPropertyOptional({ example: 'contact@realestateappraisers.com' })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({ example: '+1-555-0123' })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiPropertyOptional({ example: 'United States' })
  @IsString()
  @IsOptional()
  country?: string;

  @ApiPropertyOptional({ example: '["USPAP Certified", "State Licensed #12345"]' })
  @IsString()
  @IsOptional()
  certifications?: string;

  @ApiPropertyOptional({ example: 4.8 })
  @IsNumber()
  @Min(0)
  @Max(5)
  @IsOptional()
  rating?: number;

  @ApiPropertyOptional({ example: 150 })
  @IsNumber()
  @Min(0)
  @IsOptional()
  propertiesEvaluated?: number;

  @ApiPropertyOptional({ example: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
