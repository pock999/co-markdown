import { AppDataSource } from './data-source.js';
import { DocumentEntity } from '../types/entitys/document.entity.js';
import { UserEntity } from '../types/entitys/user.entity.js';
import { UserPassportEntity } from '../types/entitys/user-passport.entity.js';

export const UserRepository =
  AppDataSource.getRepository(UserEntity);

export const UserPassportRepository =
  AppDataSource.getRepository(UserPassportEntity);

export const DocumentRepository =
  AppDataSource.getRepository(DocumentEntity);