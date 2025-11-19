import { IsString, IsNumber, IsPositive } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterPropertyDto {
  @ApiProperty({
    description: 'Admin secret key for authorization',
    example: 'SBXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
  })
  @IsString()
  adminSecretKey: string;

  @ApiProperty({
    description: 'Unique property ID',
    example: 12345,
  })
  @IsNumber()
  @IsPositive()
  propertyId: number;

  @ApiProperty({
    description: 'Legal ID from public registry',
    example: 'RPP-2024-001234',
  })
  @IsString()
  legalId: string;

  @ApiProperty({
    description: 'Owner Stellar address',
    example: 'GBXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
  })
  @IsString()
  ownerAddress: string;

  @ApiProperty({
    description: 'Property valuation in USD',
    example: 250000.00,
  })
  @IsNumber()
  @IsPositive()
  valuation: number;
}
