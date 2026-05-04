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
            Founding 200 ·{" "}
            <span className="text-ww-muted/60 line-through">₹499 / year</span>{" "}
            <span className="not-italic text-sage">free in beta</span>
          </p>
          <h1 className="font-serif text-4xl text-ink mb-3">
            Join before the doors close.
          </h1>
          <p className="text-sm text-ww-muted leading-relaxed mb-4">
            The first 200 women get founding membership for life. While we&apos;re
            building this, it&apos;s free — and your honest feedback shapes it.
          </p>

          {/* Beta disclaimer */}
          <div className="mb-6 border border-sage/30 bg-sage-light px-4 py-3">
            <p className="mb-1 font-mono text-[10px] uppercase tracking-[0.2em] text-sage">
              Beta · No payment required
            </p>
            <p className="font-mono text-xs leading-relaxed text-ink">
              We&apos;re currently in beta. Founding members get everything
              free right now while we build — we just need your honest views,
              feedback, and what you&apos;d want next. Pricing kicks in only
              after we exit beta, and your founding rate is locked in for life.
            </p>
          </div>

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

          <div className="inline-block border border-ww-border bg-warm-white px-3 py-1.5 font-mono text-[10px] text-ww-muted/70">
            <span className="line-through">₹499 / year</span> · Currently free in beta · Founding rate locked for life
          </div>
        </div>

        <MembershipForm defaultEmail={user.email ?? ""} />
      </div>
    </main>
  );
}
