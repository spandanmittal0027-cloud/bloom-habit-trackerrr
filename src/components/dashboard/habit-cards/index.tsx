"use client";

import { useMemo, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { isHabitComplete } from "@/lib/habit-logic";
import type { Habit, HabitLog } from "@/lib/habit-logic";
import { StepsCard } from "./steps-card";
import { WaterCard } from "./water-card";
import { YesNoCard } from "./yesno-card";
import { JarCard } from "./jar-card";
import { PillsCard } from "./pills-card";
import { MealsCard } from "./meals-card";
import { TimeCard } from "./time-card";
import { DurationCard } from "./duration-card";
import { NumberCard } from "./number-card";
import { SliderCard } from "./slider-card";
import { TextCard } from "./text-card";

export function HabitCard({
  habit,
  todayLog,
  todayKey,
  weeklyMinutes,
}: {
  habit: Habit;
  todayLog: Partial<HabitLog> | null;
  todayKey: string;
  weeklyMinutes: number;
}) {
  const supabase = useMemo(() => createClient(), []);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function save(patch: {
    value?: number;
    completed: boolean;
    meta?: Record<string, unknown>;
  }) {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      await supabase.from("habit_logs").upsert(
        {
          user_id: user.id,
          habit_id: habit.id,
          log_date: todayKey,
          completed: patch.completed,
          value: patch.value ?? 0,
          meta: patch.meta ?? {},
        },
        { onConflict: "user_id,habit_id,log_date" }
      );
    }, 350);
  }

  switch (habit.interaction_type) {
    case "steps":
      return (
        <StepsCard
          habit={habit}
          initialValue={todayLog?.value ?? 0}
          onSave={(value, completed) => save({ value, completed })}
        />
      );
    case "water":
      return (
        <WaterCard
          habit={habit}
          initialValue={todayLog?.value ?? 0}
          onSave={(value, completed) => save({ value, completed })}
        />
      );
    case "yesno":
      return (
        <YesNoCard
          habit={habit}
          initialCompleted={
            todayLog ? isHabitComplete(habit, todayLog) : null
          }
          onSave={(completed) => save({ completed })}
        />
      );
    case "jar":
      return (
        <JarCard
          habit={habit}
          initialCompleted={!!todayLog?.completed}
          onSave={(completed) => save({ completed })}
        />
      );
    case "pills":
      return (
        <PillsCard
          habit={habit}
          initialCompleted={!!todayLog?.completed}
          onSave={(completed) => save({ completed })}
        />
      );
    case "meals": {
      const meta = (todayLog?.meta ?? {}) as Record<string, unknown>;
      return (
        <MealsCard
          habit={habit}
          initialMeta={meta}
          onSave={(nextMeta, completed) => save({ completed, meta: nextMeta })}
        />
      );
    }
    case "time": {
      const meta = (todayLog?.meta ?? {}) as { time?: string };
      return (
        <TimeCard
          habit={habit}
          initialTime={meta.time ?? ""}
          onSave={(time, completed) => save({ completed, meta: { time } })}
        />
      );
    }
    case "duration":
      return (
        <DurationCard
          habit={habit}
          initialMinutes={todayLog?.value ?? 0}
          weeklyMinutes={weeklyMinutes}
          onSave={(minutes) => save({ value: minutes, completed: minutes > 0 })}
        />
      );
    case "number":
      return (
        <NumberCard
          habit={habit}
          initialValue={todayLog?.value ?? 0}
          onSave={(value, completed) => save({ value, completed })}
        />
      );
    case "slider":
      return (
        <SliderCard
          habit={habit}
          initialValue={todayLog?.value ?? 0}
          onSave={(value, completed) => save({ value, completed })}
        />
      );
    case "text": {
      const meta = (todayLog?.meta ?? {}) as { text?: string };
      return (
        <TextCard
          habit={habit}
          initialText={meta.text ?? ""}
          onSave={(text, completed) => save({ completed, meta: { text } })}
        />
      );
    }
    default:
      return (
        <YesNoCard
          habit={habit}
          initialCompleted={todayLog?.completed ?? null}
          onSave={(completed) => save({ completed })}
        />
      );
  }
}
