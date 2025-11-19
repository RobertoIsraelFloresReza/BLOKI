import { IsString, IsNumber, IsOptional, Min, IsNotEmpty } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePropertyDto {
  @ApiProperty({ example: 'Casa en Polanco' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'PROP-001' })
  @IsString()
  @IsNotEmpty()
  propertyId: string;

  @ApiPropertyOptional({ example: 'Casa de 3 recámaras con jardín' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ example: 'Av. Polanco 123, CDMX' })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiProperty({ example: 100 })
  @IsNumber()
  @Min(1)
  totalSupply: number;

  @ApiProperty({ example: 5000000 })
  @IsNumber()
  @Min(0)
  valuation: number;

  @ApiPropertyOptional({ example: 'Juan Pérez' })
  @IsString()
  @IsOptional()
  legalOwner?: string;

  @ApiProperty({ example: 'GABC...' })
  @IsString()
  @IsNotEmpty()
  adminSecretKey: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  metadata?: string;
}
