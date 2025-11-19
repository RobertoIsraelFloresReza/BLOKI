import { IsString, IsNotEmpty, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { KycProvider } from '../entities/kyc-session.entity';

export class InitiateKycDto {
  @ApiProperty({
    description: 'Stellar address of the user',
    example: 'GABC123...',
  })
  @IsString()
  @IsNotEmpty()
  stellarAddress: string;

  @ApiProperty({
    description: 'KYC provider to use',
    enum: KycProvider,
    default: KycProvider.SYNAPS,
    required: false,
  })
  @IsEnum(KycProvider)
  @IsOptional()
  provider?: KycProvider = KycProvider.SYNAPS;
}
