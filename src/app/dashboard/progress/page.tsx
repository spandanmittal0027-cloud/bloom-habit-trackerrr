import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Heatmap } from "@/components/dashboard/progress/heatmap";
import { CompletionChart } from "@/components/dashboard/progress/completion-chart";
import { StatCard } from "@/components/dashboard/progress/stat-card";
import { Button } from "@/components/ui/button";
import { isHabitComplete } from "@/lib/habit-logic";
import type { Habit, HabitLog } from "@/lib/habit-logic";
import { computeCurrentStreak } from "@/lib/dashboard-helpers";
import {
  average,
  daysInMonth,
  dailyCompletionPercents,
  findHabitByName,
  habitConsistencies,
  longestStreak,
  monthDateKeys,
} from "@/lib/analytics";

function shiftMonth(monthKey: string, delta: number) {
  const [y, m] = monthKey.split("-").map(Number);
  const d = new Date(y, m - 1 + delta, 1);
  return `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, "0")}`;
}

export default async function ProgressPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string }>;
}) {
  const supabase = await createClient();
  const now = new Date();
  const currentMonthKey = `${now.getFullYear()}-${(now.getMonth() + 1)
    .toString()
    .padStart(2, "0")}`;
  const { month } = await searchParams;
  const monthKey =
    month && /^\d{4}-\d{2}$/.test(month) ? month : currentMonthKey;

  const dateKeys = monthDateKeys(monthKey);
  const totalDaysInMonth = daysInMonth(monthKey);
  const isPastOrCurrentDataAvailable = dateKeys[0] <= now.toISOString().slice(0, 10);

  const { data: habits } = await supabase
    .from("habits")
    .select("*")
    .eq("archived", false)
    .order("sort_order", { ascending: true });
  const habitList: Habit[] = habits ?? [];

  const { data: monthLogsRaw } = await supabase
    .from("habit_logs")
    .select("habit_id, log_date, completed, value, meta")
    .gte("log_date", dateKeys[0])
    .lte("log_date", dateKeys[dateKeys.length - 1]);
  const monthLogs = (monthLogsRaw ?? []) as HabitLog[];

  const yearAgo = new Date();
  yearAgo.setDate(yearAgo.getDate() - 365);
  const { data: historyLogsRaw } = await supabase
    .from("habit_logs")
    .select("habit_id, log_date, completed, value, meta")
    .gte("log_date", yearAgo.toISOString().slice(0, 10));
  const historyLogs = (historyLogsRaw ?? []) as HabitLog[];

  const habitById = new Map(habitList.map((h) => [h.id, h]));

  // --- streaks (computed from full history, not just the viewed month) ---
  const historyByDate = new Map<string, HabitLog[]>();
  historyLogs.forEach((l) => {
    const arr = historyByDate.get(l.log_date) ?? [];
    arr.push(l);
    historyByDate.set(l.log_date, arr);
  });
  const daysWithAnyCompletion: string[] = [];
  historyByDate.forEach((logs, date) => {
    const any = logs.some((l) => {
      const h = habitById.get(l.habit_id);
      return h && isHabitComplete(h, l);
    });
    if (any) daysWithAnyCompletion.push(date);
  });
  const currentStreak = computeCurrentStreak(daysWithAnyCompletion);
  const longest = longestStreak(daysWithAnyCompletion);

  // --- month heatmap + chart ---
  const monthLogsByDate = new Map<string, HabitLog[]>();
  monthLogs.forEach((l) => {
    const arr = monthLogsByDate.get(l.log_date) ?? [];
    arr.push(l);
    monthLogsByDate.set(l.log_date, arr);
  });
  const dailyPercents = dailyCompletionPercents(habitList, monthLogsByDate, dateKeys);
  const loggedDays = dailyPercents.filter((d) => d.logged);
  const avgCompletion = average(loggedDays.map((d) => d.percent));

  // --- per-habit consistency ---
  const monthLogsByHabit = new Map<string, HabitLog[]>();
  monthLogs.forEach((l) => {
    const arr = monthLogsByHabit.get(l.habit_id) ?? [];
    arr.push(l);
    monthLogsByHabit.set(l.habit_id, arr);
  });
  const consistencies = habitConsistencies(
    habitList,
    monthLogsByHabit,
    totalDaysInMonth
  ).sort((a, b) => a.percent - b.percent);
  const mostDifficult = consistencies.find((c) => c.loggedDays > 0);

  // --- specific named-habit insights ---
  const stepsHabit = findHabitByName(habitList, "Walk 8,000+ Steps");
  const waterHabit = findHabitByName(habitList, "Drink 3 Litres Water");
  const sugarHabit = findHabitByName(habitList, "No Sugar");
  const junkHabit = findHabitByName(habitList, "No Junk Food");
  const packagedHabit = findHabitByName(habitList, "No Packaged Food");
  const medsHabit = findHabitByName(habitList, "Medicines");
  const sleepHabit = findHabitByName(habitList, "Sleep by 10 PM");

  const avgSteps = stepsHabit
    ? average((monthLogsByHabit.get(stepsHabit.id) ?? []).map((l) => l.value ?? 0))
    : 0;
  const avgWater = waterHabit
    ? average((monthLogsByHabit.get(waterHabit.id) ?? []).map((l) => l.value ?? 0))
    : 0;
  const sugarFreeDays = sugarHabit
    ? (monthLogsByHabit.get(sugarHabit.id) ?? []).filter((l) =>
        isHabitComplete(sugarHabit, l)
      ).length
    : 0;

  const healthyDays = dateKeys.filter((date) => {
    const logs = monthLogsByDate.get(date) ?? [];
    const check = (habit?: Habit) => {
      if (!habit) return true;
      const log = logs.find((l) => l.habit_id === habit.id);
      return log ? isHabitComplete(habit, log) : false;
    };
    return check(junkHabit) && check(sugarHabit) && check(packagedHabit);
  }).length;

  const medsConsistency = consistencies.find((c) => c.habit.id === medsHabit?.id);
  const sleepConsistency = consistencies.find((c) => c.habit.id === sleepHabit?.id);
  const stepsConsistency = consistencies.find((c) => c.habit.id === stepsHabit?.id);

  const monthLabel = new Date(monthKey + "-01T00:00:00").toLocaleDateString(
    undefined,
    { month: "long", year: "numeric" }
  );

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-[family-name:var(--font-hand)] text-4xl text-ink">
          {monthLabel}
        </h1>
        <div className="flex gap-2">
          <Link href={`/dashboard/progress?month=${shiftMonth(monthKey, -1)}`}>
            <Button variant="outline" size="sm">← Prev</Button>
          </Link>
          <Link
            href={
              monthKey < currentMonthKey
                ? `/dashboard/progress?month=${shiftMonth(monthKey, 1)}`
                : "#"
            }
          >
            <Button variant="outline" size="sm" disabled={monthKey >= currentMonthKey}>
              Next →
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard emoji="🔥" label="Current streak" value={`${currentStreak}d`} />
        <StatCard emoji="🏆" label="Longest streak" value={`${longest}d`} />
        <StatCard
          emoji="✅"
          label="Avg. completion"
          value={`${Math.round(avgCompletion)}%`}
          sub={`${loggedDays.length}/${totalDaysInMonth} days tracked`}
        />
        <StatCard
          emoji="🌷"
          label="Healthy days"
          value={`${healthyDays}`}
          sub="junk + sugar + packaged free"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="paper-card px-5 py-5">
          <h2 className="mb-3 font-[family-name:var(--font-hand)] text-xl text-ink">
            Consistency heatmap
          </h2>
          <Heatmap data={dailyPercents} />
        </div>
        <div className="paper-card px-5 py-5">
          <h2 className="mb-3 font-[family-name:var(--font-hand)] text-xl text-ink">
            Daily completion
          </h2>
          {isPastOrCurrentDataAvailable ? (
            <CompletionChart data={dailyPercents} />
          ) : (
            <p className="py-10 text-center text-sm text-ink-soft">
              This month hasn&apos;t happened yet 🌱
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard emoji="🚶" label="Avg. steps/day" value={Math.round(avgSteps).toLocaleString()} />
        <StatCard emoji="💧" label="Avg. water/day" value={`${avgWater.toFixed(1)}L`} />
        <StatCard emoji="🍓" label="Sugar-free days" value={`${sugarFreeDays}`} />
        <StatCard
          emoji="💊"
          label="Medicine consistency"
          value={`${Math.round(medsConsistency?.percent ?? 0)}%`}
        />
      </div>

      <div className="paper-card px-5 py-5">
        <h2 className="mb-4 font-[family-name:var(--font-hand)] text-xl text-ink">
          Habit by habit
        </h2>
        <div className="space-y-2.5">
          {consistencies.map(({ habit, percent, loggedDays: logged }) => (
            <div key={habit.id}>
              <div className="mb-1 flex items-center justify-between text-xs">
                <span className="text-ink">
                  {habit.emoji} {habit.name}
                </span>
                <span className="text-ink-soft">
                  {Math.round(percent)}%{" "}
                  {logged === 0 && (
                    <span className="text-ink-faint">(not logged)</span>
                  )}
                </span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-ink/8">
                <div
                  className="h-full rounded-full bg-lavender-deep transition-all"
                  style={{ width: `${percent}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="paper-card px-5 py-6">
        <h2 className="mb-2 font-[family-name:var(--font-hand)] text-xl text-ink">
          Your month, reflected
        </h2>
        <p className="text-sm leading-relaxed text-ink-soft">
          {loggedDays.length === 0 ? (
            <>You haven&apos;t logged anything yet this month — every new day is another chance 🌷</>
          ) : (
            <>
              You tracked {loggedDays.length} of {totalDaysInMonth} days this
              month, averaging {Math.round(avgCompletion)}% completion.{" "}
              {mostDifficult && (
                <>
                  <strong className="font-medium text-ink">
                    {mostDifficult.habit.name}
                  </strong>{" "}
                  was the habit you found hardest to keep up, at{" "}
                  {Math.round(mostDifficult.percent)}%.{" "}
                </>
              )}
              {sleepConsistency && (
                <>Sleep consistency landed at {Math.round(sleepConsistency.percent)}%. </>
              )}
              {stepsConsistency && (
                <>You hit your step goal on {stepsConsistency.completedDays} days. </>
              )}
              Your longest streak so far is {longest} days — keep going gently.
            </>
          )}
        </p>
      </div>
    </div>
  );
}
