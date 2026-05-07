import Link from "next/link";
import Image from "next/image";
import {
  AlertTriangle,
  ArrowRight,
  Heart,
  Shield,
  Star,
} from "lucide-react";

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
  askPosts: AskPost[];
  totalDestinations: number;
};

export default function WhatsInside({
  askPosts,
  totalDestinations,
}: Props) {
  return (
    <>
      {/* ── 01 — What's inside (single Rishikesh dossier showcase) ──── */}
      <section id="intel-preview" className="relative w-full overflow-hidden border-b border-ww-border bg-warm-white py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          {/* Section header */}
          <div className="mb-16 flex flex-col gap-6 md:mb-20 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <div className="mb-5 flex items-center gap-3">
                <span className="h-px w-10 bg-rust" />
                <span className="font-mono text-xs uppercase tracking-[0.18em] text-ww-muted">
                  What&apos;s inside · 01
                </span>
              </div>
              <h2 className="font-serif text-4xl leading-[0.95] text-ink md:text-6xl">
                Not a listicle.
                <br />
                <span className="italic text-rust">A field report.</span>
              </h2>
            </div>
            <p className="leading-relaxed text-ww-muted md:max-w-sm">
              Every destination is a living dossier — written, rated and updated
              by women who arrived last week, not last decade.
            </p>
          </div>

          {/* The dossier card */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-10">
            {/* Left: image + meta */}
            <div className="relative lg:col-span-5">
              <div className="relative aspect-[4/5] overflow-hidden bg-ink/10">
                <Image
                  src="/images/intel-rishikesh-journal.jpg"
                  alt="Open travel journal with map of Rishikesh"
                  fill
                  sizes="(max-width: 1024px) 100vw, 42vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-transparent" />

                {/* Floating safety score */}
                <div className="absolute left-5 top-5 border border-ink/5 bg-warm-white/95 px-4 py-3 backdrop-blur-sm">
                  <div className="mb-1 font-mono text-[10px] uppercase tracking-widest text-ww-muted">
                    Safety · solo F
                  </div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="font-serif text-3xl leading-none text-ink">8.4</span>
                    <span className="font-mono text-[10px] uppercase tracking-widest text-ww-muted">/10</span>
                  </div>
                  <div className="mt-1.5 flex gap-0.5">
                    {[1, 2, 3, 4].map((i) => (
                      <Star key={i} className="h-2.5 w-2.5 fill-rust text-rust" />
                    ))}
                    <Star className="h-2.5 w-2.5 fill-rust/30 text-rust/30" />
                  </div>
                </div>

                {/* Bottom location strip */}
                <div className="absolute bottom-5 left-5 right-5 text-warm-white">
                  <div className="mb-1 font-mono text-[10px] uppercase tracking-widest text-warm-white/70">
                    Dossier · IND-014
                  </div>
                  <div className="font-serif text-3xl leading-none">Rishikesh</div>
                  <div className="mt-2 font-mono text-[10px] uppercase tracking-widest text-warm-white/70">
                    Updated 3 days ago · by Ananya M.
                  </div>
                </div>
              </div>
            </div>

            {/* Right: intel content */}
            <div className="lg:col-span-7 lg:pl-4">
              {/* Tab pills */}
              <div className="mb-8 flex flex-wrap gap-2 font-mono text-[10px] uppercase tracking-widest">
                <span className="bg-ink px-3 py-1.5 text-warm-white">Safety</span>
                <span className="border border-ink/15 px-3 py-1.5 text-ww-muted">Stay</span>
                <span className="border border-ink/15 px-3 py-1.5 text-ww-muted">Eat</span>
                <span className="border border-ink/15 px-3 py-1.5 text-ww-muted">Move</span>
                <span className="border border-ink/15 px-3 py-1.5 text-ww-muted">Period kit</span>
              </div>

              {/* Warning callout */}
              <div className="mb-8 border-l-2 border-rust py-1 pl-5">
                <div className="mb-2 flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-rust">
                  <AlertTriangle className="h-3.5 w-3.5" />
                  Real warning · flagged by 12 women
                </div>
                <p className="font-serif text-2xl leading-snug text-ink md:text-3xl">
                  &ldquo;Avoid Lakshman Jhula bridge after 9pm.
                  Groups of men, no police, zero lighting.
                  Walk the Ram Jhula side instead.&rdquo;
                </p>
              </div>

              {/* Intel rows — 2 examples to keep the mobile view tight */}
              <div className="divide-y divide-ink/10 border-y border-ink/10">
                <IntelRow
                  icon={<Shield className="h-4 w-4" />}
                  label="Solo arrival"
                  value="Land before 4pm. Pre-book Ola from Dehradun airport — ₹1,800. Don't take touts."
                />
                <IntelRow
                  icon={<Heart className="h-4 w-4" />}
                  label="Period supplies"
                  value="Whisper / Stayfree at More Megastore (Tapovan). Cups: only Apollo Pharmacy, Haridwar Rd."
                />
              </div>

              {/* Footer CTA */}
              <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="font-mono text-[10px] uppercase tracking-widest text-ww-muted">
                  + 50 more intel points in this dossier
                </div>
                <Link
                  href="/intel/rishikesh-india"
                  className="group inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-rust hover:text-ink"
                >
                  Open full Rishikesh dossier
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </div>

          {/* Browse all link below the dossier */}
          <div className="mt-10">
            <Link
              href="/explore"
              className="font-mono text-xs uppercase tracking-widest text-rust hover:underline"
            >
              Browse all {totalDestinations} destinations →
            </Link>
          </div>
        </div>
      </section>

      {/* ── 02 — Two women. Two very different India's. ──────────────── */}
      <section id="personas" className="relative w-full overflow-hidden bg-ink py-24 text-warm-white md:py-32">
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          {/* Header */}
          <div className="mb-16 flex flex-col gap-6 md:mb-20 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <div className="mb-5 flex items-center gap-3">
                <span className="h-px w-10 bg-rust" />
                <span className="font-mono text-xs uppercase tracking-[0.18em] text-warm-white/55">
                  What&apos;s inside · 02
                </span>
              </div>
              <h2 className="font-serif text-4xl leading-[0.95] text-warm-white md:text-6xl">
                Two women.
                <br />
                <span className="italic text-rust">Two very different India&apos;s.</span>
              </h2>
            </div>
            <p className="leading-relaxed text-warm-white/65 md:max-w-sm">
              We don&apos;t pretend one guide fits everyone. Pick the path that
              sounds like your life — the intel reshapes around you.
            </p>
          </div>

          {/* Paths grid */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-10">
            {/* Priya — Path 01 · Indian women */}
            <PersonaCard
              index="01 / 02"
              tag="Path 01 · Indian women"
              name="Priya"
              who="26 · Bengaluru → wherever the long weekend takes her"
              photoUrl="/images/path-priya.jpg"
              headline="You know the country. You don't know the loopholes."
              bullets={[
                "How to spot a landlord scam in Goa before you Venmo",
                "Which sleeper coach berths are safe (and which to refuse)",
                "Female-only PG networks in 14 cities, vetted monthly",
                "Period-leave-friendly co-working stays under ₹900/night",
              ]}
              question="Solo to Spiti in October — homestay or Airbnb?"
              answer="Homestay. Airbnbs in Kaza shut by Nov, hosts ghost. Stay with Dolma in Langza — ₹1,200, dinner included, she'll WhatsApp your family every night."
              ctaHref="/onboarding?region=india"
              ctaLabel="Start as Priya"
            />

            {/* Sara — Path 02 · Foreign women */}
            <PersonaCard
              index="02 / 02"
              tag="Path 02 · Foreign women"
              name="Sara"
              who="29 · Berlin · first time in India, three weeks, no plan"
              photoUrl="/images/path-sara.jpg"
              headline="You've read every blog. None of them were written by a woman."
              bullets={[
                "What to actually wear in Varanasi vs. Goa vs. Delhi metro",
                "Female-run guesthouses with airport pickup (no negotiating at 2am)",
                "The 7 phrases in Hindi that make men back off, instantly",
                "Which trains foreigners can book, and the IRCTC workaround",
              ]}
              question="Landing in Delhi at 11pm alone. What do I do?"
              answer="Pre-paid taxi booth inside Terminal 3, never the kerb. Stay in Hauz Khas, not Paharganj. Text Anjali (host, +91 98...) — she leaves the gate unlocked till 1am."
              ctaHref="/onboarding?region=foreign"
              ctaLabel="Start as Sara"
            />
          </div>

          {/* Foot note */}
          <p className="mt-12 text-center font-mono text-[10px] uppercase tracking-widest text-warm-white/45">
            Not sure which? Most women start with the path closest to home, then unlock the other.
          </p>
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

function IntelRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="grid grid-cols-12 gap-4 py-4">
      <div className="col-span-12 flex items-center gap-2.5 text-ink/70 sm:col-span-4">
        <span className="text-rust">{icon}</span>
        <span className="font-mono text-[10px] uppercase tracking-widest">{label}</span>
      </div>
      <div className="col-span-12 leading-relaxed text-ink sm:col-span-8">{value}</div>
    </div>
  );
}

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
  name,
  who,
  photoUrl,
  headline,
  bullets,
  question,
  answer,
  ctaHref,
  ctaLabel,
}: {
  index: string;
  tag: string;
  name: string;
  who: string;
  photoUrl: string;
  headline: string;
  bullets: string[];
  question: string;
  answer: string;
  ctaHref: string;
  ctaLabel: string;
}) {
  return (
    <article className="group relative flex flex-col overflow-hidden border border-warm-white/10 bg-warm-white/[0.03] transition-colors hover:border-warm-white/25">
      {/* image with identity overlay */}
      <div className="relative aspect-[5/4] overflow-hidden">
        <Image
          src={photoUrl}
          alt={`${name} — ${who}`}
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-transparent" />

        <div className="absolute right-5 top-5 font-mono text-[10px] uppercase tracking-widest text-warm-white/60">
          {index}
        </div>

        <div className="absolute bottom-5 left-5 right-5">
          <div className="mb-2 font-mono text-[10px] uppercase tracking-widest text-rust">
            {tag}
          </div>
          <h3 className="font-serif text-5xl leading-none text-warm-white md:text-6xl">
            {name}
          </h3>
          <div className="mt-2 font-mono text-[10px] uppercase tracking-widest text-warm-white/60">
            {who}
          </div>
        </div>
      </div>

      {/* body */}
      <div className="flex flex-1 flex-col p-7 md:p-9">
        {/* Italic display quote — the headline */}
        <p className="mb-7 font-serif text-2xl italic leading-snug text-warm-white md:text-3xl">
          &ldquo;{headline}&rdquo;
        </p>

        {/* 4-bullet list */}
        <ul className="mb-8 space-y-3">
          {bullets.map((b) => (
            <li key={b} className="flex gap-3 text-sm leading-relaxed text-warm-white/80 md:text-base">
              <span className="mt-1 shrink-0 text-rust">✓</span>
              <span>{b}</span>
            </li>
          ))}
        </ul>

        {/* Real question · last week */}
        <div className="mb-8 border-t border-warm-white/10 pt-6">
          <div className="mb-3 font-mono text-[10px] uppercase tracking-widest text-warm-white/50">
            Real question · last week
          </div>
          <p className="mb-3 font-serif italic leading-relaxed text-warm-white/90 md:text-lg">
            &ldquo;{question}&rdquo;
          </p>
          <div className="flex gap-3">
            <span className="mt-1 shrink-0 font-mono text-[10px] uppercase tracking-widest text-rust">
              A ·
            </span>
            <p className="text-sm leading-relaxed text-warm-white/70 md:text-base">{answer}</p>
          </div>
        </div>

        {/* Solid terracotta CTA button */}
        <div className="mt-auto">
          <Link
            href={ctaHref}
            className="inline-flex items-center gap-3 bg-rust px-6 py-3.5 font-mono text-xs uppercase tracking-widest text-warm-white transition-opacity hover:opacity-90"
          >
            {ctaLabel}
            <span aria-hidden>→</span>
          </Link>
        </div>
      </div>
    </article>
  );
}
