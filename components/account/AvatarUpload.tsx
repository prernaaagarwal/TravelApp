"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";

interface AvatarUploadProps {
  userId: string;
  currentUrl: string | null;
  onUploaded: (url: string) => void;
}

export function AvatarUpload({ userId, currentUrl, onUploaded }: AvatarUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState<string | null>(currentUrl);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError("");

    const supabase = createClient();
    const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
    const path = `${userId}/avatar.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("user-photos")
      .upload(path, file, { upsert: true });

    if (uploadError) {
      setError(uploadError.message);
      setUploading(false);
      return;
    }

    // Bust CDN cache by appending a timestamp query param
    const { data } = supabase.storage.from("user-photos").getPublicUrl(path);
    const url = `${data.publicUrl}?t=${Date.now()}`;

    // Persist to profiles row
    await supabase.from("profiles").update({ photo_url: url }).eq("id", userId);

    setPreview(url);
    onUploaded(url);
    setUploading(false);
  }

  const initial = "W";

  return (
    <div className="flex items-center gap-5">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="relative h-16 w-16 shrink-0 overflow-hidden border border-ww-border bg-rust-light"
        title="Change profile photo"
      >
        {preview ? (
          <Image src={preview} alt="Profile photo" fill className="object-cover" unoptimized />
        ) : (
          <span className="flex h-full w-full items-center justify-center font-serif text-2xl text-rust">
            {initial}
          </span>
        )}
        <span className="absolute inset-0 flex items-center justify-center bg-ink/40 opacity-0 transition-opacity hover:opacity-100 font-mono text-[9px] uppercase tracking-widest text-warm-white">
          {uploading ? "…" : "Change"}
        </span>
      </button>

      <div>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="border border-ww-border bg-sand px-4 py-2 font-mono text-[10px] uppercase tracking-widest text-ink transition-colors hover:border-ink disabled:opacity-40"
        >
          {uploading ? "Uploading…" : preview ? "Replace photo" : "Upload photo"}
        </button>
        <p className="mt-1.5 font-mono text-[10px] text-ww-muted">
          JPG, PNG or WebP · max 2 MB
        </p>
        {error && <p className="mt-1 font-mono text-[10px] text-rust">{error}</p>}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFile}
        className="hidden"
      />
    </div>
  );
}
