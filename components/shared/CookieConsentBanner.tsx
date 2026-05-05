"use client";

import { useState } from "react";
import Link from "next/link";
import { useConsent } from "@/lib/consent";

// Fixed-bottom banner shown only on first visit (no localStorage["ww-consent"]
// set yet) or when the user explicitly clicks "Manage cookie preferences"
// elsewhere in the app to re-open it. Three primary actions: Accept all /
// Reject non-essential / Customize. The customize panel exposes per-category
// toggles for Analytics + Marketing — Strictly necessary cookies (Supabase
// auth, CSRF) are listed but not toggleable.
//
// PostHog reads the same consent via lib/consent.ts and only initialises
// when consent.analytics === true.

export function CookieConsentBanner() {
  const { state, setConsent } = useConsent();
  const [showCustomize, setShowCustomize] = useState(false);
  const [analytics, setAnalytics] = useState(state.consent.analytics);
  const [marketing, setMarketing] = useState(state.consent.marketing);

  // useSyncExternalStore returns the server snapshot ({decided: false}) during
  // SSR + first client render, then swaps to the real localStorage value after
  // hydration commits. So a re-visitor who already opted in will see the
  // banner unmount on hydration — no flash gate needed here.
  if (state.decided) return null;

  function acceptAll() {
    setConsent({ analytics: true, marketing: true });
  }
  function rejectNonEssential() {
    setConsent({ analytics: false, marketing: false });
  }
  function saveCustom() {
    setConsent({ analytics, marketing });
  }

  return (
    <div
      role="dialog"
      aria-label="Cookie preferences"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-ww-border bg-warm-white shadow-[0_-4px_16px_-4px_rgba(26,21,16,0.08)]"
    >
      <div className="mx-auto max-w-4xl px-6 py-5 md:py-6">
        {!showCustomize ? (
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="md:flex-1 md:pr-6">
              <p className="mb-1 font-mono text-[10px] uppercase tracking-[0.2em] text-rust">
                Cookie preferences
              </p>
              <p className="font-mono text-xs leading-relaxed text-ink">
                We use strictly necessary cookies to keep you signed in, and
                optional analytics cookies (PostHog) to understand which intel
                cards solo women actually find useful. No marketing trackers,
                no ad networks, no data sold.{" "}
                <Link href="/privacy" className="underline hover:text-rust">
                  Privacy policy →
                </Link>
              </p>
            </div>
            <div className="flex flex-wrap gap-2 md:shrink-0">
              <button
                type="button"
                onClick={() => setShowCustomize(true)}
                className="border border-ww-border bg-sand px-4 py-2 font-mono text-[11px] uppercase tracking-widest text-ink transition-colors hover:border-ink"
              >
                Customise
              </button>
              <button
                type="button"
                onClick={rejectNonEssential}
                className="border border-ww-border bg-sand px-4 py-2 font-mono text-[11px] uppercase tracking-widest text-ww-muted transition-colors hover:border-ink hover:text-ink"
              >
                Reject non-essential
              </button>
              <button
                type="button"
                onClick={acceptAll}
                className="border border-rust bg-rust px-4 py-2 font-mono text-[11px] uppercase tracking-widest text-warm-white transition-opacity hover:opacity-90"
              >
                Accept all
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="mb-4 flex items-baseline justify-between gap-4">
              <div>
                <p className="mb-1 font-mono text-[10px] uppercase tracking-[0.2em] text-rust">
                  Customise cookie preferences
                </p>
                <p className="font-mono text-xs leading-relaxed text-ww-muted">
                  Choose what we&apos;re allowed to set on your device.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowCustomize(false)}
                aria-label="Back"
                className="font-mono text-[11px] uppercase tracking-widest text-ww-muted hover:text-ink"
              >
                ← Back
              </button>
            </div>

            <ul className="mb-5 space-y-3">
              <Category
                title="Strictly necessary"
                desc="Keeps you signed in and protects against CSRF. Required for the site to work — cannot be turned off."
                checked
                disabled
              />
              <Category
                title="Analytics (PostHog)"
                desc="Anonymous page-view + click tracking so we can see which intel cards solo women find useful and where the product is failing them. Self-hosted, no third-party ad networks."
                checked={analytics}
                onChange={setAnalytics}
              />
              <Category
                title="Marketing"
                desc="Off by default. We don't run any marketing trackers today; this row is here so we'll always ask before we add one."
                checked={marketing}
                onChange={setMarketing}
              />
            </ul>

            <div className="flex flex-wrap justify-end gap-2">
              <button
                type="button"
                onClick={rejectNonEssential}
                className="border border-ww-border bg-sand px-4 py-2 font-mono text-[11px] uppercase tracking-widest text-ww-muted transition-colors hover:border-ink hover:text-ink"
              >
                Reject all non-essential
              </button>
              <button
                type="button"
                onClick={saveCustom}
                className="border border-rust bg-rust px-4 py-2 font-mono text-[11px] uppercase tracking-widest text-warm-white transition-opacity hover:opacity-90"
              >
                Save preferences
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Category({
  title,
  desc,
  checked,
  onChange,
  disabled,
}: {
  title: string;
  desc: string;
  checked: boolean;
  onChange?: (next: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <li className="flex items-start gap-3 border border-ww-border bg-sand/60 p-3">
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange?.(e.target.checked)}
        className="mt-0.5 h-4 w-4 shrink-0 accent-rust disabled:opacity-50"
        aria-label={title}
      />
      <div>
        <p className="font-mono text-xs font-semibold text-ink">
          {title}
          {disabled && (
            <span className="ml-2 font-mono text-[10px] uppercase tracking-widest text-ww-muted">
              Always on
            </span>
          )}
        </p>
        <p className="mt-1 font-mono text-[11px] leading-relaxed text-ww-muted">
          {desc}
        </p>
      </div>
    </li>
  );
}
