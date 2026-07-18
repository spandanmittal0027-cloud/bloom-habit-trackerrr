import { createClient } from "@/lib/supabase/server";
import { REWARD_MILESTONES } from "@/lib/habit-logic";
import { cn } from "@/lib/utils";

export default async function RewardsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: unlocked } = await supabase
    .from("achievements")
    .select("type, unlocked_at")
    .eq("user_id", user!.id);

  const unlockedTypes = new Map(
    (unlocked ?? []).map((a) => [a.type, a.unlocked_at])
  );

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="font-[family-name:var(--font-hand)] text-4xl text-ink">
          Milestones
        </h1>
        <p className="mt-1 text-sm text-ink-soft">
          Small, quiet celebrations for showing up — no pressure, just proof
          of the days you kept going.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {REWARD_MILESTONES.map((m) => {
          const unlockedAt = unlockedTypes.get(m.type);
          const isUnlocked = !!unlockedAt;
          return (
            <div
              key={m.type}
              className={cn(
                "paper-card flex items-center gap-4 px-5 py-5 transition",
                !isUnlocked && "opacity-55 grayscale"
              )}
            >
              <span className="text-3xl">{m.emoji}</span>
              <div>
                <p className="text-sm font-medium text-ink">
                  {m.days}-day streak
                </p>
                <p className="text-xs text-ink-soft">{m.label}</p>
                {isUnlocked && unlockedAt && (
                  <p className="mt-1 text-[0.65rem] text-ink-faint">
                    Unlocked{" "}
                    {new Date(unlockedAt).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-center text-xs text-ink-faint">
        Missed a day? Every new day is another chance 🌷 — your streak
        picks back up from today.
      </p>
    </div>
  );
}
