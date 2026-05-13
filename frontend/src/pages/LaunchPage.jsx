import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const launchActs = [
  {
    number: 'I',
    title: 'THE SEED',
    symbol: '○',
    status: 'COMPLETE',
    progress: 100,
    path: '/act/1',
  },
  {
    number: 'II',
    title: 'THE REFLECTION',
    symbol: '◍',
    status: 'COMPLETE',
    progress: 100,
    path: '/act/2',
  },
  {
    number: 'III',
    title: 'THE CRUCIBLE',
    symbol: '◉',
    status: 'IN PROGRESS',
    progress: 12,
    path: '/visualizer/act_three',
    active: true,
  },
  {
    number: 'IV',
    title: 'THE SPARK',
    symbol: '○',
    status: 'ENCRYPTED',
    progress: 0,
    path: '/act/4',
  },
];

export default function LaunchPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const currentAct = Number(user?.current_act || 3);

  const openAct = (act) => {
    navigate(act.path);
  };

  return (
    <main className="central-launch-page">
      <header className="central-launch-topbar">
        <div>
          <strong>■ STATUS: ACTIVE</strong>
          <span>ACT {currentAct === 3 ? 'THREE: THE CRUCIBLE' : `${currentAct}: ONLINE`}</span>
        </div>
        <div>
          <strong>MEMORY LOAD ▮▮▮▮▮</strong>
          <span>24:88:91</span>
        </div>
      </header>

      <section className="central-launch-hero">
        <small>INITIALIZING PROTOCOL</small>
        <h1>CHROMA KEY PROTOCOL</h1>
      </section>

      <section className="central-launch-shell" aria-label="Module selection panel">
        <h2>MODULE SELECT</h2>
        <div className="central-launch-cards">
          {launchActs.map((act) => (
            <article key={act.number} className={`central-launch-card${act.active ? ' is-active' : ''}`}>
              <button type="button" onClick={() => openAct(act)} aria-label={`Open Act ${act.number}`}>
                <span className="central-launch-act">ACT {act.number}</span>
                <span className="central-launch-title">{act.title}</span>
                <span className="central-launch-ring">{act.symbol}</span>
                <span className="central-launch-progress" style={{ '--launch-progress': `${act.progress}%` }}>
                  <span>{act.status}</span>
                  <span>{act.progress}%</span>
                </span>
                {act.active && <span className="central-launch-enter">ENTER</span>}
              </button>
            </article>
          ))}
        </div>
      </section>

      <footer className="central-launch-footer">
        <span>SELF ANALYSIS: ACTIVE</span>
        <span>NODE.03 [ACTIVE]</span>
      </footer>
    </main>
  );
}
