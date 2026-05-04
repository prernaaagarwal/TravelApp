-- 033_feedback.sql
-- Temporary feedback form for founding members and early users.
-- Anyone (logged in or not) can submit; user_id captured when present.
-- Admins read via service-role key; submitters can read their own rows.

create table if not exists feedback (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete set null,
  source text not null default 'founding-feedback',

  -- 1. What brought you here? — single choice
  -- expected values: 'planning', 'research', 'recommended', 'other'
  what_brought_you text,

  -- 2. Did the app help you feel more prepared/safer? — 1..5
  prepared_score int check (prepared_score is null or (prepared_score between 1 and 5)),

  -- 3. ONE thing you liked most
  liked_most text,

  -- 4. Frustrated / didn't work
  frustrated text,

  -- 5. Confusing / hard to find
  confusing text,

  -- 6. Most important thing we're missing
  missing text,

  -- 7. NPS — 0..10
  nps int check (nps is null or (nps between 0 and 10)),

  -- 8. Optional follow-up email
  follow_up_email text,

  created_at timestamptz not null default now()
);

alter table feedback enable row level security;

-- Anyone can submit feedback (anonymous or authenticated)
create policy "Anyone inserts feedback" on feedback
  for insert with check (true);

-- Authenticated users can read their own feedback rows
create policy "Users read own feedback" on feedback
  for select using (auth.uid() = user_id);

-- Useful for admin sorting + dashboards
create index if not exists feedback_created_at_idx on feedback (created_at desc);
create index if not exists feedback_source_idx on feedback (source);
