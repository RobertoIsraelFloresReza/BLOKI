import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { PropertyEntity } from '../../properties/entities/property.entity';

@Entity('evaluators')
export class EvaluatorEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  logo: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  website: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  email: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  phone: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  country: string;

  @Column({ type: 'text', nullable: true })
  certifications: string; // JSON array de certificaciones

  @Column({ type: 'decimal', precision: 3, scale: 2, default: 5.0 })
  rating: number; // 0-5 stars

  @Column({ type: 'int', default: 0 })
  propertiesEvaluated: number;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @OneToMany(() => PropertyEntity, (property) => property.evaluator)
  properties: PropertyEntity[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
