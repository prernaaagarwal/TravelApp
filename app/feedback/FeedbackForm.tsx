"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { submitFeedback, type FeedbackPayload } from "./actions";
import { RustButton } from "@/components/ui/RustButton";

const BROUGHT_YOU_OPTIONS = [
  { value: "planning",    label: "Planning a solo trip" },
  { value: "research",    label: "Research / curiosity" },
  { value: "recommended", label: "Someone recommended it" },
  { value: "other",       label: "Other" },
];

const PREPARED_LABELS = ["Not really", "", "", "", "Absolutely yes"];

type Props = {
  defaultEmail?: string;
};

export default function FeedbackForm({ defaultEmail = "" }: Props) {
  const [whatBroughtYou, setWhatBroughtYou] = useState("");
  const [preparedScore, setPreparedScore] = useState<number | null>(null);
  const [likedMost, setLikedMost]   = useState("");
  const [frustrated, setFrustrated] = useState("");
  const [confusing, setConfusing]   = useState("");
  const [missing, setMissing]       = useState("");
  const [nps, setNps]               = useState<number | null>(null);
  const [email, setEmail]           = useState(defaultEmail);

  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [done, setDone]   = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const payload: FeedbackPayload = {
      whatBroughtYou,
      preparedScore: preparedScore ?? undefined,
      likedMost,
      frustrated,
      confusing,
      missing,
      nps: nps ?? undefined,
      followUpEmail: email,
    };
    startTransition(async () => {
      const res = await submitFeedback(payload);
      if (!res.ok) setError(res.error);
      else setDone(true);
    });
  }

  if (done) {
    return (
      <div className="border border-ww-border bg-warm-white p-8 text-center">
        <div className="mb-3 text-4xl">🙏</div>
        <h2 className="mb-2 font-serif text-2xl text-ink">Thank you.</h2>
        <p className="mx-auto max-w-md text-sm text-ww-muted">
          Real feedback from real users is the difference between this becoming
          a guidebook for women and yet another travel app. We read every line.
        </p>
        <div className="mt-6">
          <Link
            href="/"
            className="font-mono text-xs uppercase tracking-widest text-rust hover:underline"
          >
            ← Back to home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-10">
      {/* 1. What brought you here? */}
      <Question num="01" label="What brought you here?">
        <div className="grid gap-2 sm:grid-cols-2">
          {BROUGHT_YOU_OPTIONS.map((o) => (
            <button
              key={o.value}
              type="button"
              onClick={() => setWhatBroughtYou(o.value)}
              className={`border p-3 text-left font-mono text-sm transition-colors ${
                whatBroughtYou === o.value
                  ? "border-rust bg-rust-light text-ink"
                  : "border-ww-border bg-warm-white text-ww-muted hover:border-ink hover:text-ink"
              }`}
            >
              {o.label}
            </button>
          ))}
        </div>
      </Question>

      {/* 2. Prepared / safer score */}
      <Question
        num="02"
        label="Did the app help you feel more prepared or safer?"
      >
        <div className="flex flex-wrap items-center gap-2">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setPreparedScore(n)}
              className={`flex h-12 w-12 items-center justify-center border font-mono text-base transition-colors ${
                preparedScore === n
                  ? "border-rust bg-rust text-warm-white"
                  : "border-ww-border bg-warm-white text-ww-muted hover:border-ink hover:text-ink"
              }`}
              aria-label={`Score ${n}`}
            >
              {n}
            </button>
          ))}
        </div>
        <div className="mt-2 flex justify-between font-mono text-[10px] uppercase tracking-widest text-ww-muted/70">
          <span>{PREPARED_LABELS[0]}</span>
          <span>{PREPARED_LABELS[4]}</span>
        </div>
      </Question>

      {/* 3. Liked most */}
      <Question num="03" label="What's the ONE thing you liked most?">
        <input
          type="text"
          value={likedMost}
          onChange={(e) => setLikedMost(e.target.value)}
          placeholder="Just one thing — short and specific."
          maxLength={500}
          className="w-full border border-ww-border bg-warm-white px-3 py-2.5 font-mono text-sm text-ink placeholder:text-ww-muted/60 focus:border-ink focus:outline-none"
        />
      </Question>

      {/* 4. Frustrated */}
      <Question num="04" label="What frustrated you or didn't work?">
        <textarea
          value={frustrated}
          onChange={(e) => setFrustrated(e.target.value)}
          placeholder="The honest version. No need to be polite."
          rows={3}
          maxLength={1000}
          className="w-full resize-none border border-ww-border bg-warm-white px-3 py-2.5 font-mono text-sm text-ink placeholder:text-ww-muted/60 focus:border-ink focus:outline-none"
        />
      </Question>

      {/* 5. Confusing */}
      <Question num="05" label="Was anything confusing or hard to find?">
        <textarea
          value={confusing}
          onChange={(e) => setConfusing(e.target.value)}
          placeholder='Or: "Nope, all good!"'
          rows={2}
          maxLength={1000}
          className="w-full resize-none border border-ww-border bg-warm-white px-3 py-2.5 font-mono text-sm text-ink placeholder:text-ww-muted/60 focus:border-ink focus:outline-none"
        />
      </Question>

      {/* 6. Missing */}
      <Question
        num="06"
        label="What's the most important thing we're missing?"
        sub="The gold-mine question — be ruthless."
      >
        <textarea
          value={missing}
          onChange={(e) => setMissing(e.target.value)}
          placeholder="The feature, intel, or experience that would have made this 10x more useful."
          rows={3}
          maxLength={1000}
          className="w-full resize-none border border-ww-border bg-warm-white px-3 py-2.5 font-mono text-sm text-ink placeholder:text-ww-muted/60 focus:border-ink focus:outline-none"
        />
      </Question>

      {/* 7. NPS */}
      <Question
        num="07"
        label="How likely are you to recommend this to a fellow solo traveler?"
      >
        <div className="grid grid-cols-6 gap-1.5 sm:grid-cols-11 sm:gap-2">
          {Array.from({ length: 11 }, (_, n) => (
            <button
              key={n}
              type="button"
              onClick={() => setNps(n)}
              className={`flex h-10 items-center justify-center border font-mono text-sm transition-colors ${
                nps === n
                  ? "border-rust bg-rust text-warm-white"
                  : "border-ww-border bg-warm-white text-ww-muted hover:border-ink hover:text-ink"
              }`}
              aria-label={`NPS ${n}`}
            >
              {n}
            </button>
          ))}
        </div>
        <div className="mt-2 flex justify-between font-mono text-[10px] uppercase tracking-widest text-ww-muted/70">
          <span>Not likely</span>
          <span>Very likely</span>
        </div>
      </Question>

      {/* 8. Email */}
      <Question
        num="08"
        label="Can we follow up with you?"
        sub="Drop your email if you'd like to be notified of updates or be part of our early community."
      >
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="w-full border border-ww-border bg-warm-white px-3 py-2.5 font-mono text-sm text-ink placeholder:text-ww-muted/60 focus:border-ink focus:outline-none"
        />
      </Question>

      {error && (
        <p className="border-l-2 border-rust pl-4 font-mono text-sm text-rust">
          {error}
        </p>
      )}

      <div className="border-t border-ww-border pt-6">
        <RustButton type="submit" size="lg" disabled={isPending}>
          {isPending ? "Sending…" : "Send feedback"}
          <span aria-hidden>→</span>
        </RustButton>
        <p className="mt-3 font-mono text-[10px] text-ww-muted/70">
          Every field is optional. Submit what you want, skip the rest.
        </p>
      </div>
    </form>
  );
}

function Question({
  num,
  label,
  sub,
  children,
}: {
  num: string;
  label: string;
  sub?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-3 flex items-baseline gap-3">
        <span className="font-mono text-[10px] uppercase tracking-widest text-rust">
          {num}
        </span>
        <h3 className="font-serif text-lg leading-snug text-ink md:text-xl">
          {label}
        </h3>
      </div>
      {sub && (
        <p className="mb-3 font-mono text-[10px] text-ww-muted/70">{sub}</p>
      )}
      {children}
    </div>
  );
}
