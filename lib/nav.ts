import {
  Compass,
  Users,
  Map,
  UserPlus,
  ShoppingBag,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
};

export const NAV_ITEMS: NavItem[] = [
  { href: "/explore",   label: "Intel",     icon: Compass },
  { href: "/community", label: "Community", icon: Users },
  { href: "/feed",      label: "Receipts",  icon: Map },
  { href: "/buddy",     label: "Buddy",     icon: UserPlus },
  { href: "/shop",      label: "Shop",      icon: ShoppingBag },
];
