import { isHabitComplete } from "@/lib/habit-logic";
import type { Habit, HabitLog } from "@/lib/habit-logic";

export function daysInMonth(monthKey: string): number {
  const [y, m] = monthKey.split("-").map(Number);
  return new Date(y, m, 0).getDate();
}

export function monthDateKeys(monthKey: string): string[] {
  const total = daysInMonth(monthKey);
  return Array.from({ length: total }, (_, i) => {
    const day = (i + 1).toString().padStart(2, "0");
    return `${monthKey}-${day}`;
  });
}

/** Longest run of consecutive dates present in a (possibly unsorted) list. */
export function longestStreak(datesWithCompletion: string[]): number {
  const sorted = [...new Set(datesWithCompletion)].sort();
  if (sorted.length === 0) return 0;

  let longest = 1;
  let current = 1;
  for (let i = 1; i < sorted.length; i++) {
    const prev = new Date(sorted[i - 1] + "T00:00:00");
    const curr = new Date(sorted[i] + "T00:00:00");
    const diffDays = Math.round(
      (curr.getTime() - prev.getTime()) / 86400000
    );
    if (diffDays === 1) {
      current += 1;
      longest = Math.max(longest, current);
    } else {
      current = 1;
    }
  }
  return longest;
}

/** For each day in the month, what % of habits were completed. */
export function dailyCompletionPercents(
  habits: Habit[],
  logsByDate: Map<string, HabitLog[]>,
  dateKeys: string[]
): { date: string; percent: number; logged: boolean }[] {
  return dateKeys.map((date) => {
    const logs = logsByDate.get(date) ?? [];
    if (logs.length === 0 || habits.length === 0) {
      return { date, percent: 0, logged: logs.length > 0 };
    }
    const habitById = new Map(habits.map((h) => [h.id, h]));
    const completed = logs.filter((l) => {
      const habit = habitById.get(l.habit_id);
      return habit && isHabitComplete(habit, l);
    }).length;
    return {
      date,
      percent: (completed / habits.length) * 100,
      logged: true,
    };
  });
}

export type HabitConsistency = {
  habit: Habit;
  completedDays: number;
  loggedDays: number;
  percent: number;
};

/** Per-habit consistency % across the given dates — used to find the
 * "most difficult habit" (lowest percent) and to show individual bars. */
export function habitConsistencies(
  habits: Habit[],
  logsByHabit: Map<string, HabitLog[]>,
  totalDays: number
): HabitConsistency[] {
  return habits.map((habit) => {
    const logs = logsByHabit.get(habit.id) ?? [];
    const completedDays = logs.filter((l) => isHabitComplete(habit, l)).length;
    return {
      habit,
      completedDays,
      loggedDays: logs.length,
      percent: totalDays > 0 ? (completedDays / totalDays) * 100 : 0,
    };
  });
}

export function average(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((a, b) => a + b, 0) / values.length;
}

export function findHabitByName(habits: Habit[], name: string): Habit | undefined {
  return habits.find((h) => h.name === name);
}
