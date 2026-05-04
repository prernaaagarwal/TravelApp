import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ModerationQueue } from "@/components/admin/ModerationQueue";

export const metadata = {
  title: "Moderation Queue — Wander Women Admin",
};

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const adminEmail = process.env.ADMIN_EMAIL;
  if (!user || !adminEmail || user.email !== adminEmail) {
    redirect("/account/login?next=/admin");
  }

  const [{ data: pendingPosts }, { data: pendingBewares }] = await Promise.all([
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
  ]);

  const posts = pendingPosts ?? [];
  const bewares = pendingBewares ?? [];
  const total = posts.length + bewares.length;

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <div className="mb-8">
        <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-ww-muted">
          Admin
        </p>
        <h1 className="mb-1 font-serif text-3xl text-ink">Moderation queue</h1>
        <p className="font-mono text-xs text-ww-muted">
          {total === 0
            ? "Nothing pending."
            : `${total} item${total === 1 ? "" : "s"} waiting for review — ${posts.length} post${posts.length === 1 ? "" : "s"}, ${bewares.length} beware report${bewares.length === 1 ? "" : "s"}.`}
        </p>
      </div>

      <ModerationQueue posts={posts} bewares={bewares} />
    </div>
  );
}
