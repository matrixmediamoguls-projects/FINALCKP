import { getSovereignSupabase, readList, readSingle } from './sovereignHelpers';

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

export async function getLyricsProtocolForTracks(trackIds = []) {
  const ids = trackIds.filter(Boolean);
  if (!ids.length) return [];
  const supabase = getSovereignSupabase();
  if (!supabase) return [];

  return readList(
    supabase
      .from('lyrics_protocol')
      .select('*')
      .in('track_id', ids)
  );
}
