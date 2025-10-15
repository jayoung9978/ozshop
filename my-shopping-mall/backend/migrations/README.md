# 데이터베이스 마이그레이션 가이드

## 실행 순서

1. **add_user_role.sql** - users 테이블에 role 컬럼 추가
2. **create_orders_table.sql** - orders 및 order_items 테이블 생성

## 실행 방법

### MySQL CLI 사용
```bash
# MySQL 접속
mysql -u root -p

# 데이터베이스 선택
USE shopping_mall;

# 마이그레이션 실행
source /Users/a/Documents/dev/oz-shop/my-shopping-mall/backend/migrations/add_user_role.sql;
source /Users/a/Documents/dev/oz-shop/my-shopping-mall/backend/migrations/create_orders_table.sql;
```

### 또는 명령줄에서 직접 실행
```bash
cd /Users/a/Documents/dev/oz-shop/my-shopping-mall/backend/migrations

mysql -u root -p shopping_mall < add_user_role.sql
mysql -u root -p shopping_mall < create_orders_table.sql
```

## 관리자 계정 설정

마이그레이션 후 관리자 계정을 설정하려면:

```sql
-- MySQL에 접속 후
USE shopping_mall;

-- 특정 사용자를 관리자로 변경
UPDATE users SET role = 'admin' WHERE email = '관리자이메일@example.com';

-- 확인
SELECT id, email, name, role FROM users;
```

## 테이블 확인

```sql
-- users 테이블 구조 확인
DESC users;

-- orders 테이블 확인
DESC orders;

-- order_items 테이블 확인
DESC order_items;
```
