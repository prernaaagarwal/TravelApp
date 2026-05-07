import { notFound } from "next/navigation";
import Link from "next/link";
import { AlertTriangle, ShieldAlert, ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { env, requireEnv } from "@/lib/config";
import { purgeUser } from "./actions";

export const metadata = {
  title: "Purge user — Admin",
};

export const dynamic = "force-dynamic";

type Params = Promise<{ id: string }>;
type SearchParams = Promise<{ error?: string }>;

const ERROR_LABELS: Record<string, string> = {
  bad_confirmation:
    "The confirmation phrase didn't match. You must type PURGE-{user_id} exactly.",
  unauthorized: "You must be logged in as an admin to perform this action.",
  cannot_self_purge: "You cannot purge your own account.",
  missing_user_id: "User ID was not provided.",
  purge_failed: "The purge action failed. See server logs for details.",
};

export default async function PurgeUserPage({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: SearchParams;
}) {
  const { id: userId } = await params;
  const { error: errorCode } = await searchParams;

  // Auth check — redirect to login if not signed in or not admin
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) notFound();

  const { data: actorProfile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  if (actorProfile?.role !== "admin") {
    return (
      <div className="rounded border border-rust/30 bg-rust/5 p-6">
        <h1 className="mb-2 font-serif text-xl text-ink">Forbidden</h1>
        <p className="font-mono text-sm text-ink">
          Only admins can access the purge endpoint. Moderators cannot.
        </p>
      </div>
    );
  }

  // Look up the target user — service-role to read auth.users
  const adminClient = createSupabaseClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    requireEnv("SUPABASE_SERVICE_ROLE_KEY"),
    { auth: { autoRefreshToken: false, persistSession: false } },
  );
  const { data: targetUser } = await adminClient.auth.admin.getUserById(userId);

  if (!targetUser?.user) {
    return (
      <div className="rounded border border-ww-border bg-warm-white p-6">
        <h1 className="mb-2 font-serif text-xl text-ink">User not found</h1>
        <p className="font-mono text-sm text-ww-muted">
          No user with ID <code>{userId}</code> exists. They may have already
          been purged.
        </p>
        <Link
          href="/admin/users"
          className="mt-4 inline-flex items-center gap-2 font-mono text-xs text-rust hover:text-rust/70"
        >
          <ArrowLeft className="h-3 w-3" />
          Back to users
        </Link>
      </div>
    );
  }

  const targetEmail = targetUser.user.email ?? "(no email)";
  const targetCreated = targetUser.user.created_at
    ? new Date(targetUser.user.created_at).toLocaleDateString("en-IN")
    : "—";

  // Profile data for context
  const { data: targetProfile } = await adminClient
    .from("profiles")
    .select("first_name, username, role, id_verified, membership_tier")
    .eq("id", userId)
    .single();

  const expectedConfirmation = `PURGE-${userId}`;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 border-b border-ww-border pb-4">
        <ShieldAlert className="h-5 w-5 text-rust" />
        <div>
          <h1 className="font-serif text-2xl text-ink">Purge user</h1>
          <p className="font-mono text-xs text-ww-muted">
            DPDP / GDPR right-to-erasure. One-way action.
          </p>
        </div>
      </div>

      {errorCode && ERROR_LABELS[errorCode] && (
        <div className="rounded border border-rust/40 bg-rust/10 p-4">
          <p className="font-mono text-xs text-rust">
            <strong>Error:</strong> {ERROR_LABELS[errorCode]}
          </p>
        </div>
      )}

      <div className="rounded border border-rust/30 bg-rust/5 p-6">
        <div className="mb-3 flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-rust" />
          <h2 className="font-serif text-lg text-ink">
            Read this before you click Purge
          </h2>
        </div>
        <ul className="space-y-2 font-mono text-xs leading-relaxed text-ink">
          <li>
            <strong>This is irreversible.</strong> There is no undo. The user
            cannot be restored.
          </li>
          <li>
            <strong>What gets deleted:</strong> auth.users row (cascades to
            profiles), avatars, ID-verification photos, saved destinations,
            checklists, notifications, vault signups, buddy matches, intel
            card view history, feedback, email captures.
          </li>
          <li>
            <strong>What gets anonymized (preserved as platform record):</strong>{" "}
            beware reports authored by the user, community posts and replies
            authored by the user. Authorship FK is set to NULL.
          </li>
          <li>
            <strong>What gets retained:</strong> moderation_audit_log entries
            referencing this user. The purge itself is logged.
          </li>
          <li>
            <strong>Photos in beware reports:</strong> not deleted. The
            reports are anonymized but their content remains the platform's
            record. If you need to delete photos individually, do so before
            purging.
          </li>
        </ul>
      </div>

      <div className="rounded border border-ww-border bg-warm-white p-6">
        <h2 className="mb-3 font-serif text-lg text-ink">Target account</h2>
        <dl className="grid grid-cols-2 gap-3 font-mono text-xs">
          <dt className="text-ww-muted">User ID</dt>
          <dd className="text-ink">
            <code>{userId}</code>
          </dd>
          <dt className="text-ww-muted">Email</dt>
          <dd className="text-ink">{targetEmail}</dd>
          <dt className="text-ww-muted">Created</dt>
          <dd className="text-ink">{targetCreated}</dd>
          <dt className="text-ww-muted">Username</dt>
          <dd className="text-ink">{targetProfile?.username ?? "—"}</dd>
          <dt className="text-ww-muted">First name</dt>
          <dd className="text-ink">{targetProfile?.first_name ?? "—"}</dd>
          <dt className="text-ww-muted">Role</dt>
          <dd className="text-ink">{targetProfile?.role ?? "user"}</dd>
          <dt className="text-ww-muted">ID verified</dt>
          <dd className="text-ink">
            {targetProfile?.id_verified ? "Yes" : "No"}
          </dd>
          <dt className="text-ww-muted">Membership</dt>
          <dd className="text-ink">{targetProfile?.membership_tier ?? "free"}</dd>
        </dl>
      </div>

      <form action={purgeUser} className="space-y-4 rounded border border-ww-border bg-warm-white p-6">
        <input type="hidden" name="user_id" value={userId} />

        <div>
          <label className="mb-1 block font-mono text-xs uppercase tracking-wider text-ww-muted">
            Reason (logged to audit, required)
          </label>
          <textarea
            name="reason"
            required
            rows={3}
            placeholder="e.g. DPDP right-to-erasure request received via grievance@wanderwomen.in on 2026-MM-DD, ticket #..."
            className="w-full border border-ww-border bg-sand p-3 font-mono text-xs text-ink"
          />
        </div>

        <div>
          <label className="mb-1 block font-mono text-xs uppercase tracking-wider text-ww-muted">
            Confirmation
          </label>
          <p className="mb-2 font-mono text-[10px] leading-relaxed text-ww-muted">
            Type{" "}
            <code className="bg-sand px-1.5 py-0.5 text-[11px]">
              {expectedConfirmation}
            </code>{" "}
            exactly to confirm.
          </p>
          <input
            type="text"
            name="confirmation"
            required
            placeholder={expectedConfirmation}
            className="w-full border border-ww-border bg-sand p-3 font-mono text-xs text-ink"
            autoComplete="off"
          />
        </div>

        <div className="flex items-center justify-between border-t border-ww-border pt-4">
          <Link
            href="/admin/users"
            className="font-mono text-xs text-ww-muted hover:text-ink"
          >
            Cancel
          </Link>
          <button
            type="submit"
            className="bg-rust px-4 py-2 font-mono text-xs uppercase tracking-widest text-warm-white hover:bg-rust/90"
          >
            Purge this account permanently
          </button>
        </div>
      </form>

      <p className="font-mono text-[10px] text-ww-muted">
        This endpoint exists to satisfy DPDP Act 2023 right-to-erasure
        obligations. SLA: complete within 30 days of a verified erasure
        request received via{" "}
        <Link href="/legal/grievance-officer" className="underline">
          grievance@wanderwomen.in
        </Link>
        .
      </p>
    </div>
  );
}
