-- Seed The Matrx Alchemizr tag arrays for the Act III "Reclamation" album.
--
-- Evidence: ActThreeReclamationLyrics.docx (master lyric book, 32 tracks) is the primary
-- source; the "Updated Track Order" taxonomy in act.three.tracks_updated_media_lyrics_UPDATED.xlsx
-- corroborates 21 of them, joined BY TITLE.
--
-- The taxonomy block in act.three.tracks_updated_media_lyrics_CORRECTED2.xlsm is deliberately
-- NOT used. That file re-ordered the track roster without re-mapping its taxonomy columns, so
-- each taxonomy row sits against the wrong title (its row 19 "Through The Fog" carries the
-- Blood Without Stains taxonomy, and so on). See docs/act-three-alchemizr-tags.xlsx, sheet
-- "Source Reconciliation".
--
-- Titles are the exact public.tracks values established by
-- 20260726223304_align_full_visualizer_album.sql. All 32 tracks are tagged.

drop table if exists alchemizr_tag_seed;

create temporary table alchemizr_tag_seed (
  title text primary key,
  vibe_tags text[] not null,
  intention_tags text[] not null,
  element_tags text[] not null,
  theme_tags text[] not null,
  vibration_tags text[] not null
);

insert into alchemizr_tag_seed
  (title, vibe_tags, intention_tags, element_tags, theme_tags, vibration_tags)
values
  ('Welcome To The Fire', array['Gritty','Empowering','Dark'], array['Release','Transform','Heartbreak'], array['Fire'], array['Power','Legacy','Rebirth'], array['Polarity','Frequency']),
  ('Reclamation', array['Empowering','Gritty','Dark'], array['Release','Transform','Inspire'], array['Fire','Earth'], array['Freedom','Power','Rebirth'], array['Resonance','Polarity']),
  ('Know Your Names', array['Dark','Hypnotic','Gritty'], array['Focus','Protect','Awaken'], array['Air','Earth'], array['War','Power'], array['Cause & Effect','Frequency']),
  ('Hold On Through The Burial', array['Empowering','Gritty','Ethereal'], array['Heal','Inspire','Protect'], array['Earth','Water'], array['Faith','Rebirth'], array['Rhythm','Polarity']),
  ('Chosen Ones', array['Ethereal','Hypnotic','Empowering'], array['Awaken','Inspire','Connect'], array['Air'], array['Freedom','Rebirth','Faith'], array['Frequency','Resonance','Mentalism']),
  ('Concrete Warnings', array['Dark','Gritty'], array['Protect','Awaken','Educate'], array['Earth','Air'], array['Loyalty','War'], array['Cause & Effect','Rhythm']),
  ('Adjacent (Reroute It)', array['Empowering','Gritty'], array['Manifest','Educate','Focus'], array['Earth','Air'], array['Freedom','Power','Legacy'], array['Cause & Effect','Polarity']),
  ('Art! Official!', array['Euphoric','Empowering','Ethereal'], array['Manifest','Educate','Inspire'], array['Air','Fire'], array['Legacy','Faith','Power'], array['Frequency','Correspondence']),
  ('Thought Form', array['Hypnotic','Ethereal'], array['Educate','Awaken','Transform'], array['Air'], array['Power','Freedom'], array['Mentalism','Correspondence','Cause & Effect']),
  ('Remember the Price (When You Speak the Name)', array['Dark','Gritty','Empowering'], array['Educate','Transform','Inspire'], array['Fire','Earth'], array['Legacy','Rebirth','Power'], array['Cause & Effect','Polarity']),
  ('Blueprint of the Divine', array['Ethereal','Euphoric'], array['Manifest','Educate','Connect'], array['Air','Fire'], array['Faith','Legacy'], array['Correspondence','Frequency']),
  ('Flip It', array['Empowering','Hypnotic','Euphoric'], array['Transform','Heal','Educate'], array['Air','Fire'], array['Rebirth','Freedom','Faith'], array['Polarity','Mentalism']),
  ('I Am the Signal', array['Empowering','Hypnotic','Ethereal'], array['Awaken','Focus','Protect'], array['Air','Earth'], array['Power','Freedom','Rebirth'], array['Frequency','Resonance']),
  ('I Create as I Speak', array['Euphoric','Empowering','Gritty'], array['Manifest','Inspire','Focus'], array['Fire','Earth'], array['Power','Legacy','Rebirth'], array['Mentalism','Frequency']),
  ('As Above, So Below', array['Dark','Gritty','Hypnotic'], array['Awaken','Educate'], array['Fire','Earth'], array['War','Faith','Freedom'], array['Correspondence','Polarity']),
  ('Elemental Orchestra', array['Nostalgic','Ethereal'], array['Heal','Connect','Heartbreak'], array['Water','Earth'], array['Love','Legacy','Rebirth'], array['Gender','Resonance']),
  ('The Witness Don’t Talk', array['Hypnotic','Ethereal','Chill'], array['Awaken','Educate','Focus'], array['Air','Earth'], array['Legacy','Faith'], array['Mentalism','Frequency']),
  ('Demonic Schemes', array['Dark','Nostalgic','Gritty'], array['Heartbreak','Heal','Protect'], array['Water','Fire'], array['Love','Loyalty','War'], array['Polarity','Cause & Effect']),
  ('Through the Fog', array['Nostalgic','Dreamy','Dark'], array['Heartbreak','Protect','Release'], array['Water','Air'], array['Love','Loyalty','Faith'], array['Rhythm','Polarity']),
  ('Flowers', array['Gritty','Nostalgic','Dark'], array['Heartbreak','Release'], array['Water','Earth'], array['Loyalty','Love'], array['Cause & Effect','Rhythm']),
  ('Misguided Priorities', array['Dark','Gritty','Nostalgic'], array['Release','Protect','Heartbreak'], array['Water','Earth'], array['Love','War','Freedom'], array['Cause & Effect','Polarity']),
  ('The Hierophant', array['Dark','Hypnotic','Gritty'], array['Educate','Awaken','Release'], array['Air','Earth'], array['Power','War','Faith'], array['Cause & Effect','Mentalism']),
  ('Foolish Pride', array['Nostalgic','Dark','Ethereal'], array['Heartbreak','Heal','Release'], array['Earth','Water'], array['Love','Loyalty','Legacy'], array['Cause & Effect','Rhythm']),
  ('Where the Phantom Fell', array['Dark','Ethereal','Nostalgic'], array['Educate','Protect'], array['Air','Fire'], array['Faith','Power'], array['Cause & Effect','Polarity']),
  ('The Whole Cost of You', array['Nostalgic','Dreamy','Chill'], array['Release','Heal','Heartbreak'], array['Water','Fire'], array['Love','Rebirth','Freedom'], array['Gender','Rhythm']),
  ('Blood Without Stains', array['Dark','Gritty','Hypnotic'], array['Protect','Release','Transform'], array['Fire','Earth'], array['War','Power','Faith'], array['Cause & Effect','Polarity']),
  ('Slumlord Fundamentalists', array['Gritty','Dark','Empowering'], array['Educate','Protect'], array['Earth'], array['War','Freedom','Power'], array['Cause & Effect','Rhythm']),
  ('The Reckoning Already Rolled', array['Dark','Empowering','Gritty'], array['Focus','Protect'], array['Air','Earth'], array['War','Power','Freedom'], array['Cause & Effect','Mentalism']),
  ('Architect of the Aftermath', array['Dark','Gritty','Hypnotic'], array['Educate','Protect','Focus'], array['Earth','Fire'], array['War','Power','Legacy'], array['Cause & Effect','Correspondence']),
  ('Seer Broke Chains', array['Dark','Empowering','Gritty'], array['Release','Protect','Transform'], array['Fire','Water'], array['Freedom','War','Rebirth'], array['Polarity','Cause & Effect']),
  ('Fire in My Veins', array['Euphoric','Empowering','Gritty'], array['Transform','Manifest','Inspire'], array['Fire'], array['Power','Rebirth','Legacy'], array['Polarity','Frequency']),
  ('Body Jumper', array['Dark','Hypnotic','Empowering'], array['Release','Transform','Protect'], array['Fire','Air'], array['Rebirth','Power','Freedom'], array['Polarity','Correspondence','Cause & Effect']);

-- Every seeded label must exist in public.tag_dictionary, or the rain field would offer a
-- tag that can never match and the bank would score against a label no track can carry.
do $$
declare
  unknown_labels text;
begin
  select string_agg(distinct format('%s/%s', source.category, seeded.label), ', ')
    into unknown_labels
  from alchemizr_tag_seed as seed
  cross join lateral (
    values
      ('vibe', seed.vibe_tags),
      ('intention', seed.intention_tags),
      ('element', seed.element_tags),
      ('theme', seed.theme_tags),
      ('vibration', seed.vibration_tags)
  ) as source(category, labels)
  cross join lateral unnest(source.labels) as seeded(label)
  where not exists (
    select 1
    from public.tag_dictionary as dictionary
    where dictionary.category = source.category
      and dictionary.label = seeded.label
  );

  if unknown_labels is not null then
    raise exception 'Alchemizr tag seed references labels missing from public.tag_dictionary: %',
      unknown_labels;
  end if;
end
$$;

update public.tracks as tracks
set vibe_tags = seed.vibe_tags,
    intention_tags = seed.intention_tags,
    element_tags = seed.element_tags,
    theme_tags = seed.theme_tags,
    vibration_tags = seed.vibration_tags
from alchemizr_tag_seed as seed
where tracks.title = seed.title;

-- A silent title drift would leave tracks untagged and the alchemizr quietly under-matching,
-- so fail the migration instead.
do $$
declare
  unmatched_titles text;
begin
  select string_agg(seed.title, ', ' order by seed.title)
    into unmatched_titles
  from alchemizr_tag_seed as seed
  left join public.tracks as tracks on tracks.title = seed.title
  where tracks.id is null;

  if unmatched_titles is not null then
    raise exception 'Alchemizr tag seed found no public.tracks row for: %', unmatched_titles;
  end if;
end
$$;

drop table alchemizr_tag_seed;
