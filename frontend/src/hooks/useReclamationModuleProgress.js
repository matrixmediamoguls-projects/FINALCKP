import { useEffect, useState, useCallback } from 'react';
import {
  loadUserProgress,
  saveUserProgress,
  saveReclamationUniversityResponse,
  saveJournalEntry,
  emitAnalyticsEvent,
} from '../lib/supabase/reclamationUniversity';

/**
 * useReclamationModuleProgress
 * 
 * Custom hook to manage module progress loading, saving, and analytics.
 * 
 * @param {string} moduleId - The module ID
 * @param {string} facultySlug - The faculty slug for analytics
 * @param {string} moduleSlug - The module slug for analytics
 * @returns {object} - Progress state and save functions
 */
export function useReclamationModuleProgress(moduleId, facultySlug, moduleSlug) {
  const [progress, setProgress] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  // Load progress on mount
  useEffect(() => {
    const loadProgress = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const { data, error: loadError } = await loadUserProgress(moduleId);
        if (loadError) {
          console.warn('Failed to load progress:', loadError);
          setProgress(null);
        } else {
          setProgress(data);
          // Emit module_viewed event
          await emitAnalyticsEvent({
            facultySlug,
            moduleSlug,
            eventName: 'module_viewed',
            eventPayload: { hasExistingProgress: !!data },
          });
        }
      } catch (err) {
        console.error('Error loading progress:', err);
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    if (moduleId) {
      loadProgress();
    }
  }, [moduleId, facultySlug, moduleSlug]);

  // Save progress incrementally
  const saveProgress = useCallback(
    async ({
      status = 'in_progress',
      activeScene = 0,
      listenedTrackIds = [],
      selectedShadowCodes = [],
      retrievedLightCodes = [],
      declarationJson = {},
      integrationKey = '',
      completedAt = null,
    }) => {
      setIsSaving(true);
      setError(null);
      try {
        const { data, error: saveError } = await saveUserProgress({
          moduleId,
          status,
          activeScene,
          listenedTrackIds,
          selectedShadowCodes,
          retrievedLightCodes,
          declarationJson,
          integrationKey,
          completedAt,
        });

        if (saveError) {
          console.error('Failed to save progress:', saveError);
          setError(saveError);
          return { data: null, error: saveError };
        }

        setProgress(data);

        // Emit scene_progression event
        await emitAnalyticsEvent({
          facultySlug,
          moduleSlug,
          eventName: 'scene_progression',
          eventPayload: { activeScene, status },
        });

        return { data, error: null };
      } catch (err) {
        console.error('Error saving progress:', err);
        setError(err);
        return { data: null, error: err };
      } finally {
        setIsSaving(false);
      }
    },
    [moduleId, facultySlug, moduleSlug]
  );

  // Save module completion
  const saveCompletion = useCallback(
    async ({
      selectedShadowCodes = [],
      retrievedLightCodes = [],
      declaration = {},
      integrationKey = '',
      journalEntry = null,
    }) => {
      setIsSaving(true);
      setError(null);
      try {
        // Save to response table
        const { data: responseData, error: responseError } =
          await saveReclamationUniversityResponse({
            moduleId,
            selectedShadowCodes,
            retrievedLightCodes,
            declaration,
            integrationKey,
          });

        if (responseError) {
          console.error('Failed to save completion:', responseError);
          setError(responseError);
          return { data: null, error: responseError };
        }

        // Save journal entry if provided
        if (journalEntry) {
          await saveJournalEntry({
            moduleId,
            entryType: journalEntry.entryType || 'module_completion',
            title: journalEntry.title || 'Module Completed',
            body: journalEntry.body || '',
            payload: {
              selectedShadowCodes,
              retrievedLightCodes,
              declaration,
              integrationKey,
            },
          });
        }

        // Update local progress
        setProgress((current) => ({
          ...current,
          status: 'completed',
          selected_shadow_codes: selectedShadowCodes,
          retrieved_light_codes: retrievedLightCodes,
          declaration_json: declaration,
          integration_key: integrationKey,
          completed_at: new Date().toISOString(),
        }));

        // Emit module_completed event
        await emitAnalyticsEvent({
          facultySlug,
          moduleSlug,
          eventName: 'module_completed',
          eventPayload: {
            shadowCodesCount: selectedShadowCodes.length,
            lightCodesCount: retrievedLightCodes.length,
            declarationFieldsCount: Object.keys(declaration).length,
          },
        });

        return { data: responseData, error: null };
      } catch (err) {
        console.error('Error saving completion:', err);
        setError(err);
        return { data: null, error: err };
      } finally {
        setIsSaving(false);
      }
    },
    [moduleId, facultySlug, moduleSlug]
  );

  // Emit custom analytics event
  const trackEvent = useCallback(
    async (eventName, eventPayload = {}) => {
      try {
        await emitAnalyticsEvent({
          facultySlug,
          moduleSlug,
          eventName,
          eventPayload,
        });
      } catch (err) {
        console.warn('Failed to track event:', err);
      }
    },
    [facultySlug, moduleSlug]
  );

  return {
    progress,
    isLoading,
    isSaving,
    error,
    saveProgress,
    saveCompletion,
    trackEvent,
  };
}
