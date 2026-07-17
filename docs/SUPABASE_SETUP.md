# Setting up Supabase for bloom

This project uses [Supabase](https://supabase.com) for authentication and as
the cloud database, so your habits, journal entries, and streaks sync across
every device you log in on. Supabase has a free tier that's enough to run
this whole app for one person or a small group.

## 1. Create a project

1. Go to https://supabase.com/dashboard and create a new project.
2. Wait for it to finish provisioning (~2 minutes).
3. Go to **Project Settings → API**. You'll need:
   - **Project URL**
   - **anon public** key

## 2. Configure your environment

```bash
cp .env.local.example .env.local
```

Paste your Project URL and anon key into `.env.local`.

## 3. Run the database schema

1. Open the **SQL Editor** in your Supabase dashboard.
2. Paste the entire contents of `supabase/schema.sql`.
3. Click **Run**.

This creates every table (`profiles`, `habits`, `habit_logs`,
`journal_entries`, `achievements`, `vision_board_items`,
`bucket_list_items`), enables Row Level Security on all of them, and adds
policies so a user can only ever read or write their own rows. It also adds:

- A trigger that creates a `profiles` row automatically when someone signs up.
- A `seed_default_habits(user_id)` function that gives a new user the 11
  built-in habits once they finish onboarding.

## 4. Turn on email auth

Email/password auth is on by default. In **Authentication → Providers**,
confirm "Email" is enabled. For local development, you can also turn off
"Confirm email" under **Authentication → Settings** so you don't need to
click a confirmation link on every test signup (turn it back on before
launching for real).

## 5. Add Google Sign-In

1. In Google Cloud Console, create an OAuth Client ID (type: Web application).
2. Add this Authorized redirect URI (find your exact callback URL in
   Supabase's Google provider screen — it looks like this):
   `https://YOUR-PROJECT-REF.supabase.co/auth/v1/callback`
3. In Supabase: **Authentication → Providers → Google** — paste your Client
   ID and Client Secret, then enable the provider.
4. In your own app, also add `http://localhost:3000/auth/callback` and your
   production URL to **Authentication → URL Configuration → Redirect URLs**.

The sign-in/sign-up buttons already call `supabase.auth.signInWithOAuth`, so
no code changes are needed once the provider is enabled.

## 6. Add Apple Sign-In (optional)

Apple requires an Apple Developer account ($99/year) and a few extra steps
(Services ID, private key, generating a client secret JWT). Supabase's guide
covers it end to end:
https://supabase.com/docs/guides/auth/social-login/auth-apple

Once configured in the Supabase dashboard, add an Apple button anywhere you
have a Google button by calling
`supabase.auth.signInWithOAuth({ provider: "apple" })` — the callback route
in this project already handles any provider.

## 7. "Remember me"

Supabase persists sessions to `localStorage` by default, so users stay
logged in across browser restarts either way. To make the "Remember me"
checkbox on the login page actually do something, swap the client's storage
based on the checkbox before calling `signInWithPassword`:

```ts
import { createBrowserClient } from "@supabase/ssr";

const supabase = createBrowserClient(url, anonKey, {
  auth: {
    storage: rememberMe ? window.localStorage : window.sessionStorage,
  },
});
```

This project ships with the simpler always-persisted version so it works
out of the box; the snippet above is the drop-in upgrade.

## 8. Run it

```bash
npm install
npm run dev
```

Visit http://localhost:3000 — sign up, and you'll land on the onboarding
screen, then your dashboard. Every habit toggle you tap writes straight to
your Supabase `habit_logs` table, so you can log in from your phone and see
the same data.

## 9. Deploy

Push this repo to GitHub and import it into [Vercel](https://vercel.com).
Add the same two environment variables from `.env.local` in the Vercel
project settings, then add your production URL to Supabase's redirect URLs
(step 5) and you're live.
