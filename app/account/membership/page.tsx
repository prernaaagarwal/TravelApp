import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import MembershipForm from "./MembershipForm";

export const metadata = { title: "Founding 200 — Wander Women" };

export default async function MembershipPage() {
  // Pricing + benefits are shown to anyone (the page is linked from marketing
  // surfaces). Only the claim action requires an account — anonymous visitors
  // see a sign-up CTA in place of the form.
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

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
          {/* Plain-English framing — the FIRST thing a new user reads */}
          <div className="mb-6 border border-sage/30 bg-sage-light px-4 py-3">
            <p className="mb-1 font-mono text-[10px] uppercase tracking-[0.2em] text-sage">
              In beta · No payment processing yet
            </p>
            <p className="font-mono text-xs leading-relaxed text-ink">
              Pay nothing now. When payment opens, founding members lock at
              ₹999/year for life. Public price will be ₹1,999/year. Sign up,
              we&apos;ll WhatsApp you in 48 hours to confirm your spot.
            </p>
          </div>

          <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-rust">
            Founding 200 ·{" "}
            <span className="text-ink">₹999 / year locked for life</span>{" "}
            <span className="not-italic text-sage">(₹0 during beta)</span>
          </p>
          <h1 className="font-serif text-3xl text-ink mb-3 sm:text-4xl">
            Join before the doors close.
          </h1>
          <p className="text-sm text-ww-muted leading-relaxed mb-6">
            The first 200 women lock in ₹999/year for life. Pay nothing during
            beta — your honest feedback is the only ask. Public price after
            beta will be ₹1,999/year.
          </p>

          <div className="mb-4 border border-sage/40 bg-sage-light/40 px-3 py-2">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-sage">
              Safety intel is always free
            </p>
            <p className="mt-1 font-mono text-[11px] leading-relaxed text-ink">
              Scam reports, emergency numbers, female-run-stay flags, neighbourhood
              safety ratings, Beware Board, transit warnings — never paywalled,
              for anyone, ever. Membership only adds planning + discovery.
            </p>
          </div>

          <ul className="space-y-2 mb-6">
            {[
              "Itineraries, off-season hacks, and day-trip routes on every premium card",
              "Priority replies in Ask a Local Sister",
              "Buddy matching with verified profiles",
              "Saved dossiers + WhatsApp Vault access",
              "Your name in the founding member credits",
            ].map((perk) => (
              <li key={perk} className="flex items-start gap-2 text-sm text-ink">
                <span className="mt-0.5 text-sage shrink-0">✓</span>
                {perk}
              </li>
            ))}
          </ul>
        </div>

        {user ? (
          <MembershipForm defaultEmail={user.email ?? ""} />
        ) : (
          <div className="border border-ww-border bg-warm-white px-4 py-5">
            <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.2em] text-rust">
              Claim a founding spot
            </p>
            <p className="mb-4 text-sm leading-relaxed text-ink">
              Founding spots are limited to 200. Create a free account to claim
              yours — pay nothing during beta.
            </p>
            <Link
              href="/account/signup?next=/account/membership"
              className="inline-flex w-full items-center justify-center gap-2 bg-rust px-5 py-3 font-mono text-xs uppercase tracking-widest text-warm-white transition-colors hover:bg-rust/90"
            >
              Sign up to claim your spot
              <span aria-hidden>→</span>
            </Link>
            <p className="mt-3 font-mono text-[10px] uppercase tracking-widest text-ww-muted/70">
              Already a member?{" "}
              <Link
                href="/account/login?next=/account/membership"
                className="text-rust underline-offset-2 hover:underline"
              >
                Sign in
              </Link>
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
