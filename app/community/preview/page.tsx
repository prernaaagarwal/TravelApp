import Link from "next/link";
import {
  Search,
  ChevronDown,
  ChevronRight,
  HelpCircle,
  AlertTriangle,
  Map,
  MessageCircleQuestion,
  Heart,
  MessageCircle,
  Flag,
  MapPin,
  Sparkles,
  Filter,
  ChevronUp,
  CheckCircle2,
} from "lucide-react";

export const metadata = {
  title: "Community redesign preview — Wander Women",
  description:
    "Internal preview of the /community visual refresh. Not linked from nav.",
  robots: { index: false, follow: false },
};

/* ------------------------------------------------------------------
   /community/preview — visual redesign of the community hub.
   Pure visual demo: hardcoded sample posts, no Supabase calls, no
   server actions. Live /community is untouched. After approval, the
   visual patterns get copied into:
     - app/community/page.tsx
     - components/community/CommunityTabs.tsx
     - components/community/PostCard.tsx
   …and this preview file gets deleted.
------------------------------------------------------------------ */

type SamplePost = {
  initial: string;
  avatarTone: string;
  name: string;
  ageRange: string;
  location: string;
  date: string;
  text: string;
  replies: number;
  hearts: number;
};

const SAMPLE_POSTS: SamplePost[] = [
  {
    initial: "O",
    avatarTone: "bg-rust-light",
    name: "Olivia",
    ageRange: "25–32",
    location: "San Francisco",
    date: "3 May",
    text: "Solo travel after a big life change — divorce, breakup, job loss. How do you make sure you're going for the right reasons and not just running from something?",
    replies: 25,
    hearts: 66,
  },
  {
    initial: "S",
    avatarTone: "bg-blue-light",
    name: "Sophie",
    ageRange: "33–40",
    location: "London",
    date: "3 May",
    text: "Offline Google Maps saved my solo trip in Vietnam — what other offline tools do you swear by? Looking for the ones that actually work when the eSIM doesn't.",
    replies: 19,
    hearts: 39,
  },
  {
    initial: "R",
    avatarTone: "bg-sage-light",
    name: "Rachel",
    ageRange: "40+",
    location: "Melbourne",
    date: "3 May",
    text: "First time travelling solo at 47. Anyone else start later in life? Where did you go and what surprised you the most about doing it on your own?",
    replies: 31,
    hearts: 84,
  },
];

export default function CommunityPreviewPage() {
  return (
    <div className="bg-sand">
      {/* ── Top preview banner ───────────────────────────────── */}
      <div className="border-b border-gold/30 bg-gold-light/60">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-5 py-2 md:px-8">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-gold">
            <Sparkles
              className="mr-1.5 inline h-3 w-3 align-text-bottom"
              aria-hidden
            />
            Preview · /community redesign — sample data, not yet live
          </p>
          <Link
            href="/community"
            className="font-mono text-[10px] uppercase tracking-widest text-gold underline-offset-4 hover:underline"
          >
            ← live /community
          </Link>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════
          1 — HERO + QUICK ACTIONS
          ════════════════════════════════════════════════════════ */}
      <section className="border-b border-ww-border/60 bg-warm-white">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-12 md:px-8 md:py-16 lg:grid-cols-[1.4fr_1fr] lg:gap-12">
          {/* Left — hero text */}
          <div>
            <p className="mb-5 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.25em] text-rust">
              <span className="h-2 w-2 rounded-full bg-rust" aria-hidden />
              Solo female travel community
            </p>
            <h1 className="mb-5 font-serif text-5xl leading-[1.0] tracking-tight text-ink md:text-7xl">
              The group chat,{" "}
              <span className="font-serif font-medium italic text-gold">
                but actually
              </span>{" "}
              useful.
            </h1>
            <p className="max-w-md font-mono text-sm leading-relaxed text-ww-muted md:text-base">
              Ask anything. Share what happened. Flag what others need to know.
              A women-only space where real travellers answer real questions —
              fast, honest, no filters.
            </p>
          </div>

          {/* Right — three quick-action cards */}
          <div className="flex flex-col gap-3">
            {/* Ask */}
            <Link
              href="/community?tab=ask#compose"
              className="group flex items-center gap-4 rounded-2xl border border-rust/30 bg-rust-light/40 p-4 transition-colors hover:border-rust/60"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-rust/10 text-rust">
                <MessageCircleQuestion className="h-5 w-5" aria-hidden />
              </span>
              <div className="min-w-0 flex-1">
                <p className="mb-0.5 inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-rust">
                  <span
                    className="h-1.5 w-1.5 rounded-full bg-rust"
                    aria-hidden
                  />
                  Ask
                </p>
                <p className="font-serif text-lg leading-tight text-ink">
                  Ask the community
                </p>
                <p className="mt-0.5 truncate font-mono text-[11px] text-ink/70">
                  Get answers from women who&apos;ve been
                </p>
              </div>
              <ChevronRight
                className="h-4 w-4 shrink-0 text-rust transition-transform group-hover:translate-x-0.5"
                aria-hidden
              />
            </Link>

            {/* Report */}
            <Link
              href="/contribute/report"
              className="group flex items-center gap-4 rounded-2xl border border-gold/30 bg-gold-light/60 p-4 transition-colors hover:border-gold/60"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gold/10 text-gold">
                <AlertTriangle className="h-5 w-5" aria-hidden />
              </span>
              <div className="min-w-0 flex-1">
                <p className="mb-0.5 inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-gold">
                  <span
                    className="h-1.5 w-1.5 rounded-full bg-gold"
                    aria-hidden
                  />
                  Report
                </p>
                <p className="font-serif text-lg leading-tight text-ink">
                  Saw a scam?
                </p>
                <p className="mt-0.5 truncate font-mono text-[11px] text-ink/70">
                  Add it to the Beware Board in 2 min
                </p>
              </div>
              <ChevronRight
                className="h-4 w-4 shrink-0 text-gold transition-transform group-hover:translate-x-0.5"
                aria-hidden
              />
            </Link>

            {/* Browse */}
            <Link
              href="/explore"
              className="group flex items-center gap-4 rounded-2xl border border-blue/30 bg-blue-light/40 p-4 transition-colors hover:border-blue/60"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue/10 text-blue">
                <Map className="h-5 w-5" aria-hidden />
              </span>
              <div className="min-w-0 flex-1">
                <p className="mb-0.5 inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-blue">
                  <span
                    className="h-1.5 w-1.5 rounded-full bg-blue"
                    aria-hidden
                  />
                  Browse
                </p>
                <p className="font-serif text-lg leading-tight text-ink">
                  Browse by city
                </p>
                <p className="mt-0.5 truncate font-mono text-[11px] text-ink/70">
                  11 cities mapped, more weekly
                </p>
              </div>
              <ChevronRight
                className="h-4 w-4 shrink-0 text-blue transition-transform group-hover:translate-x-0.5"
                aria-hidden
              />
            </Link>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          2 — SEARCH + TABS + FILTERS
          ════════════════════════════════════════════════════════ */}
      <section className="mx-auto max-w-6xl px-5 pt-10 md:px-8">
        {/* Search */}
        <div className="rounded-full border border-ww-border bg-warm-white p-1.5 shadow-[0_1px_0_rgba(26,21,16,0.04)]">
          <div className="flex items-center gap-2 px-3">
            <Search className="h-4 w-4 shrink-0 text-ww-muted" aria-hidden />
            <span className="flex-1 truncate py-2 font-mono text-xs text-ww-muted md:text-sm">
              Search questions, stories, scam reports…
            </span>
            <button
              type="button"
              className="inline-flex items-center gap-1 rounded-full bg-ink px-4 py-2 font-mono text-[11px] uppercase tracking-widest text-warm-white transition-colors hover:bg-ink/90"
            >
              Search <ChevronRight className="h-3.5 w-3.5" aria-hidden />
            </button>
          </div>
        </div>

        {/* Tab pills + Filter pills row */}
        <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          {/* Tabs (Ask active) */}
          <div className="-mx-5 flex gap-2 overflow-x-auto px-5 md:mx-0 md:px-0">
            <button
              type="button"
              className="inline-flex shrink-0 items-center gap-2 rounded-full bg-ink px-4 py-2 font-mono text-[11px] uppercase tracking-widest text-warm-white"
            >
              <HelpCircle className="h-3.5 w-3.5" aria-hidden />
              Ask the community
            </button>
            <button
              type="button"
              className="inline-flex shrink-0 items-center gap-2 rounded-full border border-ww-border bg-warm-white px-4 py-2 font-mono text-[11px] uppercase tracking-widest text-ink hover:border-ink/40"
            >
              <MessageCircle className="h-3.5 w-3.5" aria-hidden />
              Real experiences
            </button>
            <button
              type="button"
              className="inline-flex shrink-0 items-center gap-2 rounded-full border border-ww-border bg-warm-white px-4 py-2 font-mono text-[11px] uppercase tracking-widest text-ink hover:border-ink/40"
            >
              <MapPin className="h-3.5 w-3.5" aria-hidden />
              Beware Board
            </button>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              className="inline-flex items-center gap-1.5 rounded-full border border-ww-border bg-warm-white px-3 py-1.5 font-mono text-[11px] uppercase tracking-widest text-ink hover:border-ink/40"
              aria-haspopup="listbox"
            >
              <Filter className="h-3 w-3" aria-hidden />
              Newest first
              <ChevronDown className="h-3 w-3" aria-hidden />
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-1.5 rounded-full border border-ww-border bg-warm-white px-3 py-1.5 font-mono text-[11px] uppercase tracking-widest text-ink hover:border-ink/40"
              aria-haspopup="listbox"
            >
              <MapPin className="h-3 w-3" aria-hidden />
              India
              <ChevronDown className="h-3 w-3" aria-hidden />
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-1.5 rounded-full border border-ww-border bg-warm-white px-3 py-1.5 font-mono text-[11px] uppercase tracking-widest text-ink hover:border-ink/40"
              aria-haspopup="listbox"
            >
              All cities
              <ChevronDown className="h-3 w-3" aria-hidden />
            </button>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          3 — COMPOSER PROMPT + POST LIST
          ════════════════════════════════════════════════════════ */}
      <section className="mx-auto max-w-6xl px-5 pb-16 pt-6 md:px-8 md:pb-24">
        {/* Composer prompt */}
        <div className="mb-5 rounded-full border border-ww-border bg-warm-white p-1.5 shadow-[0_1px_0_rgba(26,21,16,0.04)]">
          <div className="flex items-center gap-3 pl-4 pr-1.5">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-rust-light text-rust">
              <HelpCircle className="h-4 w-4" aria-hidden />
            </span>
            <span className="flex-1 truncate py-2 font-mono text-xs text-ww-muted md:text-sm">
              What do you want to know?
            </span>
            <Link
              href="/account/login?next=/community"
              className="inline-flex shrink-0 items-center gap-1 rounded-full bg-ink px-4 py-2 font-mono text-[11px] uppercase tracking-widest text-warm-white transition-colors hover:bg-ink/90"
            >
              Sign in to post <ChevronRight className="h-3.5 w-3.5" aria-hidden />
            </Link>
          </div>
        </div>

        {/* Post list */}
        <ul className="flex flex-col gap-4">
          {SAMPLE_POSTS.map((post) => (
            <li
              key={post.name}
              className="rounded-2xl border border-ww-border bg-warm-white p-5 transition-colors hover:border-ink/30 md:p-6"
            >
              {/* Header row */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  {/* Avatar with verified dot */}
                  <div className="relative">
                    <span
                      className={`flex h-11 w-11 items-center justify-center rounded-full ${post.avatarTone} font-serif text-xl text-ink`}
                    >
                      {post.initial}
                    </span>
                    <span
                      className="absolute -bottom-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-warm-white"
                      aria-label="Verified Traveller"
                      title="Verified Traveller"
                    >
                      <CheckCircle2
                        className="h-4 w-4 text-sage"
                        aria-hidden
                      />
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="font-mono text-xs text-ink">
                      <strong className="font-semibold">{post.name}</strong>{" "}
                      <span className="text-ww-muted">
                        · {post.ageRange} ·{" "}
                        <MapPin
                          className="inline h-3 w-3 align-text-top"
                          aria-hidden
                        />{" "}
                        {post.location}
                      </span>
                    </p>
                    <p className="mt-0.5 inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-[0.2em] text-sage">
                      <span
                        className="h-1.5 w-1.5 rounded-full bg-sage"
                        aria-hidden
                      />
                      Verified Traveller
                    </p>
                  </div>
                </div>
                <span className="shrink-0 font-mono text-[10px] uppercase tracking-widest text-ww-muted">
                  {post.date}
                </span>
              </div>

              {/* Body */}
              <p className="mt-4 font-serif text-lg leading-snug text-ink md:text-xl">
                {post.text}
              </p>
              <button
                type="button"
                className="mt-2 inline-flex items-center gap-1 font-mono text-[11px] uppercase tracking-widest text-ww-muted hover:text-ink"
              >
                See more <ChevronDown className="h-3 w-3" aria-hidden />
              </button>

              {/* Footer */}
              <div className="mt-5 flex items-center justify-between border-t border-ww-border/60 pt-4">
                <div className="flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-[11px] uppercase tracking-widest text-ww-muted">
                  <span className="inline-flex items-center gap-1.5">
                    <MessageCircle className="h-3.5 w-3.5" aria-hidden />
                    {post.replies} replies
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Heart className="h-3.5 w-3.5" aria-hidden />
                    {post.hearts}
                  </span>
                  <button
                    type="button"
                    className="inline-flex items-center gap-1.5 hover:text-ink"
                  >
                    <Flag className="h-3.5 w-3.5" aria-hidden />
                    Report
                  </button>
                </div>
                <button
                  type="button"
                  className="inline-flex items-center gap-1 rounded-full px-3 py-2 font-mono text-[11px] uppercase tracking-widest text-blue hover:bg-blue-light/60"
                >
                  Reply <ChevronRight className="h-3.5 w-3.5" aria-hidden />
                </button>
              </div>
            </li>
          ))}
        </ul>

        {/* Load more */}
        <div className="mt-6 text-center">
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-full border border-ww-border bg-warm-white px-5 py-2.5 font-mono text-[11px] uppercase tracking-widest text-ink transition-colors hover:border-ink/40"
          >
            Load more posts
            <ChevronUp className="h-3.5 w-3.5 rotate-180" aria-hidden />
          </button>
        </div>
      </section>

      {/* ── Foot ─────────────────────────────────────────────── */}
      <div className="border-t border-gold/30 bg-gold-light/60">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-5 py-3 md:px-8">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-gold">
            End of preview · approve to apply to live /community
          </p>
          <Link
            href="/community"
            className="font-mono text-[10px] uppercase tracking-widest text-gold underline-offset-4 hover:underline"
          >
            ← live /community
          </Link>
        </div>
      </div>
    </div>
  );
}
