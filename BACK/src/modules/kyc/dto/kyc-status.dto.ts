import { ApiProperty } from '@nestjs/swagger';
import { KYCStatus, KYCLevel } from '../entities/kyc-verification.entity';

export class KYCStatusDTO {
  @ApiProperty({
    description: 'Estado actual del KYC',
    enum: KYCStatus
  })
  status: KYCStatus;

  @ApiProperty({
    description: 'Nivel de KYC',
    enum: KYCLevel
  })
  level: KYCLevel;

  @ApiProperty({
    description: 'Límite de transacciones mensuales en USD'
  })
  transactionLimit: number;

  @ApiProperty({
    description: 'Fecha de completación'
  })
  completedAt?: Date;

  @ApiProperty({
    description: 'Razón del rechazo (si aplica)'
  })
  rejectionReason?: string;

  @ApiProperty({
    description: 'Número de reintentos'
  })
  retryCount: number;

  @ApiProperty({
    description: 'Fecha de expiración de la sesión'
  })
  expiresAt: Date;
}
