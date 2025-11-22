import { Entity, Column } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Base } from '../../base/entity/base.entity';
import { stringConstants } from '../../../utils/string.constant';

@Entity('user')
export class UserEntity extends Base {

  @ApiProperty({
    description: 'Stellar public key',
    example: 'GABC...',
    type: String,
    required: false
  })
  @Column({ type: 'varchar', length: 56, nullable: true })
  stellarPublicKey: string;

  @ApiProperty({
    description: 'Stellar secret key (encrypted with AES-256-GCM)',
    example: 'iv:authTag:encrypted',
    type: String,
    required: false
  })
  @Column({
    name: 'stellar_secret_key_encrypted',
    type: 'text',
    nullable: true,
    select: false // No incluir en queries por defecto (seguridad)
  })
  stellarSecretKeyEncrypted: string;

  @ApiProperty({
    description: 'Email del usuario',
    example: 'usuario@ejemplo.com',
    type: String
  })
  @Column({
    type: 'varchar',
    unique: true,
    nullable: true
  })
  email: string;

  @ApiProperty({
    description: 'Nombre del usuario',
    example: 'Isaac',
    type: String
  })
  @Column({
    type: 'varchar',
    nullable: false
  })
  name: string;

  @ApiProperty({
    description: 'Apellido del usuario',
    example: 'Jimenez',
    type: String
  })
  @Column({
    name: 'last_name',
    type: 'varchar',
    nullable: false
  })
  lastName: string;

  @ApiProperty({
    description: 'Contraseña del usuario (hash)',
    type: String
  })
  @Column({
    type: 'varchar',
    nullable: true,
    select: false
  })
  password: string;

  @ApiProperty({
    description: 'Número telefónico del usuario',
    example: '5512345678',
    type: String
  })
  @Column({
    name: 'phone_number',
    type: 'varchar',
    nullable: true
  })
  phoneNumber: string;

  @ApiProperty({
    description: 'Rol del usuario en el sistema',
    example: 'USER',
    enum: [
      stringConstants.SUPER_ADMIN,
      stringConstants.DIRECTOR,
      stringConstants.MANAGER,
      stringConstants.EMPLOYEE,
    ]
  })
  @Column({
    type: 'enum',
    enum: [
      stringConstants.SUPER_ADMIN,
      stringConstants.DIRECTOR,
      stringConstants.MANAGER,
      stringConstants.EMPLOYEE,
    ],
    default: stringConstants.EMPLOYEE
  })
  role: string;

  @ApiProperty({
    description: 'Estado del usuario',
    example: 'ACTIVE',
    enum: [stringConstants.STATUS_ACTIVE, stringConstants.STATUS_INACTIVE]
  })
  @Column({
    type: 'enum',
    enum: [stringConstants.STATUS_ACTIVE, stringConstants.STATUS_INACTIVE],
    default: stringConstants.STATUS_ACTIVE
  })
  status: string;

  @ApiProperty({
    description: 'Código de verificación/reseteo',
    example: 'ABC123',
    type: String,
    required: false
  })
  @Column({
    type: 'varchar',
    nullable: true
  })
  code: string;

  @ApiProperty({
    description: 'Fecha de generación del código',
    example: '2024-03-20T14:00:00.000Z',
    type: Date,
    required: false
  })
  @Column({
    name: 'code_generated_at',
    type: 'timestamp',
    nullable: true
  })
  codeCreatedAt: Date;

  @ApiProperty({
    description: 'Estado de verificación KYC',
    example: 'pending',
    enum: ['pending', 'approved', 'rejected', 'not_started'],
    required: false
  })
  @Column({
    type: 'enum',
    enum: ['pending', 'approved', 'rejected', 'not_started'],
    default: 'not_started'
  })
  kycStatus: string;

  @ApiProperty({
    description: 'Metadata de KYC (JSON)',
    example: '{"provider":"synaps","session_id":"abc123"}',
    type: String,
    required: false
  })
  @Column({
    type: 'text',
    nullable: true
  })
  kycMetadata: string;

  @ApiProperty({
    description: 'Fecha de última verificación KYC',
    example: '2024-03-20T14:00:00.000Z',
    type: Date,
    required: false
  })
  @Column({
    name: 'kyc_verified_at',
    type: 'timestamp',
    nullable: true
  })
  kycVerifiedAt: Date;

  @ApiProperty({
    description: 'URL de foto de perfil',
    example: '/uploads/users/avatar-123.jpg',
    type: String,
    required: false
  })
  @Column({
    type: 'varchar',
    nullable: true
  })
  avatarUrl: string;

  @ApiProperty({
    description: 'País de residencia',
    example: 'Mexico',
    type: String,
    required: false
  })
  @Column({
    type: 'varchar',
    length: 100,
    nullable: true
  })
  country: string;

  @ApiProperty({
    description: 'Ciudad de residencia',
    example: 'Ciudad de México',
    type: String,
    required: false
  })
  @Column({
    type: 'varchar',
    length: 100,
    nullable: true
  })
  city: string;

  @ApiProperty({
    description: 'Dirección completa',
    example: 'Av. Reforma 123, Col. Centro',
    type: String,
    required: false
  })
  @Column({
    type: 'varchar',
    length: 500,
    nullable: true
  })
  address: string;
}
