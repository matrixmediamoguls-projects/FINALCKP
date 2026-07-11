import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase/client';
import BloomCertificateCard from '../components/certificates/BloomCertificateCard';
import './CertificatesPage.css';

/**
 * CertificatesPage
 * 
 * Displays all of a student's Bloom Certificates
 * Allows viewing, downloading, and sharing certificates
 */
export default function CertificatesPage() {
  const { user } = useAuth();
  const [certificates, setCertificates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterFaculty, setFilterFaculty] = useState('all');

  useEffect(() => {
    if (user) {
      loadCertificates();
    }
  }, [user]);

  const loadCertificates = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error: loadError } = await supabase
        .from('rec_uni_certificates')
        .select('*')
        .eq('user_id', user.id)
        .order('completion_date', { ascending: false });

      if (loadError) {
        throw loadError;
      }

      setCertificates(data || []);
    } catch (err) {
      console.error('Error loading certificates:', err);
      setError(err.message || 'Failed to load certificates');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredCertificates =
    filterFaculty === 'all'
      ? certificates
      : certificates.filter((cert) => cert.faculty_title === filterFaculty);

  const faculties = [...new Set(certificates.map((cert) => cert.faculty_title))];

  if (!user) {
    return (
      <main className="certificates-page">
        <div className="certificates-container">
          <div className="certificates-error">
            <h2>Authentication Required</h2>
            <p>Please log in to view your certificates.</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="certificates-page">
      <div className="certificates-background" aria-hidden="true">
        <div className="certificates-bg-grid" />
        <div className="certificates-bg-vignette" />
      </div>

      <div className="certificates-container">
        <header className="certificates-header">
          <h1>Bloom Certificates</h1>
          <p className="certificates-subtitle">
            Your record of reclamation and growth through Reclamation University
          </p>
        </header>

        {error && (
          <div className="certificates-error">
            <p>{error}</p>
            <button onClick={loadCertificates} className="certificates-retry">
              Retry
            </button>
          </div>
        )}

        {isLoading ? (
          <div className="certificates-loading">
            <div className="loading-spinner" />
            <p>Loading your certificates...</p>
          </div>
        ) : certificates.length === 0 ? (
          <div className="certificates-empty">
            <div className="empty-icon">✦</div>
            <h2>No Certificates Yet</h2>
            <p>Complete modules in Reclamation University to earn Bloom Certificates.</p>
            <a href="/experiencemode/sovereign/reclamation-university" className="certificates-cta">
              Start Your Journey
            </a>
          </div>
        ) : (
          <>
            {faculties.length > 1 && (
              <div className="certificates-filter">
                <label htmlFor="faculty-filter">Filter by Faculty:</label>
                <select
                  id="faculty-filter"
                  value={filterFaculty}
                  onChange={(e) => setFilterFaculty(e.target.value)}
                  className="certificates-select"
                >
                  <option value="all">All Faculties</option>
                  {faculties.map((faculty) => (
                    <option key={faculty} value={faculty}>
                      {faculty}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="certificates-grid">
              {filteredCertificates.map((cert) => (
                <BloomCertificateCard
                  key={cert.id}
                  studentName={cert.student_name}
                  facultyTitle={cert.faculty_title}
                  moduleTitle={cert.module_title}
                  integrationKey={cert.integration_key}
                  xpReward={cert.xp_reward}
                  completionDate={cert.completion_date}
                />
              ))}
            </div>

            <div className="certificates-stats">
              <div className="stat-card">
                <div className="stat-value">{certificates.length}</div>
                <div className="stat-label">Certificates Earned</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">
                  {certificates.reduce((sum, cert) => sum + cert.xp_reward, 0)}
                </div>
                <div className="stat-label">Total Experience Points</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">{faculties.length}</div>
                <div className="stat-label">Faculties Explored</div>
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
