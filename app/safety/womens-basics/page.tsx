import Link from "next/link";
import { Heart, MapPin, Package, MessageCircle } from "lucide-react";
import data from "@/lib/mock-data/womens-basics.json";

export const metadata = {
  title: "Women's Basics — Wander Women",
  description:
    "Pads, tampons, cups, period pain meds, intimate hygiene — by city, by chemist, by neighbourhood across India.",
};

export default function WomensBasicsPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      {/* ── Hero ─────────────────────────────────────────── */}
      <div className="mb-10">
        <p className="mb-2 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-ww-muted">
          <Heart className="h-3.5 w-3.5" />
          Women&apos;s basics
        </p>
        <h1 className="mb-3 font-serif text-4xl leading-tight text-ink md:text-5xl">
          {data.intro.headline}
        </h1>
        <p className="font-mono text-sm leading-relaxed text-ww-muted">
          {data.intro.blurb}
        </p>
      </div>

      {/* ── General product availability ────────────────── */}
      <section className="mb-12">
        <div className="mb-4 flex items-center gap-3">
          <div className="h-px flex-1 bg-ww-border" />
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-ww-muted">
            Across India
          </span>
          <div className="h-px flex-1 bg-ww-border" />
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {data.general.map((item) => (
            <article
              key={item.title}
              className="border border-ww-border bg-warm-white p-5"
            >
              <h2 className="mb-2 font-serif text-lg text-ink">{item.title}</h2>
              <p className="font-mono text-xs leading-relaxed text-ww-muted">
                {item.summary}
              </p>
            </article>
          ))}
        </div>
      </section>

      {/* ── By city ──────────────────────────────────────── */}
      <section className="mb-12">
        <div className="mb-4 flex items-center gap-3">
          <div className="h-px flex-1 bg-ww-border" />
          <span className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-ww-muted">
            <MapPin className="h-3 w-3" />
            By city
          </span>
          <div className="h-px flex-1 bg-ww-border" />
        </div>
        <div className="space-y-4">
          {data.byCity.map((c) => (
            <article
              key={c.city}
              className="border border-ww-border bg-warm-white p-5"
            >
              <div className="mb-3 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <h2 className="font-serif text-xl text-ink">{c.city}</h2>
                <span className="font-mono text-[11px] text-ww-muted">
                  {c.neighbourhood}
                </span>
              </div>
              <dl className="mb-3 grid gap-x-6 gap-y-2 font-mono text-xs sm:grid-cols-3">
                <Field label="Pads" value={c.pads} />
                <Field label="Tampons" value={c.tampons} />
                <Field label="Cups" value={c.cups} />
              </dl>
              <p className="border-t border-ww-border pt-3 font-mono text-[11px] leading-relaxed text-ww-muted">
                {c.notes}
              </p>
            </article>
          ))}
        </div>
      </section>

      {/* ── Packing list ─────────────────────────────────── */}
      <section className="mb-12">
        <div className="mb-4 flex items-center gap-3">
          <div className="h-px flex-1 bg-ww-border" />
          <span className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-ww-muted">
            <Package className="h-3 w-3" />
            Pack from home
          </span>
          <div className="h-px flex-1 bg-ww-border" />
        </div>
        <ul className="space-y-2 border border-ww-border bg-warm-white p-5">
          {data.packing.map((p, i) => (
            <li
              key={i}
              className="flex items-start gap-2 font-mono text-xs leading-relaxed text-ink"
            >
              <span className="mt-0.5 shrink-0 text-rust">✓</span>
              <span>{p}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* ── Community cross-link ─────────────────────────── */}
      <Link
        href={data.communityLink.href}
        className="group flex items-start gap-4 border border-ww-border bg-sand p-5 transition-colors hover:border-rust"
      >
        <MessageCircle className="mt-0.5 h-5 w-5 shrink-0 text-rust" />
        <div className="flex-1">
          <p className="mb-1 font-serif text-lg leading-snug text-ink">
            {data.communityLink.label}
          </p>
          <p className="font-mono text-xs leading-relaxed text-ww-muted">
            {data.communityLink.blurb}
          </p>
        </div>
        <span className="shrink-0 self-center font-mono text-[10px] uppercase tracking-widest text-rust transition-transform group-hover:translate-x-1">
          Read →
        </span>
      </Link>

      {/* ── Footnote ─────────────────────────────────────── */}
      <p className="mt-10 border-t border-ww-border/60 pt-5 font-mono text-[10px] leading-relaxed text-ww-muted/80">
        Spotted a stockist that&apos;s wrong, missing, or moved? Tell us via{" "}
        <Link href="/feedback" className="underline hover:text-ink">
          Feedback
        </Link>{" "}
        — we update this page weekly.
      </p>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[9px] uppercase tracking-[0.2em] text-ww-muted">
        {label}
      </dt>
      <dd className="text-ink">{value}</dd>
    </div>
  );
}
