import { Entity, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Base } from '../../base/entity/base.entity';
import { UserEntity } from '../../user/entity/user.entity';

export enum KYCLevel {
  LEVEL_1 = 1,
  LEVEL_2 = 2,
  LEVEL_3 = 3,
}

export enum KYCStatus {
  NOT_STARTED = 'not_started',
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  EXPIRED = 'expired',
}

@Entity('kyc_verification')
@Index(['userId', 'createdAt'])
@Index(['status'])
export class KYCVerificationEntity extends Base {
  @ApiProperty({
    description: 'Usuario asociado a esta verificación',
    type: Number
  })
  @Column({ type: 'integer' })
  userId: number;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'userId' })
  user: UserEntity;

  @ApiProperty({
    description: 'Estado actual de la verificación',
    enum: KYCStatus
  })
  @Column({
    type: 'enum',
    enum: KYCStatus,
    default: KYCStatus.NOT_STARTED
  })
  status: KYCStatus;

  @ApiProperty({
    description: 'Nivel de KYC requerido',
    enum: KYCLevel
  })
  @Column({
    type: 'enum',
    enum: KYCLevel,
    default: KYCLevel.LEVEL_2
  })
  level: KYCLevel;

  @ApiProperty({
    description: 'Proveedor de verificación KYC',
    example: 'synaps'
  })
  @Column({ type: 'varchar', length: 50 })
  provider: string;

  @ApiProperty({
    description: 'ID de sesión en el proveedor externo',
    example: 'session_abc123'
  })
  @Column({ type: 'varchar', length: 255, unique: true })
  sessionId: string;

  @ApiProperty({
    description: 'URL para que el usuario complete verificación',
    example: 'https://verify.provider.com/session_abc123'
  })
  @Column({ type: 'varchar', length: 500, nullable: true })
  verificationUrl: string;

  @ApiProperty({
    description: 'Datos de verificación (JSON)',
    example: '{"firstName":"Juan","lastName":"Perez","documentNumber":"ABC123"}'
  })
  @Column({ type: 'text', nullable: true })
  verificationData: string;

  @ApiProperty({
    description: 'Razón del rechazo (si aplica)',
    example: 'Documento expirado'
  })
  @Column({ type: 'text', nullable: true })
  rejectionReason: string;

  @ApiProperty({
    description: 'Número de reintentos',
    example: 1
  })
  @Column({ type: 'integer', default: 0 })
  retryCount: number;

  @ApiProperty({
    description: 'ID de verificación del proveedor',
    example: 'ver_xyz789'
  })
  @Column({ type: 'varchar', length: 255, nullable: true })
  externalVerificationId: string;

  @ApiProperty({
    description: 'Fecha de completación de la verificación',
    type: Date,
    required: false
  })
  @Column({ type: 'timestamp', nullable: true })
  completedAt: Date;

  @ApiProperty({
    description: 'Fecha de expiración de la sesión',
    type: Date
  })
  @Column({ type: 'timestamp' })
  expiresAt: Date;

  @ApiProperty({
    description: 'Firma del webhook para validación',
    required: false
  })
  @Column({ type: 'varchar', length: 500, nullable: true })
  webhookSignature: string;
}
