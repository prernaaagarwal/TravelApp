"use client";

import { useState, useTransition } from "react";
import { submitReply } from "@/app/community/replies-actions";
import { RustButton } from "@/components/ui/RustButton";

export function ReplyForm({ postId }: { postId: string }) {
  const [content, setContent] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const result = await submitReply(postId, content);
      if (result.error) {
        setError(result.error);
      } else {
        setContent("");
      }
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="border border-ww-border bg-warm-white px-4 py-4"
    >
      <label
        htmlFor="reply-content"
        className="mb-2 block font-mono text-[10px] uppercase tracking-widest text-ww-muted"
      >
        Your reply
      </label>
      <textarea
        id="reply-content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Share what you saw, what worked, what didn't…"
        disabled={isPending}
        rows={4}
        maxLength={2000}
        required
        className="w-full resize-y border border-ww-border bg-sand px-3 py-2 font-mono text-sm text-ink placeholder:text-ww-muted outline-none focus:border-rust"
      />
      <div className="mt-3 flex items-center justify-between gap-3">
        <span className="font-mono text-[10px] text-ww-muted">
          {content.length} / 2000
        </span>
        <RustButton type="submit" size="sm" disabled={isPending || content.trim().length < 2}>
          {isPending ? "Posting…" : "Post reply"}
        </RustButton>
      </div>
      {error && (
        <p className="mt-2 font-mono text-[11px] text-rust">{error}</p>
      )}
    </form>
  );
}
