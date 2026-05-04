import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { deleteContributor } from "./actions";

export const dynamic = "force-dynamic";

export default async function AdminContributorsPage() {
  const supabase = await createClient();
  const { data: contributors } = await supabase
    .from("contributors")
    .select("slug,name,full_name,home_city,photo_url,trip_count,total_contributions,joined_date")
    .order("full_name");

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <p className="mb-1 font-mono text-[10px] uppercase tracking-[0.2em] text-ww-muted">Content</p>
          <h1 className="font-serif text-3xl text-ink">Contributors</h1>
          <p className="mt-1 font-mono text-xs text-ww-muted">{contributors?.length ?? 0} contributors</p>
        </div>
        <Link
          href="/admin/contributors/new"
          className="border border-ink bg-ink px-5 py-2.5 font-mono text-[10px] uppercase tracking-widest text-warm-white transition-colors hover:bg-ink/80"
        >
          + New contributor
        </Link>
      </div>

      <div className="space-y-2">
        {(contributors ?? []).map((c) => (
          <div key={c.slug} className="flex items-center gap-4 border border-ww-border bg-warm-white px-4 py-3">
            {c.photo_url ? (
              <Image
                src={c.photo_url}
                alt={c.name ?? ""}
                width={40}
                height={40}
                className="h-10 w-10 shrink-0 rounded-full object-cover"
              />
            ) : (
              <div className="h-10 w-10 shrink-0 rounded-full bg-sand border border-ww-border flex items-center justify-center font-mono text-sm text-ww-muted">
                {(c.name ?? "?")[0]}
              </div>
            )}

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-serif text-base text-ink">{c.full_name ?? c.name}</span>
                {c.home_city && (
                  <span className="font-mono text-[10px] text-ww-muted">{c.home_city}</span>
                )}
              </div>
              <p className="mt-0.5 font-mono text-[10px] text-ww-muted">
                /{c.slug}
                {` · ${c.trip_count ?? 0} trips · ${c.total_contributions ?? 0} contributions`}
                {c.joined_date && ` · joined ${c.joined_date}`}
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-3">
              <Link
                href={`/contributor/${c.slug}`}
                target="_blank"
                className="font-mono text-[10px] text-ww-muted hover:text-ink"
              >
                View ↗
              </Link>
              <Link
                href={`/admin/contributors/${c.slug}/edit`}
                className="font-mono text-[10px] text-ink hover:underline"
              >
                Edit
              </Link>
              <form action={async () => { "use server"; await deleteContributor(c.slug); }}>
                <button
                  type="submit"
                  className="font-mono text-[10px] text-rust hover:underline"
                  onClick={(e) => { if (!confirm(`Delete "${c.full_name ?? c.name}"? This cannot be undone.`)) e.preventDefault(); }}
                >
                  Delete
                </button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
