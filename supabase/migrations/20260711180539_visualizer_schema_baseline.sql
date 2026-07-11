-- Schema-only baseline captured from the live reclamation-visualization project.
-- No content rows are created or modified by this migration.

create extension if not exists pgcrypto;

create table public.visual_presets (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  shader_name text not null,
  palette_json jsonb not null,
  intensity numeric default 1,
  created_at timestamptz default now()
);

comment on table public.visual_presets is
  'Shader and palette configuration for audio-reactive visuals.';

create table public.tracks (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  artist text not null,
  album text,
  duration_ms integer constraint tracks_duration_ms_nonnegative check (duration_ms is null or duration_ms >= 0),
  bpm integer constraint tracks_bpm_positive check (bpm is null or bpm > 0),
  queue_index integer constraint tracks_queue_index_nonnegative check (queue_index is null or queue_index >= 0),
  r2_audio_key text not null,
  r2_cover_key text,
  preset_id uuid constraint tracks_preset_id_fkey references public.visual_presets(id) on delete set null,
  created_at timestamptz default now()
);

comment on table public.tracks is
  'Track metadata for the Reclamation visualizer. Binary media lives in R2 and is referenced by object keys.';
comment on column public.tracks.r2_audio_key is
  'R2 object key, e.g. audio/track-001.mp3';
comment on column public.tracks.r2_cover_key is
  'R2 object key, e.g. covers/track-001.jpg';

create table public.track_lyrics (
  id uuid primary key default gen_random_uuid(),
  track_id uuid not null constraint track_lyrics_track_id_fkey references public.tracks(id) on delete cascade,
  line_order integer not null constraint track_lyrics_line_order_nonnegative check (line_order >= 0),
  line_text text not null,
  start_ms integer not null constraint track_lyrics_start_ms_nonnegative check (start_ms >= 0),
  end_ms integer not null constraint track_lyrics_end_after_start check (end_ms >= start_ms)
);

comment on table public.track_lyrics is
  'Timed lyric lines attached to tracks for synced lyric playback.';

create table public.playback_queue (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  track_id uuid not null constraint playback_queue_track_id_fkey references public.tracks(id) on delete cascade,
  position integer constraint playback_queue_position_nonnegative check (position is null or position >= 0),
  created_at timestamptz default now()
);

comment on table public.playback_queue is
  'Optional per-user queue order. Use only when queue order changes per user.';

create table public.visualizer_playlists (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null constraint visualizer_playlists_slug_key unique,
  description text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.visualizer_playlist_tracks (
  id uuid primary key default gen_random_uuid(),
  playlist_id uuid not null constraint visualizer_playlist_tracks_playlist_id_fkey references public.visualizer_playlists(id) on delete cascade,
  track_id uuid not null constraint visualizer_playlist_tracks_track_id_fkey references public.tracks(id) on delete cascade,
  position integer not null constraint visualizer_playlist_tracks_position_check check (position > 0),
  created_at timestamptz not null default now(),
  constraint visualizer_playlist_tracks_playlist_id_position_key unique (playlist_id, position),
  constraint visualizer_playlist_tracks_playlist_id_track_id_key unique (playlist_id, track_id)
);

create index idx_playback_queue_track_id on public.playback_queue(track_id);
create index idx_playback_queue_user_position on public.playback_queue(user_id, position);
create index idx_track_lyrics_track_id_line_order on public.track_lyrics(track_id, line_order);
create index idx_track_lyrics_track_id_time on public.track_lyrics(track_id, start_ms, end_ms);
create index idx_tracks_preset_id on public.tracks(preset_id);
create index idx_tracks_queue_index on public.tracks(queue_index);
create index visualizer_playlist_tracks_playlist_position_idx
  on public.visualizer_playlist_tracks(playlist_id, position);

alter table public.visual_presets enable row level security;
alter table public.tracks enable row level security;
alter table public.track_lyrics enable row level security;
alter table public.playback_queue enable row level security;
alter table public.visualizer_playlists enable row level security;
alter table public.visualizer_playlist_tracks enable row level security;

grant all on table public.visual_presets to anon, authenticated, service_role;
grant all on table public.tracks to anon, authenticated, service_role;
grant all on table public.track_lyrics to anon, authenticated, service_role;
grant all on table public.playback_queue to anon, authenticated, service_role;
grant all on table public.visualizer_playlists to anon, authenticated, service_role;
grant all on table public.visualizer_playlist_tracks to anon, authenticated, service_role;

create policy "Public can read visual presets"
  on public.visual_presets for select
  to anon, authenticated
  using (true);

create policy "Public can read tracks"
  on public.tracks for select
  to anon, authenticated
  using (true);

create policy "Public can read track lyrics"
  on public.track_lyrics for select
  to anon, authenticated
  using (true);

create policy "Users can read own playback queue"
  on public.playback_queue for select
  to authenticated
  using (user_id = auth.uid());

create policy "Users can insert own playback queue"
  on public.playback_queue for insert
  to authenticated
  with check (user_id = auth.uid());

create policy "Users can update own playback queue"
  on public.playback_queue for update
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "Users can delete own playback queue"
  on public.playback_queue for delete
  to authenticated
  using (user_id = auth.uid());

create policy "Public can read active visualizer playlists"
  on public.visualizer_playlists for select
  to anon, authenticated
  using (is_active = true);

create policy "Public can read visualizer playlist tracks"
  on public.visualizer_playlist_tracks for select
  to anon, authenticated
  using (
    exists (
      select 1
      from public.visualizer_playlists as vp
      where vp.id = visualizer_playlist_tracks.playlist_id
        and vp.is_active = true
    )
  );
