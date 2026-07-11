import { useState, useEffect } from 'react';
import { Search, ChevronRight, Mail, Trash2 } from 'lucide-react';
import { supabase } from '../lib/supabase/client';
import './StudentManagement.css';

/**
 * StudentManagement
 * 
 * Allows teachers to:
 * - View all students
 * - Search and filter students
 * - View student progress
 * - Reset student progress
 * - Send messages to students
 */
export default function StudentManagement() {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);

  useEffect(() => {
    loadStudents();
  }, []);

  useEffect(() => {
    filterStudents();
  }, [searchTerm, students]);

  const loadStudents = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Get all users who have progress records
      const { data: progressData, error: progressError } = await supabase
        .from('rec_uni_user_progress')
        .select('user_id')
        .distinct();

      if (progressError) throw progressError;

      const userIds = [...new Set(progressData.map((p) => p.user_id))];

      // Get user profiles
      const { data: profiles, error: profileError } = await supabase
        .from('profiles')
        .select('id, email, full_name')
        .in('id', userIds);

      if (profileError) throw profileError;

      // Get progress stats for each student
      const studentData = await Promise.all(
        profiles.map(async (profile) => {
          const { data: progress } = await supabase
            .from('rec_uni_user_progress')
            .select('*')
            .eq('user_id', profile.id);

          const completed = progress.filter((p) => p.status === 'completed').length;
          const inProgress = progress.filter((p) => p.status === 'in_progress').length;
          const totalXp = progress.reduce((sum, p) => sum + (p.xp_reward || 0), 0);

          return {
            id: profile.id,
            email: profile.email,
            name: profile.full_name || 'Unknown',
            modulesCompleted: completed,
            modulesInProgress: inProgress,
            totalXp,
            lastActivity: progress.length > 0 ? progress[0].updated_at : null,
          };
        })
      );

      setStudents(studentData);
    } catch (err) {
      console.error('Error loading students:', err);
      setError(err.message || 'Failed to load students');
    } finally {
      setIsLoading(false);
    }
  };

  const filterStudents = () => {
    if (!searchTerm) {
      setFilteredStudents(students);
      return;
    }

    const term = searchTerm.toLowerCase();
    const filtered = students.filter(
      (student) =>
        student.name.toLowerCase().includes(term) || student.email.toLowerCase().includes(term)
    );

    setFilteredStudents(filtered);
  };

  const handleResetProgress = async (studentId) => {
    if (!confirm('Are you sure you want to reset this student\'s progress?')) {
      return;
    }

    try {
      const { error: deleteError } = await supabase
        .from('rec_uni_user_progress')
        .delete()
        .eq('user_id', studentId);

      if (deleteError) throw deleteError;

      loadStudents();
    } catch (err) {
      console.error('Error resetting progress:', err);
      alert('Failed to reset progress');
    }
  };

  return (
    <main className="student-management">
      <div className="management-background" aria-hidden="true">
        <div className="management-bg-grid" />
        <div className="management-bg-vignette" />
      </div>

      <div className="management-container">
        <header className="management-header">
          <h1>Student Management</h1>
          <p className="management-subtitle">Monitor and manage student accounts and progress</p>
        </header>

        {error && (
          <div className="management-error">
            <p>{error}</p>
            <button onClick={loadStudents} className="management-retry">
              Retry
            </button>
          </div>
        )}

        <div className="management-search">
          <Search size={20} className="search-icon" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        {isLoading ? (
          <div className="management-loading">
            <div className="loading-spinner" />
            <p>Loading students...</p>
          </div>
        ) : filteredStudents.length === 0 ? (
          <div className="management-empty">
            <p>No students found</p>
          </div>
        ) : (
          <div className="students-table">
            <div className="table-header">
              <div className="col-name">Name</div>
              <div className="col-email">Email</div>
              <div className="col-progress">Progress</div>
              <div className="col-xp">XP</div>
              <div className="col-actions">Actions</div>
            </div>

            {filteredStudents.map((student) => (
              <div key={student.id} className="table-row">
                <div className="col-name">
                  <button
                    className="student-link"
                    onClick={() => setSelectedStudent(student)}
                  >
                    {student.name}
                    <ChevronRight size={16} />
                  </button>
                </div>
                <div className="col-email">{student.email}</div>
                <div className="col-progress">
                  <div className="progress-badge">
                    <span className="progress-completed">{student.modulesCompleted}</span>
                    <span className="progress-sep">/</span>
                    <span className="progress-total">{student.modulesInProgress + student.modulesCompleted}</span>
                  </div>
                </div>
                <div className="col-xp">
                  <span className="xp-value">{student.totalXp} XP</span>
                </div>
                <div className="col-actions">
                  <button className="action-btn" title="Send message">
                    <Mail size={16} />
                  </button>
                  <button
                    className="action-btn danger"
                    onClick={() => handleResetProgress(student.id)}
                    title="Reset progress"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Student Detail Modal */}
        {selectedStudent && (
          <div className="modal-overlay" onClick={() => setSelectedStudent(null)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <button className="modal-close" onClick={() => setSelectedStudent(null)}>
                ✕
              </button>
              <h2>{selectedStudent.name}</h2>
              <div className="modal-details">
                <div className="detail-row">
                  <span className="detail-label">Email:</span>
                  <span className="detail-value">{selectedStudent.email}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Modules Completed:</span>
                  <span className="detail-value">{selectedStudent.modulesCompleted}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Modules In Progress:</span>
                  <span className="detail-value">{selectedStudent.modulesInProgress}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Total XP:</span>
                  <span className="detail-value">{selectedStudent.totalXp}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
