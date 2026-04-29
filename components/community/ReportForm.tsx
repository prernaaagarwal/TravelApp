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

const MAX_PHOTOS = 3;

export function ReportForm() {
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsStatus, setGpsStatus] = useState<"idle" | "got" | "denied">("idle");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [photos, setPhotos] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const formRef = useRef<HTMLFormElement>(null);
  const filePickerRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);

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

  function addFiles(incoming: FileList | null) {
    if (!incoming) return;
    const merged = [...photos, ...Array.from(incoming)].slice(0, MAX_PHOTOS);
    setPhotos(merged);
  }

  function removePhoto(idx: number) {
    setPhotos(photos.filter((_, i) => i !== idx));
  }

  function triggerCapture() {
    if (gpsStatus !== "got") return;
    cameraRef.current?.click();
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    const fd = new FormData(e.currentTarget);
    fd.delete("photos");
    photos.forEach((f) => fd.append("photos", f));
    const result = await submitBewareReport(fd);
    if (result?.error) {
      setError(result.error);
      setSubmitting(false);
    }
  }

  const captureDisabled = gpsStatus !== "got" || photos.length >= MAX_PHOTOS;
  const pickerDisabled = photos.length >= MAX_PHOTOS;

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
        <label className="block text-xs text-ww-muted mb-2">
          Photos <span className="text-ww-muted/60">(max {MAX_PHOTOS}, optional)</span>
        </label>

        {/* hidden inputs */}
        <input
          ref={filePickerRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => { addFiles(e.target.files); e.target.value = ""; }}
        />
        <input
          ref={cameraRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={(e) => { addFiles(e.target.files); e.target.value = ""; }}
        />

        {/* button row */}
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => filePickerRef.current?.click()}
            disabled={pickerDisabled}
            className="border border-ww-border bg-sand px-4 py-2 font-mono text-[10px] uppercase tracking-widest text-ww-muted hover:border-ink hover:text-ink transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Choose files
          </button>
          <button
            type="button"
            onClick={triggerCapture}
            disabled={captureDisabled}
            title={gpsStatus !== "got" ? "Turn on location first" : photos.length >= MAX_PHOTOS ? "Photo limit reached" : "Open camera"}
            className="border border-rust bg-rust px-4 py-2 font-mono text-[10px] uppercase tracking-widest text-warm-white hover:bg-rust/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            📷 Capture
          </button>
        </div>

        {gpsStatus !== "got" && (
          <p className="mt-2 text-[10px] text-ww-muted">
            Turn on <span className="text-ink">location</span> above to use Capture — every captured photo is geo-tagged so reports can&apos;t be faked from another city.
          </p>
        )}

        {photos.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {photos.map((file, i) => (
              <div key={i} className="relative">
                {/* eslint-disable-next-line @next/next/no-img-element -- blob URLs from createObjectURL are not supported by next/image */}
                <img
                  src={URL.createObjectURL(file)}
                  alt={file.name}
                  className="h-16 w-16 object-cover border border-ww-border"
                />
                <button
                  type="button"
                  onClick={() => removePhoto(i)}
                  aria-label={`Remove ${file.name}`}
                  className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-ink font-mono text-[10px] text-warm-white hover:bg-rust"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        <p className="mt-2 text-[10px] text-ww-muted">
          Photos require the beware-photos storage bucket in Supabase. Upload skipped if bucket missing.
        </p>
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
