import { getSovereignSupabase, readSingle } from './sovereignHelpers';

export async function getSonicArtifactByTrack(trackId) {
  if (!trackId) return null;
  const supabase = getSovereignSupabase();
  if (!supabase) return null;

  const track = await readSingle(
    supabase
      .from('tracks')
      .select('*')
      .eq('id', trackId)
  );

  const artifact = await readSingle(
    supabase
      .from('sonic_artifacts')
      .select('*')
      .eq('track_id', trackId)
  );

  return { track, artifact };
}
