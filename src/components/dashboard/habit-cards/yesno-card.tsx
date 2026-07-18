"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { HabitCardShell } from "./shell";
import type { Habit } from "@/lib/habit-logic";

export function YesNoCard({
  habit,
  initialCompleted,
  onSave,
}: {
  habit: Habit;
  initialCompleted: boolean | null;
  onSave: (completed: boolean) => void;
}) {
  const [answered, setAnswered] = useState<boolean | null>(initialCompleted);

  return (
    <HabitCardShell
      emoji={habit.emoji}
      name={habit.name}
      color={habit.color}
      complete={answered === true}
    >
      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => {
            setAnswered(true);
            onSave(true);
          }}
          className={cn(
            "rounded-xl border py-2 text-xs font-medium transition",
            answered === true
              ? "border-transparent bg-sage-deep text-ink"
              : "border-ink/10 bg-warm-white/60 text-ink-soft hover:bg-warm-white"
          )}
        >
          Stayed on track 🌿
        </button>
        <button
          type="button"
          onClick={() => {
            setAnswered(false);
            onSave(false);
          }}
          className={cn(
            "rounded-xl border py-2 text-xs font-medium transition",
            answered === false
              ? "border-transparent bg-blush text-ink"
              : "border-ink/10 bg-warm-white/60 text-ink-soft hover:bg-warm-white"
          )}
        >
          Not today
        </button>
      </div>
    </HabitCardShell>
  );
}
