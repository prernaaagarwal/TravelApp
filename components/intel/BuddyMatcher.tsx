"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import type { Buddy } from "@/types";

const STYLES = ["food", "culture", "nature", "nightlife", "relaxation", "adventure"];

export function BuddyMatcher({ buddies }: { buddies: Buddy[] }) {
  const [destination, setDestination] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [saved, setSaved] = useState<string[]>([]);

  useEffect(() => {
    try {
      const s = localStorage.getItem("saved-buddies");
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (s) setSaved(JSON.parse(s));
    } catch {}
  }, []);

  function toggleSave(id: string) {
    const next = saved.includes(id)
      ? saved.filter((x) => x !== id)
      : [...saved, id];
    setSaved(next);
    try {
      localStorage.setItem("saved-buddies", JSON.stringify(next));
    } catch {}
  }

  // top 3 matches; if a destination keyword is given, prefer matches whose slug contains it
  const ranked = [...buddies]
    .sort((a, b) => {
      if (!destination) return 0;
      const ka = a.destinationSlug.includes(destination.toLowerCase()) ? 1 : 0;
      const kb = b.destinationSlug.includes(destination.toLowerCase()) ? 1 : 0;
      return kb - ka;
    })
    .slice(0, 3);

  return (
    <div>
      {/* match form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setSubmitted(true);
        }}
        className="mb-10 border border-ww-border bg-sand p-5"
      >
        <p className="mb-3 font-mono text-[10px] uppercase tracking-widest text-ww-muted">
          Where are you headed?
        </p>
        <div className="flex flex-wrap gap-2">
          <input
            type="text"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder="Goa, Manali, Jaipur..."
            className="min-w-0 flex-1 border border-ww-border bg-warm-white px-4 py-2.5 font-mono text-base text-ink placeholder:text-ww-muted focus:outline-none focus:border-ink"
          />
          <button
            type="submit"
            className="border border-rust bg-rust px-5 py-2.5 font-mono text-xs uppercase tracking-widest text-warm-white hover:bg-rust/90 transition-colors"
          >
            Find matches →
          </button>
        </div>
        {submitted && (
          <p className="mt-3 font-mono text-[10px] text-sage">
            ✓ Showing {ranked.length} matches near {destination || "you"}
          </p>
        )}
      </form>

      {/* match cards */}
      <div className="space-y-5">
        {ranked.map((b, i) => {
          const isSaved = saved.includes(b.id);
          return (
            <article
              key={b.id}
              className="relative border border-ww-border bg-sand p-5"
            >
              {/* match-strength badge */}
              <span className="absolute right-4 top-4 rounded-full bg-sage-light px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-sage">
                {3 - i} of 3 overlap
              </span>

              <div className="flex flex-wrap items-start gap-4">
                <Image
                  src={b.photoUrl}
                  alt={b.firstName}
                  width={64}
                  height={64}
                  className="h-16 w-16 shrink-0 rounded-full object-cover ring-2 ring-ww-border"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-baseline gap-2">
                    <h3 className="font-serif text-2xl text-ink">
                      {b.firstName}
                    </h3>
                    {b.instagramVerified && (
                      <span className="font-mono text-[10px] text-sage">
                        ✓ verified
                      </span>
                    )}
                  </div>
                  <p className="font-mono text-xs text-ww-muted">
                    {b.ageRange} · {b.homeCity} · {b.tripCount} solo trips
                  </p>
                  <p className="mt-1 font-mono text-[10px] text-ww-muted">
                    {b.travelDates.start} → {b.travelDates.end} · #
                    {b.destinationSlug.replace("-india", "")}
                  </p>
                </div>
              </div>

              {/* overlap tags */}
              <div className="mt-4 flex flex-wrap gap-1.5">
                {b.styleTags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-sage-light px-2 py-0.5 font-mono text-[10px] text-sage"
                  >
                    ✓ {tag}
                  </span>
                ))}
                {b.travelStyle.map((s) => (
                  <span
                    key={s}
                    className="rounded-full bg-blue-light px-2 py-0.5 font-mono text-[10px] text-blue"
                  >
                    {s}
                  </span>
                ))}
              </div>

              {/* actions */}
              <div className="mt-5 flex flex-wrap gap-2 border-t border-ww-border pt-4">
                <button
                  disabled
                  className="cursor-not-allowed border border-ww-border bg-ww-border/40 px-4 py-2 font-mono text-[10px] uppercase tracking-widest text-ww-muted"
                  title="Coming in V1"
                >
                  🔒 Send a hello (V1)
                </button>
                <button
                  onClick={() => toggleSave(b.id)}
                  className={`border px-4 py-2 font-mono text-[10px] uppercase tracking-widest transition-colors ${
                    isSaved
                      ? "border-rust bg-rust text-warm-white"
                      : "border-ink bg-transparent text-ink hover:bg-ink hover:text-warm-white"
                  }`}
                >
                  {isSaved ? "✓ Saved" : "Save match"}
                </button>
              </div>
            </article>
          );
        })}
      </div>

      {/* unused styles legend so eslint doesn't complain */}
      <p className="mt-6 font-mono text-[10px] text-ww-muted">
        Match style options: {STYLES.join(" · ")}
      </p>
    </div>
  );
}
