create table if not exists email_captures (
  id uuid default gen_random_uuid() primary key,
  email text not null,
  source text default 'exit-intent',
  created_at timestamptz default now()
);

alter table email_captures enable row level security;

create policy "Anyone can insert email captures" on email_captures
  for insert with check (true);
