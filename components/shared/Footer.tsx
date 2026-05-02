import Link from "next/link";

const COL_INTEL = [
  { href: "/explore", label: "Browse Trip Intel" },
  { href: "/community", label: "Community" },
  { href: "/feed", label: "Trip Receipts" },
  { href: "/buddy", label: "Find a Buddy" },
];

const COL_PRODUCT = [
  { href: "/vault", label: "WhatsApp Vault" },
  { href: "/shop", label: "Safety Shop" },
  { href: "/onboarding", label: "Get Started" },
  { href: "/coming-soon", label: "Founding Membership" },
];

const COL_ABOUT = [
  { href: "/coming-soon", label: "About" },
  { href: "/coming-soon", label: "Contributors" },
  { href: "/coming-soon", label: "Press" },
  { href: "/coming-soon", label: "Contact" },
];

export function Footer() {
  return (
    <footer className="mt-24 border-t border-ww-border/60 bg-warm-white">
      <div className="mx-auto max-w-6xl px-4 py-12 md:px-6">
        <div className="grid gap-10 md:grid-cols-4">
          <div>
            <Link
              href="/"
              className="font-serif text-2xl tracking-tight text-ink"
            >
              Wander Women
            </Link>
            <p className="mt-3 text-sm leading-relaxed text-ww-muted">
              Trip intel built by women who actually travel solo.
            </p>
          </div>

          <FooterColumn title="Intel" items={COL_INTEL} />
          <FooterColumn title="Product" items={COL_PRODUCT} />
          <FooterColumn title="Company" items={COL_ABOUT} />
        </div>

        {/* Beware Board legal disclaimer (PRD Section 13) */}
        <div className="mt-12 rounded-md border border-ww-border/50 bg-sand/50 p-4">
          <p className="text-xs leading-relaxed text-ww-muted">
            <span className="font-semibold text-ink">Beware Board notice:</span>{" "}
            All Beware Board entries shown in this V0 demo are illustrative
            mock data, seeded by the Wander Women team for product preview
            purposes. They are not user-submitted reports and do not name real
            individuals. References to establishments, neighborhoods, and
            transport hubs are descriptive only and not allegations of
            wrongdoing by any specific operator. In V1, all reports will be
            user-submitted, moderated, and verified.
          </p>
        </div>

        <div className="mt-6 flex flex-col items-start justify-between gap-3 text-xs text-ww-muted md:flex-row md:items-center">
          <span>© 2026 Wander Women — V0 demo build.</span>
          <div className="flex gap-4">
            <Link href="/coming-soon" className="hover:text-ink">
              Privacy
            </Link>
            <Link href="/coming-soon" className="hover:text-ink">
              Terms
            </Link>
            <Link href="/coming-soon" className="hover:text-ink">
              Code of Conduct
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  items,
}: {
  title: string;
  items: { href: string; label: string }[];
}) {
  return (
    <div>
      <h4 className="font-serif text-base text-ink">{title}</h4>
      <ul className="mt-3 space-y-2 text-sm">
        {items.map((item) => (
          <li key={item.label}>
            <Link
              href={item.href}
              className="text-ww-muted transition-colors hover:text-ink"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
