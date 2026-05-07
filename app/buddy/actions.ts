"use server";

import { createClient } from "@/lib/supabase/server";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";
import { assertVerified } from "@/lib/buddy-verification";
import { sendHelloReceived, sendHelloAccepted } from "@/lib/email";
import { env } from "@/lib/config";
import { CITY_LABELS } from "@/lib/constants";
import { formatDestinationSlug } from "@/lib/utils";

export async function registerBuddyTrip(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not logged in" };

  const destinationSlug = formData.get("destination_slug") as string;
  const firstName = formData.get("first_name") as string;
  if (!destinationSlug || !firstName) return { error: "Destination and name are required" };

  const styles = formData.getAll("style") as string[];

  const { error } = await supabase.from("buddy_matches").upsert({
    user_id: user.id,
    first_name: firstName,
    age_range: (formData.get("age_range") as string) || null,
    home_city: (formData.get("home_city") as string) || null,
    destination_slug: destinationSlug,
    travel_start: (formData.get("travel_start") as string) || null,
    travel_end: (formData.get("travel_end") as string) || null,
    budget_range: (formData.get("budget_range") as string) || null,
    travel_style: styles,
    instagram_verified: false,
  }, { onConflict: "user_id" });

  if (error) return { error: error.message };
  revalidatePath("/buddy");
  return { success: true };
}

function destinationLabelFor(slug: string): string {
  return CITY_LABELS[slug] ?? formatDestinationSlug(slug);
}

export async function sendConnection(matchId: string, message?: string) {
  let userId: string;
  try {
    ({ userId } = await assertVerified());
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Verification required." };
  }

  const trimmed = message?.trim() ?? "";
  if (trimmed.length > 280) {
    return { error: "Message must be 280 characters or fewer." };
  }
  const messageToStore = trimmed.length > 0 ? trimmed : null;

  const supabase = await createClient();
  // Insert the connection. ON CONFLICT (from_user_id, to_match_id) is enforced
  // by the unique index from migration 001 — duplicate hellos are silently OK.
  const { error } = await supabase.from("buddy_connections").insert({
    from_user_id: userId,
    to_match_id: matchId,
    status: "pending",
    recipient_decision: "pending",
    message: messageToStore,
  });

  if (error && error.code !== "23505") return { error: error.message };
  revalidatePath("/buddy");

  // Fire-and-forget email notification. We deliberately swallow errors here:
  // the row exists and the recipient will see the hello on /account/messages
  // even if the email is delayed or fails. We never block the action on email.
  if (!error) {
    notifyRecipientOfHello(userId, matchId).catch(() => {});
  }

  return { success: true };
}

async function notifyRecipientOfHello(senderUserId: string, toMatchId: string) {
  if (!env.SUPABASE_SERVICE_ROLE_KEY) return;
  const admin = createSupabaseClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const { data: match } = await admin
    .from("buddy_matches")
    .select("user_id, destination_slug")
    .eq("id", toMatchId)
    .single();
  if (!match) return;

  const { data: senderMatch } = await admin
    .from("buddy_matches")
    .select("first_name, home_city")
    .eq("user_id", senderUserId)
    .maybeSingle();

  const { data: userResult } = await admin.auth.admin.getUserById(match.user_id);
  const recipientEmail = userResult?.user?.email;
  if (!recipientEmail) return;

  await sendHelloReceived(recipientEmail, {
    senderFirstName: senderMatch?.first_name ?? "Someone",
    senderHomeCity: senderMatch?.home_city ?? null,
    destinationLabel: destinationLabelFor(match.destination_slug),
  });
}

// ── Recipient actions on /account/messages ─────────────────────────────────
// Both accept and decline update buddy_connections.recipient_decision via the
// recipient-side RLS policy added in migration 052. Accept also notifies the
// sender so they can come back and see the unlocked first_name + home_city.

async function loadConnectionAsRecipient(connectionId: string, userId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("buddy_connections")
    .select("id, from_user_id, to_match_id, recipient_decision, buddy_matches!inner(user_id, destination_slug)")
    .eq("id", connectionId)
    .single();
  if (error || !data) return { error: "Hello not found." };
  // Type narrow — the !inner join means buddy_matches is not null.
  const match = (data as unknown as { buddy_matches: { user_id: string; destination_slug: string } }).buddy_matches;
  if (match.user_id !== userId) return { error: "You can only respond to hellos sent to you." };
  return { connection: data, match };
}

export async function acceptHello(connectionId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Please sign in." };

  const loaded = await loadConnectionAsRecipient(connectionId, user.id);
  if ("error" in loaded) return loaded;
  if (loaded.connection.recipient_decision !== "pending") {
    return { error: "You've already responded to this hello." };
  }

  const { error } = await supabase
    .from("buddy_connections")
    .update({ recipient_decision: "accepted" })
    .eq("id", connectionId);
  if (error) return { error: error.message };

  revalidatePath("/account/messages");

  // Notify sender. Same fire-and-forget pattern as sendConnection.
  notifySenderOfAcceptance(loaded.connection.from_user_id, user.id, loaded.match.destination_slug).catch(() => {});
  return { success: true };
}

export async function declineHello(connectionId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Please sign in." };

  const loaded = await loadConnectionAsRecipient(connectionId, user.id);
  if ("error" in loaded) return loaded;
  if (loaded.connection.recipient_decision !== "pending") {
    return { error: "You've already responded to this hello." };
  }

  const { error } = await supabase
    .from("buddy_connections")
    .update({ recipient_decision: "declined" })
    .eq("id", connectionId);
  if (error) return { error: error.message };

  revalidatePath("/account/messages");
  // Sender is intentionally NOT notified on decline — protects the recipient
  // from any social cost of saying no. The sender just sees "no response yet".
  return { success: true };
}

async function notifySenderOfAcceptance(senderUserId: string, recipientUserId: string, destinationSlug: string) {
  if (!env.SUPABASE_SERVICE_ROLE_KEY) return;
  const admin = createSupabaseClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const { data: recipientMatch } = await admin
    .from("buddy_matches")
    .select("first_name")
    .eq("user_id", recipientUserId)
    .maybeSingle();

  const { data: userResult } = await admin.auth.admin.getUserById(senderUserId);
  const senderEmail = userResult?.user?.email;
  if (!senderEmail) return;

  await sendHelloAccepted(senderEmail, {
    recipientFirstName: recipientMatch?.first_name ?? "She",
    destinationLabel: destinationLabelFor(destinationSlug),
  });
}
