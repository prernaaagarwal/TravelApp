import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ReportForm } from "@/components/community/ReportForm";

export const metadata = {
  title: "Report a Scam — Wander Women",
  description: "Submit a beware report to help other solo women travelers stay safe.",
};

export default async function ReportPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/account/login?next=/contribute/report");
  }

  return (
    <main className="min-h-screen bg-sand px-4 py-12">
      <div className="mx-auto max-w-lg">
        <div className="mb-6">
          <Link href="/community" className="text-sm text-ww-muted hover:text-ink">
            ← Back to community
          </Link>
        </div>

        <div className="mb-8">
          <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-rust">
            Beware Board
          </p>
          <h1 className="font-serif text-4xl text-ink mb-3">Submit a report</h1>
          <p className="text-sm text-ww-muted leading-relaxed">
            Your report helps women traveling after you. Be specific — the more
            detail, the more useful it is. All reports are anonymous (first name
            only) after approval.
          </p>
        </div>

        <div className="bg-warm-white border border-ww-border rounded-xl p-6 shadow-sm">
          <ReportForm />
        </div>
      </div>
    </main>
  );
}
