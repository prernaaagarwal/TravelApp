import { notFound } from "next/navigation";
import Link from "next/link";
import intelCards from "@/lib/mock-data/intel-cards.json";
import contributors from "@/lib/mock-data/contributors.json";
import communityPosts from "@/lib/mock-data/community-posts.json";

type Params = Promise<{ name: string }>;

export async function generateStaticParams() {
  return contributors.map((c) => ({ name: c.slug }));
}

export async function generateMetadata({ params }: { params: Params }) {
  const { name } = await params;
  const c = contributors.find((c) => c.slug === name);
  if (!c) return { title: "Contributor not found — Wander Women" };
  return {
    title: `${c.fullName} — Wander Women Contributor`,
    description: c.bio.split("\n")[0],
  };
}

export default async function ContributorPage({ params }: { params: Params }) {
  const { name } = await params;
  const contributor = contributors.find((c) => c.slug === name);
  if (!contributor) notFound();

  const herCards = intelCards.filter(
    (c) => c.contributorSlug === contributor.slug
  );

  const herPosts = communityPosts
    .filter((p) => p.author === contributor.name && p.tab === "ask")
    .slice(0, 4);

  const bioParagraphs = contributor.bio
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);

  return (
    <div className="bg-warm-white">
      {/* ── Hero strip ─────────────────────────────────────────────── */}
      <div className="border-b border-ww-border bg-ink px-6 py-12">
        <div className="mx-auto flex max-w-3xl flex-col items-start gap-6 sm:flex-row sm:items-center">
          <img
            src={contributor.photoUrl}
            alt={contributor.fullName}
            className="h-24 w-24 shrink-0 rounded-full object-cover ring-2 ring-gold"
          />
          <div className="min-w-0 flex-1">
            <p className="mb-1 font-mono text-[10px] uppercase tracking-[0.2em] text-warm-white/40">
              Founding contributor · {contributor.homeCity}
            </p>
            <h1 className="mb-2 font-serif text-3xl text-warm-white md:text-4xl">
              {contributor.fullName}
            </h1>
            <p className="mb-3 font-mono text-xs text-warm-white/60">
              {contributor.tagline}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {contributor.badges.map((badge) => (
                <span
                  key={badge}
                  className="rounded-full bg-warm-white/10 px-2 py-0.5 font-mono text-[10px] text-warm-white/70"
                >
                  {badge}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Stats bar ──────────────────────────────────────────────── */}
      <div className="border-b border-ww-border bg-sand">
        <div className="mx-auto grid max-w-3xl grid-cols-2 divide-x divide-ww-border sm:grid-cols-4">
          {[
            { value: contributor.tripCount, label: "solo trips" },
            { value: contributor.totalContributions, label: "cards written" },
            { value: contributor.answersInCommunity, label: "community answers" },
            {
              value: `₹${contributor.earningsThisMonth.toLocaleString("en-IN")}`,
              label: "earned this month",
              highlight: true,
            },
          ].map((stat) => (
            <div key={stat.label} className="px-6 py-5 text-center">
              <p
                className={`font-serif text-2xl font-light ${
                  stat.highlight ? "text-sage" : "text-ink"
                }`}
              >
                {stat.value}
              </p>
              <p className="font-mono text-[10px] text-ww-muted">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-6 py-12 space-y-14">

        {/* ── Bio ──────────────────────────────────────────────────── */}
        <section>
          <h2 className="mb-5 font-serif text-2xl text-ink">About</h2>
          <div className="space-y-4">
            {bioParagraphs.map((para, i) => (
              <p key={i} className="text-sm leading-relaxed text-ww-muted">
                {para}
              </p>
            ))}
          </div>
          {contributor.instagram && (
            <p className="mt-4 font-mono text-xs text-ww-muted">
              Instagram:{" "}
              <span className="text-rust">{contributor.instagram}</span>
            </p>
          )}
        </section>

        {/* ── Her intel cards ──────────────────────────────────────── */}
        {herCards.length > 0 && (
          <section>
            <h2 className="mb-5 font-serif text-2xl text-ink">
              Cards by {contributor.name}
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {herCards.map((card) => (
                <Link
                  key={card.slug}
                  href={`/intel/${card.slug}`}
                  className="group flex gap-4 border border-ww-border bg-sand p-4 hover:bg-ww-border/40 transition-colors"
                >
                  <div className="h-16 w-16 shrink-0 overflow-hidden bg-rust-light">
                    <img
                      src={card.heroImageUrl}
                      alt={card.destination}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-mono text-sm font-semibold text-ink group-hover:text-rust transition-colors">
                      {card.destination}
                    </p>
                    <p className="font-mono text-[10px] text-ww-muted">
                      {card.country}
                    </p>
                    <p className="mt-1 line-clamp-2 text-[11px] leading-relaxed text-ww-muted">
                      {card.tldr[0]}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* ── Recent community answers ─────────────────────────────── */}
        {herPosts.length > 0 && (
          <section>
            <h2 className="mb-5 font-serif text-2xl text-ink">
              Recent answers
            </h2>
            <div className="space-y-3">
              {herPosts.map((post) => (
                <div
                  key={post.id}
                  className="border border-ww-border bg-sand p-4"
                >
                  <p className="mb-2 text-sm leading-relaxed text-ink">
                    {post.content}
                  </p>
                  <div className="flex flex-wrap gap-3 font-mono text-[10px] text-ww-muted">
                    <span>{post.postedAt}</span>
                    {post.destination && (
                      <span className="text-rust">{post.destination}</span>
                    )}
                    <span>{post.likeCount} helpful</span>
                  </div>
                </div>
              ))}
            </div>
            <Link
              href="/community"
              className="mt-4 inline-block font-mono text-[10px] uppercase tracking-widest text-rust hover:underline"
            >
              See all community posts →
            </Link>
          </section>
        )}

        {/* ── Contributor CTA ──────────────────────────────────────── */}
        <section className="border border-gold/40 bg-gold-light p-6">
          <p className="mb-1 font-mono text-[10px] uppercase tracking-widest text-gold">
            Earn like {contributor.name}
          </p>
          <h3 className="mb-2 font-serif text-2xl text-ink">
            Become a founding contributor
          </h3>
          <p className="mb-4 font-mono text-xs leading-relaxed text-ww-muted">
            Share your travel intel, earn from every card view. {contributor.name} earned{" "}
            ₹{contributor.earningsThisMonth.toLocaleString("en-IN")} this month alone.
            Applications open — we review within 48 hours.
          </p>
          <Link
            href="/coming-soon"
            className="inline-block border border-ink bg-ink px-5 py-2 font-mono text-xs uppercase tracking-widest text-warm-white hover:bg-ink/80 transition-colors"
          >
            Apply to contribute →
          </Link>
        </section>
      </div>
    </div>
  );
}
