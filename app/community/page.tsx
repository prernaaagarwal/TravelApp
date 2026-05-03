import { CommunityTabs } from "@/components/community/CommunityTabs";
import { SUPPORTED_BEWARE_CITIES } from "@/lib/beware-cities";
import { INTERNATIONAL_CITY_SLUGS } from "@/lib/international-destinations";
import { createClient } from "@/lib/supabase/server";
import rawPosts from "@/lib/mock-data/community-posts.json";
import rawBeware from "@/lib/mock-data/beware-entries.json";

export const metadata = {
  title: "Community — Wander Women",
  description:
    "Ask questions, get answers from women who've been there. Verified scam reports, local sister advice, and real travel experiences — no judgment.",
};

type SearchParams = Promise<{
  tab?: string;
  sort?: string;
  country?: string;
  intlCountry?: string;
  city?: string;
}>;

const VALID_TABS = new Set(["ask", "experiences", "beware"]);
const VALID_SORTS = new Set(["newest", "oldest", "popular"]);

type RawPost = {
  id: string;
  tab: string;
  title?: string;
  author: string;
  authorAgeRange?: string;
  homeCity?: string;
  postedAt: string;
  content: string;
  replyCount: number;
  likeCount: number;
  destination?: string | null;
  imageUrls?: string[];
};

export default async function CommunityPage({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const userEmail = user?.email ?? null;
  const tab = VALID_TABS.has(sp.tab ?? "") ? (sp.tab as string) : "ask";
  const sort = VALID_SORTS.has(sp.sort ?? "") ? (sp.sort as string) : "newest";
  const country = sp.country === "international" ? "international" : "india";
  const intlCountry = sp.intlCountry ?? "all";
  const city = sp.city ?? "all";

  // Fetch approved user-submitted posts from Supabase and merge with mock data.
  // RLS policy "Anyone reads approved posts" lets unauthenticated reads work.
  const { data: dbPosts } = await supabase
    .from("community_posts")
    .select(
      "id, tab, title, content, author_name, author_age_range, home_city, destination, image_urls, created_at, like_count, reply_count",
    )
    .eq("status", "approved");

  const dbNormalized: RawPost[] = (dbPosts ?? []).map((p) => ({
    id: p.id,
    tab: p.tab,
    title: p.title ?? "",
    author: p.author_name ?? "Community member",
    authorAgeRange: p.author_age_range ?? "",
    homeCity: p.home_city ?? "",
    postedAt: p.created_at,
    content: p.content,
    replyCount: p.reply_count ?? 0,
    likeCount: p.like_count ?? 0,
    destination: p.destination ?? undefined,
    imageUrls: Array.isArray(p.image_urls) ? (p.image_urls as string[]) : [],
  }));

  const allPosts: RawPost[] = [...(rawPosts as unknown as RawPost[]), ...dbNormalized];

  // Filter posts by location
  let filteredPosts = allPosts.filter((p) => {
    const dest = p.destination ?? "";
    if (country === "india") {
      return city !== "all" ? dest === city : (!dest || dest.endsWith("-india"));
    } else {
      return city !== "all" && INTERNATIONAL_CITY_SLUGS.has(city)
        ? dest === city
        : INTERNATIONAL_CITY_SLUGS.has(dest);
    }
  });

  // Filter bewares by location
  let filteredBewares = rawBeware.filter((b) => {
    const dest = b.destinationSlug ?? "";
    if (country === "india") {
      return city !== "all" ? dest === city : dest.endsWith("-india");
    } else {
      return city !== "all" && INTERNATIONAL_CITY_SLUGS.has(city)
        ? dest === city
        : INTERNATIONAL_CITY_SLUGS.has(dest);
    }
  });

  // Sort
  if (sort === "oldest") {
    filteredPosts = [...filteredPosts].sort((a, b) => a.postedAt.localeCompare(b.postedAt));
    filteredBewares = [...filteredBewares].sort((a, b) => a.reportedDate.localeCompare(b.reportedDate));
  } else if (sort === "popular") {
    filteredPosts = [...filteredPosts].sort((a, b) => b.likeCount - a.likeCount);
    filteredBewares = [...filteredBewares].sort((a, b) => b.helpfulCount - a.helpfulCount);
  } else {
    filteredPosts = [...filteredPosts].sort((a, b) => b.postedAt.localeCompare(a.postedAt));
    filteredBewares = [...filteredBewares].sort((a, b) => b.reportedDate.localeCompare(a.reportedDate));
  }

  const posts = filteredPosts.map((p) => ({
    id: p.id,
    tab: p.tab,
    title: p.title ?? "",
    author: p.author,
    authorAgeRange: p.authorAgeRange ?? "",
    homeCity: p.homeCity ?? "",
    postedAt: new Date(p.postedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" }),
    content: p.content,
    replyCount: p.replyCount,
    likeCount: p.likeCount,
    destination: p.destination ?? undefined,
    isHelpfulByMe: false,
    imageUrls: p.imageUrls,
  }));

  const bewares = filteredBewares.map((b) => ({
    id: b.id,
    destinationSlug: b.destinationSlug,
    city: b.city,
    category: b.category,
    title: b.title,
    severity: b.severity,
    description: b.description,
    reportedBy: b.reportedBy,
    reportedDate: new Date(b.reportedDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" }),
    location: b.location,
    helpfulCount: b.helpfulCount,
    isHelpfulByMe: false,
    hasScamMap: SUPPORTED_BEWARE_CITIES.has(b.destinationSlug),
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
          Ask anything. Share what happened. Flag what others need to know.
          A women-only space where real travelers answer real questions — fast,
          honest, no filters.
        </p>
      </div>

      <CommunityTabs
        posts={posts}
        bewares={bewares}
        userEmail={userEmail}
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
