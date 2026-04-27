-- Dedicated reclamation_tracks table for the RECLAMATION immersive module.
-- Run this in the Supabase SQL Editor if you prefer a clean separate table
-- instead of extending the generic tracks table.
--
-- After running, update the useReclamationTracks hook to query
-- 'reclamation_tracks' instead of 'tracks'.

CREATE TABLE IF NOT EXISTS reclamation_tracks (
  id                          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sort_order                  INTEGER NOT NULL DEFAULT 999,
  title                       TEXT NOT NULL,
  audio_file_name             TEXT,
  act                         TEXT,
  act_keys                    JSONB DEFAULT '[]'::jsonb,
  shell_image                 TEXT,
  visual_mode                 TEXT DEFAULT 'shell-reactive',
  primary_color               TEXT DEFAULT '#5ab038',
  intensity                   INTEGER DEFAULT 70,
  display_text                TEXT,
  needs_user_input            TEXT,
  notes                       TEXT,
  is_active                   BOOLEAN DEFAULT TRUE,
  release_status              TEXT DEFAULT 'draft',
  created_at                  TIMESTAMPTZ DEFAULT NOW(),
  updated_at                  TIMESTAMPTZ DEFAULT NOW(),

  -- Act Logo Visualizer
  act_logo_image              TEXT,
  act_logo_text               TEXT DEFAULT 'CHROMA KEY PROTOCOL',
  act_logo_subtitle           TEXT,
  act_logo_ring_enabled       BOOLEAN DEFAULT TRUE,
  act_logo_reactivity_strength INTEGER DEFAULT 80,
  act_logo_glow_strength      INTEGER DEFAULT 80,
  act_logo_rotation_speed     NUMERIC DEFAULT 0.15,
  act_logo_visualizer_style   TEXT DEFAULT 'radial-bars',

  -- Act Visualizer Background
  background_image            TEXT,
  background_overlay_opacity  NUMERIC DEFAULT 0.22,
  background_blur             INTEGER DEFAULT 0,
  background_motion_enabled   BOOLEAN DEFAULT TRUE,
  scanline_enabled            BOOLEAN DEFAULT TRUE,
  glitch_level                INTEGER DEFAULT 25,
  fog_level                   INTEGER DEFAULT 20,
  pulse_strength              INTEGER DEFAULT 80,
  vignette_strength           INTEGER DEFAULT 70,

  -- Lyrics Engine
  display_text_enabled        BOOLEAN DEFAULT TRUE,
  display_text_label          TEXT DEFAULT 'LYRICAL BANK',
  display_text_position       TEXT DEFAULT 'bottom-center',
  display_text_animation      TEXT DEFAULT 'pulse',
  display_text_size           TEXT DEFAULT 'large',
  display_text_weight         TEXT DEFAULT 'bold',
  display_text_reactive       BOOLEAN DEFAULT TRUE,

  -- Sonic Artifact Declaration
  sonic_artifact_enabled      BOOLEAN DEFAULT TRUE,
  sonic_artifact_title        TEXT DEFAULT 'SONIC ARTIFACT DECLARATION',
  sonic_artifact_declaration  TEXT,
  sonic_artifact_position     TEXT DEFAULT 'upper-left',
  sonic_artifact_style        TEXT DEFAULT 'protocol-card',

  -- Act Keys Module
  act_keys_enabled            BOOLEAN DEFAULT TRUE,
  act_keys_title              TEXT DEFAULT 'KEYS TO THE ACT',
  act_keys_position           TEXT DEFAULT 'right-panel',
  act_keys_style              TEXT DEFAULT 'access-panel',

  -- Action button text (e.g. "COLLAPSE THE ILLUSION" / "NEW PATH CONFIRMED")
  act_action_text             TEXT
);

CREATE INDEX IF NOT EXISTS idx_reclamation_tracks_active_order
  ON reclamation_tracks (is_active, sort_order, act);

-- Enable Row Level Security (allow public read of active tracks)
ALTER TABLE reclamation_tracks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read active reclamation tracks"
  ON reclamation_tracks
  FOR SELECT
  USING (is_active = TRUE);
