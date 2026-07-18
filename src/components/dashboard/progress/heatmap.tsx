"use client";

import { cn } from "@/lib/utils";

function colorFor(percent: number, logged: boolean) {
  if (!logged) return "var(--color-ink)"; // handled via opacity below
  if (percent >= 90) return "var(--color-sage-deep)";
  if (percent >= 60) return "var(--color-baby-blue-deep)";
  if (percent >= 30) return "var(--color-butter)";
  return "var(--color-blush)";
}

export function Heatmap({
  data,
}: {
  data: { date: string; percent: number; logged: boolean }[];
}) {
  const firstDate = new Date(data[0]?.date + "T00:00:00");
  const leadingBlanks = firstDate.getDay(); // 0 = Sunday

  return (
    <div>
      <div className="mb-1.5 grid grid-cols-7 gap-1.5 text-center text-[0.65rem] text-ink-faint">
        {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
          <span key={i}>{d}</span>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1.5">
        {Array.from({ length: leadingBlanks }).map((_, i) => (
          <div key={`blank-${i}`} />
        ))}
        {data.map((d) => (
          <div
            key={d.date}
            title={
              d.logged
                ? `${new Date(d.date + "T00:00:00").getDate()} — ${Math.round(d.percent)}% complete`
                : `${new Date(d.date + "T00:00:00").getDate()} — no entries`
            }
            className={cn(
              "aspect-square rounded-lg transition",
              !d.logged && "bg-ink/5"
            )}
            style={
              d.logged
                ? { backgroundColor: colorFor(d.percent, d.logged) }
                : undefined
            }
          />
        ))}
      </div>

      <div className="mt-3 flex items-center justify-end gap-2 text-[0.65rem] text-ink-faint">
        <span>Less</span>
        <span className="h-3 w-3 rounded bg-ink/5" />
        <span className="h-3 w-3 rounded" style={{ backgroundColor: "var(--color-blush)" }} />
        <span className="h-3 w-3 rounded" style={{ backgroundColor: "var(--color-butter)" }} />
        <span className="h-3 w-3 rounded" style={{ backgroundColor: "var(--color-baby-blue-deep)" }} />
        <span className="h-3 w-3 rounded" style={{ backgroundColor: "var(--color-sage-deep)" }} />
        <span>More</span>
      </div>
    </div>
  );
}
