"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Variant = "stacked-light" | "inline-light" | "inline-dark";

interface Props {
  source: string;
  buttonText: string;
  placeholder?: string;
  variant?: Variant;
}

const VARIANTS: Record<Variant, { wrap: string; input: string; button: string }> = {
  // Homepage founding card (light bg, stacked, rust button)
  "stacked-light": {
    wrap: "flex flex-col gap-2",
    input: "border border-ink/15 bg-ink/5 px-4 py-3 font-mono text-sm text-ink placeholder-ink/40 outline-none focus:border-rust",
    button: "bg-rust px-7 py-3 font-mono text-sm uppercase tracking-widest text-warm-white transition-opacity hover:opacity-90 disabled:opacity-40",
  },
  // Coming-soon page (sand bg, horizontal)
  "inline-light": {
    wrap: "flex flex-col gap-3 sm:flex-row",
    input: "flex-1 border border-ww-border bg-warm-white px-3 py-2 font-mono text-sm text-ink placeholder:text-ww-muted focus:border-ink focus:outline-none",
    button: "bg-rust px-5 py-2 font-mono text-sm text-warm-white transition-opacity hover:opacity-90 disabled:opacity-40",
  },
  // Intel page contributor signup (dark bg, gold button, joined)
  "inline-dark": {
    wrap: "mx-auto flex max-w-sm gap-0",
    input: "min-w-0 flex-1 border border-warm-white/20 bg-warm-white/10 px-4 py-2.5 font-mono text-base text-warm-white placeholder:text-warm-white/30 focus:outline-none focus:border-gold",
    button: "shrink-0 border border-gold bg-gold px-5 py-2.5 font-mono text-xs uppercase tracking-widest text-ink hover:bg-gold/90 transition-colors disabled:opacity-40",
  },
};

export function EmailCaptureForm({
  source,
  buttonText,
  placeholder = "your@email.com",
  variant = "stacked-light",
}: Props) {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const styles = VARIANTS[variant];
  const isDark = variant === "inline-dark";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || submitting) return;
    setSubmitting(true);
    setError("");

    const supabase = createClient();
    const { error: insertErr } = await supabase
      .from("email_captures")
      .insert({ email, source });

    setSubmitting(false);
    if (insertErr) {
      setError("Something went wrong. Try again?");
      return;
    }
    setDone(true);
  }

  if (done) {
    return (
      <p className={`font-mono text-sm ${isDark ? "text-warm-white/80" : "text-sage"}`}>
        ✓ You&apos;re on the list. We&apos;ll be in touch.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={styles.wrap}>
      <input
        type="email"
        name="email"
        aria-label="Email address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        placeholder={placeholder}
        className={styles.input}
      />
      <button type="submit" disabled={submitting} className={styles.button}>
        {submitting ? "Sending…" : buttonText}
      </button>
      {error && <p className={`font-mono text-xs ${isDark ? "text-rust/90" : "text-rust"}`}>{error}</p>}
    </form>
  );
}
