"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function createPost(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not logged in" };

  const content = (formData.get("content") as string)?.trim();
  const title = (formData.get("title") as string)?.trim();
  const tab = formData.get("tab") as string;
  const destination = (formData.get("destination") as string) || null;

  if (!title || title.length < 5) return { error: "Title too short (min 5 chars)" };
  if (title.length > 120) return { error: "Title too long (max 120 chars)" };
  if (!content || content.length < 10) return { error: "Post too short" };

  const id = `post-${tab}-${Date.now()}`;

  const imageUrlsRaw = formData.get("image_urls") as string;
  const imageUrls = imageUrlsRaw ? JSON.parse(imageUrlsRaw) : [];

  const { error } = await supabase.from("community_posts").insert({
    id,
    tab,
    title,
    author_id: user.id,
    author_name: user.email?.split("@")[0] ?? "Anonymous",
    content,
    destination,
    image_urls: imageUrls,
    status: "pending",
  });

  if (error) return { error: error.message };
  revalidatePath("/community");
  return { success: true };
}

export async function togglePostHelpful(postId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not logged in" };

  const { data: existing } = await supabase
    .from("community_post_helpful")
    .select("post_id")
    .eq("post_id", postId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (existing) {
    await supabase.from("community_post_helpful").delete().eq("post_id", postId).eq("user_id", user.id);
    const { data: post } = await supabase.from("community_posts").select("like_count").eq("id", postId).single();
    const newCount = Math.max(0, (post?.like_count ?? 1) - 1);
    await supabase.from("community_posts").update({ like_count: newCount }).eq("id", postId);
    revalidatePath("/community");
    return { liked: false, count: newCount };
  }

  await supabase.from("community_post_helpful").insert({ post_id: postId, user_id: user.id });
  const { data: post } = await supabase.from("community_posts").select("like_count").eq("id", postId).single();
  const newCount = (post?.like_count ?? 0) + 1;
  await supabase.from("community_posts").update({ like_count: newCount }).eq("id", postId);
  revalidatePath("/community");
  return { liked: true, count: newCount };
}

export async function reportPost(postId: string, reason: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not logged in" };

  const { error } = await supabase.from("community_post_reports").insert({
    post_id: postId,
    reporter_id: user.id,
    reason: reason.slice(0, 200),
  });
  if (error) return { error: error.message };

  await supabase.from("community_posts").update({ status: "reported" }).eq("id", postId);
  revalidatePath("/community");
  return { success: true };
}

export async function toggleBewareHelpful(reportId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not logged in" };

  const { data: existing } = await supabase
    .from("beware_helpful")
    .select("report_id")
    .eq("report_id", reportId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (existing) {
    await supabase.from("beware_helpful").delete().eq("report_id", reportId).eq("user_id", user.id);
    const { data: report } = await supabase.from("beware_reports").select("helpful_count").eq("id", reportId).single();
    const newCount = Math.max(0, (report?.helpful_count ?? 1) - 1);
    await supabase.from("beware_reports").update({ helpful_count: newCount }).eq("id", reportId);
    return { liked: false, count: newCount };
  }

  await supabase.from("beware_helpful").insert({ report_id: reportId, user_id: user.id });
  const { data: report } = await supabase.from("beware_reports").select("helpful_count").eq("id", reportId).single();
  const newCount = (report?.helpful_count ?? 0) + 1;
  await supabase.from("beware_reports").update({ helpful_count: newCount }).eq("id", reportId);
  return { liked: true, count: newCount };
}

export async function reportBeware(reportId: string, reason: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not logged in" };

  const { error } = await supabase.from("beware_report_flags").insert({
    report_id: reportId,
    reporter_id: user.id,
    reason: reason.slice(0, 200),
  });
  if (error) return { error: error.message };
  return { success: true };
}
