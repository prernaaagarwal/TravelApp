"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Compass, Users, Map, UserPlus, ShoppingBag } from "lucide-react";

import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/explore", label: "Intel", icon: Compass },
  { href: "/community", label: "Community", icon: Users },
  { href: "/feed", label: "Feed", icon: Map },
  { href: "/buddy", label: "Buddy", icon: UserPlus },
  { href: "/shop", label: "Shop", icon: ShoppingBag },
];

export function MobileNav() {
  const pathname = usePathname();
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-ww-border/60 bg-sand/95 backdrop-blur md:hidden">
      <ul className="mx-auto flex max-w-md items-stretch justify-around">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active =
            pathname === href || pathname.startsWith(href + "/");
          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                className={cn(
                  "flex flex-col items-center gap-1 py-2 text-[10px] uppercase tracking-wider transition-colors",
                  active ? "text-rust" : "text-ww-muted hover:text-ink"
                )}
              >
                <Icon className="h-5 w-5" />
                <span>{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
