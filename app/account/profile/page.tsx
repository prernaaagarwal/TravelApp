import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { updateProfile, signOut } from "./actions";

const WORRY_LABELS: Record<string, string> = {
  safety: "Safety",
  scams: "Scams",
  loneliness: "Loneliness",
  money: "Money",
  transport: "Transport",
  stay: "Accommodation",
};

const TRIP_COUNT_LABELS: Record<string, string> = {
  "0": "No solo trips yet",
  "1-2": "1–2 trips",
  "3-5": "3–5 trips",
  "6+": "6+ trips",
};

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

  const { data: connections } = await supabase
    .from("buddy_connections")
    .select("id, status, to_match_id, created_at")
    .eq("from_user_id", user.id)
    .order("created_at", { ascending: false });

  const tier = profile?.membership_tier ?? "free";
  const displayName = profile?.first_name ?? user.email?.split("@")[0] ?? "W";
  const initial = displayName[0].toUpperCase();
  const memberSince = profile?.created_at
    ? new Date(profile.created_at).toLocaleDateString("en-IN", { month: "long", year: "numeric" })
    : null;

  const segment = profile?.segment as {
    tripCount?: string;
    destination?: string;
    worries?: string[];
  } | null;

  return (
    <main className="min-h-screen bg-sand px-4 py-12">
      <div className="mx-auto max-w-lg space-y-4">
        <div className="mb-6">
          <Link href="/" className="text-sm text-ww-muted hover:text-ink">
            ← Back to home
          </Link>
        </div>

        {/* Avatar + name */}
        <div className="bg-warm-white border border-ww-border rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-full bg-rust/20 flex items-center justify-center text-rust text-xl font-medium shrink-0">
              {initial}
            </div>
            <div>
              <h1 className="font-serif text-2xl text-ink">{displayName}</h1>
              <p className="text-sm text-ww-muted">{user.email}</p>
              {memberSince && (
                <p className="text-xs text-ww-muted mt-0.5">Member since {memberSince}</p>
              )}
            </div>
          </div>
        </div>

        {/* Membership */}
        <div className="bg-warm-white border border-ww-border rounded-xl p-6 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-xs uppercase tracking-wider text-ww-muted">Membership</p>
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

          {tier === "founding" && profile?.membership_expiry && (
            <p className="text-sm text-ink">
              Valid until{" "}
              {new Date(profile.membership_expiry).toLocaleDateString("en-IN", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          )}

          {tier === "free" && (
            <div className="rounded-lg bg-rust/5 border border-rust/20 p-4">
              <p className="text-sm text-ink font-medium mb-1">Upgrade to Founding membership</p>
              <p className="text-xs text-ww-muted mb-3">
                Unlock premium intel, early features, and support the community.
              </p>
              <Button asChild size="sm" className="bg-rust text-warm-white hover:bg-rust/90">
                <Link href="/account/membership">Join the Founding 200 →</Link>
              </Button>
            </div>
          )}
        </div>

        {/* Travel profile from onboarding */}
        <div className="bg-warm-white border border-ww-border rounded-xl p-6 shadow-sm space-y-3">
          <p className="text-xs uppercase tracking-wider text-ww-muted">My travel profile</p>
          {segment ? (
            <div className="space-y-2 text-sm text-ink">
              {segment.tripCount && (
                <div className="flex justify-between">
                  <span className="text-ww-muted">Solo trips taken</span>
                  <span>{TRIP_COUNT_LABELS[segment.tripCount] ?? segment.tripCount}</span>
                </div>
              )}
              {segment.destination && (
                <div className="flex justify-between">
                  <span className="text-ww-muted">Next destination</span>
                  <span className="capitalize">{segment.destination.replace(/-india|-japan|-vietnam|-thailand/, "").replace(/-/g, " ")}</span>
                </div>
              )}
              {segment.worries && segment.worries.length > 0 && (
                <div>
                  <p className="text-ww-muted mb-1">Top worries</p>
                  <div className="flex flex-wrap gap-1.5">
                    {segment.worries.map((w) => (
                      <span
                        key={w}
                        className="rounded-full bg-rust/10 text-rust text-xs px-2.5 py-0.5"
                      >
                        {WORRY_LABELS[w] ?? w}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              <Link
                href="/onboarding"
                className="block text-xs text-ww-muted underline hover:text-ink pt-1"
              >
                Update my answers
              </Link>
            </div>
          ) : (
            <div>
              <p className="text-sm text-ww-muted mb-3">
                Answer 3 quick questions to personalise your intel.
              </p>
              <Button asChild size="sm" variant="ghost" className="border border-ww-border text-ink hover:bg-sand">
                <Link href="/onboarding">Answer 3 questions →</Link>
              </Button>
            </div>
          )}
        </div>

        {/* Edit details */}
        <div className="bg-warm-white border border-ww-border rounded-xl p-6 shadow-sm space-y-4">
          <p className="text-xs uppercase tracking-wider text-ww-muted">My details</p>
          <form action={updateProfile} className="space-y-3">
            <div>
              <label htmlFor="first_name" className="block text-xs text-ww-muted mb-1">
                First name
              </label>
              <Input
                id="first_name"
                name="first_name"
                placeholder="Priya"
                defaultValue={profile?.first_name ?? ""}
                className="bg-warm-white border-ww-border text-sm"
              />
            </div>
            <div>
              <label htmlFor="home_city" className="block text-xs text-ww-muted mb-1">
                Home city
              </label>
              <Input
                id="home_city"
                name="home_city"
                placeholder="Mumbai"
                defaultValue={profile?.home_city ?? ""}
                className="bg-warm-white border-ww-border text-sm"
              />
            </div>
            <div>
              <label htmlFor="instagram" className="block text-xs text-ww-muted mb-1">
                Instagram handle <span className="text-ww-muted/60">(optional — for buddy verification)</span>
              </label>
              <Input
                id="instagram"
                name="instagram"
                placeholder="@yourhandle"
                defaultValue={profile?.instagram ?? ""}
                className="bg-warm-white border-ww-border text-sm"
              />
            </div>
            <div>
              <label htmlFor="phone" className="block text-xs text-ww-muted mb-1">
                WhatsApp number <span className="text-ww-muted/60">(optional)</span>
              </label>
              <Input
                id="phone"
                name="phone"
                placeholder="+91 98765 43210"
                defaultValue={profile?.phone ?? ""}
                className="bg-warm-white border-ww-border text-sm"
              />
            </div>
            <Button
              type="submit"
              size="sm"
              className="bg-rust text-warm-white hover:bg-rust/90"
            >
              Save details
            </Button>
          </form>
        </div>

        {/* Buddy connections */}
        <div className="bg-warm-white border border-ww-border rounded-xl p-6 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-xs uppercase tracking-wider text-ww-muted">Buddy connections</p>
            <Link href="/buddy" className="text-xs text-rust hover:underline">
              Find buddies →
            </Link>
          </div>
          {connections && connections.length > 0 ? (
            <ul className="space-y-2">
              {connections.map((c) => (
                <li key={c.id} className="flex items-center justify-between text-sm">
                  <span className="text-ink">Connection request</span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      c.status === "accepted"
                        ? "bg-sage/10 text-sage"
                        : "bg-gold/10 text-gold"
                    }`}
                  >
                    {c.status}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-ww-muted">
              No connections yet.{" "}
              <Link href="/buddy" className="underline hover:text-ink">
                Find a travel buddy
              </Link>{" "}
              to get started.
            </p>
          )}
        </div>

        {/* Sign out */}
        <div className="bg-warm-white border border-ww-border rounded-xl p-6 shadow-sm">
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
    </main>
  );
}
