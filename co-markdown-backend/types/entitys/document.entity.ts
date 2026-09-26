import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'document' })
export class DocumentEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({
    name: 'owner_id',
    type: 'uuid',
  })
  ownerId!: string;

  @Column({
    type: 'varchar',
    length: 255,
  })
  name!: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  description!: string | null;

  @Column({
    type: 'text',
  })
  content!: string;

  @Column({
    name: 'allow_guest_edit',
    type: 'boolean',
    default: false,
  })
  allowGuestEdit!: boolean;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamptz',
  })
  createdAt!: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamptz',
  })
  updatedAt!: Date;
}