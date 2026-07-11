import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronRight, Lock, CheckCircle } from 'lucide-react';
import { getFacultyBySlug, isFacultyUnlocked } from '../data/reclamationUniversityCurriculum';
import './ReclamationFacultyPage.css';

export default function ReclamationFacultyPage() {
  const navigate = useNavigate();
  const { facultySlug } = useParams();
  const faculty = useMemo(() => getFacultyBySlug(facultySlug), [facultySlug]);

  // TODO: Load user's completed faculties from Supabase
  const completedFacultySlugs = [];
  const isUnlocked = useMemo(
    () => isFacultyUnlocked(facultySlug, completedFacultySlugs),
    [facultySlug, completedFacultySlugs]
  );

  if (!faculty) {
    return (
      <main className="ru-page" aria-label="Faculty not found">
        <div className="ru-background" aria-hidden="true">
          <div className="ru-bg-citadel" />
          <div className="ru-bg-grid" />
          <div className="ru-bg-scanlines" />
          <div className="ru-bg-vignette" />
        </div>

        <div style={{ padding: '4rem 2rem', textAlign: 'center' }}>
          <h1>Faculty Not Found</h1>
          <p style={{ marginTop: '1rem', marginBottom: '2rem' }}>
            This faculty could not be loaded. Please return to the university.
          </p>
          <button
            type="button"
            onClick={() => navigate('/experiencemode/sovereign/reclamation-university')}
            className="ru-primary-cta"
          >
            Return to University
            <ChevronRight size={20} />
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="ru-page" aria-label={`${faculty.title} faculty`}>
      <div className="ru-background" aria-hidden="true">
        <div className="ru-bg-citadel" />
        <div className="ru-bg-grid" />
        <div className="ru-bg-scanlines" />
        <div className="ru-bg-vignette" />
      </div>

      <header className="ru-topbar">
        <button
          type="button"
          className="ru-brand"
          onClick={() => navigate('/experiencemode/sovereign/reclamation-university')}
        >
          <span className="ru-brand-mark">✶</span>
          <span>
            <strong>Chroma Key</strong>
            <small>Protocol</small>
          </span>
        </button>

        <div className="ru-access-status">
          <span />
          {isUnlocked ? 'Faculty Unlocked' : 'Prerequisites Required'}
          <ChevronRight size={14} />
        </div>

        <nav className="ru-nav" aria-label="Reclamation University navigation">
          <button type="button" className="is-active">
            Reclamation University
          </button>
        </nav>

        <div className="ru-user-cluster">
          <span className="ru-user-sigil">✦</span>
          <div>
            <strong>{faculty.title}</strong>
            <small>Faculty Overview</small>
          </div>
          <ChevronRight size={16} />
        </div>
      </header>

      <section className="ru-faculty-overview" aria-labelledby="faculty-title">
        <div className="ru-faculty-header">
          <div className="ru-faculty-copy">
            <h1 id="faculty-title">{faculty.title}</h1>
            <p className="ru-faculty-subtitle">{faculty.subtitle}</p>
            <p className="ru-faculty-description">{faculty.description}</p>

            {!isUnlocked && (
              <div className="ru-lock-message">
                <Lock size={20} />
                <p>Complete prerequisite faculties to unlock this faculty.</p>
              </div>
            )}
          </div>
        </div>

        <section className="ru-modules-section" aria-labelledby="modules-title">
          <h2 id="modules-title">Modules</h2>
          <div className="ru-modules-list">
            {faculty.modules.map((module, index) => (
              <div
                key={module.id}
                className="ru-module-card"
                data-locked={!isUnlocked}
              >
                <div className="ru-module-header">
                  <div>
                    <p className="ru-module-number">Module {index + 1}</p>
                    <h3>{module.title}</h3>
                    <p className="ru-module-subtitle">{module.subtitle}</p>
                  </div>
                  {isUnlocked ? (
                    <CheckCircle size={24} className="ru-module-status-icon" />
                  ) : (
                    <Lock size={24} className="ru-module-status-icon" />
                  )}
                </div>

                <p className="ru-module-description">{module.subtitle}</p>

                <div className="ru-module-meta">
                  <span className="ru-module-xp">
                    <strong>{module.xpReward}</strong> XP
                  </span>
                  <span className="ru-module-time">
                    <strong>{module.estimatedMinutes}</strong> min
                  </span>
                </div>

                <button
                  type="button"
                  className="ru-module-action"
                  onClick={() => {
                    if (isUnlocked) {
                      navigate(
                        `/experiencemode/sovereign/reclamation-university/${faculty.slug}/${module.slug}`
                      );
                    }
                  }}
                  disabled={!isUnlocked}
                  aria-label={`${isUnlocked ? 'Start' : 'Locked'}: ${module.title}`}
                >
                  {isUnlocked ? (
                    <>
                      Start Module
                      <ChevronRight size={16} />
                    </>
                  ) : (
                    <>
                      Locked
                      <Lock size={16} />
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>
        </section>
      </section>

      <footer className="ru-footer">
        <div className="ru-footer-brand">
          <span>
            <strong>{faculty.title}</strong>
            <small>Faculty of Reclamation University</small>
          </span>
        </div>

        <blockquote>
          "The cleanest win is not that they understand you. The cleanest win is that you can finally teach what you survived."
        </blockquote>
      </footer>
    </main>
  );
}
