"use server";

import { createClient } from "@/lib/supabase/server";
import { sendGoaSafetyBrief } from "@/lib/email";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Scam = { title: string; severity: string; what: string };

// Exit-intent lead magnet handler. Inserts the email into email_captures
// (anon-insertable per the table's RLS policy) and sends a real Goa brief
// via Resend. We block on the email send so a Resend failure surfaces back
// to the user instead of leaving them with a fake "Check your inbox".
export async function submitGoaBrief(
  email: string,
): Promise<{ error?: string }> {
  const cleaned = email.toLowerCase().trim();
  if (!EMAIL_RE.test(cleaned)) {
    return { error: "Please enter a valid email address." };
  }

  const supabase = await createClient();

  const { error: insertErr } = await supabase
    .from("email_captures")
    .insert({ email: cleaned, source: "exit-intent-goa-brief" });

  if (insertErr) {
    return { error: "Something went wrong. Try again." };
  }

  const { data: goa } = await supabase
    .from("intel_cards")
    .select("scams")
    .eq("slug", "goa-india")
    .single();

  const scams = ((goa?.scams as Scam[] | null) ?? []).slice(0, 7);
  if (scams.length === 0) {
    // Email lead is captured but we can't build the brief — soft success.
    // (RESEND_API_KEY missing also makes the send a silent no-op.)
    return {};
  }

  try {
    await sendGoaSafetyBrief(cleaned, { scams });
  } catch {
    return {
      error: "Saved you, but the email failed to send. We'll retry — check back in a few minutes.",
    };
  }

  return {};
}
