import { useEffect, useMemo, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
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

const resolveR2Url = (base, path) => {
  if (!path) return '';
  if (/^https?:\/\//i.test(path)) return path;
  const baseClean = (base || '').replace(/\/$/, '');
  const pathClean = path.startsWith('/') ? path : `/${path}`;
  return `${baseClean}${pathClean}`;
};

const normalizeTrack = (raw, r2BaseUrl) => ({
  ...raw,
  sort_order: Number(raw.sort_order ?? 999),
  intensity: Number(raw.intensity ?? 50),
  act_keys: safeArray(raw.act_keys),
  audio_url: `${(r2BaseUrl || '').replace(/\/$/, '')}/audio/reclamation/${raw.audio_file_name || ''}`,
  shell_image_url: resolveR2Url(r2BaseUrl, raw.shell_image),
  act_logo_image_url: resolveR2Url(r2BaseUrl, raw.act_logo_image),
  background_image_url: resolveR2Url(r2BaseUrl, raw.background_image),
});

export default function useReclamationTracks() {
  const [tracks, setTracks] = useState([fallbackTrack]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const config = useMemo(() => {
    const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || '';
    const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || '';
    const r2BaseUrl = process.env.REACT_APP_R2_PUBLIC_BASE_URL || '';
    return { supabaseUrl, supabaseAnonKey, r2BaseUrl };
  }, []);

  useEffect(() => {
    const loadTracks = async () => {
      if (!config.supabaseUrl || !config.supabaseAnonKey) {
        setLoading(false);
        setError('Supabase credentials missing. Using fallback track.');
        return;
      }

      try {
        const supabase = createClient(config.supabaseUrl, config.supabaseAnonKey);
        const { data, error: fetchError } = await supabase
          .from('reclamation_tracks')
          .select('*')
          .eq('is_active', true)
          .order('sort_order', { ascending: true });

        if (fetchError) throw fetchError;

        const normalized = (data || []).map((row) => normalizeTrack(row, config.r2BaseUrl));
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
