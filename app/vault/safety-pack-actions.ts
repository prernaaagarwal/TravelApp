"use server";

/**
 * Safety Pack server actions — backs the V1 /vault feature.
 *
 * One row per user (PK = user_id) in safety_pack. Schema lives in
 * supabase/migrations/051_safety_pack.sql.
 *
 * Replaces the WhatsApp-bot fantasy with the smallest version of the same
 * promise: persisted emergency contacts + trip details, downloadable as a
 * PDF (browser print on /vault/print), optionally emailed to a designated
 * person via Resend.
 */

import { createClient } from "@/lib/supabase/server";
import { safeQuery } from "@/lib/safe-query";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { Resend } from "resend";
import { buildBody, escapeHtml } from "@/lib/email-template";
import { env } from "@/lib/config";

const FROM = env.EMAIL_FROM;

export type EmergencyContact = {
  name: string;
  relationship: string;
  phone: string;
};

export type SafetyPack = {
  emergency_contacts: EmergencyContact[];
  destination_slug: string | null;
  trip_start_date: string | null;
  trip_end_date: string | null;
  stay_name: string | null;
  stay_address: string | null;
  stay_phone: string | null;
  booking_ref: string | null;
  insurance_policy: string | null;
  insurance_helpline: string | null;
  notes: string | null;
};

const EMPTY_PACK: SafetyPack = {
  emergency_contacts: [],
  destination_slug: null,
  trip_start_date: null,
  trip_end_date: null,
  stay_name: null,
  stay_address: null,
  stay_phone: null,
  booking_ref: null,
  insurance_policy: null,
  insurance_helpline: null,
  notes: null,
};

const contactSchema = z.object({
  name:         z.string().trim().max(100).optional().default(""),
  relationship: z.string().trim().max(80).optional().default(""),
  phone:        z.string().trim().max(40).optional().default(""),
});

const packSchema = z.object({
  emergency_contacts: z.array(contactSchema).max(5).default([]),
  destination_slug:   z.string().trim().max(100).optional().nullable(),
  trip_start_date:    z.string().trim().regex(/^\d{4}-\d{2}-\d{2}$/).optional().nullable().or(z.literal("")),
  trip_end_date:      z.string().trim().regex(/^\d{4}-\d{2}-\d{2}$/).optional().nullable().or(z.literal("")),
  stay_name:          z.string().trim().max(200).optional().nullable(),
  stay_address:       z.string().trim().max(500).optional().nullable(),
  stay_phone:         z.string().trim().max(40).optional().nullable(),
  booking_ref:        z.string().trim().max(80).optional().nullable(),
  insurance_policy:   z.string().trim().max(120).optional().nullable(),
  insurance_helpline: z.string().trim().max(40).optional().nullable(),
  notes:              z.string().trim().max(2000).optional().nullable(),
});

function emptyToNull<T>(v: T | "" | null | undefined): T | null {
  return v === "" || v === undefined ? null : (v as T);
}

export async function getSafetyPack(): Promise<SafetyPack> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return EMPTY_PACK;

  const row = await safeQuery<SafetyPack | null>(
    supabase
      .from("safety_pack")
      .select(
        "emergency_contacts, destination_slug, trip_start_date, trip_end_date, stay_name, stay_address, stay_phone, booking_ref, insurance_policy, insurance_helpline, notes",
      )
      .eq("user_id", user.id)
      .maybeSingle(),
    null,
    1500,
    "vault.getSafetyPack",
  );

  if (!row) return EMPTY_PACK;
  return {
    ...EMPTY_PACK,
    ...row,
    emergency_contacts: Array.isArray(row.emergency_contacts) ? row.emergency_contacts : [],
  };
}

export async function saveSafetyPack(
  input: SafetyPack,
): Promise<{ error?: string; success?: true }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Sign in to save your safety pack." };

  const result = packSchema.safeParse(input);
  if (!result.success) return { error: result.error.issues[0].message };
  const v = result.data;

  // Drop fully-empty contact rows so the PDF + email don't render blank
  // lines for slots the user left untouched.
  const cleanedContacts = (v.emergency_contacts ?? [])
    .map((c) => ({
      name:         (c.name ?? "").trim(),
      relationship: (c.relationship ?? "").trim(),
      phone:        (c.phone ?? "").trim(),
    }))
    .filter((c) => c.name || c.phone);

  const { error } = await supabase
    .from("safety_pack")
    .upsert(
      {
        user_id:            user.id,
        emergency_contacts: cleanedContacts,
        destination_slug:   emptyToNull(v.destination_slug),
        trip_start_date:    emptyToNull(v.trip_start_date),
        trip_end_date:      emptyToNull(v.trip_end_date),
        stay_name:          emptyToNull(v.stay_name),
        stay_address:       emptyToNull(v.stay_address),
        stay_phone:         emptyToNull(v.stay_phone),
        booking_ref:        emptyToNull(v.booking_ref),
        insurance_policy:   emptyToNull(v.insurance_policy),
        insurance_helpline: emptyToNull(v.insurance_helpline),
        notes:              emptyToNull(v.notes),
      },
      { onConflict: "user_id" },
    );
  if (error) return { error: "Could not save. Try again." };

  revalidatePath("/vault");
  revalidatePath("/vault/print");
  return { success: true };
}

const emailSchema = z.object({
  toEmail: z.string().trim().email().max(200),
});

export async function emailSafetyPack(
  toEmail: string,
): Promise<{ error?: string; success?: true }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Sign in to email your safety pack." };

  const parsed = emailSchema.safeParse({ toEmail });
  if (!parsed.success) return { error: "Please enter a valid email address." };

  if (!env.RESEND_API_KEY) return { error: "Email is not configured. Try Print → Save as PDF instead." };

  const pack = await getSafetyPack();

  const html = renderSafetyPackEmailHtml(pack, user.email ?? null);
  const ownerName = user.email ?? "Wander Women user";

  try {
    const resend = new Resend(env.RESEND_API_KEY);
    await resend.emails.send({
      from: FROM,
      to: parsed.data.toEmail,
      subject: `${ownerName}'s travel safety pack`,
      html,
    });
  } catch {
    return { error: "Could not send. Try again or use Print → Save as PDF." };
  }

  return { success: true };
}

function renderSafetyPackEmailHtml(pack: SafetyPack, ownerEmail: string | null): string {
  const rows: string[] = [];

  if (pack.destination_slug || pack.trip_start_date || pack.trip_end_date) {
    const dest = pack.destination_slug ?? "—";
    const start = pack.trip_start_date ?? "?";
    const end = pack.trip_end_date ?? "?";
    rows.push(`<strong>Trip:</strong> ${escapeHtml(dest)} · ${escapeHtml(start)} → ${escapeHtml(end)}`);
  }
  if (pack.stay_name)     rows.push(`<strong>Stay:</strong> ${escapeHtml(pack.stay_name)}`);
  if (pack.stay_address)  rows.push(`<strong>Address:</strong> ${escapeHtml(pack.stay_address)}`);
  if (pack.stay_phone)    rows.push(`<strong>Stay phone:</strong> ${escapeHtml(pack.stay_phone)}`);
  if (pack.booking_ref)   rows.push(`<strong>Booking ref:</strong> ${escapeHtml(pack.booking_ref)}`);
  if (pack.insurance_policy) rows.push(`<strong>Insurance:</strong> ${escapeHtml(pack.insurance_policy)}`);
  if (pack.insurance_helpline) rows.push(`<strong>Insurance helpline:</strong> ${escapeHtml(pack.insurance_helpline)}`);

  const contactsList = (pack.emergency_contacts ?? [])
    .map(
      (c) =>
        `<li>${escapeHtml(c.name)}${c.relationship ? ` <em>(${escapeHtml(c.relationship)})</em>` : ""} — ${escapeHtml(c.phone)}</li>`,
    )
    .join("");

  const tripBlock = rows.length
    ? `<p style="font-family:Georgia,serif;font-size:14px;line-height:1.7;color:#1a1510;margin:0 0 12px">${rows.join("<br/>")}</p>`
    : "";

  const contactsBlock = contactsList
    ? `<p style="font-family:monospace;font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:#8a7d72;margin:18px 0 6px">Emergency contacts</p>
       <ul style="font-family:Georgia,serif;font-size:14px;line-height:1.7;color:#1a1510;margin:0;padding-left:20px">${contactsList}</ul>`
    : "";

  const notesBlock = pack.notes
    ? `<p style="font-family:monospace;font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:#8a7d72;margin:18px 0 6px">Notes</p>
       <p style="font-family:Georgia,serif;font-size:14px;line-height:1.7;color:#1a1510;margin:0;white-space:pre-line">${escapeHtml(pack.notes)}</p>`
    : "";

  const message = `${ownerEmail ? `<strong>${escapeHtml(ownerEmail)}</strong> shared their travel safety pack with you.` : "A Wander Women user shared their travel safety pack with you."} Save this — they may need you to read it back to them in an emergency.`;

  return buildBody("Travel safety pack", message, {})
    .replace(
      "</h1>",
      `</h1>${tripBlock}${contactsBlock}${notesBlock}`,
    );
}
