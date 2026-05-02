"use client";

import { useEffect, useState } from "react";

export function PreBookChecklist({
  items,
  slug,
}: {
  items: string[];
  slug: string;
}) {
  const storageKey = `checklist-${slug}`;
  const [checked, setChecked] = useState<boolean[]>([]);

  // load persisted state after mount to avoid SSR mismatch
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setChecked(saved ? JSON.parse(saved) : Array(items.length).fill(false));
    } catch {
      setChecked(Array(items.length).fill(false));
    }
  }, [storageKey, items.length]);

  function toggle(i: number) {
    const next = checked.map((v, idx) => (idx === i ? !v : v));
    setChecked(next);
    try {
      localStorage.setItem(storageKey, JSON.stringify(next));
    } catch {}
  }

  function reset() {
    const blank = Array(items.length).fill(false);
    setChecked(blank);
    try {
      localStorage.setItem(storageKey, JSON.stringify(blank));
    } catch {}
  }

  const doneCount = checked.filter(Boolean).length;

  // render nothing until hydrated (avoids checkbox flicker)
  if (!checked.length) return null;

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
    </div>
  );
}
