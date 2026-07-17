"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/dashboard", label: "Home", emoji: "🏡" },
  { href: "/dashboard/month", label: "Month", emoji: "🗓️" },
  { href: "/dashboard/progress", label: "Progress", emoji: "📈" },
  { href: "/dashboard/journal", label: "Journal", emoji: "📖" },
  { href: "/dashboard/rewards", label: "Rewards", emoji: "🌼" },
  { href: "/dashboard/settings", label: "Settings", emoji: "⚙️" },
];

export function Sidebar({ name }: { name: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <aside className="flex h-full w-full flex-col justify-between p-5 sm:w-60">
      <div>
        <div className="mb-8 flex items-center gap-2 px-2">
          <span className="text-2xl">🌸</span>
          <span className="font-[family-name:var(--font-hand)] text-2xl text-ink">
            bloom
          </span>
        </div>

        <nav className="space-y-1">
          {NAV.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm transition",
                  active
                    ? "bg-warm-white text-ink shadow-sm"
                    : "text-ink-soft hover:bg-warm-white/60"
                )}
              >
                <span>{item.emoji}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="space-y-3">
        <div className="paper-card px-3 py-2.5 text-sm text-ink-soft">
          Signed in as
          <div className="truncate font-medium text-ink">{name}</div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full rounded-2xl px-3 py-2.5 text-left text-sm text-ink-soft transition hover:bg-warm-white/60"
        >
          🚪 Log out
        </button>
      </div>
    </aside>
  );
}
