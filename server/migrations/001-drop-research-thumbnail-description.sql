-- Remove deprecated research columns (run once against your Neon/Postgres DB).
-- TypeORM default column names for this entity are camelCase-quoted in PostgreSQL.
-- If this fails, run: SELECT column_name FROM information_schema.columns WHERE table_name = 'research';

ALTER TABLE research DROP COLUMN IF EXISTS "thumbnailUrl";
ALTER TABLE research DROP COLUMN IF EXISTS "description";

