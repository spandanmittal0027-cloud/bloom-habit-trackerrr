"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { HabitCardShell } from "./shell";
import type { Habit } from "@/lib/habit-logic";

export function JarCard({
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
        className="flex w-full items-center gap-3 rounded-xl bg-warm-white/60 px-3 py-2 text-left transition hover:bg-warm-white"
      >
        <div className="relative h-9 w-7 shrink-0 overflow-hidden rounded-b-lg rounded-t-sm border-2 border-sage-deep/50 bg-warm-white">
          <motion.div
            className="absolute bottom-0 left-0 w-full bg-sage-deep/70"
            animate={{ height: done ? "80%" : "10%" }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />
        </div>
        <span className="text-xs text-ink-soft">
          {done ? "Jar's filled — well done 🌱" : "Tap once you've had it"}
        </span>
      </button>
    </HabitCardShell>
  );
}
