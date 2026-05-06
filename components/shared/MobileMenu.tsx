"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

import { PRIMARY_NAV, isPrimaryNavActive } from "@/lib/nav";
import { cn } from "@/lib/utils";

export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  // The panel is portalled to document.body to escape the header's
  // containing block. The header sets backdrop-filter (via backdrop-blur-sm)
  // which, per CSS spec, makes it the containing block for any fixed-
  // positioned descendant — clipping the panel to the header's 56px height
  // and hiding the nav items. Portalling sidesteps that.
  //
  // No SSR guard needed: open starts as false, so createPortal is never
  // evaluated on the server; it only runs after a client-side click, when
  // document.body is guaranteed to exist.
  const panel = open ? (
    <div
      className="fixed inset-0 z-50 md:hidden"
      role="dialog"
      aria-modal="true"
      aria-label="Site navigation"
    >
      <div
        className="absolute inset-0 bg-ink/60 backdrop-blur-sm"
        onClick={() => setOpen(false)}
      />

      <div className="absolute right-0 top-0 flex h-full w-72 max-w-[85vw] flex-col border-l border-ww-border bg-sand shadow-xl">
        <div className="flex items-center justify-between border-b border-ww-border/60 px-4 py-3">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ww-muted">
            Menu
          </p>
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
            className="p-1 text-ww-muted transition-colors hover:text-ink"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-3">
          <ul className="space-y-1">
            {PRIMARY_NAV.map((item) => {
              const Icon = item.icon;
              const active = isPrimaryNavActive(item, pathname);
              return (
                <li key={item.key}>
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-md px-3 py-3 font-mono text-sm uppercase tracking-wider transition-colors",
                      active
                        ? "bg-rust/10 text-rust"
                        : "text-ww-muted hover:bg-ww-border/40 hover:text-ink",
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </div>
  ) : null;

  return (
    <>
      <button
        type="button"
        aria-label="Open menu"
        aria-expanded={open}
        onClick={() => setOpen(true)}
        className="p-1 text-ww-muted transition-colors hover:text-ink md:hidden"
      >
        <Menu className="h-5 w-5" />
      </button>
      {panel ? createPortal(panel, document.body) : null}
    </>
  );
}
