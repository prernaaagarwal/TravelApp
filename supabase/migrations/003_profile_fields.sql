alter table profiles
  add column if not exists first_name text,
  add column if not exists home_city text,
  add column if not exists instagram text,
  add column if not exists phone text;
