GRANT SELECT ON TABLE public.reclamation_tracks TO anon, authenticated;

DROP POLICY IF EXISTS "Public can read active published reclamation tracks"
  ON public.reclamation_tracks;

CREATE POLICY "Public can read active published reclamation tracks"
  ON public.reclamation_tracks
  FOR SELECT
  TO anon, authenticated
  USING (
    is_active = TRUE
    AND release_status = 'published'
  );
