import { IsString, IsNumber, IsArray, ValidateNested, IsPositive, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class OwnerPercentage {
  @ApiProperty({
    description: 'Owner Stellar address',
    example: 'GBXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
  })
  @IsString()
  owner: string;

  @ApiProperty({
    description: 'Ownership percentage (0-100)',
    example: 25.5,
    minimum: 0,
    maximum: 100,
  })
  @IsNumber()
  @Min(0)
  @Max(100)
  percentage: number;
}

export class UpdateOwnershipDto {
  @ApiProperty({
    description: 'Admin secret key for authorization',
    example: 'SBXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
  })
  @IsString()
  adminSecretKey: string;

  @ApiProperty({
    description: 'Property ID',
    example: 12345,
  })
  @IsNumber()
  @IsPositive()
  propertyId: number;

  @ApiProperty({
    description: 'Array of owners with their percentages',
    type: [OwnerPercentage],
    example: [
      { owner: 'GBXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX', percentage: 60 },
      { owner: 'GCXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX', percentage: 40 },
    ],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OwnerPercentage)
  owners: OwnerPercentage[];
}
