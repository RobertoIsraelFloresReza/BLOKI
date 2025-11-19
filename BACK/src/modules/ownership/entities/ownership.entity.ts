import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { PropertyEntity } from '../../properties/entities/property.entity';

@Entity('ownerships')
@Index(['propertyId', 'ownerAddress'], { unique: true })
export class OwnershipEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  propertyId: number;

  @Column({ type: 'varchar', length: 56 })
  @Index()
  ownerAddress: string; // Stellar address del owner

  @Column({ type: 'bigint' })
  balance: string; // Balance de tokens (7 decimals)

  @Column({ type: 'decimal', precision: 10, scale: 4 })
  percentage: number; // Porcentaje de ownership (basis points / 100)

  @Column({ type: 'varchar', length: 64, nullable: true })
  lastTxHash: string; // Último tx que modificó este ownership

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relaciones
  @ManyToOne(() => PropertyEntity, (property) => property.ownerships, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'propertyId' })
  property: PropertyEntity;
}
