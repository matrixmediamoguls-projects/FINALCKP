import { getSovereignSupabase, readSingle } from './sovereignHelpers';

export async function getReclamationUniversityByTrack(trackId) {
  if (!trackId) return null;
  const supabase = getSovereignSupabase();
  if (!supabase) return null;

  return readSingle(
    supabase
      .from('reclamation_university')
      .select('*')
      .eq('track_id', trackId)
  );
}
