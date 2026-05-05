import Link from "next/link";
import { notFound } from "next/navigation";
import { BadgeCheck, ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import rawPosts from "@/lib/mock-data/community-posts.json";
import { ReplyForm } from "@/components/community/ReplyForm";
import { VerifyReplyButton } from "@/components/community/VerifyReplyButton";

type RawPost = {
  id: string;
  tab: string;
  title?: string;
  author: string;
  authorAgeRange?: string;
  homeCity?: string;
  postedAt: string;
  content: string;
  destination?: string | null;
  imageUrls?: string[];
};

type Reply = {
  id: string;
  authorName: string | null;
  content: string;
  createdAt: string;
  isVerified: boolean;
  verifiedByName: string | null;
};

export default async function CommunityPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Resolve post: try DB first, fall back to mock seed posts.
  let post: RawPost | null = null;
  const { data: dbPost } = await supabase
    .from("community_posts")
    .select(
      "id, tab, title, content, author_name, author_age_range, home_city, destination, image_urls, created_at",
    )
    .eq("id", id)
    .eq("status", "approved")
    .maybeSingle();

  if (dbPost) {
    post = {
      id:            dbPost.id,
      tab:           dbPost.tab,
      title:         dbPost.title ?? "",
      author:        dbPost.author_name ?? "Community member",
      authorAgeRange: dbPost.author_age_range ?? "",
      homeCity:      dbPost.home_city ?? "",
      postedAt:      dbPost.created_at,
      content:       dbPost.content,
      destination:   dbPost.destination ?? null,
      imageUrls:     Array.isArray(dbPost.image_urls) ? (dbPost.image_urls as string[]) : [],
    };
  } else {
    const fromMock = (rawPosts as unknown as RawPost[]).find((p) => p.id === id);
    if (fromMock) post = fromMock;
  }

  if (!post) notFound();

  // Replies: verified first (newest verified at top), then unverified by oldest.
  // Oldest-first for unverified gives the OP a sensible reading order.
  const { data: dbReplies } = await supabase
    .from("community_replies")
    .select("id, author_name, content, created_at, is_verified, verified_by_name")
    .eq("post_id", post.id)
    .eq("status", "approved")
    .order("is_verified", { ascending: false })
    .order("verified_at", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: true });

  const replies: Reply[] = (dbReplies ?? []).map((r) => ({
    id:             r.id,
    authorName:     r.author_name ?? null,
    content:        r.content,
    createdAt:      r.created_at,
    isVerified:     !!r.is_verified,
    verifiedByName: r.verified_by_name ?? null,
  }));

  // Determine if the current viewer is a contributor — used to show the
  // Verify button on each reply. Same check as the server action uses.
  let isContributor = false;
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("username")
      .eq("id", user.id)
      .single();
    if (profile?.username) {
      const { data: contributor } = await supabase
        .from("contributors")
        .select("slug")
        .eq("slug", profile.username)
        .maybeSingle();
      isContributor = !!contributor;
    }
  }

  const verifiedCount = replies.filter((r) => r.isVerified).length;

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <Link
        href="/community"
        className="mb-6 inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-ww-muted hover:text-ink"
      >
        <ArrowLeft className="h-3 w-3" />
        Back to community
      </Link>

      {/* Original post */}
      <article className="mb-10 border border-ww-border bg-warm-white p-6">
        {post.title && (
          <h1 className="mb-3 font-serif text-2xl leading-snug text-ink md:text-3xl">
            {post.title}
          </h1>
        )}
        <p className="mb-4 whitespace-pre-line font-mono text-sm leading-relaxed text-ink">
          {post.content}
        </p>
        <div className="flex flex-wrap items-center gap-3 border-t border-ww-border pt-3 font-mono text-[10px] uppercase tracking-widest text-ww-muted">
          <span>{post.author}</span>
          {post.homeCity && <span>· {post.homeCity}</span>}
          {post.destination && (
            <Link
              href={`/intel/${post.destination}`}
              className="text-rust hover:underline"
            >
              #{post.destination.replace(/-(india|japan|thailand|vietnam|uae|south-korea|france)$/, "")}
            </Link>
          )}
        </div>
      </article>

      {/* Replies */}
      <section>
        <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="font-serif text-xl text-ink">
            {replies.length} {replies.length === 1 ? "reply" : "replies"}
          </h2>
          {verifiedCount > 0 && (
            <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-sage">
              <BadgeCheck className="h-3.5 w-3.5" />
              {verifiedCount} verified by contributors
            </span>
          )}
        </div>

        {replies.length === 0 ? (
          <p className="mb-8 border border-dashed border-ww-border bg-warm-white px-4 py-6 text-center font-mono text-xs text-ww-muted">
            No replies yet. Be the first.
          </p>
        ) : (
          <ul className="mb-8 space-y-3">
            {replies.map((r) => (
              <li
                key={r.id}
                className={`border p-4 ${
                  r.isVerified
                    ? "border-sage/40 bg-sage-light/30"
                    : "border-ww-border bg-warm-white"
                }`}
              >
                {r.isVerified && (
                  <div className="mb-2 inline-flex items-center gap-1.5 border border-sage/50 bg-sage/10 px-2 py-0.5 font-mono text-[9px] uppercase tracking-widest text-sage">
                    <BadgeCheck className="h-3 w-3" />
                    Verified answer
                    {r.verifiedByName ? ` · by ${r.verifiedByName}` : ""}
                  </div>
                )}
                <p className="mb-3 whitespace-pre-line font-mono text-sm leading-relaxed text-ink">
                  {r.content}
                </p>
                <div className="flex items-center justify-between gap-3 border-t border-ww-border/60 pt-2 font-mono text-[10px] uppercase tracking-widest text-ww-muted">
                  <span>{r.authorName ?? "Community member"}</span>
                  {isContributor && (
                    <VerifyReplyButton
                      replyId={r.id}
                      postId={post.id}
                      verified={r.isVerified}
                    />
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}

        {/* Reply form / sign-in nudge */}
        {user ? (
          <ReplyForm postId={post.id} />
        ) : (
          <div className="border border-ww-border bg-warm-white px-5 py-6 text-center">
            <p className="mb-3 font-mono text-sm text-ink">
              Sign in to reply to this thread.
            </p>
            <Link
              href={`/account/login?next=/community/post/${post.id}`}
              className="inline-flex items-center gap-2 bg-rust px-4 py-2 font-mono text-[11px] uppercase tracking-widest text-warm-white transition-opacity hover:opacity-90"
            >
              Sign in to reply →
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
