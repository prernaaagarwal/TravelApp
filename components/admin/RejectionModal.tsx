"use client";

import { useState, useTransition } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";

const TEMPLATES = [
  { key: "off_topic",       label: "Off-topic",            text: "This submission does not match the topic of this section. Please review the submission guidelines and try again." },
  { key: "insufficient",    label: "Insufficient detail",  text: "This submission lacks the specific detail other travellers need to act on it. Add specific names, locations, dates, or amounts and resubmit." },
  { key: "duplicate",       label: "Duplicate",            text: "We already have a similar approved submission. Please check the existing content before submitting again." },
  { key: "inappropriate",   label: "Inappropriate content", text: "This submission contains content that violates our community guidelines (harassment, hate speech, personally identifying information, or unverified accusations)." },
  { key: "promotional",     label: "Promotional",          text: "This submission appears to be promotional or self-serving rather than informational. We do not accept advertising in user submissions." },
] as const;

const MIN_REASON_LENGTH = 4;
const MAX_REASON_LENGTH = 500;

interface RejectionModalProps {
  open:         boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm:    (reason: string) => Promise<void>;
  title:        string;
  itemCount?:   number;
}

export function RejectionModal({ open, onOpenChange, onConfirm, title, itemCount = 1 }: RejectionModalProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-ink/50 backdrop-blur-sm" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 flex max-h-[85vh] w-[calc(100vw-2rem)] -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden border border-ww-border bg-sand shadow-2xl sm:w-full sm:max-w-lg">
          <ModalBody
            title={title}
            itemCount={itemCount}
            onConfirm={onConfirm}
            onClose={() => onOpenChange(false)}
          />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

// Inner component — only mounts while dialog is open. State resets on each
// open via natural unmount/remount, no synchronization effects needed.
function ModalBody({
  title,
  itemCount,
  onConfirm,
  onClose,
}: {
  title:     string;
  itemCount: number;
  onConfirm: (reason: string) => Promise<void>;
  onClose:   () => void;
}) {
  const [reason, setReason]   = useState("");
  const [error,  setError]    = useState("");
  const [pending, startTransition] = useTransition();

  function applyTemplate(text: string) {
    setReason(text);
    setError("");
  }

  function submit() {
    const trimmed = reason.trim();
    if (trimmed.length < MIN_REASON_LENGTH) {
      setError("Please provide a reason (or pick a template).");
      return;
    }
    if (trimmed.length > MAX_REASON_LENGTH) {
      setError(`Reason too long (max ${MAX_REASON_LENGTH} characters).`);
      return;
    }
    startTransition(async () => {
      try {
        await onConfirm(trimmed);
        onClose();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to reject. Try again.");
      }
    });
  }

  return (
    <>
      {/* Header */}
      <div className="flex items-start justify-between gap-3 border-b border-ww-border bg-warm-white px-5 py-4">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-widest text-rust">
            Reject {itemCount > 1 ? `${itemCount} items` : "submission"}
          </p>
          <Dialog.Title className="mt-1 font-serif text-xl text-ink">{title}</Dialog.Title>
        </div>
        <Dialog.Close asChild>
          <button
            type="button"
            aria-label="Close"
            className="rounded-sm p-1 text-ww-muted transition-colors hover:bg-sand hover:text-ink"
          >
            <X className="h-4 w-4" />
          </button>
        </Dialog.Close>
      </div>

      <Dialog.Description className="sr-only">
        Provide a rejection reason. The submitter will receive this in their notification email.
      </Dialog.Description>

      {/* Body */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        <div>
          <p className="mb-2 font-mono text-[10px] uppercase tracking-widest text-ww-muted">
            Use a template
          </p>
          <div className="flex flex-wrap gap-2">
            {TEMPLATES.map((t) => (
              <button
                key={t.key}
                type="button"
                onClick={() => applyTemplate(t.text)}
                className="border border-ww-border bg-warm-white px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest text-ww-muted transition-colors hover:border-ink hover:text-ink"
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="mb-1 block font-mono text-[10px] uppercase tracking-widest text-ww-muted">
            Reason (sent to submitter)
          </label>
          <textarea
            value={reason}
            onChange={(e) => {
              setReason(e.target.value);
              setError("");
            }}
            rows={5}
            maxLength={MAX_REASON_LENGTH}
            placeholder="Explain why this submission can't be approved. The submitter will receive this verbatim."
            className="w-full resize-none border border-ww-border bg-warm-white px-3 py-2 font-mono text-sm text-ink placeholder:text-ww-muted focus:border-ink focus:outline-none"
          />
          <div className="mt-1 flex items-center justify-between font-mono text-[10px] text-ww-muted">
            <span>{error && <span className="text-rust">{error}</span>}</span>
            <span>{reason.length} / {MAX_REASON_LENGTH}</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-end gap-2 border-t border-ww-border bg-warm-white px-5 py-3">
        <Dialog.Close asChild>
          <button
            type="button"
            className="border border-ww-border bg-sand px-4 py-2 font-mono text-[10px] uppercase tracking-widest text-ww-muted transition-colors hover:border-ink hover:text-ink"
          >
            Cancel
          </button>
        </Dialog.Close>
        <button
          type="button"
          onClick={submit}
          disabled={pending}
          className="border border-rust bg-rust px-4 py-2 font-mono text-[10px] uppercase tracking-widest text-warm-white transition-colors hover:bg-rust/90 disabled:opacity-40"
        >
          {pending ? "Rejecting…" : itemCount > 1 ? `Reject ${itemCount} items` : "Reject & email"}
        </button>
      </div>
    </>
  );
}
