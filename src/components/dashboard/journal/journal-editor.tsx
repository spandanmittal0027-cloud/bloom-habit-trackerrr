"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { MoodPicker } from "./mood-picker";
import { StickerPalette } from "./sticker-palette";
import { JournalCanvas } from "./journal-canvas";
import type { Database, ScrapbookData } from "@/lib/supabase/types";

type JournalEntry = Database["public"]["Tables"]["journal_entries"]["Row"];

export function JournalEditor({
  entryDate,
  initialEntry,
  prevDate,
  nextDate,
  canGoNext,
}: {
  entryDate: string;
  initialEntry: JournalEntry | null;
  prevDate: string;
  nextDate: string;
  canGoNext: boolean;
}) {
  const supabase = createClient();

  const [content, setContent] = useState(initialEntry?.content ?? "");
  const [moods, setMoods] = useState<string[]>(initialEntry?.moods ?? []);
  const [energy, setEnergy] = useState(initialEntry?.energy ?? 3);
  const [stress, setStress] = useState(initialEntry?.stress ?? 3);
  const [gratitude, setGratitude] = useState(initialEntry?.gratitude ?? "");
  const [win, setWin] = useState(initialEntry?.win ?? "");
  const [tomorrowGoal, setTomorrowGoal] = useState(
    initialEntry?.tomorrow_goal ?? ""
  );
  const [scrapbook, setScrapbook] = useState<ScrapbookData>(
    (initialEntry?.scrapbook as ScrapbookData) ?? {
      background: "cream-paper",
      elements: [],
    }
  );
  const [pendingSticker, setPendingSticker] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleSave() {
    setSaving(true);
    setSaved(false);

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.from("journal_entries").upsert(
      {
        user_id: user.id,
        entry_date: entryDate,
        content,
        moods,
        energy,
        stress,
        gratitude,
        win,
        tomorrow_goal: tomorrowGoal,
        scrapbook,
      },
      { onConflict: "user_id,entry_date" }
    );

    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  const isToday = entryDate === new Date().toISOString().slice(0, 10);

  return (
    <div className="mx-auto max-w-5xl space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-[family-name:var(--font-hand)] text-4xl text-ink">
            Your journal
          </h1>
          <p className="text-sm text-ink-soft">
            {new Date(entryDate + "T00:00:00").toLocaleDateString(undefined, {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
            {isToday && " — today"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link href={`/dashboard/journal?date=${prevDate}`}>
            <Button variant="outline" size="sm">
              ← Prev
            </Button>
          </Link>
          <Link
            href={canGoNext ? `/dashboard/journal?date=${nextDate}` : "#"}
            aria-disabled={!canGoNext}
          >
            <Button variant="outline" size="sm" disabled={!canGoNext}>
              Next →
            </Button>
          </Link>
        </div>
      </div>

      <div className="paper-card px-5 py-5">
        <MoodPicker selected={moods} onChange={setMoods} />
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_260px]">
        <JournalCanvas
          content={content}
          onContentChange={setContent}
          scrapbook={scrapbook}
          onScrapbookChange={setScrapbook}
          pendingSticker={pendingSticker}
          onStickerPlaced={() => setPendingSticker(null)}
        />
        <StickerPalette onAdd={(emoji) => setPendingSticker(emoji)} />
      </div>

      <div className="paper-card grid grid-cols-1 gap-5 px-5 py-5 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-xs font-medium uppercase tracking-[0.08em] text-ink-soft">
            Energy
          </label>
          <input
            type="range"
            min={1}
            max={5}
            value={energy}
            onChange={(e) => setEnergy(Number(e.target.value))}
            className="w-full accent-[--color-butter]"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium uppercase tracking-[0.08em] text-ink-soft">
            Stress
          </label>
          <input
            type="range"
            min={1}
            max={5}
            value={stress}
            onChange={(e) => setStress(Number(e.target.value))}
            className="w-full accent-[--color-blush-deep]"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium uppercase tracking-[0.08em] text-ink-soft">
            One thing you&apos;re grateful for
          </label>
          <input
            value={gratitude}
            onChange={(e) => setGratitude(e.target.value)}
            className="w-full rounded-xl border border-ink/10 bg-warm-white/70 px-3 py-2 text-sm text-ink"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium uppercase tracking-[0.08em] text-ink-soft">
            Today&apos;s win
          </label>
          <input
            value={win}
            onChange={(e) => setWin(e.target.value)}
            className="w-full rounded-xl border border-ink/10 bg-warm-white/70 px-3 py-2 text-sm text-ink"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-xs font-medium uppercase tracking-[0.08em] text-ink-soft">
            Tomorrow&apos;s goal
          </label>
          <input
            value={tomorrowGoal}
            onChange={(e) => setTomorrowGoal(e.target.value)}
            className="w-full rounded-xl border border-ink/10 bg-warm-white/70 px-3 py-2 text-sm text-ink"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button onClick={handleSave} disabled={saving} size="lg">
          {saving ? "Saving…" : "Save entry"}
        </Button>
        {saved && <span className="text-sm text-ink-soft">Saved 🌷</span>}
      </div>
    </div>
  );
}
