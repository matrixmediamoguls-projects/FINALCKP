import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, ChevronDown, ChevronRight, Cpu, GraduationCap, Hexagon, Settings } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './ReclamationUniversityPage.css';

const facultyCards = [
  {
    id: 'foundations',
    title: 'Foundations of Reclamation',
    subtitle: 'Understand the war for consciousness and the nature of power.',
    accent: 'green',
    route: '/experiencemode/sovereign/reclamation-university/foundations',
    asset: '/ui/reclamation/Module_Cards/reclamation_university/module_one_card.svg',
  },
  {
    id: 'identity',
    title: 'The Architecture of Identity',
    subtitle: 'Deconstruct the false self and reclaim your divine architecture.',
    accent: 'blue',
    route: '/experiencemode/sovereign/reclamation-university/identity',
    asset: '/ui/reclamation/Module_Cards/reclamation_university/module_two_card.svg',
  },
  {
    id: 'language',
    title: 'The Language Protocol',
    subtitle: 'Words are weapons. Master the code you create with your voice.',
    accent: 'red',
    route: '/experiencemode/sovereign/reclamation-university/language',
    asset: '/ui/reclamation/Module_Cards/reclamation_university/module_three_card.svg',
  },
  {
    id: 'thought-forms',
    title: 'Thought Forms & Reality',
    subtitle: 'Decode the mechanics of thought and how realities are built.',
    accent: 'amber',
    route: '/experiencemode/sovereign/reclamation-university/thought-forms',
    asset: '/ui/reclamation/Module_Cards/reclamation_university/module_four_card.svg',
  },
  {
    id: 'sovereign-mind',
    title: 'The Sovereign Mind',
    subtitle: 'Train the mind beyond conditioned limits and programmed patterns.',
    accent: 'gold',
    route: '/experiencemode/sovereign/reclamation-university/sovereign-mind',
    asset: '/ui/reclamation/Module_Cards/reclamation_university/module_five_card.svg',
  },
  {
    id: 'aftermath',
    title: 'Architect of the Aftermath',
    subtitle: 'Learn to build, protect, and leave a legacy beyond the system.',
    accent: 'purple',
    route: '/experiencemode/sovereign/reclamation-university/aftermath',
    asset: '/ui/reclamation/Module_Cards/reclamation_university/module_six_card.svg',
  },
];

const stats = [
  { label: 'Protocol Status', value: 'Online', tone: 'green' },
  { label: 'Sovereign Level', value: 'Max', tone: 'red' },
  { label: 'Curriculum Progress', value: '73%', tone: 'red' },
  { label: 'Reclamation XP', value: '48,760', tone: 'red' },
];

function FacultyCard({ faculty }) {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      className="ru-faculty-card"
      data-accent={faculty.accent}
      onClick={() => navigate(faculty.route)}
      aria-label={`Explore ${faculty.title}`}
    >
      <img
        src={faculty.asset}
        alt={`${faculty.title} faculty module card`}
        className="ru-faculty-art"
        onError={(event) => {
          event.currentTarget.style.display = 'none';
        }}
      />
      <span className="ru-faculty-fallback" aria-hidden="true">
        <i className="ru-faculty-glyph"><Hexagon size={48} /></i>
        <strong>{faculty.title}</strong>
        <small>{faculty.subtitle}</small>
        <b>Explore <ChevronRight size={16} /></b>
      </span>
    </button>
  );
}

export default function ReclamationUniversityPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const userName = useMemo(() => user?.name || user?.email?.split('@')[0] || 'Musiq Matrix', [user]);

  return (
    <main className="ru-page" aria-label="Reclamation University dashboard">
      <div className="ru-background" aria-hidden="true">
        <div className="ru-bg-citadel" />
        <div className="ru-bg-grid" />
        <div className="ru-bg-scanlines" />
        <div className="ru-bg-vignette" />
      </div>

      <header className="ru-topbar">
        <button type="button" className="ru-brand" onClick={() => navigate('/experiencemode/sovereign')}>
          <span className="ru-brand-mark">✶</span>
          <span>
            <strong>Chroma Key</strong>
            <small>Protocol</small>
          </span>
        </button>

        <div className="ru-access-status">
          <span />
          Access and Protocol Unlocked
          <ChevronRight size={14} />
        </div>

        <nav className="ru-nav" aria-label="Reclamation University navigation">
          <button type="button" className="is-active">Reclamation University</button>
          <button type="button">Elemental Protocols</button>
          <button type="button">Analytics</button>
          <button type="button">Archive</button>
          <button type="button">Intel</button>
        </nav>

        <div className="ru-user-cluster">
          <button type="button" className="ru-icon-button" aria-label="System settings"><Settings size={20} /></button>
          <span className="ru-user-sigil">✦</span>
          <div>
            <strong>{userName}</strong>
            <small>Sovereign Seer</small>
          </div>
          <ChevronDown size={16} />
        </div>
      </header>

      <section className="ru-hero" aria-labelledby="reclamation-university-title">
        <div className="ru-hero-copy">
          <div className="ru-kicker"><span />Welcome To<span /></div>
          <h1 id="reclamation-university-title">
            <span>Reclamation</span>
            <strong>University</strong>
          </h1>
          <p className="ru-subtitle">The Curriculum of Sovereignty.<br />The Knowledge to Break the Code.</p>
          <p className="ru-description">
            Reclamation University is the educational arm of the Chroma Key Protocol.
            A living curriculum of truth, transformation, and timeline mastery.
            Study the codes. Embody the keys. Become ungovernable.
          </p>
          <div className="ru-hero-actions">
            <button type="button" className="ru-primary-cta" onClick={() => document.getElementById('ru-faculties')?.scrollIntoView({ behavior: 'smooth', block: 'center' })}>
              Enter The University
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        <div className="ru-seal-stage" aria-hidden="true">
          <div className="ru-vertical-rune" />
          <div className="ru-seal">
            <span className="ru-seal-ring ru-seal-ring-one" />
            <span className="ru-seal-ring ru-seal-ring-two" />
            <span className="ru-seal-ring ru-seal-ring-three" />
            <span className="ru-seal-core">
              <BookOpen size={54} />
              <GraduationCap size={28} />
            </span>
          </div>
        </div>
      </section>

      <section id="ru-faculties" className="ru-faculties" aria-labelledby="ru-faculties-title">
        <div className="ru-section-label">
          <span />
          <h2 id="ru-faculties-title">University Faculties</h2>
          <span />
        </div>
        <div className="ru-faculty-grid">
          {facultyCards.map((faculty) => (
            <FacultyCard key={faculty.id} faculty={faculty} />
          ))}
        </div>
      </section>

      <footer className="ru-footer">
        <div className="ru-footer-brand">
          <Cpu size={34} />
          <span>
            <strong>Reclamation University</strong>
            <small>Knowledge is the key. Application is power.</small>
          </span>
        </div>

        <div className="ru-stat-grid">
          {stats.map((stat) => (
            <div key={stat.label} className="ru-stat" data-tone={stat.tone}>
              <small>{stat.label}</small>
              <strong>{stat.value}</strong>
            </div>
          ))}
        </div>

        <blockquote>
          “They built the system to hide the truth.<br />We built the university to teach it.”
        </blockquote>
      </footer>
    </main>
  );
}
