"use client";

/**
 * Pre-book checklist with hybrid persistence:
 *
 *   - Logged-in users: state lives in the user_checklists table, keyed on
 *     (user_id, destination_slug). Loads on mount, saves on toggle via the
 *     setChecklistState server action. Cross-device, survives logout/login,
 *     and can be shared with a buddy via a read-only /checklist/{token} URL.
 *
 *   - Logged-out users: still use the original localStorage key
 *     `checklist-{slug}`. Sign-in nudge shown below the list so they know
 *     they can upgrade.
 *
 * The intel page passes `isLoggedIn` plus the user's hydrated `initialChecked`
 * indexes (server-rendered to avoid an extra round-trip + checkbox flicker).
 */

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Share2, Check } from "lucide-react";
import {
  setChecklistState,
  createOrGetShareToken,
} from "@/app/actions/checklist";

export function PreBookChecklist({
  items,
  slug,
  isLoggedIn = false,
  initialCheckedIndexes = [],
  initialShareToken = null,
}: {
  items: string[];
  slug: string;
  isLoggedIn?: boolean;
  initialCheckedIndexes?: number[];
  initialShareToken?: string | null;
}) {
  const storageKey = `checklist-${slug}`;
  const [checked, setChecked] = useState<boolean[]>(() => {
    if (isLoggedIn) {
      const seed = Array(items.length).fill(false);
      for (const idx of initialCheckedIndexes) {
        if (idx >= 0 && idx < items.length) seed[idx] = true;
      }
      return seed;
    }
    // Logged-out branch hydrates from localStorage post-mount; render empty
    // until then to avoid SSR mismatch.
    return [];
  });
  const [hydrated, setHydrated] = useState(isLoggedIn);
  const [shareToken, setShareToken] = useState<string | null>(initialShareToken);
  const [shareCopied, setShareCopied] = useState(false);
  const [shareBusy, setShareBusy] = useState(false);

  // Pending DB writes are coalesced — don't blast the action on every click.
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load persisted state for logged-out users from localStorage.
  useEffect(() => {
    if (isLoggedIn) return;
    try {
      const saved = localStorage.getItem(storageKey);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setChecked(saved ? JSON.parse(saved) : Array(items.length).fill(false));
    } catch {
      setChecked(Array(items.length).fill(false));
    }
    setHydrated(true);
  }, [storageKey, items.length, isLoggedIn]);

  function persist(next: boolean[]) {
    if (isLoggedIn) {
      // Coalesce rapid toggles into one write.
      if (saveTimer.current) clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(() => {
        const indexes = next.flatMap((v, i) => (v ? [i] : []));
        void setChecklistState(slug, indexes, items.length);
      }, 400);
    } else {
      try {
        localStorage.setItem(storageKey, JSON.stringify(next));
      } catch {}
    }
  }

  function toggle(i: number) {
    const next = checked.map((v, idx) => (idx === i ? !v : v));
    setChecked(next);
    persist(next);
  }

  function reset() {
    const blank = Array(items.length).fill(false);
    setChecked(blank);
    persist(blank);
  }

  async function onShare() {
    if (!isLoggedIn || shareBusy) return;
    setShareBusy(true);
    let token = shareToken;
    if (!token) {
      const res = await createOrGetShareToken(slug);
      if (res.token) {
        token = res.token;
        setShareToken(token);
      } else {
        setShareBusy(false);
        return;
      }
    }
    const url = `${window.location.origin}/checklist/${token}`;
    try {
      if (navigator.share) {
        await navigator.share({
          title: "My pre-trip checklist",
          text: "Here's what I've sorted for our trip — see what's left:",
          url,
        });
      } else {
        await navigator.clipboard.writeText(url);
        setShareCopied(true);
        setTimeout(() => setShareCopied(false), 2500);
      }
    } catch {
      // user cancelled the share dialog — no-op
    } finally {
      setShareBusy(false);
    }
  }

  const doneCount = checked.filter(Boolean).length;

  // Render nothing until hydrated (avoids checkbox flicker for the
  // logged-out localStorage branch).
  if (!hydrated || checked.length === 0) return null;

  return (
    <div>
      {/* progress bar */}
      <div className="mb-4 flex items-center gap-3">
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-ww-border">
          <div
            className="h-full rounded-full bg-sage transition-all duration-300"
            style={{ width: `${(doneCount / items.length) * 100}%` }}
          />
        </div>
        <span className="shrink-0 font-mono text-xs text-ww-muted">
          {doneCount}/{items.length}
        </span>
        {doneCount > 0 && (
          <button
            onClick={reset}
            className="shrink-0 font-mono text-[10px] uppercase tracking-widest text-ww-muted hover:text-rust"
          >
            Reset
          </button>
        )}
      </div>

      <ul className="space-y-2">
        {items.map((item, i) => (
          <li key={i}>
            <label className="flex cursor-pointer items-start gap-3 border border-ww-border bg-sand p-3 transition-colors hover:bg-ww-border/40">
              <input
                type="checkbox"
                checked={!!checked[i]}
                onChange={() => toggle(i)}
                className="mt-0.5 h-4 w-4 shrink-0 accent-sage"
              />
              <span
                className={`text-sm leading-relaxed transition-colors ${
                  checked[i] ? "text-ww-muted line-through" : "text-ink"
                }`}
              >
                {item}
              </span>
            </label>
          </li>
        ))}
      </ul>

      {/* Footer: share for logged-in users, sign-in nudge for everyone else */}
      {isLoggedIn ? (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-ww-border pt-3">
          <p className="font-mono text-[10px] text-ww-muted">
            Saved to your account · syncs across devices
          </p>
          <button
            type="button"
            onClick={onShare}
            disabled={shareBusy}
            className="inline-flex items-center gap-1.5 border border-ww-border bg-warm-white px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest text-ink transition-colors hover:border-rust hover:text-rust disabled:opacity-50"
          >
            {shareCopied ? (
              <>
                <Check className="h-3 w-3" />
                Link copied
              </>
            ) : (
              <>
                <Share2 className="h-3 w-3" />
                Share with buddy
              </>
            )}
          </button>
        </div>
      ) : (
        <p className="mt-4 border-t border-ww-border pt-3 font-mono text-[10px] text-ww-muted">
          Saved on this device only.{" "}
          <Link
            href={`/account/login?next=/intel/${slug}`}
            className="text-rust hover:underline"
          >
            Sign in
          </Link>{" "}
          to sync across devices and share with a buddy.
        </p>
      )}
    </div>
  );
}
