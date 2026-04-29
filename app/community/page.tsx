import { CommunityTabs } from "@/components/community/CommunityTabs";
import { SUPPORTED_BEWARE_CITIES } from "@/lib/beware-cities";
import { INTERNATIONAL_CITY_SLUGS } from "@/lib/international-destinations";
import rawPosts from "@/lib/mock-data/community-posts.json";
import rawBeware from "@/lib/mock-data/beware-entries.json";

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

  // Filter posts by location
  let filteredPosts = rawPosts.filter((p) => {
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
    title: "",
    author: p.author,
    authorAgeRange: p.authorAgeRange,
    homeCity: p.homeCity,
    postedAt: new Date(p.postedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" }),
    content: p.content,
    replyCount: p.replyCount,
    likeCount: p.likeCount,
    destination: p.destination ?? undefined,
    isHelpfulByMe: false,
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
          1,200 solo women travelers. Real questions, real answers, zero
          mansplaining.
        </p>
      </div>

      <CommunityTabs
        posts={posts}
        bewares={bewares}
        userEmail={null}
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
