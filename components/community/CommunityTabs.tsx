"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { createPost } from "@/app/community/actions";

type Post = {
  id: string;
  tab: string;
  author: string;
  authorAgeRange: string;
  homeCity: string;
  postedAt: string;
  content: string;
  replyCount: number;
  likeCount: number;
  destination?: string;
};

type Beware = {
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

const TAB_META = {
  ask: {
    label: "Ask the community",
    short: "Ask",
    placeholder: "What do you want to know?",
    cta: "Ask a question",
    blurb:
      "Get advice from women who've traveled where you're headed. No judgment, no mansplaining.",
  },
  sister: {
    label: "Ask a local sister",
    short: "Local Sister",
    placeholder: "Ask a local woman about her city",
    cta: "Ask a local",
    blurb:
      "Local women answer questions about their cities — from safe neighborhoods to the bus that actually runs on time.",
  },
  rant: {
    label: "Rant space",
    short: "Rant",
    placeholder: "Vent freely. We get it.",
    cta: "Start a rant",
    blurb:
      "Travel is hard. Solo female travel is harder. This is where you vent without a single 'well, actually'.",
  },
  beware: {
    label: "Beware Board",
    short: "Beware",
    placeholder: "Report a scam",
    cta: "Report a scam",
    blurb:
      "Verified scam reports from solo women. All entries are illustrative; demo data only.",
  },
} as const;

type TabKey = keyof typeof TAB_META;

export function CommunityTabs({
  posts,
  bewares,
  userEmail,
}: {
  posts: Post[];
  bewares: Beware[];
  userEmail: string | null;
}) {
  const [active, setActive] = useState<TabKey>("ask");
  const [visible, setVisible] = useState(10);

  const filteredPosts = posts.filter((p) => p.tab === active).slice(0, visible);

  return (
    <Tabs
      value={active}
      onValueChange={(v) => {
        setActive(v as TabKey);
        setVisible(10);
      }}
    >
      {/* tab buttons — horizontally scrollable on mobile */}
      <TabsList className="mb-2 w-full justify-start gap-1 overflow-x-auto bg-transparent p-0">
        {(Object.keys(TAB_META) as TabKey[]).map((key) => (
          <TabsTrigger
            key={key}
            value={key}
            className="border border-ww-border bg-sand px-4 py-2 font-mono text-xs uppercase tracking-widest text-ww-muted data-[state=active]:border-ink data-[state=active]:bg-ink data-[state=active]:text-warm-white data-[state=active]:shadow-none"
          >
            <span className="hidden sm:inline">{TAB_META[key].label}</span>
            <span className="sm:hidden">{TAB_META[key].short}</span>
          </TabsTrigger>
        ))}
      </TabsList>

      {/* tab content */}
      {(Object.keys(TAB_META) as TabKey[]).map((key) => {
        const meta = TAB_META[key];
        return (
          <TabsContent key={key} value={key} className="mt-6">
            <p className="mb-6 max-w-2xl font-mono text-xs leading-relaxed text-ww-muted">
              {meta.blurb}
            </p>

            {/* compose */}
            {userEmail ? (
              <ComposeForm tab={key} placeholder={meta.placeholder} cta={meta.cta} />
            ) : (
              <Link
                href={`/account/login?next=/community`}
                className="mb-6 flex items-center justify-between border border-dashed border-ww-border bg-sand px-4 py-3 hover:border-ink transition-colors"
              >
                <span className="font-mono text-xs text-ww-muted">
                  {meta.placeholder}
                </span>
                <span className="font-mono text-[10px] uppercase tracking-widest text-rust">
                  Sign in to post →
                </span>
              </Link>
            )}

            {/* posts list */}
            {key === "beware" ? (
              <BewareList bewares={bewares.slice(0, visible)} />
            ) : (
              <div className="space-y-3">
                {filteredPosts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
                {filteredPosts.length === 0 && (
                  <p className="py-12 text-center font-mono text-xs text-ww-muted">
                    No posts in this tab yet.
                  </p>
                )}
              </div>
            )}

            {/* load more */}
            {((key === "beware" && bewares.length > visible) ||
              (key !== "beware" &&
                posts.filter((p) => p.tab === key).length > visible)) && (
              <button
                onClick={() => setVisible((v) => v + 10)}
                className="mt-6 w-full border border-ww-border bg-sand py-3 font-mono text-xs uppercase tracking-widest text-ww-muted hover:border-ink hover:text-ink transition-colors"
              >
                Load more posts
              </button>
            )}
          </TabsContent>
        );
      })}
    </Tabs>
  );
}

function ComposeForm({ tab, placeholder, cta }: { tab: string; placeholder: string; cta: string }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  if (sent) {
    return (
      <div className="mb-6 border border-sage/30 bg-sage-light/30 px-4 py-3 font-mono text-xs text-sage">
        ✓ Post submitted for review — usually approved within 24 hours.
      </div>
    );
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="mb-6 flex w-full items-center justify-between border border-dashed border-ww-border bg-sand px-4 py-3 hover:border-ink transition-colors"
      >
        <span className="font-mono text-xs text-ww-muted">{placeholder}</span>
        <span className="font-mono text-[10px] uppercase tracking-widest text-rust">{cta} →</span>
      </button>
    );
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const result = await createPost(new FormData(e.currentTarget));
    setLoading(false);
    if (result?.error) {
      setError(result.error);
    } else {
      setSent(true);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mb-6 border border-ww-border bg-sand p-4 space-y-3">
      <input type="hidden" name="tab" value={tab} />
      <textarea
        name="content"
        required
        minLength={10}
        rows={4}
        placeholder={placeholder}
        className="w-full resize-none border border-ww-border bg-warm-white px-3 py-2 font-mono text-sm text-ink placeholder:text-ww-muted focus:outline-none focus:border-ink"
      />
      {error && <p className="font-mono text-xs text-rust">{error}</p>}
      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="font-mono text-[10px] uppercase tracking-widest text-ww-muted hover:text-ink"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="border border-rust bg-rust px-4 py-2 font-mono text-[10px] uppercase tracking-widest text-warm-white hover:bg-rust/90 transition-colors disabled:opacity-50"
        >
          {loading ? "Submitting…" : `${cta} →`}
        </button>
      </div>
    </form>
  );
}

function PostCard({ post }: { post: Post }) {
  return (
    <article className="border border-ww-border bg-sand p-4">
      <div className="mb-3 flex flex-wrap items-center gap-2 font-mono text-[10px] text-ww-muted">
        <span className="font-semibold text-ink">{post.author}</span>
        <span>·</span>
        <span>{post.authorAgeRange}</span>
        <span>·</span>
        <span>{post.homeCity}</span>
        <span className="ml-auto">{post.postedAt}</span>
      </div>

      <p className="mb-3 text-sm leading-relaxed text-ink">{post.content}</p>

      <div className="flex flex-wrap items-center gap-4 border-t border-ww-border pt-3">
        {post.destination && (
          <Link
            href={`/intel/${post.destination}`}
            className="font-mono text-[10px] uppercase tracking-widest text-rust hover:underline"
          >
            #{post.destination.replace("-india", "")}
          </Link>
        )}
        <span className="font-mono text-[10px] text-ww-muted">
          {post.replyCount} replies
        </span>
        <span className="font-mono text-[10px] text-ww-muted">
          {post.likeCount} ♡
        </span>
        <Link
          href="/coming-soon"
          className="ml-auto font-mono text-[10px] uppercase tracking-widest text-blue hover:underline"
        >
          Reply →
        </Link>
      </div>
    </article>
  );
}

function BewareList({ bewares }: { bewares: Beware[] }) {
  return (
    <div className="space-y-3">
      {bewares.map((b) => {
        const sev = b.severity as "critical" | "high" | "medium";
        const border =
          sev === "critical"
            ? "border-l-rust"
            : sev === "high"
            ? "border-l-gold"
            : "border-l-sage";
        const badge =
          sev === "critical"
            ? "bg-rust/10 text-rust"
            : sev === "high"
            ? "bg-gold/10 text-gold"
            : "bg-sage/10 text-sage";

        return (
          <article
            key={b.id}
            className={`border border-ww-border border-l-4 bg-sand p-4 ${border}`}
          >
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <span
                className={`rounded-full px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest ${badge}`}
              >
                {sev}
              </span>
              <span className="font-mono text-[10px] text-ww-muted">
                {b.category}
              </span>
              <span className="ml-auto font-mono text-[10px] text-ww-muted">
                {b.reportedDate}
              </span>
            </div>

            <h3 className="mb-2 font-mono text-sm font-semibold text-ink">
              {b.title}
            </h3>

            <p className="mb-3 text-xs leading-relaxed text-ww-muted">
              {b.description}
            </p>

            <div className="mb-3 flex flex-wrap gap-3 font-mono text-[10px] text-ww-muted">
              <span>📍 {b.location}</span>
              <Link
                href={`/intel/${b.destinationSlug}`}
                className="text-rust hover:underline"
              >
                #{b.city}
              </Link>
              <span>Reported by {b.reportedBy}</span>
            </div>

            <div className="flex flex-wrap gap-2 border-t border-ww-border pt-3">
              <button className="border border-sage/30 bg-sage-light/50 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-sage hover:bg-sage-light transition-colors">
                Helpful ({b.helpfulCount})
              </button>
              <button className="border border-blue/30 bg-blue-light/50 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-blue hover:bg-blue-light transition-colors">
                Forward
              </button>
              <button className="ml-auto border border-ww-border bg-sand px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-ww-muted hover:border-rust hover:text-rust transition-colors">
                Report
              </button>
            </div>
          </article>
        );
      })}
    </div>
  );
}
