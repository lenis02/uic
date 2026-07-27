-- POST /members가 500 (null value in column "createdAt" ... violates not-null constraint)으로
-- 실패할 때 한 번 실행.
-- members 테이블의 createdAt/updatedAt 컬럼이 NOT NULL인데 DEFAULT가 없어 INSERT 시 null이 들어가던 문제 수정.
-- (@CreateDateColumn/@UpdateDateColumn은 DB 컬럼 기본값에 의존함)
-- 여러 번 실행해도 안전.

ALTER TABLE members ALTER COLUMN "createdAt" SET DEFAULT NOW();
ALTER TABLE members ALTER COLUMN "updatedAt" SET DEFAULT NOW();

-- 혹시 기존에 null로 들어간 행이 있다면 보정
UPDATE members SET "createdAt" = NOW() WHERE "createdAt" IS NULL;
UPDATE members SET "updatedAt" = NOW() WHERE "updatedAt" IS NULL;
