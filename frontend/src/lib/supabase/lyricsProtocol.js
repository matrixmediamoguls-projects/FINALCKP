import { getSovereignSupabase, readSingle } from './sovereignHelpers';

export async function getLyricsProtocolByTrack(trackId) {
  if (!trackId) return null;
  const supabase = getSovereignSupabase();
  if (!supabase) return null;

  return readSingle(
    supabase
      .from('lyrics_protocol')
      .select('*')
      .eq('track_id', trackId)
  );
}
