import { Navigate, useParams } from 'react-router-dom';
import { getFacultyBySlug } from '../data/reclamationUniversityCurriculum';
import { HERMETIC_HALL_FACULTY } from '../data/hermeticHallCurriculum';

const universityPath = '/experiencemode/sovereign/reclamation-university';

export default function ReclamationFacultyRedirect() {
  const { facultySlug } = useParams();
  const faculty = facultySlug === HERMETIC_HALL_FACULTY.slug
    ? HERMETIC_HALL_FACULTY
    : getFacultyBySlug(facultySlug);
  const module = faculty?.modules?.[0];

  if (!faculty || !module) {
    return <Navigate to={universityPath} replace />;
  }

  return (
    <Navigate
      to={`${universityPath}/${faculty.slug}/${module.slug}`}
      replace
    />
  );
}
