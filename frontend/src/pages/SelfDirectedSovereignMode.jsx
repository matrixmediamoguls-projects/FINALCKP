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
    lightCode: "The Sun Don't Invoice",
    route: '/experiencemode/sovereign/reclamation-university',
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

const PROTOCOL_PROGRESS = {
  currentTrack: 15,
  totalTracks: 36,
  percentage: 42,
};

function getCircularOffset(index, activeIndex, length) {
  let offset = index - activeIndex;
  const midpoint = Math.floor(length / 2);

  if (offset > midpoint) offset -= length;
  if (offset < -midpoint) offset += length;

  return offset;
}

function HudFrame({ title, children, className = '' }) {
  return (
    <section className={`sos-hud-frame ${className}`}>
      <span className="sos-hud-corner sos-hud-corner--tl" aria-hidden="true" />
      <span className="sos-hud-corner sos-hud-corner--tr" aria-hidden="true" />
      <span className="sos-hud-corner sos-hud-corner--bl" aria-hidden="true" />
      <span className="sos-hud-corner sos-hud-corner--br" aria-hidden="true" />
      <h2>{title}</h2>
      {children}
    </section>
  );
}

function ModuleCard({ module, offset, index, onSelect }) {
  return (
    <button
      type="button"
      className={`sos-module-card ${offset === 0 ? 'is-active' : ''}`}
      data-module-index={index}
      data-offset={offset}
      onClick={onSelect}
      aria-label={`${offset === 0 ? 'Enter' : 'Select'} ${module.title}`}
      aria-current={offset === 0 ? 'true' : undefined}
    >
      <span className="sos-card-shell">
        <span className="sos-card-edge" aria-hidden="true" />
        <img className="sos-card-art" src={module.card} alt={`${module.title} module card`} />
        <span className="sos-card-scanline" aria-hidden="true" />
      </span>
    </button>
  );
}

function SovereignHeader({ userName, clearanceLevel }) {
  return (
    <header className="sos-header">
      <div className="sos-brand-block">
        <img src="/emblem/reclamation_core_emblem.png" alt="" />
        <div>
          <strong>The Chroma Key Protocol</strong>
          <span>Reclamation Mainframe</span>
          <span>Sovereign Mode</span>
        </div>
      </div>

      <div className="sos-system-status" role="status" aria-label="System status operational">
        <i aria-hidden="true" />
        System Status: Operational
      </div>

      <div className="sos-user-block">
        <div>
          <span>User: {userName}</span>
          <strong>Clearance: ECP Level {clearanceLevel}</strong>
        </div>
        <img src="/emblem/reclamation_core_emblem.png" alt="" />
      </div>
    </header>
  );
}

function PrometheanCore({ intensity }) {
  return (
    <div className="sos-promethean-core" style={{ '--core-intensity': intensity }} aria-hidden="true">
      <span className="sos-core-beam" />
      <span className="sos-core-ring sos-core-ring--outer" />
      <span className="sos-core-ring sos-core-ring--middle" />
      <span className="sos-core-ring sos-core-ring--inner" />
      <span className="sos-core-flame" />
      <span className="sos-core-aura" />
      <span className="sos-core-embers" />
    </div>
  );
}

export default function SelfDirectedSovereignMode() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeIndex, setActiveIndex] = useState(2);
  const [zoom, setZoom] = useState(1);
  const [isRotating, setIsRotating] = useState(false);

  const activeModule = MODULES[activeIndex];
  const userName = user?.name || user?.email?.split('@')[0] || 'Supabase';
  const clearanceLevel = user?.level || 7;

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
    setIsRotating(true);
    setActiveIndex((current) => (current + direction + MODULES.length) % MODULES.length);
    window.setTimeout(() => setIsRotating(false), 640);
  }, []);

  const handlePointerMove = useCallback((event) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 2;
    const y = ((event.clientY - bounds.top) / bounds.height - 0.5) * 2;
    event.currentTarget.style.setProperty('--parallax-x', x.toFixed(3));
    event.currentTarget.style.setProperty('--parallax-y', y.toFixed(3));
  }, []);

  const resetParallax = useCallback((event) => {
    event.currentTarget.style.setProperty('--parallax-x', 0);
    event.currentTarget.style.setProperty('--parallax-y', 0);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'ArrowLeft') rotate(-1);
      if (event.key === 'ArrowRight') rotate(1);
      if (event.key === 'Enter') navigate(activeModule.route);
      if (event.key === '+' || event.key === '=') setZoom((value) => Math.min(1.12, value + 0.06));
      if (event.key === '-') setZoom((value) => Math.max(0.88, value - 0.06));
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeModule.route, navigate, rotate]);

  return (
    <main
      className={`sos-page ${isRotating ? 'is-rotating' : ''}`}
      style={{ '--deck-zoom': zoom, '--parallax-x': 0, '--parallax-y': 0 }}
      onPointerMove={handlePointerMove}
      onPointerLeave={resetParallax}
    >
      <div className="sos-chamber" aria-hidden="true" />
      <div className="sos-depth-field" aria-hidden="true" />
      <div className="sos-architectural-lights" aria-hidden="true" />
      <div className="sos-orbit-track" aria-hidden="true" />
      <div className="sos-particles" aria-hidden="true" />
      <div className="sos-vignette" aria-hidden="true" />

      <SovereignHeader userName={userName} clearanceLevel={clearanceLevel} />

      <section
        className="sos-operating-stage"
        aria-label="Sovereign Mode module carousel"
        aria-roledescription="carousel"
      >
        <button
          type="button"
          className="sos-stage-arrow sos-stage-arrow--left"
          onClick={() => rotate(-1)}
          aria-label="Rotate modules left"
        >
          <ChevronLeft />
        </button>

        <div className="sos-card-deck" aria-live="polite">
          {cards.map(({ module, index, offset }) => (
            <ModuleCard
              key={module.id}
              module={module}
              index={index}
              offset={offset}
              onSelect={() => {
                if (offset === 0) {
                  navigate(module.route);
                  return;
                }
                setIsRotating(true);
                setActiveIndex(index);
                window.setTimeout(() => setIsRotating(false), 640);
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

      <PrometheanCore intensity={isRotating ? 1 : 0.62} />

      <aside className="sos-left-hud" aria-label="Active light code">
        <HudFrame title="Active Light Code" className="sos-light-code-panel">
          <div className="sos-light-code-body">
            <img src="/emblem/reclamation_core_emblem.png" alt="" />
            <div>
              <strong>{activeModule.lightCode}</strong>
              <span>Code: {activeModule.code}-777-A</span>
            </div>
          </div>
          <div className="sos-sync-status">
            <span>Sync Status</span>
            <strong>Synchronized</strong>
          </div>
        </HudFrame>
      </aside>

      <aside className="sos-right-hud" aria-label="Protocol telemetry">
        <HudFrame title="Protocol Progress" className="sos-progress-panel">
          <span>Track {PROTOCOL_PROGRESS.currentTrack} of {PROTOCOL_PROGRESS.totalTracks}</span>
          <div className="sos-progress-row">
            <div className="sos-progress-track">
              <i style={{ width: `${PROTOCOL_PROGRESS.percentage}%` }} />
            </div>
            <strong>{PROTOCOL_PROGRESS.percentage}%</strong>
          </div>
        </HudFrame>

        <HudFrame title="Element Balance" className="sos-element-panel">
          <div className="sos-elements">
            {ELEMENT_LEVELS.map((element) => (
              <div
                className="sos-element-meter"
                key={element.label}
                style={{
                  '--element-value': `${element.value}%`,
                  '--element-color': element.color,
                }}
              >
                <span className="sos-element-glyph" aria-hidden="true" />
                <span>{element.label}</span>
                <i><b /></i>
                <strong>{element.value}%</strong>
              </div>
            ))}
          </div>
        </HudFrame>
      </aside>

      <section className="sos-core-readout" aria-label="Promethean Core energy output">
        <strong>Promethean Core</strong>
        <div>
          <span>Energy Output</span>
          <i><b /></i>
          <em>93%</em>
        </div>
      </section>

      <nav className="sos-control-rail" aria-label="Sovereign Mode controls">
        <button type="button" onClick={() => setActiveIndex(2)}>
          <CircleGauge aria-hidden="true" />
          <span>System Overview</span>
        </button>

        <div className="sos-rotate-controls">
          <span><Orbit aria-hidden="true" /> Orbital Controls</span>
          <div>
            <button type="button" onClick={() => rotate(-1)} aria-label="Rotate left">
              <ChevronLeft />
            </button>
            <strong>Rotate</strong>
            <button type="button" onClick={() => rotate(1)} aria-label="Rotate right">
              <ChevronRight />
            </button>
          </div>
        </div>

        <div className="sos-core-button" aria-hidden="true">
          <img src="/emblem/reclamation_core_emblem.png" alt="" />
        </div>

        <div className="sos-zoom-controls">
          <button
            type="button"
            onClick={() => setZoom((value) => Math.max(0.88, value - 0.06))}
            aria-label="Zoom out"
          >
            <Minus />
          </button>
          <strong>Zoom</strong>
          <button
            type="button"
            onClick={() => setZoom((value) => Math.min(1.12, value + 0.06))}
            aria-label="Zoom in"
          >
            <Plus />
          </button>
        </div>

        <button
          type="button"
          className="sos-enter-module"
          onClick={() => navigate(activeModule.route)}
          aria-label={`Enter ${activeModule.title}`}
        >
          Enter Module
          <ChevronRight aria-hidden="true" />
        </button>
      </nav>
    </main>
  );
}
