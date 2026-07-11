import { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReclamationModuleEngine from '../modules/sovereign/reclamation-university/ReclamationModuleEngine';
import { getFacultyBySlug, getModuleBySlug } from '../data/reclamationUniversityCurriculum';

/**
 * ReclamationModulePage
 * 
 * Route: /experiencemode/sovereign/reclamation-university/:facultySlug/:moduleSlug
 * 
 * This page loads the faculty and module from the curriculum registry
 * and renders the generic ReclamationModuleEngine.
 */
export default function ReclamationModulePage() {
  const navigate = useNavigate();
  const { facultySlug, moduleSlug } = useParams();

  const faculty = useMemo(() => getFacultyBySlug(facultySlug), [facultySlug]);
  const module = useMemo(() => getModuleBySlug(facultySlug, moduleSlug), [facultySlug, moduleSlug]);

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

  return <ReclamationModuleEngine module={module} faculty={faculty} />;
}
