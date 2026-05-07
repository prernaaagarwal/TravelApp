import Link from "next/link";
import { ShieldCheck, ShoppingBag, MessageCircle, MapPin, BadgeCheck } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Solo Female Travel Safety Toolkit — Kit, Vault, Scam Map",
  description:
    "Solo female travel safety toolkit: curated 15-product kit, WhatsApp trip vault, live scam map, stay verification — built by women who travel solo.",
};

type Tone = "rust" | "blue" | "gold" | "sage";

type HubCard = {
  href: string;
  eyebrow: string;
  title: string;
  body: string;
  cta: string;
  icon: typeof ShieldCheck;
  tone: Tone;
  authState?: "in" | "out";
};

const TONE: Record<
  Tone,
  { dot: string; icon: string; surface: string; hoverBorder: string; cta: string; border: string }
> = {
  rust: {
    dot: "bg-rust",
    icon: "text-rust",
    surface: "bg-rust-light/40",
    border: "border-rust/30",
    hoverBorder: "hover:border-rust/60",
    cta: "text-rust",
  },
  blue: {
    dot: "bg-blue",
    icon: "text-blue",
    surface: "bg-blue-light/40",
    border: "border-blue/30",
    hoverBorder: "hover:border-blue/60",
    cta: "text-blue",
  },
  gold: {
    dot: "bg-gold",
    icon: "text-gold",
    surface: "bg-gold-light/60",
    border: "border-gold/30",
    hoverBorder: "hover:border-gold/60",
    cta: "text-gold",
  },
  sage: {
    dot: "bg-sage",
    icon: "text-sage",
    surface: "bg-sage-light/40",
    border: "border-sage/30",
    hoverBorder: "hover:border-sage/60",
    cta: "text-sage",
  },
};

const PUBLIC_CARDS: HubCard[] = [
  {
    href: "/shop",
    eyebrow: "Safety Shop",
    title: "The 15-product safety kit.",
    body: "Door wedges, RFID wallets, personal alarms, eSIMs — every item our contributors actually carry. Affiliate-backed, you pay nothing extra.",
    cta: "Browse the kit",
    icon: ShoppingBag,
    tone: "rust",
  },
  {
    href: "/vault",
    eyebrow: "WhatsApp Vault",
    title: "Your trip docs by WhatsApp.",
    body: "Bookings, insurance, emergency numbers, passport scans — on demand by WhatsApp message. No app to download, no login, works on a borrowed phone if yours dies.",
    cta: "See how the Vault works",
    icon: MessageCircle,
    tone: "blue",
  },
  {
    href: "/community?tab=beware",
    eyebrow: "Beware Board",
    title: "Real scams, mapped by women who got hit.",
    body: "Verified reports of scams, harassment hotspots, and dodgy stays — pinned to a city map so you spot the pattern before you book the cab.",
    cta: "Open the Beware Board",
    icon: MapPin,
    tone: "gold",
  },
];

const AUTH_CARD: HubCard = {
  href: "/verify-stay",
  eyebrow: "Verify Stay",
  title: "Check before you book.",
  body: "Paste a stay listing — we cross-check it against the Beware Board, contributor reports, and known unsafe-host flags before you transfer money.",
  cta: "Verify a stay",
  icon: BadgeCheck,
  tone: "sage",
  authState: "in",
};

const SIGN_IN_CARD: HubCard = {
  href: "/account/login?next=/verify-stay",
  eyebrow: "Verify Stay",
  title: "Members-only: check before you book.",
  body: "Sign in to paste a stay listing — we cross-check it against the Beware Board, contributor reports, and known unsafe-host flags.",
  cta: "Sign in to verify",
  icon: BadgeCheck,
  tone: "sage",
  authState: "out",
};

export default async function SafetyPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const cards: HubCard[] = [
    ...PUBLIC_CARDS,
    user ? AUTH_CARD : SIGN_IN_CARD,
  ];

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      {/* ── Hero ─────────────────────────────────────────── */}
      <div className="mb-10">
        <p className="mb-4 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.25em] text-rust">
          <span className="h-2 w-2 rounded-full bg-rust" aria-hidden />
          <ShieldCheck className="h-3.5 w-3.5" aria-hidden />
          Solo female travel safety toolkit
        </p>
        <h1 className="mb-4 font-serif text-4xl leading-[1.02] tracking-tight text-ink md:text-6xl">
          Four tools,{" "}
          <span className="font-serif font-medium italic text-gold">
            one place
          </span>{" "}
          you&apos;ll actually find them.
        </h1>
        <p className="max-w-xl font-mono text-sm leading-relaxed text-ww-muted">
          The kit you pack. The vault on your phone. The map of what to dodge.
          The check before you book. Everything safety-related lives here so
          you don&apos;t have to hunt for it mid-trip.
        </p>
      </div>

      {/* ── Hub cards ────────────────────────────────────── */}
      <div className="grid gap-4 sm:grid-cols-2">
        {cards.map((card) => {
          const Icon = card.icon;
          const tone = TONE[card.tone];
          return (
            <Link
              key={card.eyebrow}
              href={card.href}
              className={`group flex flex-col rounded-2xl border ${tone.border} ${tone.surface} p-6 transition-colors ${tone.hoverBorder}`}
            >
              <div className="mb-4 flex items-center gap-2">
                <span
                  className={`h-1.5 w-1.5 rounded-full ${tone.dot}`}
                  aria-hidden
                />
                <Icon className={`h-4 w-4 ${tone.icon}`} aria-hidden />
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-ww-muted">
                  {card.eyebrow}
                </span>
              </div>
              <h2 className="mb-3 font-serif text-2xl leading-snug text-ink">
                {card.title}
              </h2>
              <p className="mb-6 flex-1 font-mono text-xs leading-relaxed text-ink/70">
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

      {/* ── Footnote ─────────────────────────────────────── */}
      <p className="mt-10 border-t border-ww-border/60 pt-5 font-mono text-[10px] leading-relaxed text-ww-muted/80">
        Safety is the spine of Wander Women. If something here is missing or
        wrong, tell us via{" "}
        <Link href="/feedback" className="underline hover:text-ink">
          Feedback
        </Link>
        .
      </p>
    </div>
  );
}
