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
    // Log the real error server-side so future failures (RLS, missing
    // table, network) are diagnosable instead of hidden behind a generic
    // string. The exit-intent modal lives behind first-party traffic only,
    // so logging email + code is acceptable for debugging.
    console.error("[goa-brief] email_captures insert failed", {
      code: insertErr.code,
      message: insertErr.message,
    });
    return { error: "Something went wrong. Try again." };
  }

  const { data: goa } = await supabase
    .from("intel_cards")
    .select("scams")
    .eq("slug", "goa-india")
    .single();

  const scams = ((goa?.scams as Scam[] | null) ?? []).slice(0, 7);
  if (scams.length === 0) {
    // Email lead is captured but the Goa intel card has no scams data to
    // build the brief from. Return success — we'll batch a manual brief out
    // to the saved email later. (Logged so this case is visible if it
    // becomes the dominant path.)
    console.warn(
      "[goa-brief] no scams data on goa-india intel card — lead saved, no brief sent",
    );
    return {};
  }

  try {
    await sendGoaSafetyBrief(cleaned, { scams });
  } catch (err) {
    // Surface the real reason for the failure server-side. The most common
    // cause is a misconfigured Resend setup (missing RESEND_API_KEY,
    // unverified EMAIL_FROM domain). Lead is already saved — no data loss.
    console.error("[goa-brief] sendGoaSafetyBrief failed", {
      message: err instanceof Error ? err.message : String(err),
    });
    return {
      error:
        "Saved you to the list. Email delivery is temporarily unavailable — we'll send the brief manually within 24 hours.",
    };
  }

  return {};
}
