export function ComingSoon({
  emoji,
  title,
  description,
}: {
  emoji: string;
  title: string;
  description: string;
}) {
  return (
    <div className="mx-auto flex max-w-lg flex-col items-center gap-3 pt-16 text-center">
      <span className="text-5xl">{emoji}</span>
      <h1 className="font-[family-name:var(--font-hand)] text-3xl text-ink">
        {title}
      </h1>
      <p className="text-sm leading-relaxed text-ink-soft">{description}</p>
      <span className="mt-2 rounded-full bg-warm-white px-4 py-1.5 text-xs text-ink-soft">
        Coming in the next build phase 🌷
      </span>
    </div>
  );
}
