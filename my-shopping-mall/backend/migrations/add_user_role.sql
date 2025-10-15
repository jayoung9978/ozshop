-- 사용자 테이블에 role 컬럼 추가
ALTER TABLE users
ADD COLUMN role ENUM('user', 'admin') DEFAULT 'user' NOT NULL AFTER name;

-- 기존 사용자들은 모두 'user' 역할로 설정됨
-- 관리자 계정이 필요한 경우 수동으로 업데이트:
-- UPDATE users SET role = 'admin' WHERE email = 'admin@example.com';
