import type { SupabaseClient } from "@supabase/supabase-js";

export type SearchResultType = "intel" | "beware" | "post";

export interface SearchResult {
  type:    SearchResultType;
  id:      string;
  title:   string;
  excerpt: string;
  slug:    string;
  rank:    number;
  href:    string;
}

interface RpcRow {
  result_type: SearchResultType;
  id:          string;
  title:       string;
  excerpt:     string | null;
  slug:        string | null;
  rank:        number;
}

function buildHref(row: RpcRow): string {
  switch (row.result_type) {
    case "intel":
      return `/intel/${row.id}`;
    case "beware":
      return row.slug
        ? `/community/beware/${row.slug}#${row.id}`
        : `/community#beware-${row.id}`;
    case "post":
      return row.slug
        ? `/community?destination=${encodeURIComponent(row.slug)}#${row.id}`
        : `/community#${row.id}`;
  }
}

const MIN_QUERY_LENGTH = 2;
const MAX_RESULTS      = 20;

export async function searchAll(
  supabase: SupabaseClient,
  query: string
): Promise<SearchResult[]> {
  const trimmed = query.trim();
  if (trimmed.length < MIN_QUERY_LENGTH) return [];

  const { data, error } = await supabase.rpc("search_all", {
    q:           trimmed,
    max_results: MAX_RESULTS,
  });

  if (error || !data) return [];

  return (data as RpcRow[]).map((row) => ({
    type:    row.result_type,
    id:      row.id,
    title:   row.title,
    excerpt: row.excerpt ?? "",
    slug:    row.slug ?? "",
    rank:    row.rank,
    href:    buildHref(row),
  }));
}
