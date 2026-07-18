import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DecorativeBackground } from "@/components/auth/decorative-background";
import { Button } from "@/components/ui/button";

export default async function LandingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/dashboard");
  }

  return (
    <main className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-cream px-4">
      <DecorativeBackground />

      <div className="paper-card relative z-10 max-w-lg px-8 py-12 text-center sm:px-12">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-blush text-3xl">
          🌸
        </div>
        <h1 className="font-[family-name:var(--font-hand)] text-5xl text-ink">
          bloom
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-ink-soft">
          A cozy, Pinterest-inspired habit journal. Small rituals, gentle
          streaks, and a soft place to write about your day — kept just for
          you, synced everywhere you go.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link href="/signup">
            <Button size="lg" className="w-full sm:w-auto">
              Start your journal
            </Button>
          </Link>
          <Link href="/login">
            <Button size="lg" variant="outline" className="w-full sm:w-auto">
              Log in
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
