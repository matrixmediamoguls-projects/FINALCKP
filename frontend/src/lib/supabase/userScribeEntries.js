import { getSovereignSupabase } from './sovereignHelpers';

export async function saveUserScribeEntry(entry) {
  const supabase = getSovereignSupabase();
  if (!supabase) return null;

  const result = await supabase
    .from('user_scribe_entries')
    .insert(entry)
    .select('*')
    .single();

  if (result.error) {
    console.error(result.error);
    return null;
  }

  return result.data;
}
