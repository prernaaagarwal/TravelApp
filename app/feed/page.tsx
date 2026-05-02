import tripFeed from "@/lib/mock-data/trip-feed.json";
import contributors from "@/lib/mock-data/contributors.json";
import { ReceiptsClient } from "./ReceiptsClient";

type SearchParams = Promise<{ destination?: string }>;

export const metadata = {
  title: "Trip Receipts — Wander Women",
  description:
    "Real itineraries with rupee + USD costs. Receipts, not inspiration.",
};

// Slug pattern: `<city-words>-<country>`. Strip the country segment and
// title-case the rest. New destinations need no extra mapping.
function cityFromSlug(slug: string): string {
  const parts = slug.split("-");
  parts.pop();
  return parts.map((p) => p.charAt(0).toUpperCase() + p.slice(1)).join(" ");
}

export default async function FeedPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { destination } = await searchParams;

  const destCounts = new Map<string, number>();
  for (const t of tripFeed) {
    destCounts.set(
      t.destinationSlug,
      (destCounts.get(t.destinationSlug) ?? 0) + 1,
    );
  }

  const destinations = [...destCounts.entries()]
    .map(([slug, count]) => ({ slug, name: cityFromSlug(slug), count }))
    .sort((a, b) => a.name.localeCompare(b.name));

  // Pre-select a destination when arriving from onboarding / budget CTA.
  const initialDestination =
    destination && destCounts.has(destination.trim())
      ? destination.trim()
      : undefined;

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <div className="mb-8">
        <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-ww-muted">
          Trip receipts
        </p>
        <h1 className="mb-3 font-serif text-4xl text-ink md:text-5xl">
          What it actually cost.
        </h1>
        <p className="font-mono text-sm leading-relaxed text-ww-muted">
          {tripFeed.length} real solo trips, every rupee tracked. Receipts, not
          Pinterest aspirations.
        </p>
      </div>

      <ReceiptsClient
        trips={
          tripFeed as Parameters<typeof ReceiptsClient>[0]["trips"]
        }
        contributors={contributors}
        destinations={destinations}
        initialDestination={initialDestination}
      />
    </div>
  );
}
