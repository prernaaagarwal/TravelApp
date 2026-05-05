import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { VerificationMethodology } from "@/components/account/VerificationMethodology";
import { VerifyClient } from "./VerifyClient";

export const metadata = {
  title: "Verify your account — Wander Women",
  description:
    "Phone + ID verification for Buddy matching. We review every submission by hand and delete the ID photo on approval.",
};

export default async function VerifyPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/account/login?next=/account/verify");

  const [{ data: profile }, { data: verification }] = await Promise.all([
    supabase.from("profiles").select("phone, id_verified").eq("id", user.id).single(),
    supabase.from("user_verifications").select("*").eq("user_id", user.id).maybeSingle(),
  ]);

  // Already verified — short-circuit with a status card and a back link.
  if (profile?.id_verified) {
    return (
      <main className="min-h-screen bg-sand px-4 py-12">
        <div className="mx-auto max-w-xl space-y-4">
          <div className="rounded-xl border border-sage/40 bg-sage-light/30 p-6 shadow-sm">
            <p className="mb-1 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-sage">
              <span aria-hidden>✓</span>
              You&apos;re verified
            </p>
            <p className="font-mono text-sm leading-relaxed text-ink">
              Phone confirmed and ID reviewed. You can send hellos on the Buddy
              page. Your ID photo has been deleted from our servers.
            </p>
            <Link
              href="/buddy"
              className="mt-4 inline-flex items-center gap-2 border border-rust bg-rust px-4 py-2 font-mono text-[11px] uppercase tracking-widest text-warm-white"
            >
              Find a buddy →
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-sand px-4 py-12">
      <div className="mx-auto max-w-xl space-y-4">
        <div className="mb-2">
          <Link
            href="/buddy"
            className="font-mono text-xs text-ww-muted hover:text-ink"
          >
            ← Back to Buddy
          </Link>
          <p className="mt-2 font-serif text-3xl text-ink">
            Verify your account
          </p>
          <p className="mt-1 font-mono text-xs leading-relaxed text-ww-muted">
            Required before you can send a hello on the Buddy page. Reading
            intel, posting in Community, and filing Beware reports don&apos;t
            require it.
          </p>
        </div>

        <VerificationMethodology />

        <VerifyClient
          userId={user.id}
          initialPhone={profile?.phone ?? ""}
          initialPhoneVerified={!!verification?.phone_verified_at}
          initialPhotoSubmitted={
            verification?.status === "pending" && !!verification?.id_photo_path
          }
        />
      </div>
    </main>
  );
}
