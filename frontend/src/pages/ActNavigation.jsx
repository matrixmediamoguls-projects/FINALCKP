import { useNavigate } from 'react-router-dom';
import '../styles/act-navigation.css';

const acts = [
  {
    num: 1,
    roman: 'ONE',
    title: 'The Fractured Veil',
    subtitle: 'Awakening',
    statement: 'Reality is not as it seems.',
    tags: ['Disrupt', 'Discover', 'Decode'],
    color: '#54ff9f',
    rgb: '84, 255, 159',
    emblem: '/emblem/act_one_module_emblem.gif',
    route: '/protocol/1',
  },
  {
    num: 2,
    roman: 'TWO',
    title: 'The Reflection Chamber',
    subtitle: 'Confrontation',
    statement: 'See yourself. Break the pattern.',
    tags: ['Analyze', 'Reflect', 'Transcend'],
    color: '#5ab6ff',
    rgb: '90, 182, 255',
    emblem: '/emblem/act_two_module_emblem.gif',
    route: '/protocol/2',
  },
  {
    num: 3,
    roman: 'THREE',
    title: 'Reclamation',
    subtitle: 'Power Reclamation',
    statement: 'Reclaim who you are. Rewrite the system.',
    tags: ['Adapt', 'Ignite', 'Control'],
    color: '#ff4d4d',
    rgb: '255, 77, 77',
    emblem: '/emblem/act_three_module_emblem.gif',
    route: '/protocol/3',
  },
  {
    num: 4,
    roman: 'FOUR',
    title: 'The Crucible Code',
    subtitle: 'Transcendence',
    statement: 'Code your reality. Engineer the future.',
    tags: ['Create', 'Engineer', 'Evolve'],
    color: '#ffc857',
    rgb: '255, 200, 87',
    emblem: '/emblem/act_four_module_emblem.gif',
    route: '/protocol/4',
  },
];

function ActCard({ act }) {
  const navigate = useNavigate();

  return (
    <article
      className="act-nav-card"
      style={{ '--act-color': act.color, '--act-rgb': act.rgb }}
      onClick={() => navigate(act.route)}
      data-testid={`act-card-${act.num}`}
    >
      <div className="act-nav-card__circuit" />
      <div className="act-nav-card__number">0{act.num}</div>

      <header className="act-nav-card__header">
        <span>Act {act.roman}</span>
        <i />
      </header>

      <h2>{act.title}</h2>
      <p className="act-nav-card__subtitle">{act.subtitle}</p>

      <button
        className="act-nav-card__emblem"
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          navigate(act.route);
        }}
        aria-label={`Open ${act.title}`}
      >
        <span className="act-nav-card__emblem-ring" />
        <span className="act-nav-card__emblem-core">
          <img src={act.emblem} alt="" />
        </span>
      </button>

      <p className="act-nav-card__statement">{act.statement}</p>

      <button
        className="act-nav-card__launch"
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          navigate(act.route);
        }}
      >
        <span>Launch Protocol</span>
        <strong>→</strong>
      </button>

      <footer className="act-nav-card__tags">
        {act.tags.map((tag) => (
          <span key={tag}>{tag}</span>
        ))}
      </footer>
    </article>
  );
}

export default function ActNavigation() {
  return (
    <main className="act-nav-page">
      <div className="act-nav-bg" />
      <div className="act-nav-gridline" />

      <section className="act-nav-shell" aria-label="Chroma Key Protocol act navigation">
        <header className="act-nav-hero">
          <span>Protocol Mainframe Online</span>
          <h1>Chroma Key Protocol</h1>
          <p>Four Acts. One Reality.</p>
        </header>

        <div className="act-nav-roadmap" data-testid="roadmap">
          {acts.map((act) => (
            <ActCard key={act.num} act={act} />
          ))}
        </div>
      </section>
    </main>
  );
}
