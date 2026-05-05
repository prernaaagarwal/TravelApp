import Link from "next/link";

export const metadata = {
  title: "Terms of Use — Wander Women",
  description: "Terms governing use of the Wander Women platform. V0 draft, pending legal review.",
};

export default function TermsPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-ww-muted">
        Trust &amp; safety
      </p>
      <h1 className="mb-3 font-serif text-4xl text-ink md:text-5xl">
        Terms of Use
      </h1>
      <p className="mb-8 font-mono text-xs leading-relaxed text-ww-muted">
        Last updated: 5 May 2026 · V0 draft, pending legal review before V1 launch
      </p>

      <Section title="Who can use Wander Women">
        <p className="font-mono text-sm leading-relaxed text-ink">
          Wander Women is a women-only platform. By creating an account you
          confirm you are 18 or older and identify as a woman. Misrepresentation
          will get you banned and any submissions you have made may be removed.
        </p>
      </Section>

      <Section title="Content you submit">
        <p className="mb-3 font-mono text-sm leading-relaxed text-ink">
          You retain copyright to the photos, reports, and posts you submit.
          You grant Wander Women a non-exclusive licence to publish, edit,
          translate, and excerpt that content in service of the platform —
          with attribution where you have asked for it.
        </p>
        <p className="font-mono text-sm leading-relaxed text-ink">
          Submissions are reviewed against our{" "}
          <Link
            href="/code-of-conduct"
            className="text-rust underline underline-offset-2"
          >
            Code of Conduct
          </Link>
          . We may edit, decline, or remove submissions at our discretion.
        </p>
      </Section>

      <Section title="Affiliate links and recommendations">
        <p className="font-mono text-sm leading-relaxed text-ink">
          Some links on Wander Women earn us a small commission if you book or
          purchase (Booking.com, Amazon, World Nomads). These never affect what
          we recommend — every product on the Safety Shop is independently
          chosen by contributors. We disclose affiliate relationships clearly
          on the relevant pages.
        </p>
      </Section>

      <Section title="What this product is not">
        <p className="font-mono text-sm leading-relaxed text-ink">
          Wander Women is not an emergency service, a travel agency, or a
          stay-booking platform. Reports on the Beware Board are user
          submissions reviewed by our moderators — they are not professional
          legal, medical, or police advice. In an emergency, dial the local
          police or ambulance number listed on the relevant intel card.
        </p>
      </Section>

      <Section title="Limitation of liability">
        <p className="font-mono text-sm leading-relaxed text-ink">
          We do our best to verify what we publish but the platform is provided
          &ldquo;as is&rdquo;. We are not liable for losses arising from
          actions you take based on the information here. Travel is uncertain;
          our intel reduces uncertainty but does not eliminate it. Always carry
          travel insurance.
        </p>
      </Section>

      <p className="mt-12 border-t border-ww-border/60 pt-5 font-mono text-[10px] leading-relaxed text-ww-muted/80">
        This is a V0 draft, intentionally light on jurisdiction-specific
        clauses. A complete Terms of Use, with arbitration and governing-law
        provisions, will replace this page before V1 launch after legal review.
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
