"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

// Step 1a: send an SMS OTP to the entered number. Stores the phone on the
// pending verification row so we can match the code back on verify.
export async function sendPhoneOtp(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Please sign in first." };

  const phone = (formData.get("phone") as string | null)?.trim();
  if (!phone || phone.length < 6) return { error: "Enter a valid phone number with country code." };

  const { error } = await supabase.auth.signInWithOtp({
    phone,
    options: { shouldCreateUser: false },
  });
  if (error) return { error: error.message };

  // Stage the phone on user_verifications. Idempotent: if a row already
  // exists in pending status we update the phone, otherwise insert.
  const { error: upsertError } = await supabase
    .from("user_verifications")
    .upsert(
      { user_id: user.id, phone, status: "pending" },
      { onConflict: "user_id" },
    );
  if (upsertError) return { error: upsertError.message };

  return { success: true };
}

// Step 1b: verify the SMS OTP and stamp phone_verified_at.
export async function verifyPhoneOtp(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Please sign in first." };

  const phone = (formData.get("phone") as string | null)?.trim();
  const token = (formData.get("token") as string | null)?.trim();
  if (!phone || !token) return { error: "Enter the code we sent." };

  const { error } = await supabase.auth.verifyOtp({
    phone,
    token,
    type: "sms",
  });
  if (error) return { error: error.message };

  await supabase
    .from("user_verifications")
    .update({ phone_verified_at: new Date().toISOString() })
    .eq("user_id", user.id);

  // Persist the phone to profiles too so the rest of the app can read it.
  await supabase.from("profiles").update({ phone }).eq("id", user.id);

  revalidatePath("/account/verify");
  return { success: true };
}

// Step 2: record the uploaded ID-selfie path. Upload itself happens client-
// side via the supabase-js storage client (mirrors AvatarUpload pattern).
export async function submitIdSelfie(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Please sign in first." };

  const path = (formData.get("path") as string | null)?.trim();
  if (!path) return { error: "Upload a photo first." };
  if (!path.startsWith(`${user.id}/`)) {
    return { error: "Path mismatch." };
  }

  const { error } = await supabase
    .from("user_verifications")
    .update({
      id_photo_path: path,
      submitted_at: new Date().toISOString(),
      status: "pending",
    })
    .eq("user_id", user.id);
  if (error) return { error: error.message };

  revalidatePath("/account/verify");
  return { success: true };
}
