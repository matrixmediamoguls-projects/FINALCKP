create extension if not exists pgcrypto;

create table if not exists public.reclamation_tracks (
  id uuid primary key default gen_random_uuid(),
  track_id text not null unique,
  title text not null,
  artist text,
  act_id text not null default 'act_three',
  act text not null default 'ACT III',
  sort_order integer not null default 999,
  is_active boolean not null default true,
  audio_url text,
  primary_color text not null default '#ff1a2d',
  intensity integer not null default 70 check (intensity between 0 and 100),
  display_text text,
  background_image text,
  act_logo_image text,
  release_status text not null default 'published',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.reclamation_tracks
  add column if not exists album_title text not null default 'RECLAMATION: ACT THREE',
  add column if not exists viewport_image_url text not null default '/media/visualizer/reclamation-city-gatekeeper.png',
  add column if not exists viewport_media_type text not null default 'image',
  add column if not exists viewport_alt_text text not null default 'Chroma Key Protocol Act Three cinematic visualizer viewport',
  add column if not exists visualizer_scene_id text,
  add column if not exists viewport_layer_config jsonb not null default '{"baseLayer":"public-image","rootPath":"frontend/public/media/visualizer/","frontendSrc":"/media/visualizer/reclamation-city-gatekeeper.png","overlays":["rain","neon-bloom","red-protocol-grid","lyrics-protocol"],"centerViewportClear":true}'::jsonb,
  add column if not exists core_theme text,
  add column if not exists signal_types text[] not null default array[]::text[],
  add column if not exists lyric_mode text,
  add column if not exists visual_skin text,
  add column if not exists motion_style text,
  add column if not exists particle_types text[] not null default array[]::text[],
  add column if not exists resonance_events text[] not null default array[]::text[];

create index if not exists idx_reclamation_tracks_active_order
  on public.reclamation_tracks (is_active, sort_order, track_id);

alter table public.visualizer_requirements
  add column if not exists viewport_image_url text not null default '/media/visualizer/reclamation-city-gatekeeper.png',
  add column if not exists frontend_public_path text not null default 'frontend/public/media/visualizer/reclamation-city-gatekeeper.png',
  add column if not exists center_viewport_role text not null default 'cinematic_background_layer',
  add column if not exists production_framework jsonb not null default '{"component":"VisualizerViewport","src":"/media/visualizer/reclamation-city-gatekeeper.png","physicalPath":"frontend/public/media/visualizer/reclamation-city-gatekeeper.png","lyricsOverlay":true,"audioReactive":true,"centerViewportClear":true}'::jsonb;

alter table public.reclamation_tracks enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'reclamation_tracks'
      and policyname = 'reclamation_tracks_public_read'
  ) then
    create policy reclamation_tracks_public_read
      on public.reclamation_tracks
      for select
      using (true);
  end if;
end $$;
