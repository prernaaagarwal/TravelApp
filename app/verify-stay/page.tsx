import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ShieldCheck } from "lucide-react";
import { StayVerifyForm } from "@/components/verify/StayVerifyForm";

export const metadata = {
  title: "Verify Your Stay — Wander Women",
  description: "Paste any booking link and get an AI-powered safety analysis in seconds.",
};

export default async function VerifyStayPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/account/login?next=/verify-stay");

  // Count verifications used this month
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const { count } = await supabase
    .from("stay_verifications")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)
    .gte("created_at", startOfMonth.toISOString());

  const usedThisMonth = count ?? 0;

  return (
    <main className="mx-auto max-w-2xl px-4 py-10 md:py-16">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 rounded-full bg-sage-light px-3 py-1 text-xs font-medium text-sage mb-4">
          <ShieldCheck className="h-3.5 w-3.5" />
          AI Safety Check
        </div>
        <h1 className="font-serif text-3xl md:text-4xl text-ink mb-3">
          Is this stay safe?
        </h1>
        <p className="text-ww-muted leading-relaxed">
          Paste any booking link — Airbnb, Booking.com, Agoda, MakeMyTrip, or others.
          We&apos;ll run a safety and scam analysis tuned for solo women travellers.
        </p>
      </div>

      <div className="rounded-2xl border border-ww-border bg-warm-white p-6 shadow-sm">
        <StayVerifyForm usedThisMonth={usedThisMonth} />
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3 text-center">
        {[
          { label: "Scam patterns", desc: "Platform-specific fraud signals" },
          { label: "Authenticity check", desc: "Fake listing red flags" },
          { label: "Neighbourhood safety", desc: "Solo travel risk context" },
        ].map((item) => (
          <div key={item.label} className="rounded-xl border border-ww-border p-4">
            <p className="text-sm font-medium text-ink mb-1">{item.label}</p>
            <p className="text-xs text-ww-muted">{item.desc}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
