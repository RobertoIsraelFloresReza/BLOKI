import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { ListingEntity } from './listing.entity';

@Entity('transactions')
export class TransactionEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 64, unique: true })
  @Index()
  txHash: string;

  @Column()
  listingId: number;

  @Column({ type: 'varchar', length: 56 })
  @Index()
  buyerAddress: string;

  @Column({ type: 'varchar', length: 56 })
  @Index()
  sellerAddress: string;

  @Column({ type: 'bigint' })
  amount: string;

  @Column({ type: 'bigint' })
  pricePerToken: string;

  @Column({ type: 'bigint' })
  totalPrice: string;

  @Column({ type: 'varchar', length: 56, nullable: true })
  escrowContractId: string;

  @Column({ type: 'text', nullable: true })
  metadata: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => ListingEntity, (listing) => listing.transactions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'listingId' })
  listing: ListingEntity;
}
