"use client";

import { useEffect, useRef, useState } from "react";

export type MultiSelectOption = {
  value: string;
  label: string;
  emoji?: string;
};

export function MultiSelect({
  options,
  selected,
  onChange,
  placeholder = "Select...",
}: {
  options: MultiSelectOption[];
  selected: string[];
  onChange: (next: string[]) => void;
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  const selectedLabels = options
    .filter((o) => selected.includes(o.value))
    .map((o) => (o.emoji ? `${o.emoji} ${o.label}` : o.label));

  function toggle(val: string) {
    onChange(selected.includes(val) ? selected.filter((v) => v !== val) : [...selected, val]);
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-2 border border-ww-border bg-warm-white px-3 py-2 text-left font-mono text-sm text-ink hover:border-ink focus:border-ink focus:outline-none"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="truncate">
          {selectedLabels.length > 0 ? (
            selectedLabels.join(", ")
          ) : (
            <span className="text-ww-muted">{placeholder}</span>
          )}
        </span>
        <span className="shrink-0 font-mono text-[10px] text-ww-muted">
          {selected.length > 0 ? `${selected.length} selected` : "▾"}
        </span>
      </button>

      {open && (
        <div
          role="listbox"
          className="absolute left-0 right-0 top-full z-30 mt-1 max-h-64 overflow-y-auto border border-ww-border bg-warm-white shadow-2xl"
        >
          {options.map((o) => {
            const isSelected = selected.includes(o.value);
            return (
              <button
                key={o.value}
                type="button"
                role="option"
                aria-selected={isSelected}
                onClick={() => toggle(o.value)}
                className={`flex w-full items-center justify-between gap-2 px-3 py-2 text-left font-mono text-sm transition-colors ${
                  isSelected ? "bg-rust/10 text-rust" : "text-ink hover:bg-sand"
                }`}
              >
                <span className="truncate">
                  {o.emoji ? `${o.emoji} ` : ""}
                  {o.label}
                </span>
                {isSelected && <span className="shrink-0 text-rust">✓</span>}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
