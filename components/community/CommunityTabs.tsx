"use client";

import { useState, useTransition, useCallback } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { createPost, togglePostHelpful, reportPost, toggleBewareHelpful, reportBeware } from "@/app/community/actions";
import { createClient } from "@/lib/supabase/client";
import { BEWARE_CITIES } from "@/lib/beware-cities";
import { INTERNATIONAL_COUNTRIES } from "@/lib/international-destinations";

type Post = {
  id: string;
  tab: string;
  title: string;
  author: string;
  authorAgeRange: string;
  homeCity: string;
  postedAt: string;
  content: string;
  replyCount: number;
  likeCount: number;
  destination?: string;
  isHelpfulByMe: boolean;
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
  isHelpfulByMe: boolean;
  hasScamMap?: boolean;
};

const INDIA_CITY_OPTIONS = Object.values(BEWARE_CITIES)
  .filter((e) => e.config.slug.endsWith("-india"))
  .map((e) => ({ slug: e.config.slug, name: e.config.name }))
  .sort((a, b) => a.name.localeCompare(b.name));

const TAB_META = {
  ask: {
    label: "Ask the community",
    short: "Ask",
    placeholder: "What do you want to know?",
    cta: "Ask a question",
    blurb:
      "Get advice from women who've traveled where you're headed — including locals who actually live there. No judgment, no mansplaining.",
  },
  experiences: {
    label: "Real experiences",
    short: "Stories",
    placeholder: "Tell it like it actually happened.",
    cta: "Share your experience",
    blurb:
      "Travel is hard. Solo female travel is harder. Share what really happened on your trip — without a single 'well, actually'.",
  },
  beware: {
    label: "Beware Board",
    short: "Beware",
    placeholder: "Report a scam or safety issue",
    cta: "Report a scam",
    blurb:
      "Verified scam reports from solo women. Reviewed before going live.",
  },
} as const;

type TabKey = keyof typeof TAB_META;

function isLocal(homeCity: string, destination: string | undefined): boolean {
  if (!destination || !homeCity) return false;
  const cityPart = destination.split("-")[0]?.toLowerCase();
  return cityPart === homeCity.trim().toLowerCase();
}

export function CommunityTabs({
  posts,
  bewares,
  userEmail,
  activeTab,
  sort,
  country,
  intlCountry,
  city,
  supportedBewareSlugs,
}: {
  posts: Post[];
  bewares: Beware[];
  userEmail: string | null;
  activeTab: string;
  sort: string;
  country: string;
  intlCountry: string;
  city: string;
  supportedBewareSlugs: string[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [visible, setVisible] = useState(10);

  const updateQuery = useCallback(
    (patch: Record<string, string | null>) => {
      const next = new URLSearchParams(params.toString());
      for (const [k, v] of Object.entries(patch)) {
        if (v === null || v === "") next.delete(k);
        else next.set(k, v);
      }
      setVisible(10);
      startTransition(() => {
        router.push(`${pathname}?${next.toString()}`);
      });
    },
    [params, pathname, router]
  );

  const active = (TAB_META as Record<string, unknown>)[activeTab] ? (activeTab as TabKey) : "ask";
  const tabPosts = posts.filter((p) => p.tab === active);
  const visiblePosts = tabPosts.slice(0, visible);
  const visibleBewares = bewares.slice(0, visible);
  const supportedSet = new Set(supportedBewareSlugs);
  const cityName =
    country === "india" && city !== "all" && BEWARE_CITIES[city]
      ? BEWARE_CITIES[city].config.name
      : "";

  const intlEntry = INTERNATIONAL_COUNTRIES.find((c) => c.slug === intlCountry);

  return (
    <Tabs value={active} onValueChange={(v) => updateQuery({ tab: v })}>
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

      <div className="mt-4 mb-2 grid grid-cols-2 gap-2 border-b border-ww-border pb-3 sm:flex sm:flex-wrap sm:items-center">
        <select
          value={sort}
          onChange={(e) => updateQuery({ sort: e.target.value })}
          disabled={isPending}
          className="h-9 border border-ww-border bg-sand px-3 font-mono text-[10px] uppercase tracking-widest text-ink hover:border-ink focus:border-ink focus:outline-none"
          aria-label="Sort"
        >
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
          <option value="popular">Most popular</option>
        </select>

        <select
          value={country}
          onChange={(e) => updateQuery({ country: e.target.value, city: null, intlCountry: null })}
          disabled={isPending}
          className="h-9 border border-ww-border bg-sand px-3 font-mono text-[10px] uppercase tracking-widest text-ink hover:border-ink focus:border-ink focus:outline-none"
          aria-label="Country"
        >
          <option value="india">India</option>
          <option value="international">International</option>
        </select>

        {country === "india" && (
          <select
            value={city}
            onChange={(e) => updateQuery({ city: e.target.value === "all" ? null : e.target.value })}
            disabled={isPending}
            className="h-9 border border-ww-border bg-sand px-3 font-mono text-[10px] uppercase tracking-widest text-ink hover:border-ink focus:border-ink focus:outline-none"
            aria-label="City"
          >
            <option value="all">All cities</option>
            {INDIA_CITY_OPTIONS.map(({ slug, name }) => (
              <option key={slug} value={slug}>
                {name}
              </option>
            ))}
          </select>
        )}

        {country === "international" && (
          <>
            <select
              value={intlCountry}
              onChange={(e) =>
                updateQuery({
                  intlCountry: e.target.value === "all" ? null : e.target.value,
                  city: null,
                })
              }
              disabled={isPending}
              className="h-9 border border-ww-border bg-sand px-3 font-mono text-[10px] uppercase tracking-widest text-ink hover:border-ink focus:border-ink focus:outline-none"
              aria-label="International country"
            >
              <option value="all">All countries</option>
              {INTERNATIONAL_COUNTRIES.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>

            {intlEntry && (
              <select
                value={city}
                onChange={(e) =>
                  updateQuery({ city: e.target.value === "all" ? null : e.target.value })
                }
                disabled={isPending}
                className="h-9 border border-ww-border bg-sand px-3 font-mono text-[10px] uppercase tracking-widest text-ink hover:border-ink focus:border-ink focus:outline-none"
                aria-label="City"
              >
                <option value="all">All cities</option>
                {intlEntry.cities.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.name}
                  </option>
                ))}
              </select>
            )}
          </>
        )}

        {country === "india" && city !== "all" && supportedSet.has(city) && (
          <Link
            href={`/community/beware/${city}`}
            className="col-span-2 h-9 flex items-center justify-center sm:col-auto sm:ml-auto border border-rust/40 bg-rust/5 px-3 font-mono text-[10px] uppercase tracking-widest text-rust hover:bg-rust/10 transition-colors"
          >
            📍 See {cityName} scam map →
          </Link>
        )}
      </div>

      {(Object.keys(TAB_META) as TabKey[]).map((key) => {
        const meta = TAB_META[key];
        return (
          <TabsContent key={key} value={key} className="mt-6">
            <p className="mb-6 max-w-2xl font-mono text-xs leading-relaxed text-ww-muted">
              {meta.blurb}
            </p>

            {key === "beware" ? (
              <Link
                href={userEmail ? "/contribute/report" : "/account/login?next=/contribute/report"}
                className="mb-6 flex items-center justify-between border border-dashed border-rust/40 bg-rust/5 px-4 py-3 hover:border-rust transition-colors"
              >
                <span className="font-mono text-xs text-ww-muted">{meta.placeholder}</span>
                <span className="font-mono text-[10px] uppercase tracking-widest text-rust">
                  {meta.cta} →
                </span>
              </Link>
            ) : userEmail ? (
              <ComposeForm tab={key} placeholder={meta.placeholder} cta={meta.cta} />
            ) : (
              <Link
                href="/account/login?next=/community"
                className="mb-6 flex items-center justify-between border border-dashed border-ww-border bg-sand px-4 py-3 hover:border-ink transition-colors"
              >
                <span className="font-mono text-xs text-ww-muted">{meta.placeholder}</span>
                <span className="font-mono text-[10px] uppercase tracking-widest text-rust">
                  Sign in to post →
                </span>
              </Link>
            )}

            {key === "beware" ? (
              <>
                <BewareList bewares={visibleBewares} userEmail={userEmail} />
                {visibleBewares.length === 0 && (
                  <p className="py-12 text-center font-mono text-xs text-ww-muted">
                    No reports match these filters.
                  </p>
                )}
              </>
            ) : (
              <div className="space-y-3">
                {visiblePosts.map((post) => (
                  <PostCard key={post.id} post={post} userEmail={userEmail} />
                ))}
                {visiblePosts.length === 0 && (
                  <p className="py-12 text-center font-mono text-xs text-ww-muted">
                    No posts match these filters.
                  </p>
                )}
              </div>
            )}

            {((key === "beware" && bewares.length > visible) ||
              (key !== "beware" && tabPosts.length > visible)) && (
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
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

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

  async function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []).slice(0, 5);
    if (files.length === 0) return;
    setUploading(true);
    setError("");
    const supabase = createClient();
    const urls: string[] = [];
    for (const file of files) {
      const ext = file.name.split(".").pop();
      const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error: upErr } = await supabase.storage
        .from("community-images")
        .upload(path, file, { upsert: false });
      if (upErr) {
        setError(`Upload failed: ${upErr.message}`);
        continue;
      }
      const { data } = supabase.storage.from("community-images").getPublicUrl(path);
      urls.push(data.publicUrl);
    }
    setUploadedUrls((prev) => [...prev, ...urls]);
    setUploading(false);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const fd = new FormData(e.currentTarget);
    fd.set("image_urls", JSON.stringify(uploadedUrls));
    const result = await createPost(fd);
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
      <input
        type="text"
        name="title"
        required
        minLength={5}
        maxLength={120}
        placeholder="Title (e.g. North or South Goa for first solo trip?)"
        className="w-full border border-ww-border bg-warm-white px-3 py-2 font-mono text-sm font-semibold text-ink placeholder:font-normal placeholder:text-ww-muted focus:outline-none focus:border-ink"
      />
      <textarea
        name="content"
        required
        minLength={10}
        rows={4}
        placeholder={placeholder}
        className="w-full resize-none border border-ww-border bg-warm-white px-3 py-2 font-mono text-sm text-ink placeholder:text-ww-muted focus:outline-none focus:border-ink"
      />

      <div>
        <label className="block font-mono text-[10px] uppercase tracking-widest text-ww-muted mb-1">
          Add photos (max 5)
        </label>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageChange}
          disabled={uploading}
          className="block w-full font-mono text-xs text-ww-muted file:mr-3 file:border file:border-ww-border file:bg-sand file:px-3 file:py-1 file:font-mono file:text-[10px] file:uppercase file:tracking-widest file:text-ink hover:file:border-ink"
        />
        {uploading && <p className="mt-1 font-mono text-[10px] text-ww-muted">Uploading…</p>}
        {uploadedUrls.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {uploadedUrls.map((url) => (
              <Image key={url} src={url} alt="" width={64} height={64} className="h-16 w-16 object-cover border border-ww-border" />
            ))}
          </div>
        )}
      </div>

      {error && <p className="font-mono text-xs text-rust">{error}</p>}
      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => {
            setOpen(false);
            setUploadedUrls([]);
          }}
          className="font-mono text-[10px] uppercase tracking-widest text-ww-muted hover:text-ink"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading || uploading}
          className="border border-rust bg-rust px-4 py-2 font-mono text-[10px] uppercase tracking-widest text-warm-white hover:bg-rust/90 transition-colors disabled:opacity-50"
        >
          {loading ? "Submitting…" : `${cta} →`}
        </button>
      </div>
    </form>
  );
}

function PostCard({ post, userEmail }: { post: Post; userEmail: string | null }) {
  const [liked, setLiked] = useState(post.isHelpfulByMe);
  const [count, setCount] = useState(post.likeCount);
  const [busy, setBusy] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [reported, setReported] = useState(false);

  async function onHelpful() {
    if (!userEmail) {
      window.location.href = "/account/login?next=/community";
      return;
    }
    if (busy) return;
    setBusy(true);
    const prevLiked = liked;
    const prevCount = count;
    setLiked(!prevLiked);
    setCount(prevLiked ? Math.max(0, prevCount - 1) : prevCount + 1);
    const res = await togglePostHelpful(post.id);
    setBusy(false);
    if ("error" in res) {
      setLiked(prevLiked);
      setCount(prevCount);
    } else if (typeof res.count === "number") {
      setCount(res.count);
      setLiked(!!res.liked);
    }
  }

  const local = isLocal(post.homeCity, post.destination);

  return (
    <article className="border border-ww-border bg-sand p-4">
      <div className="mb-2 flex flex-wrap items-center gap-2 font-mono text-[10px] text-ww-muted">
        <span className="font-semibold text-ink">{post.author}</span>
        <span>·</span>
        <span>{post.authorAgeRange}</span>
        <span>·</span>
        <span>{post.homeCity}</span>
        {local && (
          <span className="rounded bg-sage-light/60 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-widest text-sage">
            Local
          </span>
        )}
        <span className="ml-auto">{post.postedAt}</span>
      </div>

      {post.title && (
        <h3 className="mb-2 font-serif text-lg leading-snug text-ink">{post.title}</h3>
      )}

      <p className="mb-3 text-sm leading-relaxed text-ink">{post.content}</p>

      <div className="flex flex-wrap items-center gap-3 border-t border-ww-border pt-3">
        {post.destination && (
          <Link
            href={`/intel/${post.destination}`}
            className="font-mono text-[10px] uppercase tracking-widest text-rust hover:underline"
          >
            #{post.destination.replace(/-(india|japan|thailand|vietnam|uae|south-korea|france)$/, "")}
          </Link>
        )}
        <span className="font-mono text-[10px] text-ww-muted">{post.replyCount} replies</span>
        <button
          onClick={onHelpful}
          disabled={busy}
          className={`font-mono text-[10px] uppercase tracking-widest transition-colors ${
            liked ? "text-rust" : "text-ww-muted hover:text-rust"
          }`}
          aria-label={liked ? "Remove helpful" : "Mark helpful"}
        >
          {liked ? "♥" : "♡"} {count}
        </button>
        <button
          onClick={() => setReportOpen((o) => !o)}
          disabled={reported}
          className="font-mono text-[10px] uppercase tracking-widest text-ww-muted hover:text-rust transition-colors disabled:opacity-50"
        >
          {reported ? "Reported ✓" : "Report"}
        </button>
        <Link
          href="/coming-soon"
          className="ml-auto font-mono text-[10px] uppercase tracking-widest text-blue hover:underline"
        >
          Reply →
        </Link>
      </div>

      {reportOpen && !reported && (
        <ReportInline
          onCancel={() => setReportOpen(false)}
          onSubmit={async (reason) => {
            if (!userEmail) {
              window.location.href = "/account/login?next=/community";
              return;
            }
            const res = await reportPost(post.id, reason);
            if (!("error" in res)) {
              setReported(true);
              setReportOpen(false);
            }
          }}
        />
      )}
    </article>
  );
}

function ReportInline({
  onCancel,
  onSubmit,
}: {
  onCancel: () => void;
  onSubmit: (reason: string) => Promise<void>;
}) {
  const [reason, setReason] = useState("Spam");
  const [busy, setBusy] = useState(false);
  return (
    <div className="mt-3 border border-ww-border bg-warm-white p-3 space-y-2">
      <p className="font-mono text-[10px] uppercase tracking-widest text-ww-muted">Why are you reporting?</p>
      <div className="flex flex-wrap gap-2">
        {["Spam", "Inappropriate", "Wrong info", "Other"].map((r) => (
          <button
            key={r}
            type="button"
            onClick={() => setReason(r)}
            className={`border px-2 py-1 font-mono text-[10px] uppercase tracking-widest transition-colors ${
              reason === r
                ? "border-ink bg-ink text-warm-white"
                : "border-ww-border bg-sand text-ww-muted hover:border-ink"
            }`}
          >
            {r}
          </button>
        ))}
      </div>
      <div className="flex justify-end gap-2 pt-1">
        <button
          type="button"
          onClick={onCancel}
          className="font-mono text-[10px] uppercase tracking-widest text-ww-muted hover:text-ink"
        >
          Cancel
        </button>
        <button
          type="button"
          disabled={busy}
          onClick={async () => {
            setBusy(true);
            await onSubmit(reason);
            setBusy(false);
          }}
          className="border border-rust bg-rust px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-warm-white hover:bg-rust/90 disabled:opacity-50"
        >
          {busy ? "Submitting…" : "Submit report"}
        </button>
      </div>
    </div>
  );
}

function BewareList({ bewares, userEmail }: { bewares: Beware[]; userEmail: string | null }) {
  return (
    <div className="space-y-3">
      {bewares.map((b) => (
        <BewareCard key={b.id} b={b} userEmail={userEmail} />
      ))}
    </div>
  );
}

function BewareCard({ b, userEmail }: { b: Beware; userEmail: string | null }) {
  const [liked, setLiked] = useState(b.isHelpfulByMe);
  const [count, setCount] = useState(b.helpfulCount);
  const [busy, setBusy] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [reported, setReported] = useState(false);

  const sev = b.severity as "critical" | "high" | "medium";
  const border =
    sev === "critical" ? "border-l-rust" : sev === "high" ? "border-l-gold" : "border-l-sage";
  const badge =
    sev === "critical" ? "bg-rust/10 text-rust" : sev === "high" ? "bg-gold/10 text-gold" : "bg-sage/10 text-sage";

  async function onHelpful() {
    if (!userEmail) {
      window.location.href = "/account/login?next=/community";
      return;
    }
    if (busy) return;
    setBusy(true);
    const prevLiked = liked;
    const prevCount = count;
    setLiked(!prevLiked);
    setCount(prevLiked ? Math.max(0, prevCount - 1) : prevCount + 1);
    const res = await toggleBewareHelpful(b.id);
    setBusy(false);
    if ("error" in res) {
      setLiked(prevLiked);
      setCount(prevCount);
    } else if (typeof res.count === "number") {
      setCount(res.count);
      setLiked(!!res.liked);
    }
  }

  return (
    <article className={`border border-ww-border border-l-4 bg-sand p-4 ${border}`}>
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <span className={`rounded-full px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest ${badge}`}>
          {sev}
        </span>
        <span className="font-mono text-[10px] text-ww-muted">{b.category}</span>
        <span className="ml-auto font-mono text-[10px] text-ww-muted">{b.reportedDate}</span>
      </div>

      <h3 className="mb-2 font-mono text-sm font-semibold text-ink">{b.title}</h3>

      <p className="mb-3 text-xs leading-relaxed text-ww-muted">{b.description}</p>

      <div className="mb-3 flex flex-wrap gap-3 font-mono text-[10px] text-ww-muted">
        <span>📍 {b.location}</span>
        <Link href={`/intel/${b.destinationSlug}`} className="text-rust hover:underline">
          #{b.city}
        </Link>
        {b.hasScamMap && (
          <Link href={`/community/beware/${b.destinationSlug}`} className="text-rust hover:underline">
            📍 See scam map →
          </Link>
        )}
        <span>Reported by {b.reportedBy}</span>
      </div>

      <div className="flex flex-wrap gap-2 border-t border-ww-border pt-3">
        <button
          onClick={onHelpful}
          disabled={busy}
          className={`border px-3 py-1 font-mono text-[10px] uppercase tracking-widest transition-colors ${
            liked ? "border-sage bg-sage text-warm-white" : "border-sage/30 bg-sage-light/50 text-sage hover:bg-sage-light"
          }`}
        >
          Helpful ({count})
        </button>
        <button
          onClick={() => setReportOpen((o) => !o)}
          disabled={reported}
          className="ml-auto border border-ww-border bg-sand px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-ww-muted hover:border-rust hover:text-rust transition-colors disabled:opacity-50"
        >
          {reported ? "Reported ✓" : "Report"}
        </button>
      </div>

      {reportOpen && !reported && (
        <ReportInline
          onCancel={() => setReportOpen(false)}
          onSubmit={async (reason) => {
            if (!userEmail) {
              window.location.href = "/account/login?next=/community";
              return;
            }
            const res = await reportBeware(b.id, reason);
            if (!("error" in res)) {
              setReported(true);
              setReportOpen(false);
            }
          }}
        />
      )}
    </article>
  );
}
