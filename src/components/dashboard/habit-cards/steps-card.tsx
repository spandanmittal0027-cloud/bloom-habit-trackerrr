"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { HabitCardShell } from "./shell";
import type { Habit } from "@/lib/habit-logic";

export function StepsCard({
  habit,
  initialValue,
  onSave,
}: {
  habit: Habit;
  initialValue: number;
  onSave: (value: number, completed: boolean) => void;
}) {
  const target = habit.target_value ?? 8000;
  const [value, setValue] = useState(initialValue);
  const percent = Math.min(100, (value / target) * 100);
  const complete = value >= target;

  function commit(next: number) {
    const clamped = Math.max(0, Math.min(20000, next));
    setValue(clamped);
    onSave(clamped, clamped >= target);
  }

  return (
    <HabitCardShell emoji={habit.emoji} name={habit.name} color={habit.color} complete={complete}>
      <div className="space-y-2">
        <div className="h-2.5 w-full overflow-hidden rounded-full bg-ink/8">
          <motion.div
            className="h-full rounded-full bg-baby-blue-deep"
            animate={{ width: `${percent}%` }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />
        </div>

        <input
          type="range"
          min={0}
          max={target * 1.5}
          step={250}
          value={value}
          onChange={(e) => commit(Number(e.target.value))}
          className="w-full accent-[--color-baby-blue-deep]"
        />

        <div className="flex items-center justify-between text-xs text-ink-soft">
          <input
            type="number"
            value={value}
            onChange={(e) => commit(Number(e.target.value) || 0)}
            className="w-20 rounded-lg border border-ink/10 bg-warm-white/70 px-2 py-1 text-ink"
          />
          <span>of {target.toLocaleString()} steps</span>
        </div>
      </div>
    </HabitCardShell>
  );
}
