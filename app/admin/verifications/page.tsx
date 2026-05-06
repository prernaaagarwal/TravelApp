import { createClient } from "@/lib/supabase/server";
import { VerificationRow } from "./VerificationRow";

export const metadata = { title: "Verifications — Admin" };

export default async function AdminVerificationsPage() {
  const supabase = await createClient();

  const { data: pending } = await supabase
    .from("user_verifications")
    .select("*, profile:profiles!user_verifications_user_id_fkey(first_name, username)")
    .eq("status", "pending")
    .order("submitted_at", { ascending: true });

  // Pre-sign URLs for the ID photos so the moderator can view them.
  const rows = await Promise.all(
    (pending ?? []).map(async (row) => {
      let signedUrl: string | null = null;
      if (row.id_photo_path) {
        const { data: signed } = await supabase.storage
          .from("id-verification")
          .createSignedUrl(row.id_photo_path, 60 * 5); // 5 minutes
        signedUrl = signed?.signedUrl ?? null;
      }
      const profile = row.profile as { first_name: string | null; username: string | null } | null;
      return { row, signedUrl, profile };
    }),
  );

  return (
    <div className="px-6 py-8">
      <header className="mb-6">
        <h1 className="font-serif text-3xl text-ink">Pending verifications</h1>
        <p className="mt-1 font-mono text-xs text-ww-muted">
          24-hour SLA. On approve we set <code>id_verified=true</code> and
          delete the photo from Storage.
        </p>
      </header>

      {rows.length === 0 ? (
        <div className="rounded-xl border border-dashed border-ww-border bg-warm-white p-8 text-center">
          <p className="font-mono text-sm text-ww-muted">
            No pending verifications. Inbox zero.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {rows.map(({ row, signedUrl, profile }) => (
            <VerificationRow
              key={row.user_id}
              userId={row.user_id}
              phone={row.phone}
              phoneVerifiedAt={row.phone_verified_at}
              submittedAt={row.submitted_at}
              signedUrl={signedUrl}
              firstName={profile?.first_name ?? null}
              username={profile?.username ?? null}
            />
          ))}
        </div>
      )}
    </div>
  );
}
