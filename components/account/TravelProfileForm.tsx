"use client";

import { useState, useTransition } from "react";
import { updateProfile } from "@/app/account/profile/actions";

const TRIP_COUNT_OPTIONS = [
  { value: "0",   label: "First solo trip", emoji: "🌱" },
  { value: "1-2", label: "1–2 trips",       emoji: "🧭" },
  { value: "3-5", label: "3–5 trips",       emoji: "🗺️" },
  { value: "6+",  label: "6+ trips",        emoji: "🏔️" },
];

const TRAVEL_PREF_OPTIONS = [
  { value: "budget",  label: "Budget",  desc: "Hostels, street food, buses" },
  { value: "comfort", label: "Comfort", desc: "Mid-range, occasional treats" },
  { value: "premium", label: "Premium", desc: "Heritage stays, private cars" },
];

const TRAVEL_STYLE_OPTIONS = [
  "Adventure",
  "Culture",
  "Food",
  "Offbeat",
  "Relaxation",
];

const CITY_OPTIONS = [
  { slug: "goa-india",         label: "Goa" },
  { slug: "delhi-india",       label: "Delhi" },
  { slug: "mumbai-india",      label: "Mumbai" },
  { slug: "jaipur-india",      label: "Jaipur" },
  { slug: "manali-india",      label: "Manali" },
  { slug: "rishikesh-india",   label: "Rishikesh" },
  { slug: "varanasi-india",    label: "Varanasi" },
  { slug: "udaipur-india",     label: "Udaipur" },
  { slug: "agra-india",        label: "Agra" },
  { slug: "bangalore-india",   label: "Bangalore" },
  { slug: "kolkata-india",     label: "Kolkata" },
  { slug: "chennai-india",     label: "Chennai" },
  { slug: "kochi-india",       label: "Kochi" },
  { slug: "kasol-india",       label: "Kasol" },
  { slug: "hampi-india",       label: "Hampi" },
  { slug: "tokyo-japan",       label: "Tokyo" },
  { slug: "bangkok-thailand",  label: "Bangkok" },
  { slug: "hanoi-vietnam",     label: "Hanoi" },
  { slug: "dubai-uae",         label: "Dubai" },
  { slug: "seoul-south-korea", label: "Seoul" },
  { slug: "paris-france",      label: "Paris" },
];

const LANGUAGE_OPTIONS = [
  "English", "Hindi", "Marathi", "Tamil", "Telugu", "Kannada", "Bengali",
  "Punjabi", "Gujarati", "Malayalam", "French", "Spanish", "Japanese", "Mandarin",
];

type Segment = {
  destination?: string;
  need?: string;
  tripCount?: string;
  travelPreference?: string;
  travelStyle?: string[];
  citiesVisited?: string[];
  languages?: string[];
};

type Props = {
  firstName: string;
  homeCity: string;
  instagram: string;
  segment: Segment;
};

export function TravelProfileForm({ firstName, homeCity, instagram, segment }: Props) {
  const [name, setName]                       = useState(firstName);
  const [city, setCity]                       = useState(homeCity);
  const [insta, setInsta]                     = useState(instagram);
  const [tripCount, setTripCount]             = useState(segment.tripCount ?? "");
  const [travelPref, setTravelPref]           = useState(segment.travelPreference ?? "");
  const [travelStyle, setTravelStyle]         = useState<string[]>(segment.travelStyle ?? []);
  const [citiesVisited, setCitiesVisited]     = useState<string[]>(segment.citiesVisited ?? []);
  const [languages, setLanguages]             = useState<string[]>(segment.languages ?? []);

  const [pending, startTransition] = useTransition();
  const [savedAt, setSavedAt]      = useState<number | null>(null);

  function toggle<T>(value: T, setter: (v: T[]) => void, current: T[]) {
    setter(current.includes(value) ? current.filter((v) => v !== value) : [...current, value]);
  }

  function save() {
    startTransition(async () => {
      const fd = new FormData();
      fd.set("first_name", name);
      fd.set("home_city", city);
      fd.set("instagram", insta);
      fd.set("segment", JSON.stringify({
        ...segment,
        tripCount,
        travelPreference: travelPref,
        travelStyle,
        citiesVisited,
        languages,
      }));
      await updateProfile(fd);
      setSavedAt(Date.now());
    });
  }

  return (
    <div className="space-y-6">
      {/* Identity */}
      <Section title="Identity">
        <Field label="Name">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Priya"
            className="w-full border border-ww-border bg-warm-white px-3 py-2 font-mono text-sm focus:border-ink focus:outline-none"
          />
        </Field>
        <Field label="Home city">
          <input
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Mumbai"
            className="w-full border border-ww-border bg-warm-white px-3 py-2 font-mono text-sm focus:border-ink focus:outline-none"
          />
        </Field>
        <Field label="Instagram (for buddy verification)">
          <input
            value={insta}
            onChange={(e) => setInsta(e.target.value)}
            placeholder="@yourhandle"
            className="w-full border border-ww-border bg-warm-white px-3 py-2 font-mono text-sm focus:border-ink focus:outline-none"
          />
        </Field>
      </Section>

      {/* Solo trips taken */}
      <Section title="How many solo trips have you taken?">
        <div className="grid gap-2 sm:grid-cols-2">
          {TRIP_COUNT_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setTripCount(opt.value)}
              className={`flex items-center gap-3 border p-3 text-left transition-colors ${
                tripCount === opt.value
                  ? "border-rust bg-rust-light"
                  : "border-ww-border bg-warm-white hover:border-ink"
              }`}
            >
              <span className="text-lg">{opt.emoji}</span>
              <span className="font-mono text-sm text-ink">{opt.label}</span>
            </button>
          ))}
        </div>
      </Section>

      {/* Travel preference */}
      <Section title="How do you prefer to travel?">
        <div className="grid gap-2 sm:grid-cols-3">
          {TRAVEL_PREF_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setTravelPref(opt.value)}
              className={`border p-3 text-left transition-colors ${
                travelPref === opt.value
                  ? "border-rust bg-rust-light"
                  : "border-ww-border bg-warm-white hover:border-ink"
              }`}
            >
              <p className="font-mono text-sm text-ink">{opt.label}</p>
              <p className="mt-0.5 font-mono text-[10px] text-ww-muted">{opt.desc}</p>
            </button>
          ))}
        </div>
      </Section>

      {/* Travel style multi-select */}
      <Section
        title="Travel style"
        subtitle="Pick all that apply — powers buddy matching."
      >
        <div className="flex flex-wrap gap-2">
          {TRAVEL_STYLE_OPTIONS.map((s) => {
            const on = travelStyle.includes(s);
            return (
              <button
                key={s}
                type="button"
                onClick={() => toggle(s, setTravelStyle, travelStyle)}
                className={`border px-3 py-1.5 font-mono text-xs uppercase tracking-widest transition-colors ${
                  on
                    ? "border-rust bg-rust text-warm-white"
                    : "border-ww-border bg-warm-white text-ww-muted hover:border-ink hover:text-ink"
                }`}
              >
                {s}
              </button>
            );
          })}
        </div>
      </Section>

      {/* Cities visited */}
      <Section
        title="Which cities have you traveled solo?"
        subtitle="Unlocks contributor prompts. Shows your experience to the community."
      >
        <div className="flex flex-wrap gap-2">
          {CITY_OPTIONS.map((c) => {
            const on = citiesVisited.includes(c.slug);
            return (
              <button
                key={c.slug}
                type="button"
                onClick={() => toggle(c.slug, setCitiesVisited, citiesVisited)}
                className={`border px-2.5 py-1 font-mono text-[11px] transition-colors ${
                  on
                    ? "border-sage bg-sage text-warm-white"
                    : "border-ww-border bg-warm-white text-ww-muted hover:border-ink hover:text-ink"
                }`}
              >
                {c.label}
              </button>
            );
          })}
        </div>
      </Section>

      {/* Languages */}
      <Section
        title="Languages you speak"
        subtitle="Surfaces regional content and connects you with local sisters."
      >
        <div className="flex flex-wrap gap-2">
          {LANGUAGE_OPTIONS.map((l) => {
            const on = languages.includes(l);
            return (
              <button
                key={l}
                type="button"
                onClick={() => toggle(l, setLanguages, languages)}
                className={`border px-2.5 py-1 font-mono text-[11px] transition-colors ${
                  on
                    ? "border-blue bg-blue text-warm-white"
                    : "border-ww-border bg-warm-white text-ww-muted hover:border-ink hover:text-ink"
                }`}
              >
                {l}
              </button>
            );
          })}
        </div>
      </Section>

      {/* Sticky save bar */}
      <div className="sticky bottom-0 -mx-4 border-t border-ww-border bg-warm-white/95 px-4 py-3 backdrop-blur-sm md:-mx-0 md:rounded-b-xl">
        <div className="flex items-center justify-between gap-3">
          <p className="font-mono text-[10px] text-ww-muted">
            {savedAt ? "✓ Saved" : "Changes are saved when you click below."}
          </p>
          <button
            type="button"
            onClick={save}
            disabled={pending}
            className="border border-rust bg-rust px-5 py-2 font-mono text-xs uppercase tracking-widest text-warm-white hover:bg-rust/90 disabled:opacity-50"
          >
            {pending ? "Saving…" : "Save profile"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Section({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div className="bg-warm-white border border-ww-border rounded-2xl p-5">
      <h3 className="font-serif text-lg text-ink">{title}</h3>
      {subtitle && <p className="mt-0.5 mb-3 font-mono text-[11px] text-ww-muted">{subtitle}</p>}
      {!subtitle && <div className="mb-3" />}
      {children}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-3 last:mb-0">
      <label className="mb-1 block font-mono text-[10px] uppercase tracking-widest text-ww-muted">
        {label}
      </label>
      {children}
    </div>
  );
}
