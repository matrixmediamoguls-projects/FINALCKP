import { getSovereignSupabase, readList, readSingle } from './sovereignHelpers';

export async function getActThreeTracks() {
  const supabase = getSovereignSupabase();
  if (!supabase) return [];

  return readList(
    supabase
      .from('tracks')
      .select('*')
      .order('track_order', { ascending: true })
  );
}

export async function getTrackById(trackId) {
  if (!trackId) return null;
  const supabase = getSovereignSupabase();
  if (!supabase) return null;

  return readSingle(
    supabase
      .from('tracks')
      .select('*')
      .eq('id', trackId)
  );
}
