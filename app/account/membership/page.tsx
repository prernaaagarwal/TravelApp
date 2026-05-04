"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { joinWaitlist } from "./actions";

export default function MembershipPage() {
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const result = await joinWaitlist(new FormData(e.currentTarget));
    setLoading(false);
    if (result?.error) {
      setError(result.error);
    } else {
      setDone(true);
    }
  }

  if (done) {
    return (
      <main className="min-h-screen bg-sand flex items-center justify-center px-4">
        <div className="w-full max-w-sm text-center">
          <div className="mb-4 text-4xl">🎉</div>
          <h2 className="font-serif text-3xl text-ink mb-2">You&apos;re on the list.</h2>
          <p className="text-sm text-ww-muted mb-6">
            We&apos;ll WhatsApp you within 48 hours with your founding member link.
            Only 200 spots — you&apos;re in early.
          </p>
          <Button asChild variant="ghost" size="sm" className="text-ww-muted hover:text-ink">
            <Link href="/">← Back to home</Link>
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-sand px-4 py-12">
      <div className="mx-auto max-w-sm">
        <div className="mb-8">
          <Link href="/" className="text-sm text-ww-muted hover:text-ink">
            ← Back to home
          </Link>
        </div>

        {/* pitch */}
        <div className="mb-8">
          <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-rust">
            Founding 200 · ₹499 / year
          </p>
          <h1 className="font-serif text-4xl text-ink mb-3">
            Join before the doors close.
          </h1>
          <p className="text-sm text-ww-muted leading-relaxed mb-4">
            The first 200 women get founding membership for life at ₹499/year —
            locked in forever, even when the price goes up.
          </p>

          <ul className="space-y-2 mb-6">
            {[
              "Full access to every premium intel card",
              "Priority replies in Ask a Local Sister",
              "Buddy matching with verified profiles",
              "Early access to every new feature",
              "Your name in the founding member credits",
            ].map((perk) => (
              <li key={perk} className="flex items-start gap-2 text-sm text-ink">
                <span className="mt-0.5 text-sage shrink-0">✓</span>
                {perk}
              </li>
            ))}
          </ul>

          <div className="inline-block border border-gold/40 bg-gold-light px-3 py-1.5 font-mono text-[10px] text-gold">
            ₹499 / year · Cancel anytime · Founding price locked forever
          </div>
        </div>

        {/* form */}
        <div className="bg-warm-white border border-ww-border rounded-xl p-6 shadow-sm">
          <p className="text-xs uppercase tracking-wider text-ww-muted mb-4">
            Reserve your spot
          </p>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label htmlFor="email" className="block text-xs text-ww-muted mb-1">
                Email address <span className="text-rust">*</span>
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                placeholder="you@example.com"
                className="bg-warm-white border-ww-border text-sm"
              />
            </div>
            <div>
              <label htmlFor="phone" className="block text-xs text-ww-muted mb-1">
                WhatsApp number <span className="text-ww-muted/60">(we&apos;ll send your link here)</span>
              </label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                placeholder="+91 98765 43210"
                className="bg-warm-white border-ww-border text-sm"
              />
            </div>
            <div>
              <label htmlFor="city" className="block text-xs text-ww-muted mb-1">
                Your city
              </label>
              <Input
                id="city"
                name="city"
                placeholder="Mumbai"
                className="bg-warm-white border-ww-border text-sm"
              />
            </div>
            <div>
              <label htmlFor="instagram" className="block text-xs text-ww-muted mb-1">
                Instagram handle <span className="text-ww-muted/60">(optional)</span>
              </label>
              <Input
                id="instagram"
                name="instagram"
                placeholder="@yourhandle"
                className="bg-warm-white border-ww-border text-sm"
              />
            </div>

            {error && <p className="text-rust text-sm">{error}</p>}

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-rust text-warm-white hover:bg-rust/90"
            >
              {loading ? "Reserving your spot…" : "Join the Founding 200 →"}
            </Button>

            <p className="text-center text-xs text-ww-muted pt-1">
              We&apos;ll WhatsApp you within 48 hours with your payment link.
              No spam, ever.
            </p>
          </form>

          <p className="mt-5 text-center text-xs text-ww-muted border-t border-ww-border pt-5">
            Already have an account?{" "}
            <Link href="/account/login" className="underline hover:text-ink">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
