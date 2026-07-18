"use client";

import { useState } from "react";
import { HabitCardShell } from "./shell";
import type { Habit } from "@/lib/habit-logic";

export function TextCard({
  habit,
  initialText,
  onSave,
}: {
  habit: Habit;
  initialText: string;
  onSave: (text: string, completed: boolean) => void;
}) {
  const [text, setText] = useState(initialText);
  const complete = text.trim().length > 0;

  function commit(next: string) {
    setText(next);
    onSave(next, next.trim().length > 0);
  }

  return (
    <HabitCardShell emoji={habit.emoji} name={habit.name} color={habit.color} complete={complete}>
      <textarea
        value={text}
        onChange={(e) => commit(e.target.value)}
        placeholder="Jot a note…"
        rows={2}
        className="w-full resize-none rounded-lg border border-ink/10 bg-warm-white/70 px-2 py-1.5 text-sm text-ink outline-none placeholder:text-ink-faint"
      />
    </HabitCardShell>
  );
}
