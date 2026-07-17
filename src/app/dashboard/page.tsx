import { createClient } from "@/lib/supabase/server";
import { TodayHabits } from "@/components/dashboard/today-habits";
import { ProgressRing } from "@/components/dashboard/progress-ring";
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
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const { data: habits } = await supabase
    .from("habits")
    .select("*")
    .eq("archived", false)
    .order("sort_order", { ascending: true });

  const { data: recentLogs } = await supabase
    .from("habit_logs")
    .select("habit_id, log_date, completed")
    .gte("log_date", thirtyDaysAgo.toISOString().slice(0, 10));

  const todaysLogs = (recentLogs ?? []).filter((l) => l.log_date === todayKey);
  const initialCompleted: Record<string, boolean> = {};
  todaysLogs.forEach((l) => {
    initialCompleted[l.habit_id] = l.completed;
  });

  const totalHabits = habits?.length ?? 0;
  const completedToday = todaysLogs.filter((l) => l.completed).length;
  const completionPercent = totalHabits
    ? (completedToday / totalHabits) * 100
    : 0;

  const daysWithCompletion = Array.from(
    new Set(
      (recentLogs ?? [])
        .filter((l) => l.completed)
        .map((l) => l.log_date)
    )
  );
  const streak = computeCurrentStreak(daysWithCompletion);

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
        {habits && habits.length > 0 ? (
          <TodayHabits
            habits={habits}
            initialCompleted={initialCompleted}
            todayKey={todayKey}
          />
        ) : (
          <p className="text-sm text-ink-soft">
            No habits yet — this shouldn&apos;t happen after onboarding! Check that
            seed_default_habits ran for your account.
          </p>
        )}
      </div>
    </div>
  );
}
