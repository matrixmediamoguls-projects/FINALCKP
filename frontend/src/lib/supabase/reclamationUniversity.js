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

export async function saveReclamationUniversityResponse({
  moduleId,
  selectedShadowCodes = [],
  retrievedLightCodes = [],
  declaration = {},
  integrationKey = '',
}) {
  const supabase = getSovereignSupabase();
  if (!supabase) {
    return { data: null, error: new Error('Supabase client is not configured.') };
  }

  const { data: userResult, error: userError } = await supabase.auth.getUser();
  if (userError) return { data: null, error: userError };

  const userId = userResult?.user?.id;
  if (!userId) {
    return { data: null, error: new Error('Sign in is required before saving this Reclamation University record.') };
  }

  const { data, error } = await supabase
    .from('rec_uni_module_responses')
    .upsert(
      {
        user_id: userId,
        module_id: moduleId,
        selected_shadow_codes: selectedShadowCodes,
        retrieved_light_codes: retrievedLightCodes,
        declaration_json: declaration,
        integration_key: integrationKey,
        completed_at: new Date().toISOString(),
      },
      { onConflict: 'user_id,module_id' }
    )
    .select('*')
    .maybeSingle();

  if (error) return { data: null, error };
  return { data, error: null };
}
