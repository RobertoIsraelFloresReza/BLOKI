import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { OwnershipEntity } from '../../ownership/entities/ownership.entity';
import { ListingEntity } from '../../marketplace/entities/listing.entity';

@Entity('properties')
export class PropertyEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  contractId: string;

  @Column()
  propertyId: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  address: string;

  @Column({ type: 'bigint' })
  totalSupply: string;

  @Column({ type: 'bigint' })
  valuation: string;

  @Column({ type: 'int', default: 7 })
  decimals: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  legalOwner: string;

  @Column({ type: 'boolean', default: false })
  verified: boolean;

  @Column({ type: 'varchar', length: 56 })
  adminAddress: string;

  @Column({ type: 'text', nullable: true })
  metadata: string;

  @Column({ type: 'varchar', length: 64, nullable: true })
  registryTxHash: string;

  @Column({ type: 'simple-array', nullable: true })
  images: string[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => OwnershipEntity, (ownership) => ownership.property)
  ownerships: OwnershipEntity[];

  @OneToMany(() => ListingEntity, (listing) => listing.property)
  listings: ListingEntity[];
}
