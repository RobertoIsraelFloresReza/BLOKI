import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum MediaFileType {
  IMAGE = 'IMAGE',
  PDF = 'PDF',
  VIDEO = 'VIDEO',
  OTHER = 'OTHER',
}

export enum MediaEntityType {
  PROPERTY = 'PROPERTY',
  EVALUATOR = 'EVALUATOR',
  USER = 'USER',
}

export enum MediaStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

@Entity('media')
export class MediaEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text', name: 'url' })
  url: string;

  @Column({ type: 'int', name: 'entity_id', nullable: true })
  entityId: number | null;

  @Column({
    type: 'enum',
    name: 'entity_type',
    enum: MediaEntityType,
    nullable: true,
  })
  entityType: MediaEntityType | null;

  @Column({
    type: 'enum',
    name: 'file_type',
    enum: MediaFileType,
    default: MediaFileType.OTHER,
  })
  fileType: MediaFileType;

  @Column({ type: 'int', name: 'display_order', nullable: true, default: 0 })
  displayOrder: number | null;

  @Column({
    type: 'enum',
    name: 'status',
    enum: MediaStatus,
    default: MediaStatus.ACTIVE,
  })
  status: MediaStatus;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
