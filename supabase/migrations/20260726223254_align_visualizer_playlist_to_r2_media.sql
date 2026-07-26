-- Align the active visualizer playlist with objects that exist in the
-- chromakeyprotocol R2 bucket. The frontend resolves these keys through
-- VITE_APP_R2_PUBLIC_BASE_URL.

with media_map(title, r2_audio_key) as (
  values
    ('Welcome To The Fire', 'audio/act_three/welcome_to_the_fire.mp3'),
    ('Reclamation (The Day Musiq Matrix Came Back)', 'audio/act_three/reclamation.mp3'),
    ('Hold On', 'audio/act_three/_Hold_On.mp3'),
    ('Red Flag Parade', 'audio/act_three/_Red_Flag_Parade.mp3'),
    ('Slumlord Fundamentalist', 'audio/act_three/_Slumlord_Fundamentalists.mp3'),
    ('The Hierophant', 'audio/act_three/_The_Hierophant.mp3'),
    ('Concrete Warnings', 'audio/act_three/_Concrete_Warnings.mp3'),
    ('As Above, So Below', 'audio/act_three/_As_Above,_So_Below.mp3')
)
update public.tracks as tracks
set
  r2_audio_key = media_map.r2_audio_key,
  r2_cover_key = null
from media_map
where tracks.title = media_map.title;

delete from public.visualizer_playlist_tracks
where playlist_id = (
  select id
  from public.visualizer_playlists
  where slug = 'reclamation-visualizer-preview'
);

with playlist as (
  select id
  from public.visualizer_playlists
  where slug = 'reclamation-visualizer-preview'
),
playlist_map(title, position) as (
  values
    ('Welcome To The Fire', 1),
    ('Reclamation (The Day Musiq Matrix Came Back)', 2),
    ('Hold On', 3),
    ('Red Flag Parade', 4),
    ('Slumlord Fundamentalist', 5),
    ('The Hierophant', 6),
    ('Concrete Warnings', 7),
    ('As Above, So Below', 8)
)
insert into public.visualizer_playlist_tracks (playlist_id, track_id, position)
select playlist.id, tracks.id, playlist_map.position
from playlist
cross join playlist_map
join public.tracks as tracks on tracks.title = playlist_map.title
order by playlist_map.position;
