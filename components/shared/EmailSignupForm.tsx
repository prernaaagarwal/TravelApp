"use client";

import { useState, useTransition } from "react";
import { submitLead } from "@/app/actions/leads";
import { RustButton } from "@/components/ui/RustButton";

type Source = "landing-founding" | "contributor-apply";

export function EmailSignupForm({
  source,
  placeholder = "your@email.com",
  buttonText = "Submit",
  dark = false,
}: {
  source: Source;
  placeholder?: string;
  buttonText?: string;
  dark?: boolean;
}) {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const result = await submitLead(email, source);
      if (result.error) {
        setError(result.error);
      } else {
        setDone(true);
      }
    });
  }

  if (done) {
    return (
      <p className={`font-mono text-sm ${dark ? "text-warm-white/70" : "text-sage"}`}>
        ✓ You&apos;re on the list — we&apos;ll be in touch.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder={placeholder}
        disabled={isPending}
        className={`flex-1 border px-4 py-3 font-mono text-sm outline-none focus:border-rust ${
          dark
            ? "border-warm-white/20 bg-warm-white/5 text-warm-white placeholder:text-warm-white/30"
            : "border-ww-border bg-warm-white text-ink placeholder:text-ww-muted"
        }`}
      />
      <RustButton type="submit" size="lg" disabled={isPending} className="shrink-0">
        {isPending ? "Sending…" : buttonText}
      </RustButton>
      {error && (
        <p className={`text-xs font-mono ${dark ? "text-rust/80" : "text-rust"}`}>
          {error}
        </p>
      )}
    </form>
  );
}
