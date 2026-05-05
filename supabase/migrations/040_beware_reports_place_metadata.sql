-- 040_beware_reports_place_metadata.sql
-- Adds Google Places metadata to beware_reports so submissions can store the
-- canonical place ID + formatted address alongside lat/lng. This lets us:
--   1. Re-resolve coordinates from any geocoder later (place_id is stable)
--   2. Display the formatted name without re-querying Google
--   3. Group reports by exact-same-place even if user typing varies
--
-- Both columns are nullable because:
--   - Existing rows don't have them
--   - Area-level reports ("city-wide", "online") legitimately have no place
--
-- Run in Supabase SQL Editor.

ALTER TABLE beware_reports
  ADD COLUMN IF NOT EXISTS place_id text,
  ADD COLUMN IF NOT EXISTS formatted_address text;

-- Index for future "find duplicate reports of the same scam at the same place"
-- queries — cheap to maintain and useful for moderation.
CREATE INDEX IF NOT EXISTS idx_beware_reports_place_id
  ON beware_reports (place_id)
  WHERE place_id IS NOT NULL;
