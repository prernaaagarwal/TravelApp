"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Suspense } from "react";

function SignupForm() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?next=/onboarding`,
      },
    });
    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      setSent(true);
    }
  }

  if (sent) {
    return (
      <div className="text-center">
        <div className="mb-4 text-4xl">✉️</div>
        <h2 className="font-serif text-2xl text-ink mb-2">Check your inbox</h2>
        <p className="text-ww-muted text-sm">
          We sent a magic link to <strong>{email}</strong>.
          <br />
          Click it to create your account — no password needed.
        </p>
        <p className="mt-4 text-xs text-ww-muted">
          After joining, we&apos;ll ask you 3 quick questions to personalise
          your intel.
        </p>
        <p className="mt-6 text-xs text-ww-muted">
          Wrong email?{" "}
          <button
            onClick={() => setSent(false)}
            className="underline hover:text-ink"
          >
            Try again
          </button>
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="email" className="block text-sm text-ink mb-1">
          Email address
        </label>
        <Input
          id="email"
          type="email"
          required
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="bg-warm-white border-ww-border"
        />
      </div>

      {error && <p className="text-rust text-sm">{error}</p>}

      <Button
        type="submit"
        disabled={loading}
        className="w-full bg-rust text-warm-white hover:bg-rust/90"
      >
        {loading ? "Sending…" : "Join with magic link"}
      </Button>

      <p className="text-center text-xs text-ww-muted pt-2">
        Already have an account?{" "}
        <Link href="/account/login" className="underline hover:text-ink">
          Sign in
        </Link>
      </p>
    </form>
  );
}

export default function SignupPage() {
  return (
    <main className="min-h-screen bg-sand flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href="/" className="font-serif text-2xl text-ink hover:text-rust">
            Wander Women
          </Link>
          <p className="mt-2 text-sm text-ww-muted">
            Join 1,200+ women travelling smarter
          </p>
        </div>

        <div className="bg-warm-white border border-ww-border rounded-xl p-6 shadow-sm">
          <Suspense>
            <SignupForm />
          </Suspense>
        </div>

        <p className="mt-4 text-center text-xs text-ww-muted px-4">
          Free to join. No spam. Intel from real women, not travel brands.
        </p>
      </div>
    </main>
  );
}
