import { createClient } from "@/lib/supabase/server";
import { MobileNav } from "./MobileNav";

export async function MobileNavWrapper() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return <MobileNav isLoggedIn={!!user} />;
}
