"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { notifyIndexNowFireAndForget } from "@/lib/indexnow";
import { env } from "@/lib/config";

async function getModeratorId(): Promise<string> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/account/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || !["moderator", "admin"].includes(profile.role ?? "")) {
    throw new Error("Unauthorized");
  }

  return user.id;
}

export async function approveReport(
  reportId: string,
  gpsLat?: number | null,
  gpsLng?: number | null,
) {
  const moderatorId = await getModeratorId();
  const supabase = await createClient();

  const update: Record<string, unknown> = {
    status: "approved",
    reviewed_by: moderatorId,
    reviewed_at: new Date().toISOString(),
    rejection_reason: null,
  };

  if (gpsLat != null && !isNaN(gpsLat)) update.gps_lat = gpsLat;
  if (gpsLng != null && !isNaN(gpsLng)) update.gps_lng = gpsLng;

  // Use .select() so we get city_slug back for the IndexNow ping below.
  const { data: updated, error } = await supabase
    .from("beware_reports")
    .update(update)
    .eq("id", reportId)
    .eq("status", "pending")
    .select("id, city_slug")
    .single();

  if (error) throw new Error(error.message);

  // Ping IndexNow so Bing / ChatGPT-search / Yandex pick up the new
  // report within hours. Fire-and-forget so a slow IndexNow response
  // doesn't block the moderator's redirect.
  if (updated?.city_slug) {
    const siteUrl = env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
    notifyIndexNowFireAndForget([
      `${siteUrl}/community/beware/${updated.city_slug}`,
      `${siteUrl}/community/beware`,
    ]);
  }

  revalidatePath("/admin");
  redirect("/admin");
}

export async function rejectReport(reportId: string, reason: string) {
  const trimmedReason = reason.trim();
  if (trimmedReason.length < 20) {
    return { error: "Rejection reason must be at least 20 characters." };
  }

  const moderatorId = await getModeratorId();
  const supabase = await createClient();

  const { error } = await supabase
    .from("beware_reports")
    .update({
      status: "rejected",
      reviewed_by: moderatorId,
      reviewed_at: new Date().toISOString(),
      rejection_reason: trimmedReason,
    })
    .eq("id", reportId)
    .in("status", ["pending", "rejected"]);

  if (error) throw new Error(error.message);

  revalidatePath("/admin");
  redirect("/admin");
}
