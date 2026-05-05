"use client";

import { useState } from "react";
import { Share2, Check, Copy } from "lucide-react";

type Props = {
  // Path of the page to share, e.g. "/intel/rishikesh-india". We prepend the
  // current origin at click time so the URL is always production-correct.
  path: string;
  // Headline used in the share sheet text and WhatsApp deep link.
  title: string;
  // One-line context, e.g. "Solo women's travel intel for Rishikesh".
  blurb?: string;
  // Visual variant. "primary" sits in the hero area, "ghost" sits at the
  // foot of the emergency-contacts section.
  variant?: "primary" | "ghost";
};

export function ShareIntelButton({ path, title, blurb, variant = "primary" }: Props) {
  const [copied, setCopied] = useState(false);

  function fullUrl() {
    if (typeof window === "undefined") return path;
    return new URL(path, window.location.origin).toString();
  }

  function shareText() {
    const lines = [title];
    if (blurb) lines.push(blurb);
    lines.push(fullUrl());
    return lines.join("\n\n");
  }

  async function handleShare() {
    const url = fullUrl();
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title, text: blurb ?? title, url });
        return;
      } catch {
        // User dismissed share sheet — fall through to clipboard so they
        // still get *something* useful from the click.
      }
    }
    await copyLink();
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(fullUrl());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Silent fail — clipboard can be blocked by browser permissions.
    }
  }

  function whatsappHref() {
    const text = encodeURIComponent(shareText());
    return `https://wa.me/?text=${text}`;
  }

  const baseBtn =
    "inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest transition-colors";
  const primaryBtn =
    variant === "primary"
      ? "border border-ink bg-ink px-4 py-2 text-warm-white hover:bg-ink/85"
      : "border border-ww-border bg-warm-white px-4 py-2 text-ink hover:border-ink";
  const secondaryBtn =
    "border border-ww-border bg-transparent px-4 py-2 text-ww-muted hover:border-ink hover:text-ink";

  return (
    <div className="flex flex-wrap items-center gap-2">
      <a
        href={whatsappHref()}
        target="_blank"
        rel="noopener noreferrer"
        className={`${baseBtn} ${primaryBtn}`}
      >
        <Share2 className="h-3.5 w-3.5" />
        Share on WhatsApp
      </a>
      <button
        type="button"
        onClick={handleShare}
        aria-label={copied ? "Link copied to clipboard" : "Share this dossier"}
        className={`${baseBtn} ${secondaryBtn}`}
      >
        {copied ? (
          <>
            <Check className="h-3.5 w-3.5" />
            Copied
          </>
        ) : (
          <>
            <Copy className="h-3.5 w-3.5" />
            Copy link
          </>
        )}
      </button>
    </div>
  );
}
