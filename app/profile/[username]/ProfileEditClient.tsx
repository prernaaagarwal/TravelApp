"use client";

import { useTransition, useState } from "react";
import { updateProfileField, updateSegmentField } from "./actions";

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

const CITY_CHIPS = [
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

const LANG_OPTIONS = [
  "English", "Hindi", "Marathi", "Tamil", "Telugu",
  "Kannada", "Bengali", "Punjabi", "Gujarati", "Malayalam",
  "French", "Spanish", "Japanese", "Mandarin",
];

type Seg = {
  tripCount?: string;
  travelPreference?: string;
  travelStyle?: string[];
  citiesVisited?: string[];
  languages?: string[];
  destination?: string;
  need?: string;
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

  // Local state (optimistic)
  const [tripCount, setTripCount]     = useState(segment.tripCount ?? "");
  const [travPref, setTravPref]       = useState(segment.travelPreference ?? "");
  const [styles, setStyles]           = useState<string[]>(segment.travelStyle ?? []);
  const [cities, setCities]           = useState<string[]>(segment.citiesVisited ?? []);
  const [langs, setLangs]             = useState<string[]>(segment.languages ?? []);

  function saveBlur(field: string, value: string) {
    startTransition(() => updateProfileField(field, value));
  }

  function patchSeg(patch: Partial<Seg>) {
    startTransition(() => updateSegmentField(patch));
  }

  function toggleChip<T extends string>(
    val: T,
    current: T[],
    setter: (v: T[]) => void,
    segKey: keyof Seg
  ) {
    const next = current.includes(val)
      ? current.filter((v) => v !== val)
      : [...current, val];
    setter(next);
    patchSeg({ [segKey]: next });
  }

  return (
    <div className="space-y-4">
      {/* Identity fields */}
      <Section title="Identity">
        <BlurField
          label="Name"
          name="first_name"
          defaultValue={firstName}
          placeholder="Priya"
          onSave={(v) => saveBlur("first_name", v)}
        />
        <BlurField
          label="Home city"
          name="home_city"
          defaultValue={homeCity}
          placeholder="Mumbai"
          onSave={(v) => saveBlur("home_city", v)}
        />
        <BlurField
          label="Username"
          name="username"
          defaultValue={username}
          placeholder="priya_travels"
          onSave={(v) => saveBlur("username", v)}
        />
        <BlurField
          label="Instagram"
          name="instagram"
          defaultValue={instagram}
          placeholder="@yourhandle"
          onSave={(v) => saveBlur("instagram", v)}
        />
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

      {/* Travel style */}
      <Section title="Travel style" subtitle="Powers buddy matching">
        <div className="flex flex-wrap gap-2">
          {STYLE_OPTIONS.map((s) => (
            <Chip
              key={s}
              label={s}
              active={styles.includes(s)}
              color="rust"
              onClick={() => toggleChip(s, styles, setStyles, "travelStyle")}
            />
          ))}
        </div>
      </Section>

      {/* Cities visited */}
      <Section title="Cities you've solo-traveled" subtitle="Shows your experience to the community">
        <div className="flex flex-wrap gap-2">
          {CITY_CHIPS.map((c) => (
            <Chip
              key={c.slug}
              label={c.label}
              active={cities.includes(c.slug)}
              color="sage"
              onClick={() => toggleChip(c.slug, cities, setCities, "citiesVisited")}
            />
          ))}
        </div>
      </Section>

      {/* Languages */}
      <Section title="Languages you speak" subtitle="Connects you with local sisters">
        <div className="flex flex-wrap gap-2">
          {LANG_OPTIONS.map((l) => (
            <Chip
              key={l}
              label={l}
              active={langs.includes(l)}
              color="blue"
              onClick={() => toggleChip(l, langs, setLangs, "languages")}
            />
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
    <div className="bg-warm-white border border-ww-border rounded-xl p-5 shadow-sm">
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

function Chip({
  label,
  active,
  color,
  onClick,
}: {
  label: string;
  active: boolean;
  color: "rust" | "sage" | "blue";
  onClick: () => void;
}) {
  const activeClass =
    color === "rust"
      ? "border-rust bg-rust text-warm-white"
      : color === "sage"
      ? "border-sage bg-sage text-warm-white"
      : "border-blue bg-blue text-warm-white";

  return (
    <button
      type="button"
      onClick={onClick}
      className={`border px-2.5 py-1 font-mono text-[11px] transition-colors ${
        active
          ? activeClass
          : "border-ww-border bg-warm-white text-ww-muted hover:border-ink hover:text-ink"
      }`}
    >
      {label}
    </button>
  );
}
