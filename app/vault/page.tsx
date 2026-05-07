import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getSafetyPack } from "./safety-pack-actions";
import { SafetyPackForm } from "./SafetyPackForm";
import { VaultSignupForm } from "./VaultSignupForm";
import { SafetyPackBlock } from "@/components/safety/SafetyPackBlock";

/**
 * /vault — V1 Safety Pack.
 *
 * Replaced the WhatsApp-bot landing (which was a never-shipped product)
 * with the smallest version of the same promise: persisted emergency
 * contacts + trip details, downloadable as a PDF via browser print on
 * /vault/print, optionally emailed to a designated person via Resend.
 *
 * The original WhatsApp-bot waitlist (vault_signups table, VaultSignupForm)
 * lives at the bottom as a "future feature interest" capture so we don't
 * lose the demand signal we'd already collected.
 */
export const metadata = {
  title: "Safety Pack — Emergency Contacts & Trip Docs for Solo Travel",
  description:
    "One page with everything a stranger would need to help you in an emergency: contacts, stay details, insurance, blood group. Downloadable as PDF.",
};

export const dynamic = "force-dynamic";

export default async function VaultPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const pack = user ? await getSafetyPack() : null;

  return (
    <div>
      {/* ── Hero (shared SafetyPackBlock) ─────────────────── */}
      <SafetyPackBlock as="h1" />

      {/* ── Form / Sign-in CTA ───────────────────────────── */}
      <section className="px-6 py-12">
        <div className="mx-auto max-w-3xl">
          {user && pack ? (
            <SafetyPackForm initial={pack} />
          ) : (
            <div className="border border-ww-border bg-warm-white p-8 text-center">
              <p className="mb-2 font-serif text-2xl text-ink">
                Sign in to start your safety pack
              </p>
              <p className="mx-auto mb-6 max-w-md font-mono text-xs leading-relaxed text-ww-muted">
                We save your pack to your account so it&apos;s available on any
                device — and so we can email it to your backup contact if your
                phone dies mid-trip.
              </p>
              <div className="flex justify-center gap-3">
                <Link
                  href="/account/login?next=/vault"
                  className="border border-rust bg-rust px-5 py-2.5 font-mono text-xs uppercase tracking-widest text-warm-white hover:bg-rust/90"
                >
                  Sign in →
                </Link>
                <Link
                  href="/account/signup?next=/vault"
                  className="border border-ink bg-transparent px-5 py-2.5 font-mono text-xs uppercase tracking-widest text-ink hover:bg-ink hover:text-warm-white"
                >
                  Create account
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── WhatsApp bot waitlist ────────────────────────── */}
      <section className="border-t border-ww-border bg-sand px-6 py-12">
        <div className="mx-auto max-w-2xl text-center">
          <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-ww-muted">
            Coming later
          </p>
          <h2 className="mb-3 font-serif text-2xl text-ink">
            Want this as a WhatsApp bot too?
          </h2>
          <p className="mx-auto mb-6 max-w-md font-mono text-xs leading-relaxed text-ww-muted">
            Same pack, accessible from any phone by sending one WhatsApp
            message. We&apos;ll build it once enough women want it — drop your
            number and we&apos;ll let you know when it ships.
          </p>
          <div className="mx-auto max-w-md text-left">
            <VaultSignupForm />
          </div>
        </div>
      </section>
    </div>
  );
}
