create table if not exists leads (
  id         uuid primary key default gen_random_uuid(),
  email      text not null,
  source     text not null,  -- 'landing-founding' | 'coming-soon' | 'contributor-apply'
  created_at timestamptz not null default now()
);

create index if not exists leads_email_idx on leads(email);
create index if not exists leads_source_idx on leads(source);
