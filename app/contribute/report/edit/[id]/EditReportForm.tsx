"use client";

import { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { resubmitReport } from "@/app/contribute/report/actions";

const CATEGORIES = [
  "Transport", "Accommodation", "Food & drink",
  "Street / market", "Temple / attraction", "Online", "Other",
];
const SEVERITIES = [
  { value: "critical", label: "Critical", desc: "Immediate danger / assault", color: "border-rust text-rust" },
  { value: "high",     label: "High",     desc: "Financial scam / harassment", color: "border-gold text-gold" },
  { value: "medium",   label: "Medium",   desc: "Overcharging / misleading",   color: "border-sage text-sage" },
];

const MAX_PHOTOS = 3;

interface DefaultValues {
  title: string;
  description: string;
  city: string | null;
  location: string | null;
  destination_slug: string | null;
  category: string | null;
  severity: string | null;
}

interface Props {
  reportId: string;
  defaults: DefaultValues;
}

export function EditReportForm({ reportId, defaults }: Props) {
  const [photos, setPhotos] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const filePickerRef = useRef<HTMLInputElement>(null);

  function addFiles(files: FileList | null) {
    if (!files) return;
    setPhotos((prev) => [...prev, ...Array.from(files)].slice(0, MAX_PHOTOS));
  }

  function removePhoto(idx: number) {
    setPhotos((prev) => prev.filter((_, i) => i !== idx));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    const fd = new FormData(e.currentTarget);
    fd.delete("photos");
    photos.forEach((f) => fd.append("photos", f));
    const result = await resubmitReport(reportId, fd);
    if (result?.error) {
      setError(result.error);
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">

      <div>
        <label className="mb-1 block text-xs text-ww-muted">
          Title <span className="text-rust">*</span>
        </label>
        <Input
          name="title"
          required
          defaultValue={defaults.title}
          placeholder="e.g. Fake taxi rank outside airport"
          className="border-ww-border bg-warm-white"
        />
      </div>

      <div>
        <label className="mb-1 block text-xs text-ww-muted">
          What happened? <span className="text-rust">*</span>
        </label>
        <textarea
          name="description"
          required
          minLength={20}
          rows={5}
          defaultValue={defaults.description}
          placeholder="Describe exactly what happened, where, when, and what to watch out for."
          className="w-full resize-none border border-ww-border bg-warm-white px-3 py-2 font-mono text-sm text-ink placeholder:text-ww-muted focus:border-ink focus:outline-none"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1 block text-xs text-ww-muted">City</label>
          <Input
            name="city"
            defaultValue={defaults.city ?? ""}
            placeholder="Goa"
            className="border-ww-border bg-warm-white"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs text-ww-muted">Specific location</label>
          <Input
            name="location"
            defaultValue={defaults.location ?? ""}
            placeholder="Airport / market name"
            className="border-ww-border bg-warm-white"
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-xs text-ww-muted">Destination (optional)</label>
        <Input
          name="destination_slug"
          defaultValue={defaults.destination_slug ?? ""}
          placeholder="e.g. goa-india"
          className="border-ww-border bg-warm-white text-sm"
        />
      </div>

      <div>
        <label className="mb-2 block text-xs text-ww-muted">Category</label>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <label key={cat} className="cursor-pointer">
              <input
                type="radio"
                name="category"
                value={cat}
                defaultChecked={defaults.category === cat}
                className="peer sr-only"
              />
              <span className="inline-block border border-ww-border bg-sand px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest text-ww-muted transition-colors peer-checked:border-ink peer-checked:bg-ink peer-checked:text-warm-white">
                {cat}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="mb-2 block text-xs text-ww-muted">
          Severity <span className="text-rust">*</span>
        </label>
        <div className="space-y-2">
          {SEVERITIES.map((s) => (
            <label key={s.value} className="flex cursor-pointer items-start gap-3">
              <input
                type="radio"
                name="severity"
                value={s.value}
                required
                defaultChecked={defaults.severity === s.value}
                className="mt-1 shrink-0"
              />
              <div>
                <span className={`font-mono text-xs font-semibold ${s.color.split(" ")[1]}`}>
                  {s.label}
                </span>
                <span className="ml-2 font-mono text-[10px] text-ww-muted">{s.desc}</span>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Photos — can add new ones; original photos are kept by the server action */}
      <div>
        <label className="mb-2 block text-xs text-ww-muted">
          Add new photos{" "}
          <span className="text-ww-muted/60">(max {MAX_PHOTOS}, optional)</span>
        </label>
        <input
          ref={filePickerRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => { addFiles(e.target.files); e.target.value = ""; }}
        />
        <button
          type="button"
          onClick={() => filePickerRef.current?.click()}
          disabled={photos.length >= MAX_PHOTOS}
          className="border border-ww-border bg-sand px-4 py-2 font-mono text-[10px] uppercase tracking-widest text-ww-muted transition-colors hover:border-ink hover:text-ink disabled:cursor-not-allowed disabled:opacity-50"
        >
          Choose files
        </button>
        {photos.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {photos.map((file, i) => (
              <div key={i} className="relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={URL.createObjectURL(file)}
                  alt={file.name}
                  className="h-16 w-16 border border-ww-border object-cover"
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
      </div>

      {error && <p className="text-sm text-rust">{error}</p>}

      <Button
        type="submit"
        disabled={submitting}
        className="w-full bg-rust text-warm-white hover:bg-rust/90"
      >
        {submitting ? "Resubmitting…" : "Resubmit for review →"}
      </Button>

      <p className="text-center text-xs text-ww-muted">
        Your revised report will go back into the review queue.
      </p>
    </form>
  );
}
