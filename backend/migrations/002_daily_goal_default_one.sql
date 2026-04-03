-- 이미 001을 실행해 daily_goal 기본값이 5였던 DB용 (선택)
-- 새로 001만 실행했다면 이 파일은 생략 가능

ALTER TABLE users ALTER COLUMN daily_goal SET DEFAULT 1;
