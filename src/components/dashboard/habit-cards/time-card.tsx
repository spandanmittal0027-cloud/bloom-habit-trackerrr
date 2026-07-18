"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { HabitCardShell } from "./shell";
import { minutesToTime, timeToMinutes } from "@/lib/habit-logic";
import type { Habit } from "@/lib/habit-logic";

export function TimeCard({
  habit,
  initialTime,
  onSave,
}: {
  habit: Habit;
  initialTime: string;
  onSave: (time: string, completed: boolean) => void;
}) {
  const [time, setTime] = useState(initialTime);
  const target = habit.target_value ?? 1320;
  const complete = !!time && timeToMinutes(time) <= target;

  function commit(next: string) {
    setTime(next);
    onSave(next, !!next && timeToMinutes(next) <= target);
  }

  return (
    <HabitCardShell emoji={habit.emoji} name={habit.name} color={habit.color} complete={complete}>
      <div className="flex items-center justify-between gap-2">
        <input
          type="time"
          value={time}
          onChange={(e) => commit(e.target.value)}
          className="rounded-lg border border-ink/10 bg-warm-white/70 px-2 py-1.5 text-sm text-ink"
        />
        <span
          className={cn(
            "text-xs",
            complete ? "text-ink" : "text-ink-faint"
          )}
        >
          Goal: {minutesToTime(target)}
        </span>
      </div>
    </HabitCardShell>
  );
}
