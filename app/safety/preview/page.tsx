import Link from "next/link";
import {
  Phone,
  Radio,
  MapPin,
  AlertTriangle,
  ShieldCheck,
  ChevronRight,
  Clipboard,
  CheckCircle2,
  Share2,
  Users,
  MessageCircle,
  Sparkles,
} from "lucide-react";

export const metadata = {
  title: "Safety redesign preview — Wander Women",
  description:
    "Internal preview of the /safety visual refresh. Not linked from nav.",
  robots: { index: false, follow: false },
};

/* ------------------------------------------------------------------
   /safety/preview — round 2 of the visual redesign.
   Hi-fi mockup matching the reference vibe: live red status bar,
   color-coded cockpit cards, dark buddy check-in, QR vault, stats
   footer. Pure visual — no Supabase calls, no server actions, no
   real telemetry. Numbers and locations are sample data for the
   demo. Live pages are untouched.
------------------------------------------------------------------ */

export default function SafetyPreviewPage() {
  return (
    <div className="bg-sand">
      {/* ── Live status bar ──────────────────────────────────── */}
      <div className="bg-[#b9221a] text-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3 md:px-8">
          <div className="flex items-center gap-2 font-mono text-[11px] tracking-wide md:text-xs">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-70" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
            </span>
            <Radio className="h-3.5 w-3.5 opacity-80" aria-hidden />
            <span className="hidden sm:inline">
              Live in <strong className="font-semibold">Lisbon, PT</strong> ·
              Buddy <strong className="font-semibold">Sarah</strong> can see you
            </span>
            <span className="sm:hidden">
              Live · <strong className="font-semibold">Lisbon</strong> · Sarah
              watching
            </span>
          </div>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/10 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-white transition-colors hover:bg-white/20 md:text-[11px]"
          >
            <Phone className="h-3.5 w-3.5" aria-hidden />
            Hold for SOS
          </button>
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
            Preview · safety redesign — sample data, not linked from nav
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
          1 — SAFETY COCKPIT
          ════════════════════════════════════════════════════════ */}
      <section className="mx-auto max-w-6xl px-5 pb-10 pt-12 md:px-8 md:pt-16">
        <p className="mb-5 font-mono text-[11px] uppercase tracking-[0.25em] text-blue">
          Safety Cockpit
        </p>
        <h1 className="mb-5 font-serif text-[2.5rem] leading-[1.02] tracking-tight text-ink md:text-6xl lg:text-[4.5rem]">
          You&apos;re safer when{" "}
          <span className="font-serif font-medium italic text-gold">
            someone else
          </span>{" "}
          is paying attention too.
        </h1>
        <p className="max-w-2xl font-mono text-sm leading-relaxed text-ww-muted md:text-base">
          Live picture of where you are, where you&apos;re sleeping next, and
          what other women are reporting around you — right now.
        </p>

        {/* Cockpit cards */}
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {/* Right Now */}
          <article className="rounded-3xl border border-sage/30 bg-sage-light/60 p-6 shadow-[0_1px_0_rgba(74,124,89,0.08)]">
            <div className="mb-4 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-sage">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sage/50" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-sage" />
              </span>
              <MapPin className="h-3.5 w-3.5" aria-hidden />
              Right now
            </div>
            <h2 className="mb-3 font-serif text-2xl leading-tight text-ink md:text-[1.75rem]">
              Lisbon, Bairro Alto
            </h2>
            <p className="font-mono text-xs leading-relaxed text-ink/70">
              Rated <strong className="font-semibold">7.8 / 10</strong> for solo
              women tonight · last updated 3 min ago
            </p>
          </article>

          {/* Heads Up */}
          <article className="rounded-3xl border border-gold/30 bg-gold-light/70 p-6 shadow-[0_1px_0_rgba(181,134,10,0.08)]">
            <div className="mb-4 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-gold">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold/50" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-gold" />
              </span>
              <AlertTriangle className="h-3.5 w-3.5" aria-hidden />
              Heads up
            </div>
            <h2 className="mb-3 font-serif text-2xl leading-tight text-ink md:text-[1.75rem]">
              2 active scam reports within 1 km
            </h2>
            <p className="mb-4 font-mono text-xs leading-relaxed text-ink/70">
              Card-skimming taxis · aggressive sellers
            </p>
            <button
              type="button"
              className="inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-widest text-ink hover:text-gold"
            >
              See on map <ChevronRight className="h-3 w-3" aria-hidden />
            </button>
          </article>

          {/* Next Stay */}
          <article className="rounded-3xl border border-rust/30 bg-rust-light/70 p-6 shadow-[0_1px_0_rgba(196,82,42,0.08)]">
            <div className="mb-4 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-rust">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rust/50" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-rust" />
              </span>
              <ShieldCheck className="h-3.5 w-3.5" aria-hidden />
              Next stay
            </div>
            <h2 className="mb-3 font-serif text-2xl leading-tight text-ink md:text-[1.75rem]">
              Alfama apt · May 12
            </h2>
            <p className="mb-4 font-mono text-xs leading-relaxed text-ink/70">
              Not yet verified by Wander Women
            </p>
            <button
              type="button"
              className="inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-widest text-ink hover:text-rust"
            >
              Verify now <ChevronRight className="h-3 w-3" aria-hidden />
            </button>
          </article>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          2 — VERIFY A STAY
          ════════════════════════════════════════════════════════ */}
      <section className="mx-auto max-w-6xl px-5 py-12 md:px-8 md:py-16">
        <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.25em] text-blue">
          Verify a stay
        </p>
        <h2 className="mb-4 font-serif text-3xl leading-[1.05] text-ink md:text-5xl">
          Paste any Airbnb, Booking, or hotel link.
        </h2>
        <p className="mb-7 max-w-3xl font-mono text-sm leading-relaxed text-ww-muted">
          We score it on women-specific safety: door locks, neighborhood
          walk-home rating, host record, and any past reports from women who
          stayed there. Free. No sign-in.
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
            <button
              type="button"
              className="rounded-full bg-ink px-4 py-2 font-mono text-[10px] uppercase tracking-widest text-warm-white transition-colors hover:bg-ink/90 md:px-5 md:py-2.5 md:text-xs"
            >
              Verify stay
            </button>
          </div>
        </div>
        <p className="mt-3 font-mono text-[11px] text-ww-muted">
          Verified <strong className="font-semibold">11,420 stays</strong> this
          month · avg check time 14 sec
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
              What women are reporting{" "}
              <span className="font-medium italic text-gold">near you</span>,
              right now.
            </h2>
            <p className="max-w-2xl font-mono text-sm leading-relaxed text-ww-muted">
              Crowd-sourced, moderator-verified within 30 minutes. No anonymous
              trolls.
            </p>
          </div>
          <button
            type="button"
            className="inline-flex shrink-0 items-center gap-2 self-start rounded-full border border-ink/20 bg-warm-white px-4 py-2 font-mono text-[11px] uppercase tracking-widest text-ink transition-colors hover:bg-sand md:self-end"
          >
            + Report something
          </button>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          {/* Map placeholder */}
          <div className="relative h-[320px] overflow-hidden rounded-3xl border border-ww-border bg-warm-white md:h-[380px]">
            {/* faux map grid */}
            <div
              className="absolute inset-0 opacity-50"
              style={{
                backgroundImage:
                  "linear-gradient(to right, rgba(138,125,114,0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(138,125,114,0.08) 1px, transparent 1px)",
                backgroundSize: "32px 32px",
              }}
              aria-hidden
            />
            {/* faux roads */}
            <div
              className="absolute inset-0"
              aria-hidden
              style={{
                backgroundImage:
                  "linear-gradient(115deg, transparent 38%, rgba(138,125,114,0.18) 38%, rgba(138,125,114,0.18) 41%, transparent 41%), linear-gradient(195deg, transparent 55%, rgba(138,125,114,0.16) 55%, rgba(138,125,114,0.16) 59%, transparent 59%)",
              }}
            />
            {/* You pin (sage) */}
            <div className="absolute left-[28%] top-[42%] flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sage/60" />
                <span className="relative inline-flex h-3 w-3 rounded-full bg-sage shadow-[0_0_0_4px_rgba(74,124,89,0.18)]" />
              </span>
              <span className="rounded-full border border-ww-border bg-warm-white px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-ink shadow-sm">
                You
              </span>
            </div>
            {/* High pin */}
            <span
              className="absolute left-[55%] top-[58%] h-3 w-3 rounded-full bg-rust shadow-[0_0_0_4px_rgba(196,82,42,0.18)]"
              aria-label="High severity report"
            />
            {/* Med pins */}
            <span
              className="absolute left-[64%] top-[35%] h-3 w-3 rounded-full bg-gold shadow-[0_0_0_4px_rgba(181,134,10,0.18)]"
              aria-label="Medium severity report"
            />
            <span
              className="absolute left-[72%] top-[68%] h-3 w-3 rounded-full bg-gold shadow-[0_0_0_4px_rgba(181,134,10,0.18)]"
              aria-label="Medium severity report"
            />

            {/* Footer pills */}
            <div className="absolute bottom-3 left-3 flex items-center gap-2">
              <span className="rounded-full border border-ww-border bg-warm-white px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-ink shadow-sm">
                Lisbon · 1 km radius
              </span>
            </div>
            <div className="absolute bottom-3 right-3">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-ink px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-warm-white">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-sage" />
                Live
              </span>
            </div>
          </div>

          {/* Reports list */}
          <ul className="flex flex-col gap-3">
            {[
              {
                level: "HIGH",
                tone: "rust",
                title: "Card-skimming taxis at Praça do Comércio",
                meta: "0.4 km · 27 min ago · Verified by 4 travelers",
              },
              {
                level: "MED",
                tone: "gold",
                title: "Aggressive bracelet sellers near Tram 28 stop",
                meta: "1.1 km · 2 h ago · Verified by 11 travelers",
              },
              {
                level: "LOW",
                tone: "sage",
                title: "Pickpocketing reported on Tram 15E",
                meta: "2.3 km · Yesterday · Verified by 6 travelers",
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

        {/* Buddy check-in */}
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
                  Buddy check-in
                </p>
                <p className="mt-1 font-serif text-lg leading-snug text-warm-white md:text-xl">
                  Last ping <strong className="font-medium">4h ago</strong> with
                  Sarah · next due{" "}
                  <strong className="font-medium">8:00 PM Lisbon</strong>
                </p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-full bg-warm-white px-4 py-2 font-mono text-[11px] uppercase tracking-widest text-ink transition-colors hover:bg-warm-white/90"
              >
                <CheckCircle2 className="h-3.5 w-3.5" aria-hidden />
                I&apos;m safe
              </button>
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-full bg-[#b9221a] px-4 py-2 font-mono text-[11px] uppercase tracking-widest text-warm-white transition-colors hover:bg-[#a01b14]"
              >
                Need help
              </button>
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-full px-3 py-2 font-mono text-[11px] uppercase tracking-widest text-warm-white/80 hover:text-warm-white"
              >
                <Share2 className="h-3.5 w-3.5" aria-hidden />
                Share location
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          4 — FOR YOUR TRIP (Shop)
          ════════════════════════════════════════════════════════ */}
      <section className="mx-auto max-w-6xl px-5 py-12 md:px-8 md:py-16">
        <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.25em] text-blue">
          For your trip
        </p>
        <h2 className="mb-4 font-serif text-3xl leading-[1.05] text-ink md:text-5xl">
          3 things actually worth packing for{" "}
          <span className="font-medium italic text-gold">Lisbon</span>.
        </h2>
        <p className="mb-8 max-w-3xl font-mono text-sm leading-relaxed text-ww-muted">
          Personalized to your itinerary, season, and recent reports nearby. We
          don&apos;t sell what we wouldn&apos;t pack.
        </p>

        <div className="grid gap-4 md:grid-cols-3">
          {[
            {
              name: "Doorstop alarm",
              why: "3 of your next 4 stays don't have deadbolts",
              price: "€18",
              tint: "from-blue-light/80 to-blue-light/30",
            },
            {
              name: "RFID crossbody",
              why: "Card-skimming reports up 38% in Lisbon this week",
              price: "€42",
              tint: "from-rust-light/80 to-rust-light/20",
            },
            {
              name: "Personal alarm — 130dB",
              why: "Solo + late arrivals on your itinerary",
              price: "€24",
              tint: "from-purple-light/80 to-purple-light/20",
            },
          ].map((p) => (
            <article
              key={p.name}
              className="group flex flex-col overflow-hidden rounded-3xl border border-ww-border bg-warm-white transition-shadow hover:shadow-[0_8px_24px_-12px_rgba(26,21,16,0.18)]"
            >
              <div
                className={`h-44 bg-gradient-to-br ${p.tint} md:h-52`}
                aria-hidden
              />
              <div className="flex flex-1 flex-col p-5">
                <h3 className="mb-2 font-serif text-xl leading-tight text-ink md:text-2xl">
                  {p.name}
                </h3>
                <p className="mb-5 flex-1 font-mono text-xs leading-relaxed text-ww-muted">
                  {p.why}
                </p>
                <div className="flex items-center justify-between">
                  <span className="font-serif text-xl text-ink md:text-2xl">
                    {p.price}
                  </span>
                  <button
                    type="button"
                    className="rounded-full border border-ink/20 bg-sand px-4 py-1.5 font-mono text-[11px] uppercase tracking-widest text-ink transition-colors hover:border-ink/40 hover:bg-sand/70"
                  >
                    Add
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          5 — WHATSAPP VAULT
          ════════════════════════════════════════════════════════ */}
      <section className="mx-auto max-w-6xl px-5 py-12 md:px-8 md:py-16">
        <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.25em] text-blue">
          WhatsApp Vault
        </p>
        <h2 className="mb-4 font-serif text-3xl leading-[1.05] text-ink md:text-5xl">
          Your passport, insurance, and emergency contacts —{" "}
          <span className="font-medium italic text-gold">one text away</span>.
        </h2>
        <p className="mb-8 max-w-3xl font-mono text-sm leading-relaxed text-ww-muted">
          Forward any document to the Vault number. Get it back in seconds, even
          with no signal on your end and a stranger&apos;s phone in your hand.
        </p>

        <div className="rounded-3xl border border-ww-border bg-warm-white p-6 md:p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex-1">
              <div className="mb-3 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-sage">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sage/50" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-sage" />
                </span>
                <MessageCircle className="h-3.5 w-3.5" aria-hidden />
                Vault active · 4 docs stored
              </div>
              <p className="mb-5 font-serif text-xl leading-snug text-ink md:text-2xl">
                Text{" "}
                <span className="rounded-md bg-sand px-2 py-0.5 font-mono text-base text-ink">
                  VAULT
                </span>{" "}
                to{" "}
                <span className="rounded-md bg-sand px-2 py-0.5 font-mono text-base text-ink">
                  +44 7700 900 123
                </span>
              </p>
              <div className="flex flex-wrap gap-2">
                {[
                  "Passport",
                  "Travel insurance",
                  "Vaccine card",
                  "Emergency contacts",
                ].map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-ww-border bg-sand px-3 py-1 font-mono text-[11px] text-ink"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* QR placeholder */}
            <div className="shrink-0 self-center">
              <div className="relative h-32 w-32 rounded-2xl bg-ink p-3 md:h-36 md:w-36">
                <div
                  className="grid h-full w-full grid-cols-7 grid-rows-7 gap-[2px]"
                  aria-hidden
                >
                  {QR_PATTERN.map((on, i) => (
                    <span
                      key={i}
                      className={on ? "bg-warm-white" : "bg-transparent"}
                    />
                  ))}
                </div>
              </div>
              <p className="mt-2 text-center font-mono text-[10px] uppercase tracking-widest text-ww-muted">
                Scan to start
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          6 — HOW WE KNOW
          ════════════════════════════════════════════════════════ */}
      <section className="mx-auto max-w-6xl px-5 pb-16 md:px-8 md:pb-24">
        <div className="rounded-3xl border border-ww-border bg-warm-white p-6 md:p-10">
          <p className="mb-3 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.25em] text-blue">
            <Sparkles className="h-3.5 w-3.5" aria-hidden />
            How we know
          </p>
          <h2 className="mb-8 max-w-3xl font-serif text-2xl leading-[1.1] text-ink md:text-4xl">
            Every number on this page is verified by a real person within 30
            minutes.
          </h2>

          <div className="grid grid-cols-2 gap-6 md:grid-cols-4 md:gap-10">
            {[
              { stat: "184k", label: "women contributing reports" },
              { stat: "< 30 min", label: "moderator response time" },
              { stat: "11,420", label: "stays verified this month" },
              { stat: "24 / 7", label: "human SOS dispatcher" },
            ].map((s) => (
              <div key={s.label}>
                <p className="font-serif text-3xl leading-none text-ink md:text-5xl">
                  {s.stat}
                </p>
                <p className="mt-2 font-mono text-[11px] leading-relaxed text-ww-muted">
                  {s.label}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-ww-border/60 pt-5 font-mono text-[11px] text-ww-muted">
            <span className="inline-flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5" aria-hidden />
              Moderated by a team of 38 women across 14 timezones
            </span>
            <span className="inline-flex items-center gap-1.5">
              <MessageCircle className="h-3.5 w-3.5" aria-hidden />
              reachable on WhatsApp, Signal, SMS
            </span>
          </div>
        </div>
      </section>

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

/* 7×7 QR placeholder — purely decorative, not a real code. */
const QR_PATTERN: boolean[] = [
  // row 1
  true, true, true, false, true, false, true,
  // row 2
  true, false, true, true, false, true, true,
  // row 3
  true, true, false, true, true, false, true,
  // row 4
  false, true, true, false, true, true, false,
  // row 5
  true, false, true, true, false, true, true,
  // row 6
  true, true, false, true, true, false, true,
  // row 7
  true, false, true, false, true, true, true,
];
