"use client";

import { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { submitBewareReport } from "@/app/contribute/report/actions";

const CATEGORIES = ["Transport", "Accommodation", "Food & drink", "Street / market", "Temple / attraction", "Online", "Other"];
const SEVERITIES = [
  { value: "critical", label: "Critical", desc: "Immediate danger / assault", color: "border-rust text-rust" },
  { value: "high", label: "High", desc: "Financial scam / harassment", color: "border-gold text-gold" },
  { value: "medium", label: "Medium", desc: "Overcharging / misleading", color: "border-sage text-sage" },
];

export function ReportForm() {
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsStatus, setGpsStatus] = useState<"idle" | "got" | "denied">("idle");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [previews, setPreviews] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  function getGps() {
    if (!navigator.geolocation) { setGpsStatus("denied"); return; }
    setGpsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLat(pos.coords.latitude.toFixed(6));
        setLng(pos.coords.longitude.toFixed(6));
        setGpsStatus("got");
        setGpsLoading(false);
      },
      () => { setGpsStatus("denied"); setGpsLoading(false); }
    );
  }

  function onPhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []).slice(0, 3);
    setPreviews(files.map((f) => URL.createObjectURL(f)));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    const result = await submitBewareReport(new FormData(e.currentTarget));
    if (result?.error) {
      setError(result.error);
      setSubmitting(false);
    }
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">

      {/* title */}
      <div>
        <label className="block text-xs text-ww-muted mb-1">
          Title <span className="text-rust">*</span>
        </label>
        <Input
          name="title"
          required
          placeholder="e.g. Fake taxi rank outside airport"
          className="bg-warm-white border-ww-border"
        />
      </div>

      {/* description */}
      <div>
        <label className="block text-xs text-ww-muted mb-1">
          What happened? <span className="text-rust">*</span>
        </label>
        <textarea
          name="description"
          required
          minLength={20}
          rows={5}
          placeholder="Describe exactly what happened, where, when, and what to watch out for. The more detail, the more useful."
          className="w-full resize-none border border-ww-border bg-warm-white px-3 py-2 font-mono text-sm text-ink placeholder:text-ww-muted focus:outline-none focus:border-ink"
        />
      </div>

      {/* city + location */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs text-ww-muted mb-1">City</label>
          <Input name="city" placeholder="Goa" className="bg-warm-white border-ww-border" />
        </div>
        <div>
          <label className="block text-xs text-ww-muted mb-1">Specific location</label>
          <Input name="location" placeholder="Airport / market name" className="bg-warm-white border-ww-border" />
        </div>
      </div>

      {/* destination slug */}
      <div>
        <label className="block text-xs text-ww-muted mb-1">Destination (optional)</label>
        <Input name="destination_slug" placeholder="e.g. goa-india" className="bg-warm-white border-ww-border text-sm" />
        <p className="mt-1 text-[10px] text-ww-muted">Links your report to the intel card for that destination.</p>
      </div>

      {/* category */}
      <div>
        <label className="block text-xs text-ww-muted mb-2">Category</label>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <label key={cat} className="cursor-pointer">
              <input type="radio" name="category" value={cat} className="sr-only peer" />
              <span className="inline-block border border-ww-border bg-sand px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest text-ww-muted peer-checked:border-ink peer-checked:bg-ink peer-checked:text-warm-white transition-colors">
                {cat}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* severity */}
      <div>
        <label className="block text-xs text-ww-muted mb-2">Severity <span className="text-rust">*</span></label>
        <div className="space-y-2">
          {SEVERITIES.map((s) => (
            <label key={s.value} className="flex cursor-pointer items-start gap-3">
              <input type="radio" name="severity" value={s.value} required className="mt-1 shrink-0" />
              <div>
                <span className={`font-mono text-xs font-semibold ${s.color.split(" ")[1]}`}>{s.label}</span>
                <span className="ml-2 font-mono text-[10px] text-ww-muted">{s.desc}</span>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* GPS */}
      <div>
        <label className="block text-xs text-ww-muted mb-2">Location pin (optional)</label>
        <input type="hidden" name="gps_lat" value={lat} />
        <input type="hidden" name="gps_lng" value={lng} />
        <button
          type="button"
          onClick={getGps}
          disabled={gpsLoading || gpsStatus === "got"}
          className="border border-ww-border bg-sand px-4 py-2 font-mono text-[10px] uppercase tracking-widest text-ww-muted hover:border-ink hover:text-ink transition-colors disabled:opacity-60"
        >
          {gpsLoading ? "Getting location…" : gpsStatus === "got" ? `✓ Got GPS (${lat}, ${lng})` : "📍 Use my current location"}
        </button>
        {gpsStatus === "denied" && (
          <p className="mt-1 text-[10px] text-rust">Location permission denied — skipping GPS.</p>
        )}
      </div>

      {/* photos */}
      <div>
        <label className="block text-xs text-ww-muted mb-2">Photos <span className="text-ww-muted/60">(max 3, optional)</span></label>
        <input
          type="file"
          name="photos"
          accept="image/*"
          multiple
          onChange={onPhotoChange}
          className="block w-full font-mono text-xs text-ww-muted file:mr-3 file:border file:border-ww-border file:bg-sand file:px-3 file:py-1.5 file:font-mono file:text-[10px] file:uppercase file:tracking-widest file:text-ww-muted hover:file:border-ink hover:file:text-ink"
        />
        {previews.length > 0 && (
          <div className="mt-3 flex gap-2">
            {previews.map((src, i) => (
              <img key={i} src={src} alt="" className="h-16 w-16 object-cover border border-ww-border" />
            ))}
          </div>
        )}
        <p className="mt-1 text-[10px] text-ww-muted">Photos require the beware-photos storage bucket to be created in Supabase. Upload skipped if bucket missing.</p>
      </div>

      {error && <p className="text-sm text-rust">{error}</p>}

      <Button
        type="submit"
        disabled={submitting}
        className="w-full bg-rust text-warm-white hover:bg-rust/90"
      >
        {submitting ? "Submitting report…" : "Submit beware report →"}
      </Button>

      <p className="text-center text-xs text-ww-muted">
        All reports are reviewed before going live. Usually within 24 hours.
      </p>
    </form>
  );
}
