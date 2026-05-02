"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateSegment } from "@/app/onboarding/actions";
import { SUPPORTED_BEWARE_CITIES } from "@/lib/beware-cities";

const ALL_DESTINATIONS = [
  { slug: "goa-india",         label: "Goa",        country: "India" },
  { slug: "delhi-india",       label: "Delhi",      country: "India" },
  { slug: "mumbai-india",      label: "Mumbai",     country: "India" },
  { slug: "jaipur-india",      label: "Jaipur",     country: "India" },
  { slug: "manali-india",      label: "Manali",     country: "India" },
  { slug: "rishikesh-india",   label: "Rishikesh",  country: "India" },
  { slug: "varanasi-india",    label: "Varanasi",   country: "India" },
  { slug: "udaipur-india",     label: "Udaipur",    country: "India" },
  { slug: "agra-india",        label: "Agra",       country: "India" },
  { slug: "bangalore-india",   label: "Bangalore",  country: "India" },
  { slug: "kolkata-india",     label: "Kolkata",    country: "India" },
  { slug: "chennai-india",     label: "Chennai",    country: "India" },
  { slug: "kochi-india",       label: "Kochi",      country: "India" },
  { slug: "kasol-india",       label: "Kasol",      country: "India" },
  { slug: "hampi-india",       label: "Hampi",      country: "India" },
  { slug: "tokyo-japan",       label: "Tokyo",      country: "Japan" },
  { slug: "bangkok-thailand",  label: "Bangkok",    country: "Thailand" },
  { slug: "hanoi-vietnam",     label: "Hanoi",      country: "Vietnam" },
  { slug: "dubai-uae",         label: "Dubai",      country: "UAE" },
  { slug: "seoul-south-korea", label: "Seoul",      country: "South Korea" },
  { slug: "paris-france",      label: "Paris",      country: "France" },
];

const NEED_OPTIONS = [
  { value: "research",  label: "Research a destination",   emoji: "🔍" },
  { value: "buddy",     label: "Find a travel buddy",      emoji: "👯" },
  { value: "warnings",  label: "Report or read warnings",  emoji: "⚠️" },
  { value: "budget",    label: "Plan my budget",           emoji: "💰" },
];

export function OnboardingWizard({ scope = "all" }: { scope?: "indian" | "foreign" | "all" }) {
  const router = useRouter();
  const [step, setStep]               = useState(0);
  const [destination, setDestination] = useState("");
  const [query, setQuery]             = useState("");
  const [submitting, setSubmitting]   = useState(false);

  const scopedDestinations =
    scope === "indian"  ? ALL_DESTINATIONS.filter((d) => d.country === "India") :
    scope === "foreign" ? ALL_DESTINATIONS.filter((d) => d.country !== "India") :
    ALL_DESTINATIONS;

  const filtered =
    query.length > 0
      ? scopedDestinations.filter(
          (d) =>
            d.label.toLowerCase().includes(query.toLowerCase()) ||
            d.country.toLowerCase().includes(query.toLowerCase())
        )
      : scopedDestinations;

  function selectDestination(slug: string) {
    const dest = ALL_DESTINATIONS.find((d) => d.slug === slug);
    setDestination(slug);
    setQuery(dest?.label ?? "");
    setStep(1);
  }

  async function selectNeed(need: string) {
    if (submitting) return;
    setSubmitting(true);
    try {
      localStorage.setItem(
        "ww-onboarding",
        JSON.stringify({ destination, need, completedAt: new Date().toISOString() })
      );
    } catch {}
    await updateSegment({ destination, need }).catch(() => {});

    let href = `/intel/${destination}`;
    if (need === "buddy") {
      href = "/buddy";
    } else if (need === "warnings") {
      href = SUPPORTED_BEWARE_CITIES.has(destination)
        ? `/community/beware/${destination}`
        : "/community?tab=beware";
    } else if (need === "budget") {
      href = "/feed";
    }
    router.push(href);
  }

  return (
    <div className="border border-ww-border bg-sand p-6 md:p-8">
      {/* Progress */}
      <div className="mb-6 flex items-center gap-2">
        {[0, 1].map((i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-colors ${
              i <= step ? "bg-rust" : "bg-ww-border"
            }`}
          />
        ))}
        <span className="ml-3 shrink-0 font-mono text-[10px] uppercase tracking-widest text-ww-muted">
          {step + 1} of 2
        </span>
      </div>

      {/* Step 1 — destination */}
      {step === 0 && (
        <div>
          <h2 className="mb-2 font-serif text-3xl text-ink">Where are you headed?</h2>
          <p className="mb-5 font-mono text-xs text-ww-muted">
            Search or pick a destination — we&apos;ll pull the intel built for it.
          </p>
          <input
            type="text"
            placeholder="Search city or country…"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setDestination("");
            }}
            className="mb-3 w-full border border-ww-border bg-warm-white px-4 py-2.5 font-mono text-sm text-ink placeholder:text-ww-muted focus:border-ink focus:outline-none"
          />
          <div className="max-h-64 overflow-y-auto space-y-1.5 pr-1">
            {filtered.map((d) => (
              <button
                key={d.slug}
                onClick={() => selectDestination(d.slug)}
                className={`flex w-full items-center justify-between border px-4 py-3 text-left transition-colors ${
                  destination === d.slug
                    ? "border-rust bg-rust-light"
                    : "border-ww-border bg-warm-white hover:border-ink"
                }`}
              >
                <span className="font-serif text-lg text-ink">{d.label}</span>
                <span className="font-mono text-[10px] uppercase tracking-widest text-ww-muted">
                  {d.country}
                </span>
              </button>
            ))}
            {filtered.length === 0 && (
              <p className="py-6 text-center font-mono text-xs text-ww-muted">
                No destinations found
              </p>
            )}
          </div>
        </div>
      )}

      {/* Step 2 — need */}
      {step === 1 && (
        <div>
          <h2 className="mb-2 font-serif text-3xl text-ink">
            What do you need most right now?
          </h2>
          <p className="mb-6 font-mono text-xs text-ww-muted">
            We&apos;ll take you straight there.
          </p>
          <div className="grid gap-2 sm:grid-cols-2">
            {NEED_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => selectNeed(opt.value)}
                disabled={submitting}
                className="flex items-center gap-3 border border-ww-border bg-warm-white p-4 text-left transition-colors hover:border-rust hover:bg-rust-light disabled:opacity-40"
              >
                <span className="text-2xl">{opt.emoji}</span>
                <span className="font-mono text-sm text-ink">{opt.label}</span>
              </button>
            ))}
          </div>

          <button
            onClick={() => {
              setStep(0);
              setDestination("");
              setQuery("");
            }}
            className="mt-6 font-mono text-[10px] uppercase tracking-widest text-ww-muted hover:text-ink"
          >
            ← Change destination
          </button>
        </div>
      )}
    </div>
  );
}
