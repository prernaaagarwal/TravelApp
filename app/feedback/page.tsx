import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import FeedbackForm from "./FeedbackForm";

export const metadata = {
  title: "Feedback — Wander Women",
  description:
    "Tell us what worked, what didn't, and what's missing. Eight quick questions, every field optional.",
};

export default async function FeedbackPage() {
  // Optional auth — the form works for anyone. If logged in we pre-fill the
  // follow-up email field so founding members don't have to retype it.
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <main className="bg-sand">
      <div className="mx-auto max-w-2xl px-6 py-16 md:py-24">
        <Link
          href="/"
          className="mb-10 inline-block font-mono text-xs uppercase tracking-widest text-ww-muted hover:text-ink"
        >
          ← Back to home
        </Link>

        <div className="mb-10">
          <div className="mb-5 flex items-center gap-3">
            <span className="h-px w-10 bg-rust" />
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-rust">
              Early feedback · Founding members
            </span>
          </div>
          <h1 className="mb-4 font-serif text-4xl leading-tight text-ink md:text-5xl">
            🗺️ Women&apos;s travel safety planner —
            <br />
            <span className="italic text-rust">honest feedback wanted.</span>
          </h1>
          <p className="text-base leading-relaxed text-ww-muted">
            Eight questions. Should take five minutes. Every field is optional —
            answer what you can, skip the rest. Brutal honesty preferred over
            polite encouragement.
          </p>
        </div>

        <FeedbackForm defaultEmail={user?.email ?? ""} />
      </div>
    </main>
  );
}
