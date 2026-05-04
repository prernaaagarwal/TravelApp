"use client";

import { useTransition } from "react";
import { approvePost, rejectPost, approveBeware, rejectBeware } from "@/app/admin/actions";

type PendingPost = {
  id: string;
  tab: string;
  title: string;
  author_name: string | null;
  content: string;
  destination: string | null;
  created_at: string;
};

type PendingBeware = {
  id: string;
  title: string;
  description: string;
  category: string | null;
  severity: string | null;
  city: string | null;
  reported_by_name: string | null;
  created_at: string;
};

function ActionButtons({
  onApprove,
  onReject,
}: {
  onApprove: () => Promise<void>;
  onReject: () => Promise<void>;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <div className="mt-3 flex gap-2">
      <button
        disabled={pending}
        onClick={() => startTransition(onApprove)}
        className="border border-sage bg-sage px-4 py-1.5 font-mono text-[10px] uppercase tracking-widest text-warm-white transition-colors hover:bg-sage/80 disabled:opacity-40"
      >
        {pending ? "…" : "Approve"}
      </button>
      <button
        disabled={pending}
        onClick={() => startTransition(onReject)}
        className="border border-rust px-4 py-1.5 font-mono text-[10px] uppercase tracking-widest text-rust transition-colors hover:bg-rust hover:text-warm-white disabled:opacity-40"
      >
        {pending ? "…" : "Reject"}
      </button>
    </div>
  );
}

export function ModerationQueue({
  posts,
  bewares,
}: {
  posts: PendingPost[];
  bewares: PendingBeware[];
}) {
  const totalPending = posts.length + bewares.length;

  if (totalPending === 0) {
    return (
      <div className="border border-ww-border bg-sand p-10 text-center">
        <p className="font-serif text-xl text-ink">Queue is empty</p>
        <p className="mt-2 font-mono text-xs text-ww-muted">
          No pending posts or beware reports.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Community posts */}
      {posts.length > 0 && (
        <section>
          <h2 className="mb-4 font-mono text-xs uppercase tracking-widest text-ww-muted">
            Community posts — {posts.length} pending
          </h2>
          <div className="space-y-4">
            {posts.map((p) => (
              <div key={p.id} className="border border-ww-border bg-warm-white p-4">
                <div className="mb-1 flex flex-wrap items-center gap-3">
                  <span className="border border-ww-border px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-ww-muted">
                    {p.tab}
                  </span>
                  {p.destination && (
                    <span className="font-mono text-[10px] text-ww-muted">
                      {p.destination}
                    </span>
                  )}
                  <span className="ml-auto font-mono text-[10px] text-ww-muted">
                    {new Date(p.created_at).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <p className="font-serif text-base font-medium text-ink">{p.title || "(no title)"}</p>
                <p className="mt-1 font-mono text-xs text-ww-muted">
                  by {p.author_name ?? "Anonymous"}
                </p>
                <p className="mt-2 line-clamp-3 font-mono text-sm leading-relaxed text-ink">
                  {p.content}
                </p>
                <ActionButtons
                  onApprove={() => approvePost(p.id)}
                  onReject={() => rejectPost(p.id)}
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Beware reports */}
      {bewares.length > 0 && (
        <section>
          <h2 className="mb-4 font-mono text-xs uppercase tracking-widest text-ww-muted">
            Beware reports — {bewares.length} pending
          </h2>
          <div className="space-y-4">
            {bewares.map((b) => (
              <div key={b.id} className="border border-ww-border bg-warm-white p-4">
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
                  {b.category && (
                    <span className="font-mono text-[10px] text-ww-muted">{b.category}</span>
                  )}
                  {b.city && (
                    <span className="font-mono text-[10px] text-ww-muted">{b.city}</span>
                  )}
                  <span className="ml-auto font-mono text-[10px] text-ww-muted">
                    {new Date(b.created_at).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <p className="font-serif text-base font-medium text-ink">{b.title}</p>
                <p className="mt-1 font-mono text-xs text-ww-muted">
                  reported by {b.reported_by_name ?? "Anonymous"}
                </p>
                <p className="mt-2 line-clamp-3 font-mono text-sm leading-relaxed text-ink">
                  {b.description}
                </p>
                <ActionButtons
                  onApprove={() => approveBeware(b.id)}
                  onReject={() => rejectBeware(b.id)}
                />
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
