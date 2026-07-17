# bloom 🌸 — a cozy habit journal

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
