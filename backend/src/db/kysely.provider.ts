import { Kysely, PostgresDialect } from 'kysely';
import { Pool } from 'pg';
import * as dotenv from 'dotenv';

// .env 파일 로드 (.env는 루트에 있음)
dotenv.config();

// 데이터베이스 타입 정의 (테이블 스키마)
interface Database {
  users: {
    id?: number;
    email: string;
    password: string;
    created_at?: string;
    display_name?: string | null;
    daily_goal?: number | null;
    avatar?: string | null;
  };
  habits: {
    id?: number;
    name: string;
    user_id: number;
    created_at?: string;
  };
  habit_logs: {
    id?: number;
    habit_id: number;
    log_date: string;
    completed: boolean;
    user_id: number;
  };
}

// Neon 등 클라우드 Postgres는 SSL 필수
const isNeon = process.env.DB_HOST?.includes('neon.tech');
const poolConfig = {
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || '5432', 10),
  ...(isNeon && { ssl: { rejectUnauthorized: true } }),
};

// DB 인스턴스 생성
export const db = new Kysely<Database>({
  dialect: new PostgresDialect({
    pool: new Pool(poolConfig),
  }),
});
