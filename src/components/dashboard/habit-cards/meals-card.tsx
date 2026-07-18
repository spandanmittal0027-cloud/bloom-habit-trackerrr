"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { HabitCardShell } from "./shell";
import type { Habit, MealsMeta } from "@/lib/habit-logic";

const MEALS: { key: keyof MealsMeta; label: string; emoji: string }[] = [
  { key: "breakfast", label: "Breakfast", emoji: "🌅" },
  { key: "lunch", label: "Lunch", emoji: "🌤️" },
  { key: "dinner", label: "Dinner", emoji: "🌙" },
];

export function MealsCard({
  habit,
  initialMeta,
  onSave,
}: {
  habit: Habit;
  initialMeta: MealsMeta;
  onSave: (meta: MealsMeta, completed: boolean) => void;
}) {
  const [meta, setMeta] = useState<MealsMeta>(initialMeta);
  const complete = !!(meta.breakfast && meta.lunch && meta.dinner);

  function toggle(key: keyof MealsMeta) {
    const next = { ...meta, [key]: !meta[key] };
    setMeta(next);
    onSave(next, !!(next.breakfast && next.lunch && next.dinner));
  }

  return (
    <HabitCardShell emoji={habit.emoji} name={habit.name} color={habit.color} complete={complete}>
      <div className="flex gap-1.5">
        {MEALS.map((meal) => (
          <button
            key={meal.key}
            type="button"
            onClick={() => toggle(meal.key)}
            className={cn(
              "flex flex-1 flex-col items-center gap-1 rounded-xl border py-2 text-[0.65rem] transition",
              meta[meal.key]
                ? "border-transparent bg-butter/70 text-ink"
                : "border-ink/10 bg-warm-white/60 text-ink-faint"
            )}
          >
            <span className="text-base">{meal.emoji}</span>
            {meal.label}
          </button>
        ))}
      </div>
    </HabitCardShell>
  );
}
