import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CancelListingDto {
  @ApiProperty({ example: 'SABC...' })
  @IsString()
  @IsNotEmpty()
  sellerSecretKey: string;
}
