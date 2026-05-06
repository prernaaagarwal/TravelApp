"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { PRIMARY_NAV, isPrimaryNavActive } from "@/lib/nav";

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav
      data-testid="mobile-nav"
      aria-label="Mobile navigation"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-ww-border/60 bg-sand/95 backdrop-blur md:hidden"
    >
      <ul className="mx-auto flex max-w-md items-stretch justify-around">
        {PRIMARY_NAV.map((item) => {
          const Icon = item.icon;
          const active = isPrimaryNavActive(item, pathname);
          return (
            <li key={item.key} className="flex-1">
              <Link
                href={item.href}
                className={cn(
                  "flex flex-col items-center gap-1 px-1 py-2 text-[10px] uppercase tracking-tight transition-colors",
                  active ? "text-rust" : "text-ww-muted hover:text-ink"
                )}
              >
                <Icon className="h-5 w-5" />
                <span className="whitespace-nowrap">{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
