import { createClient } from "@/lib/supabase/server";

// ── Single source of truth for the verification methodology copy ────────────
// Used by VerificationMethodology.tsx, the verify page, and any future surface
// that wants to explain what "verified" means. Editing the copy here updates
// it everywhere.
export const VERIFICATION_METHODOLOGY = {
  shortLabel: "phone + ID verified",
  paragraph:
    "Verified means: we confirm a working phone number on file, then a member of our team reviews a photo of your government ID alongside a selfie. The ID photo is deleted from our servers the moment your account is approved — we keep only the verified flag, the reviewer's name, and the date.",
  scope:
    "Verification covers Buddy matches only. Reading intel, posting in Community, and filing a Beware report don't require it.",
} as const;

// ── Server helper used by /buddy/sendConnection + /buddy/report-actions ─────
// Throws a plain Error if the caller is not signed-in or not id_verified.
// Catch the error in the calling action and return { error: e.message } —
// the UI is responsible for routing the user to /account/verify.
export async function assertVerified(): Promise<{ userId: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Please sign in.");

  const { data: profile } = await supabase
    .from("profiles")
    .select("id_verified, is_paused, is_banned")
    .eq("id", user.id)
    .single();

  if (!profile) throw new Error("Profile not found.");
  if (profile.is_banned) throw new Error("Your account is suspended.");
  if (profile.is_paused) throw new Error("Your account is paused pending review.");
  if (!profile.id_verified) {
    throw new Error("Verify your account to send hellos. Visit /account/verify.");
  }
  return { userId: user.id };
}

// ── Light-weight read used by server components that need to gate UI ────────
// Returns null if not signed in.
export async function getVerificationStatus(): Promise<{
  userId: string;
  idVerified: boolean;
  isPaused: boolean;
  isBanned: boolean;
} | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("id_verified, is_paused, is_banned")
    .eq("id", user.id)
    .single();

  return {
    userId: user.id,
    idVerified: profile?.id_verified ?? false,
    isPaused: profile?.is_paused ?? false,
    isBanned: profile?.is_banned ?? false,
  };
}
