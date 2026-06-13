import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Boxes, BrainCircuit, Flame, Headphones, Music2, PenTool, RadioTower } from 'lucide-react';
import './SelfDirectedSovereignMode.css';

const MODULES = [
  {
    id: 'elemental-codex',
    title: 'Elemental Codex',
    code: 'ECP',
    icon: Boxes,
    lightCode: 'The Structure Beneath The System',
    description: 'Enter the elemental architecture behind the Reclamation Mainframe.',
    route: '/codex'
  },
  {
    id: 'lyrical-codex',
    title: 'Lyrical Codex',
    code: 'LCP',
    icon: BookOpen,
    lightCode: 'Content Is Structure. Structure Is Legacy.',
    description: 'Decode lyric, testimony, indictment, memory, and revelation.',
    route: '/protocol/3'
  },
  {
    id: 'sonic-artifacts',
    title: 'Sonic Artifacts',
    code: 'SAP',
    icon: Music2,
    lightCode: 'Frequencies Hold Memory. Artifacts Hold Purpose.',
    description: 'Access the sound objects, transmissions, and musical evidence.',
    route: '/listen/3'
  },
  {
    id: 'archetypes',
    title: 'Archaetypes',
    code: 'ARP',
    icon: BrainCircuit,
    lightCode: 'Patterns Precede Form. Origins Shape Destiny.',
    description: 'Study the pattern-forms operating beneath the visible story.',
    route: '/seeker'
  },
  {
    id: 'audio-visualizer-core',
    title: 'Audio Visualizer Core',
    code: 'AVC',
    icon: RadioTower,
    lightCode: 'The Structure Beneath The System',
    description: 'Launch the unobstructed visual signal chamber for Act Three.',
    route: '/visualizer/3'
  },
  {
    id: 'vibes-and-scribes',
    title: 'Vibes And Scribes',
    code: 'VVS',
    icon: PenTool,
    lightCode: 'The Structure Beneath The System',
    description: 'Write, reflect, annotate, and preserve your sovereign path.',
    route: '/journal'
  },
  {
    id: 'reclamation-university',
    title: 'Reclamation University',
    code: 'RU',
    icon: Headphones,
    lightCode: 'The Sun Don’t Invoice?',
    description: 'Training layer for lessons, unlocks, and operational context.',
    route: '/Reclamation_User_Journey'
  }
];

function SelfDirectedSovereignMode() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeModule = MODULES[activeIndex];
  const step = 360 / MODULES.length;

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % MODULES.length);
    }, 6200);

    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'ArrowLeft') {
        setActiveIndex((current) => (current - 1 + MODULES.length) % MODULES.length);
      }

      if (event.key === 'ArrowRight') {
        setActiveIndex((current) => (current + 1) % MODULES.length);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const orbitalCards = useMemo(() => {
    return MODULES.map((module, index) => ({
      ...module,
      angle: step * index,
      domePitch: index % 3 === 0 ? -12 : index % 3 === 1 ? 8 : 0,
      isActive: index === activeIndex
    }));
  }, [activeIndex, step]);

  const rotateDome = (direction) => {
    setActiveIndex((current) => (current + direction + MODULES.length) % MODULES.length);
  };

  return (
    <main className="sovereign-page">
      <div className="sovereign-frame" aria-label="Self-Directed Sovereign Mode official operating system hub">
        <header className="sovereign-header">
          <div className="sovereign-brand">
            <span className="sovereign-mark">M</span>
            <span>Musiq Matrix</span>
          </div>
          <div className="sovereign-title-block">
            <span>The Chroma Key Protocol</span>
            <h1>Self-Directed Sovereign Mode</h1>
          </div>
          <div className="sovereign-status"><span /> Dome Rig Active</div>
        </header>

        <section className="sovereign-stage">
          <aside className="sovereign-audio-feed" aria-hidden="true">
            <p>Audio Feed</p>
            <div className="sovereign-bars">
              {Array.from({ length: 28 }).map((_, index) => (
                <i key={index} style={{ '--bar-delay': `${index * 0.04}s` }} />
              ))}
            </div>
            <strong>Synced</strong>
            <small>01:24</small>
          </aside>

          <div className="sovereign-orbit-wrap">
            <div className="sovereign-focus-corridor" aria-hidden="true" />
            <div className="sovereign-radar" />
            <div className="sovereign-flame-core" aria-label="Central Promethean Flame Core">
              <div className="sovereign-flame-shell">
                <div className="sovereign-flame-ring ring-one" />
                <div className="sovereign-flame-ring ring-two" />
                <Flame className="sovereign-flame-icon" strokeWidth={1.25} />
                <div className="sovereign-core-label">Promethean Core</div>
              </div>
            </div>

            <div className="sovereign-dome-rig" style={{ '--dome-rotation': `${activeIndex * -step}deg` }}>
              <div className="sovereign-dome-environment" aria-hidden="true" />
              <div className="sovereign-light-tracks" aria-hidden="true" />
              <div className="sovereign-module-orbit-ring">
                {orbitalCards.map((module, index) => {
                  const Icon = module.icon;
                  return (
                    <Link
                      key={module.id}
                      to={module.route}
                      className={`sovereign-module-card ${module.isActive ? 'is-active' : ''}`}
                      style={{ '--angle': `${module.angle}deg`, '--dome-pitch': `${module.domePitch}deg` }}
                      onMouseEnter={() => setActiveIndex(index)}
                      onFocus={() => setActiveIndex(index)}
                    >
                      <span className="module-code">{module.code} // V1.0.0</span>
                      <Icon className="module-icon" strokeWidth={1.35} />
                      <strong>{module.title}</strong>
                      <em>{module.lightCode}</em>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>

          <aside className="sovereign-sync" aria-label="Sovereign dome navigation">
            <p>Rotate</p>
            <button type="button" className="sovereign-rotate-control" onClick={() => rotateDome(-1)} aria-label="Rotate dome left">‹</button>
            {MODULES.map((module, index) => (
              <button
                key={module.id}
                type="button"
                className={index === activeIndex ? 'is-active' : ''}
                onClick={() => setActiveIndex(index)}
                aria-label={`Focus ${module.title}`}
              />
            ))}
            <button type="button" className="sovereign-rotate-control" onClick={() => rotateDome(1)} aria-label="Rotate dome right">›</button>
            <small>360° Rig</small>
          </aside>
        </section>

        <section className="sovereign-control-panel">
          <div>
            <span>System Access // Authorized</span>
            <h2>{activeModule.title}</h2>
          </div>
          <p>{activeModule.description}</p>
          <Link to={activeModule.route} className="sovereign-launch-button">
            Launch {activeModule.code} Protocol
          </Link>
        </section>

        <footer className="sovereign-footer">
          <span>Reclamation Mainframe</span>
          <span>Live Feed · Rotating Dome</span>
        </footer>
      </div>
    </main>
  );
}

export default SelfDirectedSovereignMode;
