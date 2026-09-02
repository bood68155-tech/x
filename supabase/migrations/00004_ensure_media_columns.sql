-- ============================================================
-- Ensure all media-related columns exist on the projects table
-- Safe to run multiple times (IF NOT EXISTS).
-- ============================================================

-- gallery: dedicated JSONB array for image gallery thumbnails
ALTER TABLE projects
  ADD COLUMN IF NOT EXISTS gallery JSONB NOT NULL DEFAULT '[]'::jsonb;

-- Ensure core media columns exist (safety net for databases
-- that were created before these were added to the schema)
ALTER TABLE projects
  ADD COLUMN IF NOT EXISTS video_url TEXT NOT NULL DEFAULT '';

ALTER TABLE projects
  ADD COLUMN IF NOT EXISTS demo_url TEXT NOT NULL DEFAULT '';
