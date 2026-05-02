import { ExploreGrid } from "@/components/intel/ExploreGrid";
import intelCardsData from "@/lib/mock-data/intel-cards.json";
import contributorsData from "@/lib/mock-data/contributors.json";

export const metadata = {
  title: "Explore Trip Intel — Wander Women",
  description:
    "Browse 15 solo travel intel cards curated by women who've been there.",
};

export default function ExplorePage() {
  const cards = intelCardsData.map((c) => ({
    slug: c.slug,
    destination: c.destination,
    country: c.country,
    audience: c.audience,
    contributorSlug: c.contributorSlug,
    heroImageUrl: c.heroImageUrl,
    tldr: c.tldr as string[] | { summary: string },
    isPremium: c.isPremium,
    estimatedDailyBudget: c.estimatedDailyBudget as {
      backpacker: number;
      comfortable: number;
      currency: string;
    } | null,
  }));

  const contributors = contributorsData.map((c) => ({
    slug: c.slug,
    name: c.name,
    photoUrl: c.photoUrl,
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
