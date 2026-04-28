"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/";
  const hasError = searchParams.get("error") === "auth";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
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
          Click it to sign in — no password needed.
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

      {(error || hasError) && (
        <p className="text-rust text-sm">
          {error || "Something went wrong. Please try again."}
        </p>
      )}

      <Button
        type="submit"
        disabled={loading}
        className="w-full bg-rust text-warm-white hover:bg-rust/90"
      >
        {loading ? "Sending…" : "Send magic link"}
      </Button>

      <p className="text-center text-xs text-ww-muted pt-2">
        No account yet?{" "}
        <Link href="/account/signup" className="underline hover:text-ink">
          Join Wander Women
        </Link>
      </p>
    </form>
  );
}

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-sand flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href="/" className="font-serif text-2xl text-ink hover:text-rust">
            Wander Women
          </Link>
          <p className="mt-2 text-sm text-ww-muted">Sign in to your account</p>
        </div>

        <div className="bg-warm-white border border-ww-border rounded-xl p-6 shadow-sm">
          <Suspense>
            <LoginForm />
          </Suspense>
        </div>
      </div>
    </main>
  );
}
