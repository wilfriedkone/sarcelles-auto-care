-- Espace admin : notes internes sur les demandes, suppression (RGPD),
-- galerie photos gérée par le garage.

-- 1. Demandes : note interne + suppression par un admin
ALTER TABLE public.quote_requests ADD COLUMN IF NOT EXISTS admin_note text;
GRANT DELETE ON public.quote_requests TO authenticated;
DROP POLICY IF EXISTS "Admins can delete requests" ON public.quote_requests;
CREATE POLICY "Admins can delete requests" ON public.quote_requests
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- 2. Galerie photos
CREATE TABLE IF NOT EXISTS public.gallery_photos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  storage_path text NOT NULL UNIQUE,
  alt text NOT NULL DEFAULT '',
  position integer NOT NULL DEFAULT 0,
  published boolean NOT NULL DEFAULT true,
  width integer,
  height integer,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS gallery_photos_position_idx ON public.gallery_photos (position, created_at);

ALTER TABLE public.gallery_photos ENABLE ROW LEVEL SECURITY;
GRANT SELECT ON public.gallery_photos TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.gallery_photos TO authenticated;
GRANT ALL ON public.gallery_photos TO service_role;

DROP POLICY IF EXISTS "Public can read published photos" ON public.gallery_photos;
CREATE POLICY "Public can read published photos" ON public.gallery_photos
  FOR SELECT TO anon, authenticated
  USING (published OR public.has_role(auth.uid(), 'admin'));
DROP POLICY IF EXISTS "Admins manage photos" ON public.gallery_photos;
CREATE POLICY "Admins manage photos" ON public.gallery_photos
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- 3. Stockage des fichiers : bucket public en lecture, écriture admin uniquement
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('galerie', 'galerie', true, 5242880, ARRAY['image/webp', 'image/jpeg', 'image/png'])
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

DROP POLICY IF EXISTS "Galerie : lecture publique" ON storage.objects;
CREATE POLICY "Galerie : lecture publique" ON storage.objects
  FOR SELECT USING (bucket_id = 'galerie');
DROP POLICY IF EXISTS "Galerie : ajout admin" ON storage.objects;
CREATE POLICY "Galerie : ajout admin" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'galerie' AND public.has_role(auth.uid(), 'admin'));
DROP POLICY IF EXISTS "Galerie : modification admin" ON storage.objects;
CREATE POLICY "Galerie : modification admin" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'galerie' AND public.has_role(auth.uid(), 'admin'));
DROP POLICY IF EXISTS "Galerie : suppression admin" ON storage.objects;
CREATE POLICY "Galerie : suppression admin" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'galerie' AND public.has_role(auth.uid(), 'admin'));
