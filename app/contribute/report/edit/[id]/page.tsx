import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { EditReportForm } from "./EditReportForm";

export const metadata = {
  title: "Edit Report — Wander Women",
};

export default async function EditReportPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect(`/account/login?next=/contribute/report/edit/${id}`);

  const { data: report } = await supabase
    .from("beware_reports")
    .select(
      "id, title, description, city, location, destination_slug, category, severity, status, reported_by_id",
    )
    .eq("id", id)
    .single();

  if (!report) notFound();

  // Only the original reporter can edit
  if (report.reported_by_id !== user.id) redirect("/");

  // Only rejected reports can be resubmitted
  if (report.status !== "rejected") {
    redirect(`/profile/${user.id}?tab=reports`);
  }

  return (
    <main className="min-h-screen bg-sand px-4 py-12">
      <div className="mx-auto max-w-lg">
        <div className="mb-6">
          <Link
            href={`/profile/${user.id}?tab=reports`}
            className="text-sm text-ww-muted hover:text-ink"
          >
            ← Back to my reports
          </Link>
        </div>

        <div className="mb-8">
          <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-rust">
            Revise and resubmit
          </p>
          <h1 className="mb-3 font-serif text-4xl text-ink">Edit your report</h1>
          <p className="text-sm leading-relaxed text-ww-muted">
            Address the reviewer&apos;s feedback below and resubmit. Your report
            will go back into the queue with the same ID.
          </p>
        </div>

        <div className="rounded-xl border border-ww-border bg-warm-white p-6 shadow-sm">
          <EditReportForm
            reportId={id}
            defaults={{
              title: report.title,
              description: report.description,
              city: report.city,
              location: report.location,
              destination_slug: report.destination_slug,
              category: report.category,
              severity: report.severity,
            }}
          />
        </div>
      </div>
    </main>
  );
}
