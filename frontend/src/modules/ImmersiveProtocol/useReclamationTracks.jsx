import { useEffect, useState } from 'react';
import { getSupabaseClient } from '../../services/supabase/client';
import { enrichTrackWithVisualResonance } from '../../data/visualResonanceManifest';
import { fallbackTrack } from './fallbackTrack';

export const RECLAMATION_TRACKS_TABLE = 'reclamation_tracks';
export const LEGACY_ACT_THREE_TRACKS_TABLE = 'act.three.tracks';
export const DEFAULT_VISUALIZER_VIEWPORT_IMAGE = '/media/visualizer/reclamation-city-gatekeeper.png';

function formatDuration(seconds) {
  const value = Number(seconds);
  if (!Number.isFinite(value) || value <= 0) return '';
  const minutes = Math.floor(value / 60);
  const remainingSeconds = Math.floor(value % 60);
  return minutes + ':' + String(remainingSeconds).padStart(2, '0');
}

export function normalizeVisualizerPublicPath(value) {
  if (!value || typeof value !== 'string') return DEFAULT_VISUALIZER_VIEWPORT_IMAGE;

  const raw = value.trim().replaceAll('\\\\', '/').replaceAll('\\', '/');
  const mediaIndex = raw.toLowerCase().lastIndexOf('/media/visualizer/');

  if (mediaIndex >= 0) {
    return raw.slice(mediaIndex);
  }

  const publicIndex = raw.toLowerCase().lastIndexOf('frontend/public/');
  if (publicIndex >= 0) {
    return '/' + raw.slice(publicIndex + 'frontend/public/'.length).replace(/^\/+/, '');
  }

  if (raw.startsWith('/media/visualizer/')) return raw;
  if (raw.startsWith('media/visualizer/')) return '/' + raw;
  if (/^https?:\/\//i.test(raw)) return raw;

  return raw.startsWith('/') ? raw : '/media/visualizer/' + raw.replace(/^\/+/, '');
}

function fallbackVisualizerTrack() {
  const viewportImage = normalizeVisualizerPublicPath(fallbackTrack.viewport_image_url || fallbackTrack.visual_media_url || DEFAULT_VISUALIZER_VIEWPORT_IMAGE);

  return enrichTrackWithVisualResonance({
    ...fallbackTrack,
    track_id: fallbackTrack.track_id || 'act_three_reclamation_fallback',
    sort_order: fallbackTrack.sort_order || 1,
    track_order: fallbackTrack.track_order || 1,
    title: fallbackTrack.title || fallbackTrack.name || 'Welcome To The Fire',
    name: fallbackTrack.name || fallbackTrack.title || 'Welcome To The Fire',
    viewport_image_url: viewportImage,
    visual_media_url: viewportImage,
    visual_media_type: fallbackTrack.visual_media_type || 'image',
    visual_media_fallback_image: viewportImage,
    shell_image_url: viewportImage,
    act_background_image: viewportImage,
    background_image_url: viewportImage,
    duration: fallbackTrack.duration || formatDuration(fallbackTrack.duration_seconds),
    lyric_lines: fallbackTrack.lyric_lines || [],
  });
}

function normalizeTrack(row, sourceTable = RECLAMATION_TRACKS_TABLE) {
  const order = Number(row.sort_order ?? row.track_order ?? 999);
  const durationSeconds = Number(row.duration_seconds ?? row.duration_in_seconds ?? 0);
  const viewportImage = normalizeVisualizerPublicPath(
    row.viewport_image_url ||
      row.background_image ||
      row.background_image_url ||
      row.visual_media_fallback_image ||
      row.act_background_image ||
      DEFAULT_VISUALIZER_VIEWPORT_IMAGE
  );
  const lyricsText = row.lyrics_clean || row.lyrics_full || row.display_text || row.lyrics_text || row.lyrics || '';
  const timestampSync = row.timestamp_sync || row.section_map || null;

  let lyricLines = [];
  if (Array.isArray(timestampSync)) {
    lyricLines = timestampSync.map((line, index) => ({
      id: line.id || `${row.id || row.track_id || 'track'}-line-${index}`,
      text: line.text || line.line || line.lyric || '',
      time: Number(line.time ?? line.start ?? line.start_time ?? 0),
    })).filter((line) => line.text);
  }

  return enrichTrackWithVisualResonance({
    ...row,
    track_order: order,
    sort_order: order,
    track_id: row.track_id || row.id,
    name: row.title,
    title: row.title,
    act: row.act || 'ACT THREE: RECLAMATION',
    act_id: row.act_id || 'act_three_reclamation',
    artist: row.artist || 'Musiq Matrix',
    intensity: Number(row.intensity ?? row.energy_level ?? 78),
    duration_seconds: durationSeconds,
    duration: row.duration || formatDuration(durationSeconds),
    audio_url: row.audio_url || '',
    bpm: Number(row.bpm || 128),
    key_signature: row.key_signature || row.key || 'C# MINOR',
    primary_color: row.primary_color || '#ff1b1b',
    lyrics: lyricsText,
    lyrics_text: lyricsText,
    lyric_lines: lyricLines,
    lyric_source: row.display_mode || sourceTable,
    visual_media_url: viewportImage,
    visual_media_type: row.viewport_media_type || row.visual_media_type || 'image',
    visual_media_fallback_image: viewportImage,
    viewport_image_url: viewportImage,
    viewport_alt_text: row.viewport_alt_text || `${row.title || 'Reclamation'} visualizer viewport`,
    has_audio: Boolean(row.audio_url),
    context_points: [
      `Source table: public.${sourceTable}`,
      row.album_title ? `Album: ${row.album_title}` : 'Album: Chroma Key Act Three: Reclamation',
      row.core_theme ? `Core Theme: ${row.core_theme}` : '',
      row.light_code ? `Light Code: ${row.light_code}` : '',
      row.shadow_code ? `Shadow Code: ${row.shadow_code}` : '',
      row.bpm ? `BPM: ${row.bpm}` : '',
      row.key_signature ? `Key: ${row.key_signature}` : '',
      viewportImage ? `Viewport source: ${viewportImage}` : '',
    ].filter(Boolean),
    shell_image_url: viewportImage,
    act_background_image: viewportImage,
    background_image_url: viewportImage,
  });
}

async function fetchProductionTracks(supabase) {
  const { data, error } = await supabase
    .from(RECLAMATION_TRACKS_TABLE)
    .select('id, track_id, title, artist, act_id, act, sort_order, is_active, audio_url, primary_color, intensity, display_text, background_image, act_logo_image, release_status, album_title, viewport_image_url, viewport_media_type, viewport_alt_text, visualizer_scene_id, viewport_layer_config, core_theme, signal_types, lyric_mode, visual_skin, motion_style, particle_types, resonance_events')
    .or('is_active.eq.true,is_active.is.null')
    .order('sort_order', { ascending: true });

  if (error) throw error;
  return (data || []).map((row) => normalizeTrack(row, RECLAMATION_TRACKS_TABLE));
}

async function fetchLegacyTracks(supabase) {
  const { data, error } = await supabase
    .from(LEGACY_ACT_THREE_TRACKS_TABLE)
    .select('id, act_key, track_order, title, slug, duration_seconds, audio_url, light_code, shadow_code, bpm, key_signature, energy_level, mood, storage_bucket, storage_path, viewport_image_url')
    .order('track_order', { ascending: true });

  if (error) throw error;
  return (data || []).map((row) => normalizeTrack(row, LEGACY_ACT_THREE_TRACKS_TABLE));
}

export default function useReclamationTracks() {
  const [tracks, setTracks] = useState([fallbackVisualizerTrack()]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadTracks = async () => {
      const supabase = getSupabaseClient();

      if (!supabase) {
        setLoading(false);
        setError('Supabase credentials missing. Using fallback track.');
        return;
      }

      try {
        let normalized = await fetchProductionTracks(supabase);

        if (!normalized.length) {
          normalized = await fetchLegacyTracks(supabase);
        }

        if (!normalized.length) {
          setTracks([fallbackVisualizerTrack()]);
          setError('No Reclamation tracks found in Supabase. Using fallback track.');
        } else {
          setTracks(normalized);
          setError('');
        }
      } catch (loadError) {
        try {
          const legacy = await fetchLegacyTracks(getSupabaseClient());
          setTracks(legacy.length ? legacy : [fallbackVisualizerTrack()]);
          setError(loadError?.message || 'Production table unavailable. Loaded legacy Act Three tracks.');
        } catch (legacyError) {
          setError(legacyError?.message || loadError?.message || 'Unable to load Reclamation track metadata from Supabase.');
          setTracks([fallbackVisualizerTrack()]);
        }
      } finally {
        setLoading(false);
      }
    };

    loadTracks();
  }, []);

  return { tracks, loading, error };
}
