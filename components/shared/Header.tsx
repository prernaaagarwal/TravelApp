import Link from "next/link";
import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";

const NAV_ITEMS = [
  { href: "/explore", label: "Intel" },
  { href: "/community", label: "Community" },
  { href: "/feed", label: "Feed" },
  { href: "/buddy", label: "Buddy" },
  { href: "/shop", label: "Shop" },
];

export async function Header() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

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
          {NAV_ITEMS.map((item) => (
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
          {user ? (
            <>
              <Link
                href="/account/settings"
                aria-label="Settings"
                title="Settings"
                className="text-ww-muted hover:text-ink p-1"
              >
                <Settings className="h-4 w-4" />
              </Link>
              <Link
                href="/account/profile"
                aria-label="Profile"
                className="h-8 w-8 rounded-full bg-rust/20 flex items-center justify-center text-rust text-xs font-medium hover:bg-rust/30 transition-colors"
              >
                {user.email?.[0]?.toUpperCase() ?? "W"}
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
                className="bg-rust text-warm-white hover:bg-rust/90"
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

