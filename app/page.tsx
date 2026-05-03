import Link from "next/link";
import Image from "next/image";
import { Shield, AlertTriangle, MapPin, Heart, Moon, Bus, ArrowRight, Star, Check } from "lucide-react";
import bewares from "@/lib/mock-data/beware-entries.json";
import { ExitIntentModal } from "@/components/shared/ExitIntentModal";

type PathDef = {
  tag: string;
  name: string;
  who: string;
  img: string;
  headline: string;
  bullets: string[];
  sample: { q: string; a: string };
  cta: string;
  href: string;
};

const PATHS: PathDef[] = [
  {
    tag: "Path 01 · Indian women",
    name: "Priya",
    who: "26 · Bengaluru → wherever the long weekend takes her",
    img: "/images/path-priya.jpg",
    headline: "You know the country. You don't know the loopholes.",
    bullets: [
      "How to spot a landlord scam in Goa before you Venmo",
      "Which sleeper coach berths are safe (and which to refuse)",
      "Female-only PG networks in 14 cities, vetted monthly",
      "Period-leave-friendly co-working stays under ₹900/night",
    ],
    sample: {
      q: "Solo to Spiti in October — homestay or Airbnb?",
      a: "Homestay. Airbnbs in Kaza shut by Nov, hosts ghost. Stay with Dolma in Langza — ₹1,200, dinner included, she'll WhatsApp your family every night.",
    },
    cta: "Start as Priya",
    href: "/onboarding?path=indian",
  },
  {
    tag: "Path 02 · Foreign women",
    name: "Sara",
    who: "29 · Berlin · first time in India, three weeks, no plan",
    img: "/images/path-sara.jpg",
    headline: "You've read every blog. None of them were written by a woman.",
    bullets: [
      "What to actually wear in Varanasi vs. Goa vs. Delhi metro",
      "Female-run guesthouses with airport pickup (no negotiating at 2am)",
      "The 7 phrases in Hindi that make men back off, instantly",
      "Which trains foreigners can book, and the IRCTC workaround",
    ],
    sample: {
      q: "Landing in Delhi at 11pm alone. What do I do?",
      a: "Pre-paid taxi booth inside Terminal 3, never the kerb. Stay in Hauz Khas, not Paharganj. Text Anjali (host, +91 98...) — she leaves the gate unlocked till 1am.",
    },
    cta: "Start as Sara",
    href: "/onboarding?path=foreign",
  },
];

export const metadata = { title: "Wander Women — Trip Intel for Solo Women Travellers" };

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
      <div className="col-span-12 text-sm leading-relaxed text-ink sm:col-span-8">{value}</div>
    </div>
  );
}

export default function HomePage() {

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
        <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col justify-center px-6 py-20 md:px-10 md:py-32">
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
              className="block text-4xl animate-word md:text-7xl"
              style={{ animationDelay: "0.3s" }}
            >
              Stress free travel.
            </span>
            <span
              className="block text-4xl animate-word md:text-7xl"
              style={{ animationDelay: "0.45s" }}
            >
              The guidebook that was never written for you,
            </span>
            <em
              className="not-italic text-rust block text-4xl animate-word md:text-7xl"
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

      {/* ── What's inside · 01 — Intel field report ───────────────── */}
      <section id="features" className="relative w-full overflow-hidden bg-warm-white py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          {/* Section header */}
          <div className="mb-16 flex flex-col gap-6 md:mb-20 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <div className="mb-5 flex items-center gap-3">
                <span className="h-px w-10 bg-rust" />
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink/60">
                  What&apos;s inside · 01
                </span>
              </div>
              <h2 className="font-serif text-4xl leading-[0.95] text-ink text-balance md:text-6xl">
                Not a listicle.
                <br />
                <span className="italic text-rust">A field report.</span>
              </h2>
            </div>
            <p className="text-sm leading-relaxed text-ink/70 md:max-w-sm">
              Every destination is a living dossier — written, rated and updated
              by women who arrived last week, not last decade.
            </p>
          </div>

          {/* The card */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-10">
            {/* Left: image + meta */}
            <div className="relative lg:col-span-5">
              <div className="relative aspect-[4/5] overflow-hidden bg-ink/10">
                <Image
                  src="/images/intel-rishikesh.jpg"
                  alt="Open travel journal with map of Rishikesh"
                  fill
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-transparent" />

                {/* Floating safety score */}
                <div className="absolute left-5 top-5 border border-ink/5 bg-warm-white/95 px-4 py-3 backdrop-blur-sm">
                  <div className="mb-1 font-mono text-[10px] uppercase tracking-widest text-ink/55">
                    Safety · solo F
                  </div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="font-serif text-3xl leading-none text-ink">8.4</span>
                    <span className="font-mono text-[10px] uppercase tracking-widest text-ink/50">
                      /10
                    </span>
                  </div>
                  <div className="mt-1.5 flex gap-0.5">
                    {[1, 2, 3, 4].map((i) => (
                      <Star key={i} className="h-2.5 w-2.5 fill-rust text-rust" />
                    ))}
                    <Star className="h-2.5 w-2.5 fill-rust/30 text-rust/30" />
                  </div>
                </div>

                {/* Bottom location strip */}
                <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between text-warm-white">
                  <div>
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
            </div>

            {/* Right: intel content */}
            <div className="lg:col-span-7 lg:pl-4">
              {/* Tab pills */}
              <div className="mb-8 flex flex-wrap gap-2 font-mono text-[10px] uppercase tracking-widest">
                <span className="bg-ink px-3 py-1.5 text-warm-white">Safety</span>
                <span className="border border-ink/15 px-3 py-1.5 text-ink/60">Stay</span>
                <span className="border border-ink/15 px-3 py-1.5 text-ink/60">Eat</span>
                <span className="border border-ink/15 px-3 py-1.5 text-ink/60">Move</span>
                <span className="border border-ink/15 px-3 py-1.5 text-ink/60">Period kit</span>
              </div>

              {/* Warning callout */}
              <div className="mb-8 border-l-2 border-rust py-1 pl-5">
                <div className="mb-2 flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-rust">
                  <AlertTriangle className="h-3.5 w-3.5" />
                  Real warning · flagged by 12 women
                </div>
                <p className="font-serif text-2xl leading-snug text-ink text-balance md:text-3xl">
                  &ldquo;Avoid Lakshman Jhula bridge after 9pm.
                  Groups of men, no police, zero lighting.
                  Walk the Ram Jhula side instead.&rdquo;
                </p>
              </div>

              {/* Intel rows */}
              <div className="divide-y divide-ink/10 border-y border-ink/10">
                <IntelRow
                  icon={<Shield className="h-4 w-4" />}
                  label="Solo arrival"
                  value="Land before 4pm. Pre-book Ola from Dehradun airport — ₹1,800. Don&apos;t take touts."
                />
                <IntelRow
                  icon={<Heart className="h-4 w-4" />}
                  label="Period supplies"
                  value="Whisper / Stayfree at More Megastore (Tapovan). Cups: only Apollo Pharmacy, Haridwar Rd."
                />
                <IntelRow
                  icon={<MapPin className="h-4 w-4" />}
                  label="Female-run stay"
                  value="Zostel Plus (women dorm, ₹650) · Ganga Beach House (Anjali, host) ₹2,400"
                />
                <IntelRow
                  icon={<Moon className="h-4 w-4" />}
                  label="Night curfew"
                  value="Most ashrams lock 10pm. Cafes shut 9:30pm. Plan dinner accordingly."
                />
                <IntelRow
                  icon={<Bus className="h-4 w-4" />}
                  label="Overnight train"
                  value="Avoid sleeper. 3AC coach B2 berth 31-40 — closest to TTE, safest for solo F."
                />
              </div>

              {/* Footer CTA */}
              <div className="mt-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div className="font-mono text-[10px] uppercase tracking-widest text-ink/55">
                  + 47 more intel points in this dossier
                </div>
                <Link
                  href="/intel/rishikesh-india"
                  className="group inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-rust transition-colors hover:text-rust/80"
                >
                  Open full Rishikesh dossier
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── What's inside · 02 — Two paths ─────────────────────────── */}
      <section id="paths" className="relative w-full overflow-hidden bg-ink py-24 text-warm-white md:py-32">
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          {/* Header */}
          <div className="mb-16 flex flex-col gap-6 md:mb-20 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <div className="mb-5 flex items-center gap-3">
                <span className="h-px w-10 bg-rust" />
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-warm-white/55">
                  What&apos;s inside · 02
                </span>
              </div>
              <h2 className="font-serif text-4xl leading-[0.95] text-warm-white text-balance md:text-6xl">
                Two women.
                <br />
                <span className="italic text-rust">Two very different India&apos;s.</span>
              </h2>
            </div>
            <p className="text-sm leading-relaxed text-warm-white/65 md:max-w-sm">
              We don&apos;t pretend one guide fits everyone. Pick the path that
              sounds like your life — the intel reshapes around you.
            </p>
          </div>

          {/* Paths grid */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-10">
            {PATHS.map((p, i) => (
              <article
                key={p.name}
                className="group relative flex flex-col overflow-hidden border border-warm-white/10 bg-warm-white/[0.03] transition-colors hover:border-warm-white/25"
              >
                {/* Image */}
                <div className="relative aspect-[5/4] overflow-hidden">
                  <Image
                    src={p.img}
                    alt={`${p.name} — ${p.who}`}
                    fill
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-transparent" />

                  {/* Index */}
                  <div className="absolute right-5 top-5 font-mono text-[10px] uppercase tracking-widest text-warm-white/60">
                    0{i + 1} / 02
                  </div>

                  {/* Identity overlay */}
                  <div className="absolute bottom-5 left-5 right-5">
                    <div className="mb-2 font-mono text-[10px] uppercase tracking-widest text-rust">
                      {p.tag}
                    </div>
                    <div className="flex flex-wrap items-baseline gap-3">
                      <h3 className="font-serif text-5xl leading-none text-warm-white md:text-6xl">
                        {p.name}
                      </h3>
                      <span className="font-mono text-[10px] uppercase tracking-widest text-warm-white/60">
                        {p.who}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Body */}
                <div className="flex flex-1 flex-col p-7 md:p-9">
                  <p className="mb-7 font-serif text-2xl leading-snug text-warm-white text-balance md:text-3xl">
                    &ldquo;{p.headline}&rdquo;
                  </p>

                  <ul className="mb-8 space-y-3">
                    {p.bullets.map((b) => (
                      <li key={b} className="flex gap-3 text-sm leading-relaxed text-warm-white/80">
                        <Check className="mt-1 h-4 w-4 shrink-0 text-rust" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Sample Q&A */}
                  <div className="mb-8 border-t border-warm-white/10 pt-6">
                    <div className="mb-3 font-mono text-[10px] uppercase tracking-widest text-warm-white/50">
                      Real question · last week
                    </div>
                    <p className="mb-3 italic leading-relaxed text-warm-white/90">
                      &ldquo;{p.sample.q}&rdquo;
                    </p>
                    <div className="flex gap-3">
                      <span className="mt-1 shrink-0 font-mono text-[10px] uppercase tracking-widest text-rust">
                        A ·
                      </span>
                      <p className="text-sm leading-relaxed text-warm-white/70">{p.sample.a}</p>
                    </div>
                  </div>

                  {/* CTA */}
                  <div className="mt-auto">
                    <Link
                      href={p.href}
                      className="inline-flex items-center gap-3 bg-rust px-6 py-3.5 font-mono text-[10px] uppercase tracking-widest text-warm-white transition-opacity hover:opacity-90"
                    >
                      {p.cta}
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Foot note */}
          <p className="mt-12 text-center font-mono text-[10px] uppercase tracking-widest text-warm-white/45">
            Not sure which? Most women start with the path closest to home, then unlock the other.
          </p>
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
      <section id="membership" className="bg-warm-white px-6 py-20">
        <div className="mx-auto max-w-5xl">

          {/* shared header */}
          <div className="mb-10 text-center">
            <div className="mb-5 inline-flex items-center gap-2 border border-ink/10 px-4 py-2">
              <span className="h-2 w-2 animate-pulse rounded-full bg-rust" />
              <span className="font-mono text-xs text-ink/60">
                <strong className="text-ink">17 of 200</strong> founding spots remaining
              </span>
            </div>
            <h2 className="font-serif text-4xl leading-tight text-ink md:text-5xl">
              Be part of the founding community.
            </h2>
            <p className="mx-auto mt-4 max-w-xl font-mono text-sm leading-relaxed text-ink/55">
              Two ways in. One as a member who reads. One as a contributor who writes.
              Both get founding-tier access for life.
            </p>
          </div>

          {/* two-column cards */}
          <div className="grid gap-4 md:grid-cols-2">

            {/* ── Member card ── */}
            <div className="flex flex-col border border-ink/10 bg-ink/5 p-7">
              <p className="mb-1 font-mono text-[10px] uppercase tracking-[0.2em] text-rust">
                Join as a member
              </p>
              <p className="mb-2 font-serif text-2xl text-ink">
                ₹499 once.
              </p>
              <p className="mb-6 font-mono text-xs leading-relaxed text-ink/55">
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
                  <li key={item} className="flex items-start gap-2 font-mono text-xs text-ink/55">
                    <span className="mt-0.5 shrink-0 text-gold">✓</span>
                    {item}
                  </li>
                ))}
              </ul>

              <p className="mb-4 font-mono text-[10px] text-ink/45">
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
                  className="border border-ink/15 bg-ink/5 px-4 py-3 font-mono text-sm text-ink placeholder-ink/40 outline-none focus:border-rust"
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
            <div className="flex flex-col border border-ink/10 bg-ink/5 p-7">
              <p className="mb-1 font-mono text-[10px] uppercase tracking-[0.2em] text-rust">
                Join as a contributor
              </p>
              <p className="mb-2 font-serif text-2xl text-ink">
                Write what you know.
              </p>
              <p className="mb-8 font-mono text-xs leading-relaxed text-ink/55">
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
                      <p className="font-mono text-xs font-semibold text-ink">{title}</p>
                      <p className="mt-1 font-mono text-xs leading-relaxed text-ink/55">{body}</p>
                    </div>
                  </div>
                ))}
              </div>

              <p className="mb-5 font-mono text-[10px] leading-relaxed text-ink/45">
                We&apos;re not promising a number until we&apos;ve paid one out.
              </p>

              <Link
                href="/coming-soon"
                className="mt-auto inline-block border border-ink/15 px-7 py-3 text-center font-mono text-sm uppercase tracking-widest text-ink/70 transition-colors hover:border-warm-white/50 hover:text-ink"
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
