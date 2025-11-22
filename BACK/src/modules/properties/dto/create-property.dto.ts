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

  @ApiPropertyOptional({ example: 'SABC...', description: 'Stellar admin secret key - opcional para crear sin deployment' })
  @IsString()
  @IsOptional()
  adminSecretKey?: string;

  @ApiPropertyOptional({ example: 'https://storage.com/valuation.pdf', description: 'URL del documento de evaluación de la propiedad' })
  @IsString()
  @IsOptional()
  valuationDocument?: string;

  @ApiPropertyOptional({ example: 1, description: 'ID del evaluador certificado' })
  @IsNumber()
  @IsOptional()
  evaluatorId?: number;

  @ApiPropertyOptional({ example: 'VER-2025-001234', description: 'ID de verificación de la evaluación' })
  @IsString()
  @IsOptional()
  verificationId?: string;

  @ApiPropertyOptional({
    example: { bedrooms: 3, bathrooms: 2, area: 120, category: 'houses' },
    description: 'Metadata as object with custom fields'
  })
  @IsOptional()
  metadata?: any;
}
