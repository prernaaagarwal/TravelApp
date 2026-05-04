"use server";

import { createClient } from "@/lib/supabase/server";
import { createClient as createSupabaseClient, type SupabaseClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";
import {
  sendTripApproved, sendTripRejected,
  sendPostApproved, sendPostRejected,
  sendBewareApproved, sendBewareRejected,
} from "@/lib/email";

// ─── Types ──────────────────────────────────────────────────────────────
type ContentType = "post" | "beware" | "trip";

interface AssertedAdmin {
  supabase: SupabaseClient;
  adminId:  string;
}

// ─── Auth ───────────────────────────────────────────────────────────────
async function assertAdmin(): Promise<AssertedAdmin> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const adminEmail = process.env.ADMIN_EMAIL;
  if (!user || !adminEmail || user.email !== adminEmail) {
    throw new Error("Unauthorized");
  }
  return { supabase, adminId: user.id };
}

// Service-role client used only for reading auth.users emails. Never returned
// to the caller and never used for writes that should respect RLS.
function adminSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  return createSupabaseClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });
}

async function getEmail(userId: string): Promise<string | null> {
  const admin = adminSupabase();
  const { data, error } = await admin.auth.admin.getUserById(userId);
  if (error || !data.user?.email) return null;
  return data.user.email;
}

// ─── Audit log ──────────────────────────────────────────────────────────
async function writeAudit(
  supabase: SupabaseClient,
  actorId: string,
  action: "approve" | "reject" | "ban" | "unban",
  targetType: ContentType | "user",
  targetId: string,
  reason?: string
) {
  await supabase.from("moderation_audit_log").insert({
    actor_id:    actorId,
    action,
    target_type: targetType,
    target_id:   targetId,
    reason:      reason ?? null,
  });
}

// ─── Per-table dispatch ─────────────────────────────────────────────────
const TABLES: Record<ContentType, { table: string; userColumn: string }> = {
  post:   { table: "community_posts",   userColumn: "author_id"      },
  beware: { table: "beware_reports",    userColumn: "reported_by_id" },
  trip:   { table: "trip_submissions",  userColumn: "user_id"        },
};

function approvedNotifier(type: ContentType): (email: string) => Promise<void> {
  if (type === "post")   return sendPostApproved;
  if (type === "beware") return sendBewareApproved;
  return sendTripApproved;
}

function rejectedNotifier(type: ContentType): (email: string, reason?: string) => Promise<void> {
  if (type === "post")   return sendPostRejected;
  if (type === "beware") return sendBewareRejected;
  return sendTripRejected;
}

// ─── Single-item approve / reject ───────────────────────────────────────
async function approveOne(type: ContentType, id: string) {
  const { supabase, adminId } = await assertAdmin();
  const { table, userColumn } = TABLES[type];

  const { data: row } = await supabase.from(table).select(userColumn).eq("id", id).single();

  await supabase
    .from(table)
    .update({ status: "approved", moderated_by: adminId, moderated_at: new Date().toISOString() })
    .eq("id", id);

  await writeAudit(supabase, adminId, "approve", type, id);

  // Type assertion to access dynamic column
  const userId = (row as Record<string, string | null> | null)?.[userColumn] ?? null;
  if (userId) {
    const email = await getEmail(userId);
    if (email) await approvedNotifier(type)(email);
  }
}

async function rejectOne(type: ContentType, id: string, reason: string) {
  const { supabase, adminId } = await assertAdmin();
  const { table, userColumn } = TABLES[type];

  const { data: row } = await supabase.from(table).select(userColumn).eq("id", id).single();

  await supabase
    .from(table)
    .update({
      status:           "rejected",
      rejection_reason: reason,
      moderated_by:     adminId,
      moderated_at:     new Date().toISOString(),
    })
    .eq("id", id);

  await writeAudit(supabase, adminId, "reject", type, id, reason);

  const userId = (row as Record<string, string | null> | null)?.[userColumn] ?? null;
  if (userId) {
    const email = await getEmail(userId);
    if (email) await rejectedNotifier(type)(email, reason);
  }
}

// ─── Public single-item server actions ──────────────────────────────────
export async function approvePost(id: string)   { await approveOne("post",   id); revalidate(); }
export async function approveBeware(id: string) { await approveOne("beware", id); revalidate(); }
export async function approveTrip(id: string)   { await approveOne("trip",   id); revalidate(); }

export async function rejectPost(id: string, reason: string) {
  await rejectOne("post", id, reason);
  revalidate();
}
export async function rejectBeware(id: string, reason: string) {
  await rejectOne("beware", id, reason);
  revalidate();
}
export async function rejectTrip(id: string, reason: string) {
  await rejectOne("trip", id, reason);
  revalidate();
}

// ─── Bulk operations ────────────────────────────────────────────────────
const MAX_BULK_OPS = 50;

export async function bulkApprove(type: ContentType, ids: string[]) {
  if (ids.length === 0) return { count: 0 };
  if (ids.length > MAX_BULK_OPS) throw new Error(`Cannot bulk-approve more than ${MAX_BULK_OPS} items at once.`);
  // Sequential to ensure consistent audit order; small N, so latency is fine.
  for (const id of ids) await approveOne(type, id);
  revalidate();
  return { count: ids.length };
}

export async function bulkReject(type: ContentType, ids: string[], reason: string) {
  if (ids.length === 0) return { count: 0 };
  if (ids.length > MAX_BULK_OPS) throw new Error(`Cannot bulk-reject more than ${MAX_BULK_OPS} items at once.`);
  if (!reason || reason.trim().length < 4) throw new Error("Rejection reason is required.");
  for (const id of ids) await rejectOne(type, id, reason);
  revalidate();
  return { count: ids.length };
}

// ─── User ban / unban ───────────────────────────────────────────────────
export async function banUser(userId: string, reason: string) {
  if (!reason || reason.trim().length < 4) throw new Error("Ban reason is required.");
  const { supabase, adminId } = await assertAdmin();

  if (userId === adminId) throw new Error("Cannot ban yourself.");

  await supabase
    .from("profiles")
    .update({
      is_banned:  true,
      banned_at:  new Date().toISOString(),
      ban_reason: reason,
      banned_by:  adminId,
    })
    .eq("id", userId);

  await writeAudit(supabase, adminId, "ban", "user", userId, reason);
  revalidate();
}

export async function unbanUser(userId: string) {
  const { supabase, adminId } = await assertAdmin();

  await supabase
    .from("profiles")
    .update({
      is_banned:  false,
      banned_at:  null,
      ban_reason: null,
      banned_by:  null,
    })
    .eq("id", userId);

  await writeAudit(supabase, adminId, "unban", "user", userId);
  revalidate();
}

// ─── Submitter history ──────────────────────────────────────────────────
export interface SubmitterHistory {
  user_id:           string;
  email:             string | null;
  username:          string | null;
  first_name:        string | null;
  is_banned:         boolean;
  banned_at:         string | null;
  ban_reason:        string | null;
  posts_total:       number;
  posts_approved:    number;
  posts_rejected:    number;
  bewares_total:     number;
  bewares_approved:  number;
  bewares_rejected:  number;
  trips_total:       number;
  trips_approved:    number;
  trips_rejected:    number;
}

export async function getSubmitterHistory(userId: string): Promise<SubmitterHistory | null> {
  const { supabase } = await assertAdmin();
  const { data } = await supabase
    .from("submitter_history")
    .select("*")
    .eq("user_id", userId)
    .single();
  return (data as SubmitterHistory | null) ?? null;
}

// ─── Helpers ────────────────────────────────────────────────────────────
function revalidate() {
  revalidatePath("/admin");
  revalidatePath("/community");
  revalidatePath("/feed");
}
