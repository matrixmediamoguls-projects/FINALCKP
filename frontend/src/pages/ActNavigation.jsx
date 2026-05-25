import { useNavigate } from 'react-router-dom';
import { ArrowUpRight, Broadcast, Circuitry, LockKey, Play } from '@phosphor-icons/react';
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
    emblem: '/emblem/act_one_module_emblem.png',
    route: '/protocol/1',
    status: 'Ready',
    signal: '01',
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
    emblem: '/emblem/act_two_module_emblem.png',
    route: '/protocol/2',
    status: 'Calibrating',
    signal: '02',
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
    emblem: '/emblem/act_three_module_emblem.png',
    route: '/protocol/3',
    status: 'Active',
    signal: '03',
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
    emblem: '/emblem/act_four_module_emblem.png',
    route: '/protocol/4',
    status: 'Sealed',
    signal: '04',
  },
];

function ActCard({ act }) {
  const navigate = useNavigate();

  const openAct = () => navigate(act.route);

  return (
    <article
      className="act-nav-card"
      style={{ '--act-color': act.color, '--act-rgb': act.rgb }}
      onClick={openAct}
      data-testid={`act-card-${act.num}`}
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          openAct();
        }
      }}
    >
      <div className="act-nav-card__circuit" />
      <div className="act-nav-card__scan" />

      <header className="act-nav-card__header">
        <span>Act {act.roman}</span>
        <strong>{act.status}</strong>
      </header>

      <button
        className="act-nav-card__emblem"
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          openAct();
        }}
        aria-label={`Open ${act.title}`}
      >
        <span className="act-nav-card__emblem-ring" />
        <span className="act-nav-card__emblem-core">
          <img src={act.emblem} alt="" />
        </span>
        <span className="act-nav-card__signal">{act.signal}</span>
      </button>

      <div className="act-nav-card__copy">
        <p className="act-nav-card__subtitle">{act.subtitle}</p>
        <h2>{act.title}</h2>
      </div>

      <p className="act-nav-card__statement">{act.statement}</p>

      <button
        className="act-nav-card__launch"
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          openAct();
        }}
      >
        <Play size={15} weight="fill" aria-hidden="true" />
        <span>Launch Protocol</span>
        <ArrowUpRight size={17} weight="bold" aria-hidden="true" />
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
  const navigate = useNavigate();

  return (
    <main className="act-nav-page">
      <div className="act-nav-bg" />
      <div className="act-nav-gridline" />
      <div className="act-nav-noise" />

      <section className="act-nav-shell" aria-label="Chroma Key Protocol act navigation">
        <header className="act-nav-hero" style={{ '--hero-image': 'url(/media/act-gateway-scene.jpg)' }}>
          <div className="act-nav-hero__media" aria-hidden="true">
            <div className="act-nav-hero__frame">
              <span />
              <span />
              <span />
              <span />
            </div>
          </div>

          <div className="act-nav-hero__content">
            <span className="act-nav-kicker">
              <Broadcast size={17} weight="fill" aria-hidden="true" />
              Protocol Mainframe Online
            </span>
            <h1>Chroma Key Protocol</h1>
            <p>Four Acts. One Reality.</p>
          </div>

          <aside className="act-nav-telemetry" aria-label="Protocol telemetry">
            <div>
              <span>Sequence</span>
              <strong>04 Acts</strong>
            </div>
            <div>
              <span>Mode</span>
              <strong>Immersive</strong>
            </div>
            <div>
              <span>Access</span>
              <strong>Synced</strong>
            </div>
          </aside>
        </header>

        <nav className="act-nav-strip" aria-label="Act status overview">
          {acts.map((act) => (
            <button
              key={act.num}
              type="button"
              style={{ '--act-color': act.color, '--act-rgb': act.rgb }}
              onClick={() => navigate(act.route)}
            >
              <Circuitry size={18} aria-hidden="true" />
              <span>{act.roman}</span>
              {act.status === 'Sealed' ? <LockKey size={15} aria-hidden="true" /> : <i />}
            </button>
          ))}
        </nav>

        <div className="act-nav-roadmap" data-testid="roadmap">
          {acts.map((act) => (
            <ActCard key={act.num} act={act} />
          ))}
        </div>
      </section>
    </main>
  );
}
