"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { DestinationWaitlistForm } from "@/components/shared/DestinationWaitlistForm";

type Card = {
  slug: string;
  destination: string;
  country: string;
  audience: string;
  contributorSlug: string;
  heroImageUrl: string;
  tldr: string[] | { summary: string };
  isPremium: boolean;
  estimatedDailyBudget: { backpacker: number; comfortable: number; currency: string } | null;
};

type Contributor = {
  slug: string;
  name: string;
  photoUrl: string;
};

type Filter = "all" | "india" | "international";

type Props = {
  cards: Card[];
  contributors: Contributor[];
  /** Initial filter, derived server-side from the viewer's onboarding segment.
   *  Onboarded users land on the region they picked in /onboarding instead of
   *  seeing every card; first-time visitors still see "all". */
  defaultFilter?: Filter;
};

const FILTERS = [
  { label: "All",            value: "all" },
  { label: "India",          value: "india" },
  { label: "Outside India",  value: "international" },
] as const;

export function ExploreGrid({ cards, contributors, defaultFilter = "all" }: Props) {
  const [active, setActive] = useState<Filter>(defaultFilter);

  const filtered = cards.filter((c) => {
    if (active === "all")           return true;
    if (active === "india")         return c.country === "India";
    if (active === "international") return c.country !== "India";
    return true;
  });

  return (
    <div>
      {/* filter chips */}
      <div className="mb-8 flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setActive(f.value)}
            className={`border px-4 py-1.5 font-mono text-xs uppercase tracking-widest transition-colors ${
              active === f.value
                ? "border-ink bg-ink text-warm-white"
                : "border-ww-border bg-sand text-ww-muted hover:border-ink hover:text-ink"
            }`}
          >
            {f.label}
          </button>
        ))}
        <span className="ml-auto self-center font-mono text-[10px] text-ww-muted">
          {filtered.length} cards
        </span>
      </div>

      {/* empty state — turns the dead end into a waitlist signal */}
      {filtered.length === 0 && (
        <div className="border border-dashed border-ww-border bg-warm-white px-6 py-12 text-center">
          <p className="mx-auto mb-1 max-w-md font-mono text-sm text-ink">
            No cards for this filter yet.
          </p>
          <p className="mx-auto mb-5 max-w-md font-mono text-xs text-ww-muted">
            Tell us where you&apos;re headed — we&apos;ll email when intel for
            that destination goes live.
          </p>
          <div className="mx-auto max-w-sm">
            <DestinationWaitlistForm destination={active === "all" ? undefined : active} />
          </div>
        </div>
      )}

      {/* grid */}
      <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((card) => {
          const contrib = contributors.find((c) => c.slug === card.contributorSlug);
          return (
            <Link
              key={card.slug}
              href={`/intel/${card.slug}`}
              className="group flex flex-col border border-ww-border bg-sand transition-shadow hover:shadow-md"
            >
              {/* image */}
              <div className="relative h-44 overflow-hidden bg-rust-light">
                <Image
                  src={card.heroImageUrl}
                  alt={card.destination}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/50 to-transparent" />

                {/* badges over image */}
                <div className="absolute bottom-3 left-3 flex flex-wrap gap-1.5">
                  {card.isPremium && (
                    <span className="bg-gold/90 px-2 py-0.5 font-mono text-[9px] uppercase tracking-widest text-ink">
                      + Bonus chapter
                    </span>
                  )}
                  {card.audience === "indian" && (
                    <span className="bg-rust px-2 py-0.5 font-mono text-[9px] uppercase tracking-widest text-warm-white">
                      Indian women
                    </span>
                  )}
                  {card.audience === "foreign" && (
                    <span className="bg-blue px-2 py-0.5 font-mono text-[9px] uppercase tracking-widest text-warm-white">
                      Foreign women
                    </span>
                  )}
                </div>
              </div>

              {/* body */}
              <div className="flex flex-1 flex-col p-4">
                <div className="mb-1 flex items-start justify-between gap-2">
                  <h2 className="font-serif text-xl leading-tight text-ink group-hover:text-rust transition-colors">
                    {card.destination}
                  </h2>
                  <span className="shrink-0 font-mono text-[10px] text-ww-muted">
                    {card.country}
                  </span>
                </div>

                <p className="mb-4 line-clamp-2 text-xs leading-relaxed text-ww-muted">
                  {Array.isArray(card.tldr)
                    ? card.tldr[0]
                    : (card.tldr as unknown as { summary: string })?.summary ?? ""}
                </p>

                <div className="mt-auto flex items-center justify-between border-t border-ww-border pt-3">
                  {/* contributor */}
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
                    <span className="font-mono text-[10px] text-ww-muted">
                      {contrib?.name ?? "Wander Women"}
                    </span>
                  </div>

                  {/* budget */}
                  {card.estimatedDailyBudget && (() => {
                    const b = card.estimatedDailyBudget;
                    const sym = b.currency === "INR" ? "₹" : b.currency === "EUR" ? "€" : "$";
                    return (
                      <span className="font-mono text-[10px] text-ww-muted">
                        {sym}{b.backpacker}–{b.comfortable}/day
                      </span>
                    );
                  })()}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
