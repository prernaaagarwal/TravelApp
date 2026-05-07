import { CommunityTabs } from "@/components/community/CommunityTabs";
import { SUPPORTED_BEWARE_CITIES } from "@/lib/beware-cities";
import { INTERNATIONAL_CITY_SLUGS } from "@/lib/international-destinations";
import { createClient } from "@/lib/supabase/server";
import { safeQuery } from "@/lib/safe-query";
import rawPosts from "@/lib/mock-data/community-posts.json";
import { JsonLd } from "@/components/shared/JsonLd";
import { faqPageLd } from "@/lib/jsonld";

export const metadata = {
  title: "Solo Female Travel Community — Q&A, Scam Reports, Local Tips",
  description:
    "Ask solo female travel questions. Get answers from women who've been there. Verified scam reports, local sister advice, real experiences — no judgment.",
};

type SearchParams = Promise<{
  tab?: string;
  sort?: string;
  country?: string;
  intlCountry?: string;
  city?: string;
  submitted?: string;
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

  // Pre-fetch the viewer's "helpful" marks so the heart toggle survives a
  // refresh. Without this, isHelpfulByMe is always false and a logged-in user
  // sees their like reset to "not liked" every time the page reloads.
  let helpfulPostIds = new Set<string>();
  let helpfulBewareIds = new Set<string>();
  if (user) {
    const [hp, hb] = await Promise.all([
      safeQuery<{ post_id: string }[]>(
        supabase.from("community_post_helpful").select("post_id").eq("user_id", user.id),
        [],
        1500,
        "community.helpful_posts",
      ),
      safeQuery<{ report_id: string }[]>(
        supabase.from("beware_helpful").select("report_id").eq("user_id", user.id),
        [],
        1500,
        "community.helpful_bewares",
      ),
    ]);
    helpfulPostIds   = new Set(hp.map((r) => String(r.post_id)));
    helpfulBewareIds = new Set(hb.map((r) => String(r.report_id)));
  }

  const tab = VALID_TABS.has(sp.tab ?? "") ? (sp.tab as string) : "ask";
  const sort = VALID_SORTS.has(sp.sort ?? "") ? (sp.sort as string) : "newest";
  const country = sp.country === "international" ? "international" : "india";
  const intlCountry = sp.intlCountry ?? "all";
  const city = sp.city ?? "all";
  const submitted = sp.submitted === "beware" ? "beware" : undefined;

  type DbPost = {
    id: string;
    tab: string;
    title: string | null;
    content: string;
    author_name: string | null;
    author_age_range: string | null;
    home_city: string | null;
    destination: string | null;
    image_urls: unknown;
    created_at: string;
    like_count: number | null;
    reply_count: number | null;
  };

  // Fetch approved user-submitted posts from Supabase and merge with mock data.
  // RLS policy "Anyone reads approved posts" lets unauthenticated reads work.
  const dbPosts = await safeQuery<DbPost[]>(
    supabase
      .from("community_posts")
      .select(
        "id, tab, title, content, author_name, author_age_range, home_city, destination, image_urls, created_at, like_count, reply_count",
      )
      .eq("status", "approved"),
    [],
    1500,
    "community.posts",
  );

  const dbNormalized: RawPost[] = dbPosts.map((p) => ({
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

  type DbBewareRow = {
    id: string;
    destination_slug: string | null;
    city: string | null;
    category: string | null;
    title: string;
    severity: string | null;
    description: string;
    reported_by_name: string | null;
    created_at: string;
    location: string | null;
    helpful_count: number | null;
  };

  // Same pattern for beware reports: mock + approved DB rows.
  const dbBewares = await safeQuery<DbBewareRow[]>(
    supabase
      .from("beware_reports")
      .select(
        "id, destination_slug, city, category, title, severity, description, reported_by_name, created_at, location, helpful_count",
      )
      .eq("status", "approved"),
    [],
    1500,
    "community.beware_reports",
  );

  type NormalizedBeware = {
    id: string;
    destinationSlug: string;
    city: string;
    category: string;
    title: string;
    severity: string;
    description: string;
    reportedBy: string;
    reportedDate: string;
    location: string;
    helpfulCount: number;
  };

  // V1: Beware Board feed is DB-only. The previous mock JSON merge has been
  // removed — every entry is now a real, moderated submission. Sparse
  // categories show their empty state honestly until more reports arrive.
  const allBewares: NormalizedBeware[] = dbBewares.map((b) => ({
    id:              b.id,
    destinationSlug: b.destination_slug ?? "",
    city:            b.city ?? "",
    category:        b.category ?? "",
    title:           b.title,
    severity:        b.severity ?? "medium",
    description:     b.description,
    reportedBy:      b.reported_by_name ?? "Anonymous",
    reportedDate:    b.created_at,
    location:        b.location ?? "",
    helpfulCount:    b.helpful_count ?? 0,
  }));

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

  let filteredBewares = allBewares.filter((b) => {
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
    destination: p.destination || undefined,
    isHelpfulByMe: helpfulPostIds.has(p.id),
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
    isHelpfulByMe: helpfulBewareIds.has(b.id),
    hasScamMap: SUPPORTED_BEWARE_CITIES.has(b.destinationSlug),
  }));

  const supportedBewareSlugs = Array.from(SUPPORTED_BEWARE_CITIES);
  const justSubmitted = sp.submitted === "beware";

  // FAQPage rich snippets — Google surfaces these on solo-female-travel
  // searches. Build the entries from the top Ask-tab posts that have a
  // title (the title IS the question) plus content (the answer body).
  // Cap at 12 entries; longer schemas get diminishing returns from Google.
  const faqEntries = filteredPosts
    .filter((p) => p.tab === "ask" && (p.title ?? "").trim().length >= 10)
    .sort((a, b) => b.likeCount - a.likeCount)
    .slice(0, 12)
    .map((p) => ({
      question: (p.title ?? "").trim(),
      answer:   p.content.replace(/\s+/g, " ").trim().slice(0, 800),
    }))
    .filter((e) => e.answer.length >= 20);

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      {faqEntries.length > 0 && <JsonLd data={faqPageLd(faqEntries)} />}
      {justSubmitted && (
        <div className="mb-6 flex items-start gap-3 rounded-lg border border-sage/30 bg-sage-light px-4 py-3">
          <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-sage text-warm-white text-xs font-bold">✓</span>
          <div className="flex-1">
            <p className="font-mono text-sm font-medium text-ink">
              Your Beware report has been submitted for review
            </p>
            <p className="mt-1 font-mono text-xs leading-relaxed text-ww-muted">
              Thanks for helping keep solo travellers safe. A human moderator
              will review it within <strong>24 hours</strong> against our{" "}
              <a href="/code-of-conduct" className="underline hover:text-ink">
                Code of Conduct
              </a>
              . You&apos;ll get an email with the outcome — approved (with or
              without edits), or rejected with a written reason. Nothing is
              published before review.
            </p>
          </div>
        </div>
      )}
      <div className="mb-10">
        <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-ww-muted">
          Solo female travel community
        </p>
        <h1 className="mb-3 font-serif text-3xl text-ink sm:text-4xl md:text-5xl">
          The group chat,
          <br />
          but actually useful.
        </h1>
        <p className="font-mono text-sm leading-relaxed text-ww-muted">
          Ask anything. Share what happened. Flag what others need to know.
          A women-only space where real travellers answer real questions — fast,
          honest, no filters.
        </p>
      </div>

      {submitted === "beware" && (
        <div className="mb-4 rounded border border-sage/40 bg-sage-light px-4 py-3 font-mono text-sm text-sage">
          ✓ Your report has been submitted for review. It will appear on the Beware Board once approved.
        </div>
      )}

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
