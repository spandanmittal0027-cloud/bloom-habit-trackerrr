export function ProgressRing({
  percent,
  label,
  color = "var(--color-blush-deep)",
}: {
  percent: number;
  label: string;
  color?: string;
}) {
  const radius = 46;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-2">
      <svg width="120" height="120" viewBox="0 0 120 120" className="-rotate-90">
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke="var(--color-ink)"
          strokeOpacity="0.08"
          strokeWidth="10"
        />
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.6s ease" }}
        />
      </svg>
      <div className="-mt-[5.5rem] text-center">
        <div className="font-[family-name:var(--font-hand)] text-3xl text-ink">
          {Math.round(percent)}%
        </div>
      </div>
      <div className="mt-9 text-xs text-ink-soft">{label}</div>
    </div>
  );
}
