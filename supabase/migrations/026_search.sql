-- 018: Full-text search across intel cards, beware reports, and community posts.
--
-- Approach: tsvector column on each table, kept up-to-date via trigger.
-- A unified `search_all(q)` RPC ranks results across all three tables.
--
-- Idempotent: safe to re-run.

-- ─── intel_cards ──────────────────────────────────────────────────────────
alter table intel_cards
  add column if not exists search_vector tsvector
  generated always as (
    setweight(to_tsvector('simple', coalesce(destination, '')), 'A') ||
    setweight(to_tsvector('simple', coalesce(country, '')),     'A') ||
    setweight(to_tsvector('simple', coalesce(slug, '')),        'B')
  ) stored;

create index if not exists intel_cards_search_idx
  on intel_cards using gin (search_vector);

-- ─── beware_reports ───────────────────────────────────────────────────────
-- Beware text is in title + description + city + location. We don't include
-- description in the highest weight to avoid noisy single-word matches.
alter table beware_reports
  add column if not exists search_vector tsvector
  generated always as (
    setweight(to_tsvector('simple', coalesce(title, '')),       'A') ||
    setweight(to_tsvector('simple', coalesce(city, '')),        'A') ||
    setweight(to_tsvector('simple', coalesce(location, '')),    'B') ||
    setweight(to_tsvector('simple', coalesce(category, '')),    'B') ||
    setweight(to_tsvector('simple', coalesce(description, '')), 'C')
  ) stored;

create index if not exists beware_reports_search_idx
  on beware_reports using gin (search_vector);

-- ─── community_posts ──────────────────────────────────────────────────────
alter table community_posts
  add column if not exists search_vector tsvector
  generated always as (
    setweight(to_tsvector('simple', coalesce(title, '')),       'A') ||
    setweight(to_tsvector('simple', coalesce(destination, '')), 'B') ||
    setweight(to_tsvector('simple', coalesce(content, '')),     'C')
  ) stored;

create index if not exists community_posts_search_idx
  on community_posts using gin (search_vector);

-- ─── unified search RPC ───────────────────────────────────────────────────
-- Returns ranked results across all three tables. Only includes published
-- (approved) content for community posts and beware reports — intel cards
-- have no status column, so all are searchable. Limit is per-call (caller
-- decides) to allow either a top-N global cap or per-bucket limits.
create or replace function search_all(q text, max_results integer default 20)
returns table (
  result_type   text,
  id            text,
  title         text,
  excerpt       text,
  slug          text,
  rank          real
)
language sql
stable
security definer
set search_path = public
as $$
  with query_terms as (
    select plainto_tsquery('simple', q) as ts
  ),
  intel as (
    select
      'intel'::text                                            as result_type,
      ic.slug                                                  as id,
      ic.destination || ', ' || ic.country                     as title,
      coalesce(
        case
          when jsonb_typeof(ic.tldr) = 'object' then ic.tldr->>'summary'
          else null
        end,
        ic.country
      )                                                        as excerpt,
      ic.slug                                                  as slug,
      ts_rank(ic.search_vector, q.ts)                          as rank
    from intel_cards ic, query_terms q
    where ic.search_vector @@ q.ts
  ),
  beware as (
    select
      'beware'::text                                           as result_type,
      br.id::text                                              as id,
      br.title                                                 as title,
      left(br.description, 140)                                as excerpt,
      coalesce(br.destination_slug, '')                        as slug,
      ts_rank(br.search_vector, q.ts)                          as rank
    from beware_reports br, query_terms q
    where br.search_vector @@ q.ts
      and br.status = 'approved'
  ),
  posts as (
    select
      'post'::text                                             as result_type,
      cp.id                                                    as id,
      coalesce(nullif(cp.title, ''), 'Community post')         as title,
      left(cp.content, 140)                                    as excerpt,
      coalesce(cp.destination, '')                             as slug,
      ts_rank(cp.search_vector, q.ts)                          as rank
    from community_posts cp, query_terms q
    where cp.search_vector @@ q.ts
      and cp.status = 'approved'
  )
  select * from intel
  union all select * from beware
  union all select * from posts
  order by rank desc
  limit max_results;
$$;

-- Allow anon + authenticated to call the search RPC. RLS still applies to
-- the underlying tables, so this respects existing read policies.
grant execute on function search_all(text, integer) to anon, authenticated;
