import { Kysely, PostgresDialect } from 'kysely';
import { Pool } from 'pg';
import * as dotenv from 'dotenv';

// .env 파일 로드 (.env는 루트에 있음)
dotenv.config();

// 데이터베이스 타입 정의 (테이블 스키마)
interface Database {
  habits: {
    id?: number;
    name: string;
    created_at: Date;
  };
  habit_logs: {
    id?: number;           // SERIAL PK이므로 optional
    habit_id: number;      // 연결된 habit ID
    log_date: string;      // DATE 컬럼은 string으로 매핑
    completed: boolean;
  };
}

// DB 인스턴스 생성
export const db = new Kysely<Database>({
  dialect: new PostgresDialect({
    pool: new Pool({
      host: process.env.DB_HOST,
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      port: parseInt(process.env.DB_PORT || '5432', 10),
    }),
  }),
});
