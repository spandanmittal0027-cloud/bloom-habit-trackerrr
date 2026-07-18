"use client";

import { useState } from "react";
import { HabitCardShell } from "./shell";
import type { Habit } from "@/lib/habit-logic";

export function SliderCard({
  habit,
  initialValue,
  onSave,
}: {
  habit: Habit;
  initialValue: number;
  onSave: (value: number, completed: boolean) => void;
}) {
  const max = habit.target_value ?? 10;
  const [value, setValue] = useState(initialValue);
  const complete = value >= max;

  function commit(next: number) {
    setValue(next);
    onSave(next, next >= max);
  }

  return (
    <HabitCardShell emoji={habit.emoji} name={habit.name} color={habit.color} complete={complete}>
      <div className="space-y-1.5">
        <input
          type="range"
          min={0}
          max={max}
          value={value}
          onChange={(e) => commit(Number(e.target.value))}
          className="w-full accent-[--color-peach]"
        />
        <div className="text-center text-xs text-ink-soft">
          {value} {habit.unit ?? ""} of {max} {habit.unit ?? ""}
        </div>
      </div>
    </HabitCardShell>
  );
}
