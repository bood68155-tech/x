-- ============================================================
-- Orders table for instant checkout
-- Run this SQL in the Supabase SQL Editor:
-- https://supabase.com/dashboard/project/_/sql/new
-- ============================================================

CREATE TABLE IF NOT EXISTS orders (
  id              BIGSERIAL PRIMARY KEY,
  project_id      BIGINT REFERENCES projects(id) ON DELETE SET NULL,
  project_title   TEXT NOT NULL DEFAULT '',
  project_price   TEXT NOT NULL DEFAULT '',
  customer_name   TEXT NOT NULL DEFAULT '',
  customer_email  TEXT NOT NULL DEFAULT '',
  customer_phone  TEXT NOT NULL DEFAULT '',
  status          TEXT NOT NULL DEFAULT 'pending',
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Anyone can insert orders (customer checkout)
CREATE POLICY "Anonymous can insert orders"
  ON orders FOR INSERT
  WITH CHECK (true);

-- Only admins can read orders (later: add auth-based policy)
CREATE POLICY "Public can view orders"
  ON orders FOR SELECT
  USING (true);
