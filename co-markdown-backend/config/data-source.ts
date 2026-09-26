import 'reflect-metadata';
import { DataSource, type DataSourceOptions } from 'typeorm';

import dbConfig from './db-config.json' with { type: 'json' };
import entities from '../types/entitys/index.js';

export const AppDataSource = new DataSource({
  ...dbConfig as DataSourceOptions,
  entities,
});