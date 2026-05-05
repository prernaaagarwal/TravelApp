"use client";

import { useState, useRef, useEffect } from "react";

// Truncate a long body to ~2 lines by default with a "See more" toggle.
// We only render the toggle when the text actually overflows — short posts
// don't get a useless button. Detection uses scrollHeight > clientHeight on
// the clamped element after layout.

export function CollapsibleText({
  text,
  className = "",
  clamp = 2,
}: {
  text: string;
  className?: string;
  clamp?: 1 | 2 | 3;
}) {
  const [expanded, setExpanded] = useState(false);
  const [overflows, setOverflows] = useState(false);
  const ref = useRef<HTMLParagraphElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Measure once the browser has laid the clamped node out. scrollHeight
    // exceeds clientHeight only when the line-clamp is actually hiding text.
    setOverflows(el.scrollHeight - el.clientHeight > 1);
  }, [text]);

  const clampClass =
    !expanded
      ? clamp === 1
        ? "line-clamp-1"
        : clamp === 3
          ? "line-clamp-3"
          : "line-clamp-2"
      : "";

  return (
    <div className={className}>
      <p
        ref={ref}
        className={`whitespace-pre-wrap text-sm leading-relaxed text-ink ${clampClass}`}
      >
        {text}
      </p>
      {overflows && (
        <button
          type="button"
          onClick={() => setExpanded((e) => !e)}
          className="mt-1 font-mono text-[10px] uppercase tracking-widest text-rust hover:underline"
        >
          {expanded ? "See less ↑" : "See more ↓"}
        </button>
      )}
    </div>
  );
}
