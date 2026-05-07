-- 054_affiliate_conversions.sql
--
-- WHY THIS EXISTS
-- The investor objection we hit at every pitch is: "₹40 RPM is a benchmark,
-- not a measurement. What did *you* actually earn?" Today we have
-- affiliate_clicks (count of users tapping affiliate links). We don't have
-- the other half: how many of those clicks the partner attributed back to
-- a real commission. Without that, every revenue model is theoretical.
--
-- THIS TABLE IS MANUALLY POPULATED.
-- Once a month, the founder pulls the conversions report from each partner
-- dashboard (Amazon Associates, Booking Partner Hub, Airalo, World Nomads)
-- and inserts the rows here. There is NO live API integration — most
-- affiliate networks don't expose one to small accounts. The script
-- /scripts/reconcile-affiliate.ts converts a partner CSV into INSERT SQL.
--
-- Once we have ~6 months of conversions data, we can compute click-to-
-- conversion ratios per partner and stop quoting industry benchmarks.

-- ─── 1. Add partner_brand to safety_products ─────────────────────────────
-- Must come FIRST: the affiliate_reconciliation_monthly view below joins
-- affiliate_clicks → safety_products and reads sp.partner_brand. PostgreSQL
-- resolves view column references at creation time, so the column has to
-- exist before CREATE VIEW runs. Existing rows get NULL and need a one-
-- time backfill (see /scripts/backfill-partner-brand.sql).
alter table safety_products
  add column if not exists partner_brand text;

comment on column safety_products.partner_brand is
  'Affiliate partner this product links to. Used by affiliate_reconciliation_monthly to match clicks to conversions. Examples: amazon, booking, airalo, world_nomads.';

-- ─── 2. affiliate_conversions table ──────────────────────────────────────
create table if not exists affiliate_conversions (
  id                 uuid          primary key default gen_random_uuid(),
  partner            text          not null,           -- e.g. 'amazon', 'booking', 'airalo', 'world_nomads'
  partner_order_id   text,                             -- partner's order/booking ID; nullable when partners aggregate
  product_id         text          references safety_products on delete set null,
  gross_amount_inr   numeric(12,2),                    -- what the customer paid (informational)
  commission_inr     numeric(12,2) not null,           -- what WE earned — the only required money column
  conversion_date    date          not null,           -- date the partner attributed the sale
  click_id           uuid          references affiliate_clicks on delete set null,  -- best-effort link to a click
  notes              text,                             -- "refunded", "30-day window", etc.
  recorded_by        uuid          references auth.users on delete set null,
  recorded_at        timestamptz   not null default now()
);

create index if not exists idx_affiliate_conversions_partner_date
  on affiliate_conversions (partner, conversion_date desc);
create index if not exists idx_affiliate_conversions_product
  on affiliate_conversions (product_id) where product_id is not null;

alter table affiliate_conversions enable row level security;

-- Admin-only writes. Conversions are a money record — moderators don't
-- get insert/update/delete. Reads are also admin-only because gross_amount
-- and partner_order_id are partner-confidential.
create policy "Admins read conversions" on affiliate_conversions
  for select using (
    exists (select 1 from profiles where id = auth.uid() and role = 'admin')
  );

create policy "Admins insert conversions" on affiliate_conversions
  for insert with check (
    exists (select 1 from profiles where id = auth.uid() and role = 'admin')
  );

create policy "Admins update conversions" on affiliate_conversions
  for update using (
    exists (select 1 from profiles where id = auth.uid() and role = 'admin')
  );

-- ─── 3. Reconciliation view ──────────────────────────────────────────────
-- The headline number for diligence: per-partner per-month click count from
-- our side, conversion count + commission from theirs, and the implied
-- click-to-conversion rate. This is the answer to "what's your real RPM."
--
-- Excludes the current month while it's still in flight (partner reports
-- typically lag 7–30 days). Investors care about closed months only.
create or replace view affiliate_reconciliation_monthly as
with clicks_by_month as (
  select
    date_trunc('month', ac.created_at)::date as month,
    sp.partner_brand                          as partner,
    count(*)                                  as clicks
  from affiliate_clicks ac
  left join safety_products sp on sp.id = ac.product_id
  where ac.created_at < date_trunc('month', now())
  group by 1, 2
),
conversions_by_month as (
  select
    date_trunc('month', conversion_date)::date as month,
    partner,
    count(*)                                   as conversions,
    sum(commission_inr)                        as commission_inr,
    sum(gross_amount_inr)                      as gross_inr
  from affiliate_conversions
  where conversion_date < date_trunc('month', now())
  group by 1, 2
)
select
  coalesce(c.month, x.month)             as month,
  coalesce(c.partner, x.partner)         as partner,
  coalesce(c.clicks, 0)                  as clicks,
  coalesce(x.conversions, 0)             as conversions,
  case when coalesce(c.clicks, 0) = 0 then null
       else round(100.0 * coalesce(x.conversions, 0) / c.clicks, 2)
  end                                    as conversion_pct,
  coalesce(x.commission_inr, 0)          as commission_inr,
  coalesce(x.gross_inr, 0)               as gross_inr
from clicks_by_month c
full outer join conversions_by_month x using (month, partner)
order by month desc, partner asc;

comment on view affiliate_reconciliation_monthly is
  'Clicks (our side) vs conversions (partner side) per partner per closed month. The headline diligence number. Excludes the current in-flight month.';
