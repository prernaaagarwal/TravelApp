"use client";

import { useSyncExternalStore } from "react";

// Cookie / analytics consent — single source of truth for PostHog gating
// and any future tracker we add. Stored client-side in localStorage; also
// upserted to notification_preferences when the user is signed in (so consent
// travels across devices). Server-rendered pages default to "decided=false"
// and let the client take over.

export const CONSENT_KEY = "ww-consent";
export const CONSENT_VERSION = 1;

export type Consent = {
  analytics: boolean;
  marketing: boolean;
  timestamp: string; // ISO-8601
  version: number;
};

// Default state when nothing has been chosen yet. `decided` lets the banner
// know whether to render (no decision = show the banner).
export type ConsentState = {
  decided: boolean;
  consent: Consent;
};

const DEFAULT_CONSENT: Consent = {
  analytics: false,
  marketing: false,
  timestamp: "1970-01-01T00:00:00.000Z",
  version: CONSENT_VERSION,
};

const SERVER_SNAPSHOT: ConsentState = { decided: false, consent: DEFAULT_CONSENT };

function readFromStorage(): ConsentState {
  if (typeof window === "undefined") {
    return SERVER_SNAPSHOT;
  }
  try {
    const raw = window.localStorage.getItem(CONSENT_KEY);
    if (!raw) return { decided: false, consent: DEFAULT_CONSENT };
    const parsed = JSON.parse(raw) as Partial<Consent>;
    return {
      decided: true,
      consent: {
        analytics: !!parsed.analytics,
        marketing: !!parsed.marketing,
        timestamp: parsed.timestamp ?? new Date().toISOString(),
        version:   parsed.version   ?? CONSENT_VERSION,
      },
    };
  } catch {
    return { decided: false, consent: DEFAULT_CONSENT };
  }
}

function writeToStorage(consent: Consent) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(CONSENT_KEY, JSON.stringify(consent));
    // Custom event so same-tab listeners react immediately. The native
    // `storage` event only fires on OTHER tabs.
    window.dispatchEvent(new CustomEvent("ww-consent-change", { detail: consent }));
  } catch {
    // localStorage unavailable (Safari private mode etc.) — fall through.
  }
}

// useSyncExternalStore requires a stable snapshot reference for unchanged
// state, otherwise React will loop. Cache the last raw string + parsed result.
let cachedRaw: string | null = null;
let cachedSnapshot: ConsentState = SERVER_SNAPSHOT;

function getClientSnapshot(): ConsentState {
  if (typeof window === "undefined") return SERVER_SNAPSHOT;
  const raw = window.localStorage.getItem(CONSENT_KEY);
  if (raw === cachedRaw) return cachedSnapshot;
  cachedRaw = raw;
  cachedSnapshot = readFromStorage();
  return cachedSnapshot;
}

function getServerSnapshot(): ConsentState {
  return SERVER_SNAPSHOT;
}

function subscribe(callback: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  function onStorage(e: StorageEvent) {
    if (e.key === CONSENT_KEY) callback();
  }
  function onLocal() {
    callback();
  }
  window.addEventListener("storage", onStorage);
  window.addEventListener("ww-consent-change", onLocal as EventListener);
  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener("ww-consent-change", onLocal as EventListener);
  };
}

// React hook. Returns the current decision + a setter. Listens to both the
// `storage` event (other tabs) and our custom `ww-consent-change` (same tab).
export function useConsent(): {
  state: ConsentState;
  setConsent: (next: Pick<Consent, "analytics" | "marketing">) => void;
  reopen: () => void;
} {
  const state = useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot);

  function setConsent(next: Pick<Consent, "analytics" | "marketing">) {
    const updated: Consent = {
      analytics: next.analytics,
      marketing: next.marketing,
      timestamp: new Date().toISOString(),
      version:   CONSENT_VERSION,
    };
    writeToStorage(updated);
  }

  function reopen() {
    if (typeof window === "undefined") return;
    window.localStorage.removeItem(CONSENT_KEY);
    window.dispatchEvent(new CustomEvent("ww-consent-change", { detail: null }));
  }

  return { state, setConsent, reopen };
}
