import Link from "next/link";
import { CookiePreferencesLink } from "@/components/shared/CookiePreferencesLink";

// Footer is the discovery layer for everything that's NOT primary-nav
// material. Trip Reports lives in the primary nav; the rest of the
// secondary product surfaces live here so they remain discoverable.
const PRIMARY_LINKS = [
  { href: "/about", label: "About" },
  { href: "/methodology", label: "Methodology" },
  { href: "/safety/contributor-safety", label: "Contributor Safety" },
  { href: "/account/membership", label: "Membership" },
  { href: "/feedback", label: "Feedback" },
];

const MORE_LINKS = [
  { href: "/buddy", label: "Buddy" },
  { href: "/vault", label: "WhatsApp Vault" },
  { href: "/shop", label: "Safety Kit" },
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

          <div className="grid gap-8 sm:grid-cols-2 md:gap-12">
            <nav>
              <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.18em] text-ww-muted/70">
                Wander Women
              </p>
              <ul className="space-y-2">
                {PRIMARY_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="font-mono text-xs text-ww-muted transition-colors hover:text-ink"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            <nav>
              <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.18em] text-ww-muted/70">
                More
              </p>
              <ul className="space-y-2">
                {MORE_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="font-mono text-xs text-ww-muted transition-colors hover:text-ink"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>

        <p className="mt-10 border-t border-ww-border/60 pt-5 font-mono text-[10px] leading-relaxed text-ww-muted/80">
          <span className="font-semibold text-ink/80">Beware Board notice:</span>{" "}
          Reports are user-submitted, reviewed by a human moderator within
          36 hours against our{" "}
          <Link href="/code-of-conduct" className="underline hover:text-ink">
            Code of Conduct
          </Link>
          , and may be edited or rejected if they don&apos;t meet our evidence
          and defamation standards. Each report represents an individual
          incident, not a statistical safety claim about a destination.
          Take-down and grievance requests:{" "}
          <Link
            href="/legal/grievance-officer"
            className="underline hover:text-ink"
          >
            grievance@wanderwomen.in
          </Link>
          .
        </p>

        <div className="mt-5 flex flex-col items-start justify-between gap-3 font-mono text-[10px] text-ww-muted md:flex-row md:items-center">
          <span>© 2026 Wander Women.</span>
          <div className="flex flex-wrap gap-4">
            <Link href="/privacy" className="hover:text-ink">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-ink">
              Terms
            </Link>
            <Link href="/code-of-conduct" className="hover:text-ink">
              Code of Conduct
            </Link>
            <CookiePreferencesLink />
          </div>
        </div>
      </div>
    </footer>
  );
}
