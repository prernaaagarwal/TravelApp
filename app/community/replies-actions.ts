"use server";

import { createClient } from "@/lib/supabase/server";
import { safeQuery } from "@/lib/safe-query";
import { revalidatePath } from "next/cache";
import type { SupabaseClient } from "@supabase/supabase-js";

type ProfileRow = { username: string | null; first_name: string | null };
type ContributorRow = { slug: string; name: string | null };

// A user counts as a "contributor" if their profile.username matches a row
// in the contributors table. No new role enum needed — we just reuse the
// existing contributors directory.
//
// Fail-closed on timeout: if either lookup falls back, the user is treated
// as a non-contributor and the verify mutation is denied. Better to refuse
// a legitimate verifier momentarily than to let an attacker through.
async function isContributor(
  supabase: SupabaseClient,
  userId: string,
): Promise<{ ok: boolean; name: string | null }> {
  const profile = await safeQuery<ProfileRow | null>(
    supabase.from("profiles").select("username, first_name").eq("id", userId).single(),
    null,
    1500,
    "replies.isContributor.profile",
  );
  if (!profile?.username) return { ok: false, name: null };

  const contributor = await safeQuery<ContributorRow | null>(
    supabase.from("contributors").select("slug, name").eq("slug", profile.username).maybeSingle(),
    null,
    1500,
    "replies.isContributor.contributor",
  );
  if (!contributor) return { ok: false, name: null };

  return { ok: true, name: contributor.name ?? profile.first_name ?? null };
}

export async function submitReply(
  postId: string,
  content: string,
): Promise<{ error?: string }> {
  const trimmed = (content ?? "").trim();
  if (trimmed.length < 2 || trimmed.length > 2000) {
    return { error: "Reply must be between 2 and 2000 characters." };
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Sign in to reply." };

  // Profile lookup is just for the display name on the reply card; "Community
  // member" fallback is acceptable if the lookup falls back.
  const profile = await safeQuery<{ first_name: string | null; username: string | null } | null>(
    supabase.from("profiles").select("first_name, username").eq("id", user.id).single(),
    null,
    1500,
    "replies.submitReply.profile",
  );
  const authorName = profile?.first_name ?? profile?.username ?? "Community member";

  const { error } = await supabase.from("community_replies").insert({
    post_id:     postId,
    author_id:   user.id,
    author_name: authorName,
    content:     trimmed,
  });
  if (error) return { error: "Could not post reply. Try again." };

  revalidatePath(`/community/post/${postId}`);
  return {};
}

// Pinning a verified reply: only contributors. The verified reply will sort
// to the top of the thread on next render.
export async function setReplyVerified(
  replyId: string,
  postId: string,
  verified: boolean,
): Promise<{ error?: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Sign in to verify replies." };

  const c = await isContributor(supabase, user.id);
  if (!c.ok) return { error: "Only contributors can verify replies." };

  const { error } = await supabase
    .from("community_replies")
    .update({
      is_verified:      verified,
      verified_at:      verified ? new Date().toISOString() : null,
      verified_by_id:   verified ? user.id : null,
      verified_by_name: verified ? c.name : null,
    })
    .eq("id", replyId);

  if (error) return { error: "Could not update verification. Try again." };

  revalidatePath(`/community/post/${postId}`);
  return {};
}
