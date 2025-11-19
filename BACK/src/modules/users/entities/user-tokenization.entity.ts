import {
  Entity,
  Column,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

export enum UserType {
  PROPERTY_OWNER = 'PROPERTY_OWNER',
  INVESTOR = 'INVESTOR',
  BOTH = 'BOTH',
}

export enum KYCStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  VERIFIED = 'VERIFIED',
  REJECTED = 'REJECTED',
}

@Entity('users_tokenization')
export class UserTokenization {
  @PrimaryColumn({ type: 'varchar', length: 56 })
  stellarAddress: string; // G... address

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({
    type: 'enum',
    enum: UserType,
    default: UserType.INVESTOR,
  })
  userType: UserType;

  @Column({
    type: 'enum',
    enum: KYCStatus,
    default: KYCStatus.PENDING,
  })
  kycStatus: KYCStatus;

  @Column({ type: 'timestamp', nullable: true })
  kycVerificationDate: Date;

  @Column({ type: 'jsonb', nullable: true })
  kycData: {
    biometricHash?: string;
    verificationId?: string;
    curp?: string;
    documentNumber?: string;
  };

  @Column({ type: 'varchar', length: 255, nullable: true })
  fullName: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  phoneNumber: string;

  @Column({ type: 'varchar', length: 10, nullable: true })
  country: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata: {
    profileImage?: string;
    bio?: string;
    location?: {
      city?: string;
      state?: string;
      country?: string;
    };
  };

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;
}
