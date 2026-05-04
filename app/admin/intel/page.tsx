import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { deleteIntelCard } from "./actions";

export const dynamic = "force-dynamic";

export default async function AdminIntelPage() {
  const supabase = await createClient();
  const { data: cards } = await supabase
    .from("intel_cards")
    .select("slug,destination,country,is_premium,last_updated,verified_by_count,contributor_slug")
    .order("destination");

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <p className="mb-1 font-mono text-[10px] uppercase tracking-[0.2em] text-ww-muted">Content</p>
          <h1 className="font-serif text-3xl text-ink">Intel cards</h1>
          <p className="mt-1 font-mono text-xs text-ww-muted">{cards?.length ?? 0} destinations</p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/admin/intel/import"
            className="border border-ww-border bg-warm-white px-4 py-2.5 font-mono text-[10px] uppercase tracking-widest text-ww-muted transition-colors hover:border-ink hover:text-ink"
          >
            Bulk import / export
          </Link>
          <Link
            href="/admin/intel/new"
            className="border border-ink bg-ink px-5 py-2.5 font-mono text-[10px] uppercase tracking-widest text-warm-white transition-colors hover:bg-ink/80"
          >
            + New card
          </Link>
        </div>
      </div>

      <div className="space-y-2">
        {(cards ?? []).map((card) => (
          <div key={card.slug} className="flex items-center gap-4 border border-ww-border bg-warm-white px-4 py-3">
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-serif text-base text-ink">{card.destination}</span>
                <span className="font-mono text-[10px] text-ww-muted">{card.country}</span>
                {card.is_premium && (
                  <span className="border border-gold/50 bg-gold/10 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-widest text-gold">
                    Premium
                  </span>
                )}
              </div>
              <p className="mt-0.5 font-mono text-[10px] text-ww-muted">
                /{card.slug}
                {card.contributor_slug && ` · by ${card.contributor_slug}`}
                {card.last_updated && ` · updated ${card.last_updated}`}
                {` · ${card.verified_by_count ?? 0} verifications`}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-3">
              <Link
                href={`/intel/${card.slug}`}
                target="_blank"
                className="font-mono text-[10px] text-ww-muted hover:text-ink"
              >
                View ↗
              </Link>
              <Link
                href={`/admin/intel/${card.slug}/edit`}
                className="font-mono text-[10px] text-ink hover:underline"
              >
                Edit
              </Link>
              <form action={async () => { "use server"; await deleteIntelCard(card.slug); }}>
                <button
                  type="submit"
                  className="font-mono text-[10px] text-rust hover:underline"
                  onClick={(e) => { if (!confirm(`Delete "${card.destination}"? This cannot be undone.`)) e.preventDefault(); }}
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
