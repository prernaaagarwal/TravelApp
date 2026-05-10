"use client";

import { useState } from "react";
import { User } from "@supabase/supabase-js";
import { matchItinerary, getTransportInfo, type MatchInputs } from "@/lib/match-itinerary";
import { type Itinerary } from "@/lib/itineraries";
import { Slider } from "@/components/ui/slider";
import { saveTripAction } from "./actions";

const MONTHS_SHORT = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

const inputCls = "w-full border border-ww-border bg-warm-white px-4 py-3 text-ink placeholder:text-ww-muted focus:outline-none focus:border-ink";
const labelCls = "block font-mono text-[10px] uppercase tracking-widest text-ww-muted mb-2";

type SavedTrip = {
  id: string;
  destination: string;
  days: number;
  budget: number;
  month: string | null;
  notes: string | null;
  matched_itinerary_id: string | null;
  created_at: string;
};

export function PlannerClient({ user, savedTrips }: { user: User | null; savedTrips: SavedTrip[] }) {
  const [from, setFrom] = useState("");
  const [destination, setDestination] = useState("");
  const [days, setDays] = useState<number>(5);
  const [budget, setBudget] = useState<number[]>([15000]);
  const [month, setMonth] = useState("");
  const [notes, setNotes] = useState("");
  const [matchedItinerary, setMatchedItinerary] = useState<Itinerary | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setNotFound(false);
    setSaved(false);

    const inputs: MatchInputs = {
      destination: destination.trim(),
      days,
      budget: budget[0],
      month,
      from: from.trim(),
    };

    const result = matchItinerary(inputs);
    if (!result) {
      setNotFound(true);
      setMatchedItinerary(null);
    } else {
      setMatchedItinerary(result);
      setNotFound(false);
    }
  };

  const handleSave = async () => {
    if (!user || !matchedItinerary) return;
    setSaving(true);
    const result = await saveTripAction({
      destination: matchedItinerary.destination,
      days: matchedItinerary.duration_days,
      budget: budget[0],
      month: month || null,
      notes: notes || null,
      matched_itinerary_id: matchedItinerary.id,
    });
    setSaving(false);
    if (!result?.error) {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
  };

  const loadSavedTrip = (trip: SavedTrip) => {
    setDestination(trip.destination);
    setDays(trip.days);
    setBudget([trip.budget]);
    setMonth(trip.month || "");
    setNotes(trip.notes || "");
    
    // Re-match
    const inputs: MatchInputs = {
      destination: trip.destination,
      days: trip.days,
      budget: trip.budget,
      month: trip.month || undefined,
    };
    const result = matchItinerary(inputs);
    if (result) {
      setMatchedItinerary(result);
      setNotFound(false);
    }
  };

  const transportInfo = matchedItinerary ? getTransportInfo(matchedItinerary, from) : "";

  return (
    <div className="bg-sand min-h-screen">
      {/* Hero */}
      <section className="border-b border-ink/10 bg-warm-white">
        <div className="mx-auto max-w-4xl px-6 py-16 text-center">
          <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.2em] text-ww-muted">
            Trip Planner · Solo Female Safe
          </p>
          <h1 className="font-serif text-5xl leading-tight tracking-tight text-ink md:text-6xl">
            Plan your trip in{" "}
            <em className="italic text-rust">30 seconds</em>
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-lg leading-relaxed text-ww-muted">
            Get a complete day-by-day itinerary with real budgets, safety tips, and advice from women who&apos;ve actually been there. 15 destinations, zero fluff.
          </p>
        </div>
      </section>

      {/* Form */}
      <section id="planner-form" className="mx-auto max-w-4xl px-6 py-12">
        <div className="rounded-sm border border-ink/10 bg-warm-white p-8 md:p-10">
          <h2 className="mb-8 font-serif text-2xl tracking-tight text-ink">
            Tell us about your trip
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* From (optional) */}
            <div>
              <label className={labelCls} htmlFor="from">
                Where are you based? (optional)
              </label>
              <input
                id="from"
                type="text"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                placeholder="Mumbai, Delhi, Bangalore..."
                className={inputCls}
              />
            </div>

            {/* Destination */}
            <div>
              <label className={labelCls} htmlFor="destination">
                Where do you want to go? *
              </label>
              <input
                id="destination"
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="Goa, Rishikesh, Jaipur, Udaipur..."
                required
                className={inputCls}
              />
              <p className="mt-1 font-mono text-[10px] text-ww-muted">
                Available: Goa, Rishikesh, Jaipur, Udaipur, Kochi, Hampi, Varanasi, Kasol, Manali, Bangalore, Delhi, Mumbai
              </p>
            </div>

            {/* Days */}
            <div>
              <label className={labelCls} htmlFor="days">
                How many days? *
              </label>
              <input
                id="days"
                type="number"
                min="1"
                max="30"
                value={days}
                onChange={(e) => setDays(parseInt(e.target.value) || 1)}
                required
                className={inputCls}
              />
            </div>

            {/* Budget */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <label className={labelCls}>Budget per trip *</label>
                <span className="font-mono text-sm tabular-nums text-ink">
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

            {/* Month */}
            <div>
              <label className={labelCls}>When are you travelling?</label>
              <div className="flex flex-wrap gap-2">
                {MONTHS_SHORT.map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setMonth((cur) => (cur === m ? "" : m))}
                    className={`rounded-sm border px-3 py-2 font-mono text-xs uppercase tracking-wider transition-colors ${
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

            {/* Notes */}
            <div>
              <label className={labelCls} htmlFor="notes">
                Anything else? (optional)
              </label>
              <textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                placeholder="First time solo, vegetarian, love hiking..."
                className={`${inputCls} resize-none`}
              />
            </div>

            <button
              type="submit"
              className="w-full bg-rust py-4 font-mono text-sm uppercase tracking-widest text-warm-white transition-colors hover:bg-rust/90"
            >
              Plan My Trip →
            </button>
          </form>
        </div>
      </section>

      {/* Results */}
      {notFound && (
        <section className="mx-auto max-w-4xl px-6 pb-12">
          <div className="rounded-sm border border-rust/30 bg-rust/5 p-8 text-center">
            <AlertTriangle className="mx-auto mb-3 h-8 w-8 text-rust" />
            <p className="font-serif text-xl text-ink">
              We don&apos;t have <strong>{destination}</strong> yet.
            </p>
            <p className="mt-2 text-sm text-ww-muted">
              Coming soon. Try: Goa, Rishikesh, Jaipur, Udaipur, Kochi, Hampi, Varanasi, Kasol, Manali, Bangalore, Delhi, Mumbai.
            </p>
          </div>
        </section>
      )}

      {matchedItinerary && (
        <section className="mx-auto max-w-6xl px-6 pb-16">
          {/* Summary Card */}
          <div className="mb-10 rounded-sm border border-ink/10 bg-warm-white p-8 md:p-10">
            <div className="mb-6 flex items-start justify-between">
              <div>
                <h2 className="font-serif text-3xl tracking-tight text-ink">
                  {matchedItinerary.destination} · {matchedItinerary.duration_days} Days
                </h2>
                <p className="mt-2 font-mono text-sm text-ww-muted">
                  Estimated total: ₹{matchedItinerary.estimated_total_cost.toLocaleString("en-IN")} · Safety score: {matchedItinerary.safety_score}/5
                </p>
              </div>
              <div className="flex items-center gap-2 rounded-sm border border-sage/40 bg-sage-light/40 px-3 py-1.5">
                <Shield className="h-4 w-4 text-sage" />
                <span className="font-mono text-xs text-sage">{matchedItinerary.safety_score}/5</span>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {/* Transport */}
              <div>
                <div className="mb-2 flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-ww-muted">
                  <Train className="h-3.5 w-3.5" /> How to get there
                </div>
                <p className="text-sm leading-relaxed text-ink/80">{transportInfo}</p>
              </div>

              {/* Best months */}
              <div>
                <div className="mb-2 flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-ww-muted">
                  <Calendar className="h-3.5 w-3.5" /> Best months
                </div>
                <p className="text-sm text-ink/80">{matchedItinerary.best_months.join(", ")}</p>
              </div>

              {/* Neighbourhoods */}
              <div>
                <div className="mb-2 flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-ww-muted">
                  <Home className="h-3.5 w-3.5" /> Stay in these areas
                </div>
                <p className="text-sm text-ink/80">{matchedItinerary.best_neighbourhoods.join(", ")}</p>
              </div>

              {/* Avoid */}
              <div>
                <div className="mb-2 flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-rust">
                  <AlertTriangle className="h-3.5 w-3.5" /> Avoid
                </div>
                <p className="text-sm text-ink/80">{matchedItinerary.avoid.join(", ")}</p>
              </div>

              {/* Packing */}
              <div className="md:col-span-2">
                <div className="mb-2 flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-ww-muted">
                  <Package className="h-3.5 w-3.5" /> Packing notes
                </div>
                <p className="text-sm text-ink/80">{matchedItinerary.packing_notes}</p>
              </div>
            </div>

            {/* Scam Alerts */}
            {matchedItinerary.scam_alerts.length > 0 && (
              <div className="mt-6 rounded-sm border border-rust/20 bg-rust/5 p-4">
                <div className="mb-3 flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-rust">
                  <AlertTriangle className="h-4 w-4" /> Scam alerts
                </div>
                <ul className="space-y-2">
                  {matchedItinerary.scam_alerts.map((alert, i) => (
                    <li key={i} className="flex gap-2 text-sm text-ink/80">
                      <span className="text-rust">•</span>
                      <span>{alert}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Save button */}
            {user && (
              <div className="mt-6 flex gap-3">
                <button
                  onClick={handleSave}
                  disabled={saving || saved}
                  className="inline-flex items-center gap-2 rounded-sm bg-teal px-5 py-2.5 font-mono text-xs uppercase tracking-widest text-warm-white transition-colors hover:bg-ink disabled:opacity-50"
                >
                  {saved ? "✓ Saved" : saving ? "Saving..." : "Save this trip"}
                </button>
              </div>
            )}
            {!user && (
              <p className="mt-4 text-xs text-ww-muted">
                <a href="/account/login" className="underline">Log in</a> to save this trip
              </p>
            )}
          </div>

          {/* Day Cards */}
          <div className="space-y-8">
            <h3 className="font-serif text-2xl tracking-tight text-ink">Day-by-day plan</h3>
            {matchedItinerary.days.map((day) => (
              <article key={day.day} className="rounded-sm border border-ink/10 bg-warm-white p-6 md:p-8">
                <div className="mb-4 flex items-start justify-between">
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-widest text-ww-muted">
                      Day {day.day}
                    </p>
                    <h4 className="mt-1 font-serif text-xl tracking-tight text-ink">
                      {day.title}
                    </h4>
                  </div>
                  <div className="text-right">
                    <p className="font-mono text-[10px] uppercase tracking-widest text-ww-muted">
                      Daily cost
                    </p>
                    <p className="font-serif text-lg tabular-nums text-ink">
                      ₹{day.daily_cost.toLocaleString("en-IN")}
                    </p>
                  </div>
                </div>

                <div className="space-y-3 text-sm leading-relaxed text-ink/80">
                  <p><strong className="text-ink">Morning:</strong> {day.morning}</p>
                  <p><strong className="text-ink">Afternoon:</strong> {day.afternoon}</p>
                  <p><strong className="text-ink">Evening:</strong> {day.evening}</p>
                  <p><strong className="text-ink">Stay:</strong> {day.stay}</p>
                </div>

                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  <div className="rounded-sm border border-sage/20 bg-sage-light/20 p-4">
                    <p className="mb-1 flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-sage">
                      <Shield className="h-3.5 w-3.5" /> Safety tip
                    </p>
                    <p className="text-xs leading-relaxed text-ink/80">{day.safety_tip}</p>
                  </div>
                  <div className="rounded-sm border border-rust/20 bg-rust-light/20 p-4">
                    <p className="mb-1 flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-rust">
                      <MessageSquare className="h-3.5 w-3.5" /> Women&apos;s tip
                    </p>
                    <p className="text-xs leading-relaxed text-ink/80">{day.womens_tip}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* Saved Trips */}
      {user && savedTrips.length > 0 && !matchedItinerary && (
        <section className="mx-auto max-w-4xl px-6 pb-16">
          <h3 className="mb-6 font-serif text-2xl tracking-tight text-ink">Your saved trips</h3>
          <div className="space-y-3">
            {savedTrips.map((trip) => (
              <button
                key={trip.id}
                onClick={() => loadSavedTrip(trip)}
                className="w-full rounded-sm border border-ink/10 bg-warm-white p-4 text-left transition-colors hover:border-ink/30"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-serif text-lg text-ink">{trip.destination}</p>
                    <p className="mt-1 font-mono text-xs text-ww-muted">
                      {trip.days} days · ₹{trip.budget.toLocaleString("en-IN")} {trip.month && `· ${trip.month}`}
                    </p>
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-ww-muted" />
                </div>
              </button>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
