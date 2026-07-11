import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowDown,
  ArrowLeft,
  ArrowUpRight,
  BookOpen,
  CircleUserRound,
  GraduationCap,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './ReclamationUniversityPage.css';

const faculties = [
  {
    id: 'foundations',
    numeral: 'I',
    title: 'Foundations of Reclamation',
    subtitle: 'Understand the war for consciousness and the nature of power.',
    discipline: 'Origins / Power / Discernment',
    route: '/experiencemode/sovereign/reclamation-university/foundations',
    asset: '/ui/reclamation/Module_Cards/reclamation_university/module_one_card.svg',
  },
  {
    id: 'identity',
    numeral: 'II',
    title: 'The Architecture of Identity',
    subtitle: 'Deconstruct the false self and reclaim your divine architecture.',
    discipline: 'Identity / Memory / Selfhood',
    route: '/experiencemode/sovereign/reclamation-university/identity',
    asset: '/ui/reclamation/Module_Cards/reclamation_university/module_two_card.svg',
  },
  {
    id: 'language',
    numeral: 'III',
    title: 'The Language Protocol',
    subtitle: 'Words are weapons. Master the code you create with your voice.',
    discipline: 'Language / Signal / Command',
    route: '/experiencemode/sovereign/reclamation-university/language',
    asset: '/ui/reclamation/Module_Cards/reclamation_university/module_three_card.svg',
  },
  {
    id: 'thought-forms',
    numeral: 'IV',
    title: 'Thought Forms & Reality',
    subtitle: 'Decode the mechanics of thought and how realities are built.',
    discipline: 'Thought / Pattern / Reality',
    route: '/experiencemode/sovereign/reclamation-university/thought-forms',
    asset: '/ui/reclamation/Module_Cards/reclamation_university/module_four_card.svg',
  },
  {
    id: 'sovereign-mind',
    numeral: 'V',
    title: 'The Sovereign Mind',
    subtitle: 'Train the mind beyond conditioned limits and programmed patterns.',
    discipline: 'Will / Focus / Sovereignty',
    route: '/experiencemode/sovereign/reclamation-university/sovereign-mind',
    asset: '/ui/reclamation/Module_Cards/reclamation_university/module_five_card.svg',
  },
  {
    id: 'aftermath',
    numeral: 'VI',
    title: 'Architect of the Aftermath',
    subtitle: 'Learn to build, protect, and leave a legacy beyond the system.',
    discipline: 'Legacy / Protection / Creation',
    route: '/experiencemode/sovereign/reclamation-university/aftermath',
    asset: '/ui/reclamation/Module_Cards/reclamation_university/module_six_card.svg',
  },
];

function FacultyCard({ faculty, index, onOpen }) {
  return (
    <article className="ru-faculty-card" style={{ '--faculty-index': index }}>
      <button type="button" className="ru-faculty-action" onClick={onOpen}>
        <span className="ru-card-figure">
          <img src={faculty.asset} alt="" className="ru-faculty-art" />
          <span className="ru-card-number" aria-hidden="true">{faculty.numeral}</span>
          <span className="ru-card-open" aria-hidden="true"><ArrowUpRight size={20} /></span>
        </span>

        <span className="ru-card-copy">
          <span className="ru-card-discipline">Faculty {faculty.numeral} · {faculty.discipline}</span>
          <strong>{faculty.title}</strong>
          <span className="ru-card-summary">{faculty.subtitle}</span>
          <span className="ru-card-cta">Enter faculty <ArrowUpRight size={14} /></span>
        </span>
      </button>
    </article>
  );
}

export default function ReclamationUniversityPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const userName = useMemo(
    () => user?.name || user?.email?.split('@')[0] || 'Sovereign Seeker',
    [user],
  );

  const scrollToFaculties = () => {
    document.getElementById('ru-faculties')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <main className="ru-page" aria-label="Reclamation University">
      <div className="ru-atmosphere" aria-hidden="true">
        <span className="ru-orbit ru-orbit-one" />
        <span className="ru-orbit ru-orbit-two" />
        <span className="ru-grain" />
      </div>

      <header className="ru-topbar">
        <button
          type="button"
          className="ru-back"
          onClick={() => navigate('/experiencemode/sovereign')}
          aria-label="Return to Sovereign Mode"
        >
          <ArrowLeft size={18} />
          <span>Return to Sovereign Mode</span>
        </button>

        <div className="ru-wordmark" aria-label="Chroma Key Protocol">
          <span className="ru-wordmark-sigil">CK</span>
          <span><strong>Reclamation</strong><small>University · Est. beyond time</small></span>
        </div>

        <div className="ru-identity">
          <span className="ru-access-dot" aria-hidden="true" />
          <span><small>Access recognized</small><strong>{userName}</strong></span>
          <CircleUserRound size={22} />
        </div>
      </header>

      <section className="ru-hero" aria-labelledby="reclamation-university-title">
        <aside className="ru-hero-index" aria-hidden="true">
          <span>RU · 001</span>
          <i />
          <span>Curriculum of Sovereignty</span>
        </aside>

        <div className="ru-hero-copy">
          <p className="ru-eyebrow"><Sparkles size={14} /> The educational arm of the Chroma Key Protocol</p>
          <h1 id="reclamation-university-title">
            <span>Reclamation</span>
            <em>University</em>
          </h1>
          <div className="ru-manifesto">
            <p>A living curriculum for those who refuse inherited limits.</p>
            <p>Study the codes. Embody the keys. Become ungovernable.</p>
          </div>
          <div className="ru-hero-actions">
            <button type="button" className="ru-enter" onClick={scrollToFaculties}>
              View the curriculum <ArrowDown size={17} />
            </button>
            <span className="ru-enrollment"><ShieldCheck size={16} /> Enrollment open · Access unlocked</span>
          </div>
        </div>

        <div className="ru-seal-stage" aria-hidden="true">
          <div className="ru-seal-halo" />
          <div className="ru-seal-type ru-seal-type-top">Knowledge · Application · Liberation</div>
          <div className="ru-seal">
            <span className="ru-seal-outer" />
            <span className="ru-seal-inner" />
            <span className="ru-seal-core"><BookOpen size={52} /><GraduationCap size={24} /></span>
          </div>
          <div className="ru-seal-type ru-seal-type-bottom">Chroma Key Protocol · MMXXVI</div>
        </div>

        <div className="ru-hero-note">
          <span>Field note 01</span>
          <p>“They built the system to hide the truth. We built the university to teach it.”</p>
        </div>
      </section>

      <section id="ru-faculties" className="ru-faculties" aria-labelledby="ru-faculties-title">
        <header className="ru-section-header">
          <div>
            <p className="ru-eyebrow">Six faculties · One sovereign curriculum</p>
            <h2 id="ru-faculties-title">Choose your field of study.</h2>
          </div>
          <p>
            Each faculty is a threshold. Move in sequence or enter where the signal is strongest.
          </p>
        </header>

        <div className="ru-faculty-grid">
          {faculties.map((faculty, index) => (
            <FacultyCard
              key={faculty.id}
              faculty={faculty}
              index={index}
              onOpen={() => navigate(faculty.route)}
            />
          ))}
        </div>
      </section>

      <section className="ru-closing" aria-label="University principles">
        <div className="ru-closing-mark"><GraduationCap size={34} /></div>
        <p>Knowledge is the key.</p>
        <strong>Application is power.</strong>
        <span>Reclamation University · Chroma Key Protocol</span>
      </section>
    </main>
  );
}
