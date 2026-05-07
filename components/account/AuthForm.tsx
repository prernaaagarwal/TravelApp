"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Input } from "@/components/ui/input";
import { RustButton } from "@/components/ui/RustButton";

const RESEND_COOLDOWN_SEC = 60;
const CODE_LENGTH         = 6;

interface AuthFormProps {
  /** Where to send the user after a successful auth. */
  next:           string;
  /** Microcopy at the bottom of the email-entry step. */
  bottomNote?:    React.ReactNode;
  /** Microcopy after sending the code (e.g. "We'll ask 3 quick questions"). */
  postSendNote?:  React.ReactNode;
  /** "Sign in" or "Create account" — drives button copy. */
  primaryLabel:   string;
  /** "send_code" lets the user fall back to the email link too. */
  emailVerb?:     "send_code" | "send_link";
  /**
   * Optional gating checkbox the user must tick before email/Google flows
   * become available. Used on signup for the women-only declaration.
   */
  declaration?:   React.ReactNode;
}

export function AuthForm({
  next,
  bottomNote,
  postSendNote,
  primaryLabel,
  emailVerb = "send_code",
  declaration,
}: AuthFormProps) {
  const router = useRouter();
  const [step,    setStep]    = useState<"email" | "code">("email");
  const [email,   setEmail]   = useState("");
  const [code,    setCode]    = useState("");
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");
  const [resendIn, setResendIn] = useState(0);
  const [declared, setDeclared] = useState(!declaration);

  function startResendCountdown() {
    setResendIn(RESEND_COOLDOWN_SEC);
    const interval = setInterval(() => {
      setResendIn((s) => {
        if (s <= 1) {
          clearInterval(interval);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
  }

  async function sendCode(e?: React.FormEvent) {
    e?.preventDefault();
    if (!email) return;
    setLoading(true);
    setError("");

    const supabase = createClient();
    const { error: sendError } = await supabase.auth.signInWithOtp({
      email,
      options: {
        // Magic link is also included in the email — viable fallback if the
        // user prefers clicking a link over typing the code.
        emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
        shouldCreateUser: true,
      },
    });

    setLoading(false);

    if (sendError) {
      setError(prettyError(sendError.message));
      return;
    }

    setStep("code");
    startResendCountdown();
  }

  async function verifyCode(e: React.FormEvent) {
    e.preventDefault();
    if (code.length !== CODE_LENGTH) {
      setError(`Enter the ${CODE_LENGTH}-digit code from your email.`);
      return;
    }
    setLoading(true);
    setError("");

    const supabase = createClient();
    const { error: verifyError } = await supabase.auth.verifyOtp({
      email,
      token: code,
      type:  "email",
    });

    setLoading(false);

    if (verifyError) {
      setError(prettyError(verifyError.message));
      return;
    }

    router.push(next);
    router.refresh();
  }

  async function googleSignIn() {
    setLoading(true);
    setError("");
    const supabase = createClient();
    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
        queryParams: { access_type: "offline", prompt: "consent" },
      },
    });
    if (oauthError) {
      setLoading(false);
      setError(prettyError(oauthError.message));
    }
    // On success the browser is redirected by Supabase — no further action.
  }

  // ─── Render: code-entry step ────────────────────────────────────────
  if (step === "code") {
    return (
      <div className="space-y-4">
        <div>
          <p className="text-2xl">✉️</p>
          <h2 className="mt-2 font-serif text-2xl text-ink">Check your inbox</h2>
          <p className="mt-1 font-mono text-xs leading-relaxed text-ww-muted">
            We sent a {CODE_LENGTH}-digit code to <strong className="text-ink">{email}</strong>.
            Enter it below — or click the link in the email to sign in instantly.
          </p>
        </div>

        <form onSubmit={verifyCode} className="space-y-4">
          <div>
            <label htmlFor="code" className="mb-1 block font-mono text-[10px] uppercase tracking-widest text-ww-muted">
              {CODE_LENGTH}-digit code
            </label>
            <Input
              id="code"
              name="code"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              pattern="[0-9]*"
              maxLength={CODE_LENGTH}
              required
              value={code}
              onChange={(e) => {
                setCode(e.target.value.replace(/\D/g, "").slice(0, CODE_LENGTH));
                setError("");
              }}
              placeholder="000000"
              className="bg-warm-white border-ww-border text-center font-mono text-2xl tracking-[0.5em]"
            />
          </div>

          {error && <p className="font-mono text-xs text-rust">{error}</p>}

          <RustButton type="submit" size="md" block disabled={loading || code.length !== CODE_LENGTH}>
            {loading ? "Verifying…" : "Verify & continue"}
          </RustButton>
        </form>

        <div className="flex items-center justify-between border-t border-ww-border pt-3 font-mono text-[11px] text-ww-muted">
          <button
            type="button"
            onClick={() => { setStep("email"); setCode(""); setError(""); }}
            className="hover:text-ink"
          >
            ← Wrong email?
          </button>
          <button
            type="button"
            onClick={() => { setCode(""); setError(""); sendCode(); }}
            disabled={loading || resendIn > 0}
            className="disabled:opacity-40 hover:text-ink"
          >
            {resendIn > 0 ? `Resend in ${resendIn}s` : "Resend code"}
          </button>
        </div>
      </div>
    );
  }

  // ─── Render: email-entry step ───────────────────────────────────────
  return (
    <div className="space-y-4">
      {declaration && (
        <label className="flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            checked={declared}
            onChange={(e) => setDeclared(e.target.checked)}
            className="mt-0.5 h-4 w-4 shrink-0 accent-rust"
          />
          <span className="text-xs leading-relaxed text-ink/70">{declaration}</span>
        </label>
      )}

      <form onSubmit={sendCode} className="space-y-4">
        <div>
          <label htmlFor="email" className="mb-1 block font-mono text-[10px] uppercase tracking-widest text-ww-muted">
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
            autoComplete="email"
          />
          <p className="mt-1.5 font-mono text-[10px] leading-relaxed text-ww-muted">
            We&apos;ll email you a 6-digit code. No password needed.
          </p>
        </div>

        {error && <p className="font-mono text-xs text-rust">{error}</p>}

        <RustButton type="submit" size="md" block disabled={loading || !email || !declared}>
          {loading
            ? "Sending…"
            : emailVerb === "send_link"
              ? `${primaryLabel} with email`
              : `${primaryLabel} with email code`}
        </RustButton>

        {postSendNote && (
          <p className="text-center font-mono text-[10px] leading-relaxed text-ww-muted">
            {postSendNote}
          </p>
        )}
      </form>

      <div className="relative my-2 flex items-center">
        <span className="flex-1 border-t border-ww-border" />
        <span className="px-3 font-mono text-[10px] uppercase tracking-widest text-ww-muted">or</span>
        <span className="flex-1 border-t border-ww-border" />
      </div>

      <button
        type="button"
        onClick={googleSignIn}
        disabled={loading || !declared}
        className="flex w-full items-center justify-center gap-2 border border-ww-border bg-warm-white px-4 py-2.5 font-mono text-xs text-ink transition-colors hover:border-ink disabled:opacity-40"
      >
        <GoogleGlyph />
        Continue with Google
      </button>

      {bottomNote && (
        <div className="border-t border-ww-border pt-3 text-center font-mono text-[11px] text-ww-muted">
          {bottomNote}
        </div>
      )}
    </div>
  );
}

function GoogleGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  );
}

function prettyError(raw: string): string {
  const lower = raw.toLowerCase();
  if (lower.includes("rate limit")) return "Too many attempts. Please wait a minute and try again.";
  if (lower.includes("token") || lower.includes("expired") || lower.includes("invalid"))
    return "That code is wrong or expired. Try requesting a new one.";
  if (lower.includes("network")) return "Network error. Check your connection and retry.";
  return raw;
}
