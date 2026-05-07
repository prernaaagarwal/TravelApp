import Link from "next/link";
import {
  ShieldCheck,
  ShoppingBag,
  MessageCircle,
  MapPin,
  BadgeCheck,
  Printer,
  Mail,
} from "lucide-react";

export const metadata = {
  title: "Safety redesign preview — Wander Women",
  description:
    "Internal preview of the /safety visual refresh. Not linked from nav.",
  robots: { index: false, follow: false },
};

type Tone = "rust" | "blue" | "gold" | "sage";

const TONE: Record<
  Tone,
  { dot: string; icon: string; surface: string; hoverBorder: string; cta: string }
> = {
  rust: {
    dot: "bg-rust",
    icon: "text-rust",
    surface: "bg-rust-light/40",
    hoverBorder: "hover:border-rust",
    cta: "text-rust",
  },
  blue: {
    dot: "bg-blue",
    icon: "text-blue",
    surface: "bg-blue-light/40",
    hoverBorder: "hover:border-blue",
    cta: "text-blue",
  },
  gold: {
    dot: "bg-gold",
    icon: "text-gold",
    surface: "bg-gold-light/60",
    hoverBorder: "hover:border-gold",
    cta: "text-gold",
  },
  sage: {
    dot: "bg-sage",
    icon: "text-sage",
    surface: "bg-sage-light/40",
    hoverBorder: "hover:border-sage",
    cta: "text-sage",
  },
};

type HubCard = {
  href: string;
  eyebrow: string;
  title: React.ReactNode;
  body: string;
  cta: string;
  icon: typeof ShieldCheck;
  tone: Tone;
};

const HUB_CARDS: HubCard[] = [
  {
    href: "/shop",
    eyebrow: "Safety Shop",
    title: (
      <>
        The <em className="font-serif italic text-gold">15-product</em> safety
        kit.
      </>
    ),
    body: "Door wedges, RFID wallets, personal alarms, eSIMs — every item our contributors actually carry. Affiliate-backed, you pay nothing extra.",
    cta: "Browse the kit",
    icon: ShoppingBag,
    tone: "rust",
  },
  {
    href: "/vault",
    eyebrow: "WhatsApp Vault",
    title: (
      <>
        Your trip docs,{" "}
        <em className="font-serif italic text-gold">on demand</em>.
      </>
    ),
    body: "Bookings, insurance, emergency numbers, passport scans — on demand by WhatsApp message. No app to download, no login, works on a borrowed phone if yours dies.",
    cta: "See how the Vault works",
    icon: MessageCircle,
    tone: "blue",
  },
  {
    href: "/community?tab=beware",
    eyebrow: "Beware Board",
    title: (
      <>
        Real scams, mapped by{" "}
        <em className="font-serif italic text-gold">women who got hit</em>.
      </>
    ),
    body: "Verified reports of scams, harassment hotspots, and dodgy stays — pinned to a city map so you spot the pattern before you book the cab.",
    cta: "Open the Beware Board",
    icon: MapPin,
    tone: "gold",
  },
  {
    href: "/verify-stay",
    eyebrow: "Verify Stay",
    title: (
      <>
        Check <em className="font-serif italic text-gold">before</em> you book.
      </>
    ),
    body: "Paste a stay listing — we cross-check it against the Beware Board, contributor reports, and known unsafe-host flags before you transfer money.",
    cta: "Verify a stay",
    icon: BadgeCheck,
    tone: "sage",
  },
];

function PreviewChip({ label }: { label: string }) {
  return (
    <div className="mx-auto mb-3 flex max-w-4xl items-center gap-2 px-6">
      <span className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold-light/60 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-gold">
        <span className="h-1.5 w-1.5 rounded-full bg-gold" />
        Preview · {label}
      </span>
    </div>
  );
}

function SectionDivider() {
  return (
    <div className="mx-auto my-16 max-w-4xl px-6">
      <div className="h-px bg-ww-border/60" />
    </div>
  );
}

export default function SafetyPreviewPage() {
  return (
    <div>
      {/* ── Top banner ──────────────────────────────────────── */}
      <div className="border-b border-gold/30 bg-gold-light/60">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-4 px-6 py-2.5">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-gold">
            <span className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-gold align-middle" />
            Preview — visual redesign · not linked from nav
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
          SECTION 1 — /safety hub redesign (full)
          ════════════════════════════════════════════════════════ */}
      <PreviewChip label="/safety  ·  hub" />

      {/* Hero band — full-bleed warm-white */}
      <section className="border-b border-ww-border/60 bg-warm-white">
        <div className="mx-auto max-w-4xl px-6 py-14 md:py-20">
          <p className="mb-3 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-ww-muted">
            <ShieldCheck className="h-3.5 w-3.5 text-rust" />
            Solo female travel safety toolkit
          </p>
          <h1 className="mb-4 font-serif text-4xl leading-[1.05] text-ink md:text-6xl">
            Four tools,{" "}
            <em className="font-serif italic text-gold">one place</em> you&apos;ll
            actually find them.
          </h1>
          <p className="max-w-2xl font-mono text-sm leading-relaxed text-ww-muted">
            The kit you pack. The vault on your phone. The map of what to dodge.
            The check before you book. Everything safety-related lives here so
            you don&apos;t have to hunt for it mid-trip.
          </p>
        </div>
      </section>

      {/* Hub cards — 2x2, color-coded */}
      <section className="bg-sand">
        <div className="mx-auto max-w-4xl px-6 py-12">
          <div className="grid gap-4 sm:grid-cols-2">
            {HUB_CARDS.map((card) => {
              const Icon = card.icon;
              const tone = TONE[card.tone];
              return (
                <Link
                  key={card.eyebrow}
                  href={card.href}
                  className={`group flex flex-col rounded-2xl border border-ww-border ${tone.surface} p-6 transition-colors ${tone.hoverBorder}`}
                >
                  <div className="mb-4 flex items-center gap-2">
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${tone.dot}`}
                      aria-hidden
                    />
                    <Icon className={`h-4 w-4 ${tone.icon}`} />
                    <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-ww-muted">
                      {card.eyebrow}
                    </span>
                  </div>
                  <h2 className="mb-3 font-serif text-2xl leading-snug text-ink">
                    {card.title}
                  </h2>
                  <p className="mb-6 flex-1 font-mono text-xs leading-relaxed text-ww-muted">
                    {card.body}
                  </p>
                  <span
                    className={`font-mono text-[10px] uppercase tracking-widest ${tone.cta} transition-transform group-hover:translate-x-1`}
                  >
                    {card.cta} →
                  </span>
                </Link>
              );
            })}
          </div>

          <p className="mt-10 border-t border-ww-border/60 pt-5 font-mono text-[10px] leading-relaxed text-ww-muted/80">
            Safety is the spine of Wander Women. If something here is missing or
            wrong, tell us via{" "}
            <Link href="/feedback" className="underline hover:text-ink">
              Feedback
            </Link>
            .
          </p>
        </div>
      </section>

      <SectionDivider />

      {/* ════════════════════════════════════════════════════════
          SECTION 2 — /vault hero
          ════════════════════════════════════════════════════════ */}
      <PreviewChip label="/vault  ·  hero" />
      <section className="border-y border-ww-border/60 bg-warm-white">
        <div className="mx-auto max-w-3xl px-6 py-14 md:py-20">
          <p className="mb-3 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-ww-muted">
            <span className="h-1.5 w-1.5 rounded-full bg-blue" aria-hidden />
            Safety Pack
          </p>
          <h1 className="mb-4 font-serif text-4xl leading-[1.05] text-ink md:text-6xl">
            <em className="font-serif italic text-gold">One page</em> a stranger
            could use to help you.
          </h1>
          <p className="max-w-2xl font-mono text-sm leading-relaxed text-ww-muted">
            Save your trip details, emergency contacts, stay info and insurance
            in one place. Download as PDF for offline use, or email a copy to
            someone who&apos;ll have your back if your phone dies.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-ww-border bg-warm-white px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest text-ww-muted">
              <ShieldCheck className="h-3 w-3 text-sage" />
              Free · no per-trip fee
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-ww-border bg-warm-white px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest text-ww-muted">
              <Printer className="h-3 w-3 text-rust" />
              Print or save as PDF
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-ww-border bg-warm-white px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest text-ww-muted">
              <Mail className="h-3 w-3 text-blue" />
              Email to a backup contact
            </span>
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* ════════════════════════════════════════════════════════
          SECTION 3 — /shop hero
          ════════════════════════════════════════════════════════ */}
      <PreviewChip label="/shop  ·  hero" />
      <section className="border-y border-ww-border/60 bg-warm-white">
        <div className="mx-auto max-w-4xl px-6 py-14 md:py-20">
          <p className="mb-3 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-ww-muted">
            <span className="h-1.5 w-1.5 rounded-full bg-rust" aria-hidden />
            Solo female travel safety kit · affiliate picks
          </p>
          <h1 className="mb-4 font-serif text-4xl leading-[1.05] text-ink md:text-6xl">
            <em className="font-serif italic text-gold">The kit</em> our
            contributors actually carry.
          </h1>
          <p className="mb-5 max-w-2xl font-mono text-sm leading-relaxed text-ww-muted">
            Door wedges. RFID wallets. Personal alarms. eSIMs. Every link is an
            Amazon affiliate — you pay nothing extra, we earn a small commission
            that funds more intel cards.
          </p>
          <p className="inline-block rounded-full border border-gold/40 bg-gold-light px-3 py-1.5 font-mono text-[10px] text-gold">
            ✦ Wander Women earns a small affiliate commission on qualifying
            purchases. Prices vary.
          </p>
        </div>
      </section>

      <SectionDivider />

      {/* ════════════════════════════════════════════════════════
          SECTION 4 — /verify-stay hero
          ════════════════════════════════════════════════════════ */}
      <PreviewChip label="/verify-stay  ·  hero" />
      <section className="border-y border-ww-border/60 bg-warm-white">
        <div className="mx-auto max-w-2xl px-6 py-14 md:py-20">
          <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-sage-light px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-sage">
            <span className="h-1.5 w-1.5 rounded-full bg-sage" aria-hidden />
            <ShieldCheck className="h-3 w-3" />
            AI Safety Check
          </span>
          <h1 className="mb-4 font-serif text-4xl leading-[1.05] text-ink md:text-6xl">
            Is this stay{" "}
            <em className="font-serif italic text-gold">safe?</em>
          </h1>
          <p className="font-mono text-sm leading-relaxed text-ww-muted">
            Paste any booking link — Airbnb, Booking.com, Agoda, MakeMyTrip, or
            others. We&apos;ll run a safety and scam analysis tuned for solo
            women travellers.
          </p>
        </div>
      </section>

      <SectionDivider />

      {/* ════════════════════════════════════════════════════════
          SECTION 5 — /community?tab=beware tab header
          ════════════════════════════════════════════════════════ */}
      <PreviewChip label="/community?tab=beware  ·  header" />
      <section className="border-y border-ww-border/60 bg-warm-white">
        <div className="mx-auto max-w-4xl px-6 py-14 md:py-20">
          <p className="mb-3 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-ww-muted">
            <span className="h-1.5 w-1.5 rounded-full bg-gold" aria-hidden />
            <MapPin className="h-3.5 w-3.5 text-gold" />
            Beware Board
          </p>
          <h1 className="mb-4 font-serif text-4xl leading-[1.05] text-ink md:text-6xl">
            What women are reporting{" "}
            <em className="font-serif italic text-gold">near you</em>.
          </h1>
          <p className="max-w-2xl font-mono text-sm leading-relaxed text-ww-muted">
            Crowd-sourced, moderator-verified. Pinned to a city map so you spot
            the pattern before you walk into it.
          </p>
        </div>
      </section>

      {/* ── Foot ────────────────────────────────────────────── */}
      <div className="border-t border-gold/30 bg-gold-light/60">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-4 px-6 py-3">
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
