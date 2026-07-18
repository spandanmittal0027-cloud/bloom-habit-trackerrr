import { createClient } from "@/lib/supabase/server";
import { JournalEditor } from "@/components/dashboard/journal/journal-editor";

function shiftDate(dateKey: string, days: number) {
  const d = new Date(dateKey + "T00:00:00");
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

export default async function JournalPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const todayKey = new Date().toISOString().slice(0, 10);
  const { date } = await searchParams;
  const entryDate = date && /^\d{4}-\d{2}-\d{2}$/.test(date) ? date : todayKey;

  const { data: entry } = await supabase
    .from("journal_entries")
    .select("*")
    .eq("user_id", user!.id)
    .eq("entry_date", entryDate)
    .maybeSingle();

  return (
    <JournalEditor
      entryDate={entryDate}
      initialEntry={entry}
      prevDate={shiftDate(entryDate, -1)}
      nextDate={shiftDate(entryDate, 1)}
      canGoNext={entryDate < todayKey}
    />
  );
}
