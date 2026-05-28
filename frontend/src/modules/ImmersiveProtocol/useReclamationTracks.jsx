import { useEffect, useMemo, useState } from 'react';
import { getSupabaseClient } from '../../services/supabase/client';
import { fallbackTrack } from './fallbackTrack';

const safeArray = (value) => {
  if (Array.isArray(value)) return value.slice(0, 5);
  if (!value) return [];
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed.slice(0, 5) : [];
    } catch {
      return value
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean)
        .slice(0, 5);
    }
  }
  return [];
};

const parseLyricLines = (value) => {
  if (!value || typeof value !== 'string') return [];

  return value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line, index) => {
      const timestampMatch = line.match(/^\[(\d{1,2}):(\d{2})(?:[.:](\d{1,3}))?\]\s*(.*)$/);

      if (!timestampMatch) {
        return { id: `line-${index}`, time: null, text: line };
      }

      const minutes = Number(timestampMatch[1]);
      const seconds = Number(timestampMatch[2]);
      const fraction = Number(`0.${timestampMatch[3] || 0}`);

      return {
        id: `line-${index}`,
        time: minutes * 60 + seconds + fraction,
        text: timestampMatch[4] || line,
      };
    })
    .filter((line) => line.text);
};

const resolveR2Url = (base, path) => {
  if (!path) return '';
  if (/^https?:\/\//i.test(path)) return path;
  const baseClean = (base || '').replace(/\/$/, '');
  const pathClean = path.startsWith('/') ? path : `/${path}`;
  return `${baseClean}${pathClean}`;
};

const resolveAudioUrl = (raw, r2BaseUrl) => {
  if (raw.audio_url) return raw.audio_url;
  if (!raw.audio_file_name) return '';
  const fileName = raw.audio_file_name.includes('.')
    ? raw.audio_file_name
    : `${raw.audio_file_name}.mp3`;
  return `${(r2BaseUrl || '').replace(/\/$/, '')}/audio/reclamation/${fileName}`;
};

const isVideoAsset = (url) => /\.(mp4|webm|mov|m4v)(\?.*)?$/i.test(url || '');

const resolveVisualMedia = (raw, r2BaseUrl) => {
  const video = resolveR2Url(
    r2BaseUrl,
    raw.visual_video ||
      raw.background_video ||
      raw.video_url ||
      raw.visual_media_video ||
      ''
  );
  const image = resolveR2Url(
    r2BaseUrl,
    raw.visual_image ||
      raw.background_image ||
      raw.visual_media_image ||
      raw.shell_image ||
      raw.act_logo_image ||
      ''
  );
  const media = resolveR2Url(r2BaseUrl, raw.visual_media_url || raw.media_url || '');

  if (video) return { visual_media_url: video, visual_media_type: 'video' };
  if (media) {
    return {
      visual_media_url: media,
      visual_media_type: raw.visual_media_type || (isVideoAsset(media) ? 'video' : 'image'),
    };
  }
  if (image) return { visual_media_url: image, visual_media_type: 'image' };

  return { visual_media_url: '', visual_media_type: '' };
};

const formatDuration = (seconds) => {
  if (!Number.isFinite(seconds) || seconds <= 0) return '';

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  return `${minutes}:${String(remainingSeconds).padStart(2, '0')}`;
};

const loadAudioDuration = (url) => new Promise((resolve) => {
  if (!url || typeof Audio === 'undefined') {
    resolve(0);
    return;
  }

  const audio = new Audio();
  let settled = false;
  const timeout = window.setTimeout(() => finish(0), 8000);

  const finish = (seconds) => {
    if (settled) return;
    settled = true;
    window.clearTimeout(timeout);
    audio.removeAttribute('src');
    audio.load();
    resolve(Number.isFinite(seconds) ? seconds : 0);
  };

  audio.preload = 'metadata';
  audio.onloadedmetadata = () => finish(audio.duration || 0);
  audio.onerror = () => finish(0);
  audio.src = url;
});

const hydrateDurations = async (tracks) => Promise.all(
  tracks.map(async (track) => {
    const storedSeconds = Number(track.duration_seconds ?? track.duration_in_seconds);

    if (Number.isFinite(storedSeconds) && storedSeconds > 0) {
      return {
        ...track,
        duration_seconds: storedSeconds,
        duration: track.duration || formatDuration(storedSeconds),
      };
    }

    const loadedSeconds = await loadAudioDuration(track.audio_url);

    if (!loadedSeconds) return track;

    return {
      ...track,
      duration_seconds: loadedSeconds,
      duration: formatDuration(loadedSeconds),
    };
  })
);

const normalizeTrack = (raw, r2BaseUrl) => {
  const lyricSource = raw.lyrics || raw.display_text || '';
  const lyric_lines = parseLyricLines(lyricSource);
  const actLabel = raw.act || raw.act_id || 'ACT THREE';
  const audio_url = resolveAudioUrl(raw, r2BaseUrl);
  const visualMedia = resolveVisualMedia(raw, r2BaseUrl);

  return {
    ...raw,
    sort_order: Number(raw.sort_order ?? 999),
    intensity: Number(raw.intensity ?? 50),
    act: actLabel,
    act_keys: safeArray(raw.act_keys),
    audio_url,
    audio_cross_origin: raw.audio_cross_origin || undefined,
    ...visualMedia,
    has_audio: Boolean(audio_url),
    lyric_lines,
    lyric_source: raw.lyrics ? 'lyrics' : raw.display_text ? 'display_text' : '',
    context_points: [
      raw.artist ? `Artist: ${raw.artist}` : '',
      `Signal: ${raw.release_status || 'unpublished'}`,
      audio_url ? 'Audio source: Cloudflare media endpoint' : 'Audio source: unavailable',
      lyric_lines.length ? `${lyric_lines.length} lyric lines indexed` : 'No lyric lines indexed',
    ].filter(Boolean),
    shell_image_url: resolveR2Url(r2BaseUrl, raw.shell_image),
    act_background_image: resolveR2Url(r2BaseUrl, raw.shell_image || raw.background_image || ''),
    act_logo_asset: resolveR2Url(r2BaseUrl, raw.act_logo_asset || raw.act_logo_image || ''),
    background_image_url: resolveR2Url(r2BaseUrl, raw.background_image),
  };
};

export default function useReclamationTracks() {
  const [tracks, setTracks] = useState([fallbackTrack]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const config = useMemo(() => {
    const r2BaseUrl = import.meta.env.VITE_APP_R2_PUBLIC_BASE_URL || '';
    return { r2BaseUrl };
  }, []);

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
          .from('reclamation_tracks')
          .select('*')
          .eq('is_active', true)
          .order('sort_order', { ascending: true });

        if (fetchError) throw fetchError;

        const normalized = await hydrateDurations(
          (data || []).map((row) => normalizeTrack(row, config.r2BaseUrl))
        );
        if (!normalized.length) {
          setTracks([fallbackTrack]);
          setError('No active tracks found. Using fallback track.');
        } else {
          setTracks(normalized);
          setError('');
        }
      } catch (loadError) {
        setError(loadError?.message || 'Unable to load track metadata from Supabase.');
        setTracks([fallbackTrack]);
      } finally {
        setLoading(false);
      }
    };

    loadTracks();
  }, [config]);

  return { tracks, loading, error };
}
