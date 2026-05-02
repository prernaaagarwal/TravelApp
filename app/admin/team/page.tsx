import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Shield, UserX } from "lucide-react";
import { promoteToModerator, revokeRole } from "./actions";
import { TeamSearch } from "./TeamSearch";

export default async function TeamPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/account/login");

  const { data: callerProfile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (callerProfile?.role !== "admin") redirect("/admin");

  const { data: team } = await supabase
    .from("profiles")
    .select("id, first_name, username, email, role")
    .in("role", ["moderator", "admin"])
    .order("role", { ascending: false });

  return (
    <div className="mx-auto max-w-2xl px-6 py-10">
      <div className="mb-8">
        <p className="mb-1 font-mono text-[10px] uppercase tracking-[0.2em] text-ww-muted">
          Admin only
        </p>
        <h1 className="font-serif text-3xl text-ink">Manage team</h1>
        <p className="mt-2 font-mono text-xs text-ww-muted">
          Moderators can approve and reject reports. Only admins can manage
          team members.
        </p>
      </div>

      {/* Current team */}
      <div className="mb-8">
        <p className="mb-3 font-mono text-[10px] uppercase tracking-widest text-ww-muted">
          Current team ({team?.length ?? 0})
        </p>
        <div className="space-y-2">
          {(team ?? []).map((member) => {
            const name =
              member.first_name ?? member.username ?? member.email ?? "Unknown";
            const isMe = member.id === user.id;

            return (
              <div
                key={member.id}
                className="flex items-center justify-between border border-ww-border bg-warm-white px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-rust-light font-mono text-xs font-semibold text-rust">
                    {name[0].toUpperCase()}
                  </div>
                  <div>
                    <p className="font-mono text-xs font-semibold text-ink">
                      {name}{isMe && " (you)"}
                    </p>
                    {member.username && (
                      <p className="font-mono text-[10px] text-ww-muted">
                        @{member.username}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`flex items-center gap-1 border px-2 py-0.5 font-mono text-[9px] uppercase tracking-widest ${
                      member.role === "admin"
                        ? "border-gold/30 bg-gold/10 text-gold"
                        : "border-blue/30 bg-blue/10 text-blue"
                    }`}
                  >
                    <Shield className="h-2.5 w-2.5" />
                    {member.role}
                  </span>
                  {!isMe && (
                    <form
                      action={async () => {
                        "use server";
                        await revokeRole(member.id);
                      }}
                    >
                      <button
                        type="submit"
                        title="Remove from team"
                        className="text-ww-muted transition-colors hover:text-rust"
                      >
                        <UserX className="h-4 w-4" />
                      </button>
                    </form>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add moderator search */}
      <div>
        <p className="mb-3 font-mono text-[10px] uppercase tracking-widest text-ww-muted">
          Add a moderator
        </p>
        <TeamSearch promoteAction={promoteToModerator} />
      </div>
    </div>
  );
}
