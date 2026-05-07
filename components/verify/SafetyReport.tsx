"use client";

import { useState } from "react";
import { ExternalLink, Copy, Check, ShieldCheck, AlertTriangle, Ban } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RustButton } from "@/components/ui/RustButton";
import Link from "next/link";
import type { StayVerification, RiskColor } from "@/lib/agents/stay-verifier";

const STYLES: Record<RiskColor, {
  bg: string;
  ring: string;
  dot: string;
  text: string;
  label: string;
  Icon: typeof ShieldCheck;
}> = {
  green: {
    bg: "bg-sage-light",
    ring: "ring-sage/40",
    dot: "bg-sage",
    text: "text-sage",
    label: "SAFE",
    Icon: ShieldCheck,
  },
  yellow: {
    bg: "bg-gold-light",
    ring: "ring-gold/40",
    dot: "bg-gold",
    text: "text-gold",
    label: "CAUTION",
    Icon: AlertTriangle,
  },
  red: {
    bg: "bg-rust-light",
    ring: "ring-rust/40",
    dot: "bg-rust",
    text: "text-rust",
    label: "AVOID",
    Icon: Ban,
  },
};

function hostFromUrl(url: string): string {
  try {
    return new URL(url).hostname.replace("www.", "");
  } catch {
    return url;
  }
}

export function SafetyReport({
  analysis,
  propertyName,
  platform,
  bookingUrl,
}: {
  analysis: StayVerification;
  propertyName: string | null;
  platform: string | null;
  bookingUrl: string;
}) {
  const [copied, setCopied] = useState(false);
  const style = STYLES[analysis.color];
  const { Icon } = style;

  async function copyLink() {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="space-y-6">
      <div className={`rounded-2xl border border-ww-border ${style.bg} p-6 md:p-8`}>
        <div className="flex flex-col items-center text-center gap-4">
          <div
            className={`relative h-24 w-24 rounded-full ${style.dot} flex items-center justify-center shadow-lg ring-4 ${style.ring}`}
            aria-label={style.label}
          >
            <Icon className="h-12 w-12 text-warm-white" strokeWidth={2.5} />
          </div>

          <div>
            <p className={`text-xs font-semibold tracking-[0.2em] ${style.text} mb-2`}>
              {style.label}
            </p>
            <h2 className={`font-serif text-2xl md:text-3xl ${style.text}`}>
              {analysis.verdict}
            </h2>
          </div>

          {(propertyName || platform) && (
            <div className="text-xs text-ink/70 font-mono pt-2">
              {propertyName && <span>{propertyName}</span>}
              {propertyName && platform && <span className="mx-2">·</span>}
              {platform && <span className="uppercase">{platform}</span>}
            </div>
          )}
        </div>
      </div>

      {analysis.reasons.length > 0 && (
        <div>
          <h3 className="text-xs uppercase tracking-wider text-ww-muted mb-3">
            What the research found
          </h3>
          <ul className="space-y-2">
            {analysis.reasons.map((reason, i) => (
              <li
                key={i}
                className="flex gap-3 rounded-lg border border-ww-border bg-warm-white p-3"
              >
                <span className={`mt-1.5 h-1.5 w-1.5 rounded-full ${style.dot} shrink-0`} />
                <span className="text-sm text-ink/85 leading-relaxed">{reason}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {analysis.sources.length > 0 && (
        <div>
          <h3 className="text-xs uppercase tracking-wider text-ww-muted mb-3">
            Sources consulted
          </h3>
          <ul className="space-y-1.5">
            {analysis.sources.map((src, i) => (
              <li key={i}>
                <a
                  href={src}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-ink/70 hover:text-rust transition-colors"
                >
                  <ExternalLink className="h-3 w-3 shrink-0" />
                  <span className="font-mono truncate max-w-[28rem]">
                    {hostFromUrl(src)}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="rounded-lg border border-ww-border bg-sand/40 px-3 py-2">
        <a
          href={bookingUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-xs text-ww-muted hover:text-ink transition-colors"
        >
          <ExternalLink className="h-3 w-3 shrink-0" />
          <span className="font-mono truncate">{bookingUrl}</span>
        </a>
      </div>

      <div className="flex flex-wrap gap-2 pt-2">
        <Button
          variant="outline"
          size="sm"
          onClick={copyLink}
          className="gap-2 border-ww-border text-ww-muted hover:text-ink"
        >
          {copied ? <Check className="h-4 w-4 text-sage" /> : <Copy className="h-4 w-4" />}
          {copied ? "Copied" : "Share report"}
        </Button>
        <Button asChild variant="outline" size="sm" className="gap-2 border-ww-border text-ww-muted hover:text-ink">
          <Link href="/contribute/report">Submit a report</Link>
        </Button>
        <RustButton size="sm" asChild className="ml-auto">
          <Link href="/verify-stay">Verify another stay</Link>
        </RustButton>
      </div>

      <p className="text-xs text-ww-muted leading-relaxed pt-2">
        Generated by an AI agent that searches the web for scam reports, hidden reviews, and
        destination-specific risks. Always verify the property independently before booking — this
        is a research aid, not a guarantee.
      </p>
    </div>
  );
}
