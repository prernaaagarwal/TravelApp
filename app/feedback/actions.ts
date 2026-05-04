"use server";

import { createClient } from "@/lib/supabase/server";

const VALID_BROUGHT_YOU = new Set(["planning", "research", "recommended", "other"]);

export type FeedbackPayload = {
  whatBroughtYou?: string;
  preparedScore?: number;
  likedMost?: string;
  frustrated?: string;
  confusing?: string;
  missing?: string;
  nps?: number;
  followUpEmail?: string;
};

export async function submitFeedback(
  payload: FeedbackPayload,
): Promise<{ ok: true } | { ok: false; error: string }> {
  // Lightweight validation — the DB check constraints will catch the rest.
  const what = payload.whatBroughtYou?.trim();
  if (what && !VALID_BROUGHT_YOU.has(what)) {
    return { ok: false, error: "Pick one of the listed options." };
  }
  if (
    payload.preparedScore != null &&
    (payload.preparedScore < 1 || payload.preparedScore > 5)
  ) {
    return { ok: false, error: "Score must be 1–5." };
  }
  if (payload.nps != null && (payload.nps < 0 || payload.nps > 10)) {
    return { ok: false, error: "NPS must be 0–10." };
  }

  const email = payload.followUpEmail?.trim() || null;
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, error: "Enter a valid email or leave it blank." };
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { error } = await supabase.from("feedback").insert({
    user_id: user?.id ?? null,
    source: "founding-feedback",
    what_brought_you: what || null,
    prepared_score: payload.preparedScore ?? null,
    liked_most: payload.likedMost?.trim() || null,
    frustrated: payload.frustrated?.trim() || null,
    confusing: payload.confusing?.trim() || null,
    missing: payload.missing?.trim() || null,
    nps: payload.nps ?? null,
    follow_up_email: email,
  });

  if (error) {
    return { ok: false, error: error.message };
  }
  return { ok: true };
}
