import Link from "next/link";
import { Check, X, Star, Lock } from "lucide-react";
import { JsonLd } from "@/components/shared/JsonLd";
import { env } from "@/lib/config";

const SITE_URL = env.NEXT_PUBLIC_SITE_URL;

export const metadata = {
  title: "Pricing — Wander Women Founding Membership",
  description:
    "Three tiers: Free, Founding Member ₹999/year (first 200 only), and Crew ₹1,999/year. Full intel, verified contributor access, and Vault — all in one bundle.",
  alternates: { canonical: "/pricing" },
};

// Lock these in copy. Do not A/B test on this page until 200 founding
// members are signed up. Pricing changes in this file ripple to:
// - llms.txt route
// - methodology page
// - any landing-page CTA copy
// Find them all with: grep -rn "999\|1999\|founding member" app components

const TIERS = [
  {
    name: "Free",
    price: "₹0",
    cadence: "forever",
    badge: null,
    description:
      "Read the briefings, see the Beware Board, get a feel for the network.",
    cta: "Start free",
    href: "/account/signup",
    highlight: false,
    features: [
      { included: true, text: "Read intel-card briefings (top section)" },
      { included: true, text: "Full Beware Board access" },
      { included: true, text: "Browse contributor profiles" },
      { included: true, text: "Community Q&A read-only" },
      { included: false, text: "Full intel: scams, transport, hidden gems" },
      { included: false, text: "Direct contributor messaging" },
      { included: false, text: "WhatsApp Vault for trip docs + emergencies" },
      { included: false, text: "Founding-200 status + voting" },
    ],
  },
  {
    name: "Founding Member",
    price: "₹999",
    cadence: "/year",
    badge: "First 200 only",
    description:
      "The full bundle, locked at ₹999 forever. Public price moves to ₹1,999 once 200 founding members are seated.",
    cta: "Become founding member",
    href: "/account/membership?plan=founding",
    highlight: true,
    features: [
      { included: true, text: "Everything in Free, plus:" },
      { included: true, text: "Full intel — every section unlocked" },
      { included: true, text: "Direct contributor messaging" },
      { included: true, text: "WhatsApp Vault — trip docs + emergency contacts" },
      { included: true, text: "Founding-200 badge on community posts" },
      { included: true, text: "Voting power on next cities we cover" },
      { included: true, text: "Price-locked at ₹999 — never goes up" },
      { included: true, text: "Early access to new intel cards" },
    ],
  },
  {
    name: "Crew",
    price: "₹1,999",
    cadence: "/year",
    badge: null,
    description:
      "For travelers who plan multiple trips a year and want unlimited contributor access.",
    cta: "Join Crew",
    href: "/account/membership?plan=crew",
    highlight: false,
    features: [
      { included: true, text: "Everything in Founding Member, plus:" },
      { included: true, text: "Unlimited contributor DMs" },
      { included: true, text: "Custom intel requests" },
      { included: true, text: "Premium safety pack PDFs" },
      { included: true, text: "Priority moderation queue for your reports" },
      { included: true, text: "Crew-only community channel" },
      { included: true, text: "Contributor video calls" },
    ],
  },
];

const FAQ_ITEMS = [
  {
    q: "What does ₹999 actually get me?",
    a: "Three things: full intel (the deeper sections free users don't see), direct messaging to contributors, and founding-200 status with voting power on which cities we cover next. Plus the WhatsApp Vault is bundled in — no separate purchase.",
  },
  {
    q: "Is the price actually locked?",
    a: "Yes. The first 200 founding members renew at ₹999 every year, indefinitely. Once we cross 200 founding members, the public price moves to ₹1,999. We will never raise founding-member pricing — that's the deal.",
  },
  {
    q: "What's the difference between Founding and Crew?",
    a: "Crew is for travelers who plan multiple trips a year. Unlimited contributor messaging, custom intel requests, and a Crew-only channel. Founding Member is enough for most users — Crew is the upgrade.",
  },
  {
    q: "Can I cancel?",
    a: "Yes. Cancel any time before your next renewal — your access continues until that date and we don't auto-charge again.",
  },
  {
    q: "Are payments secure?",
    a: "Payments aren't live yet — see the beta banner at the top of this page. When they are, we'll process through a PCI-DSS compliant provider and never store card details ourselves. Membership status is the only billing data we keep on our profiles table.",
  },
];

export default function PricingPage() {
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_ITEMS.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  const productLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "Wander Women Founding Membership",
    description:
      "Verified solo female travel intelligence — full Trip Intel Cards, contributor DMs, WhatsApp Vault, and founding-200 status.",
    brand: { "@type": "Brand", name: "Wander Women" },
    offers: TIERS.filter((t) => t.price !== "₹0").map((t) => ({
      "@type": "Offer",
      name: t.name,
      price: t.price.replace(/[^\d]/g, ""),
      priceCurrency: "INR",
      url: `${SITE_URL}${t.href}`,
      availability: "https://schema.org/InStock",
    })),
  };

  return (
    <main className="bg-warm-white">
      <JsonLd data={faqLd} />
      <JsonLd data={productLd} />

      {/* Hero */}
      <section className="border-b border-ww-border px-6 pt-20 pb-12 md:px-10 md:pt-28">
        <div className="mx-auto max-w-3xl text-center">
          {/* Honesty banner: prices are anchored, but no payment path is live
              yet. Investors and users both deserve to know that up-front. */}
          <div className="mx-auto mb-6 inline-block border border-rust/30 bg-rust/5 px-4 py-2">
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-rust">
              Beta · Payments not yet open · Reserve your founding seat — pay nothing now
            </p>
          </div>
          <p className="mb-4 font-mono text-xs uppercase tracking-[0.25em] text-ww-muted">
            Membership
          </p>
          <h1 className="mb-6 font-serif text-4xl leading-tight text-ink md:text-5xl">
            Three tiers. Full intel locked at ₹999 for the founding 200.
          </h1>
          <p className="mx-auto max-w-2xl font-serif text-lg italic text-ww-muted">
            One bundle, no add-ons. Vault, contributor access, founding status —
            all included in the membership. The third tier exists for power
            travelers who want unlimited access.
          </p>
        </div>
      </section>

      {/* Tiers */}
      <section className="px-6 py-16 md:px-10">
        <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-3">
          {TIERS.map((tier) => (
            <TierCard key={tier.name} tier={tier} />
          ))}
        </div>
        <p className="mx-auto mt-8 max-w-2xl text-center font-mono text-xs text-ww-muted">
          Prices shown in INR. International cards will be supported when
          payment processing goes live; payment provider TBD.
        </p>
      </section>

      {/* What's in every tier */}
      <section className="border-y border-ww-border bg-sand px-6 py-16 md:px-10">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-6 text-center font-serif text-3xl text-ink">
            What every tier includes
          </h2>
          <ul className="grid gap-3 md:grid-cols-2">
            {[
              "Verified, named contributors on every card",
              "Full Beware Board access",
              "Mobile-optimized — works at 2G",
              "Open Methodology — see how we verify",
            ].map((item) => (
              <li
                key={item}
                className="flex items-start gap-3 font-serif text-base text-ink"
              >
                <Check className="mt-0.5 h-5 w-5 shrink-0 text-sage" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* FAQs (also in JSON-LD above) */}
      <section className="px-6 py-16 md:px-10 md:py-24">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-10 text-center font-serif text-3xl text-ink">
            Frequently asked
          </h2>
          <dl className="space-y-8">
            {FAQ_ITEMS.map((item) => (
              <div
                key={item.q}
                className="border-b border-ww-border pb-6 last:border-0"
              >
                <dt className="mb-3 font-serif text-lg font-medium text-ink">
                  {item.q}
                </dt>
                <dd className="font-serif text-base leading-relaxed text-ww-muted">
                  {item.a}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Methodology link */}
      <section className="border-t border-ww-border bg-warm-white px-6 py-12 md:px-10">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-3 font-serif text-base text-ww-muted">
            Want to know how we verify every claim before you pay?
          </p>
          <Link
            href="/methodology"
            className="inline-block border-b border-ink font-mono text-sm uppercase tracking-wider text-ink hover:text-rust"
          >
            Read our Methodology →
          </Link>
        </div>
      </section>
    </main>
  );
}

function TierCard({ tier }: { tier: (typeof TIERS)[number] }) {
  const isHighlight = tier.highlight;
  return (
    <div
      className={`relative flex flex-col rounded border bg-warm-white p-8 ${
        isHighlight
          ? "border-rust shadow-lg ring-1 ring-rust/30"
          : "border-ww-border"
      }`}
    >
      {tier.badge && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-rust px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-warm-white">
          <Star className="mr-1 inline h-3 w-3" />
          {tier.badge}
        </span>
      )}
      <h3 className="mb-2 font-serif text-2xl text-ink">{tier.name}</h3>
      <div className="mb-3 flex items-baseline gap-1">
        <span className="font-serif text-4xl text-ink">{tier.price}</span>
        <span className="font-mono text-sm text-ww-muted">{tier.cadence}</span>
      </div>
      <p className="mb-6 font-serif text-sm leading-relaxed text-ww-muted">
        {tier.description}
      </p>
      <ul className="mb-8 flex-1 space-y-2">
        {tier.features.map((f) => (
          <li
            key={f.text}
            className={`flex items-start gap-2 text-sm ${
              f.included ? "text-ink" : "text-ww-muted line-through"
            }`}
          >
            {f.included ? (
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-sage" />
            ) : (
              <X className="mt-0.5 h-4 w-4 shrink-0 text-ww-muted/50" />
            )}
            <span className="font-serif">{f.text}</span>
          </li>
        ))}
      </ul>
      <Link
        href={tier.href}
        className={`block rounded px-6 py-3 text-center font-mono text-xs uppercase tracking-widest transition ${
          isHighlight
            ? "bg-rust text-warm-white hover:bg-rust/90"
            : "border border-ink text-ink hover:bg-ink hover:text-warm-white"
        }`}
      >
        {!isHighlight && tier.price === "₹0" ? null : <Lock className="mr-2 inline h-3 w-3" />}
        {tier.cta}
      </Link>
    </div>
  );
}
