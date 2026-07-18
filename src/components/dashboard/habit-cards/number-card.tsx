"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { HabitCardShell } from "./shell";
import type { Habit } from "@/lib/habit-logic";

export function NumberCard({
  habit,
  initialValue,
  onSave,
}: {
  habit: Habit;
  initialValue: number;
  onSave: (value: number, completed: boolean) => void;
}) {
  const target = habit.target_value;
  const [value, setValue] = useState(initialValue);
  const complete = target != null ? value >= target : value > 0;
  const percent = target ? Math.min(100, (value / target) * 100) : 0;

  function commit(next: number) {
    const clamped = Math.max(0, next);
    setValue(clamped);
    onSave(clamped, target != null ? clamped >= target : clamped > 0);
  }

  return (
    <HabitCardShell emoji={habit.emoji} name={habit.name} color={habit.color} complete={complete}>
      <div className="space-y-2">
        {target != null && (
          <div className="h-2 w-full overflow-hidden rounded-full bg-ink/8">
            <motion.div
              className="h-full rounded-full bg-lavender-deep"
              animate={{ width: `${percent}%` }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            />
          </div>
        )}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => commit(value - 1)}
            className="h-7 w-7 rounded-full bg-warm-white/70 text-ink-soft transition hover:bg-warm-white"
          >
            −
          </button>
          <input
            type="number"
            value={value}
            onChange={(e) => commit(Number(e.target.value) || 0)}
            className="w-16 rounded-lg border border-ink/10 bg-warm-white/70 px-2 py-1 text-center text-sm text-ink"
          />
          <button
            type="button"
            onClick={() => commit(value + 1)}
            className="h-7 w-7 rounded-full bg-warm-white/70 text-ink-soft transition hover:bg-warm-white"
          >
            +
          </button>
          {habit.unit && (
            <span className="text-xs text-ink-soft">
              {habit.unit}
              {target != null && ` of ${target}`}
            </span>
          )}
        </div>
      </div>
    </HabitCardShell>
  );
}
