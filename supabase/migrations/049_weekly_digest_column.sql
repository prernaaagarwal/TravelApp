-- Weekly retention digest opt-in column on notification_preferences.
--
-- Default true so existing users get the new digest unless they explicitly
-- opt out. The one-click unsubscribe link in every digest flips this column
-- to false without requiring a login.
--
-- Additive only: no columns dropped, no values changed.

alter table notification_preferences
  add column if not exists weekly_digest_enabled boolean not null default true;
