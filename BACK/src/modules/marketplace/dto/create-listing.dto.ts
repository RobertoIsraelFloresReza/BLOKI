import { IsString, IsNumber, Min, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateListingDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  @Min(1)
  propertyId: number;

  @ApiProperty({ example: 10 })
  @IsNumber()
  @Min(0.0000001)
  amount: number;

  @ApiProperty({ example: 50000 })
  @IsNumber()
  @Min(1)
  pricePerToken: number;

  @ApiProperty({ example: 'SABC...' })
  @IsString()
  @IsNotEmpty()
  sellerSecretKey: string;

  @ApiPropertyOptional({ example: 30 })
  @IsNumber()
  @IsOptional()
  expirationDays?: number;
}
