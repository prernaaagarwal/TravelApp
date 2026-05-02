-- 008: Vault purchases + badge auto-award triggers

-- Vault purchases (used by /settings to show "Manage" vs "Set up")
create table if not exists vault_purchases (
  id uuid default gen_random_uuid() primary key,
  user_id uuid not null references profiles(id) on delete cascade,
  trip_label text,
  status text not null default 'active',
  -- 'active' | 'expired' | 'cancelled'
  expires_at timestamptz,
  created_at timestamptz not null default now()
);
alter table vault_purchases enable row level security;
drop policy if exists "Users read own vault" on vault_purchases;
create policy "Users read own vault" on vault_purchases
  for select using (auth.uid() = user_id);
drop policy if exists "Users insert own vault" on vault_purchases;
create policy "Users insert own vault" on vault_purchases
  for insert with check (auth.uid() = user_id);

-- Partial unique index to ensure one platform-wide badge per (user, badge_type) when destination is null
create unique index if not exists idx_contributor_badges_no_dest
  on contributor_badges (user_id, badge_type)
  where destination_slug is null;

-- Auto-award beware_reporter on approved beware reports
create or replace function public.award_beware_reporter_badge()
returns trigger language plpgsql security definer set search_path = ''
as $$
begin
  if new.status = 'approved' and new.reported_by_id is not null then
    insert into public.contributor_badges (user_id, badge_type, destination_slug)
    values (new.reported_by_id, 'beware_reporter', new.destination_slug)
    on conflict (user_id, badge_type, destination_slug) do nothing;
  end if;
  return new;
end;
$$;

drop trigger if exists badge_on_beware_report on beware_reports;
create trigger badge_on_beware_report
  after insert or update of status on beware_reports
  for each row
  execute function public.award_beware_reporter_badge();

-- Auto-award community_helper on approved community posts
create or replace function public.award_community_helper_badge()
returns trigger language plpgsql security definer set search_path = ''
as $$
begin
  if new.status = 'approved' and new.author_id is not null then
    insert into public.contributor_badges (user_id, badge_type)
    values (new.author_id, 'community_helper')
    on conflict (user_id, badge_type) where destination_slug is null do nothing;
  end if;
  return new;
end;
$$;

drop trigger if exists badge_on_community_post on community_posts;
create trigger badge_on_community_post
  after insert or update of status on community_posts
  for each row
  execute function public.award_community_helper_badge();

-- Auto-award intel_writer when an intel card has a contributor_slug matching a profile.username
create or replace function public.award_intel_writer_badge()
returns trigger language plpgsql security definer set search_path = ''
as $$
declare
  matching_user_id uuid;
begin
  if new.contributor_slug is not null then
    select id into matching_user_id from public.profiles
      where username = new.contributor_slug
      and deleted_at is null
      limit 1;
    if matching_user_id is not null then
      insert into public.contributor_badges (user_id, badge_type, destination_slug)
      values (matching_user_id, 'intel_writer', new.slug)
      on conflict (user_id, badge_type, destination_slug) do nothing;
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists badge_on_intel_card on intel_cards;
create trigger badge_on_intel_card
  after insert or update of contributor_slug on intel_cards
  for each row
  execute function public.award_intel_writer_badge();

-- Backfill existing approved reports
insert into contributor_badges (user_id, badge_type, destination_slug)
select distinct reported_by_id, 'beware_reporter', destination_slug
from beware_reports
where status = 'approved' and reported_by_id is not null
on conflict (user_id, badge_type, destination_slug) do nothing;

-- Backfill existing approved community posters
insert into contributor_badges (user_id, badge_type)
select distinct author_id, 'community_helper'
from community_posts
where status = 'approved' and author_id is not null
on conflict (user_id, badge_type) where destination_slug is null do nothing;

-- Backfill intel writers
insert into contributor_badges (user_id, badge_type, destination_slug)
select distinct p.id, 'intel_writer', i.slug
from intel_cards i
join profiles p on p.username = i.contributor_slug and p.deleted_at is null
where i.contributor_slug is not null
on conflict (user_id, badge_type, destination_slug) do nothing;
