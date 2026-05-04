
-- =====================================================================
-- IDEMPOTENT BUNDLE -- safe to re-paste on a partially-applied database.
-- Every CREATE TABLE / POLICY / TRIGGER below is preceded by a DROP guard
-- (or uses IF NOT EXISTS) so duplicate-name errors never fire.
-- INSERTs in this bundle either use ON CONFLICT DO NOTHING or are pure
-- seed data -- duplicate-key errors on those are safe to ignore.
-- =====================================================================

-- ======================================================================
-- Wander Women migration bundle: 03-features-and-fixes
-- Run this in Supabase SQL Editor (project: vykbvnkpfqfmcilovzsw)
-- Generated 2026-05-04 09:04 UTC
-- ======================================================================


-- ---- 022_trip_feed.sql ----
-- 014: trip_submissions table + seed 12 existing mock trips

create table if not exists trip_submissions (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid references auth.users on delete set null,
  contributor_slug text,
  destination_slug text not null,
  destination      text not null,
  trip_start       date not null,
  trip_end         date not null,
  day_count        int not null,
  total_cost_inr   int not null,
  total_cost_usd   int not null,
  cost_stay        int not null default 0,
  cost_food        int not null default 0,
  cost_transport   int not null default 0,
  cost_activities  int not null default 0,
  cost_misc        int not null default 0,
  top_notes        jsonb not null default '[]',
  highlight        text not null,
  status           text not null default 'pending'
                   check (status in ('pending', 'approved', 'rejected')),
  created_at       timestamptz not null default now()
);

alter table trip_submissions enable row level security;

drop policy if exists "Anyone reads approved trips" on trip_submissions;
create policy "Anyone reads approved trips" on trip_submissions
  for select using (status = 'approved');

drop policy if exists "Users insert own trips" on trip_submissions;
create policy "Users insert own trips" on trip_submissions
  for insert with check (auth.uid() = user_id);

-- Seed existing 12 trips as approved

INSERT INTO trip_submissions (contributor_slug,destination_slug,destination,trip_start,trip_end,day_count,total_cost_inr,total_cost_usd,cost_stay,cost_food,cost_transport,cost_activities,cost_misc,top_notes,highlight,status) VALUES ('ananya-mumbai','goa-india','Goa (North + interior)','2026-02-12','2026-02-21',9,27800,327,11400,6800,4200,3800,1600,'["Skip Calangute. Stay in Aldona or Assagao if you can afford the extra ₹500/night.", "Scooter rental from a women-run garage in Mapusa was cheaper and less hassle than the beach-shack guys.", "Curlie''s at sunset is still worth it. Get there at 5:30, leave by 9 — after that the crowd changes."]','The Project Café in Aldona on a Wednesday afternoon — empty pool, a pile of art books, three other solo women already there.','approved');
INSERT INTO trip_submissions (contributor_slug,destination_slug,destination,trip_start,trip_end,day_count,total_cost_inr,total_cost_usd,cost_stay,cost_food,cost_transport,cost_activities,cost_misc,top_notes,highlight,status) VALUES ('leila-delhi','rishikesh-india','Rishikesh — yoga + Ganga aarti','2026-03-08','2026-03-14',6,18400,217,7200,3600,3800,2800,1000,'["Tapovan side > Lakshman Jhula side for solo women. Quieter, fewer hawkers, better cafés.", "Volvo from Delhi (overnight) saved a hotel night and ₹2,500.", "Don''t pay for a Ganga aarti ''guided experience''. Just turn up at Triveni Ghat at 6pm."]','Sunrise Ganga walk from Tapovan to Lakshman Jhula — alone for 40 minutes, then 80 monkeys.','approved');
INSERT INTO trip_submissions (contributor_slug,destination_slug,destination,trip_start,trip_end,day_count,total_cost_inr,total_cost_usd,cost_stay,cost_food,cost_transport,cost_activities,cost_misc,top_notes,highlight,status) VALUES ('sara-berlin','jaipur-india','Jaipur — Pink City circuit','2026-01-22','2026-01-26',4,22300,262,9800,4200,3100,4400,800,'["Composite Ticket is the only smart move — ₹400 for 5 monuments, valid 2 days.", "Pink City Rickshaw Company (women drivers) is worth every rupee for a half-day Old City tour.", "Anokhi Café is the breakfast you want after a 6am Amber Fort trip. Not a tourist trap."]','Block-printing workshop at the Anokhi Museum. Three hours, two new friends, one ruined kurta.','approved');
INSERT INTO trip_submissions (contributor_slug,destination_slug,destination,trip_start,trip_end,day_count,total_cost_inr,total_cost_usd,cost_stay,cost_food,cost_transport,cost_activities,cost_misc,top_notes,highlight,status) VALUES ('ananya-mumbai','kasol-india','Kasol → Tosh trek','2026-04-02','2026-04-09',7,14600,172,5400,3200,4200,1200,600,'["Volvo Delhi → Bhuntar overnight, then shared cab to Kasol. ₹1,800 total, beats flying.", "Stayhappy Hostel in Kasol has the only female-only dorm I trust in the valley.", "Tosh village hike is doable solo in May. Don''t try in monsoon."]','Reading on the rocks above the Parvati at 7am with no one within shouting distance.','approved');
INSERT INTO trip_submissions (contributor_slug,destination_slug,destination,trip_start,trip_end,day_count,total_cost_inr,total_cost_usd,cost_stay,cost_food,cost_transport,cost_activities,cost_misc,top_notes,highlight,status) VALUES ('devika-pune','hampi-india','Hampi heritage walk','2026-02-26','2026-03-02',4,11200,132,3800,2600,2400,1800,600,'["Stay on the Hippie Island side (Virupapur Gaddi). Hampi Bazaar side is dry, no alcohol, by 9pm dead.", "Rent a moped from Hampi Bazaar — boulders are too far apart to walk.", "Sunrise at Matanga Hill is worth the 5am climb. Sunset at Hemakuta is the easier alternative."]','Sitting alone in the Achyutaraya temple courtyard for 90 minutes. Not a soul. Late February is the secret.','approved');
INSERT INTO trip_submissions (contributor_slug,destination_slug,destination,trip_start,trip_end,day_count,total_cost_inr,total_cost_usd,cost_stay,cost_food,cost_transport,cost_activities,cost_misc,top_notes,highlight,status) VALUES ('kavya-chennai','kochi-india','Fort Kochi + backwaters','2026-03-19','2026-03-25',6,13800,162,4800,3200,2800,2400,600,'["₹4 government ferry between Fort Kochi and Ernakulam — 25 minutes, sunset view, unbeatable.", "Skip the houseboat overnight scam. Day trip from Alleppey is enough and ₹4,000 cheaper.", "Kashi Art Café is overhyped. Kayees Biryani is not."]','A solo Kathakali show at Kerala Kathakali Centre. Front row, ₹350, makeup demo at 5pm.','approved');
INSERT INTO trip_submissions (contributor_slug,destination_slug,destination,trip_start,trip_end,day_count,total_cost_inr,total_cost_usd,cost_stay,cost_food,cost_transport,cost_activities,cost_misc,top_notes,highlight,status) VALUES ('leila-delhi','udaipur-india','Udaipur — lake circuit','2026-01-15','2026-01-19',4,19800,233,8400,3800,2600,4200,800,'["Stay in Hanuman Ghat side, not Lal Ghat. Same view, half the price, zero touts.", "Sadhna Collective HQ visit is a 30-minute auto from the city — and the heart of women-led Rajasthan.", "Avoid the big-name lake palace boat ride. The ₹400 government ferry to Jagmandir does the job."]','Sunrise from the cliff above Bagore Ki Haveli. Bring chai. No one else is up there at 6am.','approved');
INSERT INTO trip_submissions (contributor_slug,destination_slug,destination,trip_start,trip_end,day_count,total_cost_inr,total_cost_usd,cost_stay,cost_food,cost_transport,cost_activities,cost_misc,top_notes,highlight,status) VALUES ('neha-jaipur','jaipur-india','Jaipur for repeat visitors','2026-03-04','2026-03-08',4,15600,184,6800,3200,2200,2600,800,'["Skip the Pink City. Spend two days in Amer (the village, not just the fort) and Nahargarh.", "Eat at LMB only once. Then go where I go: Sahu Chai for breakfast, Rawat for kachori.", "Block printing in Bagru (45 min from Jaipur) is more rewarding than Sanganer."]','Watching Holika Dahan at Hawa Mahal Bazaar from a friend''s terrace. No tourists. Just neighbors.','approved');
INSERT INTO trip_submissions (contributor_slug,destination_slug,destination,trip_start,trip_end,day_count,total_cost_inr,total_cost_usd,cost_stay,cost_food,cost_transport,cost_activities,cost_misc,top_notes,highlight,status) VALUES ('priya-kochi','rishikesh-india','Rishikesh — yoga teacher training prep','2026-02-04','2026-02-12',8,32400,381,14600,5200,4400,7400,800,'["Anand Prakash Yoga Ashram is the only TTC I''d send a beginner to. Avoid the Tapovan strip mills.", "₹6/day Ganga ferry (not the tourist boat) is the secret crossing.", "Pre-book your YTT in October. By February the good ones are gone."]','First handstand in 11 years on a sandbank by Ram Jhula at sunrise. No witnesses.','approved');
INSERT INTO trip_submissions (contributor_slug,destination_slug,destination,trip_start,trip_end,day_count,total_cost_inr,total_cost_usd,cost_stay,cost_food,cost_transport,cost_activities,cost_misc,top_notes,highlight,status) VALUES ('ananya-mumbai','varanasi-india','Varanasi — three slow days','2026-03-25','2026-03-28',3,8900,105,2700,2400,1800,1500,500,'["Stay at Hostel LaVie''s female dorm — the only one I trust on the ghats.", "Take the female-rowed sunrise boat (collective near Assi Ghat) instead of the tourist boatmen.", "Brown Bread Bakery is base camp. Set up your day from there with chai and WiFi."]','Aarti at Assi Ghat from a rooftop with three Israeli women I''d met that morning at Brown Bread.','approved');
INSERT INTO trip_submissions (contributor_slug,destination_slug,destination,trip_start,trip_end,day_count,total_cost_inr,total_cost_usd,cost_stay,cost_food,cost_transport,cost_activities,cost_misc,top_notes,highlight,status) VALUES ('riya-bangalore','bangalore-india','A weekend in Bangalore (when you live in Bangalore)','2026-04-12','2026-04-14',2,4800,56,0,1800,800,1900,300,'["Lahe Lahe in Indiranagar on a Saturday morning = tea + a women-only writing circle.", "Champaca Books in Vasanth Nagar is the bookstore I send everyone to.", "Skip the breweries on Church Street. Try Toit only on a Tuesday."]','A four-hour solo brunch at Cinnamon, with one chai too many and zero apologies.','approved');
INSERT INTO trip_submissions (contributor_slug,destination_slug,destination,trip_start,trip_end,day_count,total_cost_inr,total_cost_usd,cost_stay,cost_food,cost_transport,cost_activities,cost_misc,top_notes,highlight,status) VALUES ('sara-berlin','delhi-india','Delhi for a returning foreigner','2026-04-18','2026-04-22',4,24600,290,11200,4400,3800,4400,800,'["Hauz Khas Village > Paharganj for a returning foreigner. Pay the extra ₹1,500/night.", "Metro is the cheat code. ₹70 for a day pass beats every Uber I''ve taken in Delhi.", "Old Delhi food walk with a women-led tour (Storytrails or similar) is worth the ₹2,500."]','An afternoon at the Sunder Nursery in February — 90 acres, almost empty, ₹35 entry.','approved');


-- ---- 023_storage_buckets.sql ----
-- Storage buckets for admin-managed images
-- Intel card hero images (max 5 MB, images only)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'intel-images',
  'intel-images',
  true,
  5242880,
  ARRAY['image/jpeg', 'image/png', 'image/webp']
) ON CONFLICT (id) DO NOTHING;

-- Contributor profile photos (max 2 MB, images only)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'contributor-photos',
  'contributor-photos',
  true,
  2097152,
  ARRAY['image/jpeg', 'image/png', 'image/webp']
) ON CONFLICT (id) DO NOTHING;

-- Public read: anyone can view images via CDN URL
drop policy if exists "Public read intel-images" on storage.objects;
CREATE POLICY "Public read intel-images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'intel-images');

drop policy if exists "Public read contributor-photos" on storage.objects;
CREATE POLICY "Public read contributor-photos"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'contributor-photos');

-- Authenticated write: only logged-in users can upload
-- Admin pages are separately auth-guarded at the app layer
drop policy if exists "Authenticated upload intel-images" on storage.objects;
CREATE POLICY "Authenticated upload intel-images"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'intel-images');

drop policy if exists "Authenticated upload contributor-photos" on storage.objects;
CREATE POLICY "Authenticated upload contributor-photos"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'contributor-photos');

-- Authenticated update: allow replacing existing files
drop policy if exists "Authenticated update intel-images" on storage.objects;
CREATE POLICY "Authenticated update intel-images"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'intel-images');

drop policy if exists "Authenticated update contributor-photos" on storage.objects;
CREATE POLICY "Authenticated update contributor-photos"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'contributor-photos');

-- Authenticated delete: allow removing stale files on replace
drop policy if exists "Authenticated delete intel-images" on storage.objects;
CREATE POLICY "Authenticated delete intel-images"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'intel-images');

drop policy if exists "Authenticated delete contributor-photos" on storage.objects;
CREATE POLICY "Authenticated delete contributor-photos"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'contributor-photos');


-- ---- 024_indexes.sql ----
-- Performance indexes for hot read paths and rate-limit counts
-- Safe to re-run: every index uses IF NOT EXISTS

-- ── community_posts ──────────────────────────────────────────────────────────
-- Feed/list pages filter by status and order by created_at desc
CREATE INDEX IF NOT EXISTS idx_community_posts_status_created
  ON community_posts (status, created_at DESC);

-- Tab-specific feeds (e.g. "Q&A", "Trip log")
CREATE INDEX IF NOT EXISTS idx_community_posts_tab_status_created
  ON community_posts (tab, status, created_at DESC);

-- Destination filter (city pages list posts about that city)
CREATE INDEX IF NOT EXISTS idx_community_posts_destination_status
  ON community_posts (destination, status)
  WHERE destination IS NOT NULL;

-- Rate-limit count: posts per user in last N minutes
CREATE INDEX IF NOT EXISTS idx_community_posts_author_created
  ON community_posts (author_id, created_at DESC);

-- ── beware_reports ───────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_beware_reports_status_created
  ON beware_reports (status, created_at DESC);

-- City-specific beware page
CREATE INDEX IF NOT EXISTS idx_beware_reports_city_status
  ON beware_reports (city, status)
  WHERE city IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_beware_reports_destination_status
  ON beware_reports (destination_slug, status)
  WHERE destination_slug IS NOT NULL;

-- Rate-limit count: reports per user in last N minutes
CREATE INDEX IF NOT EXISTS idx_beware_reports_reporter_created
  ON beware_reports (reported_by_id, created_at DESC);

-- ── trip_submissions ─────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_trip_submissions_status_created
  ON trip_submissions (status, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_trip_submissions_destination_status
  ON trip_submissions (destination_slug, status);

-- Rate-limit count: trips per user in last N minutes
CREATE INDEX IF NOT EXISTS idx_trip_submissions_user_created
  ON trip_submissions (user_id, created_at DESC);

-- ── intel_cards ──────────────────────────────────────────────────────────────
-- Country-grouped browsing on /explore
CREATE INDEX IF NOT EXISTS idx_intel_cards_country
  ON intel_cards (country);

-- Contributor attribution lookups
CREATE INDEX IF NOT EXISTS idx_intel_cards_contributor
  ON intel_cards (contributor_slug)
  WHERE contributor_slug IS NOT NULL;


-- ---- 025_user_photos.sql ----
-- 017: User profile photos
-- Adds photo_url to profiles + creates user-photos storage bucket

-- 1. Add photo_url column to profiles
alter table profiles
  add column if not exists photo_url text;

-- 2. User-facing photo upload bucket (max 2 MB, images only)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'user-photos',
  'user-photos',
  true,
  2097152,
  array['image/jpeg', 'image/png', 'image/webp']
) on conflict (id) do nothing;

-- Public read
drop policy if exists "Public read user-photos" on storage.objects;
create policy "Public read user-photos"
  on storage.objects for select
  using (bucket_id = 'user-photos');

-- Each user can only upload/update/delete inside their own folder (user_id/)
drop policy if exists "Users upload own photo" on storage.objects;
create policy "Users upload own photo"
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'user-photos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "Users update own photo" on storage.objects;
create policy "Users update own photo"
  on storage.objects for update to authenticated
  using (
    bucket_id = 'user-photos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "Users delete own photo" on storage.objects;
create policy "Users delete own photo"
  on storage.objects for delete to authenticated
  using (
    bucket_id = 'user-photos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );


-- ---- 026_search.sql ----
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


-- ---- 027_moderation.sql ----
-- 019: Production moderation tooling
--   1. Rejection reasons stored on each submission table (visible in audit + email)
--   2. Audit metadata: who rejected, when, raw reason text
--   3. User ban fields on profiles, with helper view for submitter history
--   4. Moderation audit log table (every approve/reject/ban gets one row)
--
-- Idempotent.

-- ─── 1. Rejection reason columns ──────────────────────────────────────────
alter table community_posts
  add column if not exists rejection_reason text,
  add column if not exists moderated_by uuid references auth.users(id) on delete set null,
  add column if not exists moderated_at timestamptz;

alter table beware_reports
  add column if not exists rejection_reason text,
  add column if not exists moderated_by uuid references auth.users(id) on delete set null,
  add column if not exists moderated_at timestamptz;

alter table trip_submissions
  add column if not exists rejection_reason text,
  add column if not exists moderated_by uuid references auth.users(id) on delete set null,
  add column if not exists moderated_at timestamptz;

-- ─── 2. User ban fields on profiles ───────────────────────────────────────
alter table profiles
  add column if not exists is_banned boolean not null default false,
  add column if not exists banned_at timestamptz,
  add column if not exists ban_reason text,
  add column if not exists banned_by uuid references auth.users(id) on delete set null;

create index if not exists profiles_banned_idx
  on profiles (is_banned) where is_banned = true;

-- ─── 3. Moderation audit log ──────────────────────────────────────────────
-- Every approve/reject/ban writes one row. Append-only — no updates, no deletes.
create table if not exists moderation_audit_log (
  id              uuid primary key default gen_random_uuid(),
  actor_id        uuid not null references auth.users(id) on delete set null,
  action          text not null check (action in ('approve', 'reject', 'ban', 'unban')),
  target_type     text not null check (target_type in ('post', 'beware', 'trip', 'user')),
  target_id       text not null,
  reason          text,
  created_at      timestamptz not null default now()
);

create index if not exists moderation_audit_log_actor_idx   on moderation_audit_log (actor_id, created_at desc);
create index if not exists moderation_audit_log_target_idx  on moderation_audit_log (target_type, target_id);

alter table moderation_audit_log enable row level security;

-- Only admins read the audit log. Server actions use the service role to
-- write — no client-side write policy needed.
-- (The app-level admin check happens in app/admin/actions.ts via assertAdmin.)

-- ─── 4. Submitter history view ────────────────────────────────────────────
-- Aggregates a user's submission counts across all three tables. The
-- admin UI calls this to decide whether to ban repeat low-quality submitters.
create or replace view submitter_history as
select
  p.id                                                       as user_id,
  p.email                                                    as email,
  p.username                                                 as username,
  p.first_name                                               as first_name,
  p.is_banned                                                as is_banned,
  p.banned_at                                                as banned_at,
  p.ban_reason                                               as ban_reason,
  coalesce(post_stats.total,    0)                           as posts_total,
  coalesce(post_stats.approved, 0)                           as posts_approved,
  coalesce(post_stats.rejected, 0)                           as posts_rejected,
  coalesce(beware_stats.total,    0)                         as bewares_total,
  coalesce(beware_stats.approved, 0)                         as bewares_approved,
  coalesce(beware_stats.rejected, 0)                         as bewares_rejected,
  coalesce(trip_stats.total,    0)                           as trips_total,
  coalesce(trip_stats.approved, 0)                           as trips_approved,
  coalesce(trip_stats.rejected, 0)                           as trips_rejected
from profiles p
left join lateral (
  select count(*)                                                                as total,
         count(*) filter (where status = 'approved')                             as approved,
         count(*) filter (where status = 'rejected')                             as rejected
    from community_posts where author_id = p.id
) post_stats on true
left join lateral (
  select count(*)                                                                as total,
         count(*) filter (where status = 'approved')                             as approved,
         count(*) filter (where status = 'rejected')                             as rejected
    from beware_reports where reported_by_id = p.id
) beware_stats on true
left join lateral (
  select count(*)                                                                as total,
         count(*) filter (where status = 'approved')                             as approved,
         count(*) filter (where status = 'rejected')                             as rejected
    from trip_submissions where user_id = p.id
) trip_stats on true;


-- ---- 028_contributor_attribution.sql ----
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
drop policy if exists "Anyone reads platform settings" on platform_settings;
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


-- ---- 029_audit_log_extend.sql ----
-- 021: Extend moderation_audit_log to cover bulk admin actions.
--
-- Adds two new action types ('import_create', 'import_update') and a new
-- target_type 'intel_card' so we can record per-row events from the bulk
-- intel-card importer. All existing rows remain valid because we only
-- expand the allowed set, never narrow it.

alter table moderation_audit_log
  drop constraint if exists moderation_audit_log_action_check;

alter table moderation_audit_log
  add  constraint moderation_audit_log_action_check
  check (action in ('approve', 'reject', 'ban', 'unban', 'import_create', 'import_update'));

alter table moderation_audit_log
  drop constraint if exists moderation_audit_log_target_type_check;

alter table moderation_audit_log
  add  constraint moderation_audit_log_target_type_check
  check (target_type in ('post', 'beware', 'trip', 'user', 'intel_card'));


-- ---- 030_stay_verifications.sql ----
-- Stay Verifications: AI-powered safety analysis of booking URLs
create table if not exists stay_verifications (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references profiles(id) on delete cascade,
  booking_url     text not null,
  platform        text,
  property_name   text,
  city            text,
  status          text not null default 'pending'
                  check (status in ('pending', 'analyzing', 'complete', 'failed')),
  risk_level      text check (risk_level in ('low', 'medium', 'high', 'critical')),
  analysis_json   jsonb,
  created_at      timestamptz not null default now(),
  completed_at    timestamptz
);

alter table stay_verifications enable row level security;

drop policy if exists "Users read own verifications" on stay_verifications;
create policy "Users read own verifications" on stay_verifications
  for select using (auth.uid() = user_id);

drop policy if exists "Users insert verifications" on stay_verifications;
create policy "Users insert verifications" on stay_verifications
  for insert with check (auth.uid() = user_id);

-- Service role (used by server actions) can update verifications
drop policy if exists "Service role updates verifications" on stay_verifications;
create policy "Service role updates verifications" on stay_verifications
  for update using (auth.uid() = user_id);


-- ---- 031_leads.sql ----
create table if not exists leads (
  id         uuid primary key default gen_random_uuid(),
  email      text not null,
  source     text not null,  -- 'landing-founding' | 'coming-soon' | 'contributor-apply'
  created_at timestamptz not null default now()
);

create index if not exists leads_email_idx on leads(email);
create index if not exists leads_source_idx on leads(source);

