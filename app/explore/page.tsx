import { ExploreGrid } from "@/components/intel/ExploreGrid";
import intelCards from "@/lib/mock-data/intel-cards.json";
import contributors from "@/lib/mock-data/contributors.json";

export const metadata = {
  title: "Explore Trip Intel — Wander Women",
  description:
    "Browse 15 solo travel intel cards curated by women who've been there.",
};

export default function ExplorePage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      {/* header */}
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

      <ExploreGrid cards={intelCards} contributors={contributors} />
    </div>
  );
}
