import Anthropic from "@anthropic-ai/sdk";

export type RiskColor = "green" | "yellow" | "red";

export type StayVerification = {
  color: RiskColor;
  verdict: string;
  reasons: string[];
  sources: string[];
};

export type VerifyStayInput = {
  url: string;
  platform: string;
  propertyName: string | null;
  city: string | null;
};

const SYSTEM_PROMPT = `You are a travel safety analyst for Wander Women, a platform built for solo women travellers.

Your job: analyse a booking listing URL and produce a concise, evidence-based safety verdict using your knowledge of booking platforms, known scam patterns, and destination risks.

What to assess:
1. Platform trust level — is this a reputable platform (Airbnb, Booking.com, Agoda, etc.) or unknown?
2. URL legitimacy signals — does the URL structure match the real platform? Any suspicious domains, redirects, or typosquatting?
3. Known scam patterns for this platform — off-platform payment requests, too-good pricing, no cancellation policy, new hosts with no history.
4. Destination risk level — what are the known safety considerations for solo women travellers in this city/region?
5. Property-level signals from the URL or property name — vague address, sub-let signals, mismatched city.

Color scale:
- green = reputable platform, no red flags in URL or destination, standard precautions sufficient
- yellow = some concerns (destination risks, platform-specific scam patterns to watch for, or URL signals worth noting); proceed with standard verification steps
- red = significant risk signals — suspicious URL, known high-scam destination/platform combination, fake-listing patterns, or strong off-platform signals

Output ONLY a single JSON object with this exact shape (no markdown fences, no preamble, no closing remarks):

{
  "color": "green" | "yellow" | "red",
  "verdict": "<5-8 words: clear, scannable verdict like 'Safe platform, standard precautions' or 'Verify host before paying' or 'Suspicious URL — do not book'>",
  "reasons": [
    "<short, specific finding 1 — one sentence>",
    "<short, specific finding 2>",
    "<short, specific finding 3>",
    "<short, specific finding 4>"
  ],
  "sources": [
    "<description of the knowledge basis, e.g. 'Airbnb official domain verified' or 'Known scam pattern: off-platform payment'>",
    "<second knowledge basis>",
    "<third knowledge basis>"
  ]
}

Aim for 3-5 reasons and 2-4 sources. Each reason must reference something specific about this URL, platform, or destination — not generic advice. Be honest if the URL looks completely legitimate.`;

function userPrompt(input: VerifyStayInput): string {
  return `Analyse this booking listing and return your safety verdict as JSON only.

URL: ${input.url}
Platform: ${input.platform}
Property name: ${input.propertyName ?? "(not provided)"}
City/destination: ${input.city ?? "(unknown — try to determine from the URL)"}

Return your verdict now.`;
}

function mockVerification(): StayVerification {
  return {
    color: "yellow",
    verdict: "Verify host before booking",
    reasons: [
      "Analysis service was temporarily unavailable — this is a fallback response",
      "Standard solo-traveller verification recommended for any new booking",
      "Confirm host identity via video call before transferring funds",
      "Cross-check the property address on Google Maps Street View",
    ],
    sources: [],
  };
}

function parseAgentJson(text: string): StayVerification {
  const fenced = text.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/);
  const bare = text.match(/(\{[\s\S]*\})/);
  const jsonStr = fenced?.[1] ?? bare?.[1];
  if (!jsonStr) {
    throw new Error("Agent response did not contain a JSON object");
  }

  const parsed: unknown = JSON.parse(jsonStr);
  if (typeof parsed !== "object" || parsed === null) {
    throw new Error("Agent response was not a JSON object");
  }

  const obj = parsed as Record<string, unknown>;
  const color = obj.color;
  if (color !== "green" && color !== "yellow" && color !== "red") {
    throw new Error(`Agent returned invalid color: ${String(color)}`);
  }

  return {
    color,
    verdict: typeof obj.verdict === "string" ? obj.verdict : "Verdict unavailable",
    reasons: Array.isArray(obj.reasons)
      ? obj.reasons.filter((r): r is string => typeof r === "string")
      : [],
    sources: Array.isArray(obj.sources)
      ? obj.sources.filter((s): s is string => typeof s === "string")
      : [],
  };
}

export async function verifyStay(input: VerifyStayInput): Promise<StayVerification> {
  try {
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    const response = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1024,
      system: [
        {
          type: "text",
          text: SYSTEM_PROMPT,
          cache_control: { type: "ephemeral" },
        },
      ],
      messages: [
        {
          role: "user",
          content: userPrompt(input),
        },
      ],
    });

    const textBlock = response.content.find((b) => b.type === "text");
    if (!textBlock || textBlock.type !== "text") {
      throw new Error("No text block in response");
    }

    return parseAgentJson(textBlock.text);
  } catch {
    return mockVerification();
  }
}
