"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { RustButton } from "@/components/ui/RustButton";
import { registerBuddyTrip } from "@/app/buddy/actions";

const DESTINATIONS = [
  { slug: "goa-india", label: "Goa" },
  { slug: "rishikesh-india", label: "Rishikesh" },
  { slug: "jaipur-india", label: "Jaipur" },
  { slug: "manali-india", label: "Manali" },
  { slug: "varanasi-india", label: "Varanasi" },
  { slug: "udaipur-india", label: "Udaipur" },
  { slug: "tokyo-japan", label: "Tokyo" },
  { slug: "bangkok-thailand", label: "Bangkok" },
  { slug: "vietnam", label: "Vietnam" },
];

const STYLES = ["food", "culture", "nature", "nightlife", "relaxation", "adventure"];
const BUDGETS = ["Budget (₹1–2k/day)", "Mid-range (₹2–5k/day)", "Comfortable (₹5k+/day)"];

export function RegisterTripForm({ defaultFirstName }: { defaultFirstName?: string }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  if (done) {
    return (
      <div className="border border-sage/30 bg-sage-light/30 px-4 py-3 font-mono text-xs text-sage mb-8">
        ✓ Trip registered — scroll down to see your matches.
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const result = await registerBuddyTrip(new FormData(e.currentTarget));
    setLoading(false);
    if (result?.error) setError(result.error);
    else setDone(true);
  }

  return (
    <form onSubmit={handleSubmit} className="mb-10 border border-ww-border bg-sand p-5 space-y-4">
      <p className="font-mono text-[10px] uppercase tracking-widest text-ww-muted">
        Register your trip to find matches
      </p>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs text-ww-muted mb-1">Your first name <span className="text-rust">*</span></label>
          <Input name="first_name" required placeholder="Priya" defaultValue={defaultFirstName} className="bg-warm-white border-ww-border text-sm" />
        </div>
        <div>
          <label className="block text-xs text-ww-muted mb-1">Age range</label>
          <select name="age_range" className="w-full border border-ww-border bg-warm-white px-3 py-2 font-mono text-sm text-ink focus:outline-none">
            <option value="">Select</option>
            {["18-22", "23-27", "28-32", "33-38", "39-45", "45+"].map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-xs text-ww-muted mb-1">Destination <span className="text-rust">*</span></label>
        <select name="destination_slug" required className="w-full border border-ww-border bg-warm-white px-3 py-2 font-mono text-sm text-ink focus:outline-none">
          <option value="">Choose destination</option>
          {DESTINATIONS.map(d => <option key={d.slug} value={d.slug}>{d.label}</option>)}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs text-ww-muted mb-1">From date</label>
          <Input name="travel_start" type="date" className="bg-warm-white border-ww-border text-sm" />
        </div>
        <div>
          <label className="block text-xs text-ww-muted mb-1">To date</label>
          <Input name="travel_end" type="date" className="bg-warm-white border-ww-border text-sm" />
        </div>
      </div>

      <div>
        <label className="block text-xs text-ww-muted mb-1">Budget</label>
        <select name="budget_range" className="w-full border border-ww-border bg-warm-white px-3 py-2 font-mono text-sm text-ink focus:outline-none">
          <option value="">Select</option>
          {BUDGETS.map(b => <option key={b} value={b}>{b}</option>)}
        </select>
      </div>

      <div>
        <label className="block text-xs text-ww-muted mb-2">Travel style (pick all that apply)</label>
        <div className="flex flex-wrap gap-2">
          {STYLES.map(s => (
            <label key={s} className="cursor-pointer">
              <input type="checkbox" name="style" value={s} className="sr-only peer" />
              <span className="inline-block border border-ww-border bg-warm-white px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest text-ww-muted peer-checked:border-rust peer-checked:bg-rust-light peer-checked:text-rust transition-colors">
                {s}
              </span>
            </label>
          ))}
        </div>
      </div>

      {error && <p className="text-sm text-rust">{error}</p>}

      <RustButton type="submit" size="md" block disabled={loading}>
        {loading ? "Registering…" : "Register my trip →"}
      </RustButton>
    </form>
  );
}
