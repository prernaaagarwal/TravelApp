alter table community_posts
  add column if not exists image_urls jsonb default '[]'::jsonb;
