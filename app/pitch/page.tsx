import Link from "next/link";
import contributors from "@/lib/mock-data/contributors.json";

export const metadata = {
  title: "Investor Overview — Wander Women",
  description:
    "Wander Women: solo women's travel intelligence platform. Demo walkthrough and key metrics.",
};

const ROUTES = [
  { label: "Landing", href: "/", desc: "Hero, trust bar, scam ticker, membership CTA" },
  { label: "Trip Intel Card", href: "/intel/goa-india", desc: "Full Goa card — scams, transport, checklist, budget" },
  { label: "Explore", href: "/explore", desc: "15-card filterable library" },
  { label: "Community", href: "/community", desc: "4 tabs: Ask, Local Sister, Rant, Beware Board" },
  { label: "Trip Feed", href: "/feed", desc: "12 real itineraries with cost breakdowns" },
  { label: "Find a Buddy", href: "/buddy", desc: "Buddy matching with overlap tags" },
  { label: "Vault", href: "/vault", desc: "WhatsApp document vault upsell" },
  { label: "Contributor profile", href: `/contributor/${contributors[0].slug}`, desc: "Public profile — bio, badges, cards written" },
  { label: "Onboarding", href: "/onboarding", desc: "3-question flow → personalised intel card" },
  { label: "Safety Shop", href: "/shop", desc: "10 affiliate products — Amazon Associates" },
];

const METRICS = [
  { value: "15", label: "trip intel cards" },
  { value: "8", label: "founding contributors" },
  { value: "40", label: "community posts seeded" },
  { value: "25", label: "verified scam reports" },
  { value: "12", label: "trip receipts" },
  { value: "10", label: "buddy profiles" },
  { value: "3", label: "revenue streams in demo" },
];

export default function PitchPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      {/* header */}
      <div className="mb-10 border-b border-ww-border pb-10">
        <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-ww-muted">
          Investor overview
        </p>
        <h1 className="mb-4 font-serif text-4xl text-ink md:text-5xl">
          Wander Women
        </h1>
        <p className="mb-6 font-mono text-sm leading-relaxed text-ww-muted">
          Solo women&apos;s travel intelligence platform. Community-sourced, contributor-rewarded, founder-supported. Built on a gap no one else has closed: verified, women-only, pre-trip safety intel.
        </p>

        {/* Loom embed placeholder */}
        <div className="flex aspect-video items-center justify-center border border-dashed border-ww-border bg-sand">
          <div className="text-center">
            <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-ww-muted">
              60-second walkthrough
            </p>
            <p className="font-serif text-2xl text-ink">Loom embed</p>
            <p className="mt-2 font-mono text-xs text-ww-muted">
              Replace this block with your Loom embed code.
            </p>
            <p className="mt-1 font-mono text-[10px] text-ww-muted">
              Edit /app/pitch/page.tsx — swap the div above for an{" "}
              <code className="text-rust">&lt;iframe src=&quot;...&quot; /&gt;</code>
            </p>
          </div>
        </div>
      </div>

      {/* metrics */}
      <section className="mb-12">
        <h2 className="mb-5 font-serif text-2xl text-ink">Demo stats</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {METRICS.map((m) => (
            <div
              key={m.label}
              className="border border-ww-border bg-sand p-4 text-center"
            >
              <p className="font-serif text-3xl font-light text-rust">
                {m.value}
              </p>
              <p className="font-mono text-[10px] text-ww-muted">{m.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* tap-through guide */}
      <section className="mb-12">
        <h2 className="mb-2 font-serif text-2xl text-ink">
          90-second tap-through
        </h2>
        <p className="mb-5 font-mono text-xs text-ww-muted">
          Each route is live. Click through in order for the full demo flow.
        </p>
        <div className="space-y-2">
          {ROUTES.map((r, i) => (
            <Link
              key={r.href}
              href={r.href}
              className="group flex items-center gap-4 border border-ww-border bg-sand px-4 py-3 hover:bg-ww-border/40 transition-colors"
            >
              <span className="w-5 shrink-0 font-mono text-xs text-ww-muted">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="min-w-0 flex-1">
                <span className="font-mono text-sm font-semibold text-ink group-hover:text-rust transition-colors">
                  {r.label}
                </span>
                <span className="ml-3 font-mono text-[10px] text-ww-muted">
                  {r.desc}
                </span>
              </div>
              <span className="shrink-0 text-ww-muted group-hover:text-rust">
                →
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* revenue model */}
      <section className="border border-ww-border bg-sand p-6">
        <h2 className="mb-4 font-serif text-2xl text-ink">Revenue model</h2>
        <div className="space-y-3">
          {[
            {
              stream: "Founding membership",
              price: "₹499/year",
              note: "First 200 slots. Unlocks premium card sections.",
              color: "border-l-rust",
            },
            {
              stream: "WhatsApp Trip Vault",
              price: "₹199/trip",
              note: "Recurring per-trip. High intent, high margin.",
              color: "border-l-gold",
            },
            {
              stream: "Amazon affiliate",
              price: "3–8% commission",
              note: "10 safety products. Zero inventory.",
              color: "border-l-sage",
            },
          ].map((r) => (
            <div
              key={r.stream}
              className={`border border-ww-border border-l-4 px-4 py-3 ${r.color}`}
            >
              <div className="flex flex-wrap items-baseline gap-3">
                <span className="font-mono text-sm font-semibold text-ink">
                  {r.stream}
                </span>
                <span className="font-mono text-xs text-rust">{r.price}</span>
              </div>
              <p className="mt-1 text-xs text-ww-muted">{r.note}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="mt-10 text-center">
        <Link
          href="/"
          className="font-mono text-[10px] uppercase tracking-widest text-ww-muted hover:text-ink"
        >
          ← Back to landing
        </Link>
      </div>
    </div>
  );
}
