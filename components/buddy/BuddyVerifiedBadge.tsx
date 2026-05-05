import { VERIFICATION_METHODOLOGY } from "@/lib/buddy-verification";

// Small inline pill on every verified buddy profile card. The label is
// concrete on purpose — "phone + ID verified" instead of just "verified" —
// so the methodology is implicit even before the user reads the explainer.
//
// `title` shows the full methodology paragraph on hover for sighted users
// and is exposed to screen readers. The full explainer also lives on the
// /buddy page header (compact VerificationMethodology) and on /account/verify.

export function BuddyVerifiedBadge() {
  return (
    <span
      title={VERIFICATION_METHODOLOGY.paragraph}
      className="inline-flex items-center gap-1 rounded-full border border-sage/40 bg-sage-light/50 px-2 py-0.5 font-mono text-[10px] tracking-wide text-sage"
    >
      <span aria-hidden>✓</span>
      {VERIFICATION_METHODOLOGY.shortLabel}
    </span>
  );
}
