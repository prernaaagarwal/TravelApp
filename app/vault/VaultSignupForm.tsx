"use client";

import { useState } from "react";
import { submitVaultSignup } from "./actions";

const WW_WHATSAPP = process.env.NEXT_PUBLIC_WW_WHATSAPP ?? "919999999999";

export function VaultSignupForm() {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [waLink, setWaLink] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setError(null);

    const fd = new FormData(e.currentTarget);
    const result = await submitVaultSignup(fd);
    setPending(false);

    if ("error" in result && result.error) {
      setError(result.error);
      return;
    }

    const link = `https://wa.me/${WW_WHATSAPP}?text=${encodeURIComponent("vault")}`;
    setWaLink(link);
    setDone(true);
  }

  if (done) {
    return (
      <div className="space-y-4 text-center">
        <p className="text-4xl">✅</p>
        <h3 className="font-serif text-2xl text-ink">You&apos;re on the list.</h3>
        <p className="font-mono text-xs leading-relaxed text-ww-muted">
          We&apos;ve saved your details. Tap the button below to open WhatsApp
          — your first message is pre-filled. Send it and we&apos;ll set up your
          vault within 24 hours.
        </p>
        <a
          href={waLink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-[#25d366] px-6 py-3 font-mono text-xs uppercase tracking-widest text-white transition-colors hover:bg-[#1fbb58]"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className="h-4 w-4 fill-current"
          >
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          Open WhatsApp → send &ldquo;vault&rdquo;
        </a>
        <p className="font-mono text-[10px] text-ww-muted">
          Vault ready within 24 hours · ₹199 charged after setup
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input
        type="email"
        name="email"
        required
        placeholder="your@email.com"
        className="w-full border border-ink bg-warm-white px-4 py-2.5 font-mono text-sm text-ink placeholder:text-ww-muted focus:outline-none focus:ring-1 focus:ring-rust"
      />
      <input
        type="tel"
        name="phone"
        required
        placeholder="WhatsApp number (+91 98765 43210)"
        className="w-full border border-ink bg-warm-white px-4 py-2.5 font-mono text-sm text-ink placeholder:text-ww-muted focus:outline-none focus:ring-1 focus:ring-rust"
      />
      <input
        type="text"
        name="trip_destination"
        required
        placeholder="Where are you going? (e.g. Goa, Hampi)"
        className="w-full border border-ink bg-warm-white px-4 py-2.5 font-mono text-sm text-ink placeholder:text-ww-muted focus:outline-none focus:ring-1 focus:ring-rust"
      />
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="mb-1 block font-mono text-[10px] uppercase tracking-widest text-ww-muted">
            Departure
          </label>
          <input
            type="date"
            name="travel_start"
            className="w-full border border-ink bg-warm-white px-3 py-2 font-mono text-xs text-ink focus:outline-none focus:ring-1 focus:ring-rust"
          />
        </div>
        <div>
          <label className="mb-1 block font-mono text-[10px] uppercase tracking-widest text-ww-muted">
            Return
          </label>
          <input
            type="date"
            name="travel_end"
            className="w-full border border-ink bg-warm-white px-3 py-2 font-mono text-xs text-ink focus:outline-none focus:ring-1 focus:ring-rust"
          />
        </div>
      </div>
      {error && <p className="font-mono text-xs text-rust">{error}</p>}
      <button
        type="submit"
        disabled={pending}
        className="w-full border border-ink bg-ink px-5 py-2.5 font-mono text-xs uppercase tracking-widest text-warm-white transition-colors hover:bg-ink/80 disabled:opacity-50"
      >
        {pending ? "Setting up…" : "Set up vault →"}
      </button>
    </form>
  );
}
