import { notFound } from "next/navigation";
import Link from "next/link";
import { Check, ArrowRight } from "lucide-react";
import { createStaticClient } from "@/lib/supabase/server";
import { safeQuery } from "@/lib/safe-query";
import { formatDestinationSlug } from "@/lib/utils";
import { RustButton } from "@/components/ui/RustButton";

/**
 * Read-only view of someone else's pre-book checklist, fetched via the
 * SECURITY DEFINER `get_shared_checklist(token)` RPC. The token is the
 * only key — no auth required, but only rows that have been explicitly
 * shared (share_token IS NOT NULL) are reachable.
 *
 * The viewer sees: which items are ticked, who shared, when it was last
 * touched, and a "Get the full intel" CTA back to the intel page.
 */
export const metadata = { title: "Shared trip checklist — Wander Women" };
export const dynamic = "force-dynamic";

type SharedChecklist = {
  destination_slug: string;
  checked_indexes: number[];
  updated_at: string;
  shared_by_first_name: string | null;
};

type IntelCardRow = {
  destination: string;
  country: string;
  pre_book_checklist: string[] | null;
};

export default async function SharedChecklistPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  if (!token || !/^[a-f0-9]{16,128}$/.test(token)) notFound();

  const supabase = createStaticClient();

  const rows = await safeQuery<SharedChecklist[]>(
    supabase.rpc("get_shared_checklist", { token }),
    [],
    1500,
    "checklist.shared",
  );
  const shared = rows[0];
  if (!shared) notFound();

  const card = await safeQuery<IntelCardRow | null>(
    supabase
      .from("intel_cards")
      .select("destination, country, pre_book_checklist")
      .eq("slug", shared.destination_slug)
      .single(),
    null,
    1500,
    "checklist.shared.card",
  );

  // If the destination has been removed since the share link was created,
  // fall back to the slug-derived label so we still render something.
  const destinationLabel = card?.destination ?? formatDestinationSlug(shared.destination_slug);
  const country = card?.country ?? "";
  const items = card?.pre_book_checklist ?? [];
  const checkedSet = new Set(shared.checked_indexes);
  const doneCount = checkedSet.size;
  const total = items.length;
  const updatedAt = new Date(shared.updated_at).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <div className="mb-6">
        <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-ww-muted">
          Shared trip checklist
        </p>
        <h1 className="mb-2 font-serif text-3xl text-ink md:text-4xl">
          {shared.shared_by_first_name ?? "A friend"}&apos;s trip to{" "}
          <span className="text-rust">{destinationLabel}</span>
        </h1>
        {country && (
          <p className="font-mono text-xs text-ww-muted">
            {country} · last updated {updatedAt}
          </p>
        )}
      </div>

      {total > 0 ? (
        <>
          <div className="mb-4 flex items-center gap-3">
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-ww-border">
              <div
                className="h-full rounded-full bg-sage transition-all duration-300"
                style={{ width: `${(doneCount / total) * 100}%` }}
              />
            </div>
            <span className="shrink-0 font-mono text-xs text-ww-muted">
              {doneCount}/{total} done
            </span>
          </div>

          <ul className="space-y-2">
            {items.map((item, i) => {
              const done = checkedSet.has(i);
              return (
                <li
                  key={i}
                  className={`flex items-start gap-3 border p-3 transition-colors ${
                    done
                      ? "border-sage/30 bg-sage-light/40"
                      : "border-ww-border bg-sand"
                  }`}
                >
                  <span
                    className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border ${
                      done
                        ? "border-sage bg-sage text-warm-white"
                        : "border-ww-border bg-warm-white"
                    }`}
                    aria-label={done ? "Done" : "Not done"}
                  >
                    {done && <Check className="h-3 w-3" />}
                  </span>
                  <span
                    className={`text-sm leading-relaxed ${
                      done ? "text-ww-muted line-through" : "text-ink"
                    }`}
                  >
                    {item}
                  </span>
                </li>
              );
            })}
          </ul>
        </>
      ) : (
        <p className="border border-dashed border-ww-border bg-sand p-4 font-mono text-xs text-ww-muted">
          This destination&apos;s checklist is empty.
        </p>
      )}

      {/* Read-only banner + CTA back to the intel page */}
      <div className="mt-8 flex flex-col gap-3 border border-ww-border bg-warm-white p-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-mono text-[11px] leading-relaxed text-ww-muted">
          You&apos;re viewing a read-only share. Sign in to start your own
          checklist for {destinationLabel}.
        </p>
        <RustButton size="sm" asChild className="shrink-0">
          <Link href={`/intel/${shared.destination_slug}`}>
            See full intel
            <ArrowRight className="h-3 w-3" aria-hidden />
          </Link>
        </RustButton>
      </div>
    </div>
  );
}
