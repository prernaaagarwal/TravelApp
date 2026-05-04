"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ImageUpload } from "./ImageUpload";
import { upsertContributor } from "@/app/admin/contributors/actions";

export interface ContributorInitial {
  slug?: string;
  name?: string;
  full_name?: string;
  home_city?: string;
  age_range?: string;
  tagline?: string;
  bio?: string;
  photo_url?: string;
  instagram?: string;
  joined_date?: string;
  trip_count?: number;
  total_contributions?: number;
  answers_in_community?: number;
  earnings_this_month?: number;
  badges?: string[];
  destinations_contributed?: string[];
}

const inputCls = "w-full border border-ww-border bg-warm-white px-3 py-2 font-mono text-sm text-ink placeholder:text-ww-muted focus:outline-none focus:border-ink";
const labelCls = "block font-mono text-[10px] uppercase tracking-widest text-ww-muted mb-1";
const sectionCls = "border border-ww-border bg-sand p-4 space-y-4";
const h3Cls = "font-mono text-[10px] uppercase tracking-widest text-ww-muted";

function StringList({ label, value, onChange, placeholder }: {
  label: string; value: string[]; onChange: (v: string[]) => void; placeholder?: string;
}) {
  return (
    <div>
      <p className={labelCls}>{label}</p>
      <div className="space-y-2">
        {value.map((item, i) => (
          <div key={i} className="flex gap-2">
            <input
              value={item}
              onChange={(e) => { const n = [...value]; n[i] = e.target.value; onChange(n); }}
              placeholder={placeholder}
              className={inputCls}
            />
            <button
              type="button"
              onClick={() => onChange(value.filter((_, j) => j !== i))}
              className="shrink-0 border border-rust/40 px-3 py-2 font-mono text-[10px] text-rust hover:bg-rust hover:text-warm-white"
            >
              ✕
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => onChange([...value, ""])}
          className="border border-ww-border px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest text-ww-muted hover:border-ink hover:text-ink"
        >
          + Add
        </button>
      </div>
    </div>
  );
}

export function ContributorForm({ initial = {}, isEdit = false }: { initial?: ContributorInitial; isEdit?: boolean }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error,   setError  ] = useState("");

  const [slug,        setSlug       ] = useState(initial.slug              ?? "");
  const [name,        setName       ] = useState(initial.name              ?? "");
  const [fullName,    setFullName   ] = useState(initial.full_name         ?? "");
  const [homeCity,    setHomeCity   ] = useState(initial.home_city         ?? "");
  const [ageRange,    setAgeRange   ] = useState(initial.age_range         ?? "");
  const [tagline,     setTagline    ] = useState(initial.tagline           ?? "");
  const [bio,         setBio        ] = useState(initial.bio               ?? "");
  const [photoUrl,    setPhotoUrl   ] = useState(initial.photo_url         ?? "");
  const [instagram,   setInstagram  ] = useState(initial.instagram         ?? "");
  const [joinedDate,  setJoinedDate ] = useState(initial.joined_date       ?? "");
  const [tripCount,   setTripCount  ] = useState(initial.trip_count        ?? 0);
  const [totalContrib,setTotalContrib] = useState(initial.total_contributions ?? 0);
  const [answers,     setAnswers    ] = useState(initial.answers_in_community ?? 0);
  const [earnings,    setEarnings   ] = useState(initial.earnings_this_month   ?? 0);
  const [badges,      setBadges     ] = useState<string[]>(initial.badges                  ?? []);
  const [destinations,setDestinations] = useState<string[]>(initial.destinations_contributed ?? []);

  function autoSlug(first: string, city: string) {
    if (isEdit) return;
    const combined = `${first} ${city}`.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    setSlug(combined);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const fd = new FormData();
    fd.set("slug",                    slug);
    fd.set("name",                    name);
    fd.set("full_name",               fullName);
    fd.set("home_city",               homeCity);
    fd.set("age_range",               ageRange);
    fd.set("tagline",                 tagline);
    fd.set("bio",                     bio);
    fd.set("photo_url",               photoUrl);
    fd.set("instagram",               instagram);
    fd.set("joined_date",             joinedDate);
    fd.set("trip_count",              String(tripCount));
    fd.set("total_contributions",     String(totalContrib));
    fd.set("answers_in_community",    String(answers));
    fd.set("earnings_this_month",     String(earnings));
    fd.set("badges",                  JSON.stringify(badges.filter(Boolean)));
    fd.set("destinations_contributed",JSON.stringify(destinations.filter(Boolean)));

    const result = await upsertContributor(fd);
    setLoading(false);
    if (result?.error) setError(result.error);
    // On success, upsertContributor redirects server-side
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">

      {/* ── Identity ── */}
      <div className={sectionCls}>
        <h3 className={h3Cls}>Identity</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>First name *</label>
            <input value={name} onChange={(e) => { setName(e.target.value); autoSlug(e.target.value, homeCity); }} required className={inputCls} placeholder="Ananya" />
          </div>
          <div>
            <label className={labelCls}>Full name</label>
            <input value={fullName} onChange={(e) => setFullName(e.target.value)} className={inputCls} placeholder="Ananya Iyer" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Slug * {isEdit && "(locked)"}</label>
            <input value={slug} onChange={(e) => !isEdit && setSlug(e.target.value)} readOnly={isEdit} required className={`${inputCls} ${isEdit ? "bg-sand opacity-60" : ""}`} placeholder="ananya-mumbai" />
          </div>
          <div>
            <label className={labelCls}>Home city</label>
            <input value={homeCity} onChange={(e) => { setHomeCity(e.target.value); autoSlug(name, e.target.value); }} className={inputCls} placeholder="Mumbai" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Age range</label>
            <input value={ageRange} onChange={(e) => setAgeRange(e.target.value)} className={inputCls} placeholder="28-35" />
          </div>
          <div>
            <label className={labelCls}>Instagram</label>
            <input value={instagram} onChange={(e) => setInstagram(e.target.value)} className={inputCls} placeholder="@ananya.offbeat" />
          </div>
        </div>
        <div>
          <label className={labelCls}>Tagline</label>
          <input value={tagline} onChange={(e) => setTagline(e.target.value)} className={inputCls} placeholder="Spiti Valley Expert · Northeast Pioneer" />
        </div>
        <div>
          <label className={labelCls}>Bio</label>
          <textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={4} className={`${inputCls} resize-none`} placeholder="Full biography…" />
        </div>
        <div>
          <label className={labelCls}>Joined date</label>
          <input type="date" value={joinedDate} onChange={(e) => setJoinedDate(e.target.value)} className={inputCls} />
        </div>
      </div>

      {/* ── Photo ── */}
      <div className={sectionCls}>
        <h3 className={h3Cls}>Profile photo</h3>
        <ImageUpload
          bucket="contributor-photos"
          currentUrl={photoUrl}
          onUploaded={setPhotoUrl}
          label="Profile photo (2 MB max)"
        />
        <div>
          <label className={labelCls}>Or paste URL directly</label>
          <input value={photoUrl} onChange={(e) => setPhotoUrl(e.target.value)} className={inputCls} placeholder="https://images.unsplash.com/…" />
        </div>
      </div>

      {/* ── Stats ── */}
      <div className={sectionCls}>
        <h3 className={h3Cls}>Stats</h3>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { label: "Trip count",        val: tripCount,    set: setTripCount    },
            { label: "Total contributions",val: totalContrib, set: setTotalContrib },
            { label: "Community answers", val: answers,      set: setAnswers      },
            { label: "Earnings this month",val: earnings,    set: setEarnings     },
          ].map(({ label, val, set }) => (
            <div key={label}>
              <label className={labelCls}>{label}</label>
              <input type="number" min={0} value={val} onChange={(e) => set(parseInt(e.target.value) || 0)} className={inputCls} />
            </div>
          ))}
        </div>
      </div>

      {/* ── Badges ── */}
      <div className={sectionCls}>
        <h3 className={h3Cls}>Badges</h3>
        <StringList label="One badge per line" value={badges} onChange={setBadges} placeholder="Spiti Valley Expert" />
      </div>

      {/* ── Destinations contributed ── */}
      <div className={sectionCls}>
        <h3 className={h3Cls}>Destinations contributed (slugs)</h3>
        <StringList label="Destination slugs" value={destinations} onChange={setDestinations} placeholder="goa-india" />
      </div>

      {/* ── Submit ── */}
      {error && (
        <p className="border border-rust/30 bg-rust/5 px-3 py-2 font-mono text-xs text-rust">{error}</p>
      )}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 border border-ink bg-ink py-3 font-mono text-xs uppercase tracking-widest text-warm-white transition-colors hover:bg-ink/80 disabled:opacity-40"
        >
          {loading ? "Saving…" : isEdit ? "Save changes" : "Create contributor"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/contributors")}
          className="border border-ww-border px-6 py-3 font-mono text-xs uppercase tracking-widest text-ww-muted hover:border-ink hover:text-ink"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
