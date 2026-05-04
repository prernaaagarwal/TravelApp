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

        <MembershipForm defaultEmail={user.email ?? ""} />
      </div>
    </main>
  );
}
