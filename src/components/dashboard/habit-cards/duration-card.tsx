"use client";

import { useState } from "react";
import { HabitCardShell } from "./shell";
import type { Habit } from "@/lib/habit-logic";

export function DurationCard({
  habit,
  initialMinutes,
  weeklyMinutes,
  onSave,
}: {
  habit: Habit;
  initialMinutes: number;
  weeklyMinutes: number;
  onSave: (minutes: number) => void;
}) {
  const [minutes, setMinutes] = useState(initialMinutes);
  const complete = minutes > 0;

  function commit(next: number) {
    const clamped = Math.max(0, Math.min(600, next));
    setMinutes(clamped);
    onSave(clamped);
  }

  const weeklyHours = ((weeklyMinutes - initialMinutes + minutes) / 60).toFixed(1);

  return (
    <HabitCardShell emoji={habit.emoji} name={habit.name} color={habit.color} complete={complete}>
      <div className="space-y-1.5">
        <div className="flex items-center gap-2">
          <input
            type="number"
            min={0}
            step={5}
            value={minutes}
            onChange={(e) => commit(Number(e.target.value) || 0)}
            className="w-20 rounded-lg border border-ink/10 bg-warm-white/70 px-2 py-1 text-sm text-ink"
          />
          <span className="text-xs text-ink-soft">minutes today</span>
        </div>
        <p className="text-[0.65rem] text-ink-faint">
          {weeklyHours}h this week
        </p>
      </div>
    </HabitCardShell>
  );
}
