import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Index,
} from 'typeorm';
import { PropertyEntity } from '../../properties/entities/property.entity';
import { TransactionEntity } from './transaction.entity';

export enum ListingStatus {
  ACTIVE = 'active',
  SOLD = 'sold',
  CANCELLED = 'cancelled',
  EXPIRED = 'expired',
}

@Entity('listings')
@Index(['propertyId', 'status']) // Composite index for get_listings_by_property queries
@Index(['sellerAddress', 'status']) // Composite index for get_user_listings queries
export class ListingEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'bigint', unique: true })
  listingId: string;

  @Column()
  propertyId: number;

  @Column({ type: 'varchar', length: 56 })
  @Index()
  sellerAddress: string;

  @Column({ type: 'bigint' })
  amount: string;

  @Column({ type: 'bigint' })
  initialAmount: string;

  @Column({ type: 'bigint' })
  pricePerToken: string;

  @Column({ type: 'bigint' })
  totalPrice: string;

  @Column({
    type: 'enum',
    enum: ListingStatus,
    default: ListingStatus.ACTIVE,
  })
  @Index()
  status: ListingStatus;

  @Column({ type: 'varchar', length: 64 })
  txHash: string;

  @Column({ type: 'timestamp', nullable: true })
  expiresAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => PropertyEntity, (property) => property.listings, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'propertyId' })
  property: PropertyEntity;

  @OneToMany(() => TransactionEntity, (transaction) => transaction.listing)
  transactions: TransactionEntity[];
}
