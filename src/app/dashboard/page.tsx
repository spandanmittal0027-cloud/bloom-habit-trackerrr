import { createClient } from "@/lib/supabase/server";
import { HabitCard } from "@/components/dashboard/habit-cards";
import { ProgressRing } from "@/components/dashboard/progress-ring";
import { isHabitComplete, REWARD_MILESTONES } from "@/lib/habit-logic";
import type { HabitLog } from "@/lib/habit-logic";
import {
  computeCurrentStreak,
  greetingForNow,
  quoteForToday,
} from "@/lib/dashboard-helpers";

export default async function DashboardHomePage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("name, daily_goal")
    .eq("id", user!.id)
    .single();

  const todayKey = new Date().toISOString().slice(0, 10);
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  // Habits table now has a unique (user_id, name) constraint, so this is
  // guaranteed to be each habit exactly once — no more duplicates.
  const { data: habits } = await supabase
    .from("habits")
    .select("*")
    .eq("archived", false)
    .order("sort_order", { ascending: true });

  const { data: recentLogs } = await supabase
    .from("habit_logs")
    .select("habit_id, log_date, completed, value, meta")
    .gte("log_date", thirtyDaysAgo.toISOString().slice(0, 10));

  const logsByHabitAndDate = new Map<string, HabitLog>();
  (recentLogs ?? []).forEach((l) => {
    logsByHabitAndDate.set(`${l.habit_id}:${l.log_date}`, l as HabitLog);
  });

  const habitList = habits ?? [];
  const todayLogs = habitList.map(
    (h) => logsByHabitAndDate.get(`${h.id}:${todayKey}`) ?? null
  );

  const totalHabits = habitList.length;
  const completedToday = habitList.filter((h, i) =>
    isHabitComplete(h, todayLogs[i])
  ).length;
  const completionPercent = totalHabits
    ? (completedToday / totalHabits) * 100
    : 0;

  // A day counts toward the streak if every habit logged that day was
  // complete for its own interaction type — not just "any row exists".
  const dateGroups = new Map<string, { habitId: string; log: HabitLog }[]>();
  (recentLogs ?? []).forEach((l) => {
    const arr = dateGroups.get(l.log_date) ?? [];
    arr.push({ habitId: l.habit_id, log: l as HabitLog });
    dateGroups.set(l.log_date, arr);
  });

  const habitById = new Map(habitList.map((h) => [h.id, h]));
  const daysWithCompletion: string[] = [];
  dateGroups.forEach((entries, date) => {
    const anyComplete = entries.some(({ habitId, log }) => {
      const habit = habitById.get(habitId);
      return habit && isHabitComplete(habit, log);
    });
    if (anyComplete) daysWithCompletion.push(date);
  });

  const streak = computeCurrentStreak(daysWithCompletion);

  // Unlock any reward milestones this streak has newly crossed. Safe to run
  // on every load — the unique (user_id, type) constraint makes it a no-op
  // once a milestone is already unlocked.
  const crossedMilestones = REWARD_MILESTONES.filter((m) => streak >= m.days);
  if (crossedMilestones.length > 0) {
    await supabase.from("achievements").upsert(
      crossedMilestones.map((m) => ({
        user_id: user!.id,
        type: m.type,
      })),
      { onConflict: "user_id,type", ignoreDuplicates: true }
    );
  }

  // Weekly total minutes for any "duration" habits (e.g. design practice).
  const weeklyMinutesByHabit = new Map<string, number>();
  (recentLogs ?? [])
    .filter((l) => l.log_date >= sevenDaysAgo.toISOString().slice(0, 10))
    .forEach((l) => {
      weeklyMinutesByHabit.set(
        l.habit_id,
        (weeklyMinutesByHabit.get(l.habit_id) ?? 0) + (l.value ?? 0)
      );
    });

  const name = profile?.name?.split(" ")[0] ?? "friend";

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex flex-col gap-1">
        <p className="text-sm text-ink-soft">
          {new Date().toLocaleDateString(undefined, {
            weekday: "long",
            month: "long",
            day: "numeric",
          })}
        </p>
        <h1 className="font-[family-name:var(--font-hand)] text-4xl text-ink">
          {greetingForNow(name)}
        </h1>
        {profile?.daily_goal && (
          <p className="text-sm text-ink-soft">
            Today&apos;s focus: {profile.daily_goal}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="paper-card flex flex-col items-center justify-center px-4 py-6">
          <ProgressRing percent={completionPercent} label="Today's completion" />
        </div>
        <div className="paper-card flex flex-col items-center justify-center gap-1 px-4 py-6">
          <span className="text-3xl">🔥</span>
          <span className="font-[family-name:var(--font-hand)] text-4xl text-ink">
            {streak}
          </span>
          <span className="text-xs text-ink-soft">day streak</span>
        </div>
        <div className="paper-card flex flex-col items-center justify-center gap-2 px-4 py-6 text-center">
          <span className="text-2xl">✨</span>
          <p className="font-[family-name:var(--font-hand)] text-xl leading-snug text-ink">
            “{quoteForToday()}”
          </p>
        </div>
      </div>

      <div className="paper-card px-5 py-6">
        <h2 className="mb-4 font-[family-name:var(--font-hand)] text-2xl text-ink">
          Today&apos;s little rituals
        </h2>
        {habitList.length > 0 ? (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {habitList.map((habit, i) => (
              <HabitCard
                key={habit.id}
                habit={habit}
                todayLog={todayLogs[i]}
                todayKey={todayKey}
                weeklyMinutes={weeklyMinutesByHabit.get(habit.id) ?? 0}
              />
            ))}
          </div>
        ) : (
          <p className="text-sm text-ink-soft">
            No habits yet — this shouldn&apos;t happen after onboarding! Check
            that seed_default_habits ran for your account.
          </p>
        )}
      </div>
    </div>
  );
}
