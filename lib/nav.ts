import {
  Compass,
  Users,
  ShieldCheck,
  FileText,
  type LucideIcon,
} from "lucide-react";

export type PrimaryNavKey = "intel" | "community" | "safety" | "feed";

export type PrimaryNavItem = {
  key: PrimaryNavKey;
  label: string;
  href: string;
  icon: LucideIcon;
};

// Single source of truth for the primary nav (Header + MobileNav).
// Beware Board stays reachable via Community (/community?tab=beware) and Safety.
export const PRIMARY_NAV: PrimaryNavItem[] = [
  { key: "intel",     label: "Intel",        href: "/explore",   icon: Compass },
  { key: "community", label: "Community",    href: "/community", icon: Users },
  { key: "safety",    label: "Safety",       href: "/safety",    icon: ShieldCheck },
  { key: "feed",      label: "Planner", href: "/feed",      icon: FileText },
];

export function isPrimaryNavActive(item: PrimaryNavItem, pathname: string): boolean {
  return pathname === item.href || pathname.startsWith(item.href + "/");
}
