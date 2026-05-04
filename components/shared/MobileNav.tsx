"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Compass, Users, Map, UserPlus, ShoppingBag, ShieldCheck } from "lucide-react";

import { cn } from "@/lib/utils";

const BASE_NAV = [
  { href: "/explore",    label: "Intel",     icon: Compass },
  { href: "/community",  label: "Community", icon: Users },
  { href: "/feed",       label: "Receipts",  icon: Map },
  { href: "/buddy",      label: "Buddy",     icon: UserPlus },
  { href: "/shop",       label: "Shop",      icon: ShoppingBag },
];

const AUTH_NAV = [
  { href: "/explore",      label: "Intel",     icon: Compass },
  { href: "/community",    label: "Community", icon: Users },
  { href: "/feed",         label: "Receipts",  icon: Map },
  { href: "/verify-stay",  label: "Verify",    icon: ShieldCheck },
  { href: "/buddy",        label: "Buddy",     icon: UserPlus },
];

export function MobileNav({ isLoggedIn = false }: { isLoggedIn?: boolean }) {
  const pathname = usePathname();
  const items = isLoggedIn ? AUTH_NAV : BASE_NAV;

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-ww-border/60 bg-sand/95 backdrop-blur md:hidden">
      <ul className="mx-auto flex max-w-md items-stretch justify-around">
        {items.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
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
