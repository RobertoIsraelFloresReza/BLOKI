import { IsString, IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class TokenizePropertyDto {
  @ApiProperty({ example: 'SABC123...', description: 'Admin secret key for deploying contract' })
  @IsString()
  adminSecretKey: string;

  @ApiProperty({ example: 'PROP-001', description: 'Token symbol' })
  @IsString()
  symbol: string;

  @ApiProperty({ example: 100, description: 'Total supply of tokens', default: 100 })
  @IsNumber()
  @Min(1)
  totalSupply: number = 100;
}
