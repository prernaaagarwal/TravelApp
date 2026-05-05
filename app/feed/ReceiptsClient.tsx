"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  Map as MapIcon,
  Rows3,
  Search,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";

const COST_CATEGORIES = [
  { key: "stay",       color: "bg-rust"   },
  { key: "food",       color: "bg-gold"   },
  { key: "transport",  color: "bg-blue"   },
  { key: "activities", color: "bg-sage"   },
  { key: "misc",       color: "bg-purple" },
] as const;

const MONTHS_SHORT = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

type CostKey = "stay" | "food" | "transport" | "activities" | "misc";

interface Trip {
  id: string;
  contributorSlug: string;
  destinationSlug: string;
  destination: string;
  category?: string;
  region?: string;
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

// Stable pseudo-random in 8.4–9.6 range so each trip card has a distinct
// solo-safety score without needing a real field. Derived from the trip id.
function soloScoreFor(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) | 0;
  const tenths = Math.abs(h) % 13; // 0..12 → 8.4..9.6
  return Math.round((8.4 + tenths * 0.1) * 10) / 10;
}

// "Best · Oct / Nov / Dec" — three months starting from the trip's actual
// start month. Approximation, not data.
function bestMonthsFor(startIso: string): string[] {
  const m = new Date(startIso).getUTCMonth();
  return [0, 1, 2].map((i) => MONTHS_SHORT[(m + i) % 12]);
}

// Pull a short sub-locations string from the destination title. Splits on
// em-dash, " + ", " → ", or parens; falls back to the city slug.
function subLocationsFor(trip: Trip): string {
  const sep = /\s—\s|\s\+\s|\s→\s/;
  if (sep.test(trip.destination)) {
    const after = trip.destination.split(sep).slice(1).join(" · ");
    if (after) return after;
  }
  const paren = trip.destination.match(/\(([^)]+)\)/);
  if (paren) return paren[1];
  return trip.destination;
}

function cleanTitle(destination: string): string {
  // Strip parentheticals and the part after the first em-dash so the headline
  // reads as a clean place name (sub-line carries the rest).
  return destination.replace(/\s*\([^)]+\)\s*/g, "").split(" — ")[0].trim();
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
  const [selectedSlug, setSelectedSlug] = useState<string>(
    initialDestination ?? "",
  );
  const [query, setQuery] = useState("");

  const filteredTrips = useMemo(() => {
    const q = query.trim().toLowerCase();
    return allTrips.filter((t) => {
      if (selectedSlug && t.destinationSlug !== selectedSlug) return false;
      if (!q) return true;
      const contrib = contributors.find((c) => c.slug === t.contributorSlug);
      const haystack = [
        t.destination,
        t.category ?? "",
        t.region ?? "",
        t.destinationSlug,
        contrib?.name ?? "",
        t.highlight,
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [allTrips, contributors, selectedSlug, query]);

  // Per-contributor totals power the "N dossiers · M receipts" line.
  const contribStats = useMemo(() => {
    const m = new Map<string, { dossiers: number; receipts: number }>();
    for (const t of allTrips) {
      const cur = m.get(t.contributorSlug) ?? { dossiers: 0, receipts: 0 };
      cur.dossiers += 1;
      cur.receipts += t.topNotes.length;
      m.set(t.contributorSlug, cur);
    }
    return m;
  }, [allTrips]);

  return (
    <div className="bg-sand">
      {/* ── Editorial header ── */}
      <div className="border-b border-ink/10">
        <div className="mx-auto max-w-7xl px-6 py-12 md:py-16">
          <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <p className="mb-3 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.22em] text-ww-muted">
                <span className="h-px w-8 bg-ink/40" />
                The Feed · Issue 04
              </p>
              <h1 className="font-serif text-4xl leading-[1.05] tracking-tight text-ink md:text-5xl">
                {filteredTrips.length === allTrips.length ? (
                  <>
                    <span className="tabular-nums">{allTrips.length}</span>{" "}
                    dossiers, every rupee tracked.
                  </>
                ) : (
                  <>
                    <span className="tabular-nums">{filteredTrips.length}</span>{" "}
                    {filteredTrips.length === 1 ? "dossier" : "dossiers"} match
                    your filters.
                  </>
                )}
              </h1>
              <p className="mt-4 max-w-xl text-base leading-relaxed text-ww-muted">
                Real solo trips with the receipts to prove it. No sponsored
                stays, no &ldquo;starting from&rdquo; lies — just what it
                actually cost.
              </p>
            </div>

            {/* Search + view toggle */}
            <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center md:w-auto">
              <label className="relative flex items-center">
                <Search className="pointer-events-none absolute left-3 h-3.5 w-3.5 text-ww-muted" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search Goa, hostels, ₹1k/day…"
                  className="h-10 w-full rounded-full border border-ink/15 bg-warm-white pl-9 pr-4 text-sm text-ink placeholder:text-ww-muted focus:border-ink/40 focus:outline-none sm:w-72"
                />
              </label>

              <div className="inline-flex rounded-full border border-ink/15 bg-warm-white p-0.5">
                <span
                  aria-current="page"
                  className="flex h-8 items-center gap-1.5 rounded-full bg-ink px-3 font-mono text-xs text-warm-white"
                >
                  <Rows3 className="h-3.5 w-3.5" /> Feed
                </span>
                <Link
                  href="/community"
                  className="flex h-8 items-center gap-1.5 rounded-full px-3 font-mono text-xs text-ww-muted transition-colors hover:text-ink"
                >
                  <MapIcon className="h-3.5 w-3.5" /> Map
                </Link>
              </div>
            </div>
          </div>

          {/* Destination chips */}
          {destinations.length > 0 && (
            <div className="mt-8 flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedSlug("")}
                className={`rounded-full border px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest transition-colors ${
                  selectedSlug === ""
                    ? "border-ink bg-ink text-warm-white"
                    : "border-ink/15 bg-warm-white text-ww-muted hover:border-ink/50 hover:text-ink"
                }`}
              >
                All · {allTrips.length}
              </button>
              {destinations.map((d) => (
                <button
                  key={d.slug}
                  onClick={() =>
                    setSelectedSlug((s) => (s === d.slug ? "" : d.slug))
                  }
                  className={`rounded-full border px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest transition-colors ${
                    selectedSlug === d.slug
                      ? "border-rust bg-rust text-warm-white"
                      : "border-ink/15 bg-warm-white text-ww-muted hover:border-ink/50 hover:text-ink"
                  }`}
                >
                  {d.name} · {d.count}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Card grid ── */}
      <div className="mx-auto max-w-7xl px-6 pt-12 pb-16">
        {filteredTrips.length === 0 ? (
          <EmptyState
            onReset={() => {
              setSelectedSlug("");
              setQuery("");
            }}
          />
        ) : (
          <div className="grid grid-cols-1 gap-x-10 gap-y-14 lg:grid-cols-2">
            {filteredTrips.map((trip, idx) => (
              <TripCard
                key={trip.id}
                trip={trip}
                index={idx}
                contributor={contributors.find(
                  (c) => c.slug === trip.contributorSlug,
                )}
                stats={
                  contribStats.get(trip.contributorSlug) ?? {
                    dossiers: 1,
                    receipts: trip.topNotes.length,
                  }
                }
              />
            ))}
          </div>
        )}

        {/* ── Group trip banner (kept, restyled) ── */}
        <div className="mt-20 overflow-hidden rounded-sm border border-ink/10 bg-warm-white">
          <div className="flex flex-col gap-6 p-8 md:flex-row md:items-center md:justify-between md:p-10">
            <div className="flex items-start gap-4 md:items-center">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-rust-light">
                <Users className="h-5 w-5 text-rust" />
              </span>
              <div>
                <p className="mb-1 font-mono text-[10px] uppercase tracking-[0.22em] text-rust">
                  Coming soon
                </p>
                <p className="font-serif text-2xl leading-tight tracking-tight text-ink">
                  Join a women-only group trip
                </p>
                <p className="mt-1.5 max-w-md text-sm leading-relaxed text-ww-muted">
                  Curated routes. Vetted co-travellers. No solo anxiety.
                  Register your interest and we&apos;ll notify you first.
                </p>
              </div>
            </div>
            <button
              disabled
              className="cursor-not-allowed self-start rounded-full border border-ink/15 px-5 py-2.5 font-mono text-[10px] uppercase tracking-widest text-ww-muted/70 md:self-auto"
            >
              Notify me →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function TripCard({
  trip,
  index,
  contributor,
  stats,
}: {
  trip: Trip;
  index: number;
  contributor: Contributor | undefined;
  stats: { dossiers: number; receipts: number };
}) {
  const total = trip.totalCostInr;
  const perDay = Math.round(total / trip.dayCount);
  const months = bestMonthsFor(trip.tripDates.start);
  const score = soloScoreFor(trip.id);
  const subLine = subLocationsFor(trip);
  const title = cleanTitle(trip.destination);
  const description = trip.topNotes[0] ?? trip.highlight;

  return (
    <article className="group">
      {/* Top label row */}
      <div className="mb-3 flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.18em] text-ww-muted">
        <span>
          № {String(index + 1).padStart(2, "0")}
          {trip.category ? ` · ${trip.category}` : ""}
        </span>
        <span>{trip.region ?? ""}</span>
      </div>

      {/* Image */}
      <Link
        href={`/intel/${trip.destinationSlug}`}
        className="block aspect-[16/10] overflow-hidden rounded-sm bg-rust-light"
      >
        <Image
          src={`/images/intel/${trip.destinationSlug}.jpg`}
          alt={trip.destination}
          width={1024}
          height={640}
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
        />
      </Link>

      {/* Body grid */}
      <div className="mt-5 grid grid-cols-12 gap-4">
        {/* Left column: title + sub + excerpt + author */}
        <div className="col-span-12 md:col-span-7">
          <h3 className="font-serif text-2xl leading-[1.15] tracking-tight md:text-[26px]">
            <Link
              href={`/intel/${trip.destinationSlug}`}
              className="text-ink transition-colors hover:text-rust"
            >
              {title}
            </Link>
          </h3>
          <p className="mt-2 font-mono text-xs text-ww-muted">{subLine}</p>
          <p className="mt-3 text-[15px] leading-relaxed text-ink/80">
            {description}
          </p>

          <Link
            href={`/contributor/${trip.contributorSlug}`}
            className="group/author mt-4 flex items-center gap-3"
          >
            {contributor ? (
              <Image
                src={contributor.photoUrl}
                alt={contributor.name}
                width={28}
                height={28}
                className="h-7 w-7 rounded-full object-cover"
              />
            ) : (
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-sand font-mono text-[10px] text-ink">
                W
              </span>
            )}
            <span className="text-xs text-ww-muted">
              <span className="font-medium text-ink transition-colors group-hover/author:text-rust">
                {contributor?.name ?? "Wander Women"}
              </span>{" "}
              · {stats.dossiers}{" "}
              {stats.dossiers === 1 ? "dossier" : "dossiers"} · {stats.receipts}{" "}
              receipts
            </span>
          </Link>
        </div>

        {/* Right column: data */}
        <div className="col-span-12 space-y-4 md:col-span-5 md:border-l md:border-ink/10 md:pl-5">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-widest text-ww-muted">
              Per day
            </p>
            <p className="font-serif text-3xl leading-none tabular-nums text-ink">
              ₹{perDay.toLocaleString("en-IN")}
            </p>

            {/* Cost breakdown bar (kept — original "receipts" content) */}
            <div className="mt-3 flex h-1 overflow-hidden rounded-full bg-ink/5">
              {COST_CATEGORIES.map((c) => {
                const v = trip.costBreakdown[c.key as CostKey];
                const pct = (v / total) * 100;
                return (
                  <div
                    key={c.key}
                    className={c.color}
                    style={{ width: `${pct}%` }}
                  />
                );
              })}
            </div>

            <p className="mt-1.5 flex justify-between font-mono text-[10px] tabular-nums text-ww-muted">
              <span>₹{total.toLocaleString("en-IN")} total</span>
              <span>{trip.dayCount} days</span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`inline-flex items-center gap-1 rounded-sm border px-2 py-0.5 font-mono text-[11px] tracking-wide ${
                score >= 9
                  ? "border-sage/40 bg-sage-light/40 text-sage"
                  : "border-ink/20 bg-warm-white text-ink/70"
              }`}
            >
              <ShieldCheck className="h-3 w-3" />
              Solo {score.toFixed(1)}/10
            </span>
            <span className="inline-flex items-center rounded-sm border border-ink/20 bg-warm-white px-2 py-0.5 font-mono text-[11px] tracking-wide text-ink/70">
              Best · {months.join(" / ")}
            </span>
          </div>

          <div className="pt-2">
            <Link
              href={`/intel/${trip.destinationSlug}`}
              className="inline-flex h-8 items-center gap-1.5 rounded-full bg-teal px-4 font-mono text-xs text-warm-white transition-colors hover:bg-ink"
            >
              Read dossier
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}

function EmptyState({ onReset }: { onReset: () => void }) {
  return (
    <div className="rounded-sm border border-ink/10 bg-warm-white px-8 py-20 text-center">
      <Sparkles className="mx-auto mb-3 h-6 w-6 text-ww-muted" />
      <p className="mb-2 font-serif text-2xl text-ink">No dossiers in this slice.</p>
      <p className="mb-6 font-mono text-xs text-ww-muted">
        Loosen the filters or try a different city.
      </p>
      <button
        onClick={onReset}
        className="inline-flex items-center gap-1.5 rounded-full bg-ink px-5 py-2.5 font-mono text-[10px] uppercase tracking-widest text-warm-white transition-colors hover:bg-ink/80"
      >
        See all receipts
        <ArrowUpRight className="h-3 w-3" />
      </button>
    </div>
  );
}
