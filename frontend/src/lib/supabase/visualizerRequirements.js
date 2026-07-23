import { getSovereignSupabase } from './sovereignHelpers';

export async function getVisualizerRequirementsByTrack(trackId) {
  if (!trackId) return null;
  const supabase = getSovereignSupabase();
  if (!supabase) return null;

  const { data: track, error: trackError } = await supabase
    .from('tracks')
    .select('preset_id, r2_cover_key')
    .eq('id', trackId)
    .maybeSingle();

  if (trackError || !track) {
    console.error('Unable to resolve the visualizer preset.', trackError);
    return null;
  }

  const { data: preset, error: presetError } = track.preset_id
    ? await supabase
      .from('visual_presets')
      .select('id, name, shader_name, palette_json, intensity')
      .eq('id', track.preset_id)
      .maybeSingle()
    : { data: null, error: null };

  if (presetError) {
    console.error('Unable to load the visualizer preset.', presetError);
  }

  return {
    ...(preset || {}),
    cover_image_url: track.r2_cover_key
      ? `${(import.meta.env.VITE_APP_R2_PUBLIC_BASE_URL || 'https://media.chromakeyprotocol.com').replace(/\/+$/, '')}/${track.r2_cover_key.replace(/^\/+/, '')}`
      : null,
  };
}
