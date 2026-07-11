import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { BarChart3, Users, BookOpen, TrendingUp } from 'lucide-react';
import { supabase } from '../lib/supabase/client';
import './TeacherDashboard.css';

/**
 * TeacherDashboard
 * 
 * Main dashboard for teachers/admins to:
 * - View student progress and analytics
 * - Manage curriculum
 * - Monitor completion rates
 * - Access admin tools
 */
export default function TeacherDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isTeacher, setIsTeacher] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalModulesCompleted: 0,
    averageCompletionRate: 0,
    totalXpDistributed: 0,
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      checkTeacherStatus();
      loadDashboardData();
    }
  }, [user]);

  const checkTeacherStatus = async () => {
    try {
      const { data, error: checkError } = await supabase
        .from('teacher_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError;
      }

      setIsTeacher(!!data);
    } catch (err) {
      console.error('Error checking teacher status:', err);
      setIsTeacher(false);
    }
  };

  const loadDashboardData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Load statistics
      const { data: progressData, error: progressError } = await supabase
        .from('rec_uni_user_progress')
        .select('*');

      if (progressError) throw progressError;

      const completedModules = progressData.filter((p) => p.status === 'completed');
      const uniqueStudents = new Set(progressData.map((p) => p.user_id)).size;
      const totalXp = completedModules.reduce((sum, m) => sum + (m.xp_reward || 0), 0);

      setStats({
        totalStudents: uniqueStudents,
        totalModulesCompleted: completedModules.length,
        averageCompletionRate: uniqueStudents > 0 ? (completedModules.length / progressData.length) * 100 : 0,
        totalXpDistributed: totalXp,
      });

      // Load recent activity
      const { data: activityData, error: activityError } = await supabase
        .from('rec_uni_events')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (activityError) throw activityError;

      setRecentActivity(activityData || []);
    } catch (err) {
      console.error('Error loading dashboard data:', err);
      setError(err.message || 'Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <main className="teacher-dashboard">
        <div className="dashboard-container">
          <div className="dashboard-error">
            <h2>Authentication Required</h2>
            <p>Please log in to access the teacher dashboard.</p>
          </div>
        </div>
      </main>
    );
  }

  if (!isTeacher) {
    return (
      <main className="teacher-dashboard">
        <div className="dashboard-container">
          <div className="dashboard-error">
            <h2>Access Denied</h2>
            <p>You do not have teacher permissions. Contact an administrator.</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="teacher-dashboard">
      <div className="dashboard-background" aria-hidden="true">
        <div className="dashboard-bg-grid" />
        <div className="dashboard-bg-vignette" />
      </div>

      <div className="dashboard-container">
        <header className="dashboard-header">
          <h1>Teacher Dashboard</h1>
          <p className="dashboard-subtitle">Manage curriculum and monitor student progress</p>
        </header>

        {error && (
          <div className="dashboard-error">
            <p>{error}</p>
            <button onClick={loadDashboardData} className="dashboard-retry">
              Retry
            </button>
          </div>
        )}

        {isLoading ? (
          <div className="dashboard-loading">
            <div className="loading-spinner" />
            <p>Loading dashboard...</p>
          </div>
        ) : (
          <>
            {/* Statistics Cards */}
            <section className="dashboard-stats">
              <div className="stat-card">
                <div className="stat-icon">
                  <Users size={24} />
                </div>
                <div className="stat-content">
                  <div className="stat-value">{stats.totalStudents}</div>
                  <div className="stat-label">Active Students</div>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">
                  <BookOpen size={24} />
                </div>
                <div className="stat-content">
                  <div className="stat-value">{stats.totalModulesCompleted}</div>
                  <div className="stat-label">Modules Completed</div>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">
                  <TrendingUp size={24} />
                </div>
                <div className="stat-content">
                  <div className="stat-value">{stats.averageCompletionRate.toFixed(1)}%</div>
                  <div className="stat-label">Completion Rate</div>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">
                  <BarChart3 size={24} />
                </div>
                <div className="stat-content">
                  <div className="stat-value">{stats.totalXpDistributed}</div>
                  <div className="stat-label">Total XP Awarded</div>
                </div>
              </div>
            </section>

            {/* Navigation */}
            <section className="dashboard-nav">
              <button
                className="dashboard-nav-card"
                onClick={() => navigate('/teacher/students')}
              >
                <div className="nav-icon">👥</div>
                <div className="nav-content">
                  <h3>Student Management</h3>
                  <p>View and manage student accounts and progress</p>
                </div>
              </button>

              <button
                className="dashboard-nav-card"
                onClick={() => navigate('/teacher/curriculum')}
              >
                <div className="nav-icon">📚</div>
                <div className="nav-content">
                  <h3>Curriculum Management</h3>
                  <p>Create and edit faculties, modules, and content</p>
                </div>
              </button>

              <button
                className="dashboard-nav-card"
                onClick={() => navigate('/teacher/analytics')}
              >
                <div className="nav-icon">📊</div>
                <div className="nav-content">
                  <h3>Analytics & Reports</h3>
                  <p>View detailed analytics and generate reports</p>
                </div>
              </button>

              <button
                className="dashboard-nav-card"
                onClick={() => navigate('/teacher/settings')}
              >
                <div className="nav-icon">⚙️</div>
                <div className="nav-content">
                  <h3>Settings & Permissions</h3>
                  <p>Manage system settings and user permissions</p>
                </div>
              </button>
            </section>

            {/* Recent Activity */}
            <section className="dashboard-activity">
              <h2>Recent Activity</h2>
              <div className="activity-list">
                {recentActivity.length === 0 ? (
                  <p className="activity-empty">No recent activity</p>
                ) : (
                  recentActivity.map((activity) => (
                    <div key={activity.id} className="activity-item">
                      <div className="activity-event">{activity.event_name}</div>
                      <div className="activity-module">{activity.module_slug}</div>
                      <div className="activity-time">
                        {new Date(activity.created_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>
          </>
        )}
      </div>
    </main>
  );
}
