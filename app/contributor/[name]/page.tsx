import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { createClient, createStaticClient } from "@/lib/supabase/server";
import { JsonLd } from "@/components/shared/JsonLd";
import { contributorLd } from "@/lib/jsonld";

type Params = Promise<{ name: string }>;

export async function generateStaticParams() {
  const supabase = createStaticClient();
  const { data } = await supabase.from("contributors").select("slug");
  return (data ?? []).map((c) => ({ name: c.slug as string }));
}

export async function generateMetadata({ params }: { params: Params }) {
  const { name } = await params;
  const supabase = await createClient();
  const { data } = await supabase.from("contributors").select("full_name,bio").eq("slug", name).single();
  if (!data) return { title: "Contributor not found — Wander Women" };
  return {
    title: `${data.full_name} — Wander Women Contributor`,
    description: (data.bio as string).split("\n")[0],
  };
}

export default async function ContributorPage({ params }: { params: Params }) {
  const { name } = await params;
  const supabase = await createClient();

  const { data: raw } = await supabase.from("contributors").select("*").eq("slug", name).single();
  if (!raw) notFound();

  const contributor = {
    slug: raw.slug,
    name: raw.name,
    fullName: raw.full_name,
    homeCity: raw.home_city,
    ageRange: raw.age_range,
    tripCount: raw.trip_count,
    tagline: raw.tagline,
    bio: raw.bio as string,
    photoUrl: raw.photo_url,
    badges: raw.badges as string[],
    instagram: raw.instagram,
    totalContributions: raw.total_contributions,
    answersInCommunity: raw.answers_in_community,
    earningsThisMonth: raw.earnings_this_month,
  };

  const [{ data: rawCards }, { data: rawPosts }, { data: stats }] = await Promise.all([
    supabase.from("intel_cards").select("slug,destination,country,hero_image_url,tldr").eq("contributor_slug", name),
    supabase.from("community_posts").select("id,content,destination,like_count,created_at").eq("author_name", contributor.name).eq("tab", "ask").eq("status", "approved").limit(4),
    supabase.from("contributor_stats").select("*").eq("slug", name).maybeSingle(),
  ]);

  // Real, live stats from the view. Falls back to seed values if the view
  // isn't available (e.g. legacy contributors with all zeros).
  const liveStats = {
    intelCardCount:        (stats?.intel_card_count        as number | undefined) ?? 0,
    intelTotalViews:       (stats?.intel_total_views       as number | undefined) ?? 0,
    intelVerifications:    (stats?.intel_verifications     as number | undefined) ?? 0,
    bewareCount:           (stats?.beware_count            as number | undefined) ?? 0,
    bewareTotalHelpful:    (stats?.beware_total_helpful    as number | undefined) ?? 0,
    postCount:             (stats?.post_count              as number | undefined) ?? 0,
    postTotalHelpful:      (stats?.post_total_helpful      as number | undefined) ?? 0,
  };

  const herCards = (rawCards ?? []).map((c) => ({
    slug: c.slug,
    destination: c.destination,
    country: c.country,
    heroImageUrl: c.hero_image_url,
    tldr: c.tldr as string[],
  }));

  const herPosts = (rawPosts ?? []).map((p) => ({
    id: p.id,
    content: p.content,
    destination: p.destination,
    likeCount: p.like_count,
    postedAt: new Date(p.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short" }),
  }));

  const bioParagraphs = contributor.bio
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);

  return (
    <div className="bg-warm-white">
      <JsonLd
        data={contributorLd({
          slug: contributor.slug,
          name: contributor.name,
          full_name: contributor.fullName,
          bio: contributor.bio,
          photo_url: contributor.photoUrl,
          home_city: contributor.homeCity,
        })}
      />
      {/* ── Hero strip ─────────────────────────────────────────────── */}
      <div className="border-b border-ww-border bg-ink px-6 py-12">
        <div className="mx-auto flex max-w-3xl flex-col items-start gap-6 sm:flex-row sm:items-center">
          <Image
            src={contributor.photoUrl}
            alt={contributor.fullName}
            width={96}
            height={96}
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
        <div className="mx-auto grid max-w-3xl grid-cols-3 divide-x divide-ww-border">
          {[
            { value: liveStats.intelCardCount,                                     label: "intel cards"  },
            { value: liveStats.intelTotalViews.toLocaleString("en-IN"),            label: "card views"   },
            { value: liveStats.bewareCount + liveStats.postCount,                  label: "contributions" },
          ].map((stat) => (
            <div key={stat.label} className="px-6 py-5 text-center">
              <p className="font-serif text-2xl font-light text-ink">
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
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden bg-rust-light">
                    <Image
                      src={card.heroImageUrl}
                      alt={card.destination}
                      fill
                      className="object-cover"
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
            Write like {contributor.name}
          </p>
          <h3 className="mb-2 font-serif text-2xl text-ink">
            Become a founding contributor
          </h3>
          <p className="mb-4 font-mono text-xs leading-relaxed text-ww-muted">
            Share your travel intel, get credited on every card you write, and
            earn revenue share when founding members read them. We&apos;re
            reviewing the first 20 contributors now.
          </p>
          <Link
            href="/account/membership"
            className="inline-block border border-ink bg-ink px-5 py-2 font-mono text-xs uppercase tracking-widest text-warm-white hover:bg-ink/80 transition-colors"
          >
            Apply to contribute →
          </Link>
        </section>
      </div>
    </div>
  );
}
