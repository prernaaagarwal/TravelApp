-- 006: Community v2 — post titles, tab merge (sister→ask), helpful + report tracking

-- 1. Add title column to community_posts
alter table community_posts
  add column if not exists title text;

-- 2. Backfill title for existing posts: first sentence (split on ?, ., !) capped at 60 chars.
update community_posts
set title = case
  when position('?' in content) between 1 and 60 then substring(content from 1 for position('?' in content))
  when position('.' in content) between 1 and 60 then substring(content from 1 for position('.' in content) - 1)
  when position('!' in content) between 1 and 60 then substring(content from 1 for position('!' in content) - 1)
  when char_length(content) <= 60 then content
  else substring(content from 1 for 57) || '...'
end
where title is null;

-- 3. Make title NOT NULL going forward
alter table community_posts
  alter column title set not null;

-- 4. Tab merge: sister → ask
update community_posts set tab = 'ask' where tab = 'sister';

-- 5. Per-user helpful tracking for community posts
create table if not exists community_post_helpful (
  post_id text not null references community_posts(id) on delete cascade,
  user_id uuid not null references auth.users on delete cascade,
  created_at timestamptz not null default now(),
  primary key (post_id, user_id)
);
alter table community_post_helpful enable row level security;
create policy "Users read own helpful marks" on community_post_helpful
  for select using (auth.uid() = user_id);
create policy "Users insert own helpful" on community_post_helpful
  for insert with check (auth.uid() = user_id);
create policy "Users delete own helpful" on community_post_helpful
  for delete using (auth.uid() = user_id);

-- 6. Post reports (moderation queue)
create table if not exists community_post_reports (
  id uuid primary key default gen_random_uuid(),
  post_id text not null references community_posts(id) on delete cascade,
  reporter_id uuid references auth.users on delete set null,
  reason text,
  created_at timestamptz not null default now()
);
alter table community_post_reports enable row level security;
create policy "Users insert reports" on community_post_reports
  for insert with check (auth.uid() = reporter_id);

-- 7. Per-user helpful tracking for beware reports
create table if not exists beware_helpful (
  report_id uuid not null references beware_reports(id) on delete cascade,
  user_id uuid not null references auth.users on delete cascade,
  created_at timestamptz not null default now(),
  primary key (report_id, user_id)
);
alter table beware_helpful enable row level security;
create policy "Users read own beware helpful" on beware_helpful
  for select using (auth.uid() = user_id);
create policy "Users insert own beware helpful" on beware_helpful
  for insert with check (auth.uid() = user_id);
create policy "Users delete own beware helpful" on beware_helpful
  for delete using (auth.uid() = user_id);

-- 8. Beware reports (moderation queue)
create table if not exists beware_report_flags (
  id uuid primary key default gen_random_uuid(),
  report_id uuid not null references beware_reports(id) on delete cascade,
  reporter_id uuid references auth.users on delete set null,
  reason text,
  created_at timestamptz not null default now()
);
alter table beware_report_flags enable row level security;
create policy "Users insert beware flags" on beware_report_flags
  for insert with check (auth.uid() = reporter_id);
