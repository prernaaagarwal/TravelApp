"use client";

import { useEffect, useState, useCallback, useSyncExternalStore } from "react";
import { Share, X, Download, RefreshCw } from "lucide-react";

// ─── Public component ────────────────────────────────────────────────
// Mounts the SW registration plus the two UI affordances (update toast,
// install prompt). Keep this lean — the toast/prompt only render when
// they have something to show.
export function PWA() {
  return (
    <>
      <ServiceWorkerRegister />
      <UpdateToast />
      <InstallBanner />
    </>
  );
}

// ─── 1. Service worker registration ─────────────────────────────────
function ServiceWorkerRegister() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    // In dev: actively kill any service worker left behind by a previous
    // production build on this origin and clear its caches. Without this,
    // Turbopack chunks can ghost across edits and break HMR.
    if (process.env.NODE_ENV !== "production") {
      navigator.serviceWorker.getRegistrations().then((regs) => {
        regs.forEach((r) => r.unregister().catch(() => {}));
      });
      if ("caches" in window) {
        caches.keys().then((keys) => {
          keys.forEach((k) => caches.delete(k).catch(() => {}));
        });
      }
      return;
    }

    const onLoad = () => {
      navigator.serviceWorker
        .register("/sw.js", { scope: "/" })
        .catch((err) => console.warn("[SW] register failed:", err));
    };

    if (document.readyState === "complete") onLoad();
    else window.addEventListener("load", onLoad, { once: true });

    return () => window.removeEventListener("load", onLoad);
  }, []);

  return null;
}

// ─── 2. Update toast ────────────────────────────────────────────────
// Listens for a waiting service worker (a new version was installed but
// hasn't taken over yet). Shows a "New version" banner; on click,
// messages SKIP_WAITING to the waiting worker and reloads the page.
function UpdateToast() {
  const [waitingSw, setWaitingSw] = useState<ServiceWorker | null>(null);

  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;
    if (process.env.NODE_ENV !== "production") return;

    let cancelled = false;

    navigator.serviceWorker.ready.then((reg) => {
      if (cancelled) return;

      // Already waiting at first load
      if (reg.waiting) setWaitingSw(reg.waiting);

      // New version found while page is open
      reg.addEventListener("updatefound", () => {
        const installing = reg.installing;
        if (!installing) return;
        installing.addEventListener("statechange", () => {
          if (installing.state === "installed" && navigator.serviceWorker.controller) {
            setWaitingSw(installing);
          }
        });
      });
    });

    // Reload when controller swaps in (after SKIP_WAITING)
    let reloading = false;
    const onControllerChange = () => {
      if (reloading) return;
      reloading = true;
      window.location.reload();
    };
    navigator.serviceWorker.addEventListener("controllerchange", onControllerChange);

    return () => {
      cancelled = true;
      navigator.serviceWorker.removeEventListener("controllerchange", onControllerChange);
    };
  }, []);

  const apply = useCallback(() => {
    waitingSw?.postMessage({ type: "SKIP_WAITING" });
  }, [waitingSw]);

  if (!waitingSw) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed inset-x-3 bottom-3 z-50 mx-auto flex max-w-md items-center gap-3 border border-ink bg-ink px-4 py-3 text-warm-white shadow-2xl md:bottom-5 md:right-5 md:left-auto md:mx-0"
    >
      <RefreshCw className="h-4 w-4 shrink-0" />
      <p className="flex-1 font-mono text-xs">A newer version is available.</p>
      <button
        type="button"
        onClick={apply}
        className="border border-warm-white/40 bg-warm-white/10 px-3 py-1 font-mono text-[10px] uppercase tracking-widest transition-colors hover:bg-warm-white/20"
      >
        Reload
      </button>
    </div>
  );
}

// ─── 3. Install prompt ──────────────────────────────────────────────
const INSTALL_DISMISSED_KEY = "ww_install_dismissed";
const INSTALL_DISMISS_DAYS  = 14;

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
  prompt(): Promise<void>;
}

function subscribeStandalone(callback: () => void) {
  const mq = window.matchMedia("(display-mode: standalone)");
  mq.addEventListener("change", callback);
  return () => mq.removeEventListener("change", callback);
}

function getStandaloneSnapshot(): boolean {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    ("standalone" in navigator && (navigator as unknown as { standalone?: boolean }).standalone === true)
  );
}

function InstallBanner() {
  // External browser state — synced via useSyncExternalStore so we never have
  // to mirror it into useState (which would trip react-hooks/set-state-in-effect).
  const isStandalone = useSyncExternalStore(
    subscribeStandalone,
    getStandaloneSnapshot,
    () => false
  );

  const [deferred,  setDeferred]   = useState<BeforeInstallPromptEvent | null>(null);
  const [iosOpen,   setIosOpen]    = useState(false);
  const [showIosBtn, setShowIosBtn] = useState(false);

  useEffect(() => {
    // User dismissed recently? Don't register anything.
    const dismissedAt = Number(localStorage.getItem(INSTALL_DISMISSED_KEY) || 0);
    if (dismissedAt && Date.now() - dismissedAt < INSTALL_DISMISS_DAYS * 86_400_000) return;

    // Android / Chromium — listen for the install prompt event
    const onBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", onBeforeInstall);

    const onInstalled = () => {
      setDeferred(null);
    };
    window.addEventListener("appinstalled", onInstalled);

    // iOS Safari has no install API — show manual instructions button after a delay
    const ua = navigator.userAgent;
    const isIos = /iphone|ipad|ipod/i.test(ua) && !/crios|fxios|edgios/i.test(ua);

    let iosTimer: ReturnType<typeof setTimeout> | undefined;
    if (isIos) {
      iosTimer = setTimeout(() => setShowIosBtn(true), 8_000);
    }

    return () => {
      if (iosTimer) clearTimeout(iosTimer);
      window.removeEventListener("beforeinstallprompt", onBeforeInstall);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  const dismiss = () => {
    localStorage.setItem(INSTALL_DISMISSED_KEY, String(Date.now()));
    setDeferred(null);
    setShowIosBtn(false);
  };

  const install = async () => {
    if (!deferred) return;
    await deferred.prompt();
    const choice = await deferred.userChoice;
    if (choice.outcome === "dismissed") dismiss();
    setDeferred(null);
  };

  if (isStandalone) return null;

  // Android prompt available
  if (deferred) {
    return (
      <div
        role="dialog"
        aria-label="Install Wander Women"
        className="fixed inset-x-3 bottom-3 z-40 mx-auto flex max-w-md items-center gap-3 border border-ww-border bg-warm-white px-4 py-3 shadow-2xl md:bottom-5 md:right-5 md:left-auto md:mx-0"
      >
        <Download className="h-4 w-4 shrink-0 text-rust" />
        <div className="flex-1">
          <p className="font-mono text-xs text-ink">Install Wander Women</p>
          <p className="font-mono text-[10px] text-ww-muted">Quick access from your home screen.</p>
        </div>
        <button
          type="button"
          onClick={install}
          className="border border-rust bg-rust px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-warm-white transition-colors hover:bg-rust/80"
        >
          Install
        </button>
        <button
          type="button"
          onClick={dismiss}
          aria-label="Dismiss install prompt"
          className="rounded-sm p-1 text-ww-muted transition-colors hover:bg-sand hover:text-ink"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    );
  }

  // iOS instructions modal trigger
  if (showIosBtn) {
    return (
      <>
        <div
          role="dialog"
          aria-label="Add Wander Women to home screen"
          className="fixed inset-x-3 bottom-3 z-40 mx-auto flex max-w-md items-center gap-3 border border-ww-border bg-warm-white px-4 py-3 shadow-2xl md:bottom-5 md:right-5 md:left-auto md:mx-0"
        >
          <Share className="h-4 w-4 shrink-0 text-rust" />
          <div className="flex-1">
            <p className="font-mono text-xs text-ink">Add to home screen</p>
            <p className="font-mono text-[10px] text-ww-muted">One-tap access on your iPhone.</p>
          </div>
          <button
            type="button"
            onClick={() => setIosOpen(true)}
            className="border border-rust bg-rust px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-warm-white transition-colors hover:bg-rust/80"
          >
            How
          </button>
          <button
            type="button"
            onClick={dismiss}
            aria-label="Dismiss"
            className="rounded-sm p-1 text-ww-muted transition-colors hover:bg-sand hover:text-ink"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>

        {iosOpen && <IosInstructions onClose={() => setIosOpen(false)} />}
      </>
    );
  }

  return null;
}

// ─── iOS step-by-step ───────────────────────────────────────────────
function IosInstructions({ onClose }: { onClose: () => void }) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="iOS install instructions"
      className="fixed inset-0 z-50 flex items-end justify-center bg-ink/50 p-3 backdrop-blur-sm md:items-center"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md border border-ww-border bg-sand p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <h2 className="font-serif text-xl text-ink">Add to home screen</h2>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="rounded-sm p-1 text-ww-muted transition-colors hover:bg-warm-white hover:text-ink"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <ol className="mt-4 space-y-3 font-mono text-sm leading-relaxed text-ink">
          <li>
            <span className="font-semibold text-rust">1.</span> Tap the{" "}
            <Share className="inline h-4 w-4 align-text-bottom" /> Share icon at the bottom of Safari.
          </li>
          <li>
            <span className="font-semibold text-rust">2.</span> Scroll and tap{" "}
            <strong>Add to Home Screen</strong>.
          </li>
          <li>
            <span className="font-semibold text-rust">3.</span> Tap <strong>Add</strong> in the top-right.
          </li>
        </ol>

        <p className="mt-5 font-mono text-[11px] leading-relaxed text-ww-muted">
          Wander Women launches like an app — full screen, no browser bars, faster load.
        </p>
      </div>
    </div>
  );
}
