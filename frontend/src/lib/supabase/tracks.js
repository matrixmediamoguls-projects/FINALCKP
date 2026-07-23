import { getSovereignSupabase } from './sovereignHelpers';

const VISUALIZER_PLAYLIST_SLUG = 'reclamation-visualizer-preview';
const R2_PUBLIC_BASE_URL = (
  import.meta.env.VITE_APP_R2_PUBLIC_BASE_URL || 'https://media.chromakeyprotocol.com'
).replace(/\/+$/, '');

function buildR2Url(objectKey) {
  if (!objectKey) return null;
  if (/^https?:\/\//i.test(objectKey)) return objectKey;
  return `${R2_PUBLIC_BASE_URL}/${String(objectKey).replace(/^\/+/, '')}`;
}

function normalizeTrack(row, position = null, lyricData = null) {
  if (!row) return null;
  const timedLyrics = lyricData?.timedLyrics || [];
  const protocol = lyricData?.protocol || null;
  const lyrics = timedLyrics.length
    ? timedLyrics.map((line) => line.line_text).join('\n')
    : protocol?.lyrics_clean || protocol?.lyrics_full || '';

  return {
    ...row,
    track_order: position ?? row.queue_index ?? 0,
    duration_seconds: row.duration_ms ? row.duration_ms / 1000 : null,
    audio_url: buildR2Url(row.r2_audio_key),
    cover_url: buildR2Url(row.r2_cover_key),
    cover_image_url: buildR2Url(row.r2_cover_key),
    display_text: lyrics,
    lyrics,
    light_code: protocol?.primary_light_code || null,
    lyric_summary: protocol?.lyric_summary || null,
    timed_lyrics: timedLyrics,
    visual_preset: row.visual_presets || null,
  };
}

const TRACK_COLUMNS = `
  id,
  title,
  artist,
  album,
  duration_ms,
  bpm,
  queue_index,
  r2_audio_key,
  r2_cover_key,
  preset_id,
  visual_presets (
    id,
    name,
    shader_name,
    palette_json,
    intensity
  )
`;

export async function getActThreeTracks() {
  const supabase = getSovereignSupabase();
  if (!supabase) return [];

  const { data: playlist, error: playlistError } = await supabase
    .from('visualizer_playlists')
    .select('id, name, slug')
    .eq('slug', VISUALIZER_PLAYLIST_SLUG)
    .eq('is_active', true)
    .maybeSingle();

  if (playlistError || !playlist) {
    console.error('Unable to load the active visualizer playlist.', playlistError);
    return [];
  }

  const { data: playlistRows, error: playlistTracksError } = await supabase
    .from('visualizer_playlist_tracks')
    .select('track_id, position')
    .eq('playlist_id', playlist.id)
    .order('position', { ascending: true });

  if (playlistTracksError || !playlistRows?.length) {
    console.error('Unable to load visualizer playlist tracks.', playlistTracksError);
    return [];
  }

  const ids = playlistRows.map((row) => row.track_id);
  const { data: trackRows, error: tracksError } = await supabase
    .from('tracks')
    .select(TRACK_COLUMNS)
    .in('id', ids);

  if (tracksError) {
    console.error('Unable to load visualizer tracks.', tracksError);
    return [];
  }

  const tracksById = new Map((trackRows || []).map((row) => [row.id, row]));
  return playlistRows
    .map((item) => normalizeTrack(tracksById.get(item.track_id), item.position))
    .filter(Boolean);
}

export async function getTrackById(trackId) {
  if (!trackId) return null;
  const supabase = getSovereignSupabase();
  if (!supabase) return null;

  const [trackResult, timedLyricsResult, protocolResult] = await Promise.all([
    supabase.from('tracks').select(TRACK_COLUMNS).eq('id', trackId).maybeSingle(),
    supabase
      .from('track_lyrics')
      .select('line_order, line_text, start_ms, end_ms')
      .eq('track_id', trackId)
      .order('line_order', { ascending: true }),
    supabase
      .from('lyrics_protocol')
      .select('lyrics_full, lyrics_clean, primary_light_code, lyric_summary, display_mode')
      .eq('track_id', trackId)
      .maybeSingle(),
  ]);

  if (trackResult.error) {
    console.error('Unable to load visualizer track.', trackResult.error);
    return null;
  }

  return normalizeTrack(trackResult.data, trackResult.data?.queue_index, {
    timedLyrics: timedLyricsResult.data || [],
    protocol: protocolResult.data || null,
  });
}
