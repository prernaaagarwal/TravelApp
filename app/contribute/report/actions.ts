"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function submitBewareReport(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not logged in" };

  const title = (formData.get("title") as string)?.trim();
  const description = (formData.get("description") as string)?.trim();
  if (!title || !description) return { error: "Title and description are required" };

  const gpsLat = formData.get("gps_lat") ? parseFloat(formData.get("gps_lat") as string) : null;
  const gpsLng = formData.get("gps_lng") ? parseFloat(formData.get("gps_lng") as string) : null;

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
    city: (formData.get("city") as string) || null,
    location: (formData.get("location") as string) || null,
    category: (formData.get("category") as string) || null,
    severity: (formData.get("severity") as string) || "medium",
    destination_slug: (formData.get("destination_slug") as string) || null,
    reported_by_id: user.id,
    reported_by_name: user.email?.split("@")[0] ?? "Anonymous",
    gps_lat: gpsLat,
    gps_lng: gpsLng,
    photo_urls: photoUrls,
    status: "pending",
  });

  if (error) return { error: error.message };
  redirect("/community?submitted=beware");
}
