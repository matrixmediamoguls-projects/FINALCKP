import { ACTS, normalizeActKey } from '../../hooks/actConfig';
import { fallbackTrack, fallbackTracks } from '../../modules/ImmersiveProtocol/fallbackTrack';
import { getSupabaseClient } from './client';

const safeArray = (value) => {
  if (Array.isArray(value)) return value.slice(0, 8);
  if (!value) return [];
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed.slice(0, 8) : [];
    } catch {
      return value
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean)
        .slice(0, 8);
    }
  }
  return [];
};

const resolveR2Url = (base, path) => {
  if (!path) return '';
  if (/^https?:\/\//i.test(path) || path.startsWith('/')) return path;
  const baseClean = (base || '').replace(/\/$/, '');
  const pathClean = path.startsWith('/') ? path : `/${path}`;
  return `${baseClean}${pathClean}`;
};

const resolveAudioUrl = (raw, r2BaseUrl) => {
  if (raw.audio_url) return raw.audio_url;

  const audioName = raw.audio_file_name || raw.audio_filename;
  if (!audioName) return '';
  if (/^https?:\/\//i.test(audioName) || audioName.startsWith('/')) return audioName;

  const audioPath = audioName.includes('/') ? audioName : `audio/reclamation/${audioName}`;
  return resolveR2Url(r2BaseUrl, audioPath);
};

const numberOr = (value, fallback) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

export function normalizeWords(value) {
  let words = value;

  if (typeof words === 'string') {
    try {
      words = JSON.parse(words);
    } catch {
      words = words.split(/\s+/).filter(Boolean);
    }
  }

  if (!Array.isArray(words)) return [];

  return words
    .map((word, index) => {
      if (typeof word === 'string') return { w: word, t: index * 0.42 };
      const text = word?.w || word?.word || word?.text || '';
      if (!text) return null;
      return {
        ...word,
        w: String(text),
        t: numberOr(word?.t ?? word?.time ?? word?.start, index * 0.42),
      };
    })
    .filter(Boolean);
}

export function normalizeLyricRows(rows = []) {
  return rows
    .map((row, index) => {
      const words = normalizeWords(row.words || row.word_timings || row.text || row.line || '');
      const text = row.text || row.line || words.map((word) => word.w).join(' ');

      return {
        ...row,
        id: row.id || `${row.track_id || 'track'}-${index}`,
        time: numberOr(row.time ?? row.start_time ?? row.start, index * 5),
        words,
        text,
      };
    })
    .filter((row) => row.words.length || row.text)
    .sort((a, b) => a.time - b.time);
}

export function buildLyricsFromText(text = '') {
  const cleanText = String(text || '').trim();
  if (!cleanText) return [];

  const lines = cleanText
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean);

  return lines.map((line, lineIndex) => {
    const words = normalizeWords(line);
    return {
      id: `fallback-lyric-${lineIndex}`,
      track_id: 'fallback',
      time: lineIndex * Math.max(3, words.length * 0.42),
      text: line,
      words,
    };
  });
}

const sortTracks = (tracks) =>
  tracks
    .slice()
    .sort((a, b) => {
      const sortA = numberOr(a.sort_order, 999);
      const sortB = numberOr(b.sort_order, 999);
      if (sortA !== sortB) return sortA - sortB;
      return String(a.title || '').localeCompare(String(b.title || ''));
    });

const normalizeFallbackTracks = (r2BaseUrl = '') => sortTracks(
  fallbackTracks.map((track) => normalizeLegacyTrack(track, r2BaseUrl))
);

export function normalizeProtocolTrack(raw, lyricRows = [], r2BaseUrl = '') {
  const actKey = normalizeActKey(raw.act_id || raw.act || raw.act_name);
  const act = ACTS[actKey] || ACTS.FIRE;
  const trackId = raw.track_id || raw.slug || raw.id || raw.title || 'protocol-track';
  const title = raw.title || raw.name || String(trackId).replace(/[-_]+/g, ' ').toUpperCase();
  const backgroundUrl = raw.background_url || raw.background_image_url || resolveR2Url(r2BaseUrl, raw.background_image);
  const lyrics = normalizeLyricRows(lyricRows);
  const fallbackLyrics = buildLyricsFromText(raw.display_text || raw.lyric_text || raw.description || '');

  return {
    ...raw,
    id: raw.id || trackId,
    track_id: trackId,
    title,
    sort_order: numberOr(raw.sort_order, 999),
    intensity: numberOr(raw.intensity, 76),
    act_id: actKey,
    act: raw.act || act.title,
    act_field: act.field,
    act_keys: safeArray(raw.act_keys),
    primary_color: raw.primary_color || raw.color || act.color,
    secondary_color: raw.secondary_color || act.secondaryColor,
    audio_url: resolveAudioUrl(raw, r2BaseUrl),
    background_url: backgroundUrl,
    background_image_url: backgroundUrl,
    act_background_image: raw.act_background_image || backgroundUrl,
    album_art: raw.album_art || raw.artwork_url || raw.cover_url || '',
    sonic_artifact: raw.sonic_artifact || raw.sonic_artifact_declaration || '',
    sonic_artifact_declaration: raw.sonic_artifact_declaration || raw.sonic_artifact || '',
    lyrics: lyrics.length ? lyrics : fallbackLyrics,
    display_text: raw.display_text || lyrics[0]?.text || fallbackLyrics[0]?.text || '',
    display_text_enabled: raw.display_text_enabled ?? true,
    release_status: raw.release_status || 'live',
    scanline_enabled: raw.scanline_enabled ?? true,
    pulse_strength: numberOr(raw.pulse_strength, 82),
    fog_level: numberOr(raw.fog_level, 18),
    glitch_level: numberOr(raw.glitch_level, 24),
    vignette_strength: numberOr(raw.vignette_strength, 70),
  };
}

export function normalizeLegacyTrack(raw, r2BaseUrl = '') {
  const audioPath = resolveAudioUrl(raw, r2BaseUrl);
  const shellImage = raw.shell_image || raw.background_image || '';
  const backgroundUrl = raw.act_background_image || resolveR2Url(r2BaseUrl, shellImage);

  return normalizeProtocolTrack(
    {
      ...raw,
      audio_url: audioPath,
      act_background_image: backgroundUrl,
      background_image_url: resolveR2Url(r2BaseUrl, raw.background_image || shellImage),
      shell_image_url: resolveR2Url(r2BaseUrl, raw.shell_image),
      act_logo_asset: resolveR2Url(r2BaseUrl, raw.act_logo_asset || raw.act_logo_image || ''),
    },
    [],
    r2BaseUrl
  );
}

export async function fetchTrack(trackId) {
  const supabase = getSupabaseClient();
  if (!supabase) return normalizeProtocolTrack(fallbackTrack);

  const { data: track, error: trackError } = await supabase
    .from('tracks')
    .select('*')
    .eq('track_id', trackId)
    .single();

  if (trackError) throw trackError;

  const { data: lyrics, error: lyricError } = await supabase
    .from('lyrics')
    .select('*')
    .eq('track_id', trackId)
    .order('time', { ascending: true });

  if (lyricError) throw lyricError;

  return normalizeProtocolTrack(track, lyrics || []);
}

export async function fetchProtocolTracks() {
  const supabase = getSupabaseClient();
  const r2BaseUrl = import.meta.env.VITE_APP_R2_PUBLIC_BASE_URL || '';

  if (!supabase) {
    return {
      tracks: normalizeFallbackTracks(r2BaseUrl),
      error: '',
    };
  }

  let protocolError = '';

  try {
    const { data: tracks, error } = await supabase.from('tracks').select('*');
    if (error) throw error;

    if (tracks?.length) {
      const trackIds = tracks.map((track) => track.track_id || track.id).filter(Boolean);
      let lyricRows = [];

      if (trackIds.length) {
        const { data: lyrics, error: lyricError } = await supabase
          .from('lyrics')
          .select('*')
          .in('track_id', trackIds)
          .order('time', { ascending: true });

        if (!lyricError) lyricRows = lyrics || [];
      }

      const byTrack = lyricRows.reduce((acc, row) => {
        const id = row.track_id;
        if (!acc[id]) acc[id] = [];
        acc[id].push(row);
        return acc;
      }, {});

      return {
        tracks: sortTracks(
          tracks.map((track) => normalizeProtocolTrack(track, byTrack[track.track_id || track.id] || [], r2BaseUrl))
        ),
        error: '',
      };
    }
  } catch (error) {
    protocolError = error?.message || 'Unable to load protocol tracks.';
  }

  try {
    const { data, error } = await supabase
      .from('reclamation_tracks')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true });

    if (error) throw error;

    const tracks = (data || []).map((row) => normalizeLegacyTrack(row, r2BaseUrl));
    if (tracks.length) return { tracks: sortTracks(tracks), error: protocolError };

    return {
      tracks: normalizeFallbackTracks(r2BaseUrl),
      error: '',
    };
  } catch (error) {
    return {
      tracks: normalizeFallbackTracks(r2BaseUrl),
      error: '',
    };
  }
}
