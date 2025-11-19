import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

export enum KycProvider {
  SYNAPS = 'synaps',
  MANUAL = 'manual',
}

export enum KycSessionStatus {
  INITIATED = 'initiated',
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  EXPIRED = 'expired',
}

@Entity('kyc_sessions')
@Index(['stellarAddress', 'status'])
export class KycSessionEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 56 })
  @Index()
  stellarAddress: string;

  @Column({
    type: 'enum',
    enum: KycProvider,
    default: KycProvider.SYNAPS,
  })
  provider: KycProvider;

  @Column({ type: 'varchar', length: 255, unique: true })
  sessionId: string; // External provider session ID

  @Column({
    type: 'enum',
    enum: KycSessionStatus,
    default: KycSessionStatus.INITIATED,
  })
  @Index()
  status: KycSessionStatus;

  @Column({ type: 'text', nullable: true })
  redirectUrl: string; // URL for user to complete KYC

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any>; // Provider-specific data

  @Column({ type: 'jsonb', nullable: true })
  verificationData: Record<string, any>; // Verification results

  @Column({ type: 'varchar', length: 255, nullable: true })
  rejectionReason: string;

  @Column({ type: 'timestamp', nullable: true })
  expiresAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  completedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
