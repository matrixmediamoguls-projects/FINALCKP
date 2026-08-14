-- The Matrx Alchemizr tagging layer for the Vibes & Scribes module.
-- Adds the reference tag dictionary that drives the rain word pools and badge colors,
-- and the per-category tag arrays on tracks that the alchemizr filters against.

create table if not exists public.tag_dictionary (
  id uuid primary key default gen_random_uuid(),
  category text not null constraint tag_dictionary_category_check
    check (category in ('vibe', 'intention', 'element', 'theme', 'vibration')),
  label text not null,
  color_hex text not null constraint tag_dictionary_color_hex_check
    check (color_hex ~ '^#[0-9A-Fa-f]{6}$'),
  sort_order integer not null default 0 constraint tag_dictionary_sort_order_nonnegative
    check (sort_order >= 0),
  created_at timestamptz not null default now(),
  constraint tag_dictionary_category_label_key unique (category, label)
);

comment on table public.tag_dictionary is
  'Closed tag vocabulary for The Matrx Alchemizr. Drives the falling-tag word pools and the neon glow color per category.';
comment on column public.tag_dictionary.color_hex is
  'Neon glow color applied to the falling tag and its banked chip. Styling stays data-driven rather than hardcoded in the module.';

alter table public.tracks
  add column if not exists vibe_tags text[] not null default '{}',
  add column if not exists intention_tags text[] not null default '{}',
  add column if not exists element_tags text[] not null default '{}',
  add column if not exists theme_tags text[] not null default '{}',
  add column if not exists vibration_tags text[] not null default '{}',
  add column if not exists spotify_uri text;

comment on column public.tracks.vibe_tags is
  'Alchemizr vibe tags. Labels mirror public.tag_dictionary rows in the vibe category.';
comment on column public.tracks.spotify_uri is
  'Spotify track URI (spotify:track:<id>) used by the alchemizr detail modal. Local playback still resolves through r2_audio_key.';

-- GIN indexes keep .overlaps()/.contains() lookups off sequential scans as the catalog grows.
create index if not exists idx_tracks_vibe_tags on public.tracks using gin (vibe_tags);
create index if not exists idx_tracks_intention_tags on public.tracks using gin (intention_tags);
create index if not exists idx_tracks_element_tags on public.tracks using gin (element_tags);
create index if not exists idx_tracks_theme_tags on public.tracks using gin (theme_tags);
create index if not exists idx_tracks_vibration_tags on public.tracks using gin (vibration_tags);

create index if not exists idx_tag_dictionary_category_sort
  on public.tag_dictionary(category, sort_order);

alter table public.tag_dictionary enable row level security;

grant all on table public.tag_dictionary to anon, authenticated, service_role;

drop policy if exists "Public can read the tag dictionary" on public.tag_dictionary;
create policy "Public can read the tag dictionary"
  on public.tag_dictionary for select
  to anon, authenticated
  using (true);

-- Locked starter vocabulary. Colors match the category glow shades used by the module.
insert into public.tag_dictionary (category, label, color_hex, sort_order)
values
  ('vibe', 'Chill', '#FF7A1A', 1),
  ('vibe', 'Euphoric', '#FF7A1A', 2),
  ('vibe', 'Dark', '#FF7A1A', 3),
  ('vibe', 'Dreamy', '#FF7A1A', 4),
  ('vibe', 'Gritty', '#FF7A1A', 5),
  ('vibe', 'Ethereal', '#FF7A1A', 6),
  ('vibe', 'Nostalgic', '#FF7A1A', 7),
  ('vibe', 'Hypnotic', '#FF7A1A', 8),
  ('vibe', 'Empowering', '#FF7A1A', 9),

  ('intention', 'Manifest', '#1AA7FF', 1),
  ('intention', 'Heal', '#1AA7FF', 2),
  ('intention', 'Release', '#1AA7FF', 3),
  ('intention', 'Focus', '#1AA7FF', 4),
  ('intention', 'Awaken', '#1AA7FF', 5),
  ('intention', 'Protect', '#1AA7FF', 6),
  ('intention', 'Transform', '#1AA7FF', 7),
  ('intention', 'Connect', '#1AA7FF', 8),
  ('intention', 'Heartbreak', '#1AA7FF', 9),
  ('intention', 'Educate', '#1AA7FF', 10),
  ('intention', 'Inspire', '#1AA7FF', 11),

  ('element', 'Fire', '#F5F5F5', 1),
  ('element', 'Water', '#F5F5F5', 2),
  ('element', 'Air', '#F5F5F5', 3),
  ('element', 'Earth', '#F5F5F5', 4),

  ('theme', 'Rebirth', '#B14AFF', 1),
  ('theme', 'Power', '#B14AFF', 2),
  ('theme', 'Legacy', '#B14AFF', 3),
  ('theme', 'Faith', '#B14AFF', 4),
  ('theme', 'Love', '#B14AFF', 5),
  ('theme', 'War', '#B14AFF', 6),
  ('theme', 'Freedom', '#B14AFF', 7),
  ('theme', 'Loyalty', '#B14AFF', 8),

  ('vibration', 'Mentalism', '#3CFF6E', 1),
  ('vibration', 'Correspondence', '#3CFF6E', 2),
  ('vibration', 'Polarity', '#3CFF6E', 3),
  ('vibration', 'Rhythm', '#3CFF6E', 4),
  ('vibration', 'Cause & Effect', '#3CFF6E', 5),
  ('vibration', 'Gender', '#3CFF6E', 6),
  ('vibration', 'Resonance', '#3CFF6E', 7),
  ('vibration', 'Frequency', '#3CFF6E', 8)
on conflict on constraint tag_dictionary_category_label_key do update
  set color_hex = excluded.color_hex,
      sort_order = excluded.sort_order;
