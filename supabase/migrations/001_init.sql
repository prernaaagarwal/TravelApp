-- ─────────────────────────────────────────────────────────────────────────────
-- Wander Women — initial schema
-- Run this once in Supabase SQL Editor (Dashboard → SQL Editor → New query)
-- ─────────────────────────────────────────────────────────────────────────────

-- profiles (one row per auth.users entry)
create table if not exists profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  membership_tier text not null default 'free',
  membership_expiry timestamptz,
  segment jsonb,
  created_at timestamptz not null default now()
);
alter table profiles enable row level security;
create policy "Users read own profile" on profiles
  for select using (auth.uid() = id);
create policy "Users update own profile" on profiles
  for update using (auth.uid() = id);

-- auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- intel_cards
create table if not exists intel_cards (
  slug text primary key,
  destination text not null,
  country text not null,
  audience text not null default 'both',
  contributor_slug text,
  last_updated date,
  verified_by_count int not null default 0,
  hero_image_url text,
  tldr jsonb not null default '[]',
  neighborhoods jsonb not null default '[]',
  scams jsonb not null default '[]',
  transport jsonb not null default '[]',
  hidden_gems jsonb not null default '[]',
  pre_book_checklist jsonb not null default '[]',
  dos_and_donts jsonb not null default '{"do":[],"dont":[]}',
  estimated_daily_budget jsonb not null default '{}',
  emergency_numbers jsonb not null default '[]',
  is_premium boolean not null default false,
  premium_preview text,
  affiliate_links jsonb not null default '{}',
  created_at timestamptz not null default now()
);
alter table intel_cards enable row level security;
create policy "Anyone reads intel cards" on intel_cards
  for select using (true);

-- contributors
create table if not exists contributors (
  slug text primary key,
  name text,
  full_name text,
  home_city text,
  age_range text,
  trip_count int not null default 0,
  tagline text,
  bio text,
  photo_url text,
  badges jsonb not null default '[]',
  destinations_contributed jsonb not null default '[]',
  joined_date date,
  earnings_this_month int not null default 0,
  total_contributions int not null default 0,
  answers_in_community int not null default 0,
  instagram text,
  created_at timestamptz not null default now()
);
alter table contributors enable row level security;
create policy "Anyone reads contributors" on contributors
  for select using (true);

-- community_posts
create table if not exists community_posts (
  id text primary key,
  tab text not null,
  author_id uuid references auth.users on delete set null,
  author_name text,
  author_age_range text,
  home_city text,
  content text not null,
  destination text,
  image_urls jsonb not null default '[]',
  status text not null default 'pending',
  reply_count int not null default 0,
  like_count int not null default 0,
  created_at timestamptz not null default now()
);
alter table community_posts enable row level security;
create policy "Anyone reads approved posts" on community_posts
  for select using (status = 'approved');
create policy "Users insert own posts" on community_posts
  for insert with check (auth.uid() = author_id);

-- beware_reports
create table if not exists beware_reports (
  id uuid primary key default gen_random_uuid(),
  destination_slug text,
  city text,
  category text,
  title text not null,
  severity text,
  description text not null,
  reported_by_id uuid references auth.users on delete set null,
  reported_by_name text,
  location text,
  photo_urls jsonb not null default '[]',
  gps_lat float,
  gps_lng float,
  exif_data jsonb,
  status text not null default 'pending',
  helpful_count int not null default 0,
  created_at timestamptz not null default now()
);
alter table beware_reports enable row level security;
create policy "Anyone reads approved reports" on beware_reports
  for select using (status = 'approved');
create policy "Users insert reports" on beware_reports
  for insert with check (auth.uid() = reported_by_id);

-- buddy_matches
create table if not exists buddy_matches (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade,
  first_name text,
  age_range text,
  home_city text,
  destination_slug text,
  travel_start date,
  travel_end date,
  budget_range text,
  travel_style jsonb not null default '[]',
  style_tags jsonb not null default '[]',
  instagram_verified boolean not null default false,
  photo_url text,
  created_at timestamptz not null default now()
);
alter table buddy_matches enable row level security;
create policy "Anyone reads buddy matches" on buddy_matches
  for select using (true);
create policy "Users insert own match" on buddy_matches
  for insert with check (auth.uid() = user_id);

-- buddy_connections
create table if not exists buddy_connections (
  id uuid primary key default gen_random_uuid(),
  from_user_id uuid references auth.users on delete cascade,
  to_match_id uuid references buddy_matches on delete cascade,
  status text not null default 'pending',
  created_at timestamptz not null default now(),
  unique (from_user_id, to_match_id)
);
alter table buddy_connections enable row level security;
create policy "Users read own connections" on buddy_connections
  for select using (auth.uid() = from_user_id);
create policy "Users insert connections" on buddy_connections
  for insert with check (auth.uid() = from_user_id);

-- founding_membership_waitlist
create table if not exists founding_membership_waitlist (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  phone text,
  city text,
  instagram text,
  created_at timestamptz not null default now()
);
alter table founding_membership_waitlist enable row level security;
create policy "Anyone inserts waitlist" on founding_membership_waitlist
  for insert with check (true);

-- safety_products
create table if not exists safety_products (
  id text primary key,
  name text,
  category text,
  why_it_matters text,
  price_range text,
  image_url text,
  amazon_url text,
  display_order int not null default 0,
  created_at timestamptz not null default now()
);
alter table safety_products enable row level security;
create policy "Anyone reads products" on safety_products
  for select using (true);

-- affiliate_clicks
create table if not exists affiliate_clicks (
  id uuid primary key default gen_random_uuid(),
  product_id text references safety_products on delete set null,
  user_id uuid references auth.users on delete set null,
  created_at timestamptz not null default now()
);
alter table affiliate_clicks enable row level security;
create policy "Anyone inserts clicks" on affiliate_clicks
  for insert with check (true);
