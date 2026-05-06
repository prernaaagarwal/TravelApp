import { ExploreGrid } from "@/components/intel/ExploreGrid";
import { createClient } from "@/lib/supabase/server";
import { safeQuery } from "@/lib/safe-query";

export const metadata = {
  title: "Solo Female Travel Destinations — India & Beyond",
  description:
    "Browse 25+ solo female travel safety guides — scams, neighbourhoods, transport, costs. Real intel from women who've been there.",
};

type DbCard = {
  slug: string;
  destination: string;
  country: string;
  audience: string;
  contributor_slug: string | null;
  hero_image_url: string | null;
  tldr: string[] | { summary: string };
  is_premium: boolean | null;
  estimated_daily_budget: {
    backpacker: number;
    comfortable: number;
    currency: string;
  } | null;
};

type DbContrib = {
  slug: string;
  name: string | null;
  photo_url: string | null;
};

export default async function ExplorePage() {
  const supabase = await createClient();

  const [dbCards, dbContribs] = await Promise.all([
    safeQuery<DbCard[]>(
      supabase
        .from("intel_cards")
        .select("slug,destination,country,audience,contributor_slug,hero_image_url,tldr,is_premium,estimated_daily_budget")
        .order("destination"),
      [],
    ),
    safeQuery<DbContrib[]>(
      supabase.from("contributors").select("slug,name,photo_url"),
      [],
    ),
  ]);

  const cards = dbCards.map((c) => ({
    slug: c.slug,
    destination: c.destination,
    country: c.country,
    audience: c.audience,
    // Keep the original cast-to-string-or-null pattern. The Card type in
    // ExploreGrid declares contributorSlug as string, but at runtime it can
    // be null for orphaned cards. Match the existing behavior.
    contributorSlug: (c.contributor_slug as string) ?? null,
    heroImageUrl: (c.hero_image_url as string) ?? null,
    tldr: c.tldr,
    isPremium: c.is_premium ?? false,
    estimatedDailyBudget: c.estimated_daily_budget,
  }));

  const contributors = dbContribs.map((c) => ({
    slug: c.slug,
    name: c.name ?? "",
    photoUrl: c.photo_url ?? "",
  }));

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <div className="mb-10 max-w-xl">
        <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-ww-muted">
          Trip intel library
        </p>
        <h1 className="mb-3 font-serif text-4xl text-ink md:text-5xl">
          Solo female travel intel — every destination.
        </h1>
        <p className="font-mono text-sm leading-relaxed text-ww-muted">
          Every card written by a woman who has actually been there. Verified,
          updated, and honest about what the guidebooks skip.
        </p>
      </div>

      <ExploreGrid cards={cards} contributors={contributors} />
    </div>
  );
}
