import Link from "next/link";
import { CookiePreferencesLink } from "@/components/shared/CookiePreferencesLink";

// Only non-duplicate links — Intel, Community, Safety, Buddy, and Trip
// Receipts already live in the primary nav (Header + MobileNav). Keeping the
// Footer slim avoids the dual-navigation problem.
const NAV_LINKS = [
  { href: "/about", label: "About" },
  { href: "/onboarding", label: "Get Started" },
  { href: "/account/membership", label: "Membership" },
  { href: "/feedback", label: "Feedback" },
];

export function Footer() {
  return (
    <footer className="mt-24 border-t border-ww-border/60 bg-warm-white">
      <div className="mx-auto max-w-6xl px-4 py-10 md:px-6 md:py-12">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div className="max-w-xs">
            <Link
              href="/"
              className="font-serif text-2xl tracking-tight text-ink"
            >
              Wander Women
            </Link>
            <p className="mt-2 font-mono text-xs leading-relaxed text-ww-muted">
              Trip intel built by women who actually travel solo.
            </p>
          </div>

          <nav className="grid grid-cols-2 gap-x-10 gap-y-2 sm:grid-cols-4 md:gap-x-12">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-mono text-xs text-ww-muted transition-colors hover:text-ink"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <p className="mt-10 border-t border-ww-border/60 pt-5 font-mono text-[10px] leading-relaxed text-ww-muted/80">
          <span className="font-semibold text-ink/80">Beware Board notice:</span>{" "}
          Entries in this V0 demo are illustrative mock data. References to
          establishments, neighborhoods, and transport hubs are descriptive
          only, not allegations against any specific operator. V1 reports will
          be user-submitted, moderated, and verified.
        </p>

        <div className="mt-5 flex flex-col items-start justify-between gap-3 font-mono text-[10px] text-ww-muted md:flex-row md:items-center">
          <span>© 2026 Wander Women — V0 demo build.</span>
          {/* Legal pages not yet built — placeholders kept visible for V1. */}
          <div className="flex flex-wrap gap-4">
            <span className="cursor-not-allowed text-ww-muted/60">Privacy</span>
            <span className="cursor-not-allowed text-ww-muted/60">Terms</span>
            <span className="cursor-not-allowed text-ww-muted/60">Code of Conduct</span>
            <CookiePreferencesLink />
          </div>
        </div>
      </div>
    </footer>
  );
}
