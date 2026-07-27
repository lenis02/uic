ALTER TABLE network ADD COLUMN IF NOT EXISTS category VARCHAR NOT NULL DEFAULT 'university';
UPDATE network SET category = 'club' WHERE name LIKE '연합동아리%';

ALTER TABLE network DROP COLUMN IF EXISTS "sortOrder";
ALTER TABLE partner DROP COLUMN IF EXISTS "sortOrder";
