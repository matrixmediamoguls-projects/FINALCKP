import { getSovereignSupabase, readSingle } from './sovereignHelpers';

export async function getVisualizerRequirementsByTrack(trackId) {
  if (!trackId) return null;
  const supabase = getSovereignSupabase();
  if (!supabase) return null;

  return readSingle(
    supabase
      .from('visualizer_requirements')
      .select('*')
      .eq('track_id', trackId)
  );
}
