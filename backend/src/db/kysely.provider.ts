import { Kysely, PostgresDialect } from 'kysely';
import { Pool } from 'pg';
import * as dotenv from 'dotenv';

dotenv.config();

export const db = new Kysely({
  dialect: new PostgresDialect({
    pool: new Pool({
      host: process.env.DB_HOST,
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      port: parseInt(process.env.DB_PORT || '5432'),
    }),
  }),
});