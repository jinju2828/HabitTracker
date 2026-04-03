-- 기존 Neon DB에 한 번만 실행 (SQL Editor)
-- users 테이블에 프로필 필드 추가

ALTER TABLE users ADD COLUMN IF NOT EXISTS display_name VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS daily_goal INTEGER DEFAULT 1;
ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar VARCHAR(32);
