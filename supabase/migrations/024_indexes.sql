-- Performance indexes for hot read paths and rate-limit counts
-- Safe to re-run: every index uses IF NOT EXISTS

-- ── community_posts ──────────────────────────────────────────────────────────
-- Feed/list pages filter by status and order by created_at desc
CREATE INDEX IF NOT EXISTS idx_community_posts_status_created
  ON community_posts (status, created_at DESC);

-- Tab-specific feeds (e.g. "Q&A", "Trip log")
CREATE INDEX IF NOT EXISTS idx_community_posts_tab_status_created
  ON community_posts (tab, status, created_at DESC);

-- Destination filter (city pages list posts about that city)
CREATE INDEX IF NOT EXISTS idx_community_posts_destination_status
  ON community_posts (destination, status)
  WHERE destination IS NOT NULL;

-- Rate-limit count: posts per user in last N minutes
CREATE INDEX IF NOT EXISTS idx_community_posts_author_created
  ON community_posts (author_id, created_at DESC);

-- ── beware_reports ───────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_beware_reports_status_created
  ON beware_reports (status, created_at DESC);

-- City-specific beware page
CREATE INDEX IF NOT EXISTS idx_beware_reports_city_status
  ON beware_reports (city, status)
  WHERE city IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_beware_reports_destination_status
  ON beware_reports (destination_slug, status)
  WHERE destination_slug IS NOT NULL;

-- Rate-limit count: reports per user in last N minutes
CREATE INDEX IF NOT EXISTS idx_beware_reports_reporter_created
  ON beware_reports (reported_by_id, created_at DESC);

-- ── trip_submissions ─────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_trip_submissions_status_created
  ON trip_submissions (status, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_trip_submissions_destination_status
  ON trip_submissions (destination_slug, status);

-- Rate-limit count: trips per user in last N minutes
CREATE INDEX IF NOT EXISTS idx_trip_submissions_user_created
  ON trip_submissions (user_id, created_at DESC);

-- ── intel_cards ──────────────────────────────────────────────────────────────
-- Country-grouped browsing on /explore
CREATE INDEX IF NOT EXISTS idx_intel_cards_country
  ON intel_cards (country);

-- Contributor attribution lookups
CREATE INDEX IF NOT EXISTS idx_intel_cards_contributor
  ON intel_cards (contributor_slug)
  WHERE contributor_slug IS NOT NULL;
