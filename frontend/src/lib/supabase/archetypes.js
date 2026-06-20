import { getSovereignSupabase, readList, readSingle } from './sovereignHelpers';

export async function getArchetypesByTrack(trackId) {
  if (!trackId) return [];
  const supabase = getSovereignSupabase();
  if (!supabase) return [];

  const rows = await readList(
    supabase
      .from('track_archetypes')
      .select('relationship_type, sort_order, archetypes(*)')
      .eq('track_id', trackId)
      .order('sort_order', { ascending: true })
  );

  if (rows.length > 0) {
    return rows.map((row) => ({ ...row.archetypes, relationship_type: row.relationship_type }));
  }

  const track = await readSingle(
    supabase
      .from('tracks')
      .select('core_theme, signal_type')
      .eq('id', trackId)
  );

  if (!track) return [];

  return [
    {
      id: 'fallback-archetype',
      title: track.core_theme || 'Sovereign Signal',
      archetype_role: track.signal_type || 'Track Pattern',
      shadow_expression: 'Not assigned yet.',
      reclaimed_expression: 'Use this track theme as the provisional archetype until the codex is mapped.',
      reflection_prompt: 'What identity pattern does this track reveal?'
    }
  ];
}
