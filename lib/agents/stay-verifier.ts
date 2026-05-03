import { spawn } from "node:child_process";

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

const SYSTEM_PROMPT = `You are a travel safety research agent for Wander Women, a platform built for solo women travellers.

Your job: research a specific booking listing and produce a concise, evidence-based safety verdict.

Process:
1. Use WebFetch on the booking URL itself to read the listing's title, host details, reviews, and policies (some platforms may block — that's fine, fall back to search).
2. Use WebSearch to look for: "[property name] reviews scam", "[property name] [city] complaints", "[city] [platform] tourist scams", "[city] solo female traveller safety reddit".
3. Look for hidden negative signals on Reddit, TripAdvisor, travel forums — places where unhappy guests complain when official reviews are filtered.
4. Cross-reference the destination's known scam patterns for this platform.

Then synthesise everything into a clear verdict.

Color scale:
- green = no significant red flags found, listing appears legitimate, normal precautions sufficient
- yellow = some concerns or general destination risks; proceed with verification steps
- red = significant scam reports, safety risks, fake-listing signals, or major host-related complaints

Output ONLY a single JSON object with this exact shape (no markdown fences, no preamble, no closing remarks):

{
  "color": "green" | "yellow" | "red",
  "verdict": "<5-8 words: clear, scannable verdict like 'Safe to book' or 'Avoid: scam reports found' or 'Verify host before paying'>",
  "reasons": [
    "<short, specific finding 1 — one sentence>",
    "<short, specific finding 2>",
    "<short, specific finding 3>",
    "<short, specific finding 4>"
  ],
  "sources": [
    "<URL of most relevant source consulted>",
    "<URL of second source>",
    "<URL of third source>"
  ]
}

Aim for 3-5 reasons and 2-5 sources. Each reason must be evidence-based — reference what you actually found in research, not generic safety advice. If web research returns no findings about the specific property, say so honestly in the reasons (e.g. "No reviews or scam reports surfaced for this specific listing").`;

function userPrompt(input: VerifyStayInput): string {
  return `Research this booking listing and return your verdict as JSON only.

URL: ${input.url}
Platform: ${input.platform}
Property name: ${input.propertyName ?? "(not extracted — fetch the URL to find out)"}
City/destination: ${input.city ?? "(unknown — try to determine from the URL or listing)"}

Begin research now.`;
}

function mockVerification(): StayVerification {
  return {
    color: "yellow",
    verdict: "Verify host before booking",
    reasons: [
      "Claude CLI was unavailable — research could not run",
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

const CLI_BINARY = process.env.CLAUDE_CLI_PATH ?? "claude";
const CLI_TIMEOUT_MS = 120_000;

type CliJsonResult = { result?: string; is_error?: boolean };

async function runClaudeCli(system: string, user: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const proc = spawn(
      CLI_BINARY,
      [
        "-p", user,
        "--system-prompt", system,
        "--allowed-tools", "WebSearch,WebFetch",
        "--output-format", "json",
      ],
      { stdio: ["ignore", "pipe", "pipe"] }
    );

    let stdout = "";
    let stderr = "";

    const timeout = setTimeout(() => {
      proc.kill("SIGKILL");
      reject(new Error(`claude CLI timed out after ${CLI_TIMEOUT_MS / 1000}s`));
    }, CLI_TIMEOUT_MS);

    proc.stdout.on("data", (d: Buffer) => { stdout += d.toString(); });
    proc.stderr.on("data", (d: Buffer) => { stderr += d.toString(); });

    proc.on("error", (err) => {
      clearTimeout(timeout);
      reject(new Error(`claude CLI failed to start: ${err.message}`));
    });

    proc.on("close", (code) => {
      clearTimeout(timeout);
      if (code !== 0) {
        reject(new Error(`claude CLI exited ${code}: ${stderr.slice(0, 500)}`));
        return;
      }
      try {
        const parsed: CliJsonResult = JSON.parse(stdout);
        if (parsed.is_error) {
          reject(new Error(`claude CLI returned error: ${stdout.slice(0, 500)}`));
          return;
        }
        if (typeof parsed.result !== "string") {
          reject(new Error("claude CLI output missing 'result' field"));
          return;
        }
        resolve(parsed.result);
      } catch {
        reject(new Error(`claude CLI returned non-JSON: ${stdout.slice(0, 300)}`));
      }
    });
  });
}

export async function verifyStay(input: VerifyStayInput): Promise<StayVerification> {
  try {
    const finalText = await runClaudeCli(SYSTEM_PROMPT, userPrompt(input));
    return parseAgentJson(finalText);
  } catch (err) {
    console.error("[verifyStay] CLI agent failed, returning mock:", err);
    return mockVerification();
  }
}
