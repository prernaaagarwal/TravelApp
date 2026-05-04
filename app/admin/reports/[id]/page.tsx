import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { MapPin, ArrowLeft, Camera } from "lucide-react";
import { approveReport, rejectReport } from "./actions";

const SEVERITY_META: Record<string, { label: string; className: string }> = {
  critical: { label: "Critical", className: "bg-rust/20 text-rust border-rust/30" },
  high:     { label: "High",     className: "bg-gold/20 text-gold border-gold/30" },
  medium:   { label: "Medium",   className: "bg-blue/20 text-blue border-blue/30" },
  low:      { label: "Low",      className: "bg-sage/20 text-sage border-sage/30" },
};

export default async function ReviewReportPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/account/login");

  const { data: callerProfile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!callerProfile || !["moderator", "admin"].includes(callerProfile.role ?? "")) {
    redirect("/");
  }

  const { data: report } = await supabase
    .from("beware_reports")
    .select("*")
    .eq("id", id)
    .single();

  if (!report) notFound();

  // Submitter stats
  const { count: totalByReporter } = await supabase
    .from("beware_reports")
    .select("id", { count: "exact", head: true })
    .eq("reported_by_id", report.reported_by_id);

  const { count: approvedByReporter } = await supabase
    .from("beware_reports")
    .select("id", { count: "exact", head: true })
    .eq("reported_by_id", report.reported_by_id)
    .eq("status", "approved");

  const photos = Array.isArray(report.photo_urls)
    ? (report.photo_urls as string[])
    : [];
  const sev = SEVERITY_META[report.severity ?? "medium"] ?? SEVERITY_META.medium;
  const isPending = report.status === "pending";

  return (
    <div className="mx-auto max-w-2xl px-6 py-10">
      <div className="mb-6 flex items-center gap-3">
        <Link
          href="/admin"
          className="flex items-center gap-1 font-mono text-[10px] uppercase tracking-widest text-ww-muted hover:text-ink"
        >
          <ArrowLeft className="h-3 w-3" /> Queue
        </Link>
        <span className="font-mono text-[10px] text-ww-muted">/</span>
        <span className="font-mono text-[10px] text-ink">Review report</span>
      </div>

      {/* Status banner if already reviewed */}
      {!isPending && (
        <div
          className={`mb-6 border p-3 font-mono text-xs ${
            report.status === "approved"
              ? "border-sage/30 bg-sage/10 text-sage"
              : "border-rust/30 bg-rust/10 text-rust"
          }`}
        >
          This report was already{" "}
          <strong>{report.status}</strong>.
          {report.status === "rejected" && report.rejection_reason && (
            <span className="block mt-1 text-ww-muted">
              Reason: {report.rejection_reason}
            </span>
          )}
        </div>
      )}

      {/* Report detail */}
      <div className="space-y-4">
        <div className="border border-ww-border bg-warm-white p-6">
          <div className="mb-4 flex flex-wrap items-start gap-3">
            <span
              className={`border px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest ${sev.className}`}
            >
              {sev.label}
            </span>
            {report.city && (
              <span className="flex items-center gap-1 font-mono text-[10px] text-ww-muted">
                <MapPin className="h-3 w-3" />
                {report.city}
                {report.location && ` · ${report.location}`}
              </span>
            )}
            {report.category && (
              <span className="font-mono text-[10px] uppercase tracking-widest text-ww-muted">
                {report.category}
              </span>
            )}
          </div>

          <h2 className="mb-3 font-serif text-2xl text-ink">{report.title}</h2>

          <p className="whitespace-pre-wrap font-mono text-sm leading-relaxed text-ww-muted">
            {report.description}
          </p>

          {report.gps_lat && report.gps_lng && (
            <a
              href={`https://maps.google.com/?q=${report.gps_lat},${report.gps_lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-widest text-rust hover:underline"
            >
              <MapPin className="h-3 w-3" />
              View on Google Maps →
            </a>
          )}
        </div>

        {/* Photos */}
        {photos.length > 0 && (
          <div className="border border-ww-border bg-warm-white p-5">
            <div className="mb-3 flex items-center gap-2">
              <Camera className="h-3.5 w-3.5 text-ww-muted" />
              <span className="font-mono text-[10px] uppercase tracking-widest text-ww-muted">
                {photos.length} photo{photos.length > 1 ? "s" : ""}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {photos.map((url, i) => (
                <a key={i} href={url} target="_blank" rel="noopener noreferrer">
                  <div className="relative h-28 overflow-hidden border border-ww-border bg-sand">
                    <Image
                      src={url}
                      alt={`Photo ${i + 1}`}
                      fill
                      className="object-cover transition-opacity hover:opacity-80"
                    />
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Submitter card */}
        <div className="border border-ww-border bg-warm-white p-5">
          <p className="mb-3 font-mono text-[10px] uppercase tracking-widest text-ww-muted">
            Submitted by
          </p>
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-rust-light font-mono text-sm font-semibold text-rust">
              {(report.reported_by_name ?? "A")[0].toUpperCase()}
            </div>
            <div>
              <p className="font-mono text-sm font-semibold text-ink">
                {report.reported_by_name ?? "Anonymous"}
              </p>
              <p className="font-mono text-[10px] text-ww-muted">
                {totalByReporter ?? 0} total reports ·{" "}
                {approvedByReporter ?? 0} approved
                {(totalByReporter ?? 0) > 0 && (
                  <>
                    {" "}
                    (
                    {Math.round(
                      ((approvedByReporter ?? 0) / (totalByReporter ?? 1)) * 100,
                    )}
                    % approval rate)
                  </>
                )}
              </p>
            </div>
          </div>
          <p className="mt-3 font-mono text-[10px] text-ww-muted">
            Submitted{" "}
            {new Date(report.created_at).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "long",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>

        {/* Actions — only for pending */}
        {isPending && (
          <div className="grid gap-3 md:grid-cols-2">
            {/* Approve */}
            <form
              action={async (formData: FormData) => {
                "use server";
                const latRaw = formData.get("gps_lat") as string;
                const lngRaw = formData.get("gps_lng") as string;
                const gpsLat = latRaw ? parseFloat(latRaw) : null;
                const gpsLng = lngRaw ? parseFloat(lngRaw) : null;
                await approveReport(id, gpsLat, gpsLng);
              }}
            >
              <div className="flex flex-col gap-2">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="mb-1 block font-mono text-[9px] uppercase tracking-widest text-ww-muted">
                      Latitude
                    </label>
                    <input
                      name="gps_lat"
                      type="number"
                      step="any"
                      defaultValue={report.gps_lat ?? ""}
                      placeholder="e.g. 15.5736"
                      className="w-full border border-ww-border bg-sand px-2 py-1.5 font-mono text-xs text-ink placeholder-ww-muted/50 outline-none focus:border-sage"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block font-mono text-[9px] uppercase tracking-widest text-ww-muted">
                      Longitude
                    </label>
                    <input
                      name="gps_lng"
                      type="number"
                      step="any"
                      defaultValue={report.gps_lng ?? ""}
                      placeholder="e.g. 73.7382"
                      className="w-full border border-ww-border bg-sand px-2 py-1.5 font-mono text-xs text-ink placeholder-ww-muted/50 outline-none focus:border-sage"
                    />
                  </div>
                </div>
                <p className="font-mono text-[9px] text-ww-muted/60">
                  Right-click the spot on{" "}
                  <a
                    href="https://maps.google.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:text-ww-muted"
                  >
                    Google Maps
                  </a>{" "}
                  → &quot;What&apos;s here?&quot; to get coordinates. Leave blank to skip map pin.
                </p>
                <button
                  type="submit"
                  className="w-full bg-sage px-6 py-3 font-mono text-sm uppercase tracking-widest text-warm-white transition-opacity hover:opacity-90"
                >
                  Approve report
                </button>
              </div>
            </form>

            {/* Reject */}
            <form
              action={async (formData: FormData) => {
                "use server";
                const reason = formData.get("reason") as string;
                await rejectReport(id, reason);
              }}
            >
              <div className="flex flex-col gap-2">
                <textarea
                  name="reason"
                  required
                  minLength={20}
                  placeholder="Rejection reason (min 20 chars) — the reporter will see this."
                  rows={3}
                  className="w-full border border-ww-border bg-sand px-3 py-2 font-mono text-xs text-ink placeholder-ww-muted/60 outline-none focus:border-rust"
                />
                <button
                  type="submit"
                  className="w-full border border-rust bg-rust/10 px-6 py-3 font-mono text-sm uppercase tracking-widest text-rust transition-colors hover:bg-rust hover:text-warm-white"
                >
                  Reject report
                </button>
              </div>
            </form>
          </div>
        )}

        {!isPending && (
          <Link
            href="/admin"
            className="block border border-ww-border px-6 py-3 text-center font-mono text-sm uppercase tracking-widest text-ww-muted transition-colors hover:border-ink hover:text-ink"
          >
            ← Back to queue
          </Link>
        )}
      </div>
    </div>
  );
}
