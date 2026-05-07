import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { safeQuery } from "@/lib/safe-query";
import { CITY_LABELS } from "@/lib/constants";
import { formatDestinationSlug } from "@/lib/utils";
import { BuddyVerifiedBadge } from "@/components/buddy/BuddyVerifiedBadge";
import { ReportBuddyButton } from "@/components/buddy/ReportBuddyButton";
import { HelloDecisionButtons } from "@/components/buddy/HelloDecisionButtons";

export const metadata = {
  title: "Hellos — Wander Women",
  description:
    "Hellos other women have sent you on Wander Women, plus the ones you've sent. Accept or decline to keep your details private until you both consent.",
};

type ConnectionRow = {
  id: string;
  from_user_id: string;
  to_match_id: string;
  message: string | null;
  recipient_decision: "pending" | "accepted" | "declined";
  created_at: string;
};
type MyMatchRow = { id: string; user_id: string };
type SenderMatchRow = {
  user_id: string;
  first_name: string | null;
  age_range: string | null;
  home_city: string | null;
  destination_slug: string;
  travel_start: string | null;
  travel_end: string | null;
};
type RecipientMatchRow = {
  id: string;
  user_id: string;
  first_name: string | null;
  age_range: string | null;
  home_city: string | null;
  destination_slug: string;
};
type ProfileFlagRow = { id: string; id_verified: boolean; is_paused: boolean; is_banned: boolean };

function destinationLabel(slug: string): string {
  return CITY_LABELS[slug] ?? formatDestinationSlug(slug);
}

export default async function MessagesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/account/login?next=/account/messages");

  // The recipient's buddy_match row — needed to find hellos sent TO them.
  const myMatch = await safeQuery<MyMatchRow | null>(
    supabase.from("buddy_matches").select("id, user_id").eq("user_id", user.id).maybeSingle(),
    null,
    1500,
    "messages.myMatch",
  );

  // Hellos sent TO me (only if I have a buddy_match row).
  const received = myMatch
    ? await safeQuery<ConnectionRow[]>(
        supabase
          .from("buddy_connections")
          .select("id, from_user_id, to_match_id, message, recipient_decision, created_at")
          .eq("to_match_id", myMatch.id)
          .order("created_at", { ascending: false }),
        [],
        1500,
        "messages.received",
      )
    : [];

  // Hellos I've sent.
  const sent = await safeQuery<ConnectionRow[]>(
    supabase
      .from("buddy_connections")
      .select("id, from_user_id, to_match_id, message, recipient_decision, created_at")
      .eq("from_user_id", user.id)
      .order("created_at", { ascending: false }),
    [],
    1500,
    "messages.sent",
  );

  // Lookup tables: sender match info for received, recipient match info for sent.
  const senderUserIds = Array.from(new Set(received.map((r) => r.from_user_id)));
  const recipientMatchIds = Array.from(new Set(sent.map((r) => r.to_match_id)));

  const [senderMatches, recipientMatches] = await Promise.all([
    senderUserIds.length > 0
      ? safeQuery<SenderMatchRow[]>(
          supabase
            .from("buddy_matches")
            .select("user_id, first_name, age_range, home_city, destination_slug, travel_start, travel_end")
            .in("user_id", senderUserIds),
          [],
          1500,
          "messages.senderMatches",
        )
      : Promise.resolve([]),
    recipientMatchIds.length > 0
      ? safeQuery<RecipientMatchRow[]>(
          supabase
            .from("buddy_matches")
            .select("id, user_id, first_name, age_range, home_city, destination_slug")
            .in("id", recipientMatchIds),
          [],
          1500,
          "messages.recipientMatches",
        )
      : Promise.resolve([]),
  ]);

  // Profile flags for both sides — used to hide banned senders entirely and
  // to surface the verified badge on accepted hellos.
  const allProfileIds = Array.from(
    new Set([...senderUserIds, ...recipientMatches.map((r) => r.user_id)]),
  );
  const profileFlags = allProfileIds.length > 0
    ? await safeQuery<ProfileFlagRow[]>(
        supabase
          .from("profiles")
          .select("id, id_verified, is_paused, is_banned")
          .in("id", allProfileIds),
        [],
        1500,
        "messages.profileFlags",
      )
    : [];

  const senderByUserId = new Map(senderMatches.map((m) => [m.user_id, m]));
  const recipientByMatchId = new Map(recipientMatches.map((m) => [m.id, m]));
  const flagsByUserId = new Map(profileFlags.map((p) => [p.id, p]));

  // Hide hellos from banned senders entirely. Paused senders are hidden until
  // moderation resolves — recipient sees them re-appear if reinstated.
  const visibleReceived = received.filter((r) => {
    const f = flagsByUserId.get(r.from_user_id);
    return !f?.is_banned && !f?.is_paused;
  });

  const pendingReceived = visibleReceived.filter((r) => r.recipient_decision === "pending");
  const handledReceived = visibleReceived.filter((r) => r.recipient_decision !== "pending");

  return (
    <main className="min-h-screen bg-sand px-4 py-12">
      <div className="mx-auto max-w-2xl space-y-8">
        <header>
          <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-ww-muted">
            Your inbox
          </p>
          <h1 className="font-serif text-4xl text-ink">Hellos.</h1>
          <p className="mt-2 font-mono text-sm leading-relaxed text-ww-muted">
            Women you&apos;ve heard from, and the ones you&apos;ve reached out to.
            Neither side sees contact details until you both accept — take it to
            WhatsApp or Instagram from there.
          </p>
        </header>

        {/* ── Received ── */}
        <section>
          <h2 className="mb-3 font-mono text-[11px] uppercase tracking-[0.2em] text-ink">
            Received {pendingReceived.length > 0 && (
              <span className="ml-1 rounded-full bg-rust px-2 py-0.5 text-warm-white">
                {pendingReceived.length} new
              </span>
            )}
          </h2>

          {!myMatch && (
            <div className="border border-dashed border-ww-border bg-warm-white p-5">
              <p className="font-mono text-xs text-ww-muted">
                Register a trip on{" "}
                <Link href="/buddy" className="text-rust underline">
                  /buddy
                </Link>{" "}
                to start receiving hellos from women going to the same place.
              </p>
            </div>
          )}

          {myMatch && pendingReceived.length === 0 && handledReceived.length === 0 && (
            <div className="border border-dashed border-ww-border bg-warm-white p-5">
              <p className="font-mono text-xs text-ww-muted">
                No hellos yet. We&apos;ll email you the moment someone reaches out.
              </p>
            </div>
          )}

          <div className="space-y-3">
            {pendingReceived.map((r) => {
              const sender = senderByUserId.get(r.from_user_id);
              const flags = flagsByUserId.get(r.from_user_id);
              return (
                <article key={r.id} className="border border-ww-border bg-warm-white p-5">
                  <div className="flex flex-wrap items-baseline gap-2">
                    <h3 className="font-serif text-2xl text-ink">
                      {sender?.first_name ?? "Someone"}
                    </h3>
                    {flags?.id_verified && <BuddyVerifiedBadge />}
                  </div>
                  <p className="font-mono text-xs text-ww-muted">
                    {sender?.age_range && `${sender.age_range} · `}
                    {sender?.home_city && `${sender.home_city} · `}
                    Trip: {destinationLabel(sender?.destination_slug ?? "")}
                  </p>
                  {(sender?.travel_start || sender?.travel_end) && (
                    <p className="mt-1 font-mono text-[10px] text-ww-muted">
                      {sender?.travel_start} {sender?.travel_end ? `→ ${sender.travel_end}` : ""}
                    </p>
                  )}
                  {r.message ? (
                    <blockquote className="mt-3 border-l-2 border-rust bg-sand px-4 py-3 font-serif text-base italic leading-relaxed text-ink">
                      &ldquo;{r.message}&rdquo;
                    </blockquote>
                  ) : (
                    <p className="mt-3 font-mono text-[11px] italic text-ww-muted">
                      She sent a wave (no message).
                    </p>
                  )}
                  <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-ww-border pt-4">
                    <HelloDecisionButtons connectionId={r.id} />
                    <ReportBuddyButton reportedUserId={r.from_user_id} />
                  </div>
                </article>
              );
            })}

            {handledReceived.length > 0 && (
              <details className="border border-ww-border bg-warm-white p-4">
                <summary className="cursor-pointer font-mono text-[11px] uppercase tracking-[0.2em] text-ww-muted">
                  Earlier hellos ({handledReceived.length})
                </summary>
                <div className="mt-3 space-y-3">
                  {handledReceived.map((r) => {
                    const sender = senderByUserId.get(r.from_user_id);
                    const accepted = r.recipient_decision === "accepted";
                    return (
                      <div
                        key={r.id}
                        className="flex items-center justify-between border-t border-ww-border pt-3 first:border-t-0 first:pt-0"
                      >
                        <div>
                          <p className="font-mono text-xs text-ink">
                            {sender?.first_name ?? "Someone"} ·{" "}
                            {destinationLabel(sender?.destination_slug ?? "")}
                          </p>
                          <p className="font-mono text-[10px] text-ww-muted">
                            {accepted ? "✓ Accepted" : "✕ Declined"}
                          </p>
                        </div>
                        {accepted && sender?.home_city && (
                          <p className="font-mono text-[10px] text-ww-muted">
                            {sender.home_city}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </details>
            )}
          </div>
        </section>

        {/* ── Sent ── */}
        <section>
          <h2 className="mb-3 font-mono text-[11px] uppercase tracking-[0.2em] text-ink">
            Sent
          </h2>

          {sent.length === 0 ? (
            <div className="border border-dashed border-ww-border bg-warm-white p-5">
              <p className="font-mono text-xs text-ww-muted">
                You haven&apos;t sent any hellos yet.{" "}
                <Link href="/buddy" className="text-rust underline">
                  Find a buddy →
                </Link>
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {sent.map((s) => {
                const recipient = recipientByMatchId.get(s.to_match_id);
                const flags = recipient ? flagsByUserId.get(recipient.user_id) : undefined;
                const accepted = s.recipient_decision === "accepted";
                return (
                  <article key={s.id} className="border border-ww-border bg-warm-white p-4">
                    <div className="flex flex-wrap items-baseline gap-2">
                      <h3 className="font-serif text-xl text-ink">
                        {recipient?.first_name ?? "(removed)"}
                      </h3>
                      {accepted && flags?.id_verified && <BuddyVerifiedBadge />}
                    </div>
                    <p className="font-mono text-[11px] text-ww-muted">
                      {accepted && recipient?.home_city && `${recipient.home_city} · `}
                      Trip: {destinationLabel(recipient?.destination_slug ?? "")}
                    </p>
                    <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.15em]">
                      {accepted ? (
                        <span className="text-sage">✓ Accepted — take it to your trusted channel</span>
                      ) : (
                        <span className="text-ww-muted">No response yet</span>
                      )}
                    </p>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        <p className="text-center font-mono text-[10px] text-ww-muted">
          Spotted something concerning? Use the{" "}
          <strong>Report</strong> button on any hello — we review within 24 hours.
        </p>
      </div>
    </main>
  );
}
