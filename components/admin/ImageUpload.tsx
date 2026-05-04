"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";

interface ImageUploadProps {
  bucket: "intel-images" | "contributor-photos";
  currentUrl: string;
  onUploaded: (url: string) => void;
  label?: string;
}

export function ImageUpload({ bucket, currentUrl, onUploaded, label = "Image" }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState(currentUrl);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError("");

    const supabase = createClient();
    const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
    // Use timestamp to avoid caching stale images after replacement
    const path = `${Date.now()}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(path, file, { upsert: true });

    if (uploadError) {
      setError(uploadError.message);
      setUploading(false);
      return;
    }

    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    setPreview(data.publicUrl);
    onUploaded(data.publicUrl);
    setUploading(false);
  }

  return (
    <div className="space-y-2">
      <p className="font-mono text-[10px] uppercase tracking-widest text-ww-muted">{label}</p>

      {preview && (
        <div className="relative h-40 w-full overflow-hidden border border-ww-border">
          <Image src={preview} alt="Preview" fill className="object-cover" unoptimized />
        </div>
      )}

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="border border-ww-border bg-sand px-4 py-2 font-mono text-[10px] uppercase tracking-widest text-ink transition-colors hover:border-ink disabled:opacity-40"
        >
          {uploading ? "Uploading…" : preview ? "Replace image" : "Upload image"}
        </button>
        {preview && (
          <span className="truncate font-mono text-[10px] text-ww-muted max-w-xs">
            {preview.split("/").pop()}
          </span>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFile}
        className="hidden"
      />

      {error && (
        <p className="font-mono text-[10px] text-rust">{error}</p>
      )}
    </div>
  );
}
