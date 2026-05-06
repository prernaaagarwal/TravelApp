"use client";

import { useConsent } from "@/lib/consent";

// Tiny client component that re-opens the cookie consent banner. Used in
// the Footer's legal-links row alongside Privacy / Terms / Code of Conduct.
// Kept separate so the Footer can stay a server component.

export function CookiePreferencesLink({ className }: { className?: string }) {
  const { reopen } = useConsent();
  return (
    <button
      type="button"
      onClick={reopen}
      className={className ?? "text-ww-muted/80 hover:text-ink"}
    >
      Cookie preferences
    </button>
  );
}
