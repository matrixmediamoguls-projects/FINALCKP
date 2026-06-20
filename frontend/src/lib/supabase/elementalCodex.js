import { getSovereignSupabase, readSingle } from './sovereignHelpers';

export async function getElementalCodexByTrack(trackId) {
  if (!trackId) return null;
  const supabase = getSovereignSupabase();
  if (!supabase) return null;

  const track = await readSingle(
    supabase
      .from('tracks')
      .select('id, act_id, core_theme, energy_level, signal_type, visual_skin')
      .eq('id', trackId)
  );

  if (!track?.act_id) return null;

  const act = await readSingle(
    supabase
      .from('acts')
      .select('id, element, color_hex, color_key, title, subtitle, description')
      .eq('id', track.act_id)
  );

  if (!act?.element) return { track, act, codex: null };

  const codex = await readSingle(
    supabase
      .from('elemental_codex')
      .select('*')
      .eq('element_key', act.element)
  );

  return { track, act, codex };
}
