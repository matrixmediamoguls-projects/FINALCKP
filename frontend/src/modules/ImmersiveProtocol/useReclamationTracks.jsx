import { useEffect, useState } from 'react';
import { fetchProtocolTracks } from '../../services/supabase/trackService';
import { fallbackTracks } from './fallbackTrack';

export default function useReclamationTracks() {
  const [tracks, setTracks] = useState(fallbackTracks);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;

    const loadTracks = async () => {
      try {
        const result = await fetchProtocolTracks();
        if (!mounted) return;
        setTracks(result.tracks?.length ? result.tracks : fallbackTracks);
        setError(result.error || '');
      } catch (loadError) {
        if (!mounted) return;
        setError(loadError?.message || 'Unable to load track metadata from Supabase.');
        setTracks(fallbackTracks);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadTracks();

    return () => {
      mounted = false;
    };
  }, []);

  return { tracks, loading, error };
}
