-- ============================================================
-- Add alternative media column names so dual-write and
-- fallback lookups work regardless of how data was inserted.
-- Safe to run multiple times (IF NOT EXISTS).
-- ============================================================

-- Video alternatives
ALTER TABLE projects ADD COLUMN IF NOT EXISTS video  TEXT NOT NULL DEFAULT '';
ALTER TABLE projects ADD COLUMN IF NOT EXISTS media  TEXT NOT NULL DEFAULT '';

-- Demo alternatives
ALTER TABLE projects ADD COLUMN IF NOT EXISTS live_demo_url TEXT NOT NULL DEFAULT '';
ALTER TABLE projects ADD COLUMN IF NOT EXISTS demo          TEXT NOT NULL DEFAULT '';
