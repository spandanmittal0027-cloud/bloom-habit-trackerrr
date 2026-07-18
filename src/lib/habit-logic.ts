import type { Database } from "@/lib/supabase/types";

export type Habit = Database["public"]["Tables"]["habits"]["Row"];
export type HabitLog = Database["public"]["Tables"]["habit_logs"]["Row"];

export type MealsMeta = {
  breakfast?: boolean;
  lunch?: boolean;
  dinner?: boolean;
};

export type TimeMeta = {
  time?: string; // "HH:MM"
};

export type DurationMeta = {
  minutes?: number;
};

/** Converts "22:15" -> 1335 (minutes since midnight). */
export function timeToMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

export function minutesToTime(minutes: number): string {
  const h = Math.floor(minutes / 60)
    .toString()
    .padStart(2, "0");
  const m = Math.round(minutes % 60)
    .toString()
    .padStart(2, "0");
  return `${h}:${m}`;
}

export type TextMeta = {
  text?: string;
};

/**
 * Given a habit's interaction type and its log for a day, returns whether
 * that habit counts as "done" for the day. This is the single source of
 * truth used by the dashboard, the completion ring, and streak math.
 */
export function isHabitComplete(habit: Habit, log?: Partial<HabitLog> | null): boolean {
  if (!log) return false;
  const meta = (log.meta ?? {}) as Record<string, unknown>;

  switch (habit.interaction_type) {
    case "steps":
    case "water":
    case "number":
    case "slider":
      if (habit.target_value == null) return (log.value ?? 0) > 0;
      return (log.value ?? 0) >= habit.target_value;
    case "yesno":
    case "jar":
    case "pills":
      return !!log.completed;
    case "meals": {
      const m = meta as MealsMeta;
      return !!(m.breakfast && m.lunch && m.dinner);
    }
    case "time": {
      const t = meta as TimeMeta;
      if (!t.time || habit.target_value == null) return false;
      // "goal by HH:MM" — done if the logged time is at or before the target.
      return timeToMinutes(t.time) <= habit.target_value;
    }
    case "duration":
      // Any logged practice time counts as showing up for the day.
      return (log.value ?? 0) > 0;
    case "text": {
      const t = meta as TextMeta;
      return !!t.text && t.text.trim().length > 0;
    }
    default:
      return !!log.completed;
  }
}

export const REWARD_MILESTONES = [
  { days: 7, type: "streak_7", label: "Flower stickers", emoji: "🌸" },
  { days: 14, type: "streak_14", label: "New journal backgrounds", emoji: "🎨" },
  { days: 21, type: "streak_21", label: "Washi tape set", emoji: "🎀" },
  { days: 30, type: "streak_30", label: "New mood boards", emoji: "🌿" },
  { days: 50, type: "streak_50", label: "Animated decorations", emoji: "✨" },
  { days: 100, type: "streak_100", label: "Premium scrapbook items", emoji: "👑" },
] as const;
