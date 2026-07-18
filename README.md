# bloom 🌸 — a cozy habit journal

## V5 — Custom Habit Creation

- New **"+ Add custom habit"** button on the Settings page.
- Pick a name, an icon (type any emoji or tap a suggestion), a pastel color,
  and a measurement type: **Yes/No, Number, Slider, Time, Duration, or Text**
  — the app builds the right interaction automatically, same as the 11
  built-in habits.
- Number and Slider habits can have an optional daily goal + unit (e.g. "10
  pages"); Time habits ask for a "complete by" time.
- **Settings → Your habits** now lists every habit (built-in and custom)
  with an Archive/Restore toggle, so you can retire a habit without losing
  its history.
- No database changes needed for this one.

## V4 — Monthly Analytics

- The Progress page is fully working now, not a placeholder.
- **Consistency heatmap** for the month (like a GitHub contribution graph),
  plus an interactive daily-completion area chart you can hover over.
- **Current streak** and **longest streak ever**, computed from your full
  history — not just the month you're viewing.
- **Specific averages**: average steps/day, average water/day, sugar-free
  days, medicine consistency %.
- **Healthy days** — days where junk food, sugar, and packaged food were
  all avoided together.
- **Habit-by-habit consistency bars**, sorted so your most difficult habit
  surfaces at the top.
- **A short written reflection** generated from your actual numbers each
  month (not AI-generated — a straightforward summary of your real stats).
- Prev/Next month navigation.
- No database changes needed for this one — it only reads your existing data.

## V3 — Scrapbook Journal

- The Journal page is fully working now, not a placeholder.
- **Mood picker**: 9 mood cards, multi-select.
- **Scrapbook canvas**: a large writing area with a choice of 5 pastel
  backgrounds, and a sticker palette (flowers, cozy things, sky/sparkle,
  little things, washi tape, seasonal) — tap a sticker to drop it onto the
  page, drag it anywhere, tap a placed sticker to resize (+/−) or remove it.
- Energy & stress sliders, gratitude, today's win, tomorrow's goal.
- Prev/Next day navigation, so you can look back at (or fill in) past days.
- Everything saves to your Supabase account as one entry per day — the
  whole scrapbook layout (background + every sticker's position, size, and
  rotation) is stored as a single JSON field, so it's fast to save and loads
  back exactly as you left it on any device.

## V2 — what changed

- **Fixed the duplicate-habit bug at the root.** The seed function was
  missing a database constraint, so re-running onboarding silently inserted
  extra copies of every habit. There's now a real `unique (user_id, name)`
  constraint on `habits`, plus a one-time cleanup query in
  `supabase/migration_v2.sql` to remove any duplicates already in your data.
- **Every habit now has its own interaction**, not a generic checkbox:
  steps (slider + number, fills and blooms at target), water (bottle-fill +
  quick "+1 glass"), yes/no cards for junk food/sugar/packaged food, a
  chia-seed jar toggle, a medicine pill tracker, walk-after-meals as three
  separate meal checks, sleep/screen-time as time pickers that auto-compare
  to your goal, and design practice as a duration log with a weekly total.
- **Streak rewards are real now** — 7/21/30/50/100-day milestones unlock
  automatically and show up on the Rewards page.
- Completion % and streaks are now computed from each habit's actual
  interaction type, not "does a log row exist" — so a 3L water goal only
  counts once you've actually logged 3L.


A soft, Pinterest-inspired habit tracker and daily journal, built with
Next.js (App Router), Tailwind CSS v4, Framer Motion, and Supabase for
authentication + cloud storage.

This is **Phase 1: the full account + data foundation.** Every screen you
see is real and connected to a live database — not a mockup — so the next
phase (month view, journal, progress charts, streak rewards) can be built
directly on top of working auth and real data instead of retrofitting it in
later.

## What's built right now

**Authentication**
- Sign up / log in with email + password
- Google Sign-In (Apple Sign-In wired up, needs your Apple dev credentials)
- Forgot password → email reset link → set new password
- Remember me checkbox (see `docs/SUPABASE_SETUP.md` for making it fully functional)
- Log out
- Session refresh + route protection via middleware — logged-out visitors
  only ever see the login screen, never anyone's dashboard

**Cloud data, private per user**
- Supabase Postgres with Row Level Security on every table — enforced by
  the database, not just app code, so one user can never read another's
  habits, journal, streaks, or achievements
- `profiles`, `habits`, `habit_logs`, `journal_entries`, `achievements`,
  `vision_board_items`, `bucket_list_items` — see `supabase/schema.sql`
- New users get auto-created profiles and the 11 starter habits from the
  brief, seeded right after onboarding

**Onboarding**
- Name, daily goal, and a choice of 5 pastel "mood board" themes
  (Pink Gingham, Matcha Cafe, Lavender Dream, Blue Sky, Sage Garden)

**Dashboard (home)**
- Time-based greeting ("Good Morning, Spandan 🌸")
- Rotating daily motivational quote
- Today's completion % as a soft progress ring
- Live current-day streak, computed from real habit log history
- Today's 11 habits as tappable cards — every tap writes straight to the
  cloud, so it's already syncable across devices

**Settings**
- Edit name, username, daily goal, theme
- All the plumbing (profile fields, theme picker) the rest of the app will
  read from

## What's next (scaffolded, not yet built)

The month grid, weekly/monthly/yearly progress charts + heatmap, the daily
journal with mood/energy/stress sliders, the unique per-habit interactions
(water bottle fill, walking path, moon filling with stars, etc.), streak
reward animations, vision board, and bucket list all have their database
tables and RLS policies ready — see the "Coming in the next build phase"
placeholder pages under `src/app/dashboard/`. Say the word and we'll build
the next one.

## Getting started

```bash
npm install
cp .env.local.example .env.local   # then fill in your Supabase keys
npm run dev
```

Full Supabase project setup (schema, Google/Apple auth, deploying) is in
**`docs/SUPABASE_SETUP.md` — start there.**

## Stack

- Next.js 15 (App Router, Server Components)
- Tailwind CSS v4 (pastel design tokens in `src/app/globals.css`)
- Framer Motion (habit-tap micro-interactions)
- Supabase (`@supabase/ssr`) for auth + Postgres + RLS
- Hand-written shadcn-style UI primitives in `src/components/ui`

## Project structure

```
src/
  app/
    (auth)/login, signup, forgot-password, reset-password
    auth/callback/          — OAuth + email-link handler
    onboarding/              — first-run setup
    dashboard/               — protected app shell + pages
  components/
    auth/                    — auth screen shell + decorative background
    dashboard/                — sidebar, habit checklist, progress ring, settings form
    ui/                      — button, input, label
  lib/
    supabase/                — browser client, server client, middleware helper, DB types
    dashboard-helpers.ts     — streak calculation, quotes, greeting
supabase/
  schema.sql                 — full schema + RLS policies + starter-habit seeding
docs/
  SUPABASE_SETUP.md          — step-by-step setup, incl. Google/Apple auth
```
