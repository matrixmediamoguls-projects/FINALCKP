-- Restore the complete Act III album sequence, align every track with the
-- object that exists in R2, and repair the mistagged Body Jumper timed lyrics.

with media_map(title, r2_audio_key) as (
  values
    ('Welcome To The Fire', 'act_three/media/tracks/Welcome_to_the_Fire.mp3'),
    ('Reclamation', 'act_three/media/tracks/Reclamation.mp3'),
    ('Know Your Names', 'act_three/media/tracks/05_-_Musiq_Matrix_-_Know_Your_Names.mp3'),
    ('Hold On Through The Burial', 'act_three/media/tracks/04_-_Musiq_Matrix_-_Hold_On.mp3'),
    ('Chosen Ones', 'act_three/media/tracks/_Chosen_Ones.mp3'),
    ('Concrete Warnings', 'act_three/media/tracks/_Concrete_Warnings.mp3'),
    ('Adjacent (Reroute It)', 'act_three/media/tracks/act-three-adjacent.wav'),
    ('Art! Official!', 'act_three/media/tracks/03_-_Musiq_Matrix_-_Art!_Official!.mp3'),
    ('Thought Form', 'act_three/media/tracks/_Thought_Form.mp3'),
    ('Remember the Price (When You Speak the Name)', 'act_three/media/tracks/_Remember_the_Price.mp3'),
    ('Blueprint of the Divine', 'act_three/media/tracks/12_-_Musiq_Matrix_-_Blueprint_of_the_Divine.mp3'),
    ('Flip It', 'act_three/media/tracks/_Flip_It.mp3'),
    ('I Am the Signal', 'act_three/media/tracks/I_Am_The_Signal.mp3'),
    ('I Create as I Speak', 'act_three/media/tracks/17_-_Musiq_Matrix_-_I_Create_As_I_Speak.mp3'),
    ('As Above, So Below', 'act_three/media/tracks/act-three-as-above-so-below.wav'),
    ('Elemental Orchestra', 'act_three/media/tracks/_Elemental_Orchestra.mp3'),
    ('The Witness Don’t Talk', 'act_three/media/tracks/act-three-the-witness.mp3'),
    ('Demonic Schemes', 'act_three/media/tracks/act-three-demonic-schemes.wav'),
    ('Through the Fog', 'act_three/media/tracks/07_-_Musiq_Matrix_-_Through_the_Fog.mp3'),
    ('Flowers', 'act_three/media/tracks/_Flowers.mp3'),
    ('Misguided Priorities', 'act_three/media/tracks/Misguided Priorities (Edit) (Edit).wav'),
    ('The Hierophant', 'act_three/media/tracks/The_Hierophant.wav'),
    ('Foolish Pride', 'act_three/media/tracks/_Foolish_Pride.mp3'),
    ('Where the Phantom Fell', 'act_three/media/tracks/act-three-where-the-phantom-fell.wav'),
    ('The Whole Cost of You', 'act_three/media/tracks/_The_Whole_Cost_of_You.mp3'),
    ('Blood Without Stains', 'act_three/media/tracks/_Blood_Without_Stains.mp3'),
    ('Slumlord Fundamentalists', 'act_three/media/tracks/_Slumlord_Fundamentalists.mp3'),
    ('The Reckoning Already Rolled', 'act_three/media/tracks/_The_Reckoning_Already_Rolled.mp3'),
    ('Architect of the Aftermath', 'act_three/media/tracks/act-three-architect-of-the-aftermath.mp3'),
    ('Seer Broke Chains', 'act_three/media/tracks/_Seer_Broke_Chains.mp3'),
    ('Fire in My Veins', 'act_three/media/tracks/_Fire_In_My_Veins.mp3'),
    ('Body Jumper', 'act_three/media/tracks/_Body_Jumper.mp3')
)
update public.tracks as tracks
set r2_audio_key = media_map.r2_audio_key
from media_map
where tracks.title = media_map.title;

delete from public.visualizer_playlist_tracks
where playlist_id = (
  select id
  from public.visualizer_playlists
  where slug = 'reclamation-visualizer-preview'
);

insert into public.visualizer_playlist_tracks (playlist_id, track_id, position)
select playlists.id, tracks.id, tracks.queue_index
from public.visualizer_playlists as playlists
cross join public.tracks as tracks
where playlists.slug = 'reclamation-visualizer-preview'
  and tracks.queue_index between 1 and 32
order by tracks.queue_index;

update public.track_lyrics
set track_id = (
  select id
  from public.tracks
  where title = 'Body Jumper'
)
where track_id = (
  select id
  from public.tracks
  where title = 'Reclamation'
);
