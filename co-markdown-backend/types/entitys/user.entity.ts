import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

import { UserPassportEntity } from './user-passport.entity.js';
import { DocumentEntity } from './document.entity.js';

@Entity({ name: 'user' })
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({
    type: 'varchar',
    length: 320,
    unique: true,
  })
  email!: string;

  @Column({
    type: 'varchar',
    length: 255,
  })
  name!: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  avatar!: string | null;

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

  @OneToMany(() => UserPassportEntity, userPassport => userPassport.user, {
    createForeignKeyConstraints: false,
  })
  passports!: UserPassportEntity[];

  @OneToMany(() => DocumentEntity, document => document.user, {
    createForeignKeyConstraints: false,
  })
  documents!: DocumentEntity[];
}