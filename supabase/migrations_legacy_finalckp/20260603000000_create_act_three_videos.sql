CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS public.act_three_videos (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  r2_bucket TEXT NOT NULL DEFAULT 'medioa',
  r2_key TEXT NOT NULL,
  title TEXT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT act_three_videos_pkey PRIMARY KEY (id)
);

ALTER TABLE public.act_three_videos ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_act_three_videos_created_at
  ON public.act_three_videos (created_at DESC);

GRANT SELECT ON TABLE public.act_three_videos TO anon, authenticated;

DROP POLICY IF EXISTS "Public can read Act III videos"
  ON public.act_three_videos;

CREATE POLICY "Public can read Act III videos"
  ON public.act_three_videos
  FOR SELECT
  TO anon, authenticated
  USING (TRUE);
