"use client";

import { useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { BACKGROUND_PRESETS } from "@/lib/journal-content";
import { StickerElementView } from "./sticker-element";
import type { ScrapbookData, StickerElement } from "@/lib/supabase/types";

let idCounter = 0;
function nextId() {
  idCounter += 1;
  return `sticker-${Date.now()}-${idCounter}`;
}

export function JournalCanvas({
  content,
  onContentChange,
  scrapbook,
  onScrapbookChange,
  pendingSticker,
  onStickerPlaced,
}: {
  content: string;
  onContentChange: (value: string) => void;
  scrapbook: ScrapbookData;
  onScrapbookChange: (next: ScrapbookData) => void;
  pendingSticker: string | null;
  onStickerPlaced: () => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const elements = scrapbook.elements ?? [];
  const backgroundId = scrapbook.background ?? "cream-paper";
  const background =
    BACKGROUND_PRESETS.find((b) => b.id === backgroundId) ??
    BACKGROUND_PRESETS[0];

  function updateElements(next: StickerElement[]) {
    onScrapbookChange({ ...scrapbook, elements: next });
  }

  function addStickerAt(emoji: string, xPercent = 40, yPercent = 30) {
    const el: StickerElement = {
      id: nextId(),
      emoji,
      x: xPercent,
      y: yPercent,
      scale: 1,
      rotation: (Math.random() - 0.5) * 16,
    };
    updateElements([...elements, el]);
    setSelectedId(el.id);
  }

  function handleCanvasClick() {
    if (pendingSticker) {
      addStickerAt(pendingSticker);
      onStickerPlaced();
    } else {
      setSelectedId(null);
    }
  }

  return (
    <div>
      <div className="mb-2 flex flex-wrap gap-1.5">
        {BACKGROUND_PRESETS.map((b) => (
          <button
            key={b.id}
            type="button"
            title={b.label}
            onClick={() => onScrapbookChange({ ...scrapbook, background: b.id })}
            className={cn(
              "h-6 w-6 rounded-full border-2 transition",
              backgroundId === b.id ? "border-ink/40" : "border-transparent"
            )}
            style={{ backgroundColor: b.swatch }}
          />
        ))}
      </div>

      <div
        ref={containerRef}
        onClick={handleCanvasClick}
        className={cn(
          "relative min-h-[420px] w-full overflow-hidden rounded-3xl border border-ink/10 shadow-inner",
          pendingSticker && "cursor-copy"
        )}
        style={{ background: background.style }}
      >
        <textarea
          value={content}
          onChange={(e) => onContentChange(e.target.value)}
          placeholder="Write about your day…"
          className="h-full min-h-[420px] w-full resize-none bg-transparent p-6 text-[0.95rem] leading-relaxed text-ink outline-none placeholder:text-ink-faint"
          style={{ position: "relative", zIndex: 1 }}
        />

        {elements.map((el) => (
          <StickerElementView
            key={el.id}
            element={el}
            containerRef={containerRef}
            selected={selectedId === el.id}
            onSelect={() => setSelectedId(el.id)}
            onMove={(x, y) =>
              updateElements(
                elements.map((e) => (e.id === el.id ? { ...e, x, y } : e))
              )
            }
            onResize={(scale) =>
              updateElements(
                elements.map((e) => (e.id === el.id ? { ...e, scale } : e))
              )
            }
            onRemove={() => {
              updateElements(elements.filter((e) => e.id !== el.id));
              setSelectedId(null);
            }}
          />
        ))}

        {pendingSticker && (
          <div className="pointer-events-none absolute inset-x-0 bottom-3 text-center text-xs text-ink-soft">
            Tap anywhere on the page to place {pendingSticker}
          </div>
        )}
      </div>
    </div>
  );
}
