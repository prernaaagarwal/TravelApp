import type { SupabaseClient } from "@supabase/supabase-js";

export interface BanCheckResult {
  banned:  boolean;
  message: string;
}

/**
 * Returns { banned: true } if the user has been banned by an admin.
 * Submission server actions call this before accepting any user content.
 */
export async function checkBanned(
  supabase: SupabaseClient,
  userId: string
): Promise<BanCheckResult> {
  const { data } = await supabase
    .from("profiles")
    .select("is_banned")
    .eq("id", userId)
    .single();

  if (data?.is_banned === true) {
    return {
      banned:  true,
      message: "Your account has been suspended. Contact support if you think this is a mistake.",
    };
  }

  return { banned: false, message: "" };
}
