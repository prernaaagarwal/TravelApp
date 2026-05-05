import Link from "next/link";

export const metadata = {
  title: "Safety-score methodology — Wander Women",
  description:
    "How Wander Women calculates the per-destination solo-female safety score. What's in the average, when we hide it, what's coming next.",
};

export default function MethodologyPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-ww-muted">
        Trust &amp; safety
      </p>
      <h1 className="mb-3 font-serif text-4xl text-ink md:text-5xl">
        How we score destinations
      </h1>
      <p className="mb-8 font-mono text-xs leading-relaxed text-ww-muted">
        Last updated: 5 May 2026 · V0 — formula gets sharper as the dataset grows
      </p>

      {/* ── In short ─────────────────────────────────────────────── */}
      <section className="mb-10 border border-sage/30 bg-sage-light/40 p-5">
        <h2 className="mb-2 font-serif text-xl text-ink">In one paragraph</h2>
        <p className="font-mono text-sm leading-relaxed text-ink">
          The safety number you see on each Trip Report — e.g.{" "}
          <strong>Safety 4.2/5 · 4 hoods rated</strong> — is the simple
          average of contributor-rated neighbourhood safety ratings on that
          destination&apos;s intel card. <strong>One number per
          destination</strong>, not per trip. We hide it when fewer than{" "}
          <strong>three</strong> neighbourhoods have been rated. We don&apos;t
          weigh user submissions, we don&apos;t blend in beware-report
          counts, and we don&apos;t produce a score out of 10. That&apos;s
          deliberate — the V0 number is honest because the inputs are
          observable. The V1 score will be richer; we&apos;ll publish that
          formula here too.
        </p>
      </section>

      {/* ── Inputs ───────────────────────────────────────────────── */}
      <Section title="What goes into the V0 score">
        <p className="mb-4 font-mono text-sm leading-relaxed text-ink">
          One input. Every neighbourhood on a destination&apos;s intel card
          carries a <code className="bg-sand px-1.5 py-0.5 text-[12px]">safetyRating</code> on
          a <strong>1–5 scale</strong>, set by the contributor who wrote the
          card. The destination score is the simple average of those
          ratings.
        </p>
        <pre className="mb-3 overflow-x-auto border border-ww-border bg-warm-white p-4 font-mono text-xs leading-relaxed text-ink">
{`destination_score = avg(neighborhoods[].safetyRating)
                  // 1–5 scale, no transformation`}
        </pre>
        <p className="font-mono text-sm leading-relaxed text-ww-muted">
          For Goa today: neighbourhoods are Assagao (5/5), Anjuna/Vagator
          (3/5), Palolem (4/5). Avg = 4.0. The same number renders on every
          Goa trip report, every time the page loads.
        </p>
      </Section>

      {/* ── Sample size ──────────────────────────────────────────── */}
      <Section title="When we hide the score">
        <p className="mb-3 font-mono text-sm leading-relaxed text-ink">
          A score from one or two neighbourhoods is misleading. So:
        </p>
        <ul className="space-y-2 font-mono text-sm leading-relaxed text-ink">
          <Bullet>
            Fewer than <strong>3 rated neighbourhoods</strong>: we render{" "}
            <em>&ldquo;Not enough data yet&rdquo;</em> instead of a number.
          </Bullet>
          <Bullet>
            No intel card for the destination at all: same — no number.
          </Bullet>
          <Bullet>
            The &ldquo;Show only safe destinations&rdquo; filter on /feed
            <em> hides</em> destinations below the threshold rather than
            silently treating them as safe.
          </Bullet>
        </ul>
      </Section>

      {/* ── What we don't do ─────────────────────────────────────── */}
      <Section title="What this score is not">
        <ul className="space-y-2 font-mono text-sm leading-relaxed text-ink">
          <Bullet>
            <strong>Not a verdict.</strong> A 4.2 doesn&apos;t mean &ldquo;safe&rdquo;
            in the absolute. Read the scams list, the Don&apos;t list, and
            recent beware reports for the real picture.
          </Bullet>
          <Bullet>
            <strong>Not a 0–10 score.</strong> The earlier &ldquo;Solo
            8.4/10&rdquo;-style numbers were a placeholder hash on the trip
            ID, not real data — they shifted across cards for the same
            destination. Removed.
          </Bullet>
          <Bullet>
            <strong>Not weighted by beware reports yet.</strong> They&apos;re
            shown separately on the Beware Board. V1 brings them into the
            score; see below.
          </Bullet>
          <Bullet>
            <strong>Not user-rated.</strong> Only contributors who wrote the
            intel card set neighbourhood ratings. Members can&apos;t change
            the number; they can flag a stale card via{" "}
            <Link href="/feedback" className="underline hover:text-ink">
              Feedback
            </Link>
            .
          </Bullet>
        </ul>
      </Section>

      {/* ── What's coming ─────────────────────────────────────────── */}
      <Section title="What V1 will add">
        <p className="mb-3 font-mono text-sm leading-relaxed text-ink">
          The V0 number is intentionally narrow. As the dataset grows, the
          score moves to a documented composite formula:
        </p>
        <pre className="mb-3 overflow-x-auto border border-ww-border bg-warm-white p-4 font-mono text-xs leading-relaxed text-ink">
{`v1_score =
    0.55 × neighbourhood_rating_avg          // 1–5 scale
  + 0.30 × (5 − beware_severity_index)        // recent + severity-weighted
  + 0.15 × verified_contributor_bonus         // capped at 5
                                              // → 1.0–5.0 displayed`}
        </pre>
        <ul className="space-y-2 font-mono text-sm leading-relaxed text-ink">
          <Bullet>
            <strong>Beware reports</strong>: severity (critical / high /
            medium) and recency (rolling 12 months) feed in. A surge of
            critical reports drops the score the same week.
          </Bullet>
          <Bullet>
            <strong>Verified contributors</strong>: a small bonus (capped)
            for destinations vouched for by multiple contributors who have
            actually been there.
          </Bullet>
          <Bullet>
            <strong>Per-destination, computed once</strong>: stored on{" "}
            <code className="bg-sand px-1.5 py-0.5 text-[12px]">intel_cards.safety_score</code>{" "}
            and re-computed atomically when a beware report is approved.
            Same number everywhere it&apos;s shown.
          </Bullet>
          <Bullet>
            <strong>Methodology stays here.</strong> Any change to the
            formula gets a dated changelog entry on this page.
          </Bullet>
        </ul>
      </Section>

      {/* ── Sanity check ──────────────────────────────────────────── */}
      <Section title="Spot something off?">
        <p className="font-mono text-sm leading-relaxed text-ink">
          Numbers that don&apos;t match your lived experience are the most
          useful feedback we can get. Email{" "}
          <a href="mailto:trust@wanderwomen.in" className="text-rust underline underline-offset-2">
            trust@wanderwomen.in
          </a>{" "}
          with the destination, the score you saw, and what you think it
          should be — we&apos;ll re-check the inputs and either correct the
          card or write back with what we&apos;re seeing.
        </p>
      </Section>

      <p className="mt-12 border-t border-ww-border/60 pt-5 font-mono text-[10px] leading-relaxed text-ww-muted/80">
        Related: our{" "}
        <Link href="/code-of-conduct" className="underline hover:text-ink">
          Code of Conduct
        </Link>{" "}
        explains how Beware reports are moderated before they affect the V1
        score.
      </p>
    </main>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <h2 className="mb-3 font-serif text-2xl text-ink">{title}</h2>
      {children}
    </section>
  );
}

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2">
      <span className="mt-0.5 shrink-0 text-rust">•</span>
      <span>{children}</span>
    </li>
  );
}
