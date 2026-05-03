import Anthropic from "@anthropic-ai/sdk";

export type RiskLevel = "low" | "medium" | "high" | "critical";

export type ReportSection = {
  id: string;
  label: string;
  verdict: string | null;
  detail: string | null;
  flags: string[];
};

export type AnalysisResult = {
  risk_level: RiskLevel;
  risk_summary: string;
  platform_trust_score: number;
  sections: ReportSection[];
};

export type StayInput = {
  url: string;
  platform: string;
  propertyName: string | null;
  city: string | null;
  ogDescription: string | null;
};

const SYSTEM_PROMPT = `You are a travel safety analyst for Wander Women, a platform built for solo women travellers.
Your job is to analyse booking listings and identify scam patterns, safety risks, and authenticity signals.
You must return ONLY valid JSON — no markdown, no explanation, no preamble.`;

const USER_PROMPT_TEMPLATE = (input: StayInput) => `
Analyse this travel booking listing for safety and scam risks. Return ONLY valid JSON.

Booking URL: ${input.url}
Platform: ${input.platform}
Property name: ${input.propertyName ?? "Unknown"}
City/Location: ${input.city ?? "Unknown"}
Description snippet: ${input.ogDescription ?? "Not available"}

Return this exact JSON structure:
{
  "risk_level": "low" | "medium" | "high" | "critical",
  "risk_summary": "One sentence overall safety verdict for a solo woman traveller",
  "platform_trust_score": <integer 1-10 where 10 = most trusted>,
  "sections": [
    {
      "id": "authenticity",
      "label": "Listing Authenticity",
      "verdict": "Short verdict phrase",
      "detail": "2-3 sentences about authenticity signals based on the platform and property details",
      "flags": ["Any specific red flags found, or empty array"]
    },
    {
      "id": "scam_patterns",
      "label": "Known Scam Patterns",
      "verdict": "Short verdict phrase",
      "detail": "2-3 sentences about common scams on this platform in this destination",
      "flags": ["List any scam pattern flags like: Off-platform payment requests, Fake reviews, Bait-and-switch listing, etc."]
    },
    {
      "id": "host_signals",
      "label": "Host & Property Signals",
      "verdict": "Short verdict phrase",
      "detail": "2-3 sentences about what to look for in the host profile, reviews, and listing details",
      "flags": ["Any specific host-related red flags, or empty array"]
    },
    {
      "id": "neighborhood",
      "label": "Neighbourhood Safety",
      "verdict": "Short verdict phrase",
      "detail": "2-3 sentences about the general safety of the city/area for solo women travellers",
      "flags": ["Specific neighbourhood concerns if any, or empty array"]
    },
    {
      "id": "action_checklist",
      "label": "Before You Book",
      "verdict": null,
      "detail": null,
      "flags": ["5-7 specific action items she should do before booking this property"]
    }
  ]
}

Focus on risks specific to solo women travellers: personal safety, scam patterns common on ${input.platform},
destination-specific hazards, and verification steps. Be direct and practical.
`;

export async function analyzeStay(input: StayInput): Promise<AnalysisResult> {
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const response = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 1500,
    temperature: 0,
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content: USER_PROMPT_TEMPLATE(input) }],
  });

  const text = response.content[0].type === "text" ? response.content[0].text : "";
  const parsed = JSON.parse(text.trim()) as AnalysisResult;
  return parsed;
}
