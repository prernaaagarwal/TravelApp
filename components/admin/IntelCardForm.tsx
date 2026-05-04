"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ImageUpload } from "./ImageUpload";
import { upsertIntelCard } from "@/app/admin/intel/actions";

// ── Types matching the DB JSONB schemas ─────────────────────────────────────

interface Neighborhood {
  name: string; safetyRating: number; vibe: string; stayHere: boolean; notes: string;
}
interface Scam {
  title: string; severity: string; where: string; what: string; avoid: string;
}
interface Transport {
  mode: string; tip: string; approxCost: string;
}
interface HiddenGem {
  name: string; type: string; angle: string; why: string; approxCost: string;
}
interface EmergencyNumber {
  label: string; number: string;
}
interface Budget {
  backpacker: number; midRange: number; comfortable: number; currency: string;
}

export interface IntelCardInitial {
  slug?: string;
  destination?: string;
  country?: string;
  audience?: string;
  contributor_slug?: string;
  last_updated?: string;
  verified_by_count?: number;
  hero_image_url?: string;
  is_premium?: boolean;
  premium_preview?: string;
  tldr?: string[];
  neighborhoods?: Neighborhood[];
  scams?: Scam[];
  transport?: Transport[];
  hidden_gems?: HiddenGem[];
  pre_book_checklist?: string[];
  dos_and_donts?: { do: string[]; dont: string[] };
  estimated_daily_budget?: Budget;
  emergency_numbers?: EmergencyNumber[];
  affiliate_links?: Record<string, string>;
}

// ── Shared style helpers ─────────────────────────────────────────────────────

const inputCls = "w-full border border-ww-border bg-warm-white px-3 py-2 font-mono text-sm text-ink placeholder:text-ww-muted focus:outline-none focus:border-ink";
const labelCls = "block font-mono text-[10px] uppercase tracking-widest text-ww-muted mb-1";
const sectionCls = "border border-ww-border bg-sand p-4 space-y-4";
const h3Cls = "font-mono text-[10px] uppercase tracking-widest text-ww-muted";

// ── Reusable string-array editor ─────────────────────────────────────────────

function StringList({
  label, value, onChange, placeholder,
}: {
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
              onChange={(e) => {
                const next = [...value];
                next[i] = e.target.value;
                onChange(next);
              }}
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

// ── Main form ────────────────────────────────────────────────────────────────

export function IntelCardForm({ initial = {}, isEdit = false }: { initial?: IntelCardInitial; isEdit?: boolean }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  // Scalar fields
  const [slug,           setSlug          ] = useState(initial.slug             ?? "");
  const [destination,    setDestination   ] = useState(initial.destination      ?? "");
  const [country,        setCountry       ] = useState(initial.country          ?? "");
  const [audience,       setAudience      ] = useState(initial.audience         ?? "both");
  const [contribSlug,    setContribSlug   ] = useState(initial.contributor_slug ?? "");
  const [lastUpdated,    setLastUpdated   ] = useState(initial.last_updated     ?? "");
  const [verifiedBy,     setVerifiedBy    ] = useState(initial.verified_by_count ?? 0);
  const [heroImageUrl,   setHeroImageUrl  ] = useState(initial.hero_image_url   ?? "");
  const [isPremium,      setIsPremium     ] = useState(initial.is_premium       ?? false);
  const [premiumPreview, setPremiumPreview] = useState(initial.premium_preview  ?? "");

  // JSONB arrays
  const [tldr,            setTldr           ] = useState<string[]>     (initial.tldr             ?? []);
  const [neighborhoods,   setNeighborhoods  ] = useState<Neighborhood[]>(initial.neighborhoods   ?? []);
  const [scams,           setScams          ] = useState<Scam[]>       (initial.scams            ?? []);
  const [transport,       setTransport      ] = useState<Transport[]>  (initial.transport        ?? []);
  const [hiddenGems,      setHiddenGems     ] = useState<HiddenGem[]>  (initial.hidden_gems      ?? []);
  const [checklist,       setChecklist      ] = useState<string[]>     (initial.pre_book_checklist ?? []);
  const [dos,             setDos            ] = useState<string[]>     (initial.dos_and_donts?.do    ?? []);
  const [donts,           setDonts          ] = useState<string[]>     (initial.dos_and_donts?.dont  ?? []);
  const [budget,          setBudget         ] = useState<Budget>       (initial.estimated_daily_budget ?? { backpacker: 0, midRange: 0, comfortable: 0, currency: "INR" });
  const [emergencyNums,   setEmergencyNums  ] = useState<EmergencyNumber[]>(initial.emergency_numbers ?? []);
  const [affiliateLinks,  setAffiliateLinks ] = useState<Record<string, string>>(initial.affiliate_links ?? {});

  // Auto-generate slug from destination + country on create
  function autoSlug(dest: string, ctry: string) {
    if (isEdit) return;
    const combined = `${dest} ${ctry}`.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    setSlug(combined);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const fd = new FormData();
    fd.set("slug",                    slug);
    fd.set("destination",             destination);
    fd.set("country",                 country);
    fd.set("audience",                audience);
    fd.set("contributor_slug",        contribSlug);
    fd.set("last_updated",            lastUpdated);
    fd.set("verified_by_count",       String(verifiedBy));
    fd.set("hero_image_url",          heroImageUrl);
    fd.set("is_premium",              String(isPremium));
    fd.set("premium_preview",         premiumPreview);
    fd.set("tldr",                    JSON.stringify(tldr.filter(Boolean)));
    fd.set("neighborhoods",           JSON.stringify(neighborhoods));
    fd.set("scams",                   JSON.stringify(scams));
    fd.set("transport",               JSON.stringify(transport));
    fd.set("hidden_gems",             JSON.stringify(hiddenGems));
    fd.set("pre_book_checklist",      JSON.stringify(checklist.filter(Boolean)));
    fd.set("dos_and_donts",           JSON.stringify({ do: dos.filter(Boolean), dont: donts.filter(Boolean) }));
    fd.set("estimated_daily_budget",  JSON.stringify(budget));
    fd.set("emergency_numbers",       JSON.stringify(emergencyNums));
    fd.set("affiliate_links",         JSON.stringify(affiliateLinks));

    const result = await upsertIntelCard(fd);
    setLoading(false);
    if (result?.error) setError(result.error);
    // On success, upsertIntelCard redirects server-side
  }

  // ── Helpers for object arrays ──────────────────────────────────────────────

  function updateNeighborhood(i: number, key: keyof Neighborhood, val: string | number | boolean) {
    const next = neighborhoods.map((n, j) => j === i ? { ...n, [key]: val } : n);
    setNeighborhoods(next);
  }
  function addNeighborhood() {
    setNeighborhoods([...neighborhoods, { name: "", safetyRating: 3, vibe: "", stayHere: false, notes: "" }]);
  }

  function updateScam(i: number, key: keyof Scam, val: string) {
    const next = [...scams]; next[i] = { ...next[i], [key]: val }; setScams(next);
  }
  function addScam() {
    setScams([...scams, { title: "", severity: "medium", where: "", what: "", avoid: "" }]);
  }

  function updateTransport(i: number, key: keyof Transport, val: string) {
    const next = [...transport]; next[i] = { ...next[i], [key]: val }; setTransport(next);
  }
  function addTransport() {
    setTransport([...transport, { mode: "", tip: "", approxCost: "" }]);
  }

  function updateGem(i: number, key: keyof HiddenGem, val: string) {
    const next = [...hiddenGems]; next[i] = { ...next[i], [key]: val }; setHiddenGems(next);
  }
  function addGem() {
    setHiddenGems([...hiddenGems, { name: "", type: "", angle: "", why: "", approxCost: "" }]);
  }

  function updateEmergency(i: number, key: keyof EmergencyNumber, val: string) {
    const next = [...emergencyNums]; next[i] = { ...next[i], [key]: val }; setEmergencyNums(next);
  }
  function addEmergency() {
    setEmergencyNums([...emergencyNums, { label: "", number: "" }]);
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <form onSubmit={handleSubmit} className="space-y-6">

      {/* ── Basic info ── */}
      <div className={sectionCls}>
        <h3 className={h3Cls}>Basic info</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Destination name *</label>
            <input value={destination} onChange={(e) => { setDestination(e.target.value); autoSlug(e.target.value, country); }} required className={inputCls} placeholder="Goa" />
          </div>
          <div>
            <label className={labelCls}>Country *</label>
            <input value={country} onChange={(e) => { setCountry(e.target.value); autoSlug(destination, e.target.value); }} required className={inputCls} placeholder="India" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Slug * {isEdit && "(locked)"}</label>
            <input value={slug} onChange={(e) => !isEdit && setSlug(e.target.value)} readOnly={isEdit} required className={`${inputCls} ${isEdit ? "bg-sand opacity-60" : ""}`} placeholder="goa-india" />
          </div>
          <div>
            <label className={labelCls}>Audience</label>
            <select value={audience} onChange={(e) => setAudience(e.target.value)} className={inputCls}>
              <option value="both">Both (FO + FM)</option>
              <option value="foreign-women">Foreign women focus</option>
              <option value="domestic">Domestic women focus</option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Contributor slug</label>
            <input value={contribSlug} onChange={(e) => setContribSlug(e.target.value)} className={inputCls} placeholder="ananya-mumbai" />
          </div>
          <div>
            <label className={labelCls}>Last updated</label>
            <input type="date" value={lastUpdated} onChange={(e) => setLastUpdated(e.target.value)} className={inputCls} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Verified by count</label>
            <input type="number" min={0} value={verifiedBy} onChange={(e) => setVerifiedBy(parseInt(e.target.value) || 0)} className={inputCls} />
          </div>
          <div className="flex items-end gap-3 pb-0.5">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={isPremium} onChange={(e) => setIsPremium(e.target.checked)} className="h-4 w-4" />
              <span className="font-mono text-sm text-ink">Premium card</span>
            </label>
          </div>
        </div>
        {isPremium && (
          <div>
            <label className={labelCls}>Premium preview text</label>
            <textarea value={premiumPreview} onChange={(e) => setPremiumPreview(e.target.value)} rows={2} className={`${inputCls} resize-none`} />
          </div>
        )}
      </div>

      {/* ── Hero image ── */}
      <div className={sectionCls}>
        <h3 className={h3Cls}>Hero image</h3>
        <ImageUpload
          bucket="intel-images"
          currentUrl={heroImageUrl}
          onUploaded={setHeroImageUrl}
          label="Hero image (5 MB max, JPEG/PNG/WebP)"
        />
        <div>
          <label className={labelCls}>Or paste URL directly</label>
          <input value={heroImageUrl} onChange={(e) => setHeroImageUrl(e.target.value)} className={inputCls} placeholder="https://… or /images/intel/goa-india.jpg" />
        </div>
      </div>

      {/* ── TL;DR bullets ── */}
      <div className={sectionCls}>
        <h3 className={h3Cls}>TL;DR safety bullets</h3>
        <StringList
          label="One key safety fact per line"
          value={tldr}
          onChange={setTldr}
          placeholder="Drug possession setups on beaches are not myths."
        />
      </div>

      {/* ── Daily budget ── */}
      <div className={sectionCls}>
        <h3 className={h3Cls}>Estimated daily budget</h3>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {(["backpacker", "midRange", "comfortable"] as const).map((k) => (
            <div key={k}>
              <label className={labelCls}>{k}</label>
              <input
                type="number" min={0}
                value={budget[k]}
                onChange={(e) => setBudget({ ...budget, [k]: parseInt(e.target.value) || 0 })}
                className={inputCls}
              />
            </div>
          ))}
          <div>
            <label className={labelCls}>Currency</label>
            <input value={budget.currency} onChange={(e) => setBudget({ ...budget, currency: e.target.value })} className={inputCls} placeholder="INR" />
          </div>
        </div>
      </div>

      {/* ── Neighborhoods ── */}
      <div className={sectionCls}>
        <h3 className={h3Cls}>Neighborhoods ({neighborhoods.length})</h3>
        <div className="space-y-4">
          {neighborhoods.map((n, i) => (
            <div key={i} className="border border-ww-border bg-warm-white p-3 space-y-2">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>Name</label>
                  <input value={n.name} onChange={(e) => updateNeighborhood(i, "name", e.target.value)} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Safety rating (1–5)</label>
                  <input type="number" min={1} max={5} value={n.safetyRating} onChange={(e) => updateNeighborhood(i, "safetyRating", parseInt(e.target.value) || 3)} className={inputCls} />
                </div>
              </div>
              <div>
                <label className={labelCls}>Vibe</label>
                <input value={n.vibe} onChange={(e) => updateNeighborhood(i, "vibe", e.target.value)} className={inputCls} placeholder="Boutique cafés, quiet lanes" />
              </div>
              <div>
                <label className={labelCls}>Notes</label>
                <textarea value={n.notes} onChange={(e) => updateNeighborhood(i, "notes", e.target.value)} rows={2} className={`${inputCls} resize-none`} />
              </div>
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={n.stayHere} onChange={(e) => updateNeighborhood(i, "stayHere", e.target.checked)} className="h-4 w-4" />
                  <span className="font-mono text-xs text-ink">Recommend staying here</span>
                </label>
                <button type="button" onClick={() => setNeighborhoods(neighborhoods.filter((_, j) => j !== i))} className="font-mono text-[10px] text-rust hover:underline">Remove</button>
              </div>
            </div>
          ))}
          <button type="button" onClick={addNeighborhood} className="border border-ww-border px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest text-ww-muted hover:border-ink hover:text-ink">+ Add neighborhood</button>
        </div>
      </div>

      {/* ── Scams ── */}
      <div className={sectionCls}>
        <h3 className={h3Cls}>Scams & safety risks ({scams.length})</h3>
        <div className="space-y-4">
          {scams.map((s, i) => (
            <div key={i} className="border border-ww-border bg-warm-white p-3 space-y-2">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>Title</label>
                  <input value={s.title} onChange={(e) => updateScam(i, "title", e.target.value)} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Severity</label>
                  <select value={s.severity} onChange={(e) => updateScam(i, "severity", e.target.value)} className={inputCls}>
                    <option value="critical">Critical</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
              </div>
              <div>
                <label className={labelCls}>Where</label>
                <input value={s.where} onChange={(e) => updateScam(i, "where", e.target.value)} className={inputCls} placeholder="Anjuna Beach, Goa" />
              </div>
              <div>
                <label className={labelCls}>What happens</label>
                <textarea value={s.what} onChange={(e) => updateScam(i, "what", e.target.value)} rows={2} className={`${inputCls} resize-none`} />
              </div>
              <div>
                <label className={labelCls}>How to avoid</label>
                <textarea value={s.avoid} onChange={(e) => updateScam(i, "avoid", e.target.value)} rows={2} className={`${inputCls} resize-none`} />
              </div>
              <button type="button" onClick={() => setScams(scams.filter((_, j) => j !== i))} className="font-mono text-[10px] text-rust hover:underline">Remove</button>
            </div>
          ))}
          <button type="button" onClick={addScam} className="border border-ww-border px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest text-ww-muted hover:border-ink hover:text-ink">+ Add scam / risk</button>
        </div>
      </div>

      {/* ── Transport ── */}
      <div className={sectionCls}>
        <h3 className={h3Cls}>Transport ({transport.length})</h3>
        <div className="space-y-3">
          {transport.map((t, i) => (
            <div key={i} className="border border-ww-border bg-warm-white p-3 space-y-2">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>Mode</label>
                  <input value={t.mode} onChange={(e) => updateTransport(i, "mode", e.target.value)} className={inputCls} placeholder="GoaMiles app" />
                </div>
                <div>
                  <label className={labelCls}>Approx cost</label>
                  <input value={t.approxCost} onChange={(e) => updateTransport(i, "approxCost", e.target.value)} className={inputCls} placeholder="₹800–1,200" />
                </div>
              </div>
              <div>
                <label className={labelCls}>Tip</label>
                <textarea value={t.tip} onChange={(e) => updateTransport(i, "tip", e.target.value)} rows={2} className={`${inputCls} resize-none`} />
              </div>
              <button type="button" onClick={() => setTransport(transport.filter((_, j) => j !== i))} className="font-mono text-[10px] text-rust hover:underline">Remove</button>
            </div>
          ))}
          <button type="button" onClick={addTransport} className="border border-ww-border px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest text-ww-muted hover:border-ink hover:text-ink">+ Add transport mode</button>
        </div>
      </div>

      {/* ── Hidden gems ── */}
      <div className={sectionCls}>
        <h3 className={h3Cls}>Hidden gems ({hiddenGems.length})</h3>
        <div className="space-y-3">
          {hiddenGems.map((g, i) => (
            <div key={i} className="border border-ww-border bg-warm-white p-3 space-y-2">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>Name</label>
                  <input value={g.name} onChange={(e) => updateGem(i, "name", e.target.value)} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Type</label>
                  <input value={g.type} onChange={(e) => updateGem(i, "type", e.target.value)} className={inputCls} placeholder="Boutique stay + café" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>Angle (FO/FM/VS)</label>
                  <input value={g.angle} onChange={(e) => updateGem(i, "angle", e.target.value)} className={inputCls} placeholder="FO+FM" />
                </div>
                <div>
                  <label className={labelCls}>Approx cost</label>
                  <input value={g.approxCost} onChange={(e) => updateGem(i, "approxCost", e.target.value)} className={inputCls} placeholder="₹3,000–₹6,000/night" />
                </div>
              </div>
              <div>
                <label className={labelCls}>Why (description)</label>
                <textarea value={g.why} onChange={(e) => updateGem(i, "why", e.target.value)} rows={2} className={`${inputCls} resize-none`} />
              </div>
              <button type="button" onClick={() => setHiddenGems(hiddenGems.filter((_, j) => j !== i))} className="font-mono text-[10px] text-rust hover:underline">Remove</button>
            </div>
          ))}
          <button type="button" onClick={addGem} className="border border-ww-border px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest text-ww-muted hover:border-ink hover:text-ink">+ Add hidden gem</button>
        </div>
      </div>

      {/* ── Pre-book checklist ── */}
      <div className={sectionCls}>
        <h3 className={h3Cls}>Pre-book checklist</h3>
        <StringList label="Action items" value={checklist} onChange={setChecklist} placeholder="Download GoaMiles before your flight lands" />
      </div>

      {/* ── Dos and donts ── */}
      <div className={sectionCls}>
        <h3 className={h3Cls}>Dos and don&#39;ts</h3>
        <StringList label="Do" value={dos} onChange={setDos} placeholder="Use only pre-agreed fixed taxi fares" />
        <StringList label="Don't" value={donts} onChange={setDonts} placeholder="Hand over your passport as collateral" />
      </div>

      {/* ── Emergency numbers ── */}
      <div className={sectionCls}>
        <h3 className={h3Cls}>Emergency numbers ({emergencyNums.length})</h3>
        <div className="space-y-2">
          {emergencyNums.map((n, i) => (
            <div key={i} className="flex gap-2">
              <input value={n.label} onChange={(e) => updateEmergency(i, "label", e.target.value)} placeholder="Women's Helpline" className={`${inputCls} flex-1`} />
              <input value={n.number} onChange={(e) => updateEmergency(i, "number", e.target.value)} placeholder="1091" className={`${inputCls} w-32`} />
              <button type="button" onClick={() => setEmergencyNums(emergencyNums.filter((_, j) => j !== i))} className="shrink-0 border border-rust/40 px-3 font-mono text-[10px] text-rust hover:bg-rust hover:text-warm-white">✕</button>
            </div>
          ))}
          <button type="button" onClick={addEmergency} className="border border-ww-border px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest text-ww-muted hover:border-ink hover:text-ink">+ Add number</button>
        </div>
      </div>

      {/* ── Affiliate links ── */}
      <div className={sectionCls}>
        <h3 className={h3Cls}>Affiliate links</h3>
        <div className="space-y-2">
          {Object.entries(affiliateLinks).map(([key, val]) => (
            <div key={key} className="flex gap-2">
              <input value={key} readOnly className={`${inputCls} w-36 bg-sand`} />
              <input value={val} onChange={(e) => setAffiliateLinks({ ...affiliateLinks, [key]: e.target.value })} placeholder="https://…" className={`${inputCls} flex-1`} />
              <button type="button" onClick={() => { const next = { ...affiliateLinks }; delete next[key]; setAffiliateLinks(next); }} className="shrink-0 border border-rust/40 px-3 font-mono text-[10px] text-rust hover:bg-rust hover:text-warm-white">✕</button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => {
              const key = prompt("Affiliate key (e.g. booking, worldNomads):");
              if (key && key.trim()) setAffiliateLinks({ ...affiliateLinks, [key.trim()]: "" });
            }}
            className="border border-ww-border px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest text-ww-muted hover:border-ink hover:text-ink"
          >
            + Add affiliate link
          </button>
        </div>
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
          {loading ? "Saving…" : isEdit ? "Save changes" : "Create intel card"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/intel")}
          className="border border-ww-border px-6 py-3 font-mono text-xs uppercase tracking-widest text-ww-muted hover:border-ink hover:text-ink"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
