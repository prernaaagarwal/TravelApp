"use client";

import { useRef, useState, useTransition } from "react";
import { createClient } from "@/lib/supabase/client";
import { submitIdSelfie } from "./actions";

export function IdSelfieStep({
  userId,
  enabled,
  onSubmitted,
}: {
  userId: string;
  enabled: boolean;
  onSubmitted: () => void;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.size > 4 * 1024 * 1024) {
      setError("Image must be 4 MB or less.");
      return;
    }
    setError("");
    setFile(f);
    setPreview(URL.createObjectURL(f));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file) return;
    setError("");

    const supabase = createClient();
    const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
    const path = `${userId}/${Date.now()}.${ext}`;

    startTransition(async () => {
      const { error: uploadError } = await supabase.storage
        .from("id-verification")
        .upload(path, file, { upsert: false });
      if (uploadError) {
        setError(uploadError.message);
        return;
      }
      const fd = new FormData();
      fd.set("path", path);
      const res = await submitIdSelfie(fd);
      if ("error" in res && res.error) {
        setError(res.error);
        return;
      }
      onSubmitted();
    });
  }

  return (
    <div
      className={`rounded-xl border bg-warm-white p-6 shadow-sm transition-opacity ${
        enabled ? "border-ww-border" : "border-ww-border/40 opacity-50"
      }`}
    >
      <p className="mb-2 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-rust">
        <span className="grid h-5 w-5 place-items-center rounded-full bg-rust text-warm-white">2</span>
        ID + selfie photo
      </p>
      <p className="mb-4 font-mono text-xs leading-relaxed text-ww-muted">
        Hold any government photo ID (passport, driver&apos;s license, Aadhaar
        card etc.) next to your face and take one clear photo. We delete the
        photo as soon as your account is approved.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={!enabled || pending}
          className="border border-ww-border bg-sand px-4 py-2 font-mono text-[11px] uppercase tracking-widest text-ink transition-colors hover:border-ink disabled:cursor-not-allowed disabled:opacity-40"
        >
          {file ? "Replace photo" : "Choose photo"}
        </button>

        {preview && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={preview}
            alt="Preview"
            className="max-h-64 rounded border border-ww-border object-contain"
          />
        )}

        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleFile}
          className="hidden"
        />

        <button
          type="submit"
          disabled={!enabled || !file || pending}
          className="border border-rust bg-rust px-4 py-2 font-mono text-[11px] uppercase tracking-widest text-warm-white transition-opacity hover:opacity-90 disabled:opacity-40"
        >
          {pending ? "Uploading…" : "Submit for review →"}
        </button>

        <p className="font-mono text-[10px] text-ww-muted">
          JPG / PNG / WebP · max 4 MB
        </p>
      </form>

      {error && (
        <p className="mt-3 font-mono text-[11px] text-rust">{error}</p>
      )}
    </div>
  );
}
