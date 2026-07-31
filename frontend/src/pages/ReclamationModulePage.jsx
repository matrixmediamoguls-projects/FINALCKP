import { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReclamationModuleEngine from '../modules/sovereign/reclamation-university/ReclamationModuleEngine';
import HermeticCurriculumModule from '../modules/sovereign/reclamation-university/HermeticCurriculumModule';
import HermeticMaterialExperience from '../modules/sovereign/reclamation-university/HermeticMaterialExperience';
import { getFacultyBySlug, getModuleBySlug } from '../data/reclamationUniversityCurriculum';
import { HERMETIC_HALL_FACULTY, getHermeticHallModule } from '../data/hermeticHallCurriculum';

/**
 * ReclamationModulePage
 *
 * Route: /experiencemode/sovereign/reclamation-university/:facultySlug/:moduleSlug
 *
 * This page loads the faculty and module from the curriculum registry.
 * Mentalism uses the redesigned Hermetic material experience. The remaining
 * principles continue to use the existing curriculum renderer until their
 * authored material screens are connected.
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
    () => (isHermeticHall ? getHermeticHallModule(moduleSlug) : getModuleBySlug(facultySlug, moduleSlug)),
    [facultySlug, isHermeticHall, moduleSlug]
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

  if (isHermeticHall && module.slug === 'mentalism') {
    return (
      <HermeticMaterialExperience
        activePrinciple={module.order - 1}
        initialTab="intro"
        progress={0}
        onComplete={() =>
          navigate(
            '/experiencemode/sovereign/reclamation-university/hermetic-hall/correspondence'
          )
        }
      />
    );
  }

  if (isHermeticHall) {
    return <HermeticCurriculumModule module={module} faculty={faculty} />;
  }

  return <ReclamationModuleEngine module={module} faculty={faculty} />;
}
