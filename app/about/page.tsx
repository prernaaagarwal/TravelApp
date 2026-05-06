import Link from "next/link";
import Image from "next/image";

export const metadata = {
  title: "About — Wander Women",
  description:
    "How and why Wander Women started. A women-only solo travel intelligence platform written by the women who actually live these routes.",
};

export default function AboutPage() {
  return (
    <main>
      {/* ── 1. Founder — portrait + bio + pull quote + CTA ────────────────── */}
      <section className="px-6 py-24 md:px-10 md:py-32">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 items-start gap-12 md:grid-cols-2 md:gap-20">
            {/* Portrait + EST stamp */}
            <div className="relative">
              <div className="aspect-[3/4] overflow-hidden border border-ww-border bg-sand">
                <Image
                  src="/images/hero-traveler.jpg"
                  alt="The founder — silhouette at dawn, somewhere in India"
                  width={900}
                  height={1200}
                  className="h-full w-full object-cover grayscale"
                  style={{ filter: "grayscale(0.6) sepia(0.2)" }}
                />
              </div>
              {/* circular stamp */}
              <div className="absolute -bottom-6 -right-6 flex h-32 w-32 rotate-12 items-center justify-center rounded-full border-2 border-rust/40 bg-warm-white/95 backdrop-blur-sm">
                <p className="text-center font-mono text-[10px] font-bold uppercase leading-tight tracking-wider text-rust">
                  Est.<br />
                  2026<br />
                  ———<br />
                  Founder
                </p>
              </div>
            </div>

            {/* Intro text — sits next to the portrait */}
            <div>
              <span className="mb-5 inline-block font-mono text-[10px] uppercase tracking-[0.2em] text-ww-muted">
                The Founder
              </span>
              <h1 className="mb-8 font-serif text-4xl leading-[0.95] text-ink md:text-6xl">
                A guidebook
                <br />
                <span className="italic text-rust">for the rest of us.</span>
              </h1>
              <div className="space-y-6 text-base leading-relaxed text-ww-muted">
                {/* ── 1. The bus to Rishikesh ─────────────────────── */}
                <p>In 2017, I did something that felt a little unhinged.</p>
                <p>
                  I had moved from Kolkata to Delhi with a plan. For six months I
                  tried to find someone to travel with. Friends were busy.
                  Schedules never aligned. So one evening, tired of waiting, I
                  walked to the bus stop and bought a ticket to Rishikesh. Alone.
                  With no plan. I had never done anything like that in my life.
                </p>
                <p>
                  I grew up shy, introverted, quietly terrified of doing most
                  things by myself. That first trip cracked something open. So I
                  kept going — 20 countries, most of India, alone every time. The
                  one that changed everything was a 30-day DIY backpacking trip
                  across Europe on a shoestring.
                </p>
                <p>
                  I stepped off the plane in Paris genuinely nervous. On the last
                  day, I sat in Rome and cried — not because I was scared or
                  lonely, but because I was so full. Because I had done something
                  I once thought was only for other kinds of women.
                </p>
              </div>
            </div>
          </div>

          {/* Continuation — full-width below both columns. From "Here's what
              I noticed" onward, the story drops out of the 2-col grid into a
              single centered reading column so it doesn't stay pinned in the
              narrow right-hand strip after the image ends. */}
          <div className="mx-auto mt-14 max-w-3xl md:mt-20">
            <div className="space-y-6 text-base leading-relaxed text-ww-muted">
              <hr className="mx-auto my-10 h-px w-12 border-0 bg-rust/40" aria-hidden />

              {/* ── 2. What I noticed ────────────────────────────── */}
              <p>
                Here&apos;s what I noticed travelling through all those
                countries: women elsewhere move through the world differently.
                Not because it&apos;s safer — but because they were taught the
                world was theirs.
              </p>
              <p>Indian women were not taught that.</p>
              <p>
                And yet, whenever I came home, younger women would hear my
                stories and lean forward. &ldquo;How did you manage alone?&rdquo;
                &ldquo;What did your parents say?&rdquo; &ldquo;Can I actually
                do that?&rdquo; The answer was always yes. But I also knew the
                real landscape — which streets of Paris you leave before a
                certain hour, the taxi traps at Goa&apos;s airport, the hostel
                with the broken lock in Kasol. Seven years of hard-won
                knowledge, living only in my head or in DMs passed hand to
                hand.
              </p>
              <p>That knowledge was going nowhere useful.</p>

              <hr className="mx-auto my-10 h-px w-12 border-0 bg-rust/40" aria-hidden />

              {/* ── 3. What it became ────────────────────────────── */}
              <p>
                Solo travel by women has grown 153% in recent years. The woman
                who wants to go is already here. She just doesn&apos;t have
                what she needs to go — or to go without spending the first
                three days in low-level survival mode.
              </p>
              <p>
                Wander Women is the trip intelligence layer solo women have
                always deserved. Real intel from real women who were just
                there. A Beware Board. Honest spend breakdowns. A community
                built for her specific situation — not the Western backpacker,
                not the package tourist. Her.
              </p>
              <p>
                I built this because I was once the girl who waited six months
                for someone to go with her — and then went anyway and never
                looked back.
              </p>
              <p className="font-serif text-xl italic text-ink md:text-2xl">
                I know how many women are still waiting.
              </p>
            </div>

            {/* ── Signature ───────────────────────────────────────── */}
            <div className="mt-10 border-t border-ww-border/60 pt-6">
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink">
                Prerna Agarwal — Founder, Wander Women
              </p>
              <p className="mt-1 font-mono text-xs italic text-ww-muted">
                Solo traveller. 20 countries. 9 years. Still going.
              </p>
              <a
                href="https://www.instagram.com/prernaatravels/"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-block font-mono text-xs text-rust underline-offset-2 hover:underline"
              >
                @prernaatravels →
              </a>
            </div>

            <p className="mt-10 border-l-2 border-rust py-2 pl-6 font-serif text-2xl italic leading-snug text-ink md:text-3xl">
              &ldquo;The internet was built for the average traveller.
              We&apos;re building for the rest of us.&rdquo;
            </p>

            <div className="mt-10">
              <Link
                href="/account/membership"
                className="inline-flex items-center gap-3 bg-rust px-7 py-3.5 font-mono text-xs uppercase tracking-widest text-warm-white transition-opacity hover:opacity-90"
              >
                Join the Founding 200
                <span aria-hidden>→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. Hero — editorial intro ─────────────────────────────────────── */}
      <section className="relative overflow-hidden border-t border-ww-border px-6 py-20 md:px-10 md:py-32">
        {/* coordinate decoration top-right (Varanasi coords) */}
        <span className="pointer-events-none absolute right-6 top-12 hidden font-mono text-[10px] uppercase tracking-widest text-ww-muted/40 [writing-mode:vertical-rl] md:block">
          25.3176° N · 82.9739° E
        </span>
        {/* ref decoration bottom-left */}
        <span className="pointer-events-none absolute bottom-10 left-6 hidden font-mono text-[10px] uppercase tracking-widest text-ww-muted/40 md:block">
          Ref: WW-Field-2026
        </span>

        <div className="relative mx-auto grid max-w-6xl grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-20">
          {/* Left — text block */}
          <div className="flex flex-col justify-center lg:col-span-5">
            <span className="mb-6 inline-flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.2em] text-rust">
              <span className="h-px w-10 bg-rust" />
              About — Editorial Journal
            </span>
            <h2 className="relative mb-8 font-serif text-5xl leading-[0.95] tracking-tight text-ink md:text-6xl lg:text-7xl">
              Trip intel
              <br />
              <span className="italic text-rust">as it actually is.</span>
              <span className="absolute -bottom-5 left-0 h-px w-16 bg-rust/40" />
            </h2>
            <p className="max-w-md text-base leading-relaxed text-ww-muted md:text-lg">
              Wander Women is a women-only solo travel intelligence platform.
              We don&apos;t write listicles. We don&apos;t take press trips.
              The intel here comes from women who actually live these routes —
              the auto-rickshaw scams, the women-run guesthouses, the lanes
              you walk after dark and the lanes you don&apos;t.
            </p>
          </div>

          {/* Right — overlapping image composition */}
          <div className="relative min-h-[420px] lg:col-span-7 lg:min-h-[520px]">
            {/* Larger photo (back) */}
            <div className="absolute right-0 top-0 z-10 w-3/4 rotate-2 border border-ink/10 bg-warm-white p-2 shadow-sm">
              <div className="relative aspect-[4/3] overflow-hidden bg-sand">
                <Image
                  src="/images/hero-traveler.jpg"
                  alt="A woman watching dawn over the Ganges in Rishikesh"
                  fill
                  sizes="(max-width: 1024px) 90vw, 56vw"
                  className="object-cover"
                />
              </div>
            </div>
            {/* Smaller tactile photo (front) */}
            <div className="absolute bottom-0 left-4 z-20 w-2/3 -rotate-3 border border-ink/10 bg-warm-white p-2 shadow-md">
              <div className="relative aspect-[4/5] overflow-hidden bg-sand">
                <Image
                  src="/images/intel-rishikesh-journal.jpg"
                  alt="A field journal and map of Rishikesh on a wooden table"
                  fill
                  sizes="(max-width: 1024px) 70vw, 36vw"
                  className="object-cover"
                />
                <div className="absolute bottom-2 right-2 bg-ink px-2 py-1 font-mono text-[10px] uppercase tracking-widest text-warm-white">
                  Fig. 01
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. Origin + 3 values ──────────────────────────────────────────── */}
      <section className="border-t border-ww-border bg-sand px-6 py-24 md:px-10 md:py-32">
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 flex flex-col gap-6 md:mb-20 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <div className="mb-5 flex items-center gap-3">
                <span className="h-px w-10 bg-rust" />
                <span className="font-mono text-xs uppercase tracking-[0.18em] text-ww-muted">
                  Origin
                </span>
              </div>
              <h2 className="font-serif text-4xl leading-[0.95] text-ink md:text-6xl">
                Built from a notebook,
                <br />
                <span className="italic text-rust">not a press kit.</span>
              </h2>
            </div>
            <p className="leading-relaxed text-ww-muted md:max-w-sm">
              The intel that kept me safe — the auto-driver patterns, the
              women-only PG networks, the late-night reroutes — was buried in
              old TripAdvisor threads and women-only Facebook groups. That is
              not a system. So we built one.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-10">
            {[
              {
                num: "01",
                title: "Real intel.",
                body: "If we haven't been there, we don't write it. If a contributor hasn't lived a route, she doesn't claim it. Every card is verified by women who travelled it solo.",
              },
              {
                num: "02",
                title: "Women only.",
                body: "From the contributor pool to buddy matching to community threads — every voice you read here is a woman's. No filler, no press trips, no men's takes on women's safety.",
              },
              {
                num: "03",
                title: "No sponsorships.",
                body: "We've never accepted a sponsored stay or a paid restaurant placement. Our intel doesn't have a brand to keep happy — only the women using it.",
              },
            ].map((v) => (
              <div key={v.num} className="border border-ww-border bg-warm-white p-7 md:p-9">
                <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.2em] text-rust">
                  {v.num}
                </p>
                <h3 className="mb-3 font-serif text-2xl leading-tight text-ink md:text-3xl">
                  {v.title}
                </h3>
                <p className="text-sm leading-relaxed text-ww-muted">{v.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
