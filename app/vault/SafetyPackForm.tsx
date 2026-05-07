"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Save, Printer, Mail, Check } from "lucide-react";
import { RustButton } from "@/components/ui/RustButton";
import {
  saveSafetyPack,
  emailSafetyPack,
  type SafetyPack,
  type EmergencyContact,
} from "./safety-pack-actions";

const EMPTY_CONTACT: EmergencyContact = { name: "", relationship: "", phone: "" };
const CONTACT_SLOTS = 3;

function ensureContactSlots(list: EmergencyContact[]): EmergencyContact[] {
  const out = [...list];
  while (out.length < CONTACT_SLOTS) out.push({ ...EMPTY_CONTACT });
  return out.slice(0, CONTACT_SLOTS);
}

export function SafetyPackForm({ initial }: { initial: SafetyPack }) {
  const [pack, setPack] = useState<SafetyPack>({
    ...initial,
    emergency_contacts: ensureContactSlots(initial.emergency_contacts ?? []),
  });
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, startSaving] = useTransition();

  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [emailTo, setEmailTo] = useState("");
  const [emailMsg, setEmailMsg] = useState<string | null>(null);
  const [emailSent, setEmailSent] = useState(false);
  const [isEmailing, startEmailing] = useTransition();

  function setField<K extends keyof SafetyPack>(key: K, value: SafetyPack[K]) {
    setPack((p) => ({ ...p, [key]: value }));
    setSaved(false);
  }

  function setContactField(idx: number, key: keyof EmergencyContact, value: string) {
    setPack((p) => {
      const next = [...p.emergency_contacts];
      next[idx] = { ...next[idx], [key]: value };
      return { ...p, emergency_contacts: next };
    });
    setSaved(false);
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    startSaving(async () => {
      const res = await saveSafetyPack(pack);
      if (res.error) setError(res.error);
      else setSaved(true);
    });
  }

  function onEmail(e: React.FormEvent) {
    e.preventDefault();
    setEmailMsg(null);
    startEmailing(async () => {
      // Save first so the email reflects whatever's currently in the form,
      // not the last-saved version.
      const saveRes = await saveSafetyPack(pack);
      if (saveRes.error) {
        setEmailMsg(saveRes.error);
        return;
      }
      const sendRes = await emailSafetyPack(emailTo);
      if (sendRes.error) {
        setEmailMsg(sendRes.error);
        return;
      }
      setEmailSent(true);
      setTimeout(() => {
        setEmailModalOpen(false);
        setEmailSent(false);
        setEmailTo("");
      }, 1800);
    });
  }

  const inputCls =
    "w-full border border-ww-border bg-warm-white px-3 py-2 font-mono text-sm text-ink placeholder:text-ww-muted focus:border-ink focus:outline-none";
  const labelCls =
    "mb-1 block font-mono text-[10px] uppercase tracking-widest text-ww-muted";

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      {/* Trip block */}
      <fieldset className="space-y-3">
        <legend className="mb-3 font-serif text-xl text-ink">Your trip</legend>
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="sm:col-span-1">
            <label className={labelCls}>Destination</label>
            <input
              className={inputCls}
              value={pack.destination_slug ?? ""}
              onChange={(e) => setField("destination_slug", e.target.value)}
              placeholder="goa-india"
            />
          </div>
          <div>
            <label className={labelCls}>Start date</label>
            <input
              type="date"
              className={inputCls}
              value={pack.trip_start_date ?? ""}
              onChange={(e) => setField("trip_start_date", e.target.value)}
            />
          </div>
          <div>
            <label className={labelCls}>End date</label>
            <input
              type="date"
              className={inputCls}
              value={pack.trip_end_date ?? ""}
              onChange={(e) => setField("trip_end_date", e.target.value)}
            />
          </div>
        </div>
      </fieldset>

      {/* Stay block */}
      <fieldset className="space-y-3">
        <legend className="mb-3 font-serif text-xl text-ink">Where you&apos;re staying</legend>
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className={labelCls}>Stay name</label>
            <input
              className={inputCls}
              value={pack.stay_name ?? ""}
              onChange={(e) => setField("stay_name", e.target.value)}
              placeholder="Aldona Heritage House"
            />
          </div>
          <div>
            <label className={labelCls}>Stay phone</label>
            <input
              className={inputCls}
              value={pack.stay_phone ?? ""}
              onChange={(e) => setField("stay_phone", e.target.value)}
              placeholder="+91 …"
            />
          </div>
          <div className="sm:col-span-2">
            <label className={labelCls}>Address</label>
            <input
              className={inputCls}
              value={pack.stay_address ?? ""}
              onChange={(e) => setField("stay_address", e.target.value)}
              placeholder="House 42, Aldona, Goa 403508"
            />
          </div>
          <div>
            <label className={labelCls}>Booking reference</label>
            <input
              className={inputCls}
              value={pack.booking_ref ?? ""}
              onChange={(e) => setField("booking_ref", e.target.value)}
              placeholder="BKG-77392"
            />
          </div>
          <div>
            <label className={labelCls}>Insurance policy #</label>
            <input
              className={inputCls}
              value={pack.insurance_policy ?? ""}
              onChange={(e) => setField("insurance_policy", e.target.value)}
              placeholder="WN-87231"
            />
          </div>
          <div>
            <label className={labelCls}>Insurance helpline</label>
            <input
              className={inputCls}
              value={pack.insurance_helpline ?? ""}
              onChange={(e) => setField("insurance_helpline", e.target.value)}
              placeholder="1800-209-0144"
            />
          </div>
        </div>
      </fieldset>

      {/* Emergency contacts */}
      <fieldset className="space-y-3">
        <legend className="mb-1 font-serif text-xl text-ink">Emergency contacts</legend>
        <p className="mb-3 font-mono text-xs text-ww-muted">
          The people you&apos;d want a stranger to call if something happened to
          you. Up to {CONTACT_SLOTS}.
        </p>
        <div className="space-y-2">
          {pack.emergency_contacts.map((c, i) => (
            <div key={i} className="grid gap-2 sm:grid-cols-3">
              <input
                className={inputCls}
                value={c.name}
                onChange={(e) => setContactField(i, "name", e.target.value)}
                placeholder={i === 0 ? "Mum" : i === 1 ? "Sister" : "Best friend"}
              />
              <input
                className={inputCls}
                value={c.relationship}
                onChange={(e) => setContactField(i, "relationship", e.target.value)}
                placeholder="relationship"
              />
              <input
                className={inputCls}
                value={c.phone}
                onChange={(e) => setContactField(i, "phone", e.target.value)}
                placeholder="+91 …"
              />
            </div>
          ))}
        </div>
      </fieldset>

      {/* Notes */}
      <fieldset>
        <legend className="mb-3 font-serif text-xl text-ink">Notes</legend>
        <textarea
          className={`${inputCls} h-24 leading-relaxed`}
          value={pack.notes ?? ""}
          onChange={(e) => setField("notes", e.target.value)}
          placeholder="Allergies, blood group, medical conditions, anything a paramedic would need to know."
        />
      </fieldset>

      {/* Actions */}
      <div className="flex flex-wrap items-center gap-3 border-t border-ww-border pt-5">
        <RustButton type="submit" size="sm" disabled={isSaving}>
          {saved ? <Check className="h-3 w-3" /> : <Save className="h-3 w-3" />}
          {isSaving ? "Saving…" : saved ? "Saved" : "Save pack"}
        </RustButton>

        <Link
          href="/vault/print"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 border border-ink bg-warm-white px-4 py-2 font-mono text-[10px] uppercase tracking-widest text-ink hover:bg-ink hover:text-warm-white transition-colors"
        >
          <Printer className="h-3 w-3" />
          Print / Save as PDF
        </Link>

        <button
          type="button"
          onClick={() => setEmailModalOpen(true)}
          className="inline-flex items-center gap-2 border border-ww-border bg-warm-white px-4 py-2 font-mono text-[10px] uppercase tracking-widest text-ink hover:border-ink"
        >
          <Mail className="h-3 w-3" />
          Email to a backup contact
        </button>

        {error && <span className="font-mono text-xs text-rust">{error}</span>}
      </div>

      {/* Email modal */}
      {emailModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 px-4"
        >
          <div className="w-full max-w-md border border-ww-border bg-warm-white p-6">
            <h3 className="mb-2 font-serif text-2xl text-ink">Email this pack</h3>
            <p className="mb-4 font-mono text-xs text-ww-muted">
              We&apos;ll save your pack first, then send a copy to the email you
              enter. The recipient gets a plain-text-friendly summary they can
              read out in an emergency.
            </p>
            <form onSubmit={onEmail} className="space-y-3">
              <input
                type="email"
                className={inputCls}
                value={emailTo}
                onChange={(e) => setEmailTo(e.target.value)}
                placeholder="mum@example.com"
                required
              />
              {emailMsg && <p className="font-mono text-xs text-rust">{emailMsg}</p>}
              <div className="flex flex-wrap items-center gap-2">
                <RustButton type="submit" size="sm" disabled={isEmailing || !emailTo}>
                  {emailSent ? <Check className="h-3 w-3" /> : <Mail className="h-3 w-3" />}
                  {isEmailing ? "Sending…" : emailSent ? "Sent" : "Send"}
                </RustButton>
                <button
                  type="button"
                  onClick={() => {
                    setEmailModalOpen(false);
                    setEmailMsg(null);
                  }}
                  className="font-mono text-[10px] uppercase tracking-widest text-ww-muted hover:text-ink"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </form>
  );
}
