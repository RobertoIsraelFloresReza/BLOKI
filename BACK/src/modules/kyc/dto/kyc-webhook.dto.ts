import { IsString, IsEnum, IsObject, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { KYCStatus } from '../entities/kyc-verification.entity';

export class KYCWebhookDTO {
  @ApiProperty({
    description: 'ID de sesión KYC'
  })
  @IsString()
  sessionId: string;

  @ApiProperty({
    description: 'Estado de la verificación',
    enum: KYCStatus
  })
  @IsEnum(KYCStatus)
  status: KYCStatus;

  @ApiProperty({
    description: 'Datos del usuario verificado'
  })
  @IsObject()
  userData: {
    firstName: string;
    lastName: string;
    documentNumber?: string;
    country?: string;
    dateOfBirth?: string;
  };

  @ApiProperty({
    description: 'Razón del rechazo (si aplica)',
    required: false
  })
  @IsOptional()
  @IsString()
  rejectionReason?: string;

  @ApiProperty({
    description: 'ID de verificación en el proveedor'
  })
  @IsString()
  externalVerificationId: string;

  @ApiProperty({
    description: 'Firma del webhook'
  })
  @IsString()
  signature: string;
}
