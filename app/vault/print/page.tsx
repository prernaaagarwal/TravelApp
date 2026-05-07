import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getSafetyPack } from "../safety-pack-actions";
import { PrintTrigger } from "./PrintTrigger";

/**
 * Print-friendly view of the user's Safety Pack. Auto-triggers the browser
 * print dialog on mount via PrintTrigger so the user lands directly on
 * "Save as PDF" without an extra click.
 *
 * No external PDF library — the browser handles PDF generation natively
 * via the print-to-PDF flow on every modern OS. Saves a dependency, saves
 * bundle weight.
 */
export const metadata = { title: "Safety Pack — print view" };
export const dynamic = "force-dynamic";

export default async function SafetyPackPrintPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/account/login?next=/vault/print");

  const pack = await getSafetyPack();
  const ownerEmail = user.email ?? "";

  const tripLine = [
    pack.destination_slug,
    pack.trip_start_date && pack.trip_end_date
      ? `${pack.trip_start_date} → ${pack.trip_end_date}`
      : pack.trip_start_date ?? pack.trip_end_date ?? "",
  ].filter(Boolean).join(" · ");

  return (
    <div className="print-page">
      <PrintTrigger />
      <header>
        <p className="eyebrow">Wander Women · Safety Pack</p>
        <h1>{ownerEmail}</h1>
        {tripLine && <p className="trip">{tripLine}</p>}
      </header>

      <Section title="Stay">
        {pack.stay_name      && <Row label="Name"        value={pack.stay_name} />}
        {pack.stay_address   && <Row label="Address"     value={pack.stay_address} />}
        {pack.stay_phone     && <Row label="Phone"       value={pack.stay_phone} />}
        {pack.booking_ref    && <Row label="Booking ref" value={pack.booking_ref} />}
      </Section>

      {(pack.insurance_policy || pack.insurance_helpline) && (
        <Section title="Insurance">
          {pack.insurance_policy   && <Row label="Policy #"  value={pack.insurance_policy} />}
          {pack.insurance_helpline && <Row label="Helpline"  value={pack.insurance_helpline} />}
        </Section>
      )}

      {pack.emergency_contacts.length > 0 && (
        <Section title="Emergency contacts">
          <ul className="contacts">
            {pack.emergency_contacts.map((c, i) => (
              <li key={i}>
                <span className="name">{c.name}</span>
                {c.relationship && <span className="rel"> · {c.relationship}</span>}
                {c.phone && <span className="phone"> — {c.phone}</span>}
              </li>
            ))}
          </ul>
        </Section>
      )}

      {pack.notes && (
        <Section title="Notes">
          <p className="notes">{pack.notes}</p>
        </Section>
      )}

      <footer>
        <p>If this person is unconscious or non-responsive, call local emergency services first, then contact the people listed above.</p>
        <p className="brand">wanderwomen.in</p>
      </footer>

      <style>{`
        .print-page {
          max-width: 640px;
          margin: 0 auto;
          padding: 32px 24px;
          font-family: Georgia, serif;
          color: #1a1510;
          background: #faf8f4;
        }
        .print-page header { margin-bottom: 28px; border-bottom: 1px solid #e0d8cc; padding-bottom: 14px; }
        .eyebrow { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 10px; letter-spacing: 0.2em; text-transform: uppercase; color: #8a7d72; margin: 0 0 8px; }
        .print-page h1 { font-size: 30px; font-weight: 400; margin: 0 0 6px; }
        .trip { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 13px; color: #c4522a; margin: 0; }

        .section { margin: 24px 0; }
        .section h2 { font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; color: #8a7d72; font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-weight: 500; margin: 0 0 10px; }
        .row { display: grid; grid-template-columns: 110px 1fr; gap: 12px; padding: 6px 0; border-bottom: 1px dashed #e0d8cc; }
        .row .label { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: #8a7d72; }
        .row .value { font-size: 14px; line-height: 1.5; }

        .contacts { margin: 0; padding: 0; list-style: none; }
        .contacts li { padding: 8px 0; border-bottom: 1px dashed #e0d8cc; font-size: 14px; line-height: 1.5; }
        .contacts .name { font-weight: 600; }
        .contacts .rel { color: #8a7d72; }
        .contacts .phone { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; }

        .notes { white-space: pre-line; font-size: 13px; line-height: 1.6; margin: 0; }

        footer { margin-top: 32px; padding-top: 14px; border-top: 1px solid #e0d8cc; font-size: 11px; color: #8a7d72; }
        footer p { margin: 0 0 6px; }
        footer .brand { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; letter-spacing: 0.1em; text-transform: uppercase; color: #c4522a; }

        @media print {
          .print-page { background: #fff; padding: 0; }
          @page { margin: 14mm; }
        }
      `}</style>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="section">
      <h2>{title}</h2>
      {children}
    </section>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="row">
      <span className="label">{label}</span>
      <span className="value">{value}</span>
    </div>
  );
}
