"use client";

import { useState, useTransition, useMemo } from "react";
import { History } from "lucide-react";
import {
  approvePost, rejectPost,
  approveBeware, rejectBeware,
  approveTrip, rejectTrip,
  bulkApprove, bulkReject,
} from "@/app/admin/actions";
import { RejectionModal } from "@/components/admin/RejectionModal";
import { SubmitterHistoryModal } from "@/components/admin/SubmitterHistoryModal";

// ─── Types ──────────────────────────────────────────────────────────────
type ContentType = "post" | "beware" | "trip";

export type PendingPost = {
  id: string;
  tab: string;
  title: string;
  author_id: string | null;
  author_name: string | null;
  content: string;
  destination: string | null;
  created_at: string;
};

export type PendingBeware = {
  id: string;
  title: string;
  description: string;
  category: string | null;
  severity: string | null;
  city: string | null;
  reported_by_id: string | null;
  reported_by_name: string | null;
  created_at: string;
};

export type PendingTrip = {
  id: string;
  user_id: string | null;
  destination: string;
  destination_slug: string;
  trip_start: string;
  trip_end: string;
  day_count: number;
  total_cost_inr: number;
  highlight: string;
  created_at: string;
};

interface RejectionTarget {
  type:      ContentType;
  ids:       string[];
  itemTitle: string;
}

interface HistoryTarget {
  userId:      string;
  displayName: string;
}

// ─── Component ──────────────────────────────────────────────────────────
export function ModerationQueue({
  posts,
  bewares,
  trips,
}: {
  posts:   PendingPost[];
  bewares: PendingBeware[];
  trips:   PendingTrip[];
}) {
  const [selectedPosts,   setSelectedPosts]   = useState<Set<string>>(new Set());
  const [selectedBewares, setSelectedBewares] = useState<Set<string>>(new Set());
  const [selectedTrips,   setSelectedTrips]   = useState<Set<string>>(new Set());

  const [rejectionTarget, setRejectionTarget] = useState<RejectionTarget | null>(null);
  const [historyTarget,   setHistoryTarget]   = useState<HistoryTarget | null>(null);

  const totalPending = posts.length + bewares.length + trips.length;

  if (totalPending === 0) {
    return (
      <div className="border border-ww-border bg-sand p-10 text-center">
        <p className="font-serif text-xl text-ink">Queue is empty</p>
        <p className="mt-2 font-mono text-xs text-ww-muted">
          No pending posts, beware reports, or trip receipts.
        </p>
      </div>
    );
  }

  function setSelection(type: ContentType, next: Set<string>) {
    if (type === "post")   setSelectedPosts(next);
    if (type === "beware") setSelectedBewares(next);
    if (type === "trip")   setSelectedTrips(next);
  }

  function clearSelection(type: ContentType) {
    setSelection(type, new Set());
  }

  return (
    <div className="space-y-10">
      {/* Trip receipts */}
      {trips.length > 0 && (
        <Section
          title={`Trip receipts — ${trips.length} pending`}
          type="trip"
          allIds={trips.map((t) => t.id)}
          selection={selectedTrips}
          setSelection={(next) => setSelection("trip", next)}
          onBulkReject={(ids) => setRejectionTarget({ type: "trip", ids, itemTitle: `${ids.length} trip receipts` })}
        >
          {trips.map((t) => (
            <ItemCard
              key={t.id}
              checked={selectedTrips.has(t.id)}
              onCheck={(checked) => toggle(t.id, selectedTrips, (s) => setSelectedTrips(s), checked)}
            >
              <div className="mb-1 flex flex-wrap items-center gap-3">
                <span className="border border-ww-border px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-ww-muted">
                  {t.destination}
                </span>
                <span className="font-mono text-[10px] text-ww-muted">
                  {t.trip_start} → {t.trip_end} · {t.day_count}d
                </span>
                <span className="font-mono text-[10px] text-ww-muted">
                  ₹{t.total_cost_inr.toLocaleString("en-IN")}
                </span>
                <span className="ml-auto font-mono text-[10px] text-ww-muted">
                  {formatDate(t.created_at)}
                </span>
              </div>
              <p className="mt-2 line-clamp-2 font-serif text-sm italic text-ink">
                &ldquo;{t.highlight}&rdquo;
              </p>
              <ItemActions
                onApprove={() => approveTrip(t.id)}
                onRejectClick={() => setRejectionTarget({ type: "trip", ids: [t.id], itemTitle: t.destination })}
                onHistoryClick={
                  t.user_id
                    ? () => setHistoryTarget({ userId: t.user_id!, displayName: t.destination })
                    : null
                }
              />
            </ItemCard>
          ))}
        </Section>
      )}

      {/* Community posts */}
      {posts.length > 0 && (
        <Section
          title={`Community posts — ${posts.length} pending`}
          type="post"
          allIds={posts.map((p) => p.id)}
          selection={selectedPosts}
          setSelection={(next) => setSelection("post", next)}
          onBulkReject={(ids) => setRejectionTarget({ type: "post", ids, itemTitle: `${ids.length} community posts` })}
        >
          {posts.map((p) => (
            <ItemCard
              key={p.id}
              checked={selectedPosts.has(p.id)}
              onCheck={(checked) => toggle(p.id, selectedPosts, (s) => setSelectedPosts(s), checked)}
            >
              <div className="mb-1 flex flex-wrap items-center gap-3">
                <span className="border border-ww-border px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-ww-muted">
                  {p.tab}
                </span>
                {p.destination && (
                  <span className="font-mono text-[10px] text-ww-muted">{p.destination}</span>
                )}
                <span className="ml-auto font-mono text-[10px] text-ww-muted">
                  {formatDate(p.created_at)}
                </span>
              </div>
              <p className="font-serif text-base font-medium text-ink">{p.title || "(no title)"}</p>
              <p className="mt-1 font-mono text-xs text-ww-muted">
                by {p.author_name ?? "Anonymous"}
              </p>
              <p className="mt-2 line-clamp-3 font-mono text-sm leading-relaxed text-ink">
                {p.content}
              </p>
              <ItemActions
                onApprove={() => approvePost(p.id)}
                onRejectClick={() => setRejectionTarget({ type: "post", ids: [p.id], itemTitle: p.title || "Community post" })}
                onHistoryClick={
                  p.author_id
                    ? () => setHistoryTarget({ userId: p.author_id!, displayName: p.author_name ?? "Anonymous" })
                    : null
                }
              />
            </ItemCard>
          ))}
        </Section>
      )}

      {/* Beware reports */}
      {bewares.length > 0 && (
        <Section
          title={`Beware reports — ${bewares.length} pending`}
          type="beware"
          allIds={bewares.map((b) => b.id)}
          selection={selectedBewares}
          setSelection={(next) => setSelection("beware", next)}
          onBulkReject={(ids) => setRejectionTarget({ type: "beware", ids, itemTitle: `${ids.length} beware reports` })}
        >
          {bewares.map((b) => (
            <ItemCard
              key={b.id}
              checked={selectedBewares.has(b.id)}
              onCheck={(checked) => toggle(b.id, selectedBewares, (s) => setSelectedBewares(s), checked)}
            >
              <div className="mb-1 flex flex-wrap items-center gap-3">
                {b.severity && (
                  <span
                    className={`border px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest ${
                      b.severity === "critical"
                        ? "border-rust bg-rust/10 text-rust"
                        : b.severity === "high"
                        ? "border-gold bg-gold/10 text-gold"
                        : "border-ww-border text-ww-muted"
                    }`}
                  >
                    {b.severity}
                  </span>
                )}
                {b.category && <span className="font-mono text-[10px] text-ww-muted">{b.category}</span>}
                {b.city && <span className="font-mono text-[10px] text-ww-muted">{b.city}</span>}
                <span className="ml-auto font-mono text-[10px] text-ww-muted">
                  {formatDate(b.created_at)}
                </span>
              </div>
              <p className="font-serif text-base font-medium text-ink">{b.title}</p>
              <p className="mt-1 font-mono text-xs text-ww-muted">
                reported by {b.reported_by_name ?? "Anonymous"}
              </p>
              <p className="mt-2 line-clamp-3 font-mono text-sm leading-relaxed text-ink">
                {b.description}
              </p>
              <ItemActions
                onApprove={() => approveBeware(b.id)}
                onRejectClick={() => setRejectionTarget({ type: "beware", ids: [b.id], itemTitle: b.title })}
                onHistoryClick={
                  b.reported_by_id
                    ? () => setHistoryTarget({ userId: b.reported_by_id!, displayName: b.reported_by_name ?? "Anonymous" })
                    : null
                }
              />
            </ItemCard>
          ))}
        </Section>
      )}

      {/* Modals */}
      <RejectionModal
        open={rejectionTarget !== null}
        onOpenChange={(open) => { if (!open) setRejectionTarget(null); }}
        title={rejectionTarget?.itemTitle ?? ""}
        itemCount={rejectionTarget?.ids.length ?? 1}
        onConfirm={async (reason) => {
          if (!rejectionTarget) return;
          const { type, ids } = rejectionTarget;
          if (ids.length === 1) {
            if (type === "post")   await rejectPost(ids[0],   reason);
            if (type === "beware") await rejectBeware(ids[0], reason);
            if (type === "trip")   await rejectTrip(ids[0],   reason);
          } else {
            await bulkReject(type, ids, reason);
          }
          clearSelection(type);
          setRejectionTarget(null);
        }}
      />

      <SubmitterHistoryModal
        open={historyTarget !== null}
        onOpenChange={(open) => { if (!open) setHistoryTarget(null); }}
        userId={historyTarget?.userId ?? null}
        displayName={historyTarget?.displayName ?? ""}
      />
    </div>
  );
}

// ─── Subcomponents ──────────────────────────────────────────────────────
function Section({
  title,
  type,
  allIds,
  selection,
  setSelection,
  onBulkReject,
  children,
}: {
  title:        string;
  type:         ContentType;
  allIds:       string[];
  selection:    Set<string>;
  setSelection: (next: Set<string>) => void;
  onBulkReject: (ids: string[]) => void;
  children:     React.ReactNode;
}) {
  const [pending, startTransition] = useTransition();
  const allChecked = allIds.length > 0 && selection.size === allIds.length;
  const selectedCount = selection.size;

  const selectedArray = useMemo(() => [...selection], [selection]);

  function toggleAll() {
    setSelection(allChecked ? new Set() : new Set(allIds));
  }

  function bulkApproveSelected() {
    startTransition(async () => {
      try {
        await bulkApprove(type, selectedArray);
        setSelection(new Set());
      } catch (err) {
        // Surface error on console — admin will see queue stale on next refresh
        console.error("Bulk approve failed:", err);
      }
    });
  }

  return (
    <section>
      <div className="mb-3 flex items-center justify-between gap-2">
        <h2 className="font-mono text-xs uppercase tracking-widest text-ww-muted">{title}</h2>
        <label className="flex cursor-pointer items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-ww-muted">
          <input
            type="checkbox"
            checked={allChecked}
            onChange={toggleAll}
            className="h-3.5 w-3.5 cursor-pointer accent-ink"
          />
          Select all
        </label>
      </div>

      {selectedCount > 0 && (
        <div className="sticky top-2 z-10 mb-3 flex flex-wrap items-center gap-2 border border-ink bg-ink px-3 py-2 font-mono text-[10px] uppercase tracking-widest text-warm-white">
          <span>{selectedCount} selected</span>
          <button
            type="button"
            onClick={bulkApproveSelected}
            disabled={pending}
            className="ml-auto border border-sage bg-sage px-3 py-1 text-warm-white transition-colors hover:bg-sage/80 disabled:opacity-40"
          >
            {pending ? "…" : "Approve all"}
          </button>
          <button
            type="button"
            onClick={() => onBulkReject(selectedArray)}
            disabled={pending}
            className="border border-rust bg-rust px-3 py-1 text-warm-white transition-colors hover:bg-rust/80 disabled:opacity-40"
          >
            Reject all
          </button>
          <button
            type="button"
            onClick={() => setSelection(new Set())}
            className="border border-warm-white/30 px-3 py-1 text-warm-white transition-colors hover:bg-warm-white/10"
          >
            Clear
          </button>
        </div>
      )}

      <div className="space-y-4">{children}</div>
    </section>
  );
}

function ItemCard({
  checked,
  onCheck,
  children,
}: {
  checked:  boolean;
  onCheck:  (checked: boolean) => void;
  children: React.ReactNode;
}) {
  return (
    <div className={`flex gap-3 border bg-warm-white p-4 transition-colors ${checked ? "border-ink" : "border-ww-border"}`}>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onCheck(e.target.checked)}
        className="mt-1 h-4 w-4 shrink-0 cursor-pointer accent-ink"
        aria-label="Select item"
      />
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}

function ItemActions({
  onApprove,
  onRejectClick,
  onHistoryClick,
}: {
  onApprove:      () => Promise<void>;
  onRejectClick:  () => void;
  onHistoryClick: (() => void) | null;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <div className="mt-3 flex flex-wrap gap-2">
      <button
        type="button"
        disabled={pending}
        onClick={() => startTransition(onApprove)}
        className="border border-sage bg-sage px-4 py-1.5 font-mono text-[10px] uppercase tracking-widest text-warm-white transition-colors hover:bg-sage/80 disabled:opacity-40"
      >
        {pending ? "…" : "Approve"}
      </button>
      <button
        type="button"
        disabled={pending}
        onClick={onRejectClick}
        className="border border-rust px-4 py-1.5 font-mono text-[10px] uppercase tracking-widest text-rust transition-colors hover:bg-rust hover:text-warm-white disabled:opacity-40"
      >
        Reject…
      </button>
      {onHistoryClick && (
        <button
          type="button"
          onClick={onHistoryClick}
          className="ml-auto inline-flex items-center gap-1 border border-ww-border px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest text-ww-muted transition-colors hover:border-ink hover:text-ink"
          title="View submitter history"
        >
          <History className="h-3 w-3" />
          History
        </button>
      )}
    </div>
  );
}

// ─── Helpers ────────────────────────────────────────────────────────────
function toggle(
  id: string,
  current: Set<string>,
  setter: (s: Set<string>) => void,
  checked: boolean
) {
  const next = new Set(current);
  if (checked) next.add(id);
  else         next.delete(id);
  setter(next);
}

function formatDate(s: string): string {
  return new Date(s).toLocaleDateString("en-IN", {
    day: "numeric", month: "short", year: "numeric",
  });
}
