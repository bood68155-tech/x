-- ============================================================
-- Profile image persistence (settings table)
-- Run this SQL in the Supabase SQL Editor:
-- https://supabase.com/dashboard/project/_/sql/new
-- ============================================================

-- 1. Key/value settings table used to persist the site profile image
CREATE TABLE IF NOT EXISTS settings (
  key         TEXT PRIMARY KEY,
  value       TEXT NOT NULL DEFAULT '',
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Allow public read so every visitor sees the saved profile image
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read settings"
  ON settings FOR SELECT
  USING (true);

-- 3. Allow anonymous upserts (the admin dashboard updates the image)
CREATE POLICY "Anonymous can insert settings"
  ON settings FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anonymous can update settings"
  ON settings FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- 4. Seed the profile image row
INSERT INTO settings (key, value) VALUES ('profile_image_url', '')
ON CONFLICT (key) DO NOTHING;

-- 5. Refresh the PostgREST schema cache so REST queries see the table immediately
NOTIFY pgrst, 'reload schema';
