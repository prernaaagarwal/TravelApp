import Link from "next/link";
import Image from "next/image";
import tripFeed from "@/lib/mock-data/trip-feed.json";
import contributors from "@/lib/mock-data/contributors.json";

export const metadata = {
  title: "Trip Feed — Wander Women",
  description:
    "Real itineraries with rupee + USD costs. Receipts, not inspiration.",
};

export default function FeedPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <div className="mb-10">
        <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-ww-muted">
          Trip receipts
        </p>
        <h1 className="mb-3 font-serif text-4xl text-ink md:text-5xl">
          What it actually cost.
        </h1>
        <p className="font-mono text-sm leading-relaxed text-ww-muted">
          Twelve real solo trips, every rupee tracked. Receipts, not Pinterest
          aspirations.
        </p>
      </div>

      <div className="space-y-8">
        {tripFeed.map((trip) => {
          const contrib = contributors.find(
            (c) => c.slug === trip.contributorSlug
          );
          const total = trip.totalCostInr;
          const cats = [
            { key: "stay", label: "Stay", color: "bg-rust" },
            { key: "food", label: "Food", color: "bg-gold" },
            { key: "transport", label: "Transport", color: "bg-blue" },
            { key: "activities", label: "Activities", color: "bg-sage" },
            { key: "misc", label: "Misc", color: "bg-purple" },
          ] as const;

          return (
            <article
              key={trip.id}
              className="border border-ww-border bg-sand"
            >
              {/* photo collage */}
              <div className="grid h-48 grid-cols-3 gap-0.5 overflow-hidden bg-ww-border">
                {trip.photoUrls.slice(0, 3).map((url, i) => (
                  <div key={i} className="relative overflow-hidden">
                    <Image
                      src={url}
                      alt={`${trip.destination} photo ${i + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>

              <div className="p-5">
                {/* header */}
                <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <Link
                      href={`/intel/${trip.destinationSlug}`}
                      className="font-serif text-2xl text-ink hover:text-rust transition-colors"
                    >
                      {trip.destination}
                    </Link>
                    <p className="mt-1 font-mono text-[10px] text-ww-muted">
                      {trip.tripDates.start} → {trip.tripDates.end} ·{" "}
                      {trip.dayCount} days
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-serif text-2xl font-light text-ink">
                      ₹{total.toLocaleString("en-IN")}
                    </p>
                    <p className="font-mono text-[10px] text-ww-muted">
                      ${trip.totalCostUsd} · ₹
                      {Math.round(total / trip.dayCount).toLocaleString("en-IN")}/day
                    </p>
                  </div>
                </div>

                {/* cost breakdown bar */}
                <div className="mb-3">
                  <div className="flex h-2 overflow-hidden">
                    {cats.map((c) => {
                      const v =
                        trip.costBreakdown[
                          c.key as keyof typeof trip.costBreakdown
                        ];
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
                    {cats.map((c) => {
                      const v =
                        trip.costBreakdown[
                          c.key as keyof typeof trip.costBreakdown
                        ];
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
                    <li
                      key={i}
                      className="flex gap-2 text-xs leading-relaxed text-ink"
                    >
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
                  {contrib && (
                    <Image
                      src={contrib.photoUrl}
                      alt={contrib.name}
                      width={24}
                      height={24}
                      className="h-6 w-6 rounded-full object-cover"
                    />
                  )}
                  <Link
                    href={`/contributor/${trip.contributorSlug}`}
                    className="font-mono text-[10px] text-ww-muted hover:text-rust transition-colors"
                  >
                    by {contrib?.name ?? "Wander Women"}
                  </Link>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
