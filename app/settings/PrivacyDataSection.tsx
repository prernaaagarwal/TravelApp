"use client";

import Link from "next/link";
import { useConsent } from "@/lib/consent";

// Per-user privacy controls — sits above the Danger Zone in /settings.
// Three actions:
//   1. Download my data → /api/account/export (GDPR Art. 20 / DPDPA §12)
//   2. Manage cookie preferences → re-opens the consent banner
//   3. Read the privacy policy
// The "last consent decision" line is read live from localStorage so it
// updates the moment the banner saves.

export function PrivacyDataSection() {
  const { state, reopen } = useConsent();

  const consentLine = state.decided
    ? `Last consent decision · Analytics: ${state.consent.analytics ? "ON" : "OFF"} · ` +
      `Marketing: ${state.consent.marketing ? "ON" : "OFF"} · ` +
      new Date(state.consent.timestamp).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "No consent decision recorded yet.";

  return (
    <div className="space-y-3 rounded-xl border border-ww-border bg-warm-white p-6 shadow-sm">
      <p className="font-mono text-[10px] uppercase tracking-wider text-ww-muted">
        Privacy &amp; data
      </p>

      <p className="font-mono text-xs leading-relaxed text-ww-muted">
        Download everything we hold for your account, or change which cookies
        we&apos;re allowed to set on your device. We never sell your data and
        we never share your email with brands.
      </p>

      <div className="flex flex-wrap gap-2 pt-1">
        <a
          href="/api/account/export"
          download
          className="inline-flex items-center gap-2 border border-ink bg-ink px-4 py-2 font-mono text-[11px] uppercase tracking-widest text-warm-white transition-opacity hover:opacity-90"
        >
          Download my data ↓
        </a>
        <button
          type="button"
          onClick={reopen}
          className="inline-flex items-center gap-2 border border-ww-border bg-sand px-4 py-2 font-mono text-[11px] uppercase tracking-widest text-ww-muted transition-colors hover:border-ink hover:text-ink"
        >
          Manage cookie preferences
        </button>
        <Link
          href="/privacy"
          className="inline-flex items-center gap-2 border border-ww-border bg-sand px-4 py-2 font-mono text-[11px] uppercase tracking-widest text-ww-muted transition-colors hover:border-ink hover:text-ink"
        >
          Privacy policy →
        </Link>
      </div>

      <p className="pt-2 font-mono text-[10px] leading-relaxed text-ww-muted/80">
        {consentLine}
      </p>
    </div>
  );
}
