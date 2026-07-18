"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { HabitCreatorModal } from "./habit-creator-modal";
import type { Database } from "@/lib/supabase/types";

type Habit = Database["public"]["Tables"]["habits"]["Row"];

export function HabitsManager({ habits }: { habits: Habit[] }) {
  const supabase = createClient();
  const router = useRouter();
  const [showCreator, setShowCreator] = useState(false);

  const activeHabits = habits.filter((h) => !h.archived);
  const archivedHabits = habits.filter((h) => h.archived);
  const nextSortOrder = habits.length
    ? Math.max(...habits.map((h) => h.sort_order)) + 1
    : 1;

  async function toggleArchived(habit: Habit) {
    await supabase
      .from("habits")
      .update({ archived: !habit.archived })
      .eq("id", habit.id);
    router.refresh();
  }

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="font-[family-name:var(--font-hand)] text-2xl text-ink">
          Your habits
        </h2>
        <Button size="sm" onClick={() => setShowCreator(true)}>
          + Add custom habit
        </Button>
      </div>

      <div className="space-y-1.5">
        {activeHabits.map((habit) => (
          <div
            key={habit.id}
            className="flex items-center justify-between rounded-xl bg-warm-white/60 px-3 py-2"
          >
            <div className="flex items-center gap-2">
              <span
                className="flex h-7 w-7 items-center justify-center rounded-full text-sm"
                style={{ backgroundColor: habit.color }}
              >
                {habit.emoji}
              </span>
              <span className="text-sm text-ink">{habit.name}</span>
              {habit.is_custom && (
                <span className="rounded-full bg-lavender px-2 py-0.5 text-[0.6rem] text-ink-soft">
                  custom
                </span>
              )}
            </div>
            <button
              type="button"
              onClick={() => toggleArchived(habit)}
              className="text-xs text-ink-soft underline underline-offset-2 hover:text-ink"
            >
              Archive
            </button>
          </div>
        ))}
      </div>

      {archivedHabits.length > 0 && (
        <details className="mt-4">
          <summary className="cursor-pointer text-xs text-ink-soft">
            Archived habits ({archivedHabits.length})
          </summary>
          <div className="mt-2 space-y-1.5">
            {archivedHabits.map((habit) => (
              <div
                key={habit.id}
                className="flex items-center justify-between rounded-xl bg-warm-white/30 px-3 py-2 opacity-60"
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm">{habit.emoji}</span>
                  <span className="text-sm text-ink">{habit.name}</span>
                </div>
                <button
                  type="button"
                  onClick={() => toggleArchived(habit)}
                  className="text-xs text-ink-soft underline underline-offset-2 hover:text-ink"
                >
                  Restore
                </button>
              </div>
            ))}
          </div>
        </details>
      )}

      {showCreator && (
        <HabitCreatorModal
          nextSortOrder={nextSortOrder}
          onClose={() => setShowCreator(false)}
          onCreated={() => {
            setShowCreator(false);
            router.refresh();
          }}
        />
      )}
    </div>
  );
}
