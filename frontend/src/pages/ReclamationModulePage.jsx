import { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import HermeticCurriculumModule from '../modules/sovereign/reclamation-university/HermeticCurriculumModule';
import { getFacultyBySlug } from '../data/reclamationUniversityCurriculum';
import { HERMETIC_HALL_FACULTY, getHermeticHallModule } from '../data/hermeticHallCurriculum';

/**
 * ReclamationModulePage
 *
 * Route: /experiencemode/sovereign/reclamation-university/:facultySlug/:moduleSlug
 *
 * Hermetic Hall principles use one dedicated curriculum experience with the
 * canonical 11-section sequence. The retired generic module engine and the
 * principle-specific legacy renderers are no longer routed here.
 */
export default function ReclamationModulePage() {
  const navigate = useNavigate();
  const { facultySlug, moduleSlug } = useParams();

  const isHermeticHall = facultySlug === HERMETIC_HALL_FACULTY.slug;
  const faculty = useMemo(
    () => (isHermeticHall ? HERMETIC_HALL_FACULTY : getFacultyBySlug(facultySlug)),
    [facultySlug, isHermeticHall]
  );
  const module = useMemo(
    () => (isHermeticHall ? getHermeticHallModule(moduleSlug) : null),
    [isHermeticHall, moduleSlug]
  );

  if (!faculty || !module) {
    return (
      <div style={{ padding: '4rem 2rem', textAlign: 'center' }}>
        <h1>Module Not Found</h1>
        <p style={{ marginTop: '1rem', marginBottom: '2rem' }}>
          This module could not be loaded. Please return to the university.
        </p>
        <button
          type="button"
          onClick={() => navigate('/experiencemode/sovereign/reclamation-university')}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: '#dc2626',
            color: 'white',
            border: 'none',
            borderRadius: '0.5rem',
            cursor: 'pointer',
            fontSize: '1rem',
          }}
        >
          Return to University
        </button>
      </div>
    );
  }

  return <HermeticCurriculumModule module={module} faculty={faculty} />;
}
