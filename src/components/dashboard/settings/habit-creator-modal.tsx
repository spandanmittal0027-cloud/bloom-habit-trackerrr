"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  MEASUREMENT_TYPES,
  HABIT_COLOR_OPTIONS,
  HABIT_EMOJI_SUGGESTIONS,
} from "@/lib/habit-content";
import { timeToMinutes } from "@/lib/habit-logic";
import type { InteractionType } from "@/lib/supabase/types";

export function HabitCreatorModal({
  nextSortOrder,
  onClose,
  onCreated,
}: {
  nextSortOrder: number;
  onClose: () => void;
  onCreated: () => void;
}) {
  const supabase = createClient();

  const [name, setName] = useState("");
  const [emoji, setEmoji] = useState("✨");
  const [color, setColor] = useState(HABIT_COLOR_OPTIONS[0].hex);
  const [type, setType] = useState<InteractionType>("yesno");
  const [target, setTarget] = useState("");
  const [unit, setUnit] = useState("");
  const [goalTime, setGoalTime] = useState("22:00");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const needsTarget = type === "number" || type === "slider";
  const needsTime = type === "time";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      setError("Give your habit a name first.");
      return;
    }
    setError(null);
    setSaving(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setSaving(false);
      return;
    }

    const { error: insertError } = await supabase.from("habits").insert({
      user_id: user.id,
      name: name.trim(),
      emoji,
      color,
      interaction_type: type,
      target_value: needsTarget && target ? Number(target) : needsTime ? timeToMinutes(goalTime) : null,
      unit: needsTarget && unit ? unit : null,
      sort_order: nextSortOrder,
      is_custom: true,
    });

    setSaving(false);

    if (insertError) {
      setError(
        insertError.code === "23505"
          ? "You already have a habit with that name."
          : insertError.message
      );
      return;
    }

    onCreated();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/30 px-4 py-8">
      <div className="paper-card max-h-[85vh] w-full max-w-md overflow-y-auto px-6 py-6">
        <h2 className="mb-4 font-[family-name:var(--font-hand)] text-2xl text-ink">
          New habit
        </h2>

        {error && (
          <p className="mb-3 rounded-xl bg-blush/80 px-3 py-2 text-sm text-ink">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="habit-name">Name</Label>
            <Input
              id="habit-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Read before bed"
              required
            />
          </div>

          <div>
            <Label>Icon</Label>
            <div className="mb-2 flex items-center gap-2">
              <Input
                value={emoji}
                onChange={(e) => setEmoji(e.target.value.slice(0, 2))}
                className="w-16 text-center text-xl"
              />
              <span className="text-xs text-ink-soft">
                pick below, or type your own emoji
              </span>
            </div>
            <div className="grid grid-cols-10 gap-1">
              {HABIT_EMOJI_SUGGESTIONS.map((e) => (
                <button
                  key={e}
                  type="button"
                  onClick={() => setEmoji(e)}
                  className={cn(
                    "rounded-lg py-1 text-lg transition hover:bg-warm-white",
                    emoji === e && "bg-warm-white"
                  )}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>

          <div>
            <Label>Color</Label>
            <div className="flex gap-2">
              {HABIT_COLOR_OPTIONS.map((c) => (
                <button
                  key={c.hex}
                  type="button"
                  title={c.label}
                  onClick={() => setColor(c.hex)}
                  className={cn(
                    "h-8 w-8 rounded-full border-2 transition",
                    color === c.hex ? "border-ink/40" : "border-transparent"
                  )}
                  style={{ backgroundColor: c.hex }}
                />
              ))}
            </div>
          </div>

          <div>
            <Label>Measurement type</Label>
            <div className="grid grid-cols-2 gap-1.5">
              {MEASUREMENT_TYPES.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setType(m.id)}
                  className={cn(
                    "rounded-xl border px-2.5 py-2 text-left text-xs transition",
                    type === m.id
                      ? "border-transparent bg-lavender-deep/60 text-ink"
                      : "border-ink/10 bg-warm-white/60 text-ink-soft hover:bg-warm-white"
                  )}
                >
                  <div className="font-medium">{m.label}</div>
                  <div className="text-[0.65rem] text-ink-faint">
                    {m.description}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {needsTarget && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="target">Daily goal (optional)</Label>
                <Input
                  id="target"
                  type="number"
                  value={target}
                  onChange={(e) => setTarget(e.target.value)}
                  placeholder="e.g. 10"
                />
              </div>
              <div>
                <Label htmlFor="unit">Unit (optional)</Label>
                <Input
                  id="unit"
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  placeholder="e.g. pages"
                />
              </div>
            </div>
          )}

          {needsTime && (
            <div>
              <Label htmlFor="goal-time">Goal — complete by</Label>
              <Input
                id="goal-time"
                type="time"
                value={goalTime}
                onChange={(e) => setGoalTime(e.target.value)}
              />
            </div>
          )}

          <div className="flex items-center gap-2 pt-2">
            <Button type="submit" disabled={saving}>
              {saving ? "Creating…" : "Create habit"}
            </Button>
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
