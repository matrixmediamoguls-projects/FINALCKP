import { getSovereignSupabase, readSingle } from './sovereignHelpers';

export async function getVibesAndScribesByTrack(trackId) {
  if (!trackId) return null;
  const supabase = getSovereignSupabase();
  if (!supabase) return null;

  return readSingle(
    supabase
      .from('vibes_and_scribes')
      .select('*')
      .eq('track_id', trackId)
  );
}
