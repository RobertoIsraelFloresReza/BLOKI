import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

export enum AnchorTransactionType {
  DEPOSIT = 'deposit',
  WITHDRAWAL = 'withdrawal',
}

export enum AnchorTransactionStatus {
  INCOMPLETE = 'incomplete',
  PENDING_USER_TRANSFER_START = 'pending_user_transfer_start',
  PENDING_USR = 'pending_usr', // Alias for pending_user_transfer_start
  PENDING_ANCHOR = 'pending_anchor',
  PENDING_STELLAR = 'pending_stellar',
  PENDING_EXTERNAL = 'pending_external',
  PENDING_TRUST = 'pending_trust',
  PENDING_USER = 'pending_user',
  COMPLETED = 'completed',
  REFUNDED = 'refunded',
  EXPIRED = 'expired',
  ERROR = 'error',
}

@Entity('anchor_transactions')
@Index(['stellarAddress', 'type', 'status'])
export class AnchorTransactionEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 56 })
  @Index()
  stellarAddress: string;

  @Column({
    type: 'enum',
    enum: AnchorTransactionType,
  })
  type: AnchorTransactionType;

  @Column({
    type: 'enum',
    enum: AnchorTransactionStatus,
    default: AnchorTransactionStatus.INCOMPLETE,
  })
  @Index()
  status: AnchorTransactionStatus;

  @Column({ type: 'varchar', length: 10 })
  assetCode: string; // USD, MXN, etc.

  @Column({ type: 'varchar', length: 56, nullable: true })
  assetIssuer: string; // Stellar issuer address

  @Column({ type: 'decimal', precision: 20, scale: 7 })
  amount: string;

  @Column({ type: 'decimal', precision: 20, scale: 7, nullable: true })
  feeFixed: string;

  @Column({ type: 'decimal', precision: 10, scale: 4, nullable: true })
  feePercent: string;

  @Column({ type: 'text', nullable: true })
  interactiveUrl: string; // SEP-24 interactive URL

  @Column({ type: 'varchar', length: 64, nullable: true })
  stellarTxId: string; // Stellar transaction hash

  @Column({ type: 'varchar', length: 255, nullable: true })
  externalTxId: string; // External provider transaction ID

  @Column({ type: 'jsonb', nullable: true })
  from: Record<string, any>; // SEP-24 from field

  @Column({ type: 'jsonb', nullable: true })
  to: Record<string, any>; // SEP-24 to field

  @Column({ type: 'text', nullable: true })
  message: string; // Human-readable message

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any>; // Additional data

  @Column({ type: 'timestamp', nullable: true })
  startedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  completedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  expiresAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
