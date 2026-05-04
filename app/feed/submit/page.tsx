import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { TripSubmitForm } from "@/components/feed/TripSubmitForm";

export const metadata = {
  title: "Submit Your Trip Receipt — Wander Women",
  description: "Log your real trip costs and help other solo women plan smarter.",
};

export default async function SubmitTripPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/account/login?next=/feed/submit");

  return (
    <div className="mx-auto max-w-xl px-6 py-12">
      <div className="mb-8">
        <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-ww-muted">
          Submit a receipt
        </p>
        <h1 className="mb-3 font-serif text-3xl text-ink">
          Log your trip costs.
        </h1>
        <p className="font-mono text-sm leading-relaxed text-ww-muted">
          Help other solo women plan smarter. Every rupee counts. Your receipt
          goes to a moderation queue and appears on the feed once approved.
        </p>
      </div>
      <TripSubmitForm />
    </div>
  );
}
