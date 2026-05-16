import Link from "next/link";
import { EmailSignupForm } from "@/components/shared/EmailSignupForm";
import HeroBackground from "@/components/shared/HeroBackground";
import WhatsInside from "@/components/landing/WhatsInside";
import { ContinueWhereYouLeftOff } from "@/components/landing/ContinueWhereYouLeftOff";
import { RustButton } from "@/components/ui/RustButton";
import communityPosts from "@/lib/mock-data/community-posts.json";
import { ExitIntentModal } from "@/components/shared/ExitIntentModal";
import { createStaticClient } from "@/lib/supabase/server";
import { safeQuery } from "@/lib/safe-query";
import { getCurrentSegment } from "@/lib/onboarding-segment";
export const revalidate = 3600;
export const metadata = { title: "Wander Women, Destinations for Solo Women Travellers" };

// Refresh the intel-cards count + Beware ticker at most once a minute.
// Means new approved reports show up on the landing without rebuilding
// the site, but a bursty submission day doesn't hammer the DB.
export const revalidate = 60;

const FALLBACK_TOTAL_DESTINATIONS = 21;
const COUNT_TIMEOUT_MS = 1500;

// Don't let a slow or unreachable Supabase block the hero. If the count
// query takes longer than COUNT_TIMEOUT_MS or rejects, fall back to the
// last-known total so the page still renders fast.
async function getTotalDestinations(): Promise<number> {
  try {
    const supabase = createStaticClient();
    const result = await Promise.race([
      supabase.from("intel_cards").select("*", { count: "exact", head: true }),
      new Promise<{ count: null }>((resolve) =>
        setTimeout(() => resolve({ count: null }), COUNT_TIMEOUT_MS),
      ),
    ]);
    return result.count ?? FALLBACK_TOTAL_DESTINATIONS;
  } catch {
    return FALLBACK_TOTAL_DESTINATIONS;
  }
}

type TickerEntry = { city: string; title: string; severity: string };

// Pull the most recent 30 approved Beware reports for the landing ticker.
// safeQuery falls back to [] on slow/dead Supabase, the ticker section
// then renders an empty-state CTA instead of three blank marquee rows.
async function getBewareTicker(): Promise<TickerEntry[]> {
  const supabase = createStaticClient();
  const rows = await safeQuery<{ city: string | null; title: string; severity: string | null }[]>(
    supabase
      .from("beware_reports")
      .select("city, title, severity")
      .eq("status", "approved")
      .order("created_at", { ascending: false })
      .limit(30),
    [],
    1500,
    "landing.beware_ticker",
  );
  return rows
    .filter((r) => r.title)
    .map((r) => ({
      city: r.city ?? "",
      title: r.title,
      severity: (r.severity ?? "medium").toLowerCase(),
    }));
}

export default async function HomePage() {
  const [totalDestinations, bewares, segment] = await Promise.all([
    getTotalDestinations(),
    getBewareTicker(),
    getCurrentSegment(),
  ]);

  // pre-select data each section needs
  const askPosts = communityPosts.filter((p) => p.tab === "ask").slice(0, 3);

  // Bucket approved reports into the three marquee rows. "critical" reports
  // remain in row 1 if any seeded entries still carry that label, new
  // submissions only emit low/medium/high so most days row 1 is "high"-led.
  const criticals = bewares.filter((b) => b.severity === "critical");
  const highs = bewares.filter((b) => b.severity === "high");
  const mediums = bewares.filter((b) => b.severity === "medium");
  const tickerRows = [
    [...criticals, ...highs.slice(0, 3)],
    highs.slice(0, 8),
    mediums,
  ];
  const tickerHasContent = tickerRows.some((r) => r.length > 0);

  return (
    <main>
      <ExitIntentModal />

      {/* Personalised "continue where you left off", only renders for users
          who completed /onboarding (segment.destination is set). Sits above
          the hero so first-time visitors don't see it, onboarded visitors
          get a one-tap return path to their destination. */}
      {segment?.destination && (
        <ContinueWhereYouLeftOff
          destination={segment.destination}
          need={segment.need}
        />
      )}

      {/* Hero */}
      <section id="hero" className="relative overflow-hidden bg-ink px-6 pt-20 pb-16 md:pt-28 md:pb-24">
        <HeroBackground />

        {/* decorative top rule */}
        <div className="relative z-20 mx-auto mb-8 max-w-4xl">
          <div className="h-px w-12 bg-rust" />
        </div>

        <div className="relative z-20 mx-auto max-w-4xl">
          {/* eyebrow */}
          <p className="mb-6 font-mono text-xs uppercase tracking-[0.2em] text-warm-white/80">
            Women-only, Solo travel intelligence
          </p>

          {/* headline, Cormorant, ~64px on desktop */}
          <h1 className="mb-6 font-serif text-3xl leading-[1.1] tracking-tight text-warm-white sm:text-5xl md:text-7xl font-bold">
            Stress free travel. The guidebook that was never written for you,{" "}
            <em className="not-italic text-rust">yet</em>
          </h1>

          {/* subline, single concrete promise (safety) up front */}
          <p className="mb-10 max-w-2xl text-base leading-relaxed text-warm-white/85 md:text-lg">
            Find out if a place is actually safe, before you go. Honest scam
            reports and ground-truth tips from women who&apos;ve been there.
            Free to browse.
          </p>

          {/* dual CTA, split by audience at first touch. Indian women
              go to /onboarding?region=india, visitors from abroad go to
              /onboarding?region=foreign. Each path personalises the
              onboarding flow + intel surfaces shown after. */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <RustButton size="lg" asChild>
              <Link href="/onboarding?region=india">
                Travel India
                <span aria-hidden>→</span>
              </Link>
            </RustButton>
            <Link
              href="/onboarding?region=foreign"
              className="inline-flex items-center justify-center gap-2 rounded-none border border-warm-white/40 px-7 py-3.5 font-mono text-sm uppercase tracking-widest text-warm-white transition-[...]
            "
            >
              <span className="hidden sm:inline">Travel </span>Outside India
              <span aria-hidden>→</span>
            </Link>
          </div>

          {/* micro trust line */}
          <p className="mt-8 font-mono text-xs text-warm-white/65">
            Free during beta, ₹999/year founding rate locks for life when payment opens, No spam, ever
          </p>
        </div>
      </section>

      {/* Trust bar */}
      <section id="trust" className="border-y border-ww-border bg-sand px-6 py-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="font-serif text-xl leading-relaxed text-ink md:text-2xl">
            Built by one founder with{" "}
            <span className="text-rust">7 years</span> of solo travel experience in India.
          </p>
          <p className="mt-3 font-mono text-xs leading-relaxed text-ww-muted">
            Be one of the first{" "}
            <Link
              href="#join"
              className="font-semibold text-rust underline-offset-4 hover:underline"
            >
              200 founding members
            </Link>{" "}
            who shape what this becomes.
          </p>
        </div>
      </section>

      {/* What's inside (Intel + Personas + Community combined) */}
      <WhatsInside
        askPosts={askPosts}
        totalDestinations={totalDestinations}
      />

      {/* Beware Board scam ticker */}
      {/*
        V1: ticker reads live, moderator-approved beware_reports from Supabase
        (see getBewareTicker above). Severity buckets that come back empty
        simply hide their marquee row, if every bucket is empty we render an
        empty-state CTA pointing users to /contribute/report instead of three
        blank scrolling rails. The "V0 demo mock data" disclaimer is gone,
        nothing illustrative ships here anymore.
      */}
      <section id="ticker" className="overflow-hidden border-y border-ww-border bg-ink py-10">
        {/* header */}
        <div className="mb-6 flex items-baseline gap-4 px-6">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-warm-white/40">
            Live Beware Board
          </p>
          <span className="h-px flex-1 bg-warm-white/10" />
          <Link href="/community?tab=beware" className="font-mono text-[10px] uppercase tracking-widest text-rust hover:underline">
            See all reports →
          </Link>
        </div>

        {tickerHasContent ? (
          <>
            {tickerRows[0].length > 0 && (
              <div className="mb-3 overflow-hidden">
                <div
                  className="flex w-max gap-3"
                  style={{ animation: "marquee-left 28s linear infinite" }}
                >
                  {[...tickerRows[0], ...tickerRows[0]].map((b, i) => (
                    <div key={i} className="flex shrink-0 items-center gap-2 border border-rust/30 bg-rust/10 px-3 py-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-rust" />
                      <span className="font-mono text-xs text-rust/90">{b.city}</span>
                      <span className="font-mono text-xs text-warm-white/60">{b.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {tickerRows[1].length > 0 && (
              <div className="mb-3 overflow-hidden">
                <div
                  className="flex w-max gap-3"
                  style={{ animation: "marquee-right 35s linear infinite" }}
                >
                  {[...tickerRows[1], ...tickerRows[1]].map((b, i) => (
                    <div key={i} className="flex shrink-0 items-center gap-2 border border-gold/30 bg-gold/10 px-3 py-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-gold" />
                      <span className="font-mono text-xs text-gold/90">{b.city}</span>
                      <span className="font-mono text-xs text-warm-white/60">{b.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {tickerRows[2].length > 0 && (
              <div className="overflow-hidden">
                <div
                  className="flex w-max gap-3"
                  style={{ animation: "marquee-left 42s linear infinite" }}
                >
                  {[...tickerRows[2], ...tickerRows[2]].map((b, i) => (
                    <div key={i} className="flex shrink-0 items-center gap-2 border border-sage/30 bg-sage/10 px-3 py-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-sage" />
                      <span className="font-mono text-xs text-sage/90">{b.city}</span>
                      <span className="font-mono text-xs text-warm-white/60">{b.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="px-6">
            <div className="border border-warm-white/15 bg-warm-white/[0.03] px-5 py-6 text-center">
              <p className="mb-2 font-serif text-lg text-warm-white">
                Be the first to flag a scam.
              </p>
              <p className="mx-auto mb-4 max-w-md font-mono text-xs leading-relaxed text-warm-white/60">
                The Beware Board is moderated and date-stamped. Approved reports
                show up here and on the city scam map within 24 hours.
              </p>
              <RustButton size="sm" asChild>
                <Link href="/contribute/report">Submit a report →</Link>
              </RustButton>
            </div>
          </div>
        )}
      </section>

      {/* Final CTA, 05, The invitation (members + contributors) */}
      <section id="join" className="relative w-full overflow-hidden bg-warm-white py-16 md:py-20">
        {/* faint terracotta + sage washes for depth */}
        <div
          aria-hidden
          className="pointer-events-none absolute -right-40 -top-40 h-[32rem] w-[32rem] rounded-full bg-rust/10 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-40 -left-40 h-[32rem] w-[32rem] rounded-full bg-sage/10 blur-3xl"
        />

        <div className="relative mx-auto max-w-3xl px-6 md:px-10">
          {/* Members CTA, centered */}
          <div className="text-center">
            {/* Eyebrow with rules on both sides */}
            <div className="mb-5 flex items-center justify-center gap-3">
              <span className="h-px w-8 bg-rust" />
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-ww-muted">
                The invitation, 05
              </span>
              <span className="h-px w-8 bg-rust" />
            </div>

            {/* Headline */}
            <h2 className="mb-5 font-serif text-4xl leading-[1.05] text-ink md:text-5xl lg:text-6xl">
              Travel like she&apos;s{" "}
              <span className="italic text-rust">already been there.</span>
            </h2>

            {/* Subline */}
            <p className="mx-auto mb-7 max-w-xl text-base leading-relaxed text-ww-muted md:text-lg">
              We&apos;re opening 200 spots this month. No referrals, no waitlist
              theatre, just the women who want in first.
            </p>

            {/* Email signup, keeps existing Supabase leads wiring */}
            <div className="mx-auto max-w-md">
              <EmailSignupForm
                source="landing-founding"
                placeholder="your@email.com"
                buttonText="Request access →"
              />
              <p className="mt-4 font-mono text-[10px] uppercase tracking-widest text-ww-muted/70">
                Women only, phone + ID verification for Buddy matching, no spam, ever
              </p>
            </div>
          </div>

          {/* Contributors block, same centered axis as the hero so the
              section reads as one composition, not two stacked screens. */}
          <div id="contributors" className="mt-10 border-t border-ww-border pt-8 text-center md:mt-12 md:pt-10">
            <p id="contributors-label" className="mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-rust">
              For contributors
            </p>
            <h3 className="font-serif text-2xl text-ink md:text-3xl">
              Or write what you know.
            </h3>
            <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-ww-muted">
              We&apos;re looking for women who know one route or city deeply
              and want to share what guidebooks miss.
            </p>

            <ol className="mx-auto mt-7 grid max-w-2xl gap-5 text-left sm:grid-cols-3 sm:gap-4">
              <li>
                <p className="font-mono text-[10px] uppercase tracking-widest text-rust">01 · You write</p>
                <p className="mt-1.5 text-sm leading-relaxed text-ink/80">
                  One Trip Intel Card on a city or route you&apos;ve travelled
                  solo 3+ times.
                </p>
              </li>
              <li>
                <p className="font-mono text-[10px] uppercase tracking-widest text-rust">02 · We publish</p>
                <p className="mt-1.5 text-sm leading-relaxed text-ink/80">
                  Your name, photo, and bio on every card. Credited everywhere
                  it&apos;s shared.
                </p>
              </li>
              <li>
                <p className="font-mono text-[10px] uppercase tracking-widest text-rust">03 · You earn</p>
                <p className="mt-1.5 text-sm leading-relaxed text-ink/80">
                  Revenue share when members cite your card. Founding rate is
                  2× for life.
                </p>
              </li>
            </ol>

            <p className="mt-7 font-mono text-xs text-ww-muted">
              <Link href="/account/membership" className="text-rust underline underline-offset-2">
                Apply to be a founding contributor →
              </Link>
            </p>
          </div>

          {/* Manifesto, tight sign-off, not a separate section */}
          <p className="mx-auto mt-10 max-w-xl text-center font-serif text-lg italic leading-snug text-ww-muted md:mt-12 md:text-xl">
            &ldquo;The internet was built for the average traveller.
            We&apos;re building for the rest of us.&rdquo;
            <span className="mt-2 block font-mono text-[10px] not-italic uppercase tracking-widest text-ww-muted/60">
              , the founding 12
            </span>
          </p>
        </div>
      </section>
    </main>
  );
}
