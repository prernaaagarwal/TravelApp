import { CommunityTabs } from "@/components/community/CommunityTabs";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Community — Wander Women",
  description:
    "Ask questions, get answers from women who've been there. Verified scam reports, local sister advice, and a rant space — no judgment.",
};

export default async function CommunityPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const [{ data: rawPosts }, { data: rawBeware }] = await Promise.all([
    supabase.from("community_posts").select("id,tab,author_name,author_age_range,home_city,created_at,content,reply_count,like_count,destination").eq("status", "approved").order("created_at", { ascending: false }).limit(100),
    supabase.from("beware_reports").select("id,destination_slug,city,category,title,severity,description,reported_by_name,created_at,location,helpful_count").eq("status", "approved").order("created_at", { ascending: false }).limit(50),
  ]);

  const posts = (rawPosts ?? []).map((p) => ({
    id: p.id,
    tab: p.tab,
    author: p.author_name ?? "Anonymous",
    authorAgeRange: p.author_age_range ?? "",
    homeCity: p.home_city ?? "",
    postedAt: new Date(p.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short" }),
    content: p.content,
    replyCount: p.reply_count,
    likeCount: p.like_count,
    destination: p.destination ?? undefined,
  }));

  const bewares = (rawBeware ?? []).map((b) => ({
    id: b.id,
    destinationSlug: b.destination_slug ?? "",
    city: b.city ?? "",
    category: b.category ?? "",
    title: b.title,
    severity: b.severity ?? "medium",
    description: b.description,
    reportedBy: b.reported_by_name ?? "Anonymous",
    reportedDate: new Date(b.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short" }),
    location: b.location ?? "",
    helpfulCount: b.helpful_count,
  }));

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
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

      <CommunityTabs posts={posts} bewares={bewares} userEmail={user?.email ?? null} />
    </div>
  );
}
