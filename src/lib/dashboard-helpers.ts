export const QUOTES = [
  "Consistency creates confidence.",
  "Your future self is watching.",
  "Small habits become big transformations.",
  "Every healthy choice is a vote for the life you want.",
  "Soft days still count. Keep going gently.",
  "You don't need to be perfect, just present.",
  "Every new day is another chance 🌷",
];

export function quoteForToday() {
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) /
      86400000
  );
  return QUOTES[dayOfYear % QUOTES.length];
}

export function greetingForNow(name: string) {
  const hour = new Date().getHours();
  if (hour < 12) return `Good Morning, ${name} 🌸`;
  if (hour < 18) return `Good Afternoon, ${name} 🌼`;
  return `Good Evening, ${name} ☁️`;
}

/**
 * Given a sorted-descending list of ISO date strings (log_date values with
 * at least one completed habit that day), returns the current consecutive
 * day streak counting back from today (or yesterday, so today doesn't
 * reset the streak before it's over).
 */
export function computeCurrentStreak(datesWithCompletion: string[]): number {
  const set = new Set(datesWithCompletion);
  let streak = 0;
  const cursor = new Date();
  cursor.setHours(0, 0, 0, 0);

  // If today has no completion yet, start checking from yesterday so an
  // in-progress day doesn't zero out the streak.
  const todayKey = cursor.toISOString().slice(0, 10);
  if (!set.has(todayKey)) {
    cursor.setDate(cursor.getDate() - 1);
  }

  while (true) {
    const key = cursor.toISOString().slice(0, 10);
    if (set.has(key)) {
      streak += 1;
      cursor.setDate(cursor.getDate() - 1);
    } else {
      break;
    }
  }
  return streak;
}
