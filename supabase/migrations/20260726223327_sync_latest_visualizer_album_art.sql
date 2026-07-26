-- Sync the latest approved Act III cover art and visualizer backgrounds from
-- Chroma_Key_Act_Three_Reclamation_Official_Tracklist (3).xlsm.
--
-- Blueprint of the Divine is intentionally excluded: its workbook cell points
-- to Flip It's cover. Blank workbook cells remain unchanged.

with cover_map(title, source_url, r2_object_key) as (
  values
    ('Welcome To The Fire', 'https://pub-7db585eeeb464a9d9f749f0307532c22.r2.dev/act_three/media/images/covers/Welcome_To_The_Fire_Cover.png', 'act_three/media/images/covers/Welcome_To_The_Fire_Cover.png'),
    ('Reclamation', 'https://pub-7db585eeeb464a9d9f749f0307532c22.r2.dev/act_three/media/images/covers/Reclamation_Cover.png', 'act_three/media/images/covers/Reclamation_Cover.png'),
    ('Know Your Names', 'https://pub-7db585eeeb464a9d9f749f0307532c22.r2.dev/act_three/media/images/covers/3_Know_Your_Names.png', 'act_three/media/images/covers/3_Know_Your_Names.png'),
    ('Hold On Through The Burial', 'https://pub-7db585eeeb464a9d9f749f0307532c22.r2.dev/act_three/media/images/covers/Hold_On.png', 'act_three/media/images/covers/Hold_On.png'),
    ('Chosen Ones', 'https://pub-7db585eeeb464a9d9f749f0307532c22.r2.dev/act_three/media/images/covers/Chosen_Ones.png', 'act_three/media/images/covers/Chosen_Ones.png'),
    ('Concrete Warnings', 'https://pub-7db585eeeb464a9d9f749f0307532c22.r2.dev/act_three/media/images/covers/Concrete_Warnings.png', 'act_three/media/images/covers/Concrete_Warnings.png'),
    ('Adjacent (Reroute It)', 'https://pub-7db585eeeb464a9d9f749f0307532c22.r2.dev/act_three/media/images/covers/Adjacent.png', 'act_three/media/images/covers/Adjacent.png'),
    ('Art! Official!', 'https://pub-7db585eeeb464a9d9f749f0307532c22.r2.dev/act_three/media/images/covers/8_Art_Official.png', 'act_three/media/images/covers/8_Art_Official.png'),
    ('Flip It', 'https://pub-7db585eeeb464a9d9f749f0307532c22.r2.dev/act_three/media/images/covers/11_Flip_It_Cover.png', 'act_three/media/images/covers/11_Flip_It_Cover.png'),
    ('I Am the Signal', 'https://pub-7db585eeeb464a9d9f749f0307532c22.r2.dev/act_three/media/images/covers/I%20Am%20The%20Signal.png', 'act_three/media/images/covers/I Am The Signal.png'),
    ('I Create as I Speak', 'https://pub-7db585eeeb464a9d9f749f0307532c22.r2.dev/act_three/media/images/covers/I_Create_As_I_Speak.png', 'act_three/media/images/covers/I_Create_As_I_Speak.png'),
    ('As Above, So Below', 'https://pub-7db585eeeb464a9d9f749f0307532c22.r2.dev/act_three/media/images/covers/As%20Above%2C%20So%20Below.png', 'act_three/media/images/covers/As Above, So Below.png'),
    ('Elemental Orchestra', 'https://pub-7db585eeeb464a9d9f749f0307532c22.r2.dev/act_three/media/images/covers/Elemental_Orchestra.png', 'act_three/media/images/covers/Elemental_Orchestra.png'),
    ('The Witness Don’t Talk', 'https://pub-7db585eeeb464a9d9f749f0307532c22.r2.dev/act_three/media/images/covers/Witness_Don''t_Talk.png', 'act_three/media/images/covers/Witness_Don''t_Talk.png'),
    ('Demonic Schemes', 'https://pub-7db585eeeb464a9d9f749f0307532c22.r2.dev/act_three/media/images/covers/demonic_schemes.png', 'act_three/media/images/covers/demonic_schemes.png'),
    ('Through the Fog', 'https://pub-7db585eeeb464a9d9f749f0307532c22.r2.dev/act_three/media/images/covers/19_Through_The_Fog.png', 'act_three/media/images/covers/19_Through_The_Fog.png'),
    ('Flowers', 'https://pub-7db585eeeb464a9d9f749f0307532c22.r2.dev/act_three/media/images/covers/Flowers.png', 'act_three/media/images/covers/Flowers.png'),
    ('Misguided Priorities', 'https://pub-7db585eeeb464a9d9f749f0307532c22.r2.dev/act_three/media/images/covers/Misguided_Priorities.png', 'act_three/media/images/covers/Misguided_Priorities.png'),
    ('The Hierophant', 'https://pub-7db585eeeb464a9d9f749f0307532c22.r2.dev/act_three/media/images/covers/The_Hierophant.png', 'act_three/media/images/covers/The_Hierophant.png'),
    ('Foolish Pride', 'https://pub-7db585eeeb464a9d9f749f0307532c22.r2.dev/act_three/media/images/covers/Foolish_Pride.png', 'act_three/media/images/covers/Foolish_Pride.png'),
    ('Where the Phantom Fell', 'https://pub-7db585eeeb464a9d9f749f0307532c22.r2.dev/act_three/media/images/covers/Where_The_Phantom_Fell.png', 'act_three/media/images/covers/Where_The_Phantom_Fell.png'),
    ('Slumlord Fundamentalists', 'https://pub-7db585eeeb464a9d9f749f0307532c22.r2.dev/act_three/media/images/covers/Slumlord_Fundamentalist.png', 'act_three/media/images/covers/Slumlord_Fundamentalist.png'),
    ('Body Jumper', 'https://pub-7db585eeeb464a9d9f749f0307532c22.r2.dev/act_three/media/images/covers/Body_Jumper.png', 'act_three/media/images/covers/Body_Jumper.png')
)
insert into public.track_cover_art (
  id,
  track_id,
  source_url,
  r2_object_key,
  alt_text,
  mime_type,
  is_active,
  metadata,
  updated_at
)
select
  tracks.title,
  tracks.id,
  cover_map.source_url,
  cover_map.r2_object_key,
  tracks.title || ' cover art',
  'image/png',
  true,
  jsonb_build_object('source', 'official-tracklist-3', 'verified_at', '2026-07-25'),
  now()
from cover_map
join public.tracks on tracks.title = cover_map.title
on conflict (track_id) do update set
  id = excluded.id,
  source_url = excluded.source_url,
  r2_object_key = excluded.r2_object_key,
  alt_text = excluded.alt_text,
  mime_type = excluded.mime_type,
  is_active = excluded.is_active,
  metadata = excluded.metadata,
  updated_at = now();

-- Match this row by canonical album position because historic imports used
-- more than one Unicode apostrophe form in the title.
insert into public.track_cover_art (
  id,
  track_id,
  source_url,
  r2_object_key,
  alt_text,
  mime_type,
  is_active,
  metadata,
  updated_at
)
select
  tracks.title,
  tracks.id,
  'https://pub-7db585eeeb464a9d9f749f0307532c22.r2.dev/act_three/media/images/covers/Witness_Don''t_Talk.png',
  'act_three/media/images/covers/Witness_Don''t_Talk.png',
  tracks.title || ' cover art',
  'image/png',
  true,
  jsonb_build_object('source', 'official-tracklist-3', 'verified_at', '2026-07-25'),
  now()
from public.tracks
where tracks.queue_index = 17
on conflict (track_id) do update set
  id = excluded.id,
  source_url = excluded.source_url,
  r2_object_key = excluded.r2_object_key,
  alt_text = excluded.alt_text,
  mime_type = excluded.mime_type,
  is_active = excluded.is_active,
  metadata = excluded.metadata,
  updated_at = now();

with cover_map(title, r2_object_key) as (
  values
    ('Welcome To The Fire', 'act_three/media/images/covers/Welcome_To_The_Fire_Cover.png'),
    ('Reclamation', 'act_three/media/images/covers/Reclamation_Cover.png'),
    ('Know Your Names', 'act_three/media/images/covers/3_Know_Your_Names.png'),
    ('Hold On Through The Burial', 'act_three/media/images/covers/Hold_On.png'),
    ('Chosen Ones', 'act_three/media/images/covers/Chosen_Ones.png'),
    ('Concrete Warnings', 'act_three/media/images/covers/Concrete_Warnings.png'),
    ('Adjacent (Reroute It)', 'act_three/media/images/covers/Adjacent.png'),
    ('Art! Official!', 'act_three/media/images/covers/8_Art_Official.png'),
    ('Flip It', 'act_three/media/images/covers/11_Flip_It_Cover.png'),
    ('I Am the Signal', 'act_three/media/images/covers/I Am The Signal.png'),
    ('I Create as I Speak', 'act_three/media/images/covers/I_Create_As_I_Speak.png'),
    ('As Above, So Below', 'act_three/media/images/covers/As Above, So Below.png'),
    ('Elemental Orchestra', 'act_three/media/images/covers/Elemental_Orchestra.png'),
    ('The Witness Don’t Talk', 'act_three/media/images/covers/Witness_Don''t_Talk.png'),
    ('Demonic Schemes', 'act_three/media/images/covers/demonic_schemes.png'),
    ('Through the Fog', 'act_three/media/images/covers/19_Through_The_Fog.png'),
    ('Flowers', 'act_three/media/images/covers/Flowers.png'),
    ('Misguided Priorities', 'act_three/media/images/covers/Misguided_Priorities.png'),
    ('The Hierophant', 'act_three/media/images/covers/The_Hierophant.png'),
    ('Foolish Pride', 'act_three/media/images/covers/Foolish_Pride.png'),
    ('Where the Phantom Fell', 'act_three/media/images/covers/Where_The_Phantom_Fell.png'),
    ('Slumlord Fundamentalists', 'act_three/media/images/covers/Slumlord_Fundamentalist.png'),
    ('Body Jumper', 'act_three/media/images/covers/Body_Jumper.png')
)
update public.tracks
set r2_cover_key = cover_map.r2_object_key
from cover_map
where tracks.title = cover_map.title;

update public.tracks
set r2_cover_key = 'act_three/media/images/covers/Witness_Don''t_Talk.png'
where queue_index = 17;

with background_map(title, source_url, r2_object_key) as (
  values
    ('Reclamation', 'https://pub-7db585eeeb464a9d9f749f0307532c22.r2.dev/act_three/media/images/visualizer/RECLAMATION.png', 'act_three/media/images/visualizer/RECLAMATION.png'),
    ('Know Your Names', 'https://pub-7db585eeeb464a9d9f749f0307532c22.r2.dev/act_three/media/images/visualizer/KNOWYOURNAMES.png', 'act_three/media/images/visualizer/KNOWYOURNAMES.png'),
    ('Hold On Through The Burial', 'https://pub-7db585eeeb464a9d9f749f0307532c22.r2.dev/act_three/media/images/visualizer/HOLDON.png', 'act_three/media/images/visualizer/HOLDON.png'),
    ('Concrete Warnings', 'https://pub-7db585eeeb464a9d9f749f0307532c22.r2.dev/act_three/media/images/visualizer/CONCRETEWARNINGS.png', 'act_three/media/images/visualizer/CONCRETEWARNINGS.png'),
    ('Adjacent (Reroute It)', 'https://pub-7db585eeeb464a9d9f749f0307532c22.r2.dev/act_three/media/images/visualizer/ADJACENT.png', 'act_three/media/images/visualizer/ADJACENT.png'),
    ('Flip It', 'https://pub-7db585eeeb464a9d9f749f0307532c22.r2.dev/act_three/media/images/visualizer/FLIPIT.png', 'act_three/media/images/visualizer/FLIPIT.png'),
    ('I Am the Signal', 'https://pub-7db585eeeb464a9d9f749f0307532c22.r2.dev/act_three/media/images/visualizer/IAMTHESIGNAL.png', 'act_three/media/images/visualizer/IAMTHESIGNAL.png'),
    ('As Above, So Below', 'https://pub-7db585eeeb464a9d9f749f0307532c22.r2.dev/act_three/media/images/visualizer/ASABOVESOBELOW.png', 'act_three/media/images/visualizer/ASABOVESOBELOW.png'),
    ('Demonic Schemes', 'https://pub-7db585eeeb464a9d9f749f0307532c22.r2.dev/act_three/media/images/visualizer/DEMONICSCHEMES.png', 'act_three/media/images/visualizer/DEMONICSCHEMES.png'),
    ('Through the Fog', 'https://pub-7db585eeeb464a9d9f749f0307532c22.r2.dev/act_three/media/images/visualizer/THROUGHTHEFOG.png', 'act_three/media/images/visualizer/THROUGHTHEFOG.png'),
    ('Where the Phantom Fell', 'https://pub-7db585eeeb464a9d9f749f0307532c22.r2.dev/act_three/media/images/visualizer/WHERETHEPHANTOMFELL.png', 'act_three/media/images/visualizer/WHERETHEPHANTOMFELL.png')
)
insert into public.visualizer_viewport_backgrounds (
  track_id,
  source_url,
  r2_object_key,
  alt_text,
  media_type,
  mime_type,
  is_active,
  metadata,
  updated_at
)
select
  tracks.id,
  background_map.source_url,
  background_map.r2_object_key,
  tracks.title || ' visualizer background',
  'image',
  'image/png',
  true,
  jsonb_build_object('source', 'official-tracklist-3', 'verified_at', '2026-07-25'),
  now()
from background_map
join public.tracks on tracks.title = background_map.title
on conflict (track_id) do update set
  source_url = excluded.source_url,
  r2_object_key = excluded.r2_object_key,
  alt_text = excluded.alt_text,
  media_type = excluded.media_type,
  mime_type = excluded.mime_type,
  is_active = excluded.is_active,
  metadata = excluded.metadata,
  updated_at = now();
