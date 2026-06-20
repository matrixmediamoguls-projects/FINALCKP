import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  ChevronRight,
  CircleGauge,
  Minus,
  Orbit,
  Plus,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './SelfDirectedSovereignMode.css';

const MODULES = [
  {
    id: 'audio-visualizer-core',
    title: 'Audio Visualizer Core',
    code: 'AVC',
    lightCode: 'See The Waveform. Shape The Sound. Amplify Your Vision.',
    route: '/visualizer-core',
    card: '/ui/reclamation/Module_Cards/Visualizer_Core.png',
  },
  {
    id: 'elemental-codex',
    title: 'Elemental Codex',
    code: 'ECP',
    lightCode: 'The Structure Beneath The System',
    route: '/codex',
    card: '/ui/reclamation/Module_Cards/Elemental_Codex_clean.png',
  },
  {
    id: 'reclamation-university',
    title: 'Reclamation University',
    code: 'RU',
    lightCode: "The Sun Don't Invoice?",
    route: '/Reclamation_User_Journey',
    card: '/ui/reclamation/Module_Cards/Reclamation_University.png',
  },
  {
    id: 'lyrical-codex',
    title: 'Lyrical Codex',
    code: 'LCP',
    lightCode: 'Content Is Structure. Structure Is Legacy.',
    route: '/protocol/3',
    card: '/ui/reclamation/Module_Cards/Lyrical_Codex_clean.png',
  },
  {
    id: 'sonic-artifacts',
    title: 'Sonic Artifacts',
    code: 'SAP',
    lightCode: 'Frequencies Hold Memory. Artifacts Hold Purpose.',
    route: '/listen/3',
    card: '/ui/reclamation/Module_Cards/Sonic_Artifacts.png',
  },
  {
    id: 'vibes-and-tribes',
    title: 'Vibes And Tribes',
    code: 'VAT',
    lightCode: 'Resonance Finds Its People.',
    route: '/journal',
    card: '/ui/reclamation/Module_Cards/Vibes_Tribes.png',
  },
];

const ELEMENT_LEVELS = [
  { label: 'Fire', value: 78, color: '#f22f2f' },
  { label: 'Water', value: 62, color: '#249ce6' },
  { label: 'Earth', value: 70, color: '#2daf62' },
  { label: 'Air', value: 64, color: '#55bc56' },
  { label: 'Sound', value: 88, color: '#8d20ef' },
];

function getCircularOffset(index, activeIndex, length) {
  let offset = index - activeIndex;
  const midpoint = Math.floor(length / 2);

  if (offset > midpoint) offset -= length;
  if (offset < -midpoint) offset += length;

  return offset;
}

function ModuleCard({ module, offset, index, onSelect }) {
  const distance = Math.abs(offset);

  return (
    <button
      type="button"
      className={`sos-module-card ${offset === 0 ? 'is-active' : ''}`}
      data-module-index={index}
      data-offset={offset}
      style={{ '--card-order': 20 - distance }}
      onClick={onSelect}
      aria-label={`Select ${module.title}`}
      aria-current={offset === 0 ? 'true' : undefined}
    >
      <img className="sos-card-art" src={module.card} alt={`${module.title} module card`} />
    </button>
  );
}

function HudPanel({ title, children, className = '' }) {
  return (
    <section className={`sos-hud-panel ${className}`}>
      <h2>{title}</h2>
      {children}
    </section>
  );
}

export default function SelfDirectedSovereignMode() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeIndex, setActiveIndex] = useState(0);
  const [zoom, setZoom] = useState(1);

  const activeModule = MODULES[activeIndex];
  const userName = user?.name || user?.email?.split('@')[0] || 'Supabase';

  const cards = useMemo(
    () =>
      MODULES.map((module, index) => ({
        module,
        index,
        offset: getCircularOffset(index, activeIndex, MODULES.length),
      })),
    [activeIndex],
  );

  const rotate = useCallback((direction) => {
    setActiveIndex((current) => (current + direction + MODULES.length) % MODULES.length);
  }, []);

  const handleDeckClick = useCallback((event) => {
    if (event.target.closest('.sos-module-card')) return;

    const cards = Array.from(event.currentTarget.querySelectorAll('.sos-module-card'))
      .filter((card) => window.getComputedStyle(card).pointerEvents !== 'none')
      .filter((card) => {
        const rect = card.getBoundingClientRect();
        return (
          event.clientX >= rect.left &&
          event.clientX <= rect.right &&
          event.clientY >= rect.top &&
          event.clientY <= rect.bottom
        );
      })
      .sort((a, b) => Number(b.style.getPropertyValue('--card-order')) - Number(a.style.getPropertyValue('--card-order')));

    const selectedIndex = Number(cards[0]?.dataset.moduleIndex);
    if (Number.isInteger(selectedIndex)) {
      setActiveIndex(selectedIndex);
    }
  }, []);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'ArrowLeft') rotate(-1);
      if (event.key === 'ArrowRight') rotate(1);
      if (event.key === 'Enter') navigate(activeModule.route);
      if (event.key === '+' || event.key === '=') setZoom((value) => Math.min(1.16, value + 0.08));
      if (event.key === '-') setZoom((value) => Math.max(0.84, value - 0.08));
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeModule.route, navigate, rotate]);

  return (
    <main
      className="sos-page"
      style={{ '--deck-zoom': zoom, '--parallax-x': 0, '--parallax-y': 0 }}
    >
      <div className="sos-chamber" aria-hidden="true" />
      <div className="sos-depth-field" aria-hidden="true" />
      <div className="sos-orbital-light sos-orbital-light--one" aria-hidden="true" />
      <div className="sos-orbital-light sos-orbital-light--two" aria-hidden="true" />
      <div className="sos-particles" aria-hidden="true" />
      <div className="sos-vignette" aria-hidden="true" />
      <div className="sos-violet-conduits" aria-hidden="true">
        <i />
        <i />
        <i />
        <i />
        <i />
        <i />
      </div>
      <div className="sos-promethean-core" aria-hidden="true">
        <span className="sos-core-flame" />
        <span className="sos-core-aura" />
        <span className="sos-core-reflection" />
        <span className="sos-core-embers" />
      </div>

      <header className="sos-header">
        <div className="sos-brand-block">
          <img src="/emblem/reclamation_core_emblem.png" alt="" />
          <div>
            <strong>The Chroma Key Protocol</strong>
            <span>Reclamation Mainframe</span>
            <span>Sovereign Mode</span>
          </div>
        </div>

        <div className="sos-system-status">
          <i />
          System Status: Operational
        </div>

        <div className="sos-user-block">
          <div>
            <strong>User: {userName}</strong>
            <span>Clearance: ECP Level {user?.level || 7}</span>
          </div>
          <img src="/emblem/reclamation_core_emblem.png" alt="" />
        </div>
      </header>

      <section className="sos-operating-stage" aria-label="Sovereign Mode orbital operating system">
        <button
          type="button"
          className="sos-stage-arrow sos-stage-arrow--left"
          onClick={() => rotate(-1)}
          aria-label="Rotate modules left"
        >
          <ChevronLeft />
        </button>

        <div className="sos-card-deck" onClick={handleDeckClick}>
          {cards.map(({ module, index, offset }) => (
            <ModuleCard
              key={module.id}
              module={module}
              index={index}
              offset={offset}
              onSelect={() => {
                if (module.id === 'audio-visualizer-core') {
                  navigate(module.route);
                  return;
                }
                setActiveIndex(index);
              }}
            />
          ))}
        </div>

        <button
          type="button"
          className="sos-stage-arrow sos-stage-arrow--right"
          onClick={() => rotate(1)}
          aria-label="Rotate modules right"
        >
          <ChevronRight />
        </button>
      </section>

      <div className="sos-core-readout">
        <span>Promethean Core</span>
        <div>
          <i />
          <small>Energy Output</small>
          <strong>93%</strong>
        </div>
      </div>

      <HudPanel title="Active Light Code" className="sos-light-code">
        <div className="sos-light-code-body">
          <CircleGauge aria-hidden="true" />
          <div>
            <strong>{activeModule.lightCode}</strong>
            <span>Code: {activeModule.code}-777-A</span>
          </div>
        </div>
        <p>Sync Status</p>
        <b>Synchronized</b>
      </HudPanel>

      <div className="sos-right-hud">
        <HudPanel title="Protocol Progress">
          <span>Track 15 of 27</span>
          <div className="sos-progress">
            <i style={{ width: '55%' }} />
          </div>
          <strong>55%</strong>
        </HudPanel>

        <HudPanel title="Element Balance">
          <div className="sos-elements">
            {ELEMENT_LEVELS.map((element) => (
              <div key={element.label}>
                <span>{element.label}</span>
                <i>
                  <b style={{ width: `${element.value}%`, background: element.color }} />
                </i>
                <strong>{element.value}%</strong>
              </div>
            ))}
          </div>
        </HudPanel>
      </div>

      <nav className="sos-control-rail" aria-label="Sovereign Mode controls">
        <button type="button" onClick={() => setActiveIndex(0)}>
          <CircleGauge aria-hidden="true" />
          System Overview
        </button>

        <div className="sos-rotate-controls">
          <span><Orbit aria-hidden="true" /> Orbital Controls</span>
          <button type="button" onClick={() => rotate(-1)} aria-label="Rotate left">
            <ChevronLeft />
          </button>
          <strong>Rotate</strong>
          <button type="button" onClick={() => rotate(1)} aria-label="Rotate right">
            <ChevronRight />
          </button>
        </div>

        <div className="sos-core-button" aria-hidden="true">
          <img src="/emblem/reclamation_core_emblem.png" alt="" />
        </div>

        <div className="sos-zoom-controls">
          <button
            type="button"
            onClick={() => setZoom((value) => Math.max(0.84, value - 0.08))}
            aria-label="Zoom out"
          >
            <Minus />
          </button>
          <strong>Zoom</strong>
          <button
            type="button"
            onClick={() => setZoom((value) => Math.min(1.16, value + 0.08))}
            aria-label="Zoom in"
          >
            <Plus />
          </button>
        </div>

        <button type="button" className="sos-enter-module" onClick={() => navigate(activeModule.route)}>
          Enter Module
          <ChevronRight aria-hidden="true" />
        </button>
      </nav>
    </main>
  );
}
