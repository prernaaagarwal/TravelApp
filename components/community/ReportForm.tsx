"use client";

import { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { RustButton } from "@/components/ui/RustButton";
import { PlaceAutocomplete } from "@/components/ui/place-autocomplete";
import { type SelectedPlace } from "@/lib/google-places";
import { submitBewareReport } from "@/app/contribute/report/actions";

const CATEGORIES = ["Transport", "Accommodation", "Food & drink", "Street / market", "Temple / attraction", "Online", "Other"];
const SEVERITIES = [
  { value: "critical", label: "Critical", desc: "Immediate danger / assault", color: "border-rust text-rust" },
  { value: "high", label: "High", desc: "Financial scam / harassment", color: "border-gold text-gold" },
  { value: "medium", label: "Medium", desc: "Overcharging / misleading", color: "border-sage text-sage" },
];

// Washroom-specific lists. State maps server-side to severity (usable→medium,
// poor→high, unsafe→critical) so map pins + list cards reuse existing colour
// logic without forking the renderers.
const WASHROOM_TYPES = [
  { value: "public-toilet", label: "Public toilet" },
  { value: "mall",          label: "Mall / department store" },
  { value: "cafe",          label: "Cafe / restaurant" },
  { value: "petrol-pump",   label: "Petrol pump" },
  { value: "metro-station", label: "Metro / railway station" },
  { value: "sulabh",        label: "Sulabh complex" },
  { value: "hotel-lobby",   label: "Hotel lobby" },
  { value: "other",         label: "Other" },
];
const WASHROOM_STATES = [
  { value: "usable", label: "Usable",  desc: "Clean enough, would use again",     color: "border-sage text-sage" },
  { value: "poor",   label: "Poor",    desc: "Dirty / smelly but functional",      color: "border-gold text-gold" },
  { value: "unsafe", label: "Unsafe",  desc: "Locked, broken, or unsafe to enter", color: "border-rust text-rust" },
];

const MAX_PHOTOS = 3;

export function ReportForm() {
  // ── Location state ────────────────────────────────────────────────────────
  // Two mutually-exclusive paths:
  //   1. "Pinpoint" mode (default): user picks a real place via autocomplete.
  //      We store place_id + formatted_address + lat/lng + derived city.
  //      Pin shows on the map automatically once moderated.
  //   2. "Area-wide" mode: user toggles on for legitimate area scams
  //      ("city-wide", "online", "all auto-rickshaws"). Plain text fields,
  //      no coords stored. Surfaces in the Beware Board feed only.
  const [selectedPlace, setSelectedPlace] = useState<SelectedPlace | null>(null);
  const [areaLevel, setAreaLevel] = useState(false);
  const [areaCity, setAreaCity] = useState("");
  const [areaLocation, setAreaLocation] = useState("");

  // ── GPS button state (separate from autocomplete — used for photo capture
  // authentication so users can't fake a report from another city).
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsStatus, setGpsStatus] = useState<"idle" | "got" | "denied">("idle");
  const [gpsLat, setGpsLat] = useState("");
  const [gpsLng, setGpsLng] = useState("");

  const [photos, setPhotos] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Report-type discriminator. "scam" is the legacy default; "washroom" swaps
  // the severity field for a state field, hides category, and adds the
  // washroom_type select. The same map / moderation queue handles both.
  const [reportType, setReportType] = useState<"scam" | "washroom">("scam");
  const [washroomType, setWashroomType] = useState("public-toilet");
  const [washroomState, setWashroomState] = useState("usable");

  // Defamation guardrail — must be ticked before submit. Tracked client-side
  // and ALSO checked in handleSubmit to prevent button-disabled bypass.
  const [acknowledged, setAcknowledged] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const filePickerRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);

  function getGps() {
    if (!navigator.geolocation) { setGpsStatus("denied"); return; }
    setGpsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setGpsLat(pos.coords.latitude.toFixed(6));
        setGpsLng(pos.coords.longitude.toFixed(6));
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

  function toggleAreaLevel(next: boolean) {
    setAreaLevel(next);
    // Switching modes clears the OTHER mode's data so we never submit a
    // mix of stale autocomplete coords + manual area text.
    if (next) {
      setSelectedPlace(null);
    } else {
      setAreaCity("");
      setAreaLocation("");
    }
  }

  // ── Coords reconciliation: autocomplete-selected coords are authoritative.
  // GPS button coords only count if no place is selected (legacy behaviour
  // for users without place selection — e.g. photo-only reports).
  const finalLat = selectedPlace ? String(selectedPlace.lat) : gpsLat;
  const finalLng = selectedPlace ? String(selectedPlace.lng) : gpsLng;
  const finalCity = selectedPlace ? selectedPlace.city : areaCity;
  const finalLocation = selectedPlace ? selectedPlace.formattedAddress : areaLocation;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    // Defamation guardrail — every submission must affirm the Code of Conduct.
    if (!acknowledged) {
      setError("Please confirm the moderation acknowledgement at the bottom before submitting.");
      return;
    }

    // Client-side guard: must have either a selected place OR area-level mode
    // with at least a city. Prevents empty-location submissions which would
    // be useless on both the map and the feed.
    if (!selectedPlace && !areaLevel) {
      setError("Please pick a place from the dropdown, or toggle 'This happens across an area'.");
      return;
    }
    if (areaLevel && !areaCity.trim()) {
      setError("Area-wide reports still need a city.");
      return;
    }

    setSubmitting(true);
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

      {/* Moderation + defamation notice — first thing the reporter reads */}
      <div className="border border-rust/30 bg-rust-light/40 px-4 py-3">
        <p className="mb-1 font-mono text-[10px] uppercase tracking-[0.2em] text-rust">
          Before you submit
        </p>
        <ul className="space-y-1.5 font-mono text-xs leading-relaxed text-ink">
          <li>
            <strong>A moderator reviews every report within 24 hours.</strong>{" "}
            Nothing is published before review.
          </li>
          <li>
            Describe a <strong>pattern</strong>, not a one-off grievance. We
            reject reports that read as personal disputes.
          </li>
          <li>
            Naming a specific business or person?{" "}
            <strong>Attach evidence</strong> — photo, screenshot, GPS, or a
            police FIR reference. Our{" "}
            <a
              href="/code-of-conduct"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-rust"
            >
              Code of Conduct
            </a>{" "}
            explains the bar.
          </li>
          <li>
            Stick to <strong>observable facts</strong>: what happened, when,
            where. Avoid characterisations
            (&ldquo;creepy&rdquo;, &ldquo;dishonest&rdquo;) — write the
            underlying behaviour.
          </li>
        </ul>
      </div>

      {/* title */}
      <div>
        <label className="block text-xs text-ww-muted mb-1">
          {reportType === "washroom" ? "Place / landmark name" : "Title"} <span className="text-rust">*</span>
        </label>
        <Input
          name="title"
          required
          placeholder={reportType === "washroom"
            ? "e.g. Indira Gandhi Metro toilet near gate 4"
            : "e.g. Fake taxi rank outside airport"}
          className="bg-warm-white border-ww-border"
        />
      </div>

      {/* description */}
      <div>
        <label className="block text-xs text-ww-muted mb-1">
          {reportType === "washroom" ? "Current condition" : "What happened?"} <span className="text-rust">*</span>
        </label>
        <textarea
          name="description"
          required
          minLength={20}
          rows={5}
          placeholder={reportType === "washroom"
            ? "Cleanliness, fee, accessibility, hand-wash + soap, female attendant, sanitary disposal — describe what you observed today."
            : "Describe exactly what happened, where, when, and what to watch out for. The more detail, the more useful."}
          className="w-full resize-none border border-ww-border bg-warm-white px-3 py-2 font-mono text-sm text-ink placeholder:text-ww-muted focus:outline-none focus:border-ink"
        />
      </div>

      {/* ── Where did this happen? ─────────────────────────────────────── */}
      <div>
        <label htmlFor="place-input" className="block text-xs text-ww-muted mb-1">
          Where did this happen? <span className="text-rust">*</span>
        </label>

        {!areaLevel ? (
          <>
            <PlaceAutocomplete
              inputId="place-input"
              onSelect={setSelectedPlace}
              placeholder="Search for a place — e.g. 'Lake Pichola' or 'Sarjapur Road'"
            />
            {selectedPlace && (
              <p className="mt-1 font-mono text-[10px] text-sage">
                ✓ Pinned: {selectedPlace.formattedAddress}
              </p>
            )}
          </>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] text-ww-muted mb-1">City *</label>
              <Input
                value={areaCity}
                onChange={(e) => setAreaCity(e.target.value)}
                placeholder="Goa"
                className="bg-warm-white border-ww-border"
              />
            </div>
            <div>
              <label className="block text-[10px] text-ww-muted mb-1">Description of area</label>
              <Input
                value={areaLocation}
                onChange={(e) => setAreaLocation(e.target.value)}
                placeholder="e.g. all auto-rickshaws, city-wide"
                className="bg-warm-white border-ww-border"
              />
            </div>
          </div>
        )}

        <label className="mt-2 flex cursor-pointer items-center gap-2 text-xs text-ww-muted">
          <input
            type="checkbox"
            checked={areaLevel}
            onChange={(e) => toggleAreaLevel(e.target.checked)}
            className="h-3.5 w-3.5"
          />
          This happens across an area, not at one specific spot
        </label>
      </div>

      {/* hidden inputs that actually go into formData */}
      <input type="hidden" name="city" value={finalCity} />
      <input type="hidden" name="location" value={finalLocation} />
      <input type="hidden" name="gps_lat" value={finalLat} />
      <input type="hidden" name="gps_lng" value={finalLng} />
      <input type="hidden" name="place_id" value={selectedPlace?.placeId ?? ""} />
      <input type="hidden" name="formatted_address" value={selectedPlace?.formattedAddress ?? ""} />
      <input type="hidden" name="report_type" value={reportType} />
      {reportType === "washroom" && (
        <>
          <input type="hidden" name="washroom_type"  value={washroomType} />
          <input type="hidden" name="washroom_state" value={washroomState} />
        </>
      )}

      {/* report-type toggle — top of the form */}
      <div>
        <label className="block text-xs text-ww-muted mb-2">What are you reporting? <span className="text-rust">*</span></label>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setReportType("scam")}
            className={`border px-3 py-3 text-left transition-colors ${
              reportType === "scam"
                ? "border-ink bg-ink text-warm-white"
                : "border-ww-border bg-sand text-ink hover:border-ink"
            }`}
          >
            <span className="block font-mono text-[10px] uppercase tracking-widest">Scam / safety</span>
            <span className="mt-1 block font-mono text-[11px] opacity-80">Cab, hostel, harassment, online fraud</span>
          </button>
          <button
            type="button"
            onClick={() => setReportType("washroom")}
            className={`border px-3 py-3 text-left transition-colors ${
              reportType === "washroom"
                ? "border-ink bg-ink text-warm-white"
                : "border-ww-border bg-sand text-ink hover:border-ink"
            }`}
          >
            <span className="block font-mono text-[10px] uppercase tracking-widest">🚻 Washroom</span>
            <span className="mt-1 block font-mono text-[11px] opacity-80">Pin a usable, poor, or unsafe public washroom</span>
          </button>
        </div>
      </div>

      {/* destination slug */}
      <div>
        <label className="block text-xs text-ww-muted mb-1">Destination (optional)</label>
        <Input name="destination_slug" placeholder="e.g. goa-india" className="bg-warm-white border-ww-border text-sm" />
        <p className="mt-1 text-[10px] text-ww-muted">Links your report to the intel card for that destination.</p>
      </div>

      {/* category — scam only. Washrooms use washroom_type below. */}
      {reportType === "scam" && (
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
      )}

      {/* washroom type — washroom only */}
      {reportType === "washroom" && (
        <div>
          <label className="block text-xs text-ww-muted mb-2">Washroom type <span className="text-rust">*</span></label>
          <select
            value={washroomType}
            onChange={(e) => setWashroomType(e.target.value)}
            className="w-full border border-ww-border bg-warm-white px-3 py-2 font-mono text-sm text-ink focus:border-rust outline-none"
          >
            {WASHROOM_TYPES.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </div>
      )}

      {/* severity — scam only. Washrooms use state below. */}
      {reportType === "scam" && (
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
      )}

      {/* state — washroom only */}
      {reportType === "washroom" && (
        <div>
          <label className="block text-xs text-ww-muted mb-2">Current state <span className="text-rust">*</span></label>
          <div className="space-y-2">
            {WASHROOM_STATES.map((s) => (
              <label key={s.value} className="flex cursor-pointer items-start gap-3">
                <input
                  type="radio"
                  name="washroom_state_radio"
                  value={s.value}
                  checked={washroomState === s.value}
                  onChange={() => setWashroomState(s.value)}
                  className="mt-1 shrink-0"
                />
                <div>
                  <span className={`font-mono text-xs font-semibold ${s.color.split(" ")[1]}`}>{s.label}</span>
                  <span className="ml-2 font-mono text-[10px] text-ww-muted">{s.desc}</span>
                </div>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* GPS — for photo-capture authentication. Doesn't override
          autocomplete coords, just enables in-the-moment camera capture. */}
      <div>
        <label className="block text-xs text-ww-muted mb-2">My current location (optional, for live photo)</label>
        <button
          type="button"
          onClick={getGps}
          disabled={gpsLoading || gpsStatus === "got"}
          className="border border-ww-border bg-sand px-4 py-2 font-mono text-[10px] uppercase tracking-widest text-ww-muted hover:border-ink hover:text-ink transition-colors disabled:opacity-60"
        >
          {gpsLoading ? "Getting location…" : gpsStatus === "got" ? `✓ Got GPS (${gpsLat}, ${gpsLng})` : "📍 Use my current location"}
        </button>
        {gpsStatus === "denied" && (
          <p className="mt-1 text-[10px] text-rust">Location permission denied — skipping GPS.</p>
        )}
        <p className="mt-1 text-[10px] text-ww-muted">
          Required to use the Capture button below — every captured photo is geo-tagged so reports can&apos;t be faked from another city.
        </p>
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
          <RustButton
            type="button"
            size="sm"
            onClick={triggerCapture}
            disabled={captureDisabled}
            title={gpsStatus !== "got" ? "Turn on location first" : photos.length >= MAX_PHOTOS ? "Photo limit reached" : "Open camera"}
          >
            📷 Capture
          </RustButton>
        </div>

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

      {/* Defamation acknowledgement — gates submit. No submission goes through
          without this affirmed. */}
      <label className="flex items-start gap-3 border border-ww-border bg-warm-white p-4 cursor-pointer hover:border-rust transition-colors">
        <input
          type="checkbox"
          required
          checked={acknowledged}
          onChange={(e) => setAcknowledged(e.target.checked)}
          className="mt-0.5 h-4 w-4 shrink-0 accent-rust"
        />
        <span className="font-mono text-[11px] leading-relaxed text-ink">
          I confirm this report is accurate to the best of my knowledge,
          describes a pattern I personally observed (or heard from a named,
          contactable witness), and that I have read the{" "}
          <a
            href="/code-of-conduct"
            target="_blank"
            rel="noopener noreferrer"
            className="text-rust underline underline-offset-2"
          >
            Code of Conduct
          </a>
          . I understand a moderator may edit, reject, or contact me for
          additional evidence before publication.
        </span>
      </label>

      {error && <p className="text-sm text-rust">{error}</p>}

      <RustButton type="submit" size="md" block disabled={submitting || !acknowledged}>
        {submitting
          ? "Submitting report…"
          : reportType === "washroom"
          ? "Submit washroom report →"
          : "Submit beware report →"}
      </RustButton>

      <p className="text-center text-xs text-ww-muted">
        Reviewed by a human moderator within 24 hours · published only after
        approval · you&apos;ll get an email with the outcome.
      </p>
    </form>
  );
}
