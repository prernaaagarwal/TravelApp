-- GDPR consent columns on notification_preferences.
--
-- The cookie consent banner stores its state in the user's localStorage,
-- but when the user is signed in we ALSO upsert the decision here so it
-- travels across devices and survives a logout/login cycle.
--
-- All three columns are nullable — null means "we don't have a server-side
-- record yet, fall back to localStorage". They're added via add-column-if-
-- not-exists so this migration is safe to re-run.

alter table notification_preferences
  add column if not exists consent_analytics  boolean,
  add column if not exists consent_marketing  boolean,
  add column if not exists consent_updated_at timestamptz;
