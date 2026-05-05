import {
  Compass,
  Users,
  ShieldCheck,
  UserPlus,
  User,
  type LucideIcon,
} from "lucide-react";

export type PrimaryNavKey = "intel" | "community" | "safety" | "buddy" | "me";

export type PrimaryNavItem = {
  key: PrimaryNavKey;
  label: string;
  href: string | null; // null = resolved at render time (Me)
  icon: LucideIcon;
};

// Single source of truth for the 5-tab primary nav (Header + MobileNav).
// Labels are standardised: "Intel" (not "Trip Intel"), "Buddy" (not "Find a Buddy").
// "Me" is the only item with a dynamic href — see resolveMeHref below.
export const PRIMARY_NAV: PrimaryNavItem[] = [
  { key: "intel",     label: "Intel",     href: "/explore",   icon: Compass },
  { key: "community", label: "Community", href: "/community", icon: Users },
  { key: "safety",    label: "Safety",    href: "/safety",    icon: ShieldCheck },
  { key: "buddy",     label: "Buddy",     href: "/buddy",     icon: UserPlus },
  { key: "me",        label: "Me",        href: null,         icon: User },
];

// Logged-in users land on their public profile; logged-out users land on
// onboarding (which is where Get Started + sign-in flow into).
export function resolveMeHref(profileSlug: string | null | undefined): string {
  return profileSlug ? `/profile/${profileSlug}` : "/onboarding";
}

// Active-state matcher. Me is active on /profile/* AND /onboarding.
export function isPrimaryNavActive(item: PrimaryNavItem, pathname: string): boolean {
  if (item.key === "me") {
    return pathname.startsWith("/profile/") || pathname === "/onboarding";
  }
  if (!item.href) return false;
  return pathname === item.href || pathname.startsWith(item.href + "/");
}
