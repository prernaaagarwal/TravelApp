-- 041_backfill_city_center_coords.sql
--
-- Backfill gps_lat/gps_lng for legacy beware reports that have a
-- destination_slug but no coordinates. Coordinates come from
-- lib/beware-cities-data.json — same centers used by the heatmap.
--
-- Behavior:
-- - Only touches rows where gps_lat IS NULL (idempotent, safe to re-run)
-- - Pins go to the city center, not the exact incident location.
--   Multiple reports at the same center stack as a single hot cluster
--   on the heatmap — correct visualization for "city known, spot unknown"
-- - New submissions via Places autocomplete continue to get precise
--   coords from Google. This migration only patches the legacy seed data.

UPDATE beware_reports SET gps_lat = 13.7563,  gps_lng = 100.5018  WHERE destination_slug = 'bangkok-thailand'    AND gps_lat IS NULL;
UPDATE beware_reports SET gps_lat = 48.8566,  gps_lng = 2.3522    WHERE destination_slug = 'paris-france'        AND gps_lat IS NULL;
UPDATE beware_reports SET gps_lat = 24.5854,  gps_lng = 73.7125   WHERE destination_slug = 'udaipur-india'       AND gps_lat IS NULL;
UPDATE beware_reports SET gps_lat = 32.2250,  gps_lng = 78.0710   WHERE destination_slug = 'spiti-valley-india'  AND gps_lat IS NULL;
UPDATE beware_reports SET gps_lat = 37.5665,  gps_lng = 126.9780  WHERE destination_slug = 'seoul-south-korea'   AND gps_lat IS NULL;
UPDATE beware_reports SET gps_lat = 25.3176,  gps_lng = 82.9739   WHERE destination_slug = 'varanasi-india'      AND gps_lat IS NULL;
UPDATE beware_reports SET gps_lat = 28.6139,  gps_lng = 77.2090   WHERE destination_slug = 'delhi-india'         AND gps_lat IS NULL;
UPDATE beware_reports SET gps_lat = 19.0760,  gps_lng = 72.8777   WHERE destination_slug = 'mumbai-india'        AND gps_lat IS NULL;
UPDATE beware_reports SET gps_lat = 26.9124,  gps_lng = 75.7873   WHERE destination_slug = 'jaipur-india'        AND gps_lat IS NULL;
UPDATE beware_reports SET gps_lat = 27.1767,  gps_lng = 78.0081   WHERE destination_slug = 'agra-india'          AND gps_lat IS NULL;
UPDATE beware_reports SET gps_lat = 12.9716,  gps_lng = 77.5946   WHERE destination_slug = 'bangalore-india'     AND gps_lat IS NULL;
UPDATE beware_reports SET gps_lat = 13.0827,  gps_lng = 80.2707   WHERE destination_slug = 'chennai-india'       AND gps_lat IS NULL;
UPDATE beware_reports SET gps_lat = 22.5726,  gps_lng = 88.3639   WHERE destination_slug = 'kolkata-india'       AND gps_lat IS NULL;
UPDATE beware_reports SET gps_lat = 32.2396,  gps_lng = 77.1887   WHERE destination_slug = 'manali-india'        AND gps_lat IS NULL;
UPDATE beware_reports SET gps_lat =  9.9312,  gps_lng = 76.2673   WHERE destination_slug = 'kochi-india'         AND gps_lat IS NULL;
UPDATE beware_reports SET gps_lat = 35.6762,  gps_lng = 139.6503  WHERE destination_slug = 'tokyo-japan'         AND gps_lat IS NULL;
UPDATE beware_reports SET gps_lat = 21.0285,  gps_lng = 105.8542  WHERE destination_slug = 'hanoi-vietnam'       AND gps_lat IS NULL;
UPDATE beware_reports SET gps_lat = 25.2048,  gps_lng = 55.2708   WHERE destination_slug = 'dubai-uae'           AND gps_lat IS NULL;
UPDATE beware_reports SET gps_lat = 30.0869,  gps_lng = 78.2676   WHERE destination_slug = 'rishikesh-india'     AND gps_lat IS NULL;
UPDATE beware_reports SET gps_lat = 32.0095,  gps_lng = 77.3148   WHERE destination_slug = 'kasol-india'         AND gps_lat IS NULL;
UPDATE beware_reports SET gps_lat = 15.3350,  gps_lng = 76.4600   WHERE destination_slug = 'hampi-india'         AND gps_lat IS NULL;

-- Catch-all: if the city column has a recognizable value but no
-- destination_slug was set on the row, match by city instead. Same
-- IS NULL guard so we never overwrite a real pin.
UPDATE beware_reports SET gps_lat = 13.7563,  gps_lng = 100.5018  WHERE city ILIKE 'bangkok%'   AND gps_lat IS NULL;
UPDATE beware_reports SET gps_lat = 48.8566,  gps_lng = 2.3522    WHERE city ILIKE 'paris%'     AND gps_lat IS NULL;
UPDATE beware_reports SET gps_lat = 24.5854,  gps_lng = 73.7125   WHERE city ILIKE 'udaipur%'   AND gps_lat IS NULL;
UPDATE beware_reports SET gps_lat = 32.2250,  gps_lng = 78.0710   WHERE (city ILIKE 'spiti%' OR city ILIKE 'kaza%' OR city ILIKE 'lahaul%') AND gps_lat IS NULL;
UPDATE beware_reports SET gps_lat = 37.5665,  gps_lng = 126.9780  WHERE city ILIKE 'seoul%'     AND gps_lat IS NULL;
UPDATE beware_reports SET gps_lat = 25.3176,  gps_lng = 82.9739   WHERE city ILIKE 'varanasi%'  AND gps_lat IS NULL;
