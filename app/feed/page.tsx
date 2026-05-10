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

  const initialDestination =
    destination && destCounts.has(destination.trim())
      ? destination.trim()
      : undefined;

  // Fetch safety ratings per destination
  const { data: hoodData } = await supabase
    .from("neighborhood_safety")
    .select("destination_slug, safety_rating");

  const safetyByDestination: Record<string, { avg: number; count: number }> = {};
  for (const row of hoodData ?? []) {
    const slug = row.destination_slug as string;
    const rating = row.safety_rating as number;
    if (!safetyByDestination[slug]) {
      safetyByDestination[slug] = { avg: 0, count: 0 };
    }
    const entry = safetyByDestination[slug];
    entry.avg = (entry.avg * entry.count + rating) / (entry.count + 1);
    entry.count += 1;
  }

  return (
    <ReceiptsClient
      trips={allTrips}
      contributors={contributors}
      destinations={destinations}
      initialDestination={initialDestination}
      safetyByDestination={safetyByDestination}
    />
  );
}
