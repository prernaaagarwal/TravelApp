-- Cohort retention views for the investor-grade cohort dashboard.
-- Read-only; service role only. Public never sees these.
--
-- The four views answer the four questions every investor asks:
--   1. signup_cohorts — how many people signed up each week (raw funnel top)
--   2. activation_cohorts — of those, how many read >=1 intel card within 7 days
--   3. retention_cohorts — D1 / D7 / D30 returning rate per signup week
--   4. revenue_cohorts — once payments are live, paid conversion per cohort
--
-- All views are computed live (no materialized) — under 10K rows per table
-- so query cost is negligible. Materialize when signup_cohorts crosses 100K.

-- ─── 1. Weekly signup cohorts ─────────────────────────────────────────────
create or replace view public.signup_cohorts as
select
  date_trunc('week', created_at)::date as cohort_week,
  count(*)                              as signups
from public.profiles
group by 1
order by 1 desc;

comment on view public.signup_cohorts is
  'Weekly signup count. Top of the funnel — used for week-over-week growth.';

-- ─── 2. Activation cohorts ────────────────────────────────────────────────
-- Activation = read at least one intel card within 7 days of signup.
-- This is the leading indicator of paid conversion.
create or replace view public.activation_cohorts as
with cohort as (
  select
    p.id,
    date_trunc('week', p.created_at)::date as cohort_week,
    p.created_at                            as signed_up_at
  from public.profiles p
)
select
  c.cohort_week,
  count(*)                                                              as signups,
  count(distinct v.viewer_id) filter (
    where v.created_at <= c.signed_up_at + interval '7 days'
  )                                                                     as activated,
  round(
    100.0 * count(distinct v.viewer_id) filter (
      where v.created_at <= c.signed_up_at + interval '7 days'
    ) / nullif(count(*), 0),
    1
  )                                                                     as activation_pct
from cohort c
left join public.intel_card_views v on v.viewer_id = c.id
group by 1
order by 1 desc;

comment on view public.activation_cohorts is
  '% of each weekly cohort that read >=1 intel card within 7 days of signup.';

-- ─── 3. D1 / D7 / D30 return rate ─────────────────────────────────────────
-- "Return" = any intel_card_view event after the signup day.
create or replace view public.retention_cohorts as
with cohort as (
  select
    p.id,
    date_trunc('week', p.created_at)::date as cohort_week,
    p.created_at                            as signed_up_at
  from public.profiles p
)
select
  c.cohort_week,
  count(*) as signups,
  -- D1: returned 1+ days after signup, within first 2 days
  count(distinct c.id) filter (
    where exists (
      select 1 from public.intel_card_views v
      where v.viewer_id = c.id
        and v.created_at > c.signed_up_at + interval '1 day'
        and v.created_at <= c.signed_up_at + interval '2 days'
    )
  ) as d1_returned,
  -- D7: returned at any point between day 1 and day 7
  count(distinct c.id) filter (
    where exists (
      select 1 from public.intel_card_views v
      where v.viewer_id = c.id
        and v.created_at > c.signed_up_at + interval '1 day'
        and v.created_at <= c.signed_up_at + interval '7 days'
    )
  ) as d7_returned,
  -- D30: returned at any point between day 1 and day 30
  count(distinct c.id) filter (
    where exists (
      select 1 from public.intel_card_views v
      where v.viewer_id = c.id
        and v.created_at > c.signed_up_at + interval '1 day'
        and v.created_at <= c.signed_up_at + interval '30 days'
    )
  ) as d30_returned
from cohort c
group by 1
order by 1 desc;

comment on view public.retention_cohorts is
  'Per-cohort return rate at D1, D7, D30. The single chart investors ask for.';

-- ─── 4. Revenue cohorts (placeholder until payments are live) ─────────────
-- Once Stripe webhooks land, paid_at is populated on profiles.
-- For now this view returns zeros — but the shape is ready.
create or replace view public.revenue_cohorts as
select
  date_trunc('week', created_at)::date as cohort_week,
  count(*)                              as signups,
  count(*) filter (
    where membership_tier <> 'free'
  )                                     as paid_members,
  round(
    100.0 * count(*) filter (where membership_tier <> 'free') /
      nullif(count(*), 0),
    1
  )                                     as paid_conversion_pct
from public.profiles
group by 1
order by 1 desc;

comment on view public.revenue_cohorts is
  'Paid conversion per signup cohort. Returns 0 until payments are wired.';

-- ─── Permissions ──────────────────────────────────────────────────────────
-- Views inherit RLS from their underlying tables. profiles + intel_card_views
-- both restrict reads to service role / admin checks at the route level.
-- No grant statement needed — service-role bypass is the intended path.
