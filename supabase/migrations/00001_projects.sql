-- ============================================================
-- Projects table for the X admin dashboard
-- Run this SQL in the Supabase SQL Editor:
-- https://supabase.com/dashboard/project/_/sql/new
-- ============================================================

-- 1. Create the projects table
CREATE TABLE IF NOT EXISTS projects (
  id            BIGSERIAL PRIMARY KEY,
  title         TEXT NOT NULL DEFAULT '',
  category      TEXT NOT NULL DEFAULT 'Website',
  description   TEXT NOT NULL DEFAULT '',
  tag           TEXT NOT NULL DEFAULT '',
  price         TEXT NOT NULL DEFAULT '',
  video_url     TEXT NOT NULL DEFAULT '',
  demo_url      TEXT NOT NULL DEFAULT '',
  images        JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Auto-update updated_at on every row change
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

-- 3. Enable Row Level Security
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- 4. Allow public read access (anyone can view the store)
CREATE POLICY "Public can view projects"
  ON projects FOR SELECT
  USING (true);

-- 5. Allow anonymous insert/update/delete (admin panel without auth)
CREATE POLICY "Anonymous can insert projects"
  ON projects FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anonymous can update projects"
  ON projects FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anonymous can delete projects"
  ON projects FOR DELETE
  USING (true);

-- 6. Seed initial data
INSERT INTO projects (title, category, description, tag, price, video_url, demo_url, images) VALUES
  ('Luxe Fashion', 'Store', 'Premium fashion e-commerce with immersive product experience and seamless checkout.', 'Shopify', '$1,299', '', '', '[]'::jsonb),
  ('TechGear Pro', 'Website', 'High-performance electronics store with advanced filtering and comparison features.', 'WooCommerce', '$999', '', '', '[]'::jsonb),
  ('Organic Haven', 'Theme', 'Organic skincare brand with subscription model and personalized recommendations.', 'Shopify', '$799', '', '', '[]'::jsonb),
  ('Artisan Coffee', 'Store', 'Specialty coffee roaster with subscription management and origin storytelling.', 'Custom', '$1,499', '', '', '[]'::jsonb),
  ('Home & Canvas', 'Website', 'Modern home furnishings store with AR preview and room visualization tools.', 'Shopify', '$899', '', '', '[]'::jsonb),
  ('FitCore Gear', 'Theme', 'Fitness equipment brand with workout integration and performance tracking.', 'WooCommerce', '$699', '', '', '[]'::jsonb);
