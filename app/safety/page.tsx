import Link from "next/link";
import { ShieldCheck, ShoppingBag, MessageCircle, MapPin, BadgeCheck } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Safety — Wander Women",
  description:
    "The safety toolkit for solo women travellers: curated kit, WhatsApp trip vault, scam map, and stay verification.",
};

type HubCard = {
  href: string;
  eyebrow: string;
  title: string;
  body: string;
  cta: string;
  icon: typeof ShieldCheck;
  authState?: "in" | "out";
};

const PUBLIC_CARDS: HubCard[] = [
  {
    href: "/shop",
    eyebrow: "Safety Shop",
    title: "The 15-product safety kit.",
    body: "Door wedges, RFID wallets, personal alarms, eSIMs — every item our contributors actually carry. Affiliate-backed, you pay nothing extra.",
    cta: "Browse the kit",
    icon: ShoppingBag,
  },
  {
    href: "/vault",
    eyebrow: "WhatsApp Vault",
    title: "Your trip docs by WhatsApp.",
    body: "Bookings, insurance, emergency numbers, passport scans — on demand by WhatsApp message. No app to download, no login, works on a borrowed phone if yours dies.",
    cta: "See how the Vault works",
    icon: MessageCircle,
  },
  {
    href: "/community?tab=beware",
    eyebrow: "Beware Board",
    title: "Real scams, mapped by women who got hit.",
    body: "Verified reports of scams, harassment hotspots, and dodgy stays — pinned to a city map so you spot the pattern before you book the cab.",
    cta: "Open the Beware Board",
    icon: MapPin,
  },
];

const AUTH_CARD: HubCard = {
  href: "/verify-stay",
  eyebrow: "Verify Stay",
  title: "Check before you book.",
  body: "Paste a stay listing — we cross-check it against the Beware Board, contributor reports, and known unsafe-host flags before you transfer money.",
  cta: "Verify a stay",
  icon: BadgeCheck,
  authState: "in",
};

const SIGN_IN_CARD: HubCard = {
  href: "/account/login?next=/verify-stay",
  eyebrow: "Verify Stay",
  title: "Members-only: check before you book.",
  body: "Sign in to paste a stay listing — we cross-check it against the Beware Board, contributor reports, and known unsafe-host flags.",
  cta: "Sign in to verify",
  icon: BadgeCheck,
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
        <p className="mb-2 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-ww-muted">
          <ShieldCheck className="h-3.5 w-3.5" />
          Safety toolkit
        </p>
        <h1 className="mb-3 font-serif text-4xl leading-tight text-ink md:text-5xl">
          Four tools, one place.
        </h1>
        <p className="font-mono text-sm leading-relaxed text-ww-muted">
          The kit you pack. The vault on your phone. The map of what to dodge.
          The check before you book. Everything safety-related lives here so
          you don&apos;t have to hunt for it mid-trip.
        </p>
      </div>

      {/* ── Hub cards ────────────────────────────────────── */}
      <div className="grid gap-4 sm:grid-cols-2">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.eyebrow}
              href={card.href}
              className="group flex flex-col border border-ww-border bg-warm-white p-6 transition-colors hover:border-rust"
            >
              <div className="mb-4 flex items-center gap-2">
                <Icon className="h-4 w-4 text-rust" />
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
              <span className="font-mono text-[10px] uppercase tracking-widest text-rust transition-transform group-hover:translate-x-1">
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
