-- 007: Profile v2 — username, badges, saved destinations, notifications, soft delete

-- 1. Add username + deleted_at to profiles
alter table profiles
  add column if not exists username text unique,
  add column if not exists deleted_at timestamptz;

-- 2. Backfill username from email prefix for existing users (skip collisions)
update profiles
set username = split_part(email, '@', 1)
where username is null
  and email is not null
  and not exists (
    select 1 from profiles p2
    where p2.username = split_part(profiles.email, '@', 1)
      and p2.id != profiles.id
  );

-- 3. Update new-user trigger to also set username
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, email, username)
  values (
    new.id,
    new.email,
    split_part(new.email, '@', 1)
  )
  on conflict (id) do update
    set email = excluded.email;
  return new;
end;
$$;

-- 4. Contributor badges
-- destination_slug references intel_cards.slug (no separate destinations table)
create table if not exists contributor_badges (
  id uuid default gen_random_uuid() primary key,
  user_id uuid not null references profiles(id) on delete cascade,
  badge_type text not null,
  -- founding_contributor | intel_writer | beware_reporter | community_helper | local_sister
  destination_slug text references intel_cards(slug) on delete set null,
  awarded_at timestamptz not null default now(),
  unique (user_id, badge_type, destination_slug)
);
alter table contributor_badges enable row level security;
create policy "Public read badges" on contributor_badges
  for select using (true);
create policy "Users read own badges" on contributor_badges
  for select using (auth.uid() = user_id);

-- 5. Saved destinations (bookmarks)
create table if not exists saved_destinations (
  id uuid default gen_random_uuid() primary key,
  user_id uuid not null references profiles(id) on delete cascade,
  destination_slug text not null references intel_cards(slug) on delete cascade,
  saved_at timestamptz not null default now(),
  unique (user_id, destination_slug)
);
alter table saved_destinations enable row level security;
create policy "Users manage own saves" on saved_destinations
  for all using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- 6. Notification preferences
create table if not exists notification_preferences (
  id uuid default gen_random_uuid() primary key,
  user_id uuid not null references profiles(id) on delete cascade unique,
  new_beware_in_saved_destinations bool not null default true,
  buddy_match_found bool not null default true,
  community_reply_to_my_post bool not null default true,
  platform_updates bool not null default false,
  whatsapp_enabled bool not null default false,
  email_enabled bool not null default true,
  updated_at timestamptz not null default now()
);
alter table notification_preferences enable row level security;
create policy "Users manage own notifications" on notification_preferences
  for all using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
