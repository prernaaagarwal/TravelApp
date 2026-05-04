import tripFeed from "@/lib/mock-data/trip-feed.json";
import contributors from "@/lib/mock-data/contributors.json";
import { ReceiptsClient } from "./ReceiptsClient";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

type SearchParams = Promise<{ destination?: string; submitted?: string }>;

export const metadata = {
  title: "Trip Receipts — Wander Women",
  description:
    "Real itineraries with rupee + USD costs. Receipts, not inspiration.",
};

type Trip = Parameters<typeof ReceiptsClient>[0]["trips"][number];

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
  const supabase = await createClient();

  // Approved DB-submitted trips augment the mock seed feed.
  const { data: dbTrips } = await supabase
    .from("trip_submissions")
    .select(
      "id, contributor_slug, destination_slug, destination, trip_start, trip_end, day_count, total_cost_inr, total_cost_usd, cost_stay, cost_food, cost_transport, cost_activities, cost_misc, top_notes, highlight",
    )
    .eq("status", "approved")
    .order("created_at", { ascending: false });

  const dbNormalized: Trip[] = (dbTrips ?? []).map((t) => ({
    id:              t.id,
    contributorSlug: t.contributor_slug ?? "",
    destinationSlug: t.destination_slug,
    destination:     t.destination,
    tripDates:       { start: t.trip_start, end: t.trip_end },
    dayCount:        t.day_count,
    totalCostInr:    t.total_cost_inr,
    totalCostUsd:    t.total_cost_usd,
    costBreakdown: {
      stay:       t.cost_stay,
      food:       t.cost_food,
      transport:  t.cost_transport,
      activities: t.cost_activities,
      misc:       t.cost_misc,
    },
    topNotes:  Array.isArray(t.top_notes) ? (t.top_notes as string[]) : [],
    highlight: t.highlight,
  }));

  const allTrips: Trip[] = [
    ...(tripFeed as unknown as Trip[]),
    ...dbNormalized,
  ];

  const destCounts = new Map<string, number>();
  for (const t of allTrips) {
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
          {allTrips.length} real solo trips, every rupee tracked. Receipts, not
          Pinterest aspirations.
        </p>
      </div>

      <ReceiptsClient
        trips={allTrips}
        contributors={contributors}
        destinations={destinations}
        initialDestination={initialDestination}
      />
    </div>
  );
}
