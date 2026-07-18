export function StatCard({
  emoji,
  label,
  value,
  sub,
}: {
  emoji: string;
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className="paper-card flex flex-col items-center justify-center gap-1 px-4 py-5 text-center">
      <span className="text-2xl">{emoji}</span>
      <span className="font-[family-name:var(--font-hand)] text-3xl text-ink">
        {value}
      </span>
      <span className="text-xs text-ink-soft">{label}</span>
      {sub && <span className="text-[0.65rem] text-ink-faint">{sub}</span>}
    </div>
  );
}
