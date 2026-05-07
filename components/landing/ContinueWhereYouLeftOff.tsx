import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { formatDestinationSlug } from "@/lib/utils";

/**
 * Personalised banner shown at the top of the landing page to onboarded
 * users — picks up where they left off after the /onboarding flow.
 *
 * Rendered server-side conditionally in app/page.tsx based on
 * getCurrentSegment(). Logged-out or never-onboarded visitors see nothing.
 *
 * Sits ABOVE the hero (sticky-ish position via the section ordering) so the
 * dual Priya/Sara CTA below remains intact for first-time visitors —
 * onboarded users just get a faster path to their destination.
 */
export function ContinueWhereYouLeftOff({
  destination,
  need,
  firstName,
}: {
  destination: string;
  need?: string;
  firstName?: string;
}) {
  const destinationLabel = formatDestinationSlug(destination);
  const greeting = firstName ? `Welcome back, ${firstName}.` : "Welcome back.";

  // The CTA target mirrors the onboarding "need → route" mapping in
  // OnboardingWizard.selectNeed so the banner takes them to the same place
  // they would have ended up if they'd just finished onboarding.
  const href = need === "buddy"
    ? "/buddy"
    : need === "warnings"
      ? `/community/beware/${destination}`
      : need === "budget"
        ? `/feed?destination=${encodeURIComponent(destination)}`
        : `/intel/${destination}`;

  const ctaLabel = need === "buddy"
    ? "Find a buddy"
    : need === "warnings"
      ? "See the scam map"
      : need === "budget"
        ? "See real costs"
        : "Open the intel";

  return (
    <section className="border-b border-ww-border bg-rust-light/40 px-6 py-3">
      <div className="mx-auto flex max-w-4xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-rust">
            {greeting}
          </p>
          <p className="mt-1 font-mono text-sm text-ink">
            Continue your trip to{" "}
            <span className="font-semibold">{destinationLabel}</span>.
          </p>
        </div>
        <Link
          href={href}
          className="inline-flex shrink-0 items-center gap-2 border border-rust bg-rust px-4 py-2 font-mono text-[10px] uppercase tracking-widest text-warm-white hover:bg-rust/90 transition-colors"
        >
          {ctaLabel}
          <ArrowRight className="h-3 w-3" aria-hidden />
        </Link>
      </div>
    </section>
  );
}
