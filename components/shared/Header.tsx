import Link from "next/link";
import { Button } from "@/components/ui/button";

const NAV_ITEMS = [
  { href: "/explore", label: "Intel" },
  { href: "/community", label: "Community" },
  { href: "/feed", label: "Feed" },
  { href: "/buddy", label: "Buddy" },
  { href: "/shop", label: "Shop" },
];

export function Header() {
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
          <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
            <Link href="/coming-soon">Sign in</Link>
          </Button>
          <Button
            asChild
            size="sm"
            className="bg-rust text-warm-white hover:bg-rust/90"
          >
            <Link href="/coming-soon">Join</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
