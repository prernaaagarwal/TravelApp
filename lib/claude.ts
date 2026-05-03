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

function mockAnalysis(input: StayInput): AnalysisResult {
  const platformScores: Record<string, number> = {
    airbnb: 8, booking: 7, agoda: 7, makemytrip: 6,
    hostelworld: 7, vrbo: 7, hotels: 7, expedia: 8, unknown: 5,
  };
  return {
    risk_level: "medium",
    risk_summary: `This ${input.platform} listing appears generally legitimate but warrants standard verification steps before booking — particularly around host identity and payment channel.`,
    platform_trust_score: platformScores[input.platform] ?? 6,
    sections: [
      {
        id: "authenticity",
        label: "Listing Authenticity",
        verdict: "Appears genuine",
        detail: `${input.platform.charAt(0).toUpperCase() + input.platform.slice(1)} listings go through basic identity verification, but photo accuracy and location claims can vary. Cross-check the address on Google Maps Street View before booking. Look for consistent reviewer profiles and verified host badges.`,
        flags: [],
      },
      {
        id: "scam_patterns",
        label: "Known Scam Patterns",
        verdict: "Watch for off-platform contact",
        detail: `Common scams on ${input.platform} include hosts requesting payment outside the platform, bait-and-switch listings where photos don't match the actual property, and fake "maintenance closed" messages redirecting you to wire transfers. Always pay through the platform — never via bank transfer or WhatsApp.`,
        flags: ["Off-platform payment requests", "Bait-and-switch photos"],
      },
      {
        id: "host_signals",
        label: "Host & Property Signals",
        verdict: "Verify before trusting",
        detail: "Check when the host joined the platform and how many completed stays they have. New accounts with limited reviews are higher risk. Look for a response rate above 90% and a response time under 1 hour — hosts who ghost questions before booking often ghost problems after check-in too.",
        flags: [],
      },
      {
        id: "neighborhood",
        label: "Neighbourhood Safety",
        verdict: "Research the area",
        detail: "Safety varies significantly by neighbourhood within the same city. Use Google Maps to check the exact address, look up the area on local expat forums, and verify the nearest well-lit transit stop. Solo women should prioritise central, walkable neighbourhoods with 24-hour reception options.",
        flags: ["Verify exact address before booking"],
      },
      {
        id: "action_checklist",
        label: "Before You Book",
        verdict: null,
        detail: null,
        flags: [
          "Video call the host to confirm they have physical access to the property",
          "Verify the street address exists on Google Maps Street View",
          "Read all reviews under 3 stars — look for patterns",
          "Confirm check-in method (keybox, in-person, 24h desk) before committing",
          "Screenshot the listing in case it changes after booking",
          "Check the cancellation policy matches your travel dates",
          "Save the platform's customer support number before you travel",
        ],
      },
    ],
  };
}

export async function analyzeStay(input: StayInput): Promise<AnalysisResult> {
  if (!process.env.ANTHROPIC_API_KEY) {
    return mockAnalysis(input);
  }

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
