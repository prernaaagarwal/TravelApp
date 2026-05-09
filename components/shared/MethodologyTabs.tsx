"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

// Sibling-tab navigation rendered at the top of /methodology AND
// /safety/contributor-safety. Both pages live under the same umbrella
// in the IA — "How We Score" — and this tab nav makes that explicit so
// a visitor on either page can jump to the other without going back to
// the footer.
//
// Both URLs remain canonical (no redirect / merge of pages), so the
// existing /safety/contributor-safety links across the site continue
// to work and SEO indexability is preserved.
const TABS = [
  { href: "/methodology", label: "Methodology" },
  { href: "/safety/contributor-safety", label: "Contributor Safety" },
];

export function MethodologyTabs() {
  const pathname = usePathname();

  return (
    <div className="border-b border-ww-border bg-warm-white">
      <div className="mx-auto max-w-6xl px-6 md:px-10">
        <nav
          aria-label="How We Score"
          className="-mb-px flex gap-6 overflow-x-auto md:gap-10"
        >
          {TABS.map((t) => {
            const active = pathname === t.href;
            return (
              <Link
                key={t.href}
                href={t.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "shrink-0 whitespace-nowrap border-b-2 py-4 font-mono text-[11px] uppercase tracking-[0.2em] transition-colors",
                  active
                    ? "border-rust text-ink"
                    : "border-transparent text-ww-muted hover:border-ww-muted/40 hover:text-ink",
                )}
              >
                {t.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
