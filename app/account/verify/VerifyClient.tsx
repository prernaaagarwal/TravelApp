"use client";

import { useState } from "react";
import { PhoneStep } from "./PhoneStep";
import { IdSelfieStep } from "./IdSelfieStep";

// Two-step client wrapper. We can't use server-component state here because
// each step needs to flip the next one open after a server action completes.

export function VerifyClient({
  userId,
  initialPhone,
  initialPhoneVerified,
  initialPhotoSubmitted,
}: {
  userId: string;
  initialPhone: string;
  initialPhoneVerified: boolean;
  initialPhotoSubmitted: boolean;
}) {
  const [phoneVerified, setPhoneVerified] = useState(initialPhoneVerified);
  const [photoSubmitted, setPhotoSubmitted] = useState(initialPhotoSubmitted);

  if (photoSubmitted) {
    return (
      <div className="rounded-xl border border-sage/40 bg-sage-light/30 p-6 shadow-sm">
        <p className="mb-2 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-sage">
          <span aria-hidden>✓</span>
          Submitted — pending review
        </p>
        <p className="font-mono text-xs leading-relaxed text-ink">
          Thanks. A member of our team will review your submission within 24
          hours. You&apos;ll get an email once your account is approved (or if
          we need a clearer photo). The ID image will be deleted from our
          servers as soon as you&apos;re approved.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {phoneVerified ? (
        <div className="rounded-xl border border-sage/40 bg-sage-light/30 p-4">
          <p className="font-mono text-xs text-sage">
            ✓ Phone confirmed.
          </p>
        </div>
      ) : (
        <PhoneStep
          defaultPhone={initialPhone}
          onVerified={() => setPhoneVerified(true)}
        />
      )}

      <IdSelfieStep
        userId={userId}
        enabled={phoneVerified}
        onSubmitted={() => setPhotoSubmitted(true)}
      />
    </div>
  );
}
