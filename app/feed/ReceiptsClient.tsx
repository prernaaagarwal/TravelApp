"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronDown, Users } from "lucide-react";

const COST_CATEGORIES = [
  { key: "stay",       label: "Stay",       color: "bg-rust"   },
  { key: "food",       label: "Food",       color: "bg-gold"   },
  { key: "transport",  label: "Transport",  color: "bg-blue"   },
  { key: "activities", label: "Activities", color: "bg-sage"   },
  { key: "misc",       label: "Misc",       color: "bg-purple" },
] as const;

type CostKey = "stay" | "food" | "transport" | "activities" | "misc";

interface Trip {
  id: string;
  contributorSlug: string;
  destinationSlug: string;
  destination: string;
  tripDates: { start: string; end: string };
  dayCount: number;
  totalCostInr: number;
  totalCostUsd: number;
  costBreakdown: Record<CostKey, number>;
  topNotes: string[];
  highlight: string;
}

interface Contributor {
  slug: string;
  name: string;
  photoUrl: string;
  [key: string]: unknown;
}

interface Destination {
  slug: string;
  name: string;
  count: number;
}

export function ReceiptsClient({
  trips: allTrips,
  contributors,
  destinations,
  initialDestination,
}: {
  trips: Trip[];
  contributors: Contributor[];
  destinations: Destination[];
  initialDestination?: string;
}) {
  const [selectedSlugs, setSelectedSlugs] = useState<Set<string>>(
    initialDestination ? new Set([initialDestination]) : new Set(),
  );
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredTrips =
    selectedSlugs.size === 0
      ? allTrips
      : allTrips.filter((t) => selectedSlugs.has(t.destinationSlug));

  const toggleSlug = (slug: string) => {
    setSelectedSlugs((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      return next;
    });
  };

  const filterLabel =
    selectedSlugs.size === 0
      ? "All destinations"
      : selectedSlugs.size === 1
        ? (destinations.find((d) => selectedSlugs.has(d.slug))?.name ??
          "1 selected")
        : `${selectedSlugs.size} destinations`;

  return (
    <>
      {/* ── Multiselect filter ── */}
      <div className="relative mb-8" ref={dropdownRef}>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setDropdownOpen((o) => !o)}
            aria-haspopup="listbox"
            aria-expanded={dropdownOpen}
            className={`flex items-center gap-2 border px-4 py-2.5 font-mono text-xs uppercase tracking-widest transition-colors ${
              dropdownOpen
                ? "border-ink bg-ink text-warm-white"
                : "border-ww-border bg-sand text-ink hover:border-ink"
            }`}
          >
            <ChevronDown
              className={`h-3 w-3 shrink-0 transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
            />
            {filterLabel}
            {selectedSlugs.size > 0 && (
              <span className="ml-1 flex h-4 w-4 items-center justify-center rounded-full bg-rust text-[9px] text-warm-white">
                {selectedSlugs.size}
              </span>
            )}
          </button>

          {selectedSlugs.size > 0 && (
            <button
              onClick={() => setSelectedSlugs(new Set())}
              className="font-mono text-[10px] uppercase tracking-widest text-ww-muted transition-colors hover:text-rust"
            >
              Clear
            </button>
          )}

          <span className="ml-auto font-mono text-[10px] text-ww-muted">
            {filteredTrips.length}{" "}
            {filteredTrips.length === 1 ? "trip" : "trips"}
          </span>
        </div>

        {dropdownOpen && (
          <div
            role="listbox"
            aria-multiselectable="true"
            className="absolute left-0 top-full z-20 mt-1 w-64 border border-ww-border bg-warm-white shadow-md"
          >
            {/* All option */}
            <button
              role="option"
              aria-selected={selectedSlugs.size === 0}
              onClick={() => {
                setSelectedSlugs(new Set());
                setDropdownOpen(false);
              }}
              className="flex w-full items-center gap-3 border-b border-ww-border px-4 py-3 text-left font-mono text-[10px] uppercase tracking-widest transition-colors hover:bg-sand"
            >
              <span
                className={`h-3.5 w-3.5 shrink-0 border transition-colors ${
                  selectedSlugs.size === 0
                    ? "border-ink bg-ink"
                    : "border-ww-border"
                }`}
              />
              <span
                className={
                  selectedSlugs.size === 0 ? "text-ink" : "text-ww-muted"
                }
              >
                All destinations
              </span>
              <span className="ml-auto font-mono text-[10px] text-ww-muted">
                {allTrips.length}
              </span>
            </button>

            {destinations.map((d) => (
              <button
                key={d.slug}
                role="option"
                aria-selected={selectedSlugs.has(d.slug)}
                onClick={() => toggleSlug(d.slug)}
                className="flex w-full items-center gap-3 px-4 py-2.5 text-left font-mono text-[10px] uppercase tracking-widest transition-colors hover:bg-sand"
              >
                <span
                  className={`h-3.5 w-3.5 shrink-0 border transition-colors ${
                    selectedSlugs.has(d.slug)
                      ? "border-rust bg-rust"
                      : "border-ww-border"
                  }`}
                />
                <span
                  className={
                    selectedSlugs.has(d.slug) ? "text-ink" : "text-ww-muted"
                  }
                >
                  {d.name}
                </span>
                <span className="ml-auto text-ww-muted">{d.count}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── Trip cards ── */}
      <div className="space-y-8">
        {filteredTrips.map((trip) => {
          const contrib = contributors.find(
            (c) => c.slug === trip.contributorSlug,
          );
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
                      {Math.round(total / trip.dayCount).toLocaleString(
                        "en-IN",
                      )}
                      /day
                    </p>
                  </div>
                </div>

                {/* cost breakdown bar */}
                <div className="mb-3">
                  <div className="flex h-2 overflow-hidden">
                    {COST_CATEGORIES.map((c) => {
                      const v = trip.costBreakdown[c.key as CostKey];
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
                      const v = trip.costBreakdown[c.key as CostKey];
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

                {/* footer: contributor + plan CTA */}
                <div className="mt-4 flex items-center justify-between border-t border-ww-border pt-4">
                  <div className="flex items-center gap-2">
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
                      className="font-mono text-[10px] text-ww-muted transition-colors hover:text-rust"
                    >
                      by {contrib?.name ?? "Wander Women"}
                    </Link>
                  </div>

                  <button
                    disabled
                    className="flex cursor-not-allowed items-center gap-2 border border-ww-border px-3 py-1.5 font-mono text-[10px] text-ww-muted"
                    title="Coming soon"
                  >
                    Help me plan my trip
                    <span className="rounded bg-ww-border/60 px-1.5 py-0.5 text-[8px] uppercase tracking-widest text-ink/60">
                      Coming soon
                    </span>
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* Empty state */}
      {filteredTrips.length === 0 && (
        <div className="border border-ww-border bg-sand p-10 text-center">
          <p className="mb-2 font-serif text-xl text-ink">
            No receipts here yet.
          </p>
          <p className="mb-5 font-mono text-xs text-ww-muted">
            Be the first — share your trip costs and help future travellers.
          </p>
          <button
            onClick={() => setSelectedSlugs(new Set())}
            className="inline-block border border-ink bg-ink px-5 py-2 font-mono text-[10px] uppercase tracking-widest text-warm-white transition-colors hover:bg-ink/80"
          >
            See all receipts →
          </button>
        </div>
      )}

      {/* ── Group trip banner ── */}
      <div className="mt-16 border border-ww-border bg-rust-light/20 p-8 text-center">
        <div className="mb-3 flex justify-center">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-rust-light">
            <Users className="h-5 w-5 text-rust" />
          </span>
        </div>
        <p className="mb-1 font-mono text-[10px] uppercase tracking-[0.2em] text-rust">
          Coming soon
        </p>
        <p className="font-serif text-2xl text-ink">
          Join a women-only group trip
        </p>
        <p className="mx-auto mt-2 max-w-sm font-mono text-xs leading-relaxed text-ww-muted">
          Curated routes. Vetted co-travellers. No solo anxiety. Register your
          interest and we&apos;ll notify you first.
        </p>
        <button
          disabled
          className="mt-5 cursor-not-allowed border border-ww-border/50 px-6 py-2.5 font-mono text-[10px] uppercase tracking-widest text-ww-muted/50"
        >
          Notify me →
        </button>
      </div>
    </>
  );
}
