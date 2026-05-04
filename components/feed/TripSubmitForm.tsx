"use client";

import { useState } from "react";
import { submitTripFeed } from "@/app/feed/submit/actions";

const DESTINATIONS = [
  { slug: "goa-india",         name: "Goa, India" },
  { slug: "jaipur-india",      name: "Jaipur, India" },
  { slug: "delhi-india",       name: "Delhi, India" },
  { slug: "mumbai-india",      name: "Mumbai, India" },
  { slug: "varanasi-india",    name: "Varanasi, India" },
  { slug: "manali-india",      name: "Manali, India" },
  { slug: "rishikesh-india",   name: "Rishikesh, India" },
  { slug: "agra-india",        name: "Agra, India" },
  { slug: "bangalore-india",   name: "Bangalore, India" },
  { slug: "kolkata-india",     name: "Kolkata, India" },
  { slug: "chennai-india",     name: "Chennai, India" },
  { slug: "udaipur-india",     name: "Udaipur, India" },
  { slug: "kochi-india",       name: "Kochi, India" },
  { slug: "kasol-india",       name: "Kasol, India" },
  { slug: "hampi-india",       name: "Hampi, India" },
  { slug: "tokyo-japan",       name: "Tokyo, Japan" },
  { slug: "bangkok-thailand",  name: "Bangkok, Thailand" },
  { slug: "hanoi-vietnam",     name: "Hanoi, Vietnam" },
  { slug: "dubai-uae",         name: "Dubai, UAE" },
  { slug: "seoul-south-korea", name: "Seoul, South Korea" },
  { slug: "paris-france",      name: "Paris, France" },
];

const inputCls =
  "w-full border border-ww-border bg-warm-white px-3 py-2 font-mono text-sm text-ink placeholder:text-ww-muted focus:outline-none focus:border-ink";
const labelCls = "block font-mono text-[10px] uppercase tracking-widest text-ww-muted mb-1";

export function TripSubmitForm() {
  const [selectedSlug, setSelectedSlug] = useState("");
  const [loading, setLoading]           = useState(false);
  const [error, setError]               = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const result = await submitTripFeed(new FormData(e.currentTarget));
    setLoading(false);
    if (result?.error) setError(result.error);
  }

  const selectedDest = DESTINATIONS.find((d) => d.slug === selectedSlug);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">

      {/* Destination */}
      <div>
        <label className={labelCls} htmlFor="destination_slug">Destination *</label>
        <select
          id="destination_slug"
          name="destination_slug"
          required
          value={selectedSlug}
          onChange={(e) => setSelectedSlug(e.target.value)}
          className={inputCls}
        >
          <option value="">Select a destination…</option>
          {DESTINATIONS.map((d) => (
            <option key={d.slug} value={d.slug}>{d.name}</option>
          ))}
        </select>
        {/* hidden display name auto-filled from selection */}
        <input
          type="hidden"
          name="destination"
          value={selectedDest?.name ?? selectedSlug}
        />
      </div>

      {/* Dates */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelCls} htmlFor="trip_start">Trip start *</label>
          <input id="trip_start" type="date" name="trip_start" required className={inputCls} />
        </div>
        <div>
          <label className={labelCls} htmlFor="trip_end">Trip end *</label>
          <input id="trip_end" type="date" name="trip_end" required className={inputCls} />
        </div>
      </div>

      {/* Cost breakdown */}
      <div>
        <p className={labelCls}>Cost breakdown (₹ INR) *</p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {[
            { name: "cost_stay",       label: "Stay" },
            { name: "cost_food",       label: "Food" },
            { name: "cost_transport",  label: "Transport" },
            { name: "cost_activities", label: "Activities" },
            { name: "cost_misc",       label: "Misc" },
          ].map((f) => (
            <div key={f.name}>
              <label className={labelCls} htmlFor={f.name}>{f.label}</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono text-sm text-ww-muted">₹</span>
                <input
                  id={f.name}
                  type="number"
                  name={f.name}
                  min="0"
                  defaultValue="0"
                  className={`${inputCls} pl-7`}
                />
              </div>
            </div>
          ))}
        </div>
        <p className="mt-2 font-mono text-[10px] text-ww-muted">
          USD is calculated automatically (÷84).
        </p>
      </div>

      {/* Top notes */}
      <div>
        <label className={labelCls} htmlFor="notes_raw">
          Top notes — one per line (min 1, max 6) *
        </label>
        <textarea
          id="notes_raw"
          name="notes_raw"
          required
          rows={5}
          placeholder={`Skip the tourist areas near the fort — overpriced.\nBest dosa: the cart outside the bus stand, ₹40.\nBook the 6am train to beat the heat.`}
          className={`${inputCls} resize-none`}
        />
        <p className="mt-1 font-mono text-[10px] text-ww-muted">
          Practical, specific tips only. One line = one tip.
        </p>
      </div>

      {/* Highlight */}
      <div>
        <label className={labelCls} htmlFor="highlight">
          One moment that made the trip *
        </label>
        <textarea
          id="highlight"
          name="highlight"
          required
          rows={3}
          minLength={10}
          maxLength={500}
          placeholder="The rooftop at sunrise with a cup of chai and no other tourists in sight."
          className={`${inputCls} resize-none`}
        />
        <p className="mt-1 font-mono text-[10px] text-ww-muted">
          This appears as a pull-quote on the receipt card.
        </p>
      </div>

      {error && (
        <p className="border border-rust/30 bg-rust/5 px-3 py-2 font-mono text-xs text-rust">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading || !selectedSlug}
        className="w-full border border-ink bg-ink py-3 font-mono text-xs uppercase tracking-widest text-warm-white transition-colors hover:bg-ink/80 disabled:opacity-40"
      >
        {loading ? "Submitting…" : "Submit trip receipt"}
      </button>

      <p className="text-center font-mono text-[10px] text-ww-muted">
        Your receipt goes to a moderation queue and appears on the feed once approved.
      </p>
    </form>
  );
}
