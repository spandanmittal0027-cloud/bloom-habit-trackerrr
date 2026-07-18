-- ============================================================================
-- bloom — V3 migration (Scrapbook Journal)
-- Run this in the Supabase SQL Editor AFTER migration_v2.sql.
-- Safe to run more than once.
-- ============================================================================

-- Multiple moods per entry (the brief asks for "select multiple moods").
alter table public.journal_entries add column if not exists moods text[] default '{}';

-- The scrapbook layout: background choice + every placed sticker's position,
-- size, and rotation. Stored as one jsonb blob so the whole page saves in a
-- single write instead of one row per sticker.
alter table public.journal_entries add column if not exists scrapbook jsonb default '{}'::jsonb;
