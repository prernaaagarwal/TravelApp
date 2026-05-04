"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

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

  const { error } = await supabase
    .from("beware_reports")
    .update(update)
    .eq("id", reportId)
    .eq("status", "pending");

  if (error) throw new Error(error.message);

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
