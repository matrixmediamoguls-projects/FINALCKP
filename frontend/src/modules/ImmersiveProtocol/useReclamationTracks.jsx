import { useEffect, useState } from 'react';
import { getSupabaseClient } from '../../services/supabase/client';
import { enrichTrackWithVisualResonance } from '../../data/visualResonanceManifest';
import { fallbackTrack } from './fallbackTrack';

export const ACT_THREE_TRACKS_TABLE = 'act.three.tracks';
export const DEFAULT_VISUALIZER_VIEWPORT_IMAGE = '/media/visualizer/reclamation-city-gatekeeper.png.png';

function formatDuration(seconds) {
  const value = Number(seconds);
  if (!Number.isFinite(value) || value <= 0) return '';
  const minutes = Math.floor(value / 60);
  const remainingSeconds = Math.floor(value % 60);
  return minutes + ':' + String(remainingSeconds).padStart(2, '0');
}

function fallbackVisualizerTrack() {
  return enrichTrackWithVisualResonance({
    ...fallbackTrack,
    viewport_image_url: DEFAULT_VISUALIZER_VIEWPORT_IMAGE,
    visual_media_url: fallbackTrack.visual_media_url || DEFAULT_VISUALIZER_VIEWPORT_IMAGE,
    visual_media_type: fallbackTrack.visual_media_type || 'image',
  });
}

function normalizeTrack(row) {
  const trackOrder = Number(row.track_order || 999);
  const viewportImage = row.viewport_image_url || DEFAULT_VISUALIZER_VIEWPORT_IMAGE;
  const duration = formatDuration(row.duration_seconds);

  return enrichTrackWithVisualResonance({
    ...row,
    track_order: trackOrder,
    sort_order: trackOrder,
    track_id: row.id,
    name: row.title,
    act: 'ACT THREE',
    intensity: Number(row.energy_level || 50),
    duration,
    visual_media_url: viewportImage,
    visual_media_type: 'image',
    visual_media_fallback_image: '',
    viewport_image_url: viewportImage,
    viewport_alt_text: (row.title || 'Act Three') + ' visualizer viewport',
    has_audio: Boolean(row.audio_url),
    lyrics_text: '',
    lyric_lines: [],
    lyric_source: '',
    context_points: [
      'Source table: public.act.three.tracks',
      row.mood ? 'Mood: ' + row.mood : '',
      row.light_code ? 'Light Code: ' + row.light_code : '',
      row.shadow_code ? 'Shadow Code: ' + row.shadow_code : '',
      row.bpm ? 'BPM: ' + row.bpm : '',
      row.key_signature ? 'Key: ' + row.key_signature : '',
      row.audio_url ? 'Audio source: Supabase track row' : 'Audio source: unavailable',
      viewportImage ? 'Viewport source: ' + viewportImage : '',
    ].filter(Boolean),
    shell_image_url: viewportImage,
    act_background_image: viewportImage,
    background_image_url: viewportImage,
  });
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
        const { data, error: fetchError } = await supabase
          .from(ACT_THREE_TRACKS_TABLE)
          .select('id, track_order, title, duration_seconds, audio_url, bpm, key_signature, energy_level, mood, light_code, shadow_code, viewport_image_url')
          .order('track_order', { ascending: true });

        if (fetchError) throw fetchError;

        const normalized = (data || []).map(normalizeTrack);

        if (!normalized.length) {
          setTracks([fallbackVisualizerTrack()]);
          setError('No Act Three tracks found in Supabase. Using fallback track.');
        } else {
          setTracks(normalized);
          setError('');
        }
      } catch (loadError) {
        setError(loadError?.message || 'Unable to load Act Three track metadata from Supabase.');
        setTracks([fallbackVisualizerTrack()]);
      } finally {
        setLoading(false);
      }
    };

    loadTracks();
  }, []);

  return { tracks, loading, error };
}
