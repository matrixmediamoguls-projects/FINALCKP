-- Clean visualizer-only track table.
-- The legacy public.tracks table is still used by admin and guided-listening APIs.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS public.reclamation_tracks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  track_id TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  artist TEXT,
  act_id TEXT NOT NULL DEFAULT 'act_three',
  act TEXT NOT NULL DEFAULT 'ACT III',
  sort_order INTEGER NOT NULL DEFAULT 999,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  audio_url TEXT NOT NULL,
  primary_color TEXT NOT NULL DEFAULT '#ff1a2d',
  intensity INTEGER NOT NULL DEFAULT 70 CHECK (intensity BETWEEN 0 AND 100),
  display_text TEXT,
  background_image TEXT,
  act_logo_image TEXT,
  release_status TEXT NOT NULL DEFAULT 'published',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_reclamation_tracks_active_order
  ON public.reclamation_tracks (is_active, sort_order, track_id);

WITH source_tracks AS (
  SELECT
    t.*,
    ROW_NUMBER() OVER (
      ORDER BY COALESCE(t.sort_order, 999), t.act, COALESCE(t.name, t.track_id)
    ) AS fallback_sort_order
  FROM public.tracks t
  WHERE t.audio_url IS NOT NULL
    AND BTRIM(t.audio_url) <> ''
)
INSERT INTO public.reclamation_tracks (
  track_id,
  title,
  artist,
  act_id,
  act,
  sort_order,
  is_active,
  audio_url,
  primary_color,
  intensity,
  display_text,
  background_image,
  act_logo_image,
  release_status
)
SELECT
  t.track_id,
  COALESCE(NULLIF(t.title, ''), NULLIF(t.name, ''), t.track_id) AS title,
  NULL::TEXT AS artist,
  CASE
    WHEN t.act = 1 THEN 'act_one'
    WHEN t.act = 2 THEN 'act_two'
    WHEN t.act = 3 THEN 'act_three'
    ELSE 'act_three'
  END AS act_id,
  CASE
    WHEN t.act = 1 THEN 'ACT I'
    WHEN t.act = 2 THEN 'ACT II'
    WHEN t.act = 3 THEN 'ACT III'
    ELSE 'ACT III'
  END AS act,
  COALESCE(t.sort_order, t.fallback_sort_order) AS sort_order,
  COALESCE(t.is_active, TRUE) AS is_active,
  t.audio_url,
  CASE
    WHEN COALESCE(NULLIF(t.primary_color, ''), NULLIF(t.color, '')) LIKE '#%' THEN COALESCE(NULLIF(t.primary_color, ''), NULLIF(t.color, ''))
    ELSE '#ff1a2d'
  END AS primary_color,
  COALESCE(t.intensity, 70) AS intensity,
  COALESCE(NULLIF(t.display_text, ''), NULLIF(t.lyrics, '')) AS display_text,
  NULLIF(t.background_image, '') AS background_image,
  NULLIF(t.act_logo_image, '') AS act_logo_image,
  'published' AS release_status
FROM source_tracks t
ON CONFLICT (track_id) DO UPDATE SET
  title = EXCLUDED.title,
  artist = EXCLUDED.artist,
  act_id = EXCLUDED.act_id,
  act = EXCLUDED.act,
  sort_order = EXCLUDED.sort_order,
  is_active = EXCLUDED.is_active,
  audio_url = EXCLUDED.audio_url,
  primary_color = EXCLUDED.primary_color,
  intensity = EXCLUDED.intensity,
  display_text = EXCLUDED.display_text,
  background_image = EXCLUDED.background_image,
  act_logo_image = EXCLUDED.act_logo_image,
  release_status = EXCLUDED.release_status,
  updated_at = NOW();
