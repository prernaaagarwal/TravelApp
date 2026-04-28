import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/account/login?next=/account/profile");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const tier = profile?.membership_tier ?? "free";

  async function signOut() {
    "use server";
    const supabase = await createClient();
    await supabase.auth.signOut();
    redirect("/");
  }

  return (
    <main className="min-h-screen bg-sand px-4 py-12">
      <div className="mx-auto max-w-lg">
        <div className="mb-8">
          <Link href="/" className="text-sm text-ww-muted hover:text-ink">
            ← Back to home
          </Link>
        </div>

        <div className="bg-warm-white border border-ww-border rounded-xl p-6 shadow-sm space-y-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="font-serif text-2xl text-ink">My account</h1>
              <p className="text-sm text-ww-muted mt-1">{user.email}</p>
            </div>
            <Badge
              className={
                tier === "founding"
                  ? "bg-gold/20 text-gold border-gold/30"
                  : "bg-ww-border text-ww-muted"
              }
            >
              {tier === "founding" ? "Founding member" : "Free"}
            </Badge>
          </div>

          {tier === "free" && (
            <div className="rounded-lg bg-rust/5 border border-rust/20 p-4">
              <p className="text-sm text-ink font-medium mb-1">
                Upgrade to Founding membership
              </p>
              <p className="text-xs text-ww-muted mb-3">
                Unlock premium intel cards, early features, and support the
                community you love.
              </p>
              <Button asChild size="sm" className="bg-rust text-warm-white hover:bg-rust/90">
                <Link href="/account/membership">Join the Founding 200 →</Link>
              </Button>
            </div>
          )}

          {profile?.segment && (
            <div>
              <p className="text-xs uppercase tracking-wider text-ww-muted mb-2">
                Your travel profile
              </p>
              <div className="space-y-1 text-sm text-ink">
                {profile.segment.tripCount && (
                  <p>Trips taken: {profile.segment.tripCount}</p>
                )}
                {profile.segment.destination && (
                  <p>Next destination: {profile.segment.destination}</p>
                )}
              </div>
            </div>
          )}

          <div className="pt-2 border-t border-ww-border">
            <form action={signOut}>
              <Button
                type="submit"
                variant="ghost"
                size="sm"
                className="text-ww-muted hover:text-rust"
              >
                Sign out
              </Button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
