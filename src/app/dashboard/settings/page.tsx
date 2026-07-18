import { createClient } from "@/lib/supabase/server";
import { SettingsForm } from "@/components/dashboard/settings-form";
import { HabitsManager } from "@/components/dashboard/settings/habits-manager";

export default async function SettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user!.id)
    .single();

  const { data: habits } = await supabase
    .from("habits")
    .select("*")
    .order("sort_order", { ascending: true });

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <h1 className="font-[family-name:var(--font-hand)] text-4xl text-ink">
        Your space
      </h1>
      <div className="paper-card px-6 py-6">
        <SettingsForm
          email={user!.email ?? ""}
          initialProfile={{
            name: profile?.name ?? "",
            username: profile?.username ?? "",
            daily_goal: profile?.daily_goal ?? "",
            preferred_theme: profile?.preferred_theme ?? "pink-gingham",
            dark_mode: profile?.dark_mode ?? false,
            timezone: profile?.timezone ?? "UTC",
          }}
        />
      </div>

      <div className="paper-card px-6 py-6">
        <HabitsManager habits={habits ?? []} />
      </div>
    </div>
  );
}
