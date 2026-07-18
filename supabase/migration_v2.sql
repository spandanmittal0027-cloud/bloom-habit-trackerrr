-- ============================================================================
-- bloom — V2 migration
-- Run this in the Supabase SQL Editor AFTER your original schema.sql.
-- Safe to run more than once (every step checks before it acts).
-- ============================================================================

-- ---------------------------------------------------------------------------
-- 1. FIX THE DUPLICATE-HABIT BUG AT THE ROOT
--
-- Root cause: seed_default_habits() used "on conflict do nothing", but the
-- habits table had no unique constraint for it to match against — so every
-- re-run of onboarding just inserted 11 more rows instead of skipping.
-- ---------------------------------------------------------------------------

-- Remove any duplicates that already exist, keeping the oldest copy of each.
with ranked as (
  select id, row_number() over (
    partition by user_id, name order by created_at asc
  ) as rn
  from public.habits
)
delete from public.habits where id in (select id from ranked where rn > 1);

-- Add the constraint the seed function was always supposed to have.
do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'habits_user_name_unique'
  ) then
    alter table public.habits
      add constraint habits_user_name_unique unique (user_id, name);
  end if;
end $$;

-- ---------------------------------------------------------------------------
-- 2. RICHER HABIT LOGS
-- `meta` holds shape that varies per interaction type — e.g. a time picker's
-- {"time": "22:15"}, or the walk-after-meals {"breakfast": true, ...}.
-- ---------------------------------------------------------------------------
alter table public.habit_logs add column if not exists meta jsonb default '{}'::jsonb;

-- ---------------------------------------------------------------------------
-- 3. REPLACE seed_default_habits WITH THE V2 INTERACTION MAPPING
-- Re-seeds the *type* of interaction + target for each built-in habit.
-- The unique constraint from step 1 makes this genuinely safe to re-run.
-- ---------------------------------------------------------------------------
create or replace function public.seed_default_habits(p_user_id uuid)
returns void
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.habits (user_id, name, emoji, color, interaction_type, target_value, unit, sort_order)
  values
    (p_user_id, 'Walk 8,000+ Steps', '🚶', '#DCEBF5', 'steps', 8000, 'steps', 1),
    (p_user_id, 'No Junk Food', '🥗', '#DFE9DF', 'yesno', null, null, 2),
    (p_user_id, 'No Sugar', '🍓', '#F6DFE1', 'yesno', null, null, 3),
    (p_user_id, 'No Packaged Food', '📦', '#F5D9C6', 'yesno', null, null, 4),
    (p_user_id, 'Drink 3 Litres Water', '💧', '#DCEBF5', 'water', 3, 'L', 5),
    (p_user_id, 'Chia Seed Water Morning', '🌱', '#DFE9DF', 'jar', null, null, 6),
    (p_user_id, 'Walk After Every Meal', '🌞', '#F6E7B2', 'meals', null, null, 7),
    (p_user_id, 'Medicines', '💊', '#E7E0F5', 'pills', null, null, 8),
    (p_user_id, 'Productive Design Practice', '🎨', '#E7E0F5', 'duration', null, 'min', 9),
    (p_user_id, 'No Screen After 10 PM', '📵', '#DFE9DF', 'time', 1320, null, 10),
    (p_user_id, 'Sleep by 10 PM', '😴', '#E7E0F5', 'time', 1320, null, 11)
  on conflict (user_id, name) do update set
    interaction_type = excluded.interaction_type,
    target_value = excluded.target_value,
    unit = excluded.unit;
end;
$$;

-- Bring every existing user's habits up to the V2 interaction mapping too.
do $$
declare
  u record;
begin
  for u in select distinct user_id from public.habits loop
    perform public.seed_default_habits(u.user_id);
  end loop;
end $$;

-- ---------------------------------------------------------------------------
-- 4. REWARD MILESTONES
-- One row per unlocked milestone per user. Unique constraint means the app
-- can safely try to insert on every streak recalculation without duplicating.
-- ---------------------------------------------------------------------------
do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'achievements_user_type_unique'
  ) then
    alter table public.achievements
      add constraint achievements_user_type_unique unique (user_id, type);
  end if;
end $$;
