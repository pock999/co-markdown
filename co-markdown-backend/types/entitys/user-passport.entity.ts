import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
} from 'typeorm';

import { UserEntity } from './user.entity.js';

@Entity({ name: 'user_passport' })
export class UserPassportEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({
    name: 'user_id',
    type: 'uuid',
  })
  userId!: string;

  @Column({
    type: 'varchar',
    length: 50,
  })
  provider!: string;

  @Column({
    name: 'provider_user_id',
    type: 'varchar',
    length: 255,
  })
  providerUserId!: string;

  @ManyToOne(() => UserEntity, user => user.passports, {
    createForeignKeyConstraints: false,
  })
  user!: UserEntity;
}