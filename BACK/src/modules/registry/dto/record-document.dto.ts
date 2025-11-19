import { IsString, IsNumber, IsPositive } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RecordDocumentDto {
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
    description: 'Document hash (SHA-256 or similar)',
    example: 'a3c5e7f9b2d4a6c8e1f3b5d7a9c2e4f6b8d1a3c5e7f9b2d4a6c8e1f3b5d7a9c2',
  })
  @IsString()
  documentHash: string;
}
