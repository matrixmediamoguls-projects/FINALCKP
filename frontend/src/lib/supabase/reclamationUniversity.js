import { getSovereignSupabase, readSingle } from './sovereignHelpers';

/**
 * Get Reclamation University content by track ID (legacy support)
 */
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

/**
 * Load user's progress for a specific module
 */
export async function loadUserProgress(moduleId) {
  const supabase = getSovereignSupabase();
  if (!supabase) {
    return { data: null, error: new Error('Supabase client is not configured.') };
  }

  const { data: userResult, error: userError } = await supabase.auth.getUser();
  if (userError) return { data: null, error: userError };

  const userId = userResult?.user?.id;
  if (!userId) {
    return { data: null, error: new Error('Sign in is required.') };
  }

  const { data, error } = await supabase
    .from('rec_uni_user_progress')
    .select('*')
    .eq('user_id', userId)
    .eq('module_id', moduleId)
    .maybeSingle();

  if (error) return { data: null, error };
  return { data, error: null };
}

/**
 * Save user progress for a module (incremental save)
 */
export async function saveUserProgress({
  moduleId,
  status = 'in_progress',
  activeScene = 0,
  listenedTrackIds = [],
  selectedShadowCodes = [],
  retrievedLightCodes = [],
  declarationJson = {},
  integrationKey = '',
  completedAt = null,
}) {
  const supabase = getSovereignSupabase();
  if (!supabase) {
    return { data: null, error: new Error('Supabase client is not configured.') };
  }

  const { data: userResult, error: userError } = await supabase.auth.getUser();
  if (userError) return { data: null, error: userError };

  const userId = userResult?.user?.id;
  if (!userId) {
    return { data: null, error: new Error('Sign in is required before saving progress.') };
  }

  const { data, error } = await supabase
    .from('rec_uni_user_progress')
    .upsert(
      {
        user_id: userId,
        module_id: moduleId,
        status,
        active_scene: activeScene,
        listened_track_ids: listenedTrackIds,
        selected_shadow_codes: selectedShadowCodes,
        retrieved_light_codes: retrievedLightCodes,
        declaration_json: declarationJson,
        integration_key: integrationKey,
        started_at: new Date().toISOString(),
        completed_at: completedAt,
      },
      { onConflict: 'user_id,module_id' }
    )
    .select('*')
    .maybeSingle();

  if (error) return { data: null, error };
  return { data, error: null };
}

/**
 * Save Reclamation University response (legacy support, maps to new schema)
 */
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

  // Try to save to new schema first
  const { data: newData, error: newError } = await supabase
    .from('rec_uni_user_progress')
    .upsert(
      {
        user_id: userId,
        module_id: moduleId,
        status: 'completed',
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

  if (!newError) {
    // Also save to legacy table for backward compatibility
    await supabase
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
      );

    return { data: newData, error: null };
  }

  // Fall back to legacy table
  const { data: legacyData, error: legacyError } = await supabase
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

  if (legacyError) return { data: null, error: legacyError };
  return { data: legacyData, error: null };
}

/**
 * Save journal entry
 */
export async function saveJournalEntry({
  moduleId,
  entryType = 'module_completion',
  title = '',
  body = '',
  payload = {},
}) {
  const supabase = getSovereignSupabase();
  if (!supabase) {
    return { data: null, error: new Error('Supabase client is not configured.') };
  }

  const { data: userResult, error: userError } = await supabase.auth.getUser();
  if (userError) return { data: null, error: userError };

  const userId = userResult?.user?.id;
  if (!userId) {
    return { data: null, error: new Error('Sign in is required before saving journal entry.') };
  }

  const { data, error } = await supabase
    .from('rec_uni_journal_entries')
    .insert({
      user_id: userId,
      module_id: moduleId,
      entry_type: entryType,
      title,
      body,
      payload,
    })
    .select('*')
    .maybeSingle();

  if (error) return { data: null, error };
  return { data, error: null };
}

/**
 * Emit analytics event
 */
export async function emitAnalyticsEvent({
  facultySlug = '',
  moduleSlug = '',
  eventName,
  eventPayload = {},
}) {
  const supabase = getSovereignSupabase();
  if (!supabase) {
    console.warn('Supabase client is not configured. Analytics event not recorded.');
    return;
  }

  const { data: userResult } = await supabase.auth.getUser();
  const userId = userResult?.user?.id;

  const { error } = await supabase
    .from('rec_uni_events')
    .insert({
      user_id: userId,
      faculty_slug: facultySlug,
      module_slug: moduleSlug,
      event_name: eventName,
      event_payload: eventPayload,
    });

  if (error) {
    console.warn('Failed to record analytics event:', error);
  }
}

/**
 * Load the signed-in user's progress for the code-owned modules in a faculty.
 */
export async function loadUserFacultyProgress(moduleIds = []) {
  const supabase = getSovereignSupabase();
  if (!supabase) {
    return { data: null, error: new Error('Supabase client is not configured.') };
  }

  const { data: userResult, error: userError } = await supabase.auth.getUser();
  if (userError) return { data: null, error: userError };

  const userId = userResult?.user?.id;
  if (!userId) {
    return { data: null, error: new Error('Sign in is required.') };
  }

  if (moduleIds.length === 0) return { data: [], error: null };

  const { data, error } = await supabase
    .from('rec_uni_user_progress')
    .select('*')
    .eq('user_id', userId)
    .in('module_id', moduleIds);

  if (error) return { data: null, error };
  return { data, error: null };
}
