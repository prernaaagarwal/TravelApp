"use client";

import { useState, useTransition } from "react";
import { BadgeCheck } from "lucide-react";
import { setReplyVerified } from "@/app/community/replies-actions";

export function VerifyReplyButton({
  replyId,
  postId,
  verified: verifiedInitial,
}: {
  replyId: string;
  postId: string;
  verified: boolean;
}) {
  const [verified, setVerified] = useState(verifiedInitial);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    setError(null);
    const next = !verified;
    // Optimistic — flip immediately, revert if the action errors.
    setVerified(next);
    startTransition(async () => {
      const result = await setReplyVerified(replyId, postId, next);
      if (result.error) {
        setVerified(!next);
        setError(result.error);
      }
    });
  }

  return (
    <span className="flex items-center gap-2">
      {error && <span className="text-[10px] text-rust">{error}</span>}
      <button
        type="button"
        onClick={handleClick}
        disabled={isPending}
        aria-pressed={verified}
        className={`inline-flex items-center gap-1.5 border px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest transition-colors disabled:opacity-50 ${
          verified
            ? "border-sage bg-sage text-warm-white hover:bg-sage/90"
            : "border-ww-border bg-warm-white text-ww-muted hover:border-sage hover:text-sage"
        }`}
      >
        <BadgeCheck className="h-3 w-3" />
        {verified ? "Verified" : "Verify"}
      </button>
    </span>
  );
}
