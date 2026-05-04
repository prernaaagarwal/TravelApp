import Link from "next/link";
import contributors from "@/lib/mock-data/contributors.json";
import bewares from "@/lib/mock-data/beware-entries.json";
import { EmailSignupForm } from "@/components/shared/EmailSignupForm";
import HeroBackground from "@/components/shared/HeroBackground";
import WhatsInside from "@/components/landing/WhatsInside";
import communityPosts from "@/lib/mock-data/community-posts.json";
import { ExitIntentModal } from "@/components/shared/ExitIntentModal";

// Persona slugs for the "Priya path" and "Sara path" onboarding cards.
// Change here if contributors are renamed — nowhere else.
const PRIYA_SLUG = "ananya-mumbai";
const SARA_SLUG  = "sara-berlin";

export const metadata = { title: "Wander Women — Trip Intel for Solo Women Travellers" };

export default function HomePage() {
  // pre-select data each section needs
  const askPosts = communityPosts.filter((p) => p.tab === "ask").slice(0, 3);

  return (
    <main>
      <ExitIntentModal />

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section id="hero" className="relative overflow-hidden bg-ink px-6 pt-20 pb-16 md:pt-28 md:pb-24">
        <HeroBackground />

        {/* decorative top rule */}
        <div className="relative z-20 mx-auto mb-8 max-w-4xl">
          <div className="h-px w-12 bg-rust" />
        </div>

        <div className="relative z-20 mx-auto max-w-4xl">
          {/* eyebrow */}
          <p className="mb-6 font-mono text-xs uppercase tracking-[0.2em] text-warm-white/80">
            Women-only · Solo travel intelligence · India
          </p>

          {/* headline — Cormorant, ~64px on desktop */}
          <h1 className="mb-6 font-serif text-4xl leading-[1.1] tracking-tight text-warm-white sm:text-5xl md:text-7xl">
            Stress free travel. The guidebook that was never written for you,{" "}
            <em className="not-italic text-rust">yet</em>
          </h1>

          {/* subline */}
          <p className="mb-10 max-w-2xl text-base leading-relaxed text-warm-white/85 md:text-lg">
            Safety intel, hidden gems, verified ground-truth tips — crowd-sourced
            from women who actually live these routes. Free to browse. No fluff.
          </p>

          {/* dual CTA */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href="/onboarding?path=indian"
              className="inline-flex items-center justify-center gap-2 rounded-none bg-rust px-7 py-3.5 font-mono text-sm uppercase tracking-widest text-warm-white transition-opacity hover:opacity-90"
            >
              Travel India
              <span aria-hidden>→</span>
            </Link>
            <Link
              href="/onboarding?path=foreign"
              className="inline-flex items-center justify-center gap-2 rounded-none border border-warm-white/40 px-7 py-3.5 font-mono text-sm uppercase tracking-widest text-warm-white transition-colors hover:border-warm-white hover:bg-warm-white/5"
            >
              Travel Outside India
              <span aria-hidden>→</span>
            </Link>
          </div>

          {/* micro trust line */}
          <p className="mt-8 font-mono text-xs text-warm-white/65">
            Free to browse · Founding membership ₹499 · No spam, ever
          </p>
        </div>
      </section>

      {/* ── Trust bar ────────────────────────────────────────────────── */}
      <section id="trust" className="border-y border-ww-border bg-sand px-6 py-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.2em] text-rust">
            V0 — Founding stage
          </p>
          <p className="font-serif text-xl leading-relaxed text-ink md:text-2xl">
            Built by one founder with{" "}
            <span className="text-rust">7 years</span> of solo travel experience in India.
          </p>
          <p className="mt-3 font-mono text-xs leading-relaxed text-ww-muted">
            Be one of the first <span className="text-ink">200 founding members</span> who shape what this becomes.
          </p>
        </div>
      </section>

      {/* ── What's inside (Intel + Personas + Community combined) ────── */}
      <WhatsInside
        contributors={contributors}
        askPosts={askPosts}
        priyaSlug={PRIYA_SLUG}
        saraSlug={SARA_SLUG}
      />

      {/* ── Beware Board scam ticker ──────────────────────────────────── */}
      <section id="ticker" className="overflow-hidden border-y border-ww-border bg-ink py-10">
        {/* header */}
        <div className="mb-6 flex items-baseline gap-4 px-6">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-warm-white/40">
            Live Beware Board
          </p>
          <span className="h-px flex-1 bg-warm-white/10" />
          <Link href="/community" className="font-mono text-[10px] uppercase tracking-widest text-rust hover:underline">
            See all reports →
          </Link>
        </div>

        {/* row 1 — critical, scrolls left */}
        {(() => {
          const row = [...bewares.filter(b => b.severity === "critical"), ...bewares.filter(b => b.severity === "high").slice(0,3)];
          const doubled = [...row, ...row];
          return (
            <div className="mb-3 overflow-hidden">
              <div className="flex w-max gap-3" style={{animation:"marquee-left 28s linear infinite"}}>
                {doubled.map((b, i) => (
                  <div key={i} className="flex shrink-0 items-center gap-2 border border-rust/30 bg-rust/10 px-3 py-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-rust" />
                    <span className="font-mono text-xs text-rust/90">{b.city}</span>
                    <span className="font-mono text-xs text-warm-white/60">{b.title}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })()}

        {/* row 2 — high, scrolls right */}
        {(() => {
          const row = bewares.filter(b => b.severity === "high").slice(0,8);
          const doubled = [...row, ...row];
          return (
            <div className="mb-3 overflow-hidden">
              <div className="flex w-max gap-3" style={{animation:"marquee-right 35s linear infinite"}}>
                {doubled.map((b, i) => (
                  <div key={i} className="flex shrink-0 items-center gap-2 border border-gold/30 bg-gold/10 px-3 py-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-gold" />
                    <span className="font-mono text-xs text-gold/90">{b.city}</span>
                    <span className="font-mono text-xs text-warm-white/60">{b.title}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })()}

        {/* row 3 — medium, scrolls left slower */}
        {(() => {
          const row = bewares.filter(b => b.severity === "medium");
          const doubled = [...row, ...row];
          return (
            <div className="overflow-hidden">
              <div className="flex w-max gap-3" style={{animation:"marquee-left 42s linear infinite"}}>
                {doubled.map((b, i) => (
                  <div key={i} className="flex shrink-0 items-center gap-2 border border-sage/30 bg-sage/10 px-3 py-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-sage" />
                    <span className="font-mono text-xs text-sage/90">{b.city}</span>
                    <span className="font-mono text-xs text-warm-white/60">{b.title}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })()}

        {/* disclaimer */}
        <p className="mt-6 px-6 font-mono text-[10px] text-warm-white/25">
          All Beware Board entries shown in this V0 demo are illustrative mock data and do not represent real incidents.
        </p>
      </section>

      {/* ── Contributor model ─────────────────────────────────────────── */}
      <section id="contributors" className="bg-sand px-6 py-16">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8">
            <p className="mb-1 font-mono text-xs uppercase tracking-[0.2em] text-ww-muted">
              For contributors
            </p>
            <h2 className="font-serif text-3xl text-ink md:text-4xl">
              Write what you know.
            </h2>
            <p className="mt-3 max-w-xl font-mono text-sm leading-relaxed text-ww-muted">
              We&apos;re looking for the first founding contributors — women who
              know one route or city deeply and want to share what guidebooks miss.
            </p>
          </div>

          <div className="grid gap-3 border border-ww-border bg-warm-white p-6 sm:grid-cols-3">
            <div>
              <p className="mb-1 font-mono text-[10px] uppercase tracking-widest text-rust">01</p>
              <p className="font-mono text-sm font-semibold text-ink">You write</p>
              <p className="mt-1 text-xs leading-relaxed text-ww-muted">
                One Trip Intel Card on a city or route you&apos;ve travelled solo
                more than three times.
              </p>
            </div>
            <div>
              <p className="mb-1 font-mono text-[10px] uppercase tracking-widest text-rust">02</p>
              <p className="font-mono text-sm font-semibold text-ink">We publish</p>
              <p className="mt-1 text-xs leading-relaxed text-ww-muted">
                Your name, photo, and bio on the card. You&apos;re credited
                everywhere it&apos;s shared.
              </p>
            </div>
            <div>
              <p className="mb-1 font-mono text-[10px] uppercase tracking-widest text-rust">03</p>
              <p className="font-mono text-sm font-semibold text-ink">You earn</p>
              <p className="mt-1 text-xs leading-relaxed text-ww-muted">
                Revenue share when founding members read and cite your card.
                We&apos;ll publish the per-card numbers once we have real data.
              </p>
            </div>
          </div>

          <p className="mt-6 font-mono text-xs leading-relaxed text-ww-muted">
            We&apos;re not promising a number until we&apos;ve paid one out.
            Founding contributors get 2× the standard share for life.{" "}
            <Link href="/coming-soon" className="text-rust underline underline-offset-2">
              Apply to be a founding contributor →
            </Link>
          </p>
        </div>
      </section>

      {/* ── Founding membership email capture ────────────────────────── */}
      <section id="membership" className="bg-ink px-6 py-20">
        <div className="mx-auto max-w-2xl text-center">
          {/* spots counter */}
          <div className="mb-6 inline-flex items-center gap-2 border border-warm-white/10 px-4 py-2">
            <span className="h-2 w-2 animate-pulse rounded-full bg-rust" />
            <span className="font-mono text-xs text-warm-white/60">
              <strong className="text-warm-white">17 of 200</strong> founding spots remaining
            </span>
          </div>

          <h2 className="mb-4 font-serif text-3xl leading-tight text-warm-white sm:text-4xl md:text-5xl">
            Join as a founding member.
          </h2>
          <p className="mb-3 text-base leading-relaxed text-warm-white/60">
            ₹499 once. Lifetime access to all premium intel cards, founding badge,
            and 2× earnings if you become a contributor.
          </p>
          <p className="mb-10 font-mono text-xs text-warm-white/30">
            Price goes to ₹999 after founding 200 fill. No auto-renewal. No spam.
          </p>

          <EmailSignupForm
            source="landing-founding"
            placeholder="your@email.com"
            buttonText="Claim my spot →"
            dark
          />

          {/* what you get */}
          <ul className="mt-10 grid gap-2 text-left sm:grid-cols-2">
            {[
              "All 15 premium intel cards unlocked",
              "Founding member badge on your profile",
              "Early access to buddy matching",
              "Vote on which destinations we cover next",
              "2× contributor earnings for 12 months",
              "Direct line to the founding team",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2 font-mono text-xs text-warm-white/50">
                <span className="mt-0.5 text-gold">✓</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}
