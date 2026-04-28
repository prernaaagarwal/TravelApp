"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function createPost(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not logged in" };

  const content = (formData.get("content") as string)?.trim();
  const tab = formData.get("tab") as string;
  const destination = (formData.get("destination") as string) || null;

  if (!content || content.length < 10) return { error: "Post too short" };

  const id = `post-${tab}-${Date.now()}`;

  const imageUrlsRaw = formData.get("image_urls") as string;
  const imageUrls = imageUrlsRaw ? JSON.parse(imageUrlsRaw) : [];

  const { error } = await supabase.from("community_posts").insert({
    id,
    tab,
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
