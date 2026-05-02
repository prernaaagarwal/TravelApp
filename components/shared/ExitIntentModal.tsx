"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

const STORAGE_KEY = "ww-exit-intent-shown";

export function ExitIntentModal() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem(STORAGE_KEY)) return;

    let scrollHandler: (() => void) | null = null;
    let lastY = window.scrollY;
    let scrollUpAccum = 0;

    function trigger() {
      sessionStorage.setItem(STORAGE_KEY, "1");
      setOpen(true);
      cleanup();
    }

    function onMouseLeave(e: MouseEvent) {
      if (e.clientY <= 0) trigger();
    }

    function onScroll() {
      const y = window.scrollY;
      if (y < lastY) {
        scrollUpAccum += lastY - y;
        if (scrollUpAccum > 400 && y < 200) trigger();
      } else {
        scrollUpAccum = 0;
      }
      lastY = y;
    }

    function cleanup() {
      document.removeEventListener("mouseleave", onMouseLeave);
      if (scrollHandler) window.removeEventListener("scroll", scrollHandler);
    }

    const timer = setTimeout(() => {
      document.addEventListener("mouseleave", onMouseLeave);
      scrollHandler = onScroll;
      window.addEventListener("scroll", scrollHandler, { passive: true });
    }, 8000);

    return () => {
      clearTimeout(timer);
      cleanup();
    };
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setError("");

    const supabase = createClient();
    const { error: insertErr } = await supabase
      .from("email_captures")
      .insert({ email, source: "exit-intent-goa-brief" });

    setLoading(false);
    if (insertErr) {
      setError("Something went wrong. Try again.");
      return;
    }
    setDone(true);
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 px-4 backdrop-blur-sm"
      onClick={() => setOpen(false)}
    >
      <div
        className="relative w-full max-w-md border border-ww-border bg-warm-white p-8 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => setOpen(false)}
          aria-label="Close"
          className="absolute right-3 top-3 font-mono text-xs text-ww-muted hover:text-ink"
        >
          ✕
        </button>

        {done ? (
          <div className="text-center">
            <div className="mb-3 text-3xl">📬</div>
            <h2 className="mb-2 font-serif text-2xl text-ink">Check your inbox.</h2>
            <p className="font-mono text-xs leading-relaxed text-ww-muted">
              The Goa safety brief is on its way. Reply to that email any time —
              that&apos;s the founder, not a bot.
            </p>
          </div>
        ) : (
          <>
            <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-rust">
              Before you go —
            </p>
            <h2 className="mb-3 font-serif text-2xl leading-tight text-ink">
              Get the free Goa safety brief.
            </h2>
            <p className="mb-5 text-sm leading-relaxed text-ww-muted">
              The 7 scams every solo woman hits in Goa, the one beach to avoid
              after dark, and where to actually stay. PDF, your inbox, no spam.
            </p>

            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-ww-border bg-sand px-4 py-3 font-mono text-sm text-ink placeholder:text-ww-muted/60 focus:border-rust focus:outline-none"
              />
              {error && (
                <p className="font-mono text-xs text-rust">{error}</p>
              )}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-rust px-6 py-3 font-mono text-xs uppercase tracking-widest text-warm-white hover:bg-rust/90 disabled:opacity-50"
              >
                {loading ? "Sending…" : "Send me the brief →"}
              </button>
              <p className="text-center font-mono text-[10px] text-ww-muted">
                One email. Unsubscribe in one click.
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
