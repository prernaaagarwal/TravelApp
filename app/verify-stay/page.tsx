import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { ShieldCheck } from "lucide-react";
import { StayVerifyForm } from "@/components/verify/StayVerifyForm";
import { env } from "@/lib/config";

export const metadata = {
  title: "Verify Your Stay — Wander Women",
  description: "Paste any booking link and get an AI-powered safety analysis in seconds.",
};

// The AI safety analysis runs against the Anthropic API. Without a configured
// key the feature is temporarily disabled — we show a "coming back soon"
// state instead of a form that can't actually do anything.
const isAiEnabled = !!env.ANTHROPIC_API_KEY;

export default async function VerifyStayPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/account/login?next=/verify-stay");

  // Count verifications used this month (still useful when re-enabled)
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const { count } = await supabase
    .from("stay_verifications")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)
    .gte("created_at", startOfMonth.toISOString());

  const usedThisMonth = count ?? 0;

  return (
    <main className="mx-auto max-w-2xl px-4 py-10 md:py-16">
      <div className="mb-8">
        <div
          className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 mb-4 font-mono text-[11px] uppercase tracking-[0.25em] ${
            isAiEnabled
              ? "bg-sage-light text-sage"
              : "bg-ww-border/60 text-ww-muted"
          }`}
        >
          <span
            className={`h-2 w-2 rounded-full ${isAiEnabled ? "bg-sage" : "bg-ww-muted"}`}
            aria-hidden
          />
          <ShieldCheck className="h-3.5 w-3.5" aria-hidden />
          AI Safety Check
          {!isAiEnabled && <span className="ml-1">· Beta · Offline</span>}
        </div>
        <h1
          className={`mb-4 font-serif text-4xl leading-[1.02] tracking-tight md:text-6xl ${
            isAiEnabled ? "text-ink" : "text-ww-muted/80"
          }`}
        >
          Is this stay{" "}
          <span className="font-serif font-medium italic text-gold">safe?</span>
        </h1>
        <p className={`max-w-xl font-mono text-sm leading-relaxed ${isAiEnabled ? "text-ww-muted" : "text-ww-muted/70"}`}>
          Paste any booking link — Airbnb, Booking.com, Agoda, MakeMyTrip, or others.
          We&apos;ll run a safety and scam analysis tuned for solo women travellers.
        </p>
      </div>

      {isAiEnabled ? (
        <div className="rounded-2xl border border-ww-border bg-warm-white p-6">
          <StayVerifyForm usedThisMonth={usedThisMonth} />
        </div>
      ) : (
        <div className="relative rounded-2xl border border-ww-border bg-warm-white p-6">
          {/* Disabled mock form */}
          <div className="pointer-events-none select-none opacity-40">
            <label className="block mb-2 font-mono text-[10px] uppercase tracking-widest text-ww-muted">
              Booking link
            </label>
            <div className="mb-4 h-11 rounded-md border border-ww-border bg-sand" />
            <div className="h-11 w-44 rounded-md bg-rust" />
          </div>

          {/* Overlay banner */}
          <div className="mt-6 border border-gold/40 bg-gold-light px-5 py-4">
            <p className="mb-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-gold">
              Beta · Temporarily offline
            </p>
            <p className="font-mono text-xs leading-relaxed text-ink">
              The AI safety check is paused. We&apos;ll switch this back on
              shortly. In the meantime, browse <Link href="/community" className="text-rust underline underline-offset-2">scam reports</Link> on the
              Beware Board or read a destination&apos;s <Link href="/explore" className="text-rust underline underline-offset-2">trip intel card</Link>{" "}
              — they cover the same ground without the AI layer.
            </p>
          </div>
        </div>
      )}

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3 text-center">
        {[
          { label: "Scam patterns", desc: "Platform-specific fraud signals" },
          { label: "Authenticity check", desc: "Fake listing red flags" },
          { label: "Neighbourhood safety", desc: "Solo travel risk context" },
        ].map((item) => (
          <div
            key={item.label}
            className={`rounded-xl border p-4 ${
              isAiEnabled
                ? "border-ww-border"
                : "border-ww-border bg-sand/50 opacity-70"
            }`}
          >
            <p
              className={`text-sm font-medium mb-1 ${
                isAiEnabled ? "text-ink" : "text-ww-muted"
              }`}
            >
              {item.label}
            </p>
            <p className="text-xs text-ww-muted">{item.desc}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
