import Link from "next/link";
import Image from "next/image";

/**
 * "What's inside" — combined showcase that merges what used to be three
 * separate landing sections (Trip Intel Cards, Who is this for?, Community)
 * into one numbered narrative, styled in the travel-app-refresh reference
 * language: terracotta accent rules, italic display headlines, dossier-card
 * surfaces.
 *
 * Text content is preserved verbatim from the previous separate sections —
 * only the visual treatment has been redesigned.
 */

type IntelCard = {
  slug: string;
  destination: string;
  country: string;
  contributorSlug?: string;
  heroImageUrl: string;
  isPremium?: boolean;
  tldr: unknown;
};

type Contributor = {
  slug: string;
  name: string;
  photoUrl: string;
};

type AskPost = {
  id: string;
  author: string;
  homeCity?: string;
  destination?: string;
  content: string;
  replyCount: number;
  likeCount: number;
};

type Props = {
  previewCards: IntelCard[];
  contributors: Contributor[];
  askPosts: AskPost[];
  priyaSlug: string;
  saraSlug: string;
};

export default function WhatsInside({
  previewCards,
  contributors,
  askPosts,
  priyaSlug,
  saraSlug,
}: Props) {
  const priya = contributors.find((c) => c.slug === priyaSlug);
  const sara  = contributors.find((c) => c.slug === saraSlug);

  return (
    <>
      {/* ── 01 — Trip Intel Cards ──────────────────────────────────── */}
      <section id="intel-preview" className="border-b border-ww-border bg-warm-white py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <BlockHeader
            number="01"
            tag="Trip Intel Cards"
            line1="Real intel."
            line2="Not a travel blog."
            description="Trip Intel Cards — written and updated by women who actually live these routes."
          />

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:gap-10">
            {previewCards.map((c) => {
              const contributor = contributors.find((x) => x.slug === c.contributorSlug);
              const tldrText =
                Array.isArray(c.tldr)
                  ? c.tldr[0]
                  : (c.tldr as { summary?: string })?.summary ?? "";
              return (
                <Link
                  key={c.slug}
                  href={`/intel/${c.slug}`}
                  className="group flex flex-col"
                >
                  {/* image card */}
                  <div className="relative aspect-[4/5] overflow-hidden bg-ink/10">
                    <Image
                      src={c.heroImageUrl}
                      alt={c.destination}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink/75 via-ink/15 to-transparent" />

                    {c.isPremium && (
                      <div className="absolute left-4 top-4 bg-warm-white/95 px-3 py-1.5 backdrop-blur-sm">
                        <span className="font-mono text-[10px] uppercase tracking-widest text-gold">
                          Premium
                        </span>
                      </div>
                    )}

                    <div className="absolute bottom-4 left-4 right-4 text-warm-white">
                      <div className="mb-1 font-mono text-[10px] uppercase tracking-widest text-warm-white/70">
                        {c.country}
                      </div>
                      <div className="font-serif text-2xl leading-none">{c.destination}</div>
                      {contributor && (
                        <div className="mt-2 font-mono text-[10px] text-warm-white/70">
                          by {contributor.name}
                        </div>
                      )}
                    </div>
                  </div>

                  <p className="mt-4 line-clamp-2 text-sm leading-relaxed text-ww-muted">
                    {tldrText as string}
                  </p>

                  <span className="mt-3 font-mono text-[10px] uppercase tracking-widest text-rust group-hover:underline">
                    Read the intel →
                  </span>
                </Link>
              );
            })}
          </div>

          <div className="mt-10">
            <Link
              href="/explore"
              className="font-mono text-xs uppercase tracking-widest text-rust hover:underline"
            >
              Browse all 15 destinations →
            </Link>
          </div>
        </div>
      </section>

      {/* ── 02 — Who is this for? (Personas) ───────────────────────── */}
      <section id="personas" className="relative w-full overflow-hidden bg-ink py-24 text-warm-white md:py-32">
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <BlockHeader
            dark
            number="02"
            tag="Who is this for?"
            line1="The intel is different."
            line2="Choose yours."
          />

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-10">
            {/* Priya — Indian women */}
            <PersonaCard
              index="01 / 02"
              tag="Indian women"
              title="The Priya path"
              photoUrl={priya?.photoUrl ?? ""}
              body="You know India. You know the language, the culture, the looks.
                But solo travel still carries weight — family pressure, neighbourhood
                safety gaps, the auto driver who won't use the meter.
                This intel is written for you."
              bullets={[
                "City-by-city safety ratings",
                "Scam patterns specific to women travelling alone",
                "Women-only stays and female-founded spaces",
                "How to navigate family pushback",
              ]}
              ctaHref="/onboarding?path=indian"
              ctaLabel="Start here →"
              meta="23 destinations"
              accent="rust"
            />

            {/* Sara — Foreign women */}
            <PersonaCard
              index="02 / 02"
              tag="Foreign women"
              title="The Sara path"
              photoUrl={sara?.photoUrl ?? ""}
              body="You're coming from outside India. The rules are different —
                visibly foreign women face a different threat profile. The intel
                here is blunt about what's harder, what's genuinely fine,
                and what every travel article gets wrong."
              bullets={[
                "What changes when you look foreign",
                "Visa, SIM card and cash reality",
                "Which cities are hardest and why",
                "Pre-trip safety kit for India specifically",
              ]}
              ctaHref="/onboarding?path=foreign"
              ctaLabel="Start here →"
              meta="Written by Sara, Berlin → Goa"
              accent="gold"
            />
          </div>
        </div>
      </section>

      {/* ── 03 — Community ─────────────────────────────────────────── */}
      <section id="community" className="bg-warm-white py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <div className="mb-16 flex flex-col gap-6 md:mb-20 md:flex-row md:items-end md:justify-between">
            <BlockHeader
              compact
              number="03"
              tag="Community"
              line1="Women asking"
              line2="the real questions."
            />
            <Link
              href="/community"
              className="self-start font-mono text-xs uppercase tracking-widest text-rust hover:underline md:self-end"
            >
              Join the conversation →
            </Link>
          </div>

          <div className="space-y-5 md:space-y-6">
            {askPosts.map((post) => (
              <Link
                key={post.id}
                href="/community"
                className="group block border border-ww-border bg-warm-white p-6 transition-colors hover:border-ink/25 md:p-9"
              >
                <div className="mb-6 flex flex-wrap items-center gap-3 font-mono text-[10px] uppercase tracking-widest">
                  <span className="bg-ink px-2.5 py-1 text-warm-white">
                    {post.destination
                      ? post.destination.replace("-india", "").replace("-", " ")
                      : "Ask"}
                  </span>
                  <span className="text-ww-muted">{post.homeCity}</span>
                  <span className="text-ww-border">·</span>
                  <span className="text-ww-muted">{post.replyCount} replies</span>
                  <span className="text-ww-border">·</span>
                  <span className="text-ww-muted">{post.likeCount} found this helpful</span>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                  <div className="lg:col-span-2">
                    <div className="mb-2 font-mono text-[10px] uppercase tracking-widest text-ww-muted">
                      Q
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-rust-light font-mono text-base font-semibold text-rust">
                      {post.author[0]}
                    </div>
                    <div className="mt-2 font-mono text-xs font-semibold text-ink">
                      {post.author}
                    </div>
                  </div>

                  <div className="lg:col-span-10">
                    <p className="font-serif text-xl leading-snug text-ink md:text-2xl">
                      &ldquo;{post.content}&rdquo;
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

/* ─────────────────────────────────────────────────────────────────── */

function BlockHeader({
  number,
  tag,
  line1,
  line2,
  description,
  dark,
  compact,
}: {
  number: string;
  tag: string;
  line1: string;
  line2: string;
  description?: string;
  dark?: boolean;
  compact?: boolean;
}) {
  const muted = dark ? "text-warm-white/55" : "text-ww-muted";
  const headlineColor = dark ? "text-warm-white" : "text-ink";

  if (compact) {
    return (
      <div className="max-w-2xl">
        <div className="mb-5 flex items-center gap-3">
          <span className="h-px w-10 bg-rust" />
          <span className={`font-mono text-xs uppercase tracking-[0.18em] ${muted}`}>
            {tag} · {number}
          </span>
        </div>
        <h2
          className={`font-serif text-4xl leading-[0.95] ${headlineColor} md:text-5xl`}
        >
          {line1}
          <br />
          <span className="italic text-rust">{line2}</span>
        </h2>
      </div>
    );
  }

  return (
    <div className="mb-16 flex flex-col gap-6 md:mb-20 md:flex-row md:items-end md:justify-between">
      <div className="max-w-2xl">
        <div className="mb-5 flex items-center gap-3">
          <span className="h-px w-10 bg-rust" />
          <span className={`font-mono text-xs uppercase tracking-[0.18em] ${muted}`}>
            {tag} · {number}
          </span>
        </div>
        <h2
          className={`font-serif text-4xl leading-[0.95] ${headlineColor} md:text-6xl`}
        >
          {line1}
          <br />
          <span className="italic text-rust">{line2}</span>
        </h2>
      </div>
      {description && (
        <p className={`leading-relaxed md:max-w-sm ${dark ? "text-warm-white/65" : "text-ww-muted"}`}>
          {description}
        </p>
      )}
    </div>
  );
}

function PersonaCard({
  index,
  tag,
  title,
  photoUrl,
  body,
  bullets,
  ctaHref,
  ctaLabel,
  meta,
  accent,
}: {
  index: string;
  tag: string;
  title: string;
  photoUrl: string;
  body: string;
  bullets: string[];
  ctaHref: string;
  ctaLabel: string;
  meta: string;
  accent: "rust" | "gold";
}) {
  const accentText = accent === "rust" ? "text-rust" : "text-gold";

  return (
    <article className="group relative flex flex-col overflow-hidden border border-warm-white/10 bg-warm-white/[0.03] transition-colors hover:border-warm-white/25">
      {/* image */}
      <div className="relative aspect-[5/4] overflow-hidden">
        <Image
          src={photoUrl}
          alt={title}
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-transparent" />

        <div className="absolute right-5 top-5 font-mono text-[10px] uppercase tracking-widest text-warm-white/60">
          {index}
        </div>

        <div className="absolute bottom-5 left-5 right-5">
          <div className={`mb-2 font-mono text-[10px] uppercase tracking-widest ${accentText}`}>
            {tag}
          </div>
          <h3 className="font-serif text-4xl leading-none text-warm-white md:text-5xl">
            {title}
          </h3>
        </div>
      </div>

      {/* body */}
      <div className="flex flex-1 flex-col p-7 md:p-9">
        <p className="mb-7 text-sm leading-relaxed text-warm-white/80 md:text-base">
          {body}
        </p>

        <ul className="mb-8 space-y-3">
          {bullets.map((b) => (
            <li key={b} className="flex gap-3 text-sm leading-relaxed text-warm-white/80">
              <span className={`mt-1 shrink-0 ${accentText}`}>✓</span>
              <span>{b}</span>
            </li>
          ))}
        </ul>

        <div className="mt-auto flex items-center justify-between border-t border-warm-white/10 pt-5">
          <Link
            href={ctaHref}
            className={`font-mono text-xs uppercase tracking-widest ${accentText} hover:underline`}
          >
            {ctaLabel}
          </Link>
          <span className="font-mono text-[10px] text-warm-white/40">{meta}</span>
        </div>
      </div>
    </article>
  );
}
