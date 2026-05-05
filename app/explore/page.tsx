import { ExploreGrid } from "@/components/intel/ExploreGrid";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Solo Female Travel Destinations — India & Beyond",
  description:
    "Browse 25+ solo female travel safety guides — scams, neighbourhoods, transport, costs. Real intel from women who've been there.",
};

export default async function ExplorePage() {
  const supabase = await createClient();

  const [{ data: dbCards }, { data: dbContribs }] = await Promise.all([
    supabase
      .from("intel_cards")
      .select("slug,destination,country,audience,contributor_slug,hero_image_url,tldr,is_premium,estimated_daily_budget")
      .order("destination"),
    supabase
      .from("contributors")
      .select("slug,name,photo_url"),
  ]);

  const cards = (dbCards ?? []).map((c) => ({
    slug: c.slug as string,
    destination: c.destination as string,
    country: c.country as string,
    audience: c.audience as string,
    contributorSlug: (c.contributor_slug as string) ?? null,
    heroImageUrl: (c.hero_image_url as string) ?? null,
    tldr: c.tldr as string[] | { summary: string },
    isPremium: (c.is_premium as boolean) ?? false,
    estimatedDailyBudget: c.estimated_daily_budget as {
      backpacker: number;
      comfortable: number;
      currency: string;
    } | null,
  }));

  const contributors = (dbContribs ?? []).map((c) => ({
    slug: c.slug as string,
    name: (c.name as string) ?? "",
    photoUrl: (c.photo_url as string) ?? "",
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
