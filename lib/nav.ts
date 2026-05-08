import {
  Compass,
  Users,
  ShieldCheck,
  AlertTriangle,
  FileText,
  type LucideIcon,
} from "lucide-react";

export type PrimaryNavKey = "intel" | "beware" | "community" | "safety" | "feed";

export type PrimaryNavItem = {
  key: PrimaryNavKey;
  label: string;
  href: string;
  icon: LucideIcon;
};

// Single source of truth for the primary nav (Header + MobileNav).
// 5 items: Intel and Community are the always-on browse + ask surfaces;
// Beware Board is promoted as the visceral first-touch wedge; Safety
// is the toolkit hub; Trip Reports is the receipts/narrative surface
// where contributors publish their actual trip notes.
export const PRIMARY_NAV: PrimaryNavItem[] = [
  { key: "intel",     label: "Intel",        href: "/explore",              icon: Compass },
  { key: "beware",    label: "Beware Board", href: "/community?tab=beware", icon: AlertTriangle },
  { key: "community", label: "Community",    href: "/community",            icon: Users },
  { key: "safety",    label: "Safety",       href: "/safety",               icon: ShieldCheck },
  { key: "feed",      label: "Trip Reports", href: "/feed",                 icon: FileText },
];

export function isPrimaryNavActive(item: PrimaryNavItem, pathname: string): boolean {
  return pathname === item.href || pathname.startsWith(item.href + "/");
}
