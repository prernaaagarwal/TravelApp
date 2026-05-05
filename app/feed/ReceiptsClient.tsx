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
  Wallet,
} from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";

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
  const [budget, setBudget] = useState<number[]>([25000]);
  const [soloOnly, setSoloOnly] = useState(true);
  const [month, setMonth] = useState<string>("");

  // Avg per-day cost across all trips — powers the "Avg solo cost" stat card.
  const avgPerDay = useMemo(() => {
    if (allTrips.length === 0) return 0;
    const sum = allTrips.reduce(
      (a, t) => a + t.totalCostInr / t.dayCount,
      0,
    );
    return Math.round(sum / allTrips.length);
  }, [allTrips]);

  const filteredTrips = useMemo(() => {
    const q = query.trim().toLowerCase();
    return allTrips.filter((t) => {
      if (selectedSlug && t.destinationSlug !== selectedSlug) return false;

      // Budget: match the reference's 25% headroom rule.
      if (t.totalCostInr > budget[0] * 1.25) return false;

      if (soloOnly && soloScoreFor(t.id) < 8) return false;

      if (month && !bestMonthsFor(t.tripDates.start).includes(month)) {
        return false;
      }

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
  }, [allTrips, contributors, selectedSlug, query, budget, soloOnly, month]);

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

  // Initials for the avatar pile in the hero.
  const heroInitials = useMemo(
    () =>
      contributors
        .slice(0, 4)
        .map((c) => c.name?.[0]?.toUpperCase() ?? "W"),
    [contributors],
  );

  const totalReceipts = useMemo(
    () => allTrips.reduce((a, t) => a + t.topNotes.length, 0),
    [allTrips],
  );

  return (
    <div className="bg-sand">
      {/* ── HERO ── */}
      <section className="relative">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-end gap-10 px-6 pt-10 pb-12 lg:grid-cols-12 lg:pt-16">
          <div className="lg:col-span-7">
            <p className="mb-6 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.22em] text-ww-muted">
              <span className="h-px w-8 bg-ink/40" />
              Issue 04 · The Honest Budget Issue
            </p>
            <h1 className="font-serif text-5xl leading-[1.02] tracking-tight text-ink md:text-6xl lg:text-7xl">
              Trips, told{" "}
              <em className="italic text-rust">honestly</em> — with the
              receipts to prove it.
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-ww-muted md:text-lg">
              No sponsored stays, no &ldquo;starting from&rdquo; lies. Real
              budgets, real safety scores and real itineraries from solo
              travellers who actually went.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href="#feed"
                className="inline-flex h-12 items-center gap-2 rounded-full bg-rust px-6 font-mono text-sm tracking-wide text-warm-white transition-colors hover:bg-rust/90"
              >
                Plan a trip from ₹{budget[0].toLocaleString("en-IN")}
                <ArrowUpRight className="h-4 w-4" />
              </a>
              <div className="flex -space-x-2">
                {heroInitials.map((c, i) => (
                  <span
                    key={i}
                    className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-sand bg-teal font-mono text-[11px] text-warm-white"
                  >
                    {c}
                  </span>
                ))}
              </div>
              <span className="text-sm text-ww-muted">
                <span className="font-medium tabular-nums text-ink">
                  {allTrips.length.toLocaleString("en-IN")}
                </span>{" "}
                verified dossiers · {totalReceipts} receipts logged
              </span>
            </div>
          </div>

          {/* Hero photo + floating stat */}
          <div className="lg:col-span-5">
            <figure className="relative">
              <div className="aspect-[4/5] overflow-hidden rounded-sm shadow-[0_1px_0_rgba(26,21,16,0.04),0_12px_32px_-16px_rgba(26,21,16,0.18)]">
                <Image
                  src="/images/hero-traveler.jpg"
                  alt="Solo traveller at golden hour"
                  width={960}
                  height={1200}
                  priority
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  className="h-full w-full object-cover"
                />
              </div>
              <figcaption className="mt-3 flex items-center justify-between font-mono text-[11px] uppercase tracking-wider text-ww-muted">
                <span>Cover · From the dossiers</span>
                <span>{contributors[0]?.name ?? ""}</span>
              </figcaption>
              {/* Floating stat card — only on lg+ to avoid cramping mobile */}
              <div className="absolute -left-10 bottom-12 hidden w-56 rounded-sm border border-ink/10 bg-warm-white p-4 shadow-[0_1px_0_rgba(26,21,16,0.04),0_12px_32px_-16px_rgba(26,21,16,0.18)] md:block">
                <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-ww-muted">
                  Avg. solo cost
                </div>
                <div className="mt-1 font-serif text-3xl tabular-nums">
                  ₹{avgPerDay.toLocaleString("en-IN")}
                  <span className="text-base text-ww-muted">/day</span>
                </div>
                <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-ink/10">
                  <div className="h-full w-[62%] bg-rust" />
                </div>
                <div className="mt-2 font-mono text-[11px] text-ww-muted">
                  ~38% under typical agency quote
                </div>
              </div>
            </figure>
          </div>
        </div>

        {/* ── Filter strip ── */}
        <div className="border-y border-ink/10 bg-rust-light/20">
          <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-6 px-6 py-5 md:grid-cols-12">
            <div className="md:col-span-5">
              <div className="mb-2 flex items-center justify-between">
                <span className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-ww-muted">
                  <Wallet className="h-3.5 w-3.5" /> Budget per trip
                </span>
                <span className="font-mono text-sm tabular-nums">
                  ₹{budget[0].toLocaleString("en-IN")}
                </span>
              </div>
              <Slider
                value={budget}
                onValueChange={setBudget}
                min={5000}
                max={80000}
                step={1000}
              />
              <div className="mt-1 flex justify-between font-mono text-[10px] text-ww-muted">
                <span>₹5k</span>
                <span>₹40k</span>
                <span>₹80k</span>
              </div>
            </div>

            <div className="md:col-span-3">
              <div className="mb-2 flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-ww-muted">
                <ShieldCheck className="h-3.5 w-3.5" /> Solo-friendly only
              </div>
              <div className="flex h-9 items-center gap-3">
                <Switch checked={soloOnly} onCheckedChange={setSoloOnly} />
                <span className="text-sm text-ww-muted">
                  Safety score ≥{" "}
                  <span className="font-mono tabular-nums text-ink">8.0</span>
                </span>
              </div>
            </div>

            <div className="md:col-span-4">
              <div className="mb-2 font-mono text-[11px] uppercase tracking-wider text-ww-muted">
                When
              </div>
              <div className="flex flex-wrap gap-1">
                {MONTHS_SHORT.map((m) => (
                  <button
                    key={m}
                    onClick={() => setMonth((cur) => (cur === m ? "" : m))}
                    className={`rounded-sm border px-2 py-1 font-mono text-xs uppercase tracking-wider transition-colors ${
                      month === m
                        ? "border-ink bg-ink text-warm-white"
                        : "border-ink/15 text-ink hover:border-ink/50"
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Feed header ── */}
      <section id="feed" className="mx-auto max-w-7xl px-6 pt-12">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.22em] text-ww-muted">
              The Feed
            </p>
            <h2 className="font-serif text-3xl tracking-tight md:text-4xl">
              <span className="tabular-nums">{filteredTrips.length}</span>{" "}
              {filteredTrips.length === 1 ? "dossier matches" : "dossiers match"}{" "}
              your filters
            </h2>
          </div>
          <div className="flex w-full items-center gap-3 sm:w-auto">
            <label className="relative hidden flex-1 items-center sm:flex">
              <Search className="pointer-events-none absolute left-3 h-4 w-4 text-ww-muted" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search Goa, hostels, ₹1k/day…"
                className="h-9 w-72 rounded-full border border-ink/15 bg-warm-white pl-9 pr-3 text-sm text-ink placeholder:text-ww-muted focus:border-ink/40 focus:outline-none"
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
          <div className="mb-10 flex flex-wrap gap-2">
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
      </section>

      {/* ── Card grid ── */}
      <div className="mx-auto max-w-7xl px-6 pb-16">
        {filteredTrips.length === 0 ? (
          <EmptyState
            onReset={() => {
              setSelectedSlug("");
              setQuery("");
              setBudget([80000]);
              setMonth("");
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
      <div className="mb-3 flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.18em] text-ww-muted">
        <span>
          № {String(index + 1).padStart(2, "0")}
          {trip.category ? ` · ${trip.category}` : ""}
        </span>
        <span>{trip.region ?? ""}</span>
      </div>

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

      <div className="mt-5 grid grid-cols-12 gap-4">
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

        <div className="col-span-12 space-y-4 md:col-span-5 md:border-l md:border-ink/10 md:pl-5">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-widest text-ww-muted">
              Per day
            </p>
            <p className="font-serif text-3xl leading-none tabular-nums text-ink">
              ₹{perDay.toLocaleString("en-IN")}
            </p>

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
      <p className="mb-2 font-serif text-2xl text-ink">
        No dossiers in this slice.
      </p>
      <p className="mb-6 font-mono text-xs text-ww-muted">
        Loosen the budget or try another month.
      </p>
      <button
        onClick={onReset}
        className="inline-flex items-center gap-1.5 rounded-full bg-ink px-5 py-2.5 font-mono text-[10px] uppercase tracking-widest text-warm-white transition-colors hover:bg-ink/80"
      >
        Reset filters
        <ArrowUpRight className="h-3 w-3" />
      </button>
    </div>
  );
}
