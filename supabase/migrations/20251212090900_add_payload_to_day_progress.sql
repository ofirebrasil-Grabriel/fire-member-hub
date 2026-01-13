-- Add payload column to day_progress for day engine data
ALTER TABLE public.day_progress
  ADD COLUMN IF NOT EXISTS payload jsonb DEFAULT '{}'::jsonb;
