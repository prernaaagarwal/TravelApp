import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

// /account/profile redirects to the canonical public profile route
export default async function OldProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/account/login?next=/settings");

  const { data: profile } = await supabase
    .from("profiles")
    .select("username")
    .eq("id", user.id)
    .single();

  redirect(`/profile/${profile?.username ?? user.id}`);
}
