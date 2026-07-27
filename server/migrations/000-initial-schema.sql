-- UIC 전체 스키마 (권위 있는 원본)
--
-- 이 파일은 Render → Neon 이전 시점에 실제 프로덕션 DB를 스냅샷하여 작성됨.
-- 001~004 증분 마이그레이션의 결과가 이미 모두 반영되어 있으므로,
-- 새 DB를 만들 때는 이 파일 하나만 실행하면 된다. (001~004는 실행 불필요)
--
-- 기존 프로덕션 대비 의도적으로 바로잡은 부분:
--   1. PRIMARY KEY 추가 — popup을 제외한 5개 테이블에 기본키가 없었음
--   2. admins.username UNIQUE 추가 — 엔티티에는 unique 선언이 있었으나 DB에 없었음
--   3. research.downloads DEFAULT 0 추가 — 002 마이그레이션의 원래 의도
--
-- 컬럼 타입/NULL 여부는 프로덕션 스냅샷을 그대로 따랐다.
-- 특히 research.year는 엔티티가 NOT NULL로 선언하고 있으나 실제 DB는 nullable이므로
-- 데이터 손실을 피하기 위해 nullable을 유지한다. (엔티티와의 불일치는 별도 과제)

CREATE TABLE IF NOT EXISTS admins (
  id SERIAL PRIMARY KEY,
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  username VARCHAR NOT NULL UNIQUE,
  password VARCHAR NOT NULL,
  "lastLogin" TIMESTAMP
);

CREATE TABLE IF NOT EXISTS greetings (
  id SERIAL PRIMARY KEY,
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  role VARCHAR NOT NULL,
  name VARCHAR NOT NULL,
  "fullRole" VARCHAR NOT NULL,
  greeting TEXT NOT NULL,
  content TEXT NOT NULL,
  quote VARCHAR NOT NULL,
  "imageUrl" VARCHAR
);

CREATE TABLE IF NOT EXISTS history (
  id SERIAL PRIMARY KEY,
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  year VARCHAR NOT NULL,
  date VARCHAR NOT NULL,
  title VARCHAR NOT NULL,
  type VARCHAR,
  description VARCHAR
);

CREATE TABLE IF NOT EXISTS members (
  id SERIAL PRIMARY KEY,
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  generation INTEGER NOT NULL,
  name VARCHAR NOT NULL,
  "position" VARCHAR NOT NULL,
  "imageUrl" VARCHAR,
  workplace VARCHAR,
  email VARCHAR
);

CREATE TABLE IF NOT EXISTS popup (
  id SERIAL PRIMARY KEY,
  "imageUrl" VARCHAR NOT NULL,
  "linkUrl" VARCHAR,
  "startDate" TIMESTAMP NOT NULL,
  "endDate" TIMESTAMP NOT NULL,
  "isActive" BOOLEAN NOT NULL DEFAULT TRUE,
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS research (
  id SERIAL PRIMARY KEY,
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  title VARCHAR NOT NULL,
  "pdfUrl" VARCHAR NOT NULL,
  downloads INTEGER NOT NULL DEFAULT 0,
  category VARCHAR NOT NULL,
  year VARCHAR
);
