"use client";

import { useTransition, useState } from "react";
import { updateProfileField, updateSegmentField } from "./actions";
import { MultiSelect, MultiSelectOption } from "@/components/ui/MultiSelect";
import { AGE_OPTIONS } from "@/lib/constants";

const TRIP_OPTIONS = [
  { value: "0",   label: "First solo trip", emoji: "🌱" },
  { value: "1-2", label: "1–2 trips",       emoji: "🧭" },
  { value: "3-5", label: "3–5 trips",       emoji: "🗺️" },
  { value: "6+",  label: "6+ trips",        emoji: "🏔️" },
];

const TRAVEL_PREF = [
  { value: "budget",  label: "Budget",  sub: "Hostels, street food, buses" },
  { value: "comfort", label: "Comfort", sub: "Mid-range, occasional treats" },
  { value: "premium", label: "Premium", sub: "Heritage stays, private cars" },
];

const STYLE_OPTIONS = ["Adventure", "Culture", "Food", "Offbeat", "Relaxation"];

const CITY_OPTIONS: MultiSelectOption[] = [
  { value: "goa-india",         label: "Goa" },
  { value: "delhi-india",       label: "Delhi" },
  { value: "mumbai-india",      label: "Mumbai" },
  { value: "jaipur-india",      label: "Jaipur" },
  { value: "manali-india",      label: "Manali" },
  { value: "rishikesh-india",   label: "Rishikesh" },
  { value: "varanasi-india",    label: "Varanasi" },
  { value: "udaipur-india",     label: "Udaipur" },
  { value: "agra-india",        label: "Agra" },
  { value: "bangalore-india",   label: "Bangalore" },
  { value: "kolkata-india",     label: "Kolkata" },
  { value: "chennai-india",     label: "Chennai" },
  { value: "kochi-india",       label: "Kochi" },
  { value: "kasol-india",       label: "Kasol" },
  { value: "hampi-india",       label: "Hampi" },
  { value: "tokyo-japan",       label: "Tokyo" },
  { value: "bangkok-thailand",  label: "Bangkok" },
  { value: "hanoi-vietnam",     label: "Hanoi" },
  { value: "dubai-uae",         label: "Dubai" },
  { value: "seoul-south-korea", label: "Seoul" },
  { value: "paris-france",      label: "Paris" },
];

const LANG_OPTIONS: MultiSelectOption[] = [
  "English", "Hindi", "Marathi", "Tamil", "Telugu",
  "Kannada", "Bengali", "Punjabi", "Gujarati", "Malayalam",
  "French", "Spanish", "Japanese", "Mandarin",
].map((l) => ({ value: l, label: l }));

const WORRY_OPTIONS: MultiSelectOption[] = [
  { value: "scams",       label: "Scams & fraud",            emoji: "🎭" },
  { value: "harassment",  label: "Street harassment",        emoji: "🛡️" },
  { value: "transport",   label: "Transport & getting lost", emoji: "🚌" },
  { value: "health",      label: "Health & safety",          emoji: "🏥" },
  { value: "solo_nights", label: "Solo nights out",          emoji: "🌙" },
  { value: "language",    label: "Language barrier",         emoji: "💬" },
];

type Seg = {
  tripCount?: string;
  travelPreference?: string;
  travelStyle?: string[];
  citiesVisited?: string[];
  languages?: string[];
  destination?: string;       // legacy single (from onboarding)
  destinations?: string[];    // multi (from profile)
  need?: string;
  worries?: string[];
  ageGroup?: string;
};

type Props = {
  firstName: string;
  homeCity: string;
  instagram: string;
  username: string;
  segment: Seg;
};

export function ProfileEditClient({ firstName, homeCity, instagram, username, segment }: Props) {
  const [, startTransition] = useTransition();

  // Coerce legacy single destination → array on first load
  const initialDests =
    segment.destinations ?? (segment.destination ? [segment.destination] : []);

  const [tripCount, setTripCount] = useState(segment.tripCount ?? "");
  const [travPref, setTravPref]   = useState(segment.travelPreference ?? "");
  const [styles, setStyles]       = useState<string[]>(segment.travelStyle ?? []);
  const [cities, setCities]       = useState<string[]>(segment.citiesVisited ?? []);
  const [langs, setLangs]         = useState<string[]>(segment.languages ?? []);
  const [nextDests, setNextDests] = useState<string[]>(initialDests);
  const [worries, setWorries]     = useState<string[]>(segment.worries ?? []);
  const [ageGroup, setAgeGroup]   = useState(segment.ageGroup ?? "");

  function saveBlur(field: string, value: string) {
    startTransition(() => updateProfileField(field, value));
  }

  function patchSeg(patch: Partial<Seg>) {
    startTransition(() => updateSegmentField(patch));
  }

  return (
    <div className="space-y-4">
      {/* Identity */}
      <Section title="Identity">
        <BlurField label="Name"      name="first_name" defaultValue={firstName} placeholder="Priya"           onSave={(v) => saveBlur("first_name", v)} />
        <BlurField label="Home city" name="home_city"  defaultValue={homeCity}  placeholder="Mumbai"          onSave={(v) => saveBlur("home_city", v)} />
        <BlurField label="Username"  name="username"   defaultValue={username}  placeholder="priya_travels"   onSave={(v) => saveBlur("username", v)} />
        <BlurField label="Instagram" name="instagram"  defaultValue={instagram} placeholder="@yourhandle"     onSave={(v) => saveBlur("instagram", v)} />
      </Section>

      {/* Trip count */}
      <Section title="How many solo trips have you taken?">
        <div className="grid gap-2 sm:grid-cols-2">
          {TRIP_OPTIONS.map((o) => (
            <button
              key={o.value}
              type="button"
              onClick={() => { setTripCount(o.value); patchSeg({ tripCount: o.value }); }}
              className={`flex items-center gap-3 border p-3 text-left transition-colors ${
                tripCount === o.value
                  ? "border-rust bg-rust-light"
                  : "border-ww-border bg-warm-white hover:border-ink"
              }`}
            >
              <span className="text-lg">{o.emoji}</span>
              <span className="font-mono text-sm text-ink">{o.label}</span>
            </button>
          ))}
        </div>
      </Section>

      {/* Travel preference */}
      <Section title="How do you prefer to travel?">
        <div className="grid gap-2 sm:grid-cols-3">
          {TRAVEL_PREF.map((o) => (
            <button
              key={o.value}
              type="button"
              onClick={() => { setTravPref(o.value); patchSeg({ travelPreference: o.value }); }}
              className={`border p-3 text-left transition-colors ${
                travPref === o.value
                  ? "border-rust bg-rust-light"
                  : "border-ww-border bg-warm-white hover:border-ink"
              }`}
            >
              <p className="font-mono text-sm text-ink">{o.label}</p>
              <p className="mt-0.5 font-mono text-[10px] text-ww-muted">{o.sub}</p>
            </button>
          ))}
        </div>
      </Section>

      {/* Travel style — kept as chips (small fixed list) */}
      <Section title="Travel style" subtitle="Powers buddy matching">
        <div className="flex flex-wrap gap-2">
          {STYLE_OPTIONS.map((s) => {
            const active = styles.includes(s);
            return (
              <button
                key={s}
                type="button"
                onClick={() => {
                  const next = active ? styles.filter((v) => v !== s) : [...styles, s];
                  setStyles(next);
                  patchSeg({ travelStyle: next });
                }}
                className={`border px-2.5 py-1 font-mono text-[11px] transition-colors ${
                  active
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

      {/* Cities visited — multi-select dropdown */}
      <Section title="Places you've traveled" subtitle="Shows your experience to the community">
        <MultiSelect
          options={CITY_OPTIONS}
          selected={cities}
          onChange={(next) => { setCities(next); patchSeg({ citiesVisited: next }); }}
          placeholder="Pick cities you've solo-traveled"
        />
      </Section>

      {/* Languages — multi-select dropdown */}
      <Section title="Languages you speak" subtitle="Connects you with local sisters">
        <MultiSelect
          options={LANG_OPTIONS}
          selected={langs}
          onChange={(next) => { setLangs(next); patchSeg({ languages: next }); }}
          placeholder="Pick languages"
        />
      </Section>

      {/* Where headed next — multi-select dropdown */}
      <Section title="Where are you headed next?">
        <MultiSelect
          options={CITY_OPTIONS}
          selected={nextDests}
          onChange={(next) => { setNextDests(next); patchSeg({ destinations: next }); }}
          placeholder="Pick upcoming destinations"
        />
      </Section>

      {/* Worries — multi-select dropdown */}
      <Section title="What worries you most about solo travel?" subtitle="Personalises your feed">
        <MultiSelect
          options={WORRY_OPTIONS}
          selected={worries}
          onChange={(next) => { setWorries(next); patchSeg({ worries: next }); }}
          placeholder="Pick concerns"
        />
      </Section>

      {/* Age group */}
      <Section title="Age group">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {AGE_OPTIONS.map((o) => (
            <button
              key={o.value}
              type="button"
              onClick={() => { setAgeGroup(o.value); patchSeg({ ageGroup: o.value }); }}
              className={`border p-3 text-center font-mono text-sm transition-colors ${
                ageGroup === o.value
                  ? "border-rust bg-rust/10 text-ink"
                  : "border-ww-border bg-warm-white text-ww-muted hover:border-ink hover:text-ink"
              }`}
            >
              {o.label}
            </button>
          ))}
        </div>
      </Section>
    </div>
  );
}

function Section({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-warm-white border border-ww-border rounded-2xl p-5">
      <h3 className="font-serif text-lg text-ink">{title}</h3>
      {subtitle && (
        <p className="mb-3 mt-0.5 font-mono text-[10px] text-ww-muted">{subtitle}</p>
      )}
      {!subtitle && <div className="mb-3" />}
      {children}
    </div>
  );
}

function BlurField({
  label,
  name,
  defaultValue,
  placeholder,
  onSave,
}: {
  label: string;
  name: string;
  defaultValue: string;
  placeholder: string;
  onSave: (v: string) => void;
}) {
  return (
    <div className="mb-3 last:mb-0">
      <label
        htmlFor={name}
        className="mb-1 block font-mono text-[10px] uppercase tracking-widest text-ww-muted"
      >
        {label}
      </label>
      <input
        id={name}
        name={name}
        defaultValue={defaultValue}
        placeholder={placeholder}
        onBlur={(e) => onSave(e.target.value)}
        className="w-full border border-ww-border bg-warm-white px-3 py-2 font-mono text-sm text-ink focus:border-ink focus:outline-none"
      />
    </div>
  );
}
