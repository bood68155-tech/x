-- ============================================================
-- Add features column to projects table
-- This column stores project feature tags as a JSONB array.
-- Safe to run multiple times (IF NOT EXISTS).
-- ============================================================

ALTER TABLE projects
  ADD COLUMN IF NOT EXISTS features JSONB NOT NULL DEFAULT '[]'::jsonb;
