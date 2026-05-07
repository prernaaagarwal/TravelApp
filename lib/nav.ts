import {
  Compass,
  Users,
  ShieldCheck,
  AlertTriangle,
  type LucideIcon,
} from "lucide-react";

export type PrimaryNavKey = "intel" | "beware" | "community" | "safety";

export type PrimaryNavItem = {
  key: PrimaryNavKey;
  label: string;
  href: string;
  icon: LucideIcon;
};

// Single source of truth for the primary nav (Header + MobileNav).
// Culled from 5 to 4 items per docs/strategy/wedge.md — Buddy and Trip
// Reports (Feed) were deferred. The Beware Board moved up to a primary
// entry because it IS the wedge: the visceral first-touch surface for
// new visitors. Routes still exist; they're just no longer headline.
export const PRIMARY_NAV: PrimaryNavItem[] = [
  { key: "intel",     label: "Intel",        href: "/explore",         icon: Compass },
  { key: "beware",    label: "Beware Board", href: "/community/beware", icon: AlertTriangle },
  { key: "community", label: "Community",    href: "/community",       icon: Users },
  { key: "safety",    label: "Safety",       href: "/safety",          icon: ShieldCheck },
];

export function isPrimaryNavActive(item: PrimaryNavItem, pathname: string): boolean {
  return pathname === item.href || pathname.startsWith(item.href + "/");
}
