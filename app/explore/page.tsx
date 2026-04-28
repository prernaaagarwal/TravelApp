import { ExploreGrid } from "@/components/intel/ExploreGrid";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Explore Trip Intel — Wander Women",
  description:
    "Browse 15 solo travel intel cards curated by women who've been there.",
};

export default async function ExplorePage() {
  const supabase = await createClient();

  const [{ data: rawCards }, { data: rawContributors }] = await Promise.all([
    supabase.from("intel_cards").select("slug,destination,country,audience,contributor_slug,hero_image_url,tldr,is_premium,estimated_daily_budget"),
    supabase.from("contributors").select("slug,name,photo_url"),
  ]);

  const cards = (rawCards ?? []).map((c) => ({
    slug: c.slug,
    destination: c.destination,
    country: c.country,
    audience: c.audience,
    contributorSlug: c.contributor_slug,
    heroImageUrl: c.hero_image_url,
    tldr: c.tldr as string[] | { summary: string },
    isPremium: c.is_premium,
    estimatedDailyBudget: c.estimated_daily_budget as { backpacker: number; comfortable: number; currency: string } | null,
  }));

  const contributors = (rawContributors ?? []).map((c) => ({
    slug: c.slug,
    name: c.name,
    photoUrl: c.photo_url,
  }));

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <div className="mb-10 max-w-xl">
        <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-ww-muted">
          Trip intel library
        </p>
        <h1 className="mb-3 font-serif text-4xl text-ink md:text-5xl">
          Browse all destinations
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
