"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { joinWaitlist } from "./actions";

export default function MembershipForm({ defaultEmail }: { defaultEmail?: string }) {
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
      <div className="w-full max-w-sm text-center mx-auto py-12">
        <div className="mb-4 text-4xl">🎉</div>
        <h2 className="font-serif text-3xl text-ink mb-2">Your spot is locked in.</h2>
        <p className="text-sm text-ww-muted mb-6">
          We&apos;ll WhatsApp you within 48 hours to confirm — no payment now or
          ever for the first 200. Welcome to the founding circle.
        </p>
        <Button asChild variant="ghost" size="sm" className="text-ww-muted hover:text-ink">
          <Link href="/">← Back to home</Link>
        </Button>
      </div>
    );
  }

  return (
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
            defaultValue={defaultEmail}
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
          We&apos;ll WhatsApp you within 48 hours to confirm your spot.
          No payment, no spam, ever.
        </p>
      </form>
    </div>
  );
}
