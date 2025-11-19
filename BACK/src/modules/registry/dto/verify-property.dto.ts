import { IsString, IsNumber, IsPositive } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VerifyPropertyDto {
  @ApiProperty({
    description: 'Admin secret key for authorization',
    example: 'SBXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
  })
  @IsString()
  adminSecretKey: string;

  @ApiProperty({
    description: 'Property ID to verify',
    example: 12345,
  })
  @IsNumber()
  @IsPositive()
  propertyId: number;
}
