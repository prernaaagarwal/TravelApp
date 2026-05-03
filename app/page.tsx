import Link from "next/link";
import Image from "next/image";
import intelCards from "@/lib/mock-data/intel-cards.json";
import contributors from "@/lib/mock-data/contributors.json";
import bewares from "@/lib/mock-data/beware-entries.json";
import communityPosts from "@/lib/mock-data/community-posts.json";
import { ExitIntentModal } from "@/components/shared/ExitIntentModal";

// Persona slugs for the "Priya path" and "Sara path" onboarding cards.
// Change here if contributors are renamed — nowhere else.
const PRIYA_SLUG = "ananya-mumbai";
const SARA_SLUG  = "sara-berlin";

export const metadata = { title: "Wander Women — Trip Intel for Solo Women Travellers" };

export default function HomePage() {
  // pre-select data each section needs
  const previewCards = intelCards.filter((c) =>
    ["goa-india", "rishikesh-india", "jaipur-india"].includes(c.slug)
  );
  const askPosts = communityPosts.filter((p) => p.tab === "ask").slice(0, 3);

  return (
    <main>
      <ExitIntentModal />

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section id="hero" className="relative flex min-h-screen overflow-hidden">
        {/* Background image + Ken Burns */}
        <div className="absolute inset-0">
          <Image
            src="/images/hero-rishikesh.jpg"
            alt="A woman watching dawn over the Ganges in Rishikesh"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center animate-ken"
          />
          {/* left-to-right: heavy dark on left fading right — keeps text legible */}
          <div className="absolute inset-0 bg-gradient-to-r from-ink/85 via-ink/55 to-ink/10" />
          {/* top-to-bottom: anchors top + bottom */}
          <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-ink/40" />
        </div>

        {/* Content */}
        <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col justify-center px-6 py-32 md:px-10">
          {/* decorative rule */}
          <div className="mb-8 h-px w-12 bg-rust animate-word" style={{ animationDelay: "0s" }} />

          {/* eyebrow */}
          <p
            className="mb-6 font-mono text-[10px] uppercase tracking-[0.22em] text-warm-white/65 animate-word"
            style={{ animationDelay: "0.15s" }}
          >
            Women-only · Solo travel intelligence · India
          </p>

          {/* headline */}
          <h1 className="mb-6 font-serif leading-[1.08] tracking-tight text-warm-white">
            <span
              className="block text-5xl animate-word md:text-7xl"
              style={{ animationDelay: "0.3s" }}
            >
              Stress free travel.
            </span>
            <span
              className="block text-5xl animate-word md:text-7xl"
              style={{ animationDelay: "0.45s" }}
            >
              The guidebook that was never written for you,
            </span>
            <em
              className="not-italic text-rust block text-5xl animate-word md:text-7xl"
              style={{ animationDelay: "0.6s" }}
            >
              yet
            </em>
          </h1>

          {/* subline */}
          <p
            className="mb-10 max-w-lg font-mono text-sm leading-relaxed text-warm-white/65 animate-word"
            style={{ animationDelay: "0.75s" }}
          >
            Safety intel, hidden gems, verified ground-truth tips — crowd-sourced
            from women who actually live these routes. Free to browse. No fluff.
          </p>

          {/* dual CTA */}
          <div
            className="flex flex-col gap-3 sm:flex-row sm:items-center animate-word"
            style={{ animationDelay: "0.9s" }}
          >
            <Link
              href="/onboarding?path=indian"
              className="inline-flex items-center justify-center gap-2 bg-rust px-7 py-3.5 font-mono text-sm uppercase tracking-widest text-warm-white transition-opacity hover:opacity-90"
            >
              Travel India <span aria-hidden>→</span>
            </Link>
            <Link
              href="/onboarding?path=foreign"
              className="inline-flex items-center justify-center gap-2 border border-warm-white/50 px-7 py-3.5 font-mono text-sm uppercase tracking-widest text-warm-white transition-colors hover:bg-warm-white/10"
            >
              Travel Outside India <span aria-hidden>→</span>
            </Link>
          </div>

          {/* micro trust line */}
          <p
            className="mt-8 font-mono text-xs text-warm-white/45 animate-word"
            style={{ animationDelay: "1.05s" }}
          >
            Free to browse · Founding membership ₹499 · No spam, ever
          </p>
        </div>
      </section>

      {/* ── Feature bento (Intel + Path + Community) ─────────────────── */}
      <section id="features" className="bg-warm-white px-6 py-16">
        <div className="mx-auto max-w-4xl">

          <div className="mb-8">
            <p className="mb-1 font-mono text-xs uppercase tracking-[0.2em] text-ww-muted">
              What&apos;s inside
            </p>
            <h2 className="font-serif text-3xl text-ink md:text-4xl">
              Real intel. Your path. Your people.
            </h2>
            <p className="mt-3 max-w-xl font-mono text-sm leading-relaxed text-ww-muted">
              Built on 7 years of solo travel in India — written by women,
              verified by women, for women only.
            </p>
          </div>

          <div className="grid gap-3 md:grid-cols-3">

            {/* ── Intel Cards — wide cell ── */}
            <div className="overflow-hidden border border-ww-border bg-sand md:col-span-2">
              {/* 3-city image strip */}
              <div className="flex h-40 divide-x divide-ww-border">
                {previewCards.map((c) => (
                  <div key={c.slug} className="relative flex-1 overflow-hidden">
                    <Image
                      src={c.heroImageUrl}
                      alt={c.destination}
                      fill
                      className="object-cover transition-transform duration-500 hover:scale-105"
                    />
                  </div>
                ))}
              </div>
              <div className="p-5">
                <p className="mb-1 font-mono text-[10px] uppercase tracking-widest text-rust">
                  Trip Intel Cards
                </p>
                <p className="mb-2 font-serif text-xl text-ink">
                  15 destinations. Every scam, gem, and neighbourhood rated.
                </p>
                <p className="mb-4 font-mono text-xs leading-relaxed text-ww-muted">
                  Ground-truth intel from women who&apos;ve done each route 3+ times. Safety
                  ratings, women-only stays, what every travel article gets wrong.
                </p>
                <Link
                  href="/explore"
                  className="font-mono text-[10px] uppercase tracking-widest text-rust hover:underline"
                >
                  Browse all destinations →
                </Link>
              </div>
            </div>

            {/* ── Your path — narrow cell ── */}
            <div className="flex flex-col border border-ww-border bg-ink p-5">
              <p className="mb-3 font-mono text-[10px] uppercase tracking-widest text-gold">
                Your path
              </p>
              <p className="mb-5 font-serif text-lg leading-snug text-warm-white">
                The intel is different.<br />Choose yours.
              </p>
              <div className="mt-auto space-y-2">
                <Link
                  href="/onboarding?path=indian"
                  className="flex items-center gap-3 border border-warm-white/10 bg-warm-white/5 p-3 transition-colors hover:bg-warm-white/10"
                >
                  <Image
                    src={contributors.find((c) => c.slug === PRIYA_SLUG)?.photoUrl ?? ""}
                    alt="Priya"
                    width={28}
                    height={28}
                    className="h-7 w-7 shrink-0 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-mono text-[9px] uppercase tracking-widest text-warm-white/40">
                      Indian women
                    </p>
                    <p className="font-serif text-sm text-warm-white">The Priya path</p>
                  </div>
                </Link>
                <Link
                  href="/onboarding?path=foreign"
                  className="flex items-center gap-3 border border-warm-white/10 bg-warm-white/5 p-3 transition-colors hover:bg-warm-white/10"
                >
                  <Image
                    src={contributors.find((c) => c.slug === SARA_SLUG)?.photoUrl ?? ""}
                    alt="Sara"
                    width={28}
                    height={28}
                    className="h-7 w-7 shrink-0 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-mono text-[9px] uppercase tracking-widest text-gold/60">
                      Foreign women
                    </p>
                    <p className="font-serif text-sm text-warm-white">The Sara path</p>
                  </div>
                </Link>
              </div>
            </div>

            {/* ── Community — full-width bottom cell ── */}
            <div className="border border-ww-border bg-sand p-5 md:col-span-3">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="mb-0.5 font-mono text-[10px] uppercase tracking-widest text-ww-muted">
                    Community
                  </p>
                  <p className="font-serif text-lg text-ink">
                    Women asking the real questions.
                  </p>
                </div>
                <Link
                  href="/community"
                  className="hidden font-mono text-[10px] uppercase tracking-widest text-rust hover:underline sm:block"
                >
                  Join the conversation →
                </Link>
              </div>
              <div className="grid gap-2 sm:grid-cols-3">
                {askPosts.map((post) => (
                  <Link
                    key={post.id}
                    href="/community"
                    className="border border-ww-border bg-warm-white p-4 transition-shadow hover:shadow-sm"
                  >
                    <div className="mb-2 flex items-center gap-2">
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-rust-light font-mono text-xs font-semibold text-rust">
                        {post.author[0]}
                      </div>
                      <span className="font-mono text-[10px] font-semibold text-ink">
                        {post.author}
                      </span>
                      {post.destination && (
                        <span className="rounded-full bg-blue-light px-1.5 py-0.5 font-mono text-[8px] text-blue">
                          {post.destination.replace("-india", "").replace("-", " ")}
                        </span>
                      )}
                    </div>
                    <p className="line-clamp-2 text-xs leading-relaxed text-ww-muted">
                      {post.content}
                    </p>
                    <p className="mt-2 font-mono text-[9px] text-ww-muted">
                      {post.replyCount} replies · {post.likeCount} found this helpful
                    </p>
                  </Link>
                ))}
              </div>
              <div className="mt-4 sm:hidden">
                <Link
                  href="/community"
                  className="font-mono text-[10px] uppercase tracking-widest text-rust hover:underline"
                >
                  Join the conversation →
                </Link>
              </div>
            </div>

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

      {/* ── Founding community (member + contributor combined) ───────── */}
      <section id="membership" className="bg-ink px-6 py-20">
        <div className="mx-auto max-w-5xl">

          {/* shared header */}
          <div className="mb-10 text-center">
            <div className="mb-5 inline-flex items-center gap-2 border border-warm-white/10 px-4 py-2">
              <span className="h-2 w-2 animate-pulse rounded-full bg-rust" />
              <span className="font-mono text-xs text-warm-white/60">
                <strong className="text-warm-white">17 of 200</strong> founding spots remaining
              </span>
            </div>
            <h2 className="font-serif text-4xl leading-tight text-warm-white md:text-5xl">
              Be part of the founding community.
            </h2>
            <p className="mx-auto mt-4 max-w-xl font-mono text-sm leading-relaxed text-warm-white/50">
              Two ways in. One as a member who reads. One as a contributor who writes.
              Both get founding-tier access for life.
            </p>
          </div>

          {/* two-column cards */}
          <div className="grid gap-4 md:grid-cols-2">

            {/* ── Member card ── */}
            <div className="flex flex-col border border-warm-white/10 bg-warm-white/5 p-7">
              <p className="mb-1 font-mono text-[10px] uppercase tracking-[0.2em] text-rust">
                Join as a member
              </p>
              <p className="mb-2 font-serif text-2xl text-warm-white">
                ₹499 once.
              </p>
              <p className="mb-6 font-mono text-xs leading-relaxed text-warm-white/50">
                Lifetime access to all premium intel cards, founding badge, and
                2× earnings if you later become a contributor.
              </p>

              <ul className="mb-8 space-y-2">
                {[
                  "All 15 premium intel cards unlocked",
                  "Founding member badge on your profile",
                  "Early access to buddy matching",
                  "Vote on which destinations we cover next",
                  "2× contributor earnings for 12 months",
                  "Direct line to the founding team",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 font-mono text-xs text-warm-white/50">
                    <span className="mt-0.5 shrink-0 text-gold">✓</span>
                    {item}
                  </li>
                ))}
              </ul>

              <p className="mb-4 font-mono text-[10px] text-warm-white/25">
                Price goes to ₹999 after founding 200 fill. No auto-renewal. No spam.
              </p>

              <form
                action="https://formspree.io/f/YOUR_FORM_ID"
                method="POST"
                className="mt-auto flex flex-col gap-2"
              >
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="your@email.com"
                  className="border border-warm-white/20 bg-warm-white/5 px-4 py-3 font-mono text-sm text-warm-white placeholder-warm-white/30 outline-none focus:border-rust"
                />
                <input type="hidden" name="source" value="landing-founding" />
                <button
                  type="submit"
                  className="bg-rust px-7 py-3 font-mono text-sm uppercase tracking-widest text-warm-white transition-opacity hover:opacity-90"
                >
                  Claim my spot →
                </button>
              </form>
            </div>

            {/* ── Contributor card ── */}
            <div className="flex flex-col border border-warm-white/10 bg-warm-white/5 p-7">
              <p className="mb-1 font-mono text-[10px] uppercase tracking-[0.2em] text-rust">
                Join as a contributor
              </p>
              <p className="mb-2 font-serif text-2xl text-warm-white">
                Write what you know.
              </p>
              <p className="mb-8 font-mono text-xs leading-relaxed text-warm-white/50">
                Women who know one route or city deeply and want to share what
                guidebooks miss. No journalism background required.
              </p>

              <div className="mb-8 space-y-5">
                {[
                  { n: "01", title: "You write", body: "One Trip Intel Card on a city or route you've travelled solo more than three times." },
                  { n: "02", title: "We publish", body: "Your name, photo, and bio on the card. You're credited everywhere it's shared." },
                  { n: "03", title: "You earn", body: "Revenue share when members read and cite your card. Founding contributors get 2× the standard share for life." },
                ].map(({ n, title, body }) => (
                  <div key={n} className="flex gap-4">
                    <span className="shrink-0 font-mono text-[10px] text-rust">{n}</span>
                    <div>
                      <p className="font-mono text-xs font-semibold text-warm-white">{title}</p>
                      <p className="mt-1 font-mono text-xs leading-relaxed text-warm-white/50">{body}</p>
                    </div>
                  </div>
                ))}
              </div>

              <p className="mb-5 font-mono text-[10px] leading-relaxed text-warm-white/25">
                We&apos;re not promising a number until we&apos;ve paid one out.
              </p>

              <Link
                href="/coming-soon"
                className="mt-auto inline-block border border-warm-white/20 px-7 py-3 text-center font-mono text-sm uppercase tracking-widest text-warm-white/70 transition-colors hover:border-warm-white/50 hover:text-warm-white"
              >
                Apply to contribute →
              </Link>
            </div>

          </div>
        </div>
      </section>
    </main>
  );
}
