import { DecorativeBackground } from "@/components/auth/decorative-background";

export function AuthCard({
  eyebrow,
  title,
  subtitle,
  children,
  footer,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <main className="relative min-h-screen w-full bg-cream flex items-center justify-center px-4 py-12 overflow-hidden">
      <DecorativeBackground />

      <div className="paper-card relative z-10 w-full max-w-md px-8 py-10 sm:px-10">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-blush text-2xl">
            🌷
          </div>
          {eyebrow && (
            <p className="mb-1 text-xs font-medium uppercase tracking-[0.2em] text-ink-soft">
              {eyebrow}
            </p>
          )}
          <h1 className="font-[family-name:var(--font-hand)] text-4xl leading-tight text-ink">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-2 text-sm text-ink-soft leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>

        {children}

        {footer && (
          <div className="mt-7 text-center text-sm text-ink-soft">
            {footer}
          </div>
        )}
      </div>
    </main>
  );
}
