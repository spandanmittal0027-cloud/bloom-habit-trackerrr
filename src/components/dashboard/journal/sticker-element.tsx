"use client";

import { motion, type PanInfo } from "framer-motion";
import { cn } from "@/lib/utils";
import type { StickerElement } from "@/lib/supabase/types";

export function StickerElementView({
  element,
  containerRef,
  selected,
  onSelect,
  onMove,
  onResize,
  onRemove,
}: {
  element: StickerElement;
  containerRef: React.RefObject<HTMLDivElement | null>;
  selected: boolean;
  onSelect: () => void;
  onMove: (x: number, y: number) => void;
  onResize: (scale: number) => void;
  onRemove: () => void;
}) {
  function handleDragEnd(_e: unknown, info: PanInfo) {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = ((info.point.x - rect.left) / rect.width) * 100;
    const y = ((info.point.y - rect.top) / rect.height) * 100;
    onMove(
      Math.min(96, Math.max(0, x)),
      Math.min(96, Math.max(0, y))
    );
  }

  return (
    <motion.div
      drag
      dragMomentum={false}
      onDragEnd={handleDragEnd}
      onTap={onSelect}
      whileDrag={{ scale: element.scale * 1.08, zIndex: 30 }}
      className="absolute cursor-grab select-none active:cursor-grabbing"
      style={{
        left: `${element.x}%`,
        top: `${element.y}%`,
        fontSize: `${1.5 * element.scale}rem`,
        rotate: `${element.rotation}deg`,
        zIndex: selected ? 20 : 5,
      }}
    >
      <div
        className={cn(
          "relative rounded-2xl p-1",
          selected && "outline outline-2 outline-dashed outline-ink/25"
        )}
      >
        {element.emoji}

        {selected && (
          <div
            className="absolute -top-9 left-1/2 flex -translate-x-1/2 items-center gap-1 rounded-full bg-ink px-2 py-1 text-xs text-warm-white shadow-lg"
            style={{ fontSize: "0.7rem" }}
          >
            <button
              type="button"
              onPointerDown={(e) => e.stopPropagation()}
              onClick={() => onResize(Math.max(0.6, element.scale - 0.2))}
              className="px-1"
            >
              −
            </button>
            <button
              type="button"
              onPointerDown={(e) => e.stopPropagation()}
              onClick={() => onResize(Math.min(2.4, element.scale + 0.2))}
              className="px-1"
            >
              +
            </button>
            <button
              type="button"
              onPointerDown={(e) => e.stopPropagation()}
              onClick={onRemove}
              className="px-1 text-blush"
            >
              ×
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}
