"use server";

import { createClient } from "@/lib/supabase/server";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";
import {
  sendTripApproved, sendTripRejected,
  sendPostApproved, sendPostRejected,
  sendBewareApproved, sendBewareRejected,
} from "@/lib/email";

async function assertAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const adminEmail = process.env.ADMIN_EMAIL;
  if (!user || !adminEmail || user.email !== adminEmail) {
    throw new Error("Unauthorized");
  }
  return supabase;
}

// Service-role client to read auth.users emails (never exposed to browser)
function adminSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  return createSupabaseClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });
}

async function getEmail(userId: string): Promise<string | null> {
  const admin = adminSupabase();
  const { data, error } = await admin.auth.admin.getUserById(userId);
  if (error || !data.user?.email) return null;
  return data.user.email;
}

export async function approvePost(id: string) {
  const supabase = await assertAdmin();
  const { data } = await supabase.from("community_posts").select("author_id").eq("id", id).single();
  await supabase.from("community_posts").update({ status: "approved" }).eq("id", id);

  if (data?.author_id) {
    const email = await getEmail(data.author_id);
    if (email) await sendPostApproved(email);
  }

  revalidatePath("/admin");
  revalidatePath("/community");
}

export async function rejectPost(id: string) {
  const supabase = await assertAdmin();
  const { data } = await supabase.from("community_posts").select("author_id").eq("id", id).single();
  await supabase.from("community_posts").update({ status: "rejected" }).eq("id", id);

  if (data?.author_id) {
    const email = await getEmail(data.author_id);
    if (email) await sendPostRejected(email);
  }

  revalidatePath("/admin");
}

export async function approveBeware(id: string) {
  const supabase = await assertAdmin();
  const { data } = await supabase.from("beware_reports").select("reported_by_id").eq("id", id).single();
  await supabase.from("beware_reports").update({ status: "approved" }).eq("id", id);

  if (data?.reported_by_id) {
    const email = await getEmail(data.reported_by_id);
    if (email) await sendBewareApproved(email);
  }

  revalidatePath("/admin");
  revalidatePath("/community");
}

export async function rejectBeware(id: string) {
  const supabase = await assertAdmin();
  const { data } = await supabase.from("beware_reports").select("reported_by_id").eq("id", id).single();
  await supabase.from("beware_reports").update({ status: "rejected" }).eq("id", id);

  if (data?.reported_by_id) {
    const email = await getEmail(data.reported_by_id);
    if (email) await sendBewareRejected(email);
  }

  revalidatePath("/admin");
}

export async function approveTrip(id: string) {
  const supabase = await assertAdmin();
  const { data } = await supabase.from("trip_submissions").select("user_id").eq("id", id).single();
  await supabase.from("trip_submissions").update({ status: "approved" }).eq("id", id);

  if (data?.user_id) {
    const email = await getEmail(data.user_id);
    if (email) await sendTripApproved(email);
  }

  revalidatePath("/admin");
  revalidatePath("/feed");
}

export async function rejectTrip(id: string) {
  const supabase = await assertAdmin();
  const { data } = await supabase.from("trip_submissions").select("user_id").eq("id", id).single();
  await supabase.from("trip_submissions").update({ status: "rejected" }).eq("id", id);

  if (data?.user_id) {
    const email = await getEmail(data.user_id);
    if (email) await sendTripRejected(email);
  }

  revalidatePath("/admin");
}
