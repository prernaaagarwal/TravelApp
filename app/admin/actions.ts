"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

async function assertAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const adminEmail = process.env.ADMIN_EMAIL;
  if (!user || !adminEmail || user.email !== adminEmail) {
    throw new Error("Unauthorized");
  }
  return supabase;
}

export async function approvePost(id: string) {
  const supabase = await assertAdmin();
  await supabase.from("community_posts").update({ status: "approved" }).eq("id", id);
  revalidatePath("/admin");
  revalidatePath("/community");
}

export async function rejectPost(id: string) {
  const supabase = await assertAdmin();
  await supabase.from("community_posts").update({ status: "rejected" }).eq("id", id);
  revalidatePath("/admin");
}

export async function approveBeware(id: string) {
  const supabase = await assertAdmin();
  await supabase.from("beware_reports").update({ status: "approved" }).eq("id", id);
  revalidatePath("/admin");
  revalidatePath("/community");
}

export async function rejectBeware(id: string) {
  const supabase = await assertAdmin();
  await supabase.from("beware_reports").update({ status: "rejected" }).eq("id", id);
  revalidatePath("/admin");
}

export async function approveTrip(id: string) {
  const supabase = await assertAdmin();
  await supabase.from("trip_submissions").update({ status: "approved" }).eq("id", id);
  revalidatePath("/admin");
  revalidatePath("/feed");
}

export async function rejectTrip(id: string) {
  const supabase = await assertAdmin();
  await supabase.from("trip_submissions").update({ status: "rejected" }).eq("id", id);
  revalidatePath("/admin");
}
