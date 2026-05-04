-- Storage buckets for admin-managed images
-- Intel card hero images (max 5 MB, images only)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'intel-images',
  'intel-images',
  true,
  5242880,
  ARRAY['image/jpeg', 'image/png', 'image/webp']
) ON CONFLICT (id) DO NOTHING;

-- Contributor profile photos (max 2 MB, images only)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'contributor-photos',
  'contributor-photos',
  true,
  2097152,
  ARRAY['image/jpeg', 'image/png', 'image/webp']
) ON CONFLICT (id) DO NOTHING;

-- Public read: anyone can view images via CDN URL
CREATE POLICY "Public read intel-images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'intel-images');

CREATE POLICY "Public read contributor-photos"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'contributor-photos');

-- Authenticated write: only logged-in users can upload
-- Admin pages are separately auth-guarded at the app layer
CREATE POLICY "Authenticated upload intel-images"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'intel-images');

CREATE POLICY "Authenticated upload contributor-photos"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'contributor-photos');

-- Authenticated update: allow replacing existing files
CREATE POLICY "Authenticated update intel-images"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'intel-images');

CREATE POLICY "Authenticated update contributor-photos"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'contributor-photos');

-- Authenticated delete: allow removing stale files on replace
CREATE POLICY "Authenticated delete intel-images"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'intel-images');

CREATE POLICY "Authenticated delete contributor-photos"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'contributor-photos');
