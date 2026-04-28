import Link from "next/link";
import intelCards from "@/lib/mock-data/intel-cards.json";
import contributors from "@/lib/mock-data/contributors.json";
import bewares from "@/lib/mock-data/beware-entries.json";
import communityPosts from "@/lib/mock-data/community-posts.json";

export const metadata = { title: "Wander Women — Trip Intel for Solo Women Travellers" };

export default function HomePage() {
  // pre-select data each section needs
  const previewCards = intelCards.filter((c) =>
    ["goa-india", "rishikesh-india", "jaipur-india"].includes(c.slug)
  );
  const featuredContributors = contributors.slice(0, 4);
  const tickerEntries = bewares.slice(0, 15);
  const askPosts = communityPosts.filter((p) => p.tab === "ask").slice(0, 3);

  return (
    <main>
      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section id="hero" className="relative overflow-hidden bg-warm-white px-6 pt-20 pb-16 md:pt-28 md:pb-24">
        {/* decorative top rule */}
        <div className="mx-auto mb-8 max-w-4xl">
          <div className="h-px w-12 bg-rust" />
        </div>

        <div className="mx-auto max-w-4xl">
          {/* eyebrow */}
          <p className="mb-6 font-mono text-xs uppercase tracking-[0.2em] text-ww-muted">
            Women-only · Solo travel intelligence · India
          </p>

          {/* headline — Cormorant, ~64px on desktop */}
          <h1 className="mb-6 font-serif text-5xl leading-[1.1] tracking-tight text-ink md:text-7xl">
            Trip intel written by women who{" "}
            <em className="not-italic text-rust">actually</em> travel solo.
          </h1>

          {/* subline */}
          <p className="mb-10 max-w-2xl text-base leading-relaxed text-ww-muted md:text-lg">
            Real scam warnings, neighbourhood safety ratings, and hidden gems —
            researched and verified by 47 Indian women who live these routes.
            Not a listicle. Not a press trip.
          </p>

          {/* dual CTA */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href="/onboarding?path=indian"
              className="inline-flex items-center justify-center gap-2 rounded-none bg-rust px-7 py-3.5 font-mono text-sm uppercase tracking-widest text-warm-white transition-opacity hover:opacity-90"
            >
              I travel India as an Indian woman
              <span aria-hidden>→</span>
            </Link>
            <Link
              href="/onboarding?path=foreign"
              className="inline-flex items-center justify-center gap-2 rounded-none border border-ink px-7 py-3.5 font-mono text-sm uppercase tracking-widest text-ink transition-colors hover:bg-ink hover:text-warm-white"
            >
              I&apos;m visiting India from abroad
              <span aria-hidden>→</span>
            </Link>
          </div>

          {/* micro trust line */}
          <p className="mt-8 font-mono text-xs text-ww-muted">
            Free to browse · Founding membership ₹499 · No spam, ever
          </p>
        </div>
      </section>

      {/* ── Trust bar ────────────────────────────────────────────────── */}
      <section id="trust" className="border-y border-ww-border bg-sand px-6 py-6">
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-4 sm:flex-row sm:justify-between">
          {/* avatars + stat */}
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              {featuredContributors.map((c) => (
                <img
                  key={c.slug}
                  src={c.photoUrl}
                  alt={c.name}
                  className="h-9 w-9 rounded-full border-2 border-sand object-cover"
                />
              ))}
            </div>
            <p className="font-mono text-xs text-ink">
              Built by <span className="font-semibold">47 women.</span>
            </p>
          </div>

          {/* divider — desktop only */}
          <div className="hidden h-6 w-px bg-ww-border sm:block" />

          {/* trust stats */}
          <div className="flex gap-6 font-mono text-xs text-ww-muted">
            <span><strong className="text-ink">1,200+</strong> travellers trust this</span>
            <span><strong className="text-ink">15</strong> destinations</span>
            <span><strong className="text-ink">250+</strong> scam reports</span>
          </div>
        </div>
      </section>

      {/* ── Intel Card preview strip ──────────────────────────────────── */}
      <section id="intel-preview" className="bg-warm-white py-16">
        <div className="mx-auto mb-8 max-w-4xl px-6">
          <p className="mb-1 font-mono text-xs uppercase tracking-[0.2em] text-ww-muted">
            Trip Intel Cards
          </p>
          <h2 className="font-serif text-3xl text-ink md:text-4xl">
            Real intel. Not a travel blog.
          </h2>
        </div>

        {/* horizontal scroll on mobile, 3-col grid on md+ */}
        <div className="flex gap-4 overflow-x-auto px-6 pb-4 md:mx-auto md:grid md:max-w-4xl md:grid-cols-3 md:overflow-visible md:pb-0">
          {previewCards.map((c) => {
            const contributor = contributors.find((x) => x.slug === c.contributorSlug);
            return (
              <Link
                key={c.slug}
                href={`/intel/${c.slug}`}
                className="group relative flex min-w-[280px] flex-col overflow-hidden border border-ww-border bg-sand transition-shadow hover:shadow-md md:min-w-0"
              >
                {/* hero image */}
                <div className="relative h-44 overflow-hidden bg-rust-light">
                  <img
                    src={c.heroImageUrl}
                    alt={c.destination}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {c.isPremium && (
                    <span className="absolute right-3 top-3 bg-ink px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-gold">
                      Premium
                    </span>
                  )}
                </div>

                {/* content */}
                <div className="flex flex-1 flex-col gap-2 p-4">
                  <p className="font-mono text-[10px] uppercase tracking-widest text-ww-muted">
                    {c.country}
                  </p>
                  <h3 className="font-serif text-xl leading-tight text-ink">
                    {c.destination}
                  </h3>
                  <p className="line-clamp-2 text-xs leading-relaxed text-ww-muted">
                    {c.tldr[0]}
                  </p>

                  {/* contributor */}
                  {contributor && (
                    <div className="mt-auto flex items-center gap-2 pt-3">
                      <img
                        src={contributor.photoUrl}
                        alt={contributor.name}
                        className="h-6 w-6 rounded-full object-cover"
                      />
                      <span className="font-mono text-[10px] text-ww-muted">
                        by {contributor.name}
                      </span>
                    </div>
                  )}
                </div>

                <div className="border-t border-ww-border px-4 py-2.5">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-rust">
                    Read the intel →
                  </span>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="mx-auto mt-8 max-w-4xl px-6">
          <Link
            href="/explore"
            className="font-mono text-xs uppercase tracking-widest text-rust hover:underline"
          >
            Browse all 15 destinations →
          </Link>
        </div>
      </section>

      {/* ── Persona split (Priya / Sara) ──────────────────────────────── */}
      <section id="personas" className="bg-sand px-6 py-16">
        <div className="mx-auto max-w-4xl">
          <p className="mb-1 font-mono text-xs uppercase tracking-[0.2em] text-ww-muted">
            Who is this for?
          </p>
          <h2 className="mb-8 font-serif text-3xl text-ink md:text-4xl">
            The intel is different. Choose yours.
          </h2>

          <div className="grid gap-4 md:grid-cols-2">
            {/* Priya — Indian woman */}
            <Link
              href="/onboarding?path=indian"
              className="group flex flex-col justify-between border border-ww-border bg-warm-white p-7 transition-shadow hover:shadow-md"
            >
              <div>
                <div className="mb-4 flex items-center gap-3">
                  <img
                    src={contributors.find(c => c.slug === "ananya-mumbai")?.photoUrl}
                    alt="Priya"
                    className="h-11 w-11 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-widest text-ww-muted">Indian women</p>
                    <p className="font-serif text-lg text-ink">The Priya path</p>
                  </div>
                </div>
                <p className="mb-5 text-sm leading-relaxed text-ww-muted">
                  You know India. You know the language, the culture, the looks.
                  But solo travel still carries weight — family pressure, neighbourhood
                  safety gaps, the auto driver who won&apos;t use the meter.
                  This intel is written for you.
                </p>
                <ul className="space-y-1.5 font-mono text-xs text-ww-muted">
                  {["City-by-city safety ratings", "Scam patterns specific to women travelling alone", "Women-only stays and female-founded spaces", "How to navigate family pushback"].map(item => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="mt-0.5 text-sage">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-7 flex items-center justify-between border-t border-ww-border pt-4">
                <span className="font-mono text-xs uppercase tracking-widest text-rust">
                  Start here →
                </span>
                <span className="font-mono text-[10px] text-ww-muted">23 destinations</span>
              </div>
            </Link>

            {/* Sara — foreign woman */}
            <Link
              href="/onboarding?path=foreign"
              className="group flex flex-col justify-between border border-ww-border bg-ink p-7 transition-shadow hover:shadow-md"
            >
              <div>
                <div className="mb-4 flex items-center gap-3">
                  <img
                    src={contributors.find(c => c.slug === "sara-berlin")?.photoUrl}
                    alt="Sara"
                    className="h-11 w-11 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-widest text-gold">Foreign women</p>
                    <p className="font-serif text-lg text-warm-white">The Sara path</p>
                  </div>
                </div>
                <p className="mb-5 text-sm leading-relaxed text-warm-white/70">
                  You&apos;re coming from outside India. The rules are different —
                  visibly foreign women face a different threat profile. The intel
                  here is blunt about what&apos;s harder, what&apos;s genuinely fine,
                  and what every travel article gets wrong.
                </p>
                <ul className="space-y-1.5 font-mono text-xs text-warm-white/60">
                  {["What changes when you look foreign", "Visa, SIM card and cash reality", "Which cities are hardest and why", "Pre-trip safety kit for India specifically"].map(item => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="mt-0.5 text-gold">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-7 flex items-center justify-between border-t border-warm-white/10 pt-4">
                <span className="font-mono text-xs uppercase tracking-widest text-gold">
                  Start here →
                </span>
                <span className="font-mono text-[10px] text-warm-white/40">Written by Sara, Berlin → Goa</span>
              </div>
            </Link>
          </div>
        </div>
      </section>

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

      {/* ── Community teaser ─────────────────────────────────────────── */}
      <section id="community" className="bg-warm-white px-6 py-16">
        <p>Community teaser — Step 7 — {askPosts.length} posts loaded</p>
      </section>

      {/* ── Contributor earnings showcase ─────────────────────────────── */}
      <section id="contributors" className="bg-sand px-6 py-16">
        <p>Contributor showcase — Step 8</p>
      </section>

      {/* ── Founding membership email capture ────────────────────────── */}
      <section id="membership" className="bg-ink px-6 py-20">
        <p className="text-warm-white">Membership capture — Step 9</p>
      </section>
    </main>
  );
}
