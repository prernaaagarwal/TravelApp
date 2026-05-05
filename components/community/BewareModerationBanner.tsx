// Visible moderation framework — surfaced anywhere user-submitted Beware
// reports are read. Tells the casual reader two things:
//   1. Reports were human-reviewed within the published SLA before they appeared.
//   2. They are first-hand accounts, not Wander Women's editorial verdict.
//
// Reused on /community (Beware tab) and /community/beware/[city] map.
// Edit copy in one place; both surfaces stay aligned.

export function BewareModerationBanner() {
  return (
    <div className="border border-ww-border bg-warm-white px-4 py-3">
      <p className="font-mono text-[11px] leading-relaxed text-ww-muted">
        <span className="font-semibold text-ink">User-submitted reports.</span>{" "}
        Every report below was reviewed by a human moderator within 24 hours
        and published only after approval against our{" "}
        <a
          href="/code-of-conduct"
          className="text-rust underline underline-offset-2"
        >
          Code of Conduct
        </a>
        . They are first-hand accounts from solo female travellers — not legal
        verdicts. Spotted something inaccurate? Tap{" "}
        <span className="font-semibold text-ink">Report</span> on any card, or
        email{" "}
        <a
          href="mailto:trust@wanderwomen.in"
          className="text-rust underline underline-offset-2"
        >
          trust@wanderwomen.in
        </a>
        .
      </p>
    </div>
  );
}
