import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { safeQuery } from "@/lib/safe-query";
import { ShieldCheck, AlertTriangle, RefreshCw } from "lucide-react";
import { SafetyReport } from "@/components/verify/SafetyReport";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import type { StayVerification } from "@/lib/agents/stay-verifier";

type StayVerificationRow = {
  status: "analyzing" | "complete" | "failed";
  property_name: string | null;
  platform: string | null;
  booking_url: string;
  analysis_json: unknown;
};

export default async function VerifyStayResultPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/account/login?next=/verify-stay");

  const row = await safeQuery<StayVerificationRow | null>(
    supabase
      .from("stay_verifications")
      .select("*")
      .eq("id", id)
      .eq("user_id", user.id)
      .single(),
    null,
    1500,
    "verifyStay.row",
  );

  if (!row) notFound();

  if (row.status === "analyzing") {
    return (
      <main className="mx-auto max-w-2xl px-4 py-10 md:py-16 text-center">
        <RefreshCw className="h-10 w-10 text-rust animate-spin mx-auto mb-4" />
        <h1 className="font-serif text-2xl text-ink mb-2">Analysing your listing…</h1>
        <p className="text-ww-muted text-sm mb-6">This usually takes 10–20 seconds. Refresh the page in a moment.</p>
        <Button asChild variant="outline" size="sm">
          <Link href={`/verify-stay/${id}`}>Refresh</Link>
        </Button>
      </main>
    );
  }

  if (row.status === "failed") {
    return (
      <main className="mx-auto max-w-2xl px-4 py-10 md:py-16 text-center">
        <AlertTriangle className="h-10 w-10 text-rust mx-auto mb-4" />
        <h1 className="font-serif text-2xl text-ink mb-2">Analysis failed</h1>
        <p className="text-ww-muted text-sm mb-6">
          We couldn&apos;t complete the analysis. This doesn&apos;t count toward your monthly limit.
        </p>
        <Button asChild size="sm" className="bg-rust text-warm-white hover:bg-rust/90">
          <Link href="/verify-stay">Try again</Link>
        </Button>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-10 md:py-16">
      <div className="mb-6">
        <div className="inline-flex items-center gap-2 rounded-full bg-sage-light px-3 py-1 text-xs font-medium text-sage mb-4">
          <ShieldCheck className="h-3.5 w-3.5" />
          Safety Analysis Complete
        </div>
        <h1 className="font-serif text-2xl md:text-3xl text-ink">
          {row.property_name ?? "Your Stay"}
        </h1>
      </div>

      <SafetyReport
        analysis={row.analysis_json as StayVerification}
        propertyName={row.property_name}
        platform={row.platform}
        bookingUrl={row.booking_url}
      />
    </main>
  );
}
