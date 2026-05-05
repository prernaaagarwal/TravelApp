import {
  Compass,
  Users,
  ShieldCheck,
  UserPlus,
  Map,
  type LucideIcon,
} from "lucide-react";

export type PrimaryNavKey = "intel" | "community" | "safety" | "buddy" | "receipts";

export type PrimaryNavItem = {
  key: PrimaryNavKey;
  label: string;
  href: string;
  icon: LucideIcon;
};

// Single source of truth for the 5-tab primary nav (Header + MobileNav).
// Labels are standardised: "Intel" (not "Trip Intel"), "Buddy" (not "Find a
// Buddy"), "Trip Receipts" (full label, always — never just "Receipts").
export const PRIMARY_NAV: PrimaryNavItem[] = [
  { key: "intel",     label: "Intel",         href: "/explore",   icon: Compass },
  { key: "community", label: "Community",     href: "/community", icon: Users },
  { key: "safety",    label: "Safety",        href: "/safety",    icon: ShieldCheck },
  { key: "buddy",     label: "Buddy",         href: "/buddy",     icon: UserPlus },
  { key: "receipts",  label: "Trip Receipts", href: "/feed",      icon: Map },
];

export function isPrimaryNavActive(item: PrimaryNavItem, pathname: string): boolean {
  return pathname === item.href || pathname.startsWith(item.href + "/");
}
