import { IsString, IsNumber, Min, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class BuyTokensDto {
  @ApiProperty({ example: 12345 })
  @IsNumber()
  @Min(1)
  listingId: number;

  @ApiProperty({ example: 5 })
  @IsNumber()
  @Min(0.0000001)
  amount: number;

  @ApiProperty({ example: 'SABC...' })
  @IsString()
  @IsNotEmpty()
  buyerSecretKey: string;
}
