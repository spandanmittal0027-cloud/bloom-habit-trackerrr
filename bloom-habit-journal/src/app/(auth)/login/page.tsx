"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { AuthCard } from "@/components/auth/auth-card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { FormStatus } from "@/components/auth/form-status";
import { GoogleIcon } from "@/components/auth/google-icon";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // NOTE: Supabase persists sessions to localStorage by default, which is
    // effectively "always remember me". To make this checkbox meaningful,
    // swap the client's storage to sessionStorage when unchecked — see
    // docs/SUPABASE_SETUP.md ("Remember me") for the drop-in change.
    void rememberMe;

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  async function handleGoogleLogin() {
    setError(null);
    setGoogleLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
    if (error) {
      setError(error.message);
      setGoogleLoading(false);
    }
  }

  return (
    <AuthCard
      eyebrow="Welcome back"
      title="Good to see you"
      subtitle="Your habits, streaks, and journal — right where you left them."
      footer={
        <>
          New to bloom?{" "}
          <Link href="/signup" className="text-ink font-medium underline underline-offset-2">
            Create an account
          </Link>
        </>
      }
    >
      {error && <FormStatus message={error} />}

      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />
        </div>
        <div>
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="mb-0">
              Password
            </Label>
            <Link
              href="/forgot-password"
              className="mb-1.5 text-xs text-ink-soft underline underline-offset-2 hover:text-ink"
            >
              Forgot password?
            </Link>
          </div>
          <Input
            id="password"
            type="password"
            placeholder="Your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
        </div>

        <label className="flex items-center gap-2 text-sm text-ink-soft select-none">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="h-4 w-4 rounded border-ink/20 accent-[--color-blush-deep]"
          />
          Remember me on this device
        </label>

        <Button type="submit" className="w-full" size="lg" disabled={loading}>
          {loading ? "Logging in…" : "Log in"}
        </Button>
      </form>

      <div className="my-6 flex items-center gap-3 text-xs text-ink-faint">
        <div className="h-px flex-1 bg-ink/10" />
        or
        <div className="h-px flex-1 bg-ink/10" />
      </div>

      <Button
        type="button"
        variant="outline"
        className="w-full"
        size="lg"
        onClick={handleGoogleLogin}
        disabled={googleLoading}
      >
        <GoogleIcon className="h-4 w-4" />
        {googleLoading ? "Connecting…" : "Continue with Google"}
      </Button>
    </AuthCard>
  );
}
