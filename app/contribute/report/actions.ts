"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { submitBewareReportSchema } from "@/lib/schemas";
import { checkRateLimit, LIMITS } from "@/lib/rate-limit";
import { checkBanned } from "@/lib/ban-check";

export async function submitBewareReport(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not logged in" };

  const ban = await checkBanned(supabase, user.id);
  if (ban.banned) return { error: ban.message };

  const limit = await checkRateLimit(supabase, user.id, LIMITS.BEWARE_REPORTS);
  if (!limit.allowed) return { error: limit.message };

  const gpsLatRaw = formData.get("gps_lat");
  const gpsLngRaw = formData.get("gps_lng");

  const result = submitBewareReportSchema.safeParse({
    title:            (formData.get("title") as string)?.trim(),
    description:      (formData.get("description") as string)?.trim(),
    category:         (formData.get("category") as string) || null,
    severity:         (formData.get("severity") as string) || "medium",
    city:             (formData.get("city") as string) || null,
    location:         (formData.get("location") as string) || null,
    destination_slug: (formData.get("destination_slug") as string) || null,
    gps_lat:          gpsLatRaw ? parseFloat(gpsLatRaw as string) : null,
    gps_lng:          gpsLngRaw ? parseFloat(gpsLngRaw as string) : null,
  });
  if (!result.success) return { error: result.error.issues[0].message };

  const { title, description, category, severity, city, location, destination_slug, gps_lat, gps_lng } = result.data;

  // upload photos to storage if bucket exists
  const photoFiles = formData.getAll("photos") as File[];
  const photoUrls: string[] = [];

  for (const file of photoFiles.slice(0, 3)) {
    if (!file || file.size === 0) continue;
    const ext = file.name.split(".").pop();
    const path = `${user.id}/${crypto.randomUUID()}.${ext}`;
    const bytes = await file.arrayBuffer();
    const { data: uploaded } = await supabase.storage
      .from("beware-photos")
      .upload(path, bytes, { contentType: file.type, upsert: false });
    if (uploaded) {
      const { data: { publicUrl } } = supabase.storage.from("beware-photos").getPublicUrl(path);
      photoUrls.push(publicUrl);
    }
  }

  const { error } = await supabase.from("beware_reports").insert({
    title,
    description,
    city,
    location,
    category,
    severity,
    destination_slug,
    reported_by_id: user.id,
    reported_by_name: user.email?.split("@")[0] ?? "Anonymous",
    gps_lat,
    gps_lng,
    photo_urls: photoUrls,
    status: "pending",
  });

  if (error) return { error: error.message };
  redirect("/community?submitted=beware");
}
