import Link from "next/link";
import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { CommandPalette } from "@/components/shared/CommandPalette";

const NAV_ITEMS = [
  { href: "/explore", label: "Intel" },
  { href: "/community", label: "Community" },
  { href: "/feed", label: "Receipts" },
  { href: "/buddy", label: "Buddy" },
  { href: "/shop", label: "Shop" },
  { href: "/verify-stay", label: "Verify Stay", authOnly: true },
];

type NavItem = { href: string; label: string; authOnly?: boolean };

export async function Header() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let profileSlug: string | null = null;
  let initial = "W";
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("username, first_name")
      .eq("id", user.id)
      .single();
    profileSlug = profile?.username ?? user.id;
    const name = profile?.first_name ?? user.email ?? "W";
    initial = name[0].toUpperCase();
  }

  return (
    <header className="sticky top-0 z-40 border-b border-ww-border/60 bg-sand/85 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 md:px-6">
        <Link
          href="/"
          className="font-serif text-xl tracking-tight text-ink hover:text-rust"
        >
          Wander Women
        </Link>

        <nav className="hidden gap-6 md:flex">
          {NAV_ITEMS.filter((item: NavItem) => !item.authOnly || user).map((item: NavItem) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm uppercase tracking-wider text-ww-muted transition-colors hover:text-ink"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <CommandPalette />
          {user ? (
            <>
              <Link
                href="/settings"
                aria-label="Settings"
                title="Settings"
                className="text-ww-muted hover:text-ink p-1"
              >
                <Settings className="h-4 w-4" />
              </Link>
              <Link
                href={`/profile/${profileSlug}`}
                aria-label="My profile"
                className="h-8 w-8 rounded-full bg-rust/20 flex items-center justify-center text-rust text-xs font-medium hover:bg-rust/30 transition-colors"
              >
                {initial}
              </Link>
            </>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
                <Link href="/account/login">Sign in</Link>
              </Button>
              <Button
                asChild
                size="sm"
                className="bg-[#b54727] text-white hover:bg-[#a03f22]"
              >
                <Link href="/account/membership">Join</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
