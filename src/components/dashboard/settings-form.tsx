"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Theme } from "@/lib/supabase/types";

const THEMES: { id: Theme; label: string; swatch: string }[] = [
  { id: "pink-gingham", label: "Pink Gingham", swatch: "#F6DFE1" },
  { id: "matcha-cafe", label: "Matcha Cafe", swatch: "#DFE9DF" },
  { id: "lavender-dream", label: "Lavender Dream", swatch: "#E7E0F5" },
  { id: "blue-sky", label: "Blue Sky", swatch: "#DCEBF5" },
  { id: "sage-garden", label: "Sage Garden", swatch: "#C3D8C4" },
];

type ProfileFields = {
  name: string;
  username: string;
  daily_goal: string;
  preferred_theme: Theme;
  dark_mode: boolean;
  timezone: string;
};

export function SettingsForm({
  email,
  initialProfile,
}: {
  email: string;
  initialProfile: ProfileFields;
}) {
  const supabase = createClient();
  const [fields, setFields] = useState(initialProfile);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSaved(false);

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.from("profiles").update(fields).eq("id", user.id);

    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <form onSubmit={handleSave} className="space-y-5">
      <div>
        <Label>Email</Label>
        <Input value={email} disabled className="opacity-60" />
      </div>

      <div>
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          value={fields.name}
          onChange={(e) => setFields({ ...fields, name: e.target.value })}
        />
      </div>

      <div>
        <Label htmlFor="username">Username</Label>
        <Input
          id="username"
          value={fields.username}
          onChange={(e) => setFields({ ...fields, username: e.target.value })}
        />
      </div>

      <div>
        <Label htmlFor="goal">Daily goal</Label>
        <Input
          id="goal"
          value={fields.daily_goal}
          onChange={(e) => setFields({ ...fields, daily_goal: e.target.value })}
        />
      </div>

      <div>
        <Label>Mood board</Label>
        <div className="grid grid-cols-5 gap-2">
          {THEMES.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setFields({ ...fields, preferred_theme: t.id })}
              className={cn(
                "flex flex-col items-center gap-1.5 rounded-2xl border p-2 transition",
                fields.preferred_theme === t.id
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

      <label className="flex items-center gap-2 text-sm text-ink-soft select-none">
        <input
          type="checkbox"
          checked={fields.dark_mode}
          onChange={(e) => setFields({ ...fields, dark_mode: e.target.checked })}
          className="h-4 w-4 rounded border-ink/20 accent-[--color-blush-deep]"
        />
        Dark mode (applies once the theming pass lands)
      </label>

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={saving}>
          {saving ? "Saving…" : "Save changes"}
        </Button>
        {saved && <span className="text-sm text-ink-soft">Saved 🌷</span>}
      </div>
    </form>
  );
}
