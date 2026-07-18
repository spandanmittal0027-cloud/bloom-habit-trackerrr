"use client";

import { cn } from "@/lib/utils";
import { MOODS } from "@/lib/journal-content";

export function MoodPicker({
  selected,
  onChange,
}: {
  selected: string[];
  onChange: (next: string[]) => void;
}) {
  function toggle(id: string) {
    onChange(
      selected.includes(id)
        ? selected.filter((m) => m !== id)
        : [...selected, id]
    );
  }

  return (
    <div>
      <p className="mb-2 text-xs font-medium uppercase tracking-[0.08em] text-ink-soft">
        How are you feeling today?
      </p>
      <div className="flex flex-wrap gap-2">
        {MOODS.map((mood) => {
          const active = selected.includes(mood.id);
          return (
            <button
              key={mood.id}
              type="button"
              onClick={() => toggle(mood.id)}
              className={cn(
                "flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm transition",
                active
                  ? "border-transparent bg-blush text-ink shadow-sm"
                  : "border-ink/10 bg-warm-white/60 text-ink-soft hover:bg-warm-white"
              )}
            >
              <span>{mood.emoji}</span>
              {mood.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
