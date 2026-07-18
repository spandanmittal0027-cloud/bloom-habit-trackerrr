"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { AuthCard } from "@/components/auth/auth-card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { FormStatus } from "@/components/auth/form-status";
import { cn } from "@/lib/utils";
import type { Theme } from "@/lib/supabase/types";

const THEMES: { id: Theme; label: string; swatch: string }[] = [
  { id: "pink-gingham", label: "Pink Gingham", swatch: "#F6DFE1" },
  { id: "matcha-cafe", label: "Matcha Cafe", swatch: "#DFE9DF" },
  { id: "lavender-dream", label: "Lavender Dream", swatch: "#E7E0F5" },
  { id: "blue-sky", label: "Blue Sky", swatch: "#DCEBF5" },
  { id: "sage-garden", label: "Sage Garden", swatch: "#C3D8C4" },
];

export default function OnboardingPage() {
  const router = useRouter();
  const supabase = createClient();

  const [name, setName] = useState("");
  const [dailyGoal, setDailyGoal] = useState("");
  const [theme, setTheme] = useState<Theme>("pink-gingham");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function prefill() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user?.user_metadata?.name) setName(user.user_metadata.name as string);
    }
    prefill();
  }, [supabase]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setError("Your session expired — please log in again.");
      setLoading(false);
      return;
    }

    const { error: profileError } = await supabase
      .from("profiles")
      .update({
        name,
        daily_goal: dailyGoal,
        preferred_theme: theme,
        onboarding_complete: true,
      })
      .eq("id", user.id);

    if (profileError) {
      setError(profileError.message);
      setLoading(false);
      return;
    }

    // Give this brand-new user their starter set of habits.
    await supabase.rpc("seed_default_habits", { p_user_id: user.id });

    setLoading(false);
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <AuthCard
      eyebrow="One last thing"
      title="Let's set up your space"
      subtitle="A few small details to make bloom feel like yours."
    >
      {error && <FormStatus message={error} />}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <Label htmlFor="name">What should we call you?</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            required
          />
        </div>

        <div>
          <Label htmlFor="goal">What&apos;s your daily goal?</Label>
          <Input
            id="goal"
            value={dailyGoal}
            onChange={(e) => setDailyGoal(e.target.value)}
            placeholder="e.g. Feel steady, sleep well, move daily"
          />
        </div>

        <div>
          <Label>Pick a mood board</Label>
          <div className="grid grid-cols-5 gap-2">
            {THEMES.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTheme(t.id)}
                className={cn(
                  "flex flex-col items-center gap-1.5 rounded-2xl border p-2 transition",
                  theme === t.id
                    ? "border-ink/30 bg-warm-white"
                    : "border-transparent hover:bg-warm-white/60"
                )}
                title={t.label}
              >
                <span
                  className="h-7 w-7 rounded-full border border-ink/10"
                  style={{ backgroundColor: t.swatch }}
                />
                <span className="text-[0.6rem] leading-tight text-ink-soft text-center">
                  {t.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        <Button type="submit" className="w-full" size="lg" disabled={loading}>
          {loading ? "Setting things up…" : "Enter my journal 🌷"}
        </Button>
      </form>
    </AuthCard>
  );
}
