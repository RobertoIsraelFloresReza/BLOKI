import { IsEnum, IsNumber, IsUrl, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { KYCLevel } from '../entities/kyc-verification.entity';

export class StartKYCDTO {
  @ApiProperty({
    description: 'ID del usuario',
    example: 123
  })
  @IsNumber()
  userId: number;

  @ApiProperty({
    description: 'Nivel de KYC requerido',
    enum: KYCLevel,
    example: KYCLevel.LEVEL_2
  })
  @IsEnum(KYCLevel)
  level: KYCLevel;

  @ApiProperty({
    description: 'País de residencia del usuario',
    example: 'Mexico'
  })
  @IsOptional()
  country?: string;

  @ApiProperty({
    description: 'URL a redireccionar después de completar',
    example: 'https://tuapp.com/kyc-success'
  })
  @IsOptional()
  @IsUrl()
  redirectUrl?: string;
}
