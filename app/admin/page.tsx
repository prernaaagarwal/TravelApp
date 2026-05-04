import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { ModerationQueue } from "@/components/admin/ModerationQueue";

export const metadata = {
  title: "Moderation Queue — Wander Women Admin",
};

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const supabase = await createClient();

  const [{ data: pendingPosts }, { data: pendingBewares }, { data: pendingTrips }] =
    await Promise.all([
      supabase
        .from("community_posts")
        .select("id,tab,title,author_name,content,destination,created_at")
        .eq("status", "pending")
        .order("created_at", { ascending: true }),
      supabase
        .from("beware_reports")
        .select("id,title,description,category,severity,city,reported_by_name,created_at")
        .eq("status", "pending")
        .order("created_at", { ascending: true }),
      supabase
        .from("trip_submissions")
        .select("id,destination,destination_slug,trip_start,trip_end,day_count,total_cost_inr,highlight,created_at")
        .eq("status", "pending")
        .order("created_at", { ascending: true }),
    ]);

  const posts   = pendingPosts   ?? [];
  const bewares = pendingBewares ?? [];
  const trips   = pendingTrips   ?? [];
  const total   = posts.length + bewares.length + trips.length;

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">

      {/* CMS shortcuts */}
      <div className="mb-10 grid grid-cols-2 gap-3">
        <Link
          href="/admin/intel"
          className="border border-ww-border bg-warm-white p-4 transition-colors hover:border-ink"
        >
          <p className="font-mono text-[10px] uppercase tracking-widest text-ww-muted">Manage</p>
          <p className="mt-1 font-serif text-lg text-ink">Intel cards</p>
          <p className="mt-1 font-mono text-[10px] text-ww-muted">Create, edit, delete city guides →</p>
        </Link>
        <Link
          href="/admin/contributors"
          className="border border-ww-border bg-warm-white p-4 transition-colors hover:border-ink"
        >
          <p className="font-mono text-[10px] uppercase tracking-widest text-ww-muted">Manage</p>
          <p className="mt-1 font-serif text-lg text-ink">Contributors</p>
          <p className="mt-1 font-mono text-[10px] text-ww-muted">Add, edit contributor profiles →</p>
        </Link>
      </div>

      {/* Moderation queue */}
      <div className="mb-8">
        <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-ww-muted">
          Moderation
        </p>
        <h1 className="mb-1 font-serif text-3xl text-ink">Queue</h1>
        <p className="font-mono text-xs text-ww-muted">
          {total === 0
            ? "Nothing pending."
            : `${total} item${total === 1 ? "" : "s"} waiting — ${posts.length} post${posts.length === 1 ? "" : "s"}, ${bewares.length} beware report${bewares.length === 1 ? "" : "s"}, ${trips.length} trip receipt${trips.length === 1 ? "" : "s"}.`}
        </p>
      </div>

      <ModerationQueue posts={posts} bewares={bewares} trips={trips} />
    </div>
  );
}
