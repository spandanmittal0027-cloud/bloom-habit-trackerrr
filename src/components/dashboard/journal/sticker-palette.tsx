"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { STICKER_CATEGORIES } from "@/lib/journal-content";

export function StickerPalette({
  onAdd,
}: {
  onAdd: (emoji: string) => void;
}) {
  const [activeCategory, setActiveCategory] = useState(
    STICKER_CATEGORIES[0].id
  );
  const category = STICKER_CATEGORIES.find((c) => c.id === activeCategory)!;

  return (
    <div className="paper-card px-4 py-4">
      <p className="mb-2 text-xs font-medium uppercase tracking-[0.08em] text-ink-soft">
        Stickers
      </p>

      <div className="mb-3 flex flex-wrap gap-1.5">
        {STICKER_CATEGORIES.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => setActiveCategory(c.id)}
            className={cn(
              "rounded-full px-2.5 py-1 text-[0.7rem] transition",
              activeCategory === c.id
                ? "bg-lavender-deep text-ink"
                : "bg-warm-white/60 text-ink-soft hover:bg-warm-white"
            )}
          >
            {c.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-6 gap-1.5 sm:grid-cols-3">
        {category.stickers.map((s) => (
          <button
            key={s.emoji}
            type="button"
            title={s.label}
            onClick={() => onAdd(s.emoji)}
            className="flex items-center justify-center rounded-xl bg-warm-white/60 py-2 text-xl transition hover:scale-110 hover:bg-warm-white active:scale-95"
          >
            {s.emoji}
          </button>
        ))}
      </div>
      <p className="mt-3 text-[0.65rem] leading-relaxed text-ink-faint">
        Tap a sticker to drop it onto your page, then drag it into place. Tap
        a placed sticker to resize or remove it.
      </p>
    </div>
  );
}
