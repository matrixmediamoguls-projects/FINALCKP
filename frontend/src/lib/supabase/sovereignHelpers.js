import { getSupabaseClient } from '../../services/supabase/client';

export function getSovereignSupabase() {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return null;
  }
  return supabase;
}

export async function readSingle(query) {
  const { data, error } = await query.maybeSingle();
  if (error) {
    console.error(error);
    return null;
  }
  return data ?? null;
}

export async function readList(query) {
  const { data, error } = await query;
  if (error) {
    console.error(error);
    return [];
  }
  return data ?? [];
}

export function normalizeTrackTitle(track) {
  if (!track) return 'No Track Selected';
  const order = track.track_order ? `${track.track_order}. ` : '';
  return `${order}${track.title || 'Untitled Track'}`;
}
