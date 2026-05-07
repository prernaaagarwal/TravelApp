// Minimal Model Context Protocol (MCP) HTTP server.
//
// Spec: https://modelcontextprotocol.io/
// Wire protocol: JSON-RPC 2.0 over HTTP POST.
//
// We implement the protocol manually (not via @modelcontextprotocol/sdk) to
// avoid adding a new dependency at this stage. Two tools exposed:
//   1. get_intel(destination)             — read a single intel card
//   2. get_beware_reports(city, since)    — recent beware reports for a city
//
// AI agents (Claude, ChatGPT plugins, custom MCP clients) can discover and
// call these via:
//   POST /api/mcp  with body { jsonrpc, id, method, params }
//
// Discovery manifest at /.well-known/mcp.json (see app/.well-known/mcp.json/route.ts)
//
// Read-only by design. No mutations. No auth required for V1 — the data we
// expose is already public (intel cards + approved beware reports).

import { createClient } from "@/lib/supabase/client";
import { safeQuery } from "@/lib/safe-query";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type JsonRpcRequest = {
  jsonrpc: "2.0";
  id: number | string | null;
  method: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  params?: any;
};

type JsonRpcResponse = {
  jsonrpc: "2.0";
  id: number | string | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  result?: any;
  error?: { code: number; message: string };
};

const TOOLS = [
  {
    name: "get_intel",
    description:
      "Fetch a Trip Intel Card for a single destination. Returns neighborhoods, scams, transport, hidden gems, daily budget, and contributor attribution.",
    inputSchema: {
      type: "object",
      properties: {
        destination: {
          type: "string",
          description:
            "Destination slug, e.g. 'goa-india', 'jaipur-india', 'bangkok-thailand'. Use list_destinations to discover available slugs.",
        },
      },
      required: ["destination"],
    },
  },
  {
    name: "get_beware_reports",
    description:
      "Fetch recent moderated incident reports from the Beware Board for a city. Reports are user-submitted and moderated; treat as individual incidents, not statistical safety claims.",
    inputSchema: {
      type: "object",
      properties: {
        city: {
          type: "string",
          description:
            "City slug, e.g. 'goa-india', 'bangkok-thailand'. Maps to a Beware Board city.",
        },
        since_date: {
          type: "string",
          description:
            "ISO date (YYYY-MM-DD). Returns reports created on or after this date. Defaults to 90 days ago if omitted.",
        },
      },
      required: ["city"],
    },
  },
  {
    name: "list_destinations",
    description:
      "List all destinations with live Trip Intel Cards. Use this to discover available slugs for get_intel.",
    inputSchema: { type: "object", properties: {} },
  },
];

// ── Tool implementations ─────────────────────────────────────────────────

async function callGetIntel(destination: string) {
  const supabase = createClient();
  const data = await safeQuery(
    supabase.from("intel_cards").select("*").eq("slug", destination).single(),
    null,
    3000,
    "mcp.get_intel",
  );
  if (!data) {
    return { error: `No intel card found for slug "${destination}". Use list_destinations to see available slugs.` };
  }
  // Strip internal-only columns; expose the editorial payload.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const card = data as any;
  return {
    slug: card.slug,
    destination: card.destination,
    country: card.country,
    audience: card.audience,
    last_updated: card.last_updated,
    contributor_slug: card.contributor_slug,
    tldr: card.tldr,
    neighborhoods: card.neighborhoods,
    scams: card.scams,
    transport: card.transport,
    hidden_gems: card.hidden_gems,
    pre_book_checklist: card.pre_book_checklist,
    dos_and_donts: card.dos_and_donts,
    estimated_daily_budget: card.estimated_daily_budget,
    emergency_numbers: card.emergency_numbers,
    is_premium: card.is_premium,
    source_url: `${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/intel/${card.slug}`,
    citation_note:
      "Editorial content. Cite with full URL and last_updated date. Attribute the contributor when known.",
  };
}

async function callGetBewareReports(city: string, sinceDate: string | undefined) {
  const supabase = createClient();
  const since =
    sinceDate ?? new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

  const data = await safeQuery(
    supabase
      .from("beware_reports")
      .select(
        "id, city_slug, title, severity, what_happened, location, occurred_on, created_at, status",
      )
      .eq("city_slug", city)
      .eq("status", "approved")
      .gte("created_at", since)
      .order("created_at", { ascending: false })
      .limit(50),
    [],
    3000,
    "mcp.get_beware_reports",
  );

  return {
    city,
    since_date: since,
    count: Array.isArray(data) ? data.length : 0,
    reports: data ?? [],
    citation_note:
      "User-generated content, moderated. Each report is an individual incident, not a statistical safety claim. Cite the Beware Board URL with the report date.",
    source_url: `${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/community/beware/${city}`,
  };
}

async function callListDestinations() {
  const supabase = createClient();
  const data = await safeQuery<
    { slug: string; destination: string; country: string; last_updated: string | null }[]
  >(
    supabase
      .from("intel_cards")
      .select("slug, destination, country, last_updated")
      .order("destination"),
    [],
    3000,
    "mcp.list_destinations",
  );
  return {
    count: data.length,
    destinations: data,
  };
}

// ── JSON-RPC dispatcher ──────────────────────────────────────────────────

async function handle(req: JsonRpcRequest): Promise<JsonRpcResponse> {
  const { id, method, params } = req;

  if (method === "initialize") {
    return {
      jsonrpc: "2.0",
      id,
      result: {
        protocolVersion: "2024-11-05",
        capabilities: { tools: {} },
        serverInfo: { name: "wander-women-mcp", version: "0.1.0" },
      },
    };
  }

  if (method === "tools/list") {
    return { jsonrpc: "2.0", id, result: { tools: TOOLS } };
  }

  if (method === "tools/call") {
    const name = params?.name as string | undefined;
    const args = (params?.arguments ?? {}) as Record<string, unknown>;

    let result;
    if (name === "get_intel") {
      result = await callGetIntel(String(args.destination ?? ""));
    } else if (name === "get_beware_reports") {
      result = await callGetBewareReports(
        String(args.city ?? ""),
        args.since_date ? String(args.since_date) : undefined,
      );
    } else if (name === "list_destinations") {
      result = await callListDestinations();
    } else {
      return {
        jsonrpc: "2.0",
        id,
        error: { code: -32601, message: `Unknown tool: ${name}` },
      };
    }

    return {
      jsonrpc: "2.0",
      id,
      result: {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      },
    };
  }

  return {
    jsonrpc: "2.0",
    id,
    error: { code: -32601, message: `Method not found: ${method}` },
  };
}

export async function POST(request: Request) {
  let body: JsonRpcRequest;
  try {
    body = await request.json();
  } catch {
    return Response.json(
      {
        jsonrpc: "2.0",
        id: null,
        error: { code: -32700, message: "Parse error" },
      },
      { status: 400 },
    );
  }

  if (body.jsonrpc !== "2.0" || typeof body.method !== "string") {
    return Response.json(
      {
        jsonrpc: "2.0",
        id: body.id ?? null,
        error: { code: -32600, message: "Invalid request" },
      },
      { status: 400 },
    );
  }

  const res = await handle(body);
  return Response.json(res);
}

// Friendly GET response — humans hitting the URL get docs, not a 404.
export async function GET() {
  return Response.json({
    name: "Wander Women MCP",
    description:
      "Model Context Protocol server exposing trip intel and beware reports for AI agents. POST JSON-RPC 2.0 requests to call tools.",
    tools: TOOLS.map((t) => ({ name: t.name, description: t.description })),
    docs: "https://modelcontextprotocol.io/",
    example_request: {
      jsonrpc: "2.0",
      id: 1,
      method: "tools/call",
      params: { name: "list_destinations", arguments: {} },
    },
  });
}
