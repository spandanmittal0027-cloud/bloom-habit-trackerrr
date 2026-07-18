"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { HabitCardShell } from "./shell";
import type { Habit } from "@/lib/habit-logic";

const GLASS_LITRES = 0.25;

export function WaterCard({
  habit,
  initialValue,
  onSave,
}: {
  habit: Habit;
  initialValue: number;
  onSave: (value: number, completed: boolean) => void;
}) {
  const target = habit.target_value ?? 3;
  const [litres, setLitres] = useState(initialValue);
  const percent = Math.min(100, (litres / target) * 100);
  const complete = litres >= target;

  function commit(next: number) {
    const clamped = Math.max(0, Math.round(next * 100) / 100);
    setLitres(clamped);
    onSave(clamped, clamped >= target);
  }

  return (
    <HabitCardShell emoji={habit.emoji} name={habit.name} color={habit.color} complete={complete}>
      <div className="flex items-center gap-3">
        {/* bottle */}
        <div className="relative h-16 w-8 shrink-0 overflow-hidden rounded-b-xl rounded-t-md border-2 border-baby-blue-deep/50 bg-warm-white">
          <motion.div
            className="absolute bottom-0 left-0 w-full bg-baby-blue-deep/70"
            animate={{ height: `${percent}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>

        <div className="flex-1 space-y-1.5">
          <div className="text-xs text-ink-soft">
            {litres.toFixed(2)}L of {target}L
          </div>
          <div className="flex gap-1.5">
            <button
              type="button"
              onClick={() => commit(litres + GLASS_LITRES)}
              className="rounded-full bg-baby-blue px-2.5 py-1 text-xs text-ink transition hover:bg-baby-blue-deep"
            >
              +1 glass
            </button>
            <button
              type="button"
              onClick={() => commit(litres - GLASS_LITRES)}
              className="rounded-full bg-warm-white px-2.5 py-1 text-xs text-ink-soft transition hover:bg-ink/5"
            >
              −
            </button>
          </div>
        </div>
      </div>
    </HabitCardShell>
  );
}
