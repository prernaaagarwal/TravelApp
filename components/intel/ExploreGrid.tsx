"use client";

import { useState } from "react";
import Link from "next/link";

type Card = {
  slug: string;
  destination: string;
  country: string;
  audience: string;
  contributorSlug: string;
  heroImageUrl: string;
  tldr: string[];
  isPremium: boolean;
  estimatedDailyBudget: { backpacker: number; comfortable: number };
};

type Contributor = {
  slug: string;
  name: string;
  photoUrl: string;
};

type Props = {
  cards: Card[];
  contributors: Contributor[];
};

const FILTERS = [
  { label: "All", value: "all" },
  { label: "India", value: "india" },
  { label: "International", value: "international" },
  { label: "For Foreign Women", value: "foreign" },
] as const;

type Filter = (typeof FILTERS)[number]["value"];

export function ExploreGrid({ cards, contributors }: Props) {
  const [active, setActive] = useState<Filter>("all");

  const filtered = cards.filter((c) => {
    if (active === "all") return true;
    if (active === "india") return c.country === "India";
    if (active === "international") return c.country !== "India";
    if (active === "foreign") return c.audience === "foreign";
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

      {/* empty state */}
      {filtered.length === 0 && (
        <div className="py-20 text-center">
          <p className="font-mono text-sm text-ww-muted">
            No cards for this filter yet — we&apos;re expanding soon.
          </p>
        </div>
      )}

      {/* grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
                <img
                  src={card.heroImageUrl}
                  alt={card.destination}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/50 to-transparent" />

                {/* badges over image */}
                <div className="absolute bottom-3 left-3 flex flex-wrap gap-1.5">
                  {card.isPremium && (
                    <span className="bg-gold px-2 py-0.5 font-mono text-[9px] uppercase tracking-widest text-ink">
                      Premium
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
                  {card.tldr[0]}
                </p>

                <div className="mt-auto flex items-center justify-between border-t border-ww-border pt-3">
                  {/* contributor */}
                  <div className="flex items-center gap-2">
                    {contrib && (
                      <img
                        src={contrib.photoUrl}
                        alt={contrib.name}
                        className="h-6 w-6 rounded-full object-cover"
                      />
                    )}
                    <span className="font-mono text-[10px] text-ww-muted">
                      {contrib?.name ?? "Wander Women"}
                    </span>
                  </div>

                  {/* budget */}
                  <span className="font-mono text-[10px] text-ww-muted">
                    ₹{card.estimatedDailyBudget.backpacker.toLocaleString("en-IN")}–
                    {card.estimatedDailyBudget.comfortable.toLocaleString("en-IN")}/day
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
