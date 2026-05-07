import { notFound } from "next/navigation";
import Image from "next/image";
import { Phone } from "lucide-react";
import { PreBookChecklist } from "@/components/intel/PreBookChecklist";
import { getChecklistState } from "@/app/actions/checklist";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { createClient as createBrowserClient } from "@/lib/supabase/client";
import { createClient } from "@/lib/supabase/server";
import { safeQuery } from "@/lib/safe-query";
import { SUPPORTED_BEWARE_CITIES } from "@/lib/beware-cities";
import { EmailSignupForm } from "@/components/shared/EmailSignupForm";
import { ShareIntelButton } from "@/components/shared/ShareIntelButton";
import { JsonLd } from "@/components/shared/JsonLd";
import { intelCardLd, breadcrumbLd, faqPageLd, intelCardFaqs } from "@/lib/jsonld";
import { ViewTracker } from "@/components/intel/ViewTracker";
import { env } from "@/lib/config";

const SITE_URL = env.NEXT_PUBLIC_SITE_URL;

type Params = Promise<{ slug: string }>;

type StaticParamRow = { slug: string };
type MetadataRow = {
  destination: string;
  country: string;
  tldr: unknown;
  scams: unknown;
  hero_image_url: string | null;
  last_updated: string | null;
};

export async function generateStaticParams() {
  const supabase = createBrowserClient();
  const data = await safeQuery<StaticParamRow[]>(
    supabase.from("intel_cards").select("slug"),
    [],
    3000,
    "intel.generateStaticParams",
  );
  return data.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Params }) {
  const { slug } = await params;
  const supabase = createBrowserClient();
  const data = await safeQuery<MetadataRow | null>(
    supabase
      .from("intel_cards")
      .select("destination,country,tldr,scams,hero_image_url,last_updated")
      .eq("slug", slug)
      .single(),
    null,
    1500,
    "intel.generateMetadata",
  );
  if (!data) return { title: "Not found — Wander Women" };

  const summary = Array.isArray(data.tldr)
    ? ((data.tldr as string[])[0] ?? "")
    : ((data.tldr as { summary?: string })?.summary ?? "");
  const scams = (data.scams as { title: string }[] | null) ?? [];
  const scamList = scams.slice(0, 3).map((s) => s.title).join(", ");
  const description = scamList
    ? `${summary} Scam warnings: ${scamList}. Verified intel for solo women travellers in ${data.destination}, ${data.country}.`
    : summary;

  const trimmedDescription = description.slice(0, 300);
  const ogImageUrl = data.hero_image_url ?? `${SITE_URL}/og-default.jpg`;
  const ogImageAlt = `${data.destination}, ${data.country}`;
  const lastUpdatedIso = data.last_updated
    ? new Date(data.last_updated).toISOString()
    : undefined;
  const pageTitle = `Solo Female Travel ${data.destination} — Wander Women`;

  return {
    title: `Solo Female Travel ${data.destination}, ${data.country} — Safety, Scams, Hidden Gems`,
    description: trimmedDescription,
    alternates: { canonical: `/intel/${slug}` },
    openGraph: {
      type: "article",
      title: pageTitle,
      description: trimmedDescription,
      url: `${SITE_URL}/intel/${slug}`,
      // Per-page hero image — without this, every intel page shares the
      // site-wide hero-rishikesh.jpg from /app/layout.tsx, which kills CTR
      // on social shares for non-Rishikesh destinations.
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: ogImageAlt,
        },
      ],
      ...(lastUpdatedIso
        ? { publishedTime: lastUpdatedIso, modifiedTime: lastUpdatedIso }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description: trimmedDescription,
      images: [ogImageUrl],
    },
  };
}

// Supabase rows are loosely typed at the query layer; downstream `as` casts
// handle each field at usage. Match the previous implicit-any behavior.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type IntelCardRow = Record<string, any>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ContributorRow = Record<string, any>;

export default async function IntelPage({ params }: { params: Params }) {
  const { slug } = await params;
  const supabase = await createClient();

  const raw = await safeQuery<IntelCardRow | null>(
    supabase.from("intel_cards").select("*").eq("slug", slug).single(),
    null,
    1500,
    "intel.card",
  );
  if (!raw) notFound();

  // Pre-fetch checklist state + auth in parallel so the PreBookChecklist
  // hydrates with the user's saved ticks (no flicker on render). Both fall
  // back to "empty + signed-out" if the queries time out.
  const [{ data: { user } }, checklistState] = await Promise.all([
    supabase.auth.getUser(),
    getChecklistState(slug),
  ]);
  const isLoggedIn = !!user;

  const card = {
    slug: raw.slug,
    destination: raw.destination,
    country: raw.country,
    audience: raw.audience,
    contributorSlug: raw.contributor_slug,
    lastUpdated: raw.last_updated,
    verifiedByCount: raw.verified_by_count,
    heroImageUrl: raw.hero_image_url,
    tldr: raw.tldr as string[] | { summary: string; safetyRating?: string; topTip?: string },
    neighborhoods: (raw.neighborhoods as { name: string; safetyRating: number; vibe: string; notes: string; stayHere: string }[]) ?? [],
    scams: (raw.scams as { title: string; severity: string; where: string; what: string; avoid: string }[]) ?? [],
    transport: (raw.transport as { mode: string; tip: string; approxCost: string }[]) ?? [],
    hiddenGems: (raw.hidden_gems as { name: string; why: string; type: string; angle: string; approxCost: string }[]) ?? [],
    preBookChecklist: (raw.pre_book_checklist as string[]) ?? [],
    dosAndDonts: (raw.dos_and_donts as { do: string[]; dont: string[] }) ?? { do: [], dont: [] },
    estimatedDailyBudget: raw.estimated_daily_budget as { backpacker: number; midRange: number; comfortable: number; currency?: string } | null,
    emergencyNumbers: (raw.emergency_numbers as { label: string; number: string }[] | null) ?? [],
    isPremium: raw.is_premium,
    premiumPreview: raw.premium_preview,
    affiliateLinks: (raw.affiliate_links ?? {}) as { booking?: string; worldNomads?: string },
  };

  const rawContributor = raw.contributor_slug
    ? await safeQuery<ContributorRow | null>(
        supabase.from("contributors").select("*").eq("slug", raw.contributor_slug).single(),
        null,
        1500,
        "intel.contributor",
      )
    : null;

  const contributor = rawContributor ? {
    slug: rawContributor.slug,
    name: rawContributor.name,
    fullName: rawContributor.full_name,
    homeCity: rawContributor.home_city,
    tripCount: rawContributor.trip_count,
    bio: rawContributor.bio,
    photoUrl: rawContributor.photo_url,
    badges: rawContributor.badges as string[],
    totalContributions: rawContributor.total_contributions,
    answersInCommunity: rawContributor.answers_in_community,
    earningsThisMonth: rawContributor.earnings_this_month,
  } : null;

  return (
    <div className="overflow-x-clip bg-warm-white">
      <ViewTracker slug={raw.slug} />
      <JsonLd
        data={intelCardLd({
          slug: raw.slug,
          destination: raw.destination,
          country: raw.country,
          hero_image_url: raw.hero_image_url,
          last_updated: raw.last_updated,
          contributor_name: contributor?.fullName ?? contributor?.name ?? null,
        })}
      />
      <JsonLd
        data={breadcrumbLd([
          { name: "Home",     url: SITE_URL },
          { name: "Explore",  url: `${SITE_URL}/explore` },
          { name: card.destination, url: `${SITE_URL}/intel/${card.slug}` },
        ])}
      />
      {/* FAQPage JSON-LD — lifted directly by Perplexity, ChatGPT, Google
          AI Overviews. Generated from the card's structured fields so every
          intel card gets coverage without per-card editorial work. */}
      <JsonLd
        data={faqPageLd(
          intelCardFaqs({
            destination: card.destination,
            country: card.country,
            scams: card.scams,
            transport: card.transport,
            estimatedDailyBudget: card.estimatedDailyBudget,
            lastUpdated: card.lastUpdated,
            contributorName: contributor?.fullName ?? contributor?.name ?? null,
          }),
        )}
      />
      {/* ── Hero image ───────────────────────────────────────────────── */}
      <div className="relative h-64 w-full overflow-hidden bg-rust-light md:h-80">
        <Image
          src={card.heroImageUrl}
          alt={card.destination}
          fill
          className="object-cover"
        />
        {/* dark scrim for text legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/20 to-transparent" />

        {/* hero text overlay */}
        <div className="absolute bottom-0 left-0 px-6 pb-6">
          <p className="mb-1 font-mono text-[10px] uppercase tracking-[0.2em] text-warm-white/60">
            {card.audience === "foreign" ? "For foreign women" : card.audience === "indian" ? "For Indian women" : "All solo women"}
          </p>
          {/* H1 carries the city + the search phrase a solo woman googles
              ("solo female travel safety guide"). The destination is visually
              dominant; the keyword line sits underneath in the same heading
              so Google sees one keyword-rich H1. */}
          <h1 className="font-serif leading-tight text-warm-white">
            <span className="block text-4xl md:text-5xl">{card.destination}</span>
            <span className="mt-1 block font-mono text-[11px] uppercase tracking-[0.18em] text-warm-white/70 md:text-xs">
              Solo Female Travel Safety Guide · {card.country}
            </span>
          </h1>
          {card.isPremium && (
            <span className="mt-2 inline-block bg-gold/90 px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-ink">
              + Founding member bonus inside
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
                <Image src={contributor.photoUrl} alt={contributor.name}
                  width={28} height={28} className="h-7 w-7 rounded-full object-cover" />
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
            {card.estimatedDailyBudget && (() => {
              const b = card.estimatedDailyBudget;
              const cur = b.currency ?? "INR";
              const sym = cur === "INR" ? "₹" : cur === "EUR" ? "€" : "$";
              const loc = cur === "INR" ? "en-IN" : "en-US";
              return (
                <span className="rounded-full bg-sand px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-ww-muted">
                  {sym}{b.backpacker.toLocaleString(loc)}–{sym}{b.comfortable.toLocaleString(loc)}/{cur === "INR" ? "day" : "day"}
                </span>
              );
            })()}
          </div>

          {/* ── Share row ─────────────────────────────────────────────── */}
          <div className="flex flex-col gap-3 border border-dashed border-ww-border bg-warm-white px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="font-mono text-[11px] uppercase tracking-widest text-ww-muted">
              Send this to whoever you&apos;re travelling with →
            </p>
            <ShareIntelButton
              path={`/intel/${card.slug}`}
              title={`${card.destination} — solo women's travel intel`}
              blurb={`Real safety, transit, and stay intel for solo women in ${card.destination}, ${card.country}. From Wander Women.`}
              variant="primary"
            />
          </div>

          {/* ── TLDR ──────────────────────────────────────────────────── */}
          <section>
            <div className="mb-4 flex items-center gap-3">
              <div className="h-px flex-1 bg-ww-border" />
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-ww-muted">
                {Array.isArray(card.tldr) ? "5 things to know before you go" : "Before you go"}
              </span>
              <div className="h-px flex-1 bg-ww-border" />
            </div>

            {Array.isArray(card.tldr) ? (
              <ol className="space-y-3">
                {(card.tldr as string[]).map((point, i) => (
                  <li key={i} className="flex gap-4 border border-ww-border bg-sand p-4">
                    <span className="mt-0.5 shrink-0 font-mono text-2xl font-light leading-none text-rust/30">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <p className="text-sm leading-relaxed text-ink">{point}</p>
                  </li>
                ))}
              </ol>
            ) : (
              <div className="space-y-3">
                <div className="border border-ww-border bg-sand p-4">
                  <p className="text-sm leading-relaxed text-ink">
                    {(card.tldr as { summary: string }).summary}
                  </p>
                </div>
                {(card.tldr as { topTip?: string }).topTip && (
                  <div className="border border-ww-border bg-sage-light/30 p-4">
                    <p className="mb-1 font-mono text-[10px] uppercase tracking-widest text-sage">Top tip</p>
                    <p className="text-xs leading-relaxed text-ink">{(card.tldr as { topTip: string }).topTip}</p>
                  </div>
                )}
              </div>
            )}
          </section>

          {/* ── Neighborhoods ─────────────────────────────────────────── */}
          <section>
            <h2 className="mb-4 font-serif text-2xl text-ink">Where to stay</h2>

            <Accordion type="multiple" className="space-y-2">
              {card.neighborhoods.map((n, i) => (
                <AccordionItem
                  key={i}
                  value={`hood-${i}`}
                  className="border border-ww-border bg-sand px-0"
                >
                  <AccordionTrigger className="px-4 py-3 hover:no-underline">
                    <div className="flex flex-1 items-center gap-3 text-left">
                      {/* safety dots */}
                      <div className="flex shrink-0 gap-0.5">
                        {Array.from({ length: 5 }).map((_, d) => (
                          <span
                            key={d}
                            className={`h-2 w-2 rounded-full ${
                              d < n.safetyRating
                                ? n.safetyRating >= 4
                                  ? "bg-sage"
                                  : n.safetyRating === 3
                                  ? "bg-gold"
                                  : "bg-rust"
                                : "bg-ww-border"
                            }`}
                          />
                        ))}
                      </div>

                      <div className="min-w-0 flex-1">
                        <span className="font-mono text-sm font-semibold text-ink">
                          {n.name}
                        </span>
                        <span className="ml-2 font-mono text-[10px] text-ww-muted">
                          {n.vibe}
                        </span>
                      </div>

                      {n.stayHere && (
                        <span className="shrink-0 rounded-full bg-sage-light px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-sage">
                          Stay here
                        </span>
                      )}
                    </div>
                  </AccordionTrigger>

                  <AccordionContent className="border-t border-ww-border px-4 pb-4 pt-3">
                    <p className="text-sm leading-relaxed text-ww-muted">{n.notes}</p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>

          {/* ── Scams ─────────────────────────────────────────────────── */}
          <section>
            <h2 className="mb-1 font-serif text-2xl text-ink">Scam watch</h2>
            <p className="mb-4 font-mono text-xs text-ww-muted">
              Reported and verified for {card.destination}. Read before you arrive.
            </p>

            {SUPPORTED_BEWARE_CITIES.has(card.slug) ? (
              <a
                href={`/community/beware/${card.slug}`}
                className="flex items-center justify-between border border-rust/30 bg-rust-light/60 px-5 py-5 transition-colors hover:bg-rust-light"
              >
                <div>
                  <p className="font-mono text-sm font-semibold text-rust">
                    📍 {card.scams.length} scam reports — see them on the map
                  </p>
                  <p className="mt-1 font-mono text-[10px] text-ww-muted">
                    Exact locations, community warnings, and how to avoid each one
                  </p>
                </div>
                <span className="ml-4 shrink-0 font-mono text-sm text-rust">→</span>
              </a>
            ) : (
              <div className="space-y-1.5">
                {card.scams.slice(0, 4).map((scam, i) => (
                  <div key={i} className="flex items-center gap-3 border border-ww-border bg-sand px-4 py-3">
                    <span className="font-mono text-[10px] uppercase tracking-widest text-ww-muted">
                      {scam.severity}
                    </span>
                    <span className="font-mono text-sm text-ink">{scam.title}</span>
                  </div>
                ))}
                {card.scams.length > 4 && (
                  <p className="font-mono text-[10px] text-ww-muted">
                    +{card.scams.length - 4} more
                  </p>
                )}
              </div>
            )}
          </section>

          {/* ── Transport ─────────────────────────────────────────────── */}
          <section>
            <h2 className="mb-4 font-serif text-2xl text-ink">Getting around</h2>
            <div className="space-y-2">
              {card.transport.map((t, i) => (
                <div key={i} className="flex gap-4 border border-ww-border bg-sand p-4">
                  <span className="mt-0.5 shrink-0 text-lg">🚌</span>
                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex flex-wrap items-baseline gap-2">
                      <span className="font-mono text-sm font-semibold text-ink">{t.mode}</span>
                      <span className="font-mono text-xs text-rust">{t.approxCost}</span>
                    </div>
                    <p className="text-xs leading-relaxed text-ww-muted">{t.tip}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ── Hidden Gems ───────────────────────────────────────────── */}
          <section>
            <h2 className="mb-1 font-serif text-2xl text-ink">Hidden gems</h2>
            <p className="mb-4 font-mono text-xs text-ww-muted">
              Places most travel guides miss. Verified by our contributors.
            </p>
            <div className="space-y-3">
              {card.hiddenGems.map((gem, i) => (
                <div key={i} className="border border-ww-border bg-sand p-4">
                  <div className="mb-2 flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <h3 className="font-mono text-sm font-semibold text-ink">{gem.name}</h3>
                      <div className="mt-1 flex flex-wrap gap-2">
                        <span className="rounded-full bg-blue-light px-2 py-0.5 font-mono text-[10px] text-blue">
                          {gem.type}
                        </span>
                        <span className="rounded-full bg-purple-light px-2 py-0.5 font-mono text-[10px] text-purple">
                          {gem.angle}
                        </span>
                      </div>
                    </div>
                    <span className="shrink-0 font-mono text-xs text-ww-muted">{gem.approxCost}</span>
                  </div>
                  <p className="text-xs leading-relaxed text-ww-muted">{gem.why}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ── Pre-book checklist ────────────────────────────────────── */}
          <section>
            <h2 className="mb-1 font-serif text-2xl text-ink">Before you go</h2>
            <p className="mb-4 font-mono text-xs text-ww-muted">
              Tick these off. Progress saves automatically.
            </p>
            <PreBookChecklist
              items={card.preBookChecklist}
              slug={card.slug}
              isLoggedIn={isLoggedIn}
              initialCheckedIndexes={checklistState.checkedIndexes}
              initialShareToken={checklistState.shareToken}
            />
          </section>

          {/* ── Money tiers ───────────────────────────────────────────── */}
          <section>
            <h2 className="mb-1 font-serif text-2xl text-ink">Daily budget</h2>
            <p className="mb-4 font-mono text-xs text-ww-muted">
              Per person, per day. Includes stay, food, and local transport.
            </p>

            {card.estimatedDailyBudget && (() => {
              const b = card.estimatedDailyBudget;
              const cur = b.currency ?? "INR";
              const isINR = cur === "INR";
              const sym = isINR ? "₹" : cur === "EUR" ? "€" : "$";
              const loc = isINR ? "en-IN" : "en-US";
              const USD_RATE = 84;
              const tiers = [
                { label: "Backpacker", amount: b.backpacker, desc: "Dorm or budget guesthouse, street food, local buses", color: "border-l-sage" },
                { label: "Mid-range", amount: b.midRange, desc: "Private room, sit-down meals, occasional Uber", color: "border-l-gold" },
                { label: "Comfortable", amount: b.comfortable, desc: "Boutique hotel, restaurant dining, app taxis", color: "border-l-blue" },
              ];
              return (
                <div className="divide-y divide-ww-border border border-ww-border bg-sand">
                  <div className="grid grid-cols-[1fr_auto] gap-4 px-4 py-2">
                    <span className="font-mono text-[10px] uppercase tracking-widest text-ww-muted">Tier</span>
                    <span className="font-mono text-[10px] uppercase tracking-widest text-ww-muted">{cur} / day</span>
                  </div>
                  {tiers.map((tier) => (
                    <div key={tier.label} className={`grid grid-cols-[1fr_auto] items-center gap-4 border-l-4 px-4 py-3 ${tier.color}`}>
                      <div>
                        <p className="font-mono text-sm font-semibold text-ink">{tier.label}</p>
                        <p className="text-xs text-ww-muted">{tier.desc}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-mono text-sm font-semibold text-ink">
                          {sym}{tier.amount.toLocaleString(loc)}
                        </p>
                        {isINR && (
                          <p className="font-mono text-[10px] text-ww-muted">
                            ≈ ${Math.round(tier.amount / USD_RATE)}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              );
            })()}

            {/* dos and don'ts */}
            {((card.dosAndDonts?.do?.length ?? 0) > 0 || (card.dosAndDonts?.dont?.length ?? 0) > 0) && (
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {(card.dosAndDonts?.do?.length ?? 0) > 0 && (
                  <div className="border border-sage/30 bg-sage-light/30 p-4">
                    <p className="mb-2 font-mono text-[10px] uppercase tracking-widest text-sage">Do</p>
                    <ul className="space-y-1.5">
                      {card.dosAndDonts.do.map((d, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs leading-relaxed text-ink">
                          <span className="mt-0.5 shrink-0 text-sage">✓</span>{d}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {(card.dosAndDonts?.dont?.length ?? 0) > 0 && (
                  <div className="border border-rust/30 bg-rust-light/30 p-4">
                    <p className="mb-2 font-mono text-[10px] uppercase tracking-widest text-rust">Don&apos;t</p>
                    <ul className="space-y-1.5">
                      {card.dosAndDonts.dont.map((d, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs leading-relaxed text-ink">
                          <span className="mt-0.5 shrink-0 text-rust">✕</span>{d}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </section>

          {/* ── Premium locked section ────────────────────────────────── */}
          {/*
            Paywall principle: SAFETY intel is always free. The premium
            "Bonus chapter" only adds itineraries, off-season hacks, day-trip
            routes, and contributor-curated planning content — never warnings,
            scam reports, or vetted-for-safety lists. Those live in the free
            sections above (TLDR, Scams, Don't, Neighborhoods, Emergency).
          */}
          {card.isPremium && (
            <section className="relative overflow-hidden border border-ww-border">
              <div className="border-b border-ww-border bg-sand/50 px-4 py-2">
                <p className="flex items-center justify-between gap-3 font-mono text-[10px] uppercase tracking-widest text-ww-muted">
                  <span>Bonus chapter — founding members</span>
                  <span className="text-sage">Safety intel always free ✓</span>
                </p>
              </div>
              {/* blurred preview content */}
              <div className="select-none blur-sm pointer-events-none p-6 space-y-3 bg-sand">
                <p className="font-mono text-sm text-ink">{card.premiumPreview}</p>
                <div className="space-y-2">
                  {[
                    "Curated multi-day itinerary, contributor-tested",
                    "Off-season hacks that cut accommodation costs by 30–40%",
                    "Day-trip add-on routes most guidebooks skip",
                  ].map((line, i) => (
                    <p key={i} className="flex gap-2 text-xs text-ww-muted">
                      <span className="text-gold">✦</span>{line}
                    </p>
                  ))}
                </div>
              </div>

              {/* lock overlay */}
              <div className="absolute inset-0 top-9 flex flex-col items-center justify-center bg-ink/60 px-6 text-center">
                <span className="mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-gold">
                  Founding members only · planning content
                </span>
                <p className="mb-1 font-serif text-xl text-warm-white">
                  Unlock the planning chapter
                </p>
                <p className="mb-4 max-w-md font-mono text-[11px] leading-relaxed text-warm-white/70">
                  Itineraries, off-season hacks, and day-trip routes — not safety
                  warnings. All safety intel above is free, forever.
                </p>
                <a
                  href="/account/membership"
                  className="border border-gold bg-transparent px-6 py-2.5 font-mono text-xs uppercase tracking-widest text-gold hover:bg-gold hover:text-ink transition-colors"
                >
                  Free in beta — unlock now →
                </a>
                <span className="mt-3 font-mono text-[10px] tracking-widest text-warm-white/40">
                  V1: <span className="line-through">₹499 / year</span>
                </span>
              </div>
            </section>
          )}

          {/* ── Emergency numbers ─────────────────────────────────────── */}
          <section>
            <h2 className="mb-1 font-serif text-2xl text-ink">Emergency contacts</h2>
            <p className="mb-4 font-mono text-xs text-ww-muted">
              Tap any number to call. Screenshot this section before you travel.
            </p>
            <div className="grid gap-2 sm:grid-cols-2">
              {card.emergencyNumbers.map((e, i) => (
                <a
                  key={i}
                  href={`tel:${e.number}`}
                  aria-label={`Call ${e.label} at ${e.number}`}
                  className="group flex items-center justify-between gap-3 border border-ww-border bg-sand px-4 py-3 transition-colors hover:border-rust hover:bg-rust-light/40"
                >
                  <span className="font-mono text-xs text-ww-muted group-hover:text-ink">
                    {e.label}
                  </span>
                  <span className="inline-flex items-center gap-2 font-mono text-sm font-semibold text-rust">
                    <Phone className="h-3.5 w-3.5" aria-hidden />
                    {e.number}
                  </span>
                </a>
              ))}
            </div>
            <div className="mt-4 flex flex-col gap-2 border-t border-ww-border pt-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="font-mono text-[11px] text-ww-muted">
                Forward this to mum, your partner, or whoever&apos;s tracking you.
              </p>
              <ShareIntelButton
                path={`/intel/${card.slug}`}
                title={`Emergency contacts: ${card.destination}`}
                blurb={`Saving these in case I need them — emergency numbers and safety intel for ${card.destination}.`}
                variant="ghost"
              />
            </div>
          </section>

          {/* ── Affiliate links ───────────────────────────────────────── */}
          {(card.affiliateLinks.booking || card.affiliateLinks.worldNomads) && (
            <section className="grid gap-3 sm:grid-cols-2">
              {card.affiliateLinks.booking && (
                <a
                  href={card.affiliateLinks.booking}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between border border-ww-border bg-blue-light px-4 py-3 hover:bg-blue/10 transition-colors"
                >
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-widest text-blue">
                      Booking.com
                    </p>
                    <p className="font-mono text-xs text-ink">
                      Browse stays in {card.destination} →
                    </p>
                  </div>
                  <span className="shrink-0 text-blue">↗</span>
                </a>
              )}
              {card.affiliateLinks.worldNomads && (
                <a
                  href={card.affiliateLinks.worldNomads}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between border border-ww-border bg-sage-light px-4 py-3 hover:bg-sage/10 transition-colors"
                >
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-widest text-sage">
                      World Nomads
                    </p>
                    <p className="font-mono text-xs text-ink">
                      Travel insurance for {card.country} →
                    </p>
                  </div>
                  <span className="shrink-0 text-sage">↗</span>
                </a>
              )}
            </section>
          )}

          {/* ── Full contributor card ─────────────────────────────────── */}
          {contributor && (
            <section className="border border-ww-border bg-sand p-6">
              <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.2em] text-ww-muted">
                About the contributor
              </p>
              <div className="flex items-start gap-4">
                <Image
                  src={contributor.photoUrl}
                  alt={contributor.name}
                  width={56}
                  height={56}
                  className="h-14 w-14 shrink-0 rounded-full object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="font-mono text-sm font-semibold text-ink">
                    {contributor.fullName}
                  </p>
                  <p className="font-mono text-xs text-ww-muted">
                    {contributor.homeCity} · {contributor.tripCount} solo trips
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {contributor.badges.map((badge) => (
                      <span
                        key={badge}
                        className="rounded-full bg-rust-light px-2 py-0.5 font-mono text-[10px] text-rust"
                      >
                        {badge}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <p className="mt-4 text-xs leading-relaxed text-ww-muted">
                {contributor.bio.split("\n")[0]}
              </p>
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-ww-border pt-4">
                <div className="flex gap-6">
                  <div>
                    <p className="font-mono text-lg font-light text-ink">
                      {contributor.totalContributions}
                    </p>
                    <p className="font-mono text-[10px] text-ww-muted">cards written</p>
                  </div>
                  <div>
                    <p className="font-mono text-lg font-light text-ink">
                      {contributor.answersInCommunity}
                    </p>
                    <p className="font-mono text-[10px] text-ww-muted">community answers</p>
                  </div>
                  <div>
                    <p className="font-mono text-lg font-light text-ink">
                      {contributor.tripCount}
                    </p>
                    <p className="font-mono text-[10px] text-ww-muted">solo trips</p>
                  </div>
                </div>
                <a
                  href={`/contributor/${contributor.slug}`}
                  className="font-mono text-[10px] uppercase tracking-widest text-rust hover:underline"
                >
                  Full profile →
                </a>
              </div>
            </section>
          )}
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
                  <Image src={contributor.photoUrl} alt={contributor.name}
                    width={40} height={40} className="h-10 w-10 rounded-full object-cover" />
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

      {/* ── Footer contribute CTA ────────────────────────────────────── */}
      <div className="border-t border-ww-border bg-ink px-6 py-12 text-center">
        <p className="mb-1 font-mono text-[10px] uppercase tracking-[0.2em] text-warm-white/40">
          Know {card.destination} well?
        </p>
        <h2 className="mb-3 font-serif text-3xl text-warm-white">
          Contribute your own intel
        </h2>
        <p className="mx-auto mb-6 max-w-sm font-mono text-xs leading-relaxed text-warm-white/60">
          Founding contributors earn ₹2,000–₹4,000 / month from card revenue share.
          Apply with your email — we review within 48 hours.
        </p>
        <div className="mx-auto max-w-sm">
          <EmailSignupForm
            source="contributor-apply"
            placeholder="your@email.com"
            buttonText="Apply →"
            dark
          />
        </div>
      </div>
    </div>
  );
}
