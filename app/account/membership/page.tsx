import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import MembershipForm from "./MembershipForm";

export const metadata = { title: "Founding 200 — Wander Women" };

export default async function MembershipPage() {
  // Founding membership is for signed-in users only. If anonymous, route them
  // through signup first and bring them back here when their account exists.
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect("/account/signup?next=/account/membership");
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
          {/* Plain-English framing — the FIRST thing a new user reads */}
          <div className="mb-6 border border-sage/30 bg-sage-light px-4 py-3">
            <p className="mb-1 font-mono text-[10px] uppercase tracking-[0.2em] text-sage">
              In beta · This is free
            </p>
            <p className="font-mono text-xs leading-relaxed text-ink">
              No payment now. No payment when we exit beta — founding members
              lock in the rate for life. Sign up, we&apos;ll WhatsApp you in
              48 hours to confirm your spot.
            </p>
          </div>

          <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-rust">
            Founding 200 ·{" "}
            <span className="text-ww-muted/60 line-through">₹499 / year</span>{" "}
            <span className="not-italic text-sage">free in beta</span>
          </p>
          <h1 className="font-serif text-3xl text-ink mb-3 sm:text-4xl">
            Join before the doors close.
          </h1>
          <p className="text-sm text-ww-muted leading-relaxed mb-6">
            The first 200 women get founding membership for life. While we&apos;re
            building this, it&apos;s free — and your honest feedback shapes it.
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

        <MembershipForm defaultEmail={user.email ?? ""} />
      </div>
    </main>
  );
}
