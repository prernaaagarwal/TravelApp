"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { createPostSchema } from "@/lib/schemas";
import { getErrorMessage } from "@/lib/errors";

export async function createPost(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not logged in" };

  const imageUrlsRaw = formData.get("image_urls") as string;
  let imageParsed: string[] = [];
  if (imageUrlsRaw) {
    try {
      const parsed = JSON.parse(imageUrlsRaw);
      if (Array.isArray(parsed)) imageParsed = parsed;
    } catch (err) {
      return { error: getErrorMessage(err) };
    }
  }

  const result = createPostSchema.safeParse({
    title:       (formData.get("title") as string)?.trim(),
    content:     (formData.get("content") as string)?.trim(),
    tab:         formData.get("tab"),
    destination: (formData.get("destination") as string) || null,
    image_urls:  imageParsed,
  });
  if (!result.success) return { error: result.error.issues[0].message };

  const { title, content, tab, destination, image_urls } = result.data;
  const id = `post-${tab}-${crypto.randomUUID()}`;

  const { error } = await supabase.from("community_posts").insert({
    id,
    tab,
    title,
    author_id: user.id,
    author_name: user.email?.split("@")[0] ?? "Anonymous",
    content,
    destination,
    image_urls: image_urls ?? [],
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
  } else {
    await supabase.from("community_post_helpful").insert({ post_id: postId, user_id: user.id });
  }

  // Count actual junction rows — avoids read-modify-write race where two concurrent
  // taps both read the same cached number and both write the same incremented value.
  const { count } = await supabase
    .from("community_post_helpful")
    .select("*", { count: "exact", head: true })
    .eq("post_id", postId);
  const newCount = count ?? 0;
  await supabase.from("community_posts").update({ like_count: newCount }).eq("id", postId);
  revalidatePath("/community");
  return { liked: !existing, count: newCount };
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
  } else {
    await supabase.from("beware_helpful").insert({ report_id: reportId, user_id: user.id });
  }

  // Count actual junction rows — avoids read-modify-write race.
  const { count } = await supabase
    .from("beware_helpful")
    .select("*", { count: "exact", head: true })
    .eq("report_id", reportId);
  const newCount = count ?? 0;
  await supabase.from("beware_reports").update({ helpful_count: newCount }).eq("id", reportId);
  return { liked: !existing, count: newCount };
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
