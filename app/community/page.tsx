import { CommunityTabs } from "@/components/community/CommunityTabs";
import { createClient } from "@/lib/supabase/server";
import { SUPPORTED_BEWARE_CITIES } from "@/lib/beware-cities";
import { INTERNATIONAL_CITY_SLUGS } from "@/lib/international-destinations";

export const metadata = {
  title: "Community — Wander Women",
  description:
    "Ask questions, get answers from women who've been there. Verified scam reports, local sister advice, and a rant space — no judgment.",
};

type SearchParams = Promise<{
  tab?: string;
  sort?: string;
  country?: string;
  intlCountry?: string;
  city?: string;
}>;

const VALID_TABS = new Set(["ask", "rant", "beware"]);
const VALID_SORTS = new Set(["newest", "oldest", "popular"]);

export default async function CommunityPage({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams;
  const tab = VALID_TABS.has(sp.tab ?? "") ? (sp.tab as string) : "ask";
  const sort = VALID_SORTS.has(sp.sort ?? "") ? (sp.sort as string) : "newest";
  const country = sp.country === "international" ? "international" : "india";
  const intlCountry = sp.intlCountry ?? "all";
  const city = sp.city ?? "all";

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let postsQuery = supabase
    .from("community_posts")
    .select("id,tab,title,author_name,author_age_range,home_city,created_at,content,reply_count,like_count,destination")
    .eq("status", "approved");

  let bewareQuery = supabase
    .from("beware_reports")
    .select("id,destination_slug,city,category,title,severity,description,reported_by_name,created_at,location,helpful_count")
    .eq("status", "approved");

  // Location filter
  if (country === "india") {
    if (city !== "all") {
      postsQuery = postsQuery.eq("destination", city);
      bewareQuery = bewareQuery.eq("destination_slug", city);
    } else {
      postsQuery = postsQuery.or("destination.is.null,destination.like.%-india");
      bewareQuery = bewareQuery.like("destination_slug", "%-india");
    }
  } else {
    if (city !== "all" && INTERNATIONAL_CITY_SLUGS.has(city)) {
      postsQuery = postsQuery.eq("destination", city);
      bewareQuery = bewareQuery.eq("destination_slug", city);
    } else {
      const intlList = Array.from(INTERNATIONAL_CITY_SLUGS);
      postsQuery = postsQuery.in("destination", intlList);
      bewareQuery = bewareQuery.in("destination_slug", intlList);
    }
  }

  // Sort
  if (sort === "oldest") {
    postsQuery = postsQuery.order("created_at", { ascending: true });
    bewareQuery = bewareQuery.order("created_at", { ascending: true });
  } else if (sort === "popular") {
    postsQuery = postsQuery.order("like_count", { ascending: false });
    bewareQuery = bewareQuery.order("helpful_count", { ascending: false });
  } else {
    postsQuery = postsQuery.order("created_at", { ascending: false });
    bewareQuery = bewareQuery.order("created_at", { ascending: false });
  }

  postsQuery = postsQuery.limit(100);
  bewareQuery = bewareQuery.limit(50);

  const [{ data: rawPosts }, { data: rawBeware }] = await Promise.all([postsQuery, bewareQuery]);

  // Helpful state for current user
  let helpfulPostIds = new Set<string>();
  let helpfulBewareIds = new Set<string>();
  if (user) {
    const [{ data: hp }, { data: hb }] = await Promise.all([
      supabase.from("community_post_helpful").select("post_id").eq("user_id", user.id),
      supabase.from("beware_helpful").select("report_id").eq("user_id", user.id),
    ]);
    helpfulPostIds = new Set((hp ?? []).map((r) => r.post_id as string));
    helpfulBewareIds = new Set((hb ?? []).map((r) => r.report_id as string));
  }

  const posts = (rawPosts ?? []).map((p) => ({
    id: p.id,
    tab: p.tab,
    title: p.title ?? "",
    author: p.author_name ?? "Anonymous",
    authorAgeRange: p.author_age_range ?? "",
    homeCity: p.home_city ?? "",
    postedAt: new Date(p.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short" }),
    content: p.content,
    replyCount: p.reply_count,
    likeCount: p.like_count,
    destination: p.destination ?? undefined,
    isHelpfulByMe: helpfulPostIds.has(p.id),
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
    isHelpfulByMe: helpfulBewareIds.has(b.id),
  }));

  const supportedBewareSlugs = Array.from(SUPPORTED_BEWARE_CITIES);

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

      <CommunityTabs
        posts={posts}
        bewares={bewares}
        userEmail={user?.email ?? null}
        activeTab={tab}
        sort={sort}
        country={country}
        intlCountry={intlCountry}
        city={city}
        supportedBewareSlugs={supportedBewareSlugs}
      />
    </div>
  );
}
