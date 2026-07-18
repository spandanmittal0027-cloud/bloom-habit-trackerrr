"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { HabitCardShell } from "./shell";
import type { Habit } from "@/lib/habit-logic";

export function PillsCard({
  habit,
  initialCompleted,
  onSave,
}: {
  habit: Habit;
  initialCompleted: boolean;
  onSave: (completed: boolean) => void;
}) {
  const [done, setDone] = useState(initialCompleted);

  function toggle() {
    const next = !done;
    setDone(next);
    onSave(next);
  }

  return (
    <HabitCardShell emoji={habit.emoji} name={habit.name} color={habit.color} complete={done}>
      <button
        type="button"
        onClick={toggle}
        className="flex w-full items-center justify-between rounded-xl bg-warm-white/60 px-3 py-2.5 transition hover:bg-warm-white"
      >
        <div className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="text-lg"
              animate={{
                opacity: done ? 1 : 0.25,
                y: done ? [4, -2, 0] : 0,
              }}
              transition={{ delay: i * 0.08, duration: 0.3 }}
            >
              💊
            </motion.span>
          ))}
        </div>
        <span className="text-xs text-ink-soft">
          {done ? "Taken today" : "Tap once taken"}
        </span>
      </button>
    </HabitCardShell>
  );
}
