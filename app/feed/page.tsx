import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

type SearchParams = Promise<{ destination?: string; submitted?: string }>;

const COST_CATEGORIES = [
  { key: "stay",       label: "Stay",       color: "bg-rust"   },
  { key: "food",       label: "Food",       color: "bg-gold"   },
  { key: "transport",  label: "Transport",  color: "bg-blue"   },
  { key: "activities", label: "Activities", color: "bg-sage"   },
  { key: "misc",       label: "Misc",       color: "bg-purple" },
] as const;

function cityFromSlug(slug: string): string {
  const parts = slug.split("-");
  parts.pop();
  return parts.map((p) => p.charAt(0).toUpperCase() + p.slice(1)).join(" ");
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { destination } = await searchParams;
  const slug = destination?.trim() ?? "";
  if (slug) {
    const city = cityFromSlug(slug);
    return {
      title: `${city} Trip Costs — Wander Women`,
      description: `Real budgets from solo women's trips to ${city}. Every rupee tracked.`,
    };
  }
  return {
    title: "Trip Receipts — Wander Women",
    description: "Real itineraries with rupee + USD costs. Receipts, not inspiration.",
  };
}

export default async function FeedPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { destination, submitted } = await searchParams;

  const supabase = await createClient();
  const [{ data: rows }, { data: contribs }] = await Promise.all([
    supabase
      .from("trip_submissions")
      .select(
        "id,destination_slug,destination,trip_start,trip_end,day_count,total_cost_inr,total_cost_usd,cost_stay,cost_food,cost_transport,cost_activities,cost_misc,top_notes,highlight,contributor_slug"
      )
      .eq("status", "approved")
      .order("created_at", { ascending: false }),
    supabase.from("contributors").select("slug,name,photo_url"),
  ]);

  const tripFeed = (rows ?? []).map((r) => ({
    id:              r.id as string,
    destinationSlug: r.destination_slug as string,
    destination:     r.destination as string,
    tripDates:       { start: r.trip_start as string, end: r.trip_end as string },
    dayCount:        r.day_count as number,
    totalCostInr:    r.total_cost_inr as number,
    totalCostUsd:    r.total_cost_usd as number,
    costBreakdown: {
      stay:       r.cost_stay       as number,
      food:       r.cost_food       as number,
      transport:  r.cost_transport  as number,
      activities: r.cost_activities as number,
      misc:       r.cost_misc       as number,
    },
    topNotes:       r.top_notes       as string[],
    highlight:      r.highlight       as string,
    contributorSlug: r.contributor_slug as string | null,
  }));

  const contributorMap = new Map(
    (contribs ?? []).map((c) => [c.slug as string, c])
  );

  // Build destination chip list
  const destCounts = new Map<string, number>();
  for (const t of tripFeed) {
    destCounts.set(t.destinationSlug, (destCounts.get(t.destinationSlug) ?? 0) + 1);
  }
  const destinations = [...destCounts.entries()]
    .map(([slug, count]) => ({ slug, name: cityFromSlug(slug), count }))
    .sort((a, b) => a.name.localeCompare(b.name));

  const requestedSlug  = destination?.trim() ?? "";
  const activeSlug     = destCounts.has(requestedSlug) ? requestedSlug : null;
  const requestedNoMatch = requestedSlug.length > 0 && activeSlug === null;

  const trips = activeSlug
    ? tripFeed.filter((t) => t.destinationSlug === activeSlug)
    : tripFeed;

  const headerTitle = activeSlug
    ? `What it cost in ${cityFromSlug(activeSlug)}.`
    : requestedNoMatch
      ? `No receipts for ${cityFromSlug(requestedSlug)} yet.`
      : "What it actually cost.";

  const headerSub = activeSlug
    ? `${trips.length} real ${trips.length === 1 ? "trip" : "trips"} to ${cityFromSlug(activeSlug)}, every rupee tracked.`
    : requestedNoMatch
      ? `No one has logged a ${cityFromSlug(requestedSlug)} trip yet — showing all receipts below. Be the first to submit yours.`
      : `${tripFeed.length} real solo trips, every rupee tracked. Receipts, not Pinterest aspirations.`;

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">

      {/* Submission success banner */}
      {submitted === "trip" && (
        <div className="mb-6 border border-sage/40 bg-sage-light/30 px-4 py-3 font-mono text-xs text-sage">
          Receipt submitted — it will appear once approved. Thank you!
        </div>
      )}

      <div className="mb-8">
        <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-ww-muted">
          Trip receipts
        </p>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="mb-3 font-serif text-4xl text-ink md:text-5xl">
              {headerTitle}
            </h1>
            <p className="font-mono text-sm leading-relaxed text-ww-muted">
              {headerSub}
            </p>
          </div>
          <Link
            href="/feed/submit"
            className="shrink-0 border border-ink bg-ink px-4 py-2 font-mono text-[10px] uppercase tracking-widest text-warm-white transition-colors hover:bg-ink/80"
          >
            + Submit yours
          </Link>
        </div>
      </div>

      {/* Filter chips */}
      <div className="mb-8 flex flex-wrap items-center gap-2">
        <Link
          href="/feed"
          aria-current={!activeSlug ? "page" : undefined}
          className={`border px-4 py-1.5 font-mono text-xs uppercase tracking-widest transition-colors ${
            !activeSlug
              ? "border-ink bg-ink text-warm-white"
              : "border-ww-border bg-sand text-ww-muted hover:border-ink hover:text-ink"
          }`}
        >
          All
        </Link>
        {destinations.map((d) => (
          <Link
            key={d.slug}
            href={`/feed?destination=${d.slug}`}
            aria-current={activeSlug === d.slug ? "page" : undefined}
            className={`border px-4 py-1.5 font-mono text-xs uppercase tracking-widest transition-colors ${
              activeSlug === d.slug
                ? "border-ink bg-ink text-warm-white"
                : "border-ww-border bg-sand text-ww-muted hover:border-ink hover:text-ink"
            }`}
          >
            {d.name}
            {d.count > 1 ? ` (${d.count})` : ""}
          </Link>
        ))}
        <span className="ml-auto self-center font-mono text-[10px] text-ww-muted">
          {trips.length} {trips.length === 1 ? "trip" : "trips"}
        </span>
      </div>

      {/* Trip cards */}
      <div className="space-y-8">
        {trips.map((trip) => {
          const contrib = trip.contributorSlug
            ? contributorMap.get(trip.contributorSlug)
            : undefined;
          const total = trip.totalCostInr;

          return (
            <article key={trip.id} className="border border-ww-border bg-sand">
              <div className="relative h-56 overflow-hidden bg-rust-light">
                <Image
                  src={`/images/intel/${trip.destinationSlug}.jpg`}
                  alt={trip.destination}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/40 to-transparent" />
              </div>

              <div className="p-5">
                {/* header */}
                <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <Link
                      href={`/intel/${trip.destinationSlug}`}
                      className="font-serif text-2xl text-ink transition-colors hover:text-rust"
                    >
                      {trip.destination}
                    </Link>
                    <p className="mt-1 font-mono text-[10px] text-ww-muted">
                      {trip.tripDates.start} → {trip.tripDates.end} · {trip.dayCount} days
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-serif text-2xl font-light text-ink">
                      ₹{total.toLocaleString("en-IN")}
                    </p>
                    <p className="font-mono text-[10px] text-ww-muted">
                      ${trip.totalCostUsd} · ₹{Math.round(total / trip.dayCount).toLocaleString("en-IN")}/day
                    </p>
                  </div>
                </div>

                {/* cost breakdown bar */}
                <div className="mb-3">
                  <div className="flex h-2 overflow-hidden">
                    {COST_CATEGORIES.map((c) => {
                      const v = trip.costBreakdown[c.key as keyof typeof trip.costBreakdown];
                      const pct = (v / total) * 100;
                      return (
                        <div
                          key={c.key}
                          className={c.color}
                          style={{ width: `${pct}%` }}
                          title={`${c.label}: ₹${v.toLocaleString("en-IN")}`}
                        />
                      );
                    })}
                  </div>
                  <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 font-mono text-[10px] text-ww-muted">
                    {COST_CATEGORIES.map((c) => {
                      const v = trip.costBreakdown[c.key as keyof typeof trip.costBreakdown];
                      return (
                        <span key={c.key} className="flex items-center gap-1.5">
                          <span className={`h-1.5 w-1.5 ${c.color}`} />
                          {c.label} ₹{v.toLocaleString("en-IN")}
                        </span>
                      );
                    })}
                  </div>
                </div>

                {/* top notes */}
                <ul className="my-4 space-y-2 border-t border-ww-border pt-4">
                  {trip.topNotes.map((note, i) => (
                    <li key={i} className="flex gap-2 text-xs leading-relaxed text-ink">
                      <span className="shrink-0 text-rust">→</span>
                      {note}
                    </li>
                  ))}
                </ul>

                {/* highlight quote */}
                <blockquote className="border-l-2 border-gold bg-gold-light/30 p-3 font-serif text-sm italic text-ink">
                  &ldquo;{trip.highlight}&rdquo;
                </blockquote>

                {/* contributor footer */}
                <div className="mt-4 flex items-center gap-2 border-t border-ww-border pt-4">
                  {contrib?.photo_url && (
                    <Image
                      src={contrib.photo_url as string}
                      alt={contrib.name as string}
                      width={24}
                      height={24}
                      className="h-6 w-6 rounded-full object-cover"
                    />
                  )}
                  {contrib ? (
                    <Link
                      href={`/contributor/${trip.contributorSlug}`}
                      className="font-mono text-[10px] text-ww-muted transition-colors hover:text-rust"
                    >
                      by {contrib.name as string}
                    </Link>
                  ) : (
                    <span className="font-mono text-[10px] text-ww-muted">
                      by Wander Women community
                    </span>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {trips.length === 0 && (
        <div className="border border-ww-border bg-sand p-10 text-center">
          <p className="mb-2 font-serif text-xl text-ink">No receipts here yet.</p>
          <p className="mb-5 font-mono text-xs text-ww-muted">
            Be the first — share your trip costs and help future travellers.
          </p>
          <Link
            href="/feed"
            className="inline-block border border-ink bg-ink px-5 py-2 font-mono text-[10px] uppercase tracking-widest text-warm-white transition-colors hover:bg-ink/80"
          >
            See all receipts →
          </Link>
        </div>
      )}
    </div>
  );
}
