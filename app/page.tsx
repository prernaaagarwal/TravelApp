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
      <section id="hero" className="bg-warm-white px-6 py-20 md:py-28">
        <p>Hero — Step 2</p>
      </section>

      {/* ── Trust bar ────────────────────────────────────────────────── */}
      <section id="trust" className="border-y border-ww-border bg-sand px-6 py-8">
        <p>Trust bar — Step 3 — {featuredContributors.length} contributors loaded</p>
      </section>

      {/* ── Intel Card preview strip ──────────────────────────────────── */}
      <section id="intel-preview" className="bg-warm-white px-6 py-16">
        <p>Intel preview — Step 4 — {previewCards.length} cards loaded</p>
      </section>

      {/* ── Persona split (Priya / Sara) ──────────────────────────────── */}
      <section id="personas" className="bg-sand px-6 py-16">
        <p>Persona split — Step 5</p>
      </section>

      {/* ── Beware Board scam ticker ──────────────────────────────────── */}
      <section id="ticker" className="border-y border-ww-border bg-ink px-6 py-10">
        <p className="text-warm-white">Scam ticker — Step 6 — {tickerEntries.length} entries loaded</p>
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
