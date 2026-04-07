-- If GET /research returns 500 with "column ... does not exist" for downloads, run once.
-- Safe to run multiple times (IF NOT EXISTS).

ALTER TABLE research ADD COLUMN IF NOT EXISTS downloads integer NOT NULL DEFAULT 0;
