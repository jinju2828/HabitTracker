-- Habit Tracker 테이블 (Neon 등 프로덕션 DB에서 실행용)
-- Neon Console → SQL Editor에서 붙여넣고 Run

CREATE TABLE IF NOT EXISTS users (
  id         SERIAL PRIMARY KEY,
  email      VARCHAR(255) NOT NULL UNIQUE,
  password   VARCHAR(255) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS habits (
  id         SERIAL PRIMARY KEY,
  name       VARCHAR(255) NOT NULL,
  user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS habit_logs (
  id         SERIAL PRIMARY KEY,
  habit_id   INTEGER NOT NULL REFERENCES habits(id) ON DELETE CASCADE,
  log_date   DATE NOT NULL,
  completed  BOOLEAN NOT NULL DEFAULT false,
  user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE
);

-- 인덱스 (선택, 조회 속도용)
CREATE INDEX IF NOT EXISTS idx_habits_user_id ON habits(user_id);
CREATE INDEX IF NOT EXISTS idx_habit_logs_habit_id ON habit_logs(habit_id);
CREATE INDEX IF NOT EXISTS idx_habit_logs_user_id ON habit_logs(user_id);
