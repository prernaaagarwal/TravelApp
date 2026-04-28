import { CommunityTabs } from "@/components/community/CommunityTabs";
import communityPosts from "@/lib/mock-data/community-posts.json";
import bewareEntries from "@/lib/mock-data/beware-entries.json";

export const metadata = {
  title: "Community — Wander Women",
  description:
    "Ask questions, get answers from women who've been there. Verified scam reports, local sister advice, and a rant space — no judgment.",
};

export default function CommunityPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      {/* header */}
      <div className="mb-10">
        <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-ww-muted">
          Community hub
        </p>
        <h1 className="mb-3 font-serif text-4xl text-ink md:text-5xl">
          The group chat,
          <br />
          but actually useful.
        </h1>
        <p className="font-mono text-sm leading-relaxed text-ww-muted">
          1,200 solo women travelers. Real questions, real answers, zero
          mansplaining.
        </p>
      </div>

      <CommunityTabs posts={communityPosts} bewares={bewareEntries} />
    </div>
  );
}
