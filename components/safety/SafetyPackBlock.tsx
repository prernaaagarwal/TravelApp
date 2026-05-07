import Link from "next/link";
import { ShieldCheck, Printer, Mail } from "lucide-react";

/**
 * SafetyPackBlock — shared section that pitches the Safety Pack
 * (the /vault feature). Used at the top of /vault, /buddy and at
 * the bottom of /safety/preview. Self-contained: brings its own
 * max-w-6xl container so it can drop into any page.
 *
 * Pass `as="h1"` when this is the page's primary heading (e.g. on
 * /vault). Defaults to h2 since most other pages already have their
 * own h1 above this block.
 */
export function SafetyPackBlock({ as = "h2" }: { as?: "h1" | "h2" } = {}) {
  const Heading = as;
  return (
    <section className="mx-auto max-w-6xl px-5 py-12 md:px-8 md:py-16">
      <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.25em] text-blue">
        Safety Pack
      </p>
      <Heading className="mb-4 font-serif text-3xl leading-[1.05] text-ink md:text-5xl">
        <span className="font-medium italic text-gold">One page</span> a
        stranger could use to help you.
      </Heading>
      <p className="mb-8 max-w-3xl font-mono text-sm leading-relaxed text-ww-muted">
        Save your trip details, emergency contacts, insurance and stay info all
        on one page. Download as PDF for offline use, or email a copy to someone
        who&apos;ll have your back if your phone dies.
      </p>

      <div className="rounded-3xl border border-ww-border bg-warm-white p-6 md:p-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex-1">
            <div className="mb-3 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-sage">
              <span className="h-2 w-2 rounded-full bg-sage" aria-hidden />
              <ShieldCheck className="h-3.5 w-3.5" aria-hidden />
              Free · Ready in 5 minutes
            </div>
            <p className="mb-2 font-serif text-2xl leading-snug text-ink md:text-[1.75rem]">
              Start your Safety Pack.
            </p>
            <p className="mb-5 font-mono text-xs leading-relaxed text-ww-muted">
              Save it to your account, print it, or email it to a backup
              contact. No subscription, no per-trip fee.
            </p>
            <div className="mb-5 flex flex-wrap gap-2">
              {[
                "Passport",
                "Travel insurance",
                "Emergency contacts",
                "Stay details",
                "Blood group",
              ].map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-ww-border bg-sand px-3 py-1 font-mono text-[11px] text-ink"
                >
                  {tag}
                </span>
              ))}
            </div>
            <div className="flex flex-wrap gap-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-ww-border bg-sand px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest text-ww-muted">
                <Printer className="h-3 w-3 text-rust" />
                Print or save as PDF
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-ww-border bg-sand px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest text-ww-muted">
                <Mail className="h-3 w-3 text-blue" />
                Email a backup copy
              </span>
            </div>
          </div>

          <div className="shrink-0 self-center">
            <Link
              href="/vault"
              className="block rounded-2xl bg-ink p-3 transition-transform hover:scale-[1.02]"
              aria-label="Open Safety Pack"
            >
              <div className="relative h-32 w-32 md:h-36 md:w-36">
                <div
                  className="grid h-full w-full grid-cols-7 grid-rows-7 gap-[2px]"
                  aria-hidden
                >
                  {QR_PATTERN.map((on, i) => (
                    <span
                      key={i}
                      className={on ? "bg-warm-white" : "bg-transparent"}
                    />
                  ))}
                </div>
              </div>
            </Link>
            <p className="mt-2 text-center font-mono text-[10px] uppercase tracking-widest text-ww-muted">
              Scan to open on phone
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* 7×7 decorative QR — not a real code. */
const QR_PATTERN: boolean[] = [
  true, true, true, false, true, false, true,
  true, false, true, true, false, true, true,
  true, true, false, true, true, false, true,
  false, true, true, false, true, true, false,
  true, false, true, true, false, true, true,
  true, true, false, true, true, false, true,
  true, false, true, false, true, true, true,
];
