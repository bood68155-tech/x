-- ============================================================
-- 00006: Reset & normalize the projects table schema.
-- Canonical columns:
--   id, title, description, price, category, tag,
--   features (JSONB), image_url, gallery (JSONB),
--   video_url, demo_url, created_at, updated_at
--
-- This migration is idempotent — safe to run multiple times.
-- ============================================================

-- 1. Ensure every canonical column exists with sane defaults
ALTER TABLE projects ADD COLUMN IF NOT EXISTS title         TEXT    NOT NULL DEFAULT '';
ALTER TABLE projects ADD COLUMN IF NOT EXISTS description   TEXT    NOT NULL DEFAULT '';
ALTER TABLE projects ADD COLUMN IF NOT EXISTS price         TEXT    NOT NULL DEFAULT '';
ALTER TABLE projects ADD COLUMN IF NOT EXISTS category      TEXT    NOT NULL DEFAULT 'Website';
ALTER TABLE projects ADD COLUMN IF NOT EXISTS tag           TEXT    NOT NULL DEFAULT '';
ALTER TABLE projects ADD COLUMN IF NOT EXISTS features      JSONB   NOT NULL DEFAULT '[]'::jsonb;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS image_url     TEXT    NOT NULL DEFAULT '';
ALTER TABLE projects ADD COLUMN IF NOT EXISTS gallery       JSONB   NOT NULL DEFAULT '[]'::jsonb;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS video_url     TEXT    NOT NULL DEFAULT '';
ALTER TABLE projects ADD COLUMN IF NOT EXISTS demo_url      TEXT    NOT NULL DEFAULT '';
ALTER TABLE projects ADD COLUMN IF NOT EXISTS created_at    TIMESTAMPTZ NOT NULL DEFAULT now();
ALTER TABLE projects ADD COLUMN IF NOT EXISTS updated_at    TIMESTAMPTZ NOT NULL DEFAULT now();

-- 2. Migrate data from legacy duplicate columns into canonical ones
--    (only if the legacy column already exists and has data)
DO $$
BEGIN
  -- video: legacy columns → video_url
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='projects' AND column_name='video') THEN
    UPDATE projects SET video_url = video WHERE video_url = '' AND video != '';
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='projects' AND column_name='media') THEN
    UPDATE projects SET video_url = media WHERE video_url = '' AND media != '';
  END IF;

  -- demo: legacy columns → demo_url
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='projects' AND column_name='live_demo_url') THEN
    UPDATE projects SET demo_url = live_demo_url WHERE demo_url = '' AND live_demo_url != '';
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='projects' AND column_name='demo') THEN
    UPDATE projects SET demo_url = demo WHERE demo_url = '' AND demo != '';
  END IF;

  -- gallery: legacy columns → gallery
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='projects' AND column_name='images') THEN
    UPDATE projects
       SET gallery = CASE
         WHEN gallery = '[]'::jsonb AND images != '[]'::jsonb THEN images
         ELSE gallery
       END
     WHERE images != '[]'::jsonb;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='projects' AND column_name='image_gallery') THEN
    UPDATE projects
       SET gallery = CASE
         WHEN gallery = '[]'::jsonb AND image_gallery != '[]'::jsonb THEN image_gallery
         ELSE gallery
       END
     WHERE image_gallery != '[]'::jsonb;
  END IF;

  -- image_url: legacy column → image_url
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='projects' AND column_name='cover_image') THEN
    UPDATE projects SET image_url = cover_image WHERE image_url = '' AND cover_image != '';
  END IF;
END $$;

-- 3. Drop redundant / legacy columns that are no longer used
--    (ignore errors if column doesn't exist)
ALTER TABLE projects DROP COLUMN IF EXISTS video;
ALTER TABLE projects DROP COLUMN IF EXISTS media;
ALTER TABLE projects DROP COLUMN IF EXISTS live_demo_url;
ALTER TABLE projects DROP COLUMN IF EXISTS demo;
ALTER TABLE projects DROP COLUMN IF EXISTS images;
ALTER TABLE projects DROP COLUMN IF EXISTS image_gallery;
ALTER TABLE projects DROP COLUMN IF EXISTS cover_image;

-- 4. Ensure the updated_at trigger exists
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_projects_updated_at ON projects;
CREATE TRIGGER trg_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- 5. Row Level Security (keep open for admin-less panel)
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  -- Drop existing policies if any, then recreate
  DROP POLICY IF EXISTS "Public can view projects"   ON projects;
  DROP POLICY IF EXISTS "Anonymous can insert projects" ON projects;
  DROP POLICY IF EXISTS "Anonymous can update projects" ON projects;
  DROP POLICY IF EXISTS "Anonymous can delete projects" ON projects;

  CREATE POLICY "Public can view projects"
    ON projects FOR SELECT USING (true);
  CREATE POLICY "Anonymous can insert projects"
    ON projects FOR INSERT WITH CHECK (true);
  CREATE POLICY "Anonymous can update projects"
    ON projects FOR UPDATE USING (true) WITH CHECK (true);
  CREATE POLICY "Anonymous can delete projects"
    ON projects FOR DELETE USING (true);
END $$;
