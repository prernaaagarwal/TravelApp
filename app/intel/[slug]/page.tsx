import { notFound } from "next/navigation";
import intelCards from "@/lib/mock-data/intel-cards.json";
import contributors from "@/lib/mock-data/contributors.json";

type Params = Promise<{ slug: string }>;

export async function generateStaticParams() {
  return intelCards.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Params }) {
  const { slug } = await params;
  const card = intelCards.find((c) => c.slug === slug);
  if (!card) return { title: "Not found — Wander Women" };
  return {
    title: `${card.destination} Solo Travel Intel — Wander Women`,
    description: card.tldr[0],
  };
}

export default async function IntelPage({ params }: { params: Params }) {
  const { slug } = await params;
  const card = intelCards.find((c) => c.slug === slug);
  if (!card) notFound();

  const contributor = contributors.find((c) => c.slug === card.contributorSlug);

  return (
    <div className="bg-warm-white">
      {/* ── Hero image ───────────────────────────────────────────────── */}
      <div className="relative h-64 w-full overflow-hidden bg-rust-light md:h-80">
        <img
          src={card.heroImageUrl}
          alt={card.destination}
          className="h-full w-full object-cover"
        />
        {/* dark scrim for text legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/20 to-transparent" />

        {/* hero text overlay */}
        <div className="absolute bottom-0 left-0 px-6 pb-6">
          <p className="mb-1 font-mono text-[10px] uppercase tracking-[0.2em] text-warm-white/60">
            {card.country} · {card.audience === "foreign" ? "For foreign women" : card.audience === "indian" ? "For Indian women" : "All solo women"}
          </p>
          <h1 className="font-serif text-4xl leading-tight text-warm-white md:text-5xl">
            {card.destination}
          </h1>
          {card.isPremium && (
            <span className="mt-2 inline-block bg-gold px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-ink">
              Premium Card
            </span>
          )}
        </div>
      </div>

      {/* ── Page body — two-column on desktop ───────────────────────── */}
      <div className="mx-auto max-w-5xl px-6 py-10 lg:grid lg:grid-cols-[1fr_280px] lg:gap-10">

        {/* ── Main content column ──────────────────────────────────── */}
        <main className="min-w-0 space-y-12">

          {/* meta row */}
          <div className="flex flex-wrap items-center gap-4 border-b border-ww-border pb-6">
            <div className="flex items-center gap-2">
              {contributor && (
                <img src={contributor.photoUrl} alt={contributor.name}
                  className="h-7 w-7 rounded-full object-cover" />
              )}
              <span className="font-mono text-xs text-ww-muted">
                by <span className="text-ink">{contributor?.name ?? "Wander Women"}</span>
              </span>
            </div>
            <span className="font-mono text-xs text-ww-muted">
              Updated {card.lastUpdated}
            </span>
            <span className="font-mono text-xs text-ww-muted">
              ✓ Verified by {card.verifiedByCount} travellers
            </span>
            <span className="rounded-full bg-sand px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-ww-muted">
              {card.estimatedDailyBudget.backpacker.toLocaleString("en-IN")}–
              {card.estimatedDailyBudget.comfortable.toLocaleString("en-IN")} ₹/day
            </span>
          </div>

          {/* sections will be filled in steps 2–9 */}
          <p className="font-mono text-sm text-ww-muted">
            Sections loading — steps 2–9 will populate this column.
          </p>
        </main>

        {/* ── Sticky sidebar ───────────────────────────────────────── */}
        <aside className="hidden lg:block">
          <div className="sticky top-24 space-y-3">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ww-muted">
              Quick actions
            </p>
            {[
              { label: "Ask the community", href: "/community", color: "text-blue" },
              { label: "Find a travel buddy", href: "/buddy", color: "text-sage" },
              { label: "Set up safety vault", href: "/vault", color: "text-rust" },
            ].map((item) => (
              <a
                key={item.label}
                href={item.href}
                className={`flex items-center justify-between border border-ww-border bg-sand px-4 py-3 font-mono text-xs hover:bg-ww-border ${item.color}`}
              >
                {item.label}
                <span>→</span>
              </a>
            ))}

            {/* contributor mini-card */}
            {contributor && (
              <div className="mt-6 border border-ww-border bg-sand p-4">
                <p className="mb-3 font-mono text-[10px] uppercase tracking-widest text-ww-muted">
                  Written by
                </p>
                <div className="flex items-center gap-3">
                  <img src={contributor.photoUrl} alt={contributor.name}
                    className="h-10 w-10 rounded-full object-cover" />
                  <div>
                    <p className="font-mono text-sm font-semibold text-ink">{contributor.name}</p>
                    <p className="font-mono text-[10px] text-ww-muted">{contributor.tripCount} solo trips</p>
                  </div>
                </div>
                <p className="mt-3 line-clamp-3 text-xs leading-relaxed text-ww-muted">
                  {contributor.bio.split("\n")[0]}
                </p>
                <a href={`/contributor/${contributor.slug}`}
                  className="mt-3 block font-mono text-[10px] uppercase tracking-widest text-rust hover:underline">
                  Full profile →
                </a>
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
