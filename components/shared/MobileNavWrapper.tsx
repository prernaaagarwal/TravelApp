import { createClient } from "@/lib/supabase/server";
import { MobileNav } from "./MobileNav";

export async function MobileNavWrapper() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let profileSlug: string | null = null;
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("username")
      .eq("id", user.id)
      .single();
    profileSlug = profile?.username ?? user.id;
  }

  return <MobileNav profileSlug={profileSlug} />;
}
