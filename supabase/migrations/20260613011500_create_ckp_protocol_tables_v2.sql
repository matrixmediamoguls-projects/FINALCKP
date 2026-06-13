create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

alter table public.acts add column if not exists color_key text;
alter table public.acts add column if not exists route_path text;
alter table public.acts add column if not exists is_locked boolean not null default true;

update public.acts
set color_key = case lower(coalesce(element::text, ''))
  when 'earth' then 'green'
  when 'water' then 'blue'
  when 'fire' then 'red'
  when 'air' then 'yellow'
  else color_key
end
where color_key is null;

update public.acts
set route_path = '/acts/' || act_number::text
where route_path is null and act_number is not null;

create table if not exists public.tracks (
  id uuid primary key default gen_random_uuid(),
  act_id uuid not null references public.acts(id) on delete cascade,
  track_order integer not null check (track_order > 0),
  title text not null,
  artist text not null default 'Musiq Matrix',
  songwriter text default 'Timothy Bailey',
  producer text default 'Musiq Matrix',
  duration_seconds integer check (duration_seconds is null or duration_seconds >= 0),
  bpm numeric(6,2) check (bpm is null or bpm > 0),
  key_signature text,
  energy_level integer check (energy_level is null or energy_level between 1 and 10),
  core_theme text,
  signal_type text,
  lyric_mode text,
  visual_skin text,
  audio_url text,
  cover_image_url text,
  is_single boolean not null default false,
  is_featured boolean not null default false,
  release_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (act_id, track_order)
);

create table if not exists public.lyrics_protocol (
  id uuid primary key default gen_random_uuid(),
  track_id uuid not null unique references public.tracks(id) on delete cascade,
  lyrics_full text,
  lyrics_clean text,
  section_map jsonb not null default '[]'::jsonb,
  key_lines jsonb not null default '[]'::jsonb,
  primary_light_code text,
  lyric_summary text,
  hidden_meaning text,
  evidence_lines jsonb not null default '[]'::jsonb,
  timestamp_sync jsonb not null default '[]'::jsonb,
  display_mode text not null default 'static' check (display_mode in ('static','karaoke','codex','reveal')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.visualizer_requirements (
  id uuid primary key default gen_random_uuid(),
  track_id uuid not null unique references public.tracks(id) on delete cascade,
  visualizer_mode text not null default 'mainframe',
  background_style text,
  primary_color text,
  secondary_color text,
  accent_color text,
  spectrum_intensity integer check (spectrum_intensity is null or spectrum_intensity between 1 and 10),
  waveform_intensity integer check (waveform_intensity is null or waveform_intensity between 1 and 10),
  particle_density integer check (particle_density is null or particle_density between 1 and 10),
  camera_motion text,
  emblem_visible boolean not null default false,
  center_viewport_clear boolean not null default true,
  video_url text,
  loop_visual_url text,
  reactive_elements jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.reclamation_university (
  id uuid primary key default gen_random_uuid(),
  track_id uuid references public.tracks(id) on delete set null,
  lesson_title text not null,
  lesson_type text not null default 'light_code',
  primary_light_code text,
  lesson_body text,
  summary text,
  reflection_prompt text,
  unlock_order integer not null default 0,
  difficulty_level integer check (difficulty_level is null or difficulty_level between 1 and 5),
  estimated_minutes integer check (estimated_minutes is null or estimated_minutes >= 0),
  is_required boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.vibes_and_scribes (
  id uuid primary key default gen_random_uuid(),
  track_id uuid references public.tracks(id) on delete set null,
  vibe_name text not null,
  vibe_category text,
  mood_tags text[] not null default '{}',
  scribe_prompt text not null,
  scribe_context text,
  response_type text not null default 'journal',
  intensity_level integer check (intensity_level is null or intensity_level between 1 and 10),
  recommended_duration integer check (recommended_duration is null or recommended_duration >= 0),
  unlock_condition text not null default 'always',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.user_scribe_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  vibe_scribe_id uuid references public.vibes_and_scribes(id) on delete set null,
  track_id uuid references public.tracks(id) on delete set null,
  entry_text text not null,
  mood_before integer check (mood_before is null or mood_before between 1 and 10),
  mood_after integer check (mood_after is null or mood_after between 1 and 10),
  is_private boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.experience_modes (
  id uuid primary key default gen_random_uuid(),
  mode_key text not null unique check (mode_key in ('immersion','sovereign')),
  title text not null,
  description text,
  route_path text not null,
  button_text text,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.module_cards (
  id uuid primary key default gen_random_uuid(),
  module_key text not null unique,
  title text not null,
  subtitle text,
  description text,
  route_path text,
  icon_key text,
  color_key text,
  position_zone text,
  is_enabled boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.user_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  act_id uuid references public.acts(id) on delete set null,
  track_id uuid references public.tracks(id) on delete set null,
  experience_mode text check (experience_mode is null or experience_mode in ('immersion','sovereign')),
  module_key text,
  completion_status text not null default 'not_started' check (completion_status in ('not_started','in_progress','complete')),
  progress_percent numeric(5,2) not null default 0 check (progress_percent between 0 and 100),
  last_position_seconds integer not null default 0 check (last_position_seconds >= 0),
  unlocked_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, act_id, track_id, experience_mode, module_key)
);

create table if not exists public.protocol_feed (
  id uuid primary key default gen_random_uuid(),
  track_id uuid references public.tracks(id) on delete cascade,
  feed_line text not null,
  feed_type text not null default 'transmission',
  display_order integer not null default 0,
  trigger_time_seconds integer check (trigger_time_seconds is null or trigger_time_seconds >= 0),
  intensity_level integer check (intensity_level is null or intensity_level between 1 and 10),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_tracks_act_order on public.tracks(act_id, track_order);
create index if not exists idx_reclamation_university_track on public.reclamation_university(track_id);
create index if not exists idx_vibes_and_scribes_track on public.vibes_and_scribes(track_id);
create index if not exists idx_user_scribe_entries_user on public.user_scribe_entries(user_id, created_at desc);
create index if not exists idx_user_progress_user on public.user_progress(user_id);
create index if not exists idx_protocol_feed_track_order on public.protocol_feed(track_id, display_order);

drop trigger if exists set_acts_updated_at on public.acts;
drop trigger if exists set_tracks_updated_at on public.tracks;
drop trigger if exists set_lyrics_protocol_updated_at on public.lyrics_protocol;
drop trigger if exists set_visualizer_requirements_updated_at on public.visualizer_requirements;
drop trigger if exists set_reclamation_university_updated_at on public.reclamation_university;
drop trigger if exists set_vibes_and_scribes_updated_at on public.vibes_and_scribes;
drop trigger if exists set_user_scribe_entries_updated_at on public.user_scribe_entries;
drop trigger if exists set_experience_modes_updated_at on public.experience_modes;
drop trigger if exists set_module_cards_updated_at on public.module_cards;
drop trigger if exists set_user_progress_updated_at on public.user_progress;
drop trigger if exists set_protocol_feed_updated_at on public.protocol_feed;

create trigger set_acts_updated_at before update on public.acts for each row execute function public.set_updated_at();
create trigger set_tracks_updated_at before update on public.tracks for each row execute function public.set_updated_at();
create trigger set_lyrics_protocol_updated_at before update on public.lyrics_protocol for each row execute function public.set_updated_at();
create trigger set_visualizer_requirements_updated_at before update on public.visualizer_requirements for each row execute function public.set_updated_at();
create trigger set_reclamation_university_updated_at before update on public.reclamation_university for each row execute function public.set_updated_at();
create trigger set_vibes_and_scribes_updated_at before update on public.vibes_and_scribes for each row execute function public.set_updated_at();
create trigger set_user_scribe_entries_updated_at before update on public.user_scribe_entries for each row execute function public.set_updated_at();
create trigger set_experience_modes_updated_at before update on public.experience_modes for each row execute function public.set_updated_at();
create trigger set_module_cards_updated_at before update on public.module_cards for each row execute function public.set_updated_at();
create trigger set_user_progress_updated_at before update on public.user_progress for each row execute function public.set_updated_at();
create trigger set_protocol_feed_updated_at before update on public.protocol_feed for each row execute function public.set_updated_at();

alter table public.acts enable row level security;
alter table public.tracks enable row level security;
alter table public.lyrics_protocol enable row level security;
alter table public.visualizer_requirements enable row level security;
alter table public.reclamation_university enable row level security;
alter table public.vibes_and_scribes enable row level security;
alter table public.user_scribe_entries enable row level security;
alter table public.experience_modes enable row level security;
alter table public.module_cards enable row level security;
alter table public.user_progress enable row level security;
alter table public.protocol_feed enable row level security;

drop policy if exists "Public can read acts" on public.acts;
drop policy if exists "Public can read tracks" on public.tracks;
drop policy if exists "Public can read lyrics protocol" on public.lyrics_protocol;
drop policy if exists "Public can read visualizer requirements" on public.visualizer_requirements;
drop policy if exists "Public can read reclamation university" on public.reclamation_university;
drop policy if exists "Public can read vibes and scribes" on public.vibes_and_scribes;
drop policy if exists "Public can read experience modes" on public.experience_modes;
drop policy if exists "Public can read module cards" on public.module_cards;
drop policy if exists "Public can read protocol feed" on public.protocol_feed;
drop policy if exists "Users can read own scribe entries" on public.user_scribe_entries;
drop policy if exists "Users can insert own scribe entries" on public.user_scribe_entries;
drop policy if exists "Users can update own scribe entries" on public.user_scribe_entries;
drop policy if exists "Users can delete own scribe entries" on public.user_scribe_entries;
drop policy if exists "Users can read own progress" on public.user_progress;
drop policy if exists "Users can insert own progress" on public.user_progress;
drop policy if exists "Users can update own progress" on public.user_progress;
drop policy if exists "Users can delete own progress" on public.user_progress;

create policy "Public can read acts" on public.acts for select using (true);
create policy "Public can read tracks" on public.tracks for select using (true);
create policy "Public can read lyrics protocol" on public.lyrics_protocol for select using (true);
create policy "Public can read visualizer requirements" on public.visualizer_requirements for select using (true);
create policy "Public can read reclamation university" on public.reclamation_university for select using (true);
create policy "Public can read vibes and scribes" on public.vibes_and_scribes for select using (true);
create policy "Public can read experience modes" on public.experience_modes for select using (true);
create policy "Public can read module cards" on public.module_cards for select using (true);
create policy "Public can read protocol feed" on public.protocol_feed for select using (true);

create policy "Users can read own scribe entries" on public.user_scribe_entries for select to authenticated using (auth.uid() = user_id);
create policy "Users can insert own scribe entries" on public.user_scribe_entries for insert to authenticated with check (auth.uid() = user_id);
create policy "Users can update own scribe entries" on public.user_scribe_entries for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users can delete own scribe entries" on public.user_scribe_entries for delete to authenticated using (auth.uid() = user_id);

create policy "Users can read own progress" on public.user_progress for select to authenticated using (auth.uid() = user_id);
create policy "Users can insert own progress" on public.user_progress for insert to authenticated with check (auth.uid() = user_id);
create policy "Users can update own progress" on public.user_progress for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users can delete own progress" on public.user_progress for delete to authenticated using (auth.uid() = user_id);
