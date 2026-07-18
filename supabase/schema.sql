-- ============================================================================
-- bloom — cozy habit journal
-- Supabase schema + Row Level Security policies
--
-- HOW TO RUN THIS:
-- 1. Create a project at https://supabase.com
-- 2. Open the SQL Editor in your Supabase dashboard
-- 3. Paste this entire file and click "Run"
-- 4. Copy your Project URL + anon key into .env.local (see .env.local.example)
--
-- Every table below has Row Level Security enabled with a policy that
-- restricts access to `auth.uid() = user_id`. This is what makes it
-- impossible for one user to ever see another user's habits, journal
-- entries, streaks, or achievements — enforced by the database itself,
-- not just the app code.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- PROFILES
-- One row per user. Created automatically on signup via trigger below.
-- ---------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  name text,
  username text unique,
  avatar_url text,
  birthday date,
  daily_goal text,
  preferred_theme text default 'pink-gingham', -- pink-gingham | matcha-cafe | lavender-dream | blue-sky | sage-garden
  dark_mode boolean default false,
  timezone text default 'UTC',
  reminder_settings jsonb default '{}'::jsonb,
  onboarding_complete boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.profiles enable row level security;

create policy "Users can view their own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Users can insert their own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- Auto-create a profile row whenever a new auth user signs up.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, name)
  values (new.id, coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)));
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ---------------------------------------------------------------------------
-- HABITS
-- Both the 11 built-in habits and any custom habits a user adds live here,
-- seeded per-user on first login so everyone can rename/recolor/delete freely.
-- ---------------------------------------------------------------------------
create table if not exists public.habits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  emoji text not null default '✨',
  color text not null default '#F6DFE1', -- one of the pastel tokens
  interaction_type text not null default 'yesno', -- yesno | steps | water | jar | pills | meals | time | duration | checkbox
  target_value numeric, -- e.g. 3 (litres), 8000 (steps), 1320 (minutes since midnight for time goals)
  unit text, -- e.g. 'L', 'steps', 'min'
  sort_order int not null default 0,
  is_custom boolean not null default false,
  archived boolean not null default false,
  created_at timestamptz default now(),
  unique (user_id, name)
);

alter table public.habits enable row level security;

create policy "Users can view their own habits"
  on public.habits for select
  using (auth.uid() = user_id);

create policy "Users can insert their own habits"
  on public.habits for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own habits"
  on public.habits for update
  using (auth.uid() = user_id);

create policy "Users can delete their own habits"
  on public.habits for delete
  using (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- HABIT LOGS
-- One row per habit per day. `value` holds partial progress (e.g. litres
-- of water so far); `completed` is true once the day's target is hit.
-- ---------------------------------------------------------------------------
create table if not exists public.habit_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  habit_id uuid not null references public.habits (id) on delete cascade,
  log_date date not null,
  completed boolean not null default false,
  value numeric default 0,
  meta jsonb default '{}'::jsonb, -- interaction-specific shape, e.g. {"time":"22:15"} or {"breakfast":true,"lunch":true,"dinner":false}
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique (user_id, habit_id, log_date)
);

alter table public.habit_logs enable row level security;

create policy "Users can view their own habit logs"
  on public.habit_logs for select
  using (auth.uid() = user_id);

create policy "Users can insert their own habit logs"
  on public.habit_logs for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own habit logs"
  on public.habit_logs for update
  using (auth.uid() = user_id);

create policy "Users can delete their own habit logs"
  on public.habit_logs for delete
  using (auth.uid() = user_id);

create index if not exists habit_logs_user_date_idx on public.habit_logs (user_id, log_date);

-- ---------------------------------------------------------------------------
-- JOURNAL ENTRIES
-- One entry per user per day.
-- ---------------------------------------------------------------------------
create table if not exists public.journal_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  entry_date date not null,
  content text,
  mood text, -- e.g. 'joyful' | 'calm' | 'tired' | 'stressed' | 'grateful' (legacy single-mood field)
  moods text[] default '{}', -- multi-select moods, e.g. {'calm','tired'}
  energy int check (energy between 1 and 5),
  stress int check (stress between 1 and 5),
  gratitude text,
  win text,
  tomorrow_goal text,
  scrapbook jsonb default '{}'::jsonb, -- { background, elements: [{id,type,emoji,x,y,scale,rotation}] }
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique (user_id, entry_date)
);

alter table public.journal_entries enable row level security;

create policy "Users can view their own journal entries"
  on public.journal_entries for select
  using (auth.uid() = user_id);

create policy "Users can insert their own journal entries"
  on public.journal_entries for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own journal entries"
  on public.journal_entries for update
  using (auth.uid() = user_id);

create policy "Users can delete their own journal entries"
  on public.journal_entries for delete
  using (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- ACHIEVEMENTS
-- Unlocked milestones (7 / 14 / 30 / 100-day streaks, etc).
-- ---------------------------------------------------------------------------
create table if not exists public.achievements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  type text not null, -- e.g. 'streak_7' | 'streak_14' | 'streak_21' | 'streak_30' | 'streak_50' | 'streak_100'
  habit_id uuid references public.habits (id) on delete cascade,
  unlocked_at timestamptz default now(),
  unique (user_id, type)
);

alter table public.achievements enable row level security;

create policy "Users can view their own achievements"
  on public.achievements for select
  using (auth.uid() = user_id);

create policy "Users can insert their own achievements"
  on public.achievements for insert
  with check (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- VISION BOARD ITEMS + BUCKET LIST
-- Lightweight extra personalization sections.
-- ---------------------------------------------------------------------------
create table if not exists public.vision_board_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  image_url text,
  caption text,
  position int not null default 0,
  created_at timestamptz default now()
);

alter table public.vision_board_items enable row level security;

create policy "Users can manage their own vision board"
  on public.vision_board_items for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create table if not exists public.bucket_list_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  content text not null,
  done boolean not null default false,
  created_at timestamptz default now()
);

alter table public.bucket_list_items enable row level security;

create policy "Users can manage their own bucket list"
  on public.bucket_list_items for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- Seed the 11 default habits for a brand-new user.
-- Called from the app right after onboarding completes.
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
