import Link from "next/link";
import {
  Radio,
  MapPin,
  ChevronRight,
  Clipboard,
  ShoppingBag,
  BadgeCheck,
  Sparkles,
  Users,
} from "lucide-react";
import { SafetyPackBlock } from "@/components/safety/SafetyPackBlock";

export const metadata = {
  title: "Safety redesign preview — Wander Women",
  description:
    "Internal preview of the /safety visual refresh. Not linked from nav.",
  robots: { index: false, follow: false },
};

/* ------------------------------------------------------------------
   /safety/preview — visual redesign of the safety hub.
   Reference-vibe layout with copy rewritten to reflect what actually
   exists today: no live tracking, no SOS dispatcher, no buddy ping,
   no proximity-based scam radar, no fake metrics. Each section maps
   to a real route on Wander Women: /shop, /verify-stay, /community,
   /buddy, /vault.
------------------------------------------------------------------ */

export default function SafetyPreviewPage() {
  return (
    <div className="bg-sand">
      {/* ── Top brand strip (was: live status bar) ───────────── */}
      <div className="bg-[#b9221a] text-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3 md:px-8">
          <div className="flex items-center gap-2 font-mono text-[11px] tracking-wide md:text-xs">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-70" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
            </span>
            <Radio className="h-3.5 w-3.5 opacity-80" aria-hidden />
            <span className="hidden sm:inline">
              <strong className="font-semibold">Wander Women</strong> safety
              toolkit · Free in open beta · No login to browse
            </span>
            <span className="sm:hidden">
              <strong className="font-semibold">Wander Women</strong> · Free
              beta
            </span>
          </div>
          <Link
            href="/safety"
            className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/10 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-white transition-colors hover:bg-white/20 md:text-[11px]"
          >
            All four tools <ChevronRight className="h-3.5 w-3.5" aria-hidden />
          </Link>
        </div>
      </div>

      {/* ── Preview banner ───────────────────────────────────── */}
      <div className="border-b border-gold/30 bg-gold-light/60">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-5 py-2 md:px-8">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-gold">
            <Sparkles
              className="mr-1.5 inline h-3 w-3 align-text-bottom"
              aria-hidden
            />
            Preview · /safety redesign — not yet live
          </p>
          <Link
            href="/safety"
            className="font-mono text-[10px] uppercase tracking-widest text-gold underline-offset-4 hover:underline"
          >
            ← live /safety
          </Link>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════
          1 — HERO + THREE TOOL CARDS
          ════════════════════════════════════════════════════════ */}
      <section className="mx-auto max-w-6xl px-5 pb-10 pt-12 md:px-8 md:pt-16">
        <p className="mb-5 font-mono text-[11px] uppercase tracking-[0.25em] text-blue">
          Solo female travel safety toolkit
        </p>
        <h1 className="mb-5 font-serif text-[2.5rem] leading-[1.02] tracking-tight text-ink md:text-6xl lg:text-[4.5rem]">
          You&apos;re safer when{" "}
          <span className="font-serif font-medium italic text-gold">
            someone else
          </span>{" "}
          is paying attention too.
        </h1>
        <p className="max-w-2xl font-mono text-sm leading-relaxed text-ww-muted md:text-base">
          Four tools made by women who travel solo. Pack the kit. Save the docs.
          Verify the stay. Dodge the scams. Everything safety-related lives in
          one place so you don&apos;t hunt for it mid-trip.
        </p>

        {/* Three tool cards (no live data — just entry points) */}
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {/* Before you go — Safety Kit */}
          <Link
            href="/shop"
            className="group rounded-3xl border border-sage/30 bg-sage-light/60 p-6 shadow-[0_1px_0_rgba(74,124,89,0.08)] transition-colors hover:border-sage/60"
          >
            <div className="mb-4 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-sage">
              <span className="h-2 w-2 rounded-full bg-sage" aria-hidden />
              <ShoppingBag className="h-3.5 w-3.5" aria-hidden />
              Before you go
            </div>
            <h2 className="mb-3 font-serif text-2xl leading-tight text-ink md:text-[1.75rem]">
              Pack the kit you&apos;ll wish you had at 1am.
            </h2>
            <p className="mb-4 font-mono text-xs leading-relaxed text-ink/70">
              15 products our contributors actually carry — door wedges, RFID
              wallets, personal alarms, eSIMs.
            </p>
            <span className="inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-widest text-sage">
              Browse the kit{" "}
              <ChevronRight
                className="h-3 w-3 transition-transform group-hover:translate-x-0.5"
                aria-hidden
              />
            </span>
          </Link>

          {/* Before you book — Verify Stay */}
          <Link
            href="/verify-stay"
            className="group rounded-3xl border border-gold/30 bg-gold-light/70 p-6 shadow-[0_1px_0_rgba(181,134,10,0.08)] transition-colors hover:border-gold/60"
          >
            <div className="mb-4 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-gold">
              <span className="h-2 w-2 rounded-full bg-gold" aria-hidden />
              <BadgeCheck className="h-3.5 w-3.5" aria-hidden />
              Before you book
            </div>
            <h2 className="mb-3 font-serif text-2xl leading-tight text-ink md:text-[1.75rem]">
              Check the listing before you transfer money.
            </h2>
            <p className="mb-4 font-mono text-xs leading-relaxed text-ink/70">
              Paste any Airbnb or Booking link. AI cross-checks the host, the
              area, and our scam reports.
            </p>
            <span className="inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-widest text-gold">
              Verify a stay{" "}
              <ChevronRight
                className="h-3 w-3 transition-transform group-hover:translate-x-0.5"
                aria-hidden
              />
            </span>
          </Link>

          {/* When you arrive — Beware Board */}
          <Link
            href="/community?tab=beware"
            className="group rounded-3xl border border-rust/30 bg-rust-light/70 p-6 shadow-[0_1px_0_rgba(196,82,42,0.08)] transition-colors hover:border-rust/60"
          >
            <div className="mb-4 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-rust">
              <span className="h-2 w-2 rounded-full bg-rust" aria-hidden />
              <MapPin className="h-3.5 w-3.5" aria-hidden />
              When you arrive
            </div>
            <h2 className="mb-3 font-serif text-2xl leading-tight text-ink md:text-[1.75rem]">
              Know what&apos;s running in the city, this week.
            </h2>
            <p className="mb-4 font-mono text-xs leading-relaxed text-ink/70">
              Real scams, harassment hotspots, dodgy stays — pinned to a map by
              the women who got hit.
            </p>
            <span className="inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-widest text-rust">
              Open the Beware Board{" "}
              <ChevronRight
                className="h-3 w-3 transition-transform group-hover:translate-x-0.5"
                aria-hidden
              />
            </span>
          </Link>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          2 — VERIFY A STAY (paste-URL block)
          ════════════════════════════════════════════════════════ */}
      <section className="mx-auto max-w-6xl px-5 py-12 md:px-8 md:py-16">
        <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.25em] text-blue">
          Verify a stay
        </p>
        <h2 className="mb-4 font-serif text-3xl leading-[1.05] text-ink md:text-5xl">
          Paste any Airbnb, Booking, or hotel link.
        </h2>
        <p className="mb-7 max-w-3xl font-mono text-sm leading-relaxed text-ww-muted">
          We score it on women-specific safety: door locks, host record,
          neighborhood walk-home rating, and any past scam reports for the area.
          Members-only while we tune the model — sign-in takes one OTP.
        </p>

        <div className="rounded-2xl border border-ww-border bg-warm-white p-2 shadow-[0_1px_0_rgba(26,21,16,0.04)]">
          <div className="flex items-center gap-2 rounded-xl bg-sand/60 px-3 py-2">
            <Clipboard className="h-4 w-4 text-ww-muted" aria-hidden />
            <span className="flex-1 truncate font-mono text-xs text-ww-muted md:text-sm">
              Paste a listing URL — airbnb.com/rooms/…
            </span>
            <button
              type="button"
              className="rounded-full px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest text-ww-muted hover:bg-ww-border/50"
            >
              Paste
            </button>
            <Link
              href="/verify-stay"
              className="rounded-full bg-ink px-4 py-2 font-mono text-[10px] uppercase tracking-widest text-warm-white transition-colors hover:bg-ink/90 md:px-5 md:py-2.5 md:text-xs"
            >
              Verify stay
            </Link>
          </div>
        </div>
        <p className="mt-3 font-mono text-[11px] text-ww-muted">
          Cross-checks against the Beware Board, contributor reports, and known
          unsafe-host flags.
        </p>
      </section>

      {/* ════════════════════════════════════════════════════════
          3 — BEWARE BOARD
          ════════════════════════════════════════════════════════ */}
      <section className="mx-auto max-w-6xl px-5 py-12 md:px-8 md:py-16">
        <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.25em] text-blue">
              Beware Board
            </p>
            <h2 className="mb-3 font-serif text-3xl leading-[1.05] text-ink md:text-5xl">
              Real scams, mapped by{" "}
              <span className="font-medium italic text-gold">
                women who got hit
              </span>
              .
            </h2>
            <p className="max-w-2xl font-mono text-sm leading-relaxed text-ww-muted">
              11 cities and growing. Verified contributor reports, sorted by
              recency. No anonymous trolls.
            </p>
          </div>
          <Link
            href="/community?tab=beware"
            className="inline-flex shrink-0 items-center gap-2 self-start rounded-full border border-ink/20 bg-warm-white px-4 py-2 font-mono text-[11px] uppercase tracking-widest text-ink transition-colors hover:bg-sand md:self-end"
          >
            + Report something
          </Link>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          {/* Faux map */}
          <div className="relative h-[320px] overflow-hidden rounded-3xl border border-ww-border bg-warm-white md:h-[380px]">
            <div
              className="absolute inset-0 opacity-50"
              style={{
                backgroundImage:
                  "linear-gradient(to right, rgba(138,125,114,0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(138,125,114,0.08) 1px, transparent 1px)",
                backgroundSize: "32px 32px",
              }}
              aria-hidden
            />
            <div
              className="absolute inset-0"
              aria-hidden
              style={{
                backgroundImage:
                  "linear-gradient(115deg, transparent 38%, rgba(138,125,114,0.18) 38%, rgba(138,125,114,0.18) 41%, transparent 41%), linear-gradient(195deg, transparent 55%, rgba(138,125,114,0.16) 55%, rgba(138,125,114,0.16) 59%, transparent 59%)",
              }}
            />
            <span
              className="absolute left-[36%] top-[44%] h-3 w-3 rounded-full bg-rust shadow-[0_0_0_4px_rgba(196,82,42,0.18)]"
              aria-label="High severity report"
            />
            <span
              className="absolute left-[58%] top-[32%] h-3 w-3 rounded-full bg-gold shadow-[0_0_0_4px_rgba(181,134,10,0.18)]"
              aria-label="Medium severity report"
            />
            <span
              className="absolute left-[68%] top-[64%] h-3 w-3 rounded-full bg-gold shadow-[0_0_0_4px_rgba(181,134,10,0.18)]"
              aria-label="Medium severity report"
            />
            <span
              className="absolute left-[28%] top-[68%] h-3 w-3 rounded-full bg-sage shadow-[0_0_0_4px_rgba(74,124,89,0.18)]"
              aria-label="Low severity report"
            />

            <div className="absolute bottom-3 left-3 flex items-center gap-2">
              <span className="rounded-full border border-ww-border bg-warm-white px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-ink shadow-sm">
                Lisbon · last 30 days
              </span>
            </div>
            <div className="absolute bottom-3 right-3">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-ink px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-warm-white">
                <span className="h-1.5 w-1.5 rounded-full bg-sage" />
                Verified reports
              </span>
            </div>
          </div>

          {/* Reports list (no proximity) */}
          <ul className="flex flex-col gap-3">
            {[
              {
                level: "HIGH",
                tone: "rust",
                title: "Card-skimming taxis at Praça do Comércio",
                meta: "27 min ago · Verified by 4 travelers",
              },
              {
                level: "MED",
                tone: "gold",
                title: "Aggressive bracelet sellers near Tram 28 stop",
                meta: "2 h ago · Verified by 11 travelers",
              },
              {
                level: "LOW",
                tone: "sage",
                title: "Pickpocketing reported on Tram 15E",
                meta: "Yesterday · Verified by 6 travelers",
              },
            ].map((r) => (
              <li
                key={r.title}
                className="group flex cursor-pointer items-center gap-4 rounded-2xl border border-ww-border bg-warm-white p-4 transition-colors hover:border-ink/30"
              >
                <span
                  className={
                    r.tone === "rust"
                      ? "rounded-full bg-rust-light px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-widest text-rust"
                      : r.tone === "gold"
                      ? "rounded-full bg-gold-light px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-widest text-gold"
                      : "rounded-full bg-sage-light px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-widest text-sage"
                  }
                >
                  {r.level}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-serif text-base leading-snug text-ink md:text-lg">
                    {r.title}
                  </p>
                  <p className="mt-1 truncate font-mono text-[11px] text-ww-muted">
                    <MapPin className="mr-1 inline h-3 w-3" aria-hidden />
                    {r.meta}
                  </p>
                </div>
                <ChevronRight
                  className="h-4 w-4 shrink-0 text-ww-muted group-hover:text-ink"
                  aria-hidden
                />
              </li>
            ))}
          </ul>
        </div>

        {/* Trip Buddy (replaces Buddy Check-in — uses real /buddy feature) */}
        <div className="mt-6 rounded-3xl bg-ink p-5 text-warm-white md:p-7">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex -space-x-2">
                {[
                  { initial: "S", bg: "bg-rust" },
                  { initial: "M", bg: "bg-blue" },
                  { initial: "Y", bg: "bg-sage" },
                ].map((a) => (
                  <span
                    key={a.initial}
                    className={`flex h-9 w-9 items-center justify-center rounded-full ${a.bg} font-mono text-xs font-semibold text-warm-white ring-2 ring-ink`}
                  >
                    {a.initial}
                  </span>
                ))}
              </div>
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-warm-white/60">
                  Trip Buddy
                </p>
                <p className="mt-1 font-serif text-lg leading-snug text-warm-white md:text-xl">
                  Going somewhere? You won&apos;t be the only one.
                </p>
                <p className="mt-1 font-mono text-[11px] leading-relaxed text-warm-white/70 md:max-w-md">
                  Register your trip dates. We match you anonymously with other
                  solo women heading the same way.
                </p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Link
                href="/buddy"
                className="inline-flex items-center gap-2 rounded-full bg-warm-white px-4 py-2 font-mono text-[11px] uppercase tracking-widest text-ink transition-colors hover:bg-warm-white/90"
              >
                <Users className="h-3.5 w-3.5" aria-hidden />
                See matches
              </Link>
              <Link
                href="/buddy"
                className="inline-flex items-center gap-2 rounded-full border border-warm-white/30 bg-transparent px-4 py-2 font-mono text-[11px] uppercase tracking-widest text-warm-white transition-colors hover:bg-warm-white/10"
              >
                Register a trip
              </Link>
              <Link
                href="/buddy"
                className="font-mono text-[11px] uppercase tracking-widest text-warm-white/70 underline-offset-4 hover:text-warm-white hover:underline"
              >
                How matching works
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          4 — SAFETY PACK (was: WhatsApp Vault)
          ════════════════════════════════════════════════════════ */}
      <SafetyPackBlock />

      {/* ── Foot ─────────────────────────────────────────────── */}
      <div className="border-t border-gold/30 bg-gold-light/60">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-5 py-3 md:px-8">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-gold">
            End of preview · approve to apply to live pages
          </p>
          <Link
            href="/safety"
            className="font-mono text-[10px] uppercase tracking-widest text-gold underline-offset-4 hover:underline"
          >
            ← live /safety
          </Link>
        </div>
      </div>
    </div>
  );
}

