do $migration$
declare
  current_id_type text;
begin
  select data_type
    into current_id_type
  from information_schema.columns
  where table_schema = 'public'
    and table_name = 'track_cover_art'
    and column_name = 'id';

  if current_id_type = 'uuid' then
    if exists (
      select 1
      from public.track_cover_art cover
      left join public.tracks track on track.id = cover.track_id
      where track.title is null or btrim(track.title) = ''
    ) then
      raise exception 'Every cover-art row must resolve to a non-empty track title';
    end if;

    if exists (
      select track.title
      from public.track_cover_art cover
      join public.tracks track on track.id = cover.track_id
      group by track.title
      having count(*) > 1
    ) then
      raise exception 'Track titles must be unique before using them as cover-art IDs';
    end if;

    alter table public.track_cover_art add column human_id text;

    update public.track_cover_art cover
    set human_id = track.title
    from public.tracks track
    where track.id = cover.track_id;

    alter table public.track_cover_art
      alter column human_id set not null,
      drop constraint track_cover_art_pkey,
      drop column id;

    alter table public.track_cover_art rename column human_id to id;
    alter table public.track_cover_art add constraint track_cover_art_pkey primary key (id);
  elsif current_id_type <> 'text' then
    raise exception 'Unexpected track_cover_art.id type: %', current_id_type;
  end if;
end
$migration$;

comment on column public.track_cover_art.id is
  'Human-readable primary key equal to the linked track title.';
