"use client";

import { useState, useTransition } from "react";
import { sendPhoneOtp, verifyPhoneOtp } from "./actions";

export function PhoneStep({
  defaultPhone,
  onVerified,
}: {
  defaultPhone: string;
  onVerified: () => void;
}) {
  const [stage, setStage] = useState<"enter" | "verify">(
    defaultPhone ? "enter" : "enter",
  );
  const [phone, setPhone] = useState(defaultPhone);
  const [token, setToken] = useState("");
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();

  function handleSend(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const fd = new FormData();
    fd.set("phone", phone);
    startTransition(async () => {
      const res = await sendPhoneOtp(fd);
      if ("error" in res && res.error) {
        setError(res.error);
        return;
      }
      setStage("verify");
    });
  }

  function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const fd = new FormData();
    fd.set("phone", phone);
    fd.set("token", token);
    startTransition(async () => {
      const res = await verifyPhoneOtp(fd);
      if ("error" in res && res.error) {
        setError(res.error);
        return;
      }
      onVerified();
    });
  }

  return (
    <div className="rounded-2xl border border-ww-border bg-warm-white p-6">
      <p className="mb-2 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-rust">
        <span className="grid h-5 w-5 place-items-center rounded-full bg-rust text-warm-white">1</span>
        Confirm your phone
      </p>
      <p className="mb-4 font-mono text-xs leading-relaxed text-ww-muted">
        We send a 6-digit code by SMS. Your number is private — never shown on
        your profile, never shared with brands.
      </p>

      {stage === "enter" ? (
        <form onSubmit={handleSend} className="space-y-3">
          <div>
            <label
              htmlFor="phone"
              className="mb-1 block font-mono text-[10px] uppercase tracking-widest text-ww-muted"
            >
              Phone number (with country code)
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 98765 43210"
              className="w-full border border-ww-border bg-warm-white px-3 py-2 font-mono text-sm text-ink focus:border-ink focus:outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={pending}
            className="border border-rust bg-rust px-4 py-2 font-mono text-[11px] uppercase tracking-widest text-warm-white transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {pending ? "Sending…" : "Send code →"}
          </button>
        </form>
      ) : (
        <form onSubmit={handleVerify} className="space-y-3">
          <p className="font-mono text-xs text-ww-muted">
            Code sent to <span className="text-ink">{phone}</span>.{" "}
            <button
              type="button"
              onClick={() => setStage("enter")}
              className="underline hover:text-ink"
            >
              Change number
            </button>
          </p>
          <div>
            <label
              htmlFor="token"
              className="mb-1 block font-mono text-[10px] uppercase tracking-widest text-ww-muted"
            >
              6-digit code
            </label>
            <input
              id="token"
              name="token"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={6}
              required
              value={token}
              onChange={(e) => setToken(e.target.value.replace(/\D/g, ""))}
              placeholder="123456"
              className="w-40 border border-ww-border bg-warm-white px-3 py-2 font-mono text-sm tracking-widest text-ink focus:border-ink focus:outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={pending || token.length < 6}
            className="border border-rust bg-rust px-4 py-2 font-mono text-[11px] uppercase tracking-widest text-warm-white transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {pending ? "Verifying…" : "Verify code →"}
          </button>
        </form>
      )}

      {error && (
        <p className="mt-3 font-mono text-[11px] text-rust">{error}</p>
      )}
    </div>
  );
}
