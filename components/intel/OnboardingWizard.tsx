"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateSegment } from "@/app/onboarding/actions";

const TRIP_OPTIONS = [
  { value: "0", label: "Zero — first solo trip", emoji: "🌱" },
  { value: "1-2", label: "1–2 trips", emoji: "🧭" },
  { value: "3-5", label: "3–5 trips", emoji: "🗺️" },
  { value: "6+", label: "6 or more — pro", emoji: "🏔️" },
] as const;

const DEST_OPTIONS = [
  { slug: "goa-india", label: "Goa", vibe: "Beach, chill, party-optional" },
  { slug: "rishikesh-india", label: "Rishikesh", vibe: "Yoga, river, sober" },
  { slug: "jaipur-india", label: "Jaipur", vibe: "History, palaces, photo gold" },
  { slug: "manali-india", label: "Manali", vibe: "Mountains, cafés, slow days" },
  { slug: "varanasi-india", label: "Varanasi", vibe: "Ghats, ritual, intense" },
  { slug: "udaipur-india", label: "Udaipur", vibe: "Lakes, royalty, slow luxury" },
] as const;

const WORRY_OPTIONS = [
  { value: "safety", label: "Safety after dark" },
  { value: "scams", label: "Getting scammed" },
  { value: "loneliness", label: "Feeling alone" },
  { value: "money", label: "Blowing my budget" },
  { value: "transport", label: "Local transport stress" },
  { value: "stay", label: "Booking a sketchy place" },
] as const;

export function OnboardingWizard() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [tripCount, setTripCount] = useState<string>("");
  const [destination, setDestination] = useState<string>("");
  const [worries, setWorries] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  function toggleWorry(w: string) {
    setWorries((prev) =>
      prev.includes(w) ? prev.filter((x) => x !== w) : [...prev, w]
    );
  }

  async function submit() {
    setSubmitting(true);
    const payload = { tripCount, destination, worries };
    try {
      localStorage.setItem("ww-onboarding", JSON.stringify({ ...payload, completedAt: new Date().toISOString() }));
    } catch {}
    await updateSegment(payload).catch(() => {});
    router.push(`/intel/${destination}`);
  }

  const canAdvance =
    (step === 0 && tripCount) ||
    (step === 1 && destination) ||
    (step === 2 && worries.length > 0);

  return (
    <div className="border border-ww-border bg-sand p-6 md:p-8">
      {/* progress */}
      <div className="mb-6 flex items-center gap-2">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-colors ${
              i <= step ? "bg-rust" : "bg-ww-border"
            }`}
          />
        ))}
        <span className="ml-3 shrink-0 font-mono text-[10px] uppercase tracking-widest text-ww-muted">
          {step + 1} of 3
        </span>
      </div>

      {/* step 1 — trip count */}
      {step === 0 && (
        <div>
          <h2 className="mb-2 font-serif text-3xl text-ink">
            How many solo trips have you taken?
          </h2>
          <p className="mb-6 font-mono text-xs text-ww-muted">
            No judgment. We tune the intel to where you are now.
          </p>
          <div className="grid gap-2 sm:grid-cols-2">
            {TRIP_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setTripCount(opt.value)}
                className={`flex items-center gap-3 border p-4 text-left transition-colors ${
                  tripCount === opt.value
                    ? "border-rust bg-rust-light"
                    : "border-ww-border bg-warm-white hover:border-ink"
                }`}
              >
                <span className="text-2xl">{opt.emoji}</span>
                <span className="font-mono text-sm text-ink">{opt.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* step 2 — destination */}
      {step === 1 && (
        <div>
          <h2 className="mb-2 font-serif text-3xl text-ink">
            Where are you headed next?
          </h2>
          <p className="mb-6 font-mono text-xs text-ww-muted">
            Pick the closest match — we&apos;ll show you the full intel card.
          </p>
          <div className="grid gap-2 sm:grid-cols-2">
            {DEST_OPTIONS.map((d) => (
              <button
                key={d.slug}
                onClick={() => setDestination(d.slug)}
                className={`border p-4 text-left transition-colors ${
                  destination === d.slug
                    ? "border-rust bg-rust-light"
                    : "border-ww-border bg-warm-white hover:border-ink"
                }`}
              >
                <p className="font-serif text-lg text-ink">{d.label}</p>
                <p className="font-mono text-[10px] text-ww-muted">{d.vibe}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* step 3 — worries */}
      {step === 2 && (
        <div>
          <h2 className="mb-2 font-serif text-3xl text-ink">
            What&apos;s actually worrying you?
          </h2>
          <p className="mb-6 font-mono text-xs text-ww-muted">
            Pick all that apply. We&apos;ll prioritize those sections in your
            card.
          </p>
          <div className="grid gap-2 sm:grid-cols-2">
            {WORRY_OPTIONS.map((w) => {
              const active = worries.includes(w.value);
              return (
                <button
                  key={w.value}
                  onClick={() => toggleWorry(w.value)}
                  className={`flex items-center justify-between border p-4 text-left transition-colors ${
                    active
                      ? "border-rust bg-rust-light"
                      : "border-ww-border bg-warm-white hover:border-ink"
                  }`}
                >
                  <span className="font-mono text-sm text-ink">{w.label}</span>
                  {active && <span className="text-rust">✓</span>}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* navigation */}
      <div className="mt-8 flex items-center justify-between">
        <button
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0}
          className="font-mono text-[10px] uppercase tracking-widest text-ww-muted disabled:invisible hover:text-ink"
        >
          ← Back
        </button>

        {step < 2 ? (
          <button
            onClick={() => setStep((s) => s + 1)}
            disabled={!canAdvance}
            className="border border-ink bg-ink px-5 py-2.5 font-mono text-xs uppercase tracking-widest text-warm-white hover:bg-ink/80 transition-colors disabled:cursor-not-allowed disabled:opacity-40"
          >
            Continue →
          </button>
        ) : (
          <button
            onClick={submit}
            disabled={!canAdvance || submitting}
            className="border border-rust bg-rust px-5 py-2.5 font-mono text-xs uppercase tracking-widest text-warm-white hover:bg-rust/90 transition-colors disabled:cursor-not-allowed disabled:opacity-40"
          >
            {submitting ? "Building your card..." : "See my intel card →"}
          </button>
        )}
      </div>
    </div>
  );
}
