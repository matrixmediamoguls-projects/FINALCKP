import { useEffect, useState, useCallback } from 'react';
import { loadUserFacultyProgress } from '../lib/supabase/reclamationUniversity';
import { getAllFaculties, isFacultyUnlocked } from '../data/reclamationUniversityCurriculum';

/**
 * useReclamationFacultyUnlock
 * 
 * Custom hook to manage faculty unlock status based on completed prerequisites.
 * 
 * @returns {object} - Faculty unlock state and helper functions
 */
export function useReclamationFacultyUnlock() {
  const [faculties, setFaculties] = useState([]);
  const [completedFacultySlugs, setCompletedFacultySlugs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load all faculties and user's progress
  useEffect(() => {
    const loadFacultyData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Get all faculties from curriculum
        const allFaculties = getAllFaculties();
        setFaculties(allFaculties);

        // Load user's progress for each faculty
        const completedSlugs = [];
        for (const faculty of allFaculties) {
          const { data: progress, error: progressError } = await loadUserFacultyProgress(faculty.id);

          if (!progressError && progress) {
            // Check if all modules in this faculty are completed
            const allModulesCompleted = faculty.modules.every((module) =>
              progress.some((p) => p.module_id === module.id && p.status === 'completed')
            );

            if (allModulesCompleted && faculty.modules.length > 0) {
              completedSlugs.push(faculty.slug);
            }
          }
        }

        setCompletedFacultySlugs(completedSlugs);
      } catch (err) {
        console.error('Error loading faculty data:', err);
        setError(err);
        // Still load faculties even if progress loading fails
        const allFaculties = getAllFaculties();
        setFaculties(allFaculties);
      } finally {
        setIsLoading(false);
      }
    };

    loadFacultyData();
  }, []);

  // Check if a specific faculty is unlocked
  const isFacultyAccessible = useCallback(
    (facultySlug) => {
      return isFacultyUnlocked(facultySlug, completedFacultySlugs);
    },
    [completedFacultySlugs]
  );

  // Get unlock requirements for a faculty
  const getFacultyRequirements = useCallback(
    (facultySlug) => {
      const faculty = faculties.find((f) => f.slug === facultySlug);
      if (!faculty) return null;

      // Check prerequisites based on faculty order
      const facultyIndex = faculties.findIndex((f) => f.slug === facultySlug);
      if (facultyIndex === 0) {
        // First faculty has no prerequisites
        return { isUnlocked: true, requirements: [] };
      }

      // All previous faculties must be completed
      const requirements = faculties.slice(0, facultyIndex).map((f) => ({
        slug: f.slug,
        title: f.title,
        completed: completedFacultySlugs.includes(f.slug),
      }));

      const isUnlocked = requirements.every((r) => r.completed);

      return { isUnlocked, requirements };
    },
    [faculties, completedFacultySlugs]
  );

  // Get all faculties with their unlock status
  const getFacultiesWithStatus = useCallback(() => {
    return faculties.map((faculty) => {
      const { isUnlocked } = getFacultyRequirements(faculty.slug);
      return {
        ...faculty,
        isUnlocked,
      };
    });
  }, [faculties, getFacultyRequirements]);

  return {
    faculties,
    completedFacultySlugs,
    isLoading,
    error,
    isFacultyAccessible,
    getFacultyRequirements,
    getFacultiesWithStatus,
  };
}
