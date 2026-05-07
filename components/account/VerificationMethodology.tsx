import { VERIFICATION_METHODOLOGY } from "@/lib/buddy-verification";

// Reusable methodology card — single source of truth for the "what does
// verified actually mean" copy. Mounted on:
//   - /account/verify (top of the submission flow)
//   - /buddy (page header, replacing the unbacked "no creeps" line)
//   - inside BuddyVerifiedBadge tooltip
//
// `compact` shrinks it for inline placement (e.g. Buddy page header).

export function VerificationMethodology({
  compact = false,
}: {
  compact?: boolean;
}) {
  return (
    <div
      className={
        compact
          ? "rounded-xl border border-sage/30 bg-sage-light/20 p-4"
          : "rounded-2xl border border-ww-border bg-warm-white p-6"
      }
    >
      <p className="mb-2 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-sage">
        <span aria-hidden>✓</span>
        How verification works
      </p>
      <p className="font-mono text-xs leading-relaxed text-ink">
        {VERIFICATION_METHODOLOGY.paragraph}
      </p>
      <p className="mt-2 font-mono text-[11px] leading-relaxed text-ww-muted">
        {VERIFICATION_METHODOLOGY.scope}
      </p>
    </div>
  );
}
