"use client";

import { useTransition, useState } from "react";
import { updateNotificationPref } from "./actions";

type Prefs = {
  new_beware_in_saved_destinations: boolean;
  buddy_match_found: boolean;
  community_reply_to_my_post: boolean;
  platform_updates: boolean;
  whatsapp_enabled: boolean;
  email_enabled: boolean;
  weekly_digest_enabled: boolean;
};

const TOPIC_PREFS: Array<{ key: keyof Prefs; label: string; sublabel?: string }> = [
  { key: "new_beware_in_saved_destinations", label: "New warnings in my saved destinations" },
  { key: "buddy_match_found",               label: "Buddy match found" },
  { key: "community_reply_to_my_post",      label: "Replies to my community posts" },
  {
    key: "weekly_digest_enabled",
    label: "Weekly digest",
    sublabel: "Sunday recap of new intel + medium-severity reports in your saved destinations. Critical scams still arrive immediately.",
  },
  { key: "platform_updates",               label: "Platform updates" },
];

export function NotificationToggles({
  prefs,
  hasPhone,
  hasEmail,
}: {
  prefs: Prefs;
  hasPhone: boolean;
  hasEmail: boolean;
}) {
  const [state, setState] = useState<Prefs>(prefs);
  const [, startTransition] = useTransition();

  function toggle(key: keyof Prefs) {
    const next = !state[key];
    setState((prev) => ({ ...prev, [key]: next }));
    startTransition(() => updateNotificationPref(key, next));
  }

  return (
    <div className="space-y-0">
      {TOPIC_PREFS.map(({ key, label, sublabel }, i) => (
        <Toggle
          key={key}
          label={label}
          sublabel={sublabel}
          checked={state[key] as boolean}
          onToggle={() => toggle(key)}
          border={i < TOPIC_PREFS.length - 1}
        />
      ))}

      {(hasPhone || hasEmail) && (
        <>
          <div className="my-3 border-t border-ww-border" />
          {hasEmail && (
            <Toggle
              label="Notify via email"
              checked={state.email_enabled}
              onToggle={() => toggle("email_enabled")}
            />
          )}
          {hasPhone && (
            <Toggle
              label="Notify via WhatsApp"
              checked={state.whatsapp_enabled}
              onToggle={() => toggle("whatsapp_enabled")}
            />
          )}
        </>
      )}
    </div>
  );
}

function Toggle({
  label,
  sublabel,
  checked,
  onToggle,
  border = false,
}: {
  label: string;
  sublabel?: string;
  checked: boolean;
  onToggle: () => void;
  border?: boolean;
}) {
  return (
    <div
      className={`flex items-start justify-between gap-4 py-3 ${
        border ? "border-b border-ww-border/60" : ""
      }`}
    >
      <div className="min-w-0 flex-1">
        <p className="font-mono text-sm text-ink">{label}</p>
        {sublabel && (
          <p className="mt-1 font-mono text-[11px] leading-relaxed text-ww-muted">
            {sublabel}
          </p>
        )}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={onToggle}
        className={`relative mt-0.5 inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors focus:outline-none ${
          checked ? "bg-rust" : "bg-ww-border"
        }`}
      >
        <span
          className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow-sm transition-transform ${
            checked ? "translate-x-[18px]" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  );
}
