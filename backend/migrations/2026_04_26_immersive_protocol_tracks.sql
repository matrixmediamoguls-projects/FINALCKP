-- Immersive Protocol metadata extension for the existing tracks table.
-- Run this in Supabase SQL Editor before editing immersive shell metadata.

ALTER TABLE tracks ADD COLUMN IF NOT EXISTS sort_order INTEGER;
ALTER TABLE tracks ADD COLUMN IF NOT EXISTS title TEXT;
ALTER TABLE tracks ADD COLUMN IF NOT EXISTS audio_file_name TEXT;
ALTER TABLE tracks ADD COLUMN IF NOT EXISTS act_label TEXT;
ALTER TABLE tracks ADD COLUMN IF NOT EXISTS act_keys JSONB DEFAULT '[]'::jsonb;
ALTER TABLE tracks ADD COLUMN IF NOT EXISTS shell_image TEXT;
ALTER TABLE tracks ADD COLUMN IF NOT EXISTS visual_mode TEXT DEFAULT 'shell-reactive';
ALTER TABLE tracks ADD COLUMN IF NOT EXISTS primary_color TEXT;
ALTER TABLE tracks ADD COLUMN IF NOT EXISTS intensity INTEGER DEFAULT 70;
ALTER TABLE tracks ADD COLUMN IF NOT EXISTS display_text TEXT;
ALTER TABLE tracks ADD COLUMN IF NOT EXISTS needs_user_input TEXT;
ALTER TABLE tracks ADD COLUMN IF NOT EXISTS notes TEXT;
ALTER TABLE tracks ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;
ALTER TABLE tracks ADD COLUMN IF NOT EXISTS release_status TEXT DEFAULT 'draft';

-- Act Logo Visualizer
ALTER TABLE tracks ADD COLUMN IF NOT EXISTS act_logo_image TEXT;
ALTER TABLE tracks ADD COLUMN IF NOT EXISTS act_logo_text TEXT DEFAULT 'CHROMA KEY PROTOCOL';
ALTER TABLE tracks ADD COLUMN IF NOT EXISTS act_logo_subtitle TEXT;
ALTER TABLE tracks ADD COLUMN IF NOT EXISTS act_logo_ring_enabled BOOLEAN DEFAULT TRUE;
ALTER TABLE tracks ADD COLUMN IF NOT EXISTS act_logo_reactivity_strength INTEGER DEFAULT 80;
ALTER TABLE tracks ADD COLUMN IF NOT EXISTS act_logo_glow_strength INTEGER DEFAULT 80;
ALTER TABLE tracks ADD COLUMN IF NOT EXISTS act_logo_rotation_speed NUMERIC DEFAULT 0.15;
ALTER TABLE tracks ADD COLUMN IF NOT EXISTS act_logo_visualizer_style TEXT DEFAULT 'radial-bars';

-- Act Visualizer Background
ALTER TABLE tracks ADD COLUMN IF NOT EXISTS background_image TEXT;
ALTER TABLE tracks ADD COLUMN IF NOT EXISTS background_overlay_opacity NUMERIC DEFAULT 0.22;
ALTER TABLE tracks ADD COLUMN IF NOT EXISTS background_blur INTEGER DEFAULT 0;
ALTER TABLE tracks ADD COLUMN IF NOT EXISTS background_motion_enabled BOOLEAN DEFAULT TRUE;
ALTER TABLE tracks ADD COLUMN IF NOT EXISTS scanline_enabled BOOLEAN DEFAULT TRUE;
ALTER TABLE tracks ADD COLUMN IF NOT EXISTS glitch_level INTEGER DEFAULT 25;
ALTER TABLE tracks ADD COLUMN IF NOT EXISTS fog_level INTEGER DEFAULT 20;
ALTER TABLE tracks ADD COLUMN IF NOT EXISTS pulse_strength INTEGER DEFAULT 80;
ALTER TABLE tracks ADD COLUMN IF NOT EXISTS vignette_strength INTEGER DEFAULT 70;

-- Lyrics Engine
ALTER TABLE tracks ADD COLUMN IF NOT EXISTS display_text_enabled BOOLEAN DEFAULT TRUE;
ALTER TABLE tracks ADD COLUMN IF NOT EXISTS display_text_label TEXT DEFAULT 'LYRICS ENGINE';
ALTER TABLE tracks ADD COLUMN IF NOT EXISTS display_text_position TEXT DEFAULT 'bottom-center';
ALTER TABLE tracks ADD COLUMN IF NOT EXISTS display_text_animation TEXT DEFAULT 'pulse';
ALTER TABLE tracks ADD COLUMN IF NOT EXISTS display_text_size TEXT DEFAULT 'large';
ALTER TABLE tracks ADD COLUMN IF NOT EXISTS display_text_weight TEXT DEFAULT 'bold';
ALTER TABLE tracks ADD COLUMN IF NOT EXISTS display_text_reactive BOOLEAN DEFAULT TRUE;

-- Sonic Artifact Declaration
ALTER TABLE tracks ADD COLUMN IF NOT EXISTS sonic_artifact_enabled BOOLEAN DEFAULT TRUE;
ALTER TABLE tracks ADD COLUMN IF NOT EXISTS sonic_artifact_title TEXT DEFAULT 'SONIC ARTIFACT DECLARATION';
ALTER TABLE tracks ADD COLUMN IF NOT EXISTS sonic_artifact_declaration TEXT;
ALTER TABLE tracks ADD COLUMN IF NOT EXISTS sonic_artifact_position TEXT DEFAULT 'upper-left';
ALTER TABLE tracks ADD COLUMN IF NOT EXISTS sonic_artifact_style TEXT DEFAULT 'protocol-card';

-- Act Keys Module
ALTER TABLE tracks ADD COLUMN IF NOT EXISTS act_keys_enabled BOOLEAN DEFAULT TRUE;
ALTER TABLE tracks ADD COLUMN IF NOT EXISTS act_keys_title TEXT DEFAULT 'KEYS TO THE ACT';
ALTER TABLE tracks ADD COLUMN IF NOT EXISTS act_keys_position TEXT DEFAULT 'right-panel';
ALTER TABLE tracks ADD COLUMN IF NOT EXISTS act_keys_style TEXT DEFAULT 'access-panel';

-- Backfill display fields from the existing guided-listening track data.
UPDATE tracks
SET
  title = COALESCE(title, name),
  audio_file_name = COALESCE(audio_file_name, audio_filename),
  primary_color = COALESCE(primary_color, color),
  display_text = COALESCE(display_text, lyrics),
  sonic_artifact_declaration = COALESCE(sonic_artifact_declaration, system_role, lore),
  sort_order = COALESCE(sort_order, 999)
WHERE TRUE;

CREATE INDEX IF NOT EXISTS idx_tracks_immersive_active_order
ON tracks (is_active, sort_order, act);
