"use client";

import { useState, useTransition } from "react";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import type { Database } from "@/lib/supabase/types";

type Habit = Database["public"]["Tables"]["habits"]["Row"];

export function TodayHabits({
  habits,
  initialCompleted,
  todayKey,
}: {
  habits: Habit[];
  initialCompleted: Record<string, boolean>;
  todayKey: string;
}) {
  const supabase = createClient();
  const [completed, setCompleted] = useState(initialCompleted);
  const [, startTransition] = useTransition();

  function toggle(habitId: string) {
    const next = !completed[habitId];
    setCompleted((prev) => ({ ...prev, [habitId]: next }));

    startTransition(async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      await supabase.from("habit_logs").upsert(
        {
          user_id: user.id,
          habit_id: habitId,
          log_date: todayKey,
          completed: next,
          value: next ? 1 : 0,
        },
        { onConflict: "user_id,habit_id,log_date" }
      );
    });
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {habits.map((habit) => {
        const done = !!completed[habit.id];
        return (
          <motion.button
            key={habit.id}
            type="button"
            onClick={() => toggle(habit.id)}
            whileTap={{ scale: 0.95 }}
            className={cn(
              "flex flex-col items-center gap-2 rounded-2xl border px-3 py-4 text-center transition-colors",
              done
                ? "border-transparent text-ink shadow-[0_10px_24px_-14px_rgba(92,75,82,0.5)]"
                : "border-ink/10 bg-warm-white/60 text-ink-faint grayscale"
            )}
            style={{ backgroundColor: done ? habit.color : undefined }}
          >
            <span className="text-2xl">{habit.emoji}</span>
            <span className="text-xs font-medium leading-tight">
              {habit.name}
            </span>
          </motion.button>
        );
      })}
    </div>
  );
}
