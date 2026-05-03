"use client";

import { useTransition, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { submitStayVerification } from "@/app/verify-stay/actions";

const PLATFORMS = [
  { name: "Airbnb", color: "bg-rose-100 text-rose-700" },
  { name: "Booking.com", color: "bg-blue-100 text-blue-700" },
  { name: "Agoda", color: "bg-red-100 text-red-700" },
  { name: "MakeMyTrip", color: "bg-orange-100 text-orange-700" },
  { name: "Hostelworld", color: "bg-green-100 text-green-700" },
  { name: "VRBO", color: "bg-teal-100 text-teal-700" },
];

export function StayVerifyForm({ usedThisMonth }: { usedThisMonth: number }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const remaining = Math.max(0, 3 - usedThisMonth);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await submitStayVerification(formData);
      if (result.error) {
        setError(result.error);
        return;
      }
      if (result.id) {
        router.push(`/verify-stay/${result.id}`);
      }
    });
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="relative">
          <Input
            name="booking_url"
            type="url"
            placeholder="Paste your booking link here — Airbnb, Booking.com, Agoda…"
            required
            disabled={isPending}
            className="h-12 pr-12 text-sm font-mono border-ww-border focus:border-rust focus:ring-rust placeholder:text-ww-muted/60"
          />
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ww-muted pointer-events-none" />
        </div>

        {error && (
          <div className="flex items-start gap-2 rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">
            <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <Button
          type="submit"
          disabled={isPending}
          className="w-full h-11 bg-rust text-warm-white hover:bg-rust/90 font-medium"
        >
          {isPending ? (
            <span className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Researching the listing — this takes 20-40 seconds…
            </span>
          ) : (
            "Run Safety Analysis"
          )}
        </Button>
      </form>

      <div className="flex flex-wrap gap-2">
        {PLATFORMS.map((p) => (
          <span key={p.name} className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${p.color}`}>
            {p.name}
          </span>
        ))}
      </div>

      <p className="text-xs text-ww-muted">
        {remaining > 0
          ? `${remaining} free ${remaining === 1 ? "analysis" : "analyses"} remaining this month · Pro members get unlimited`
          : "Monthly limit reached · Upgrade to Pro for unlimited verifications"}
      </p>
    </div>
  );
}
