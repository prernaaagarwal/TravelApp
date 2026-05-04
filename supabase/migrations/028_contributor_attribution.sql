-- 020: Contributor attribution + revenue share infrastructure
--
-- 1. Link `contributors` to a real `auth.users` account via user_id FK.
--    Existing seed contributors keep user_id = NULL until manually linked
--    through admin tooling.
--
-- 2. Track intel card views with per-user-per-day deduplication so the
--    view_count metric is meaningful, not refresh-spammable.
--
-- 3. Replace the static `earnings_this_month` int with a live
--    `contributor_stats` aggregate view + a `contributor_earnings` view
--    that splits a monthly pool by contribution-weighted points.
--
-- 4. Pool size lives in a `platform_settings` table so it can be tuned
--    without code deploys.
--
-- Idempotent.

-- ─── 1. Link contributors to auth users ─────────────────────────────────
alter table contributors
  add column if not exists user_id uuid references auth.users(id) on delete set null;

-- One user = at most one contributor row.
create unique index if not exists contributors_user_id_unique
  on contributors (user_id) where user_id is not null;

-- Lookup helper for the dashboard
create index if not exists contributors_user_id_idx
  on contributors (user_id);

-- ─── 2. Intel card view tracking ────────────────────────────────────────
alter table intel_cards
  add column if not exists view_count int not null default 0;

create table if not exists intel_card_views (
  id                  uuid          primary key default gen_random_uuid(),
  card_slug           text          not null references intel_cards(slug) on delete cascade,
  viewer_id           uuid          references auth.users(id) on delete set null,
  viewer_fingerprint  text,
  viewed_on           date          not null default current_date,
  created_at          timestamptz   not null default now()
);

create index if not exists intel_card_views_card_idx
  on intel_card_views (card_slug);

-- Dedupe: one row per (card, viewer, day) for logged-in viewers
create unique index if not exists intel_card_views_user_day_unique
  on intel_card_views (card_slug, viewer_id, viewed_on)
  where viewer_id is not null;

-- Dedupe: one row per (card, fingerprint, day) for anonymous viewers
create unique index if not exists intel_card_views_anon_day_unique
  on intel_card_views (card_slug, viewer_fingerprint, viewed_on)
  where viewer_id is null and viewer_fingerprint is not null;

alter table intel_card_views enable row level security;
-- Read access: only admins (service role bypasses RLS) — no public read
-- of who-viewed-what for privacy reasons.

-- Atomically record a view: insert dedupe row, increment view_count if a
-- new row was actually inserted. Returns true if counted, false if dedup'd.
create or replace function record_intel_view(
  p_slug          text,
  p_viewer_id     uuid,
  p_fingerprint   text
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  inserted boolean := false;
begin
  insert into intel_card_views (card_slug, viewer_id, viewer_fingerprint)
  values (p_slug, p_viewer_id, p_fingerprint)
  on conflict do nothing;

  get diagnostics inserted = row_count;

  if inserted then
    update intel_cards set view_count = view_count + 1 where slug = p_slug;
    return true;
  end if;
  return false;
end;
$$;

grant execute on function record_intel_view(text, uuid, text) to anon, authenticated;

-- ─── 3. Platform settings (pool size + formula constants) ───────────────
create table if not exists platform_settings (
  key         text       primary key,
  value       jsonb      not null,
  updated_at  timestamptz not null default now()
);

alter table platform_settings enable row level security;
create policy "Anyone reads platform settings"
  on platform_settings for select using (true);

-- Seed defaults. Re-running is harmless — `do nothing` on conflict.
insert into platform_settings (key, value) values
  ('contributor_pool_inr_monthly',
   to_jsonb(50000)),                        -- ₹50,000 / month split across contributors
  ('contributor_points',
   '{
      "intel_view": 1,
      "intel_verification": 10,
      "beware_helpful": 5,
      "post_helpful": 2
    }'::jsonb)
on conflict (key) do nothing;

-- ─── 4. Live contributor stats view ─────────────────────────────────────
-- Aggregates real metrics across intel cards, beware reports, community
-- posts. Joins on contributor_slug for intel cards (legacy seed data) and
-- on user_id for beware/post engagement (everything user-submitted post-V0).
create or replace view contributor_stats as
select
  c.slug,
  c.user_id,
  c.name,
  c.full_name,
  c.photo_url,
  -- intel card metrics (joined on contributor_slug)
  coalesce(intel.cards,         0)  as intel_card_count,
  coalesce(intel.views,         0)  as intel_total_views,
  coalesce(intel.verifications, 0)  as intel_verifications,
  -- beware metrics (joined on user_id)
  coalesce(beware.reports,      0)  as beware_count,
  coalesce(beware.helpful,      0)  as beware_total_helpful,
  -- post metrics (joined on user_id)
  coalesce(posts.posts,         0)  as post_count,
  coalesce(posts.helpful,       0)  as post_total_helpful
from contributors c
left join lateral (
  select count(*)                              as cards,
         coalesce(sum(view_count), 0)          as views,
         coalesce(sum(verified_by_count), 0)   as verifications
    from intel_cards
   where contributor_slug = c.slug
) intel on true
left join lateral (
  select count(*)                              as reports,
         coalesce(sum(helpful_count), 0)       as helpful
    from beware_reports
   where reported_by_id = c.user_id
     and status         = 'approved'
) beware on true
left join lateral (
  select count(*)                              as posts,
         coalesce(sum(like_count), 0)          as helpful
    from community_posts
   where author_id = c.user_id
     and status    = 'approved'
) posts on true;

-- ─── 5. Earnings view (transparent formula) ─────────────────────────────
-- Each contributor's points are summed; their share of the pool = points /
-- total_points. If grand total is zero, everyone earns zero (no division by
-- zero). The pool size and per-action point values come from
-- `platform_settings` so they can be tuned without redeploying.
create or replace view contributor_earnings as
with cfg as (
  select
    (select (value)::numeric from platform_settings
       where key = 'contributor_pool_inr_monthly')                       as pool_inr,
    (select (value->>'intel_view')::numeric from platform_settings
       where key = 'contributor_points')                                 as pt_view,
    (select (value->>'intel_verification')::numeric from platform_settings
       where key = 'contributor_points')                                 as pt_verify,
    (select (value->>'beware_helpful')::numeric from platform_settings
       where key = 'contributor_points')                                 as pt_beware,
    (select (value->>'post_helpful')::numeric from platform_settings
       where key = 'contributor_points')                                 as pt_post
),
points as (
  select
    cs.slug,
    cs.user_id,
    cs.intel_total_views     * cfg.pt_view   as pts_view,
    cs.intel_verifications   * cfg.pt_verify as pts_verify,
    cs.beware_total_helpful  * cfg.pt_beware as pts_beware,
    cs.post_total_helpful    * cfg.pt_post   as pts_post,
    (cs.intel_total_views    * cfg.pt_view
     + cs.intel_verifications * cfg.pt_verify
     + cs.beware_total_helpful * cfg.pt_beware
     + cs.post_total_helpful  * cfg.pt_post)                              as total_points
  from contributor_stats cs, cfg
),
totals as (
  select greatest(sum(total_points), 1) as grand_total from points
)
select
  p.slug,
  p.user_id,
  p.pts_view,
  p.pts_verify,
  p.pts_beware,
  p.pts_post,
  p.total_points,
  case
    when t.grand_total > 0 and p.total_points > 0
      then round((p.total_points / t.grand_total) * cfg.pool_inr)::int
    else 0
  end as earnings_inr_monthly
from points p, totals t, cfg;
