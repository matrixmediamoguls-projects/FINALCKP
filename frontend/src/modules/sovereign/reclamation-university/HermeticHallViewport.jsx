import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HERMETIC_HALL_FACULTY } from '../../../data/hermeticHallCurriculum';
import './HermeticHallViewport.css';

const moduleTitleBySlug = new Map(
  HERMETIC_HALL_FACULTY.modules.map((module) => [module.slug, module.title])
);

const laws = [
  {
    number: 1,
    slug: 'mentalism',
    name: 'Mentalism',
    axiom: 'The All is Mind. The Universe is Mental.',
    glyph: '⌁',
    accent: '#ff542e',
    route: '/experiencemode/sovereign/reclamation-university/hermetic-hall/mentalism',
  },
  {
    number: 2,
    slug: 'correspondence',
    name: 'Correspondence',
    axiom: 'As above, so below. As below, so above.',
    glyph: '✧',
    accent: '#ff268f',
    route: '/experiencemode/sovereign/reclamation-university/hermetic-hall/correspondence',
  },
  {
    number: 3,
    slug: 'vibration',
    name: 'Vibration',
    axiom: 'Nothing rests. Everything moves. Everything vibrates.',
    glyph: '◎',
    accent: '#e92c80',
    route: '/experiencemode/sovereign/reclamation-university/hermetic-hall/vibration',
  },
  {
    number: 4,
    slug: 'polarity',
    name: 'Polarity',
    axiom: 'Everything is dual. Everything has poles.',
    glyph: '☯',
    accent: '#19a9ff',
    route: '/experiencemode/sovereign/reclamation-university/hermetic-hall/polarity',
  },
  {
    number: 5,
    slug: 'rhythm',
    name: 'Rhythm',
    axiom: 'Everything flows, out and in. Everything has its tides.',
    glyph: '≋',
    accent: '#a6d30c',
    route: '/experiencemode/sovereign/reclamation-university/hermetic-hall/rhythm',
  },
  {
    number: 6,
    slug: 'cause-and-effect',
    name: 'Cause and Effect',
    axiom: 'Every cause has its effect. Every effect has its cause.',
    glyph: '↬',
    accent: '#ff9d16',
    route: '/experiencemode/sovereign/reclamation-university/hermetic-hall/cause-and-effect',
  },
  {
    number: 7,
    slug: 'gender',
    name: 'Gender',
    axiom: 'Gender is in everything. Creation holds both principles.',
    glyph: '⚥',
    accent: '#ff4a1c',
    route: '/experiencemode/sovereign/reclamation-university/hermetic-hall/gender',
  },
].map((law) => ({
  ...law,
  title: moduleTitleBySlug.get(law.slug) || law.name,
}));

function LawButton({ law, active, onActivate }) {
  return (
    <button
      type="button"
      className={`hh-law hh-law-${law.number}${active ? ' is-active' : ''}`}
      style={{ '--law-accent': law.accent }}
      onClick={() => onActivate(law)}
      aria-label={`Enter ${law.title}: ${law.axiom}`}
      aria-current={active ? 'step' : undefined}
    >
      <span className="hh-law-accessible-copy">
        <b>{law.number}</b>
        <span>{law.title}</span>
        <small>{law.axiom}</small>
        <i aria-hidden="true">{law.glyph}</i>
      </span>
    </button>
  );
}

export default function HermeticHallViewport() {
  const navigate = useNavigate();
  const [activeLaw, setActiveLaw] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const navigationTimer = useRef(null);

  useEffect(() => () => window.clearTimeout(navigationTimer.current), []);

  const activateLaw = (law) => {
    window.clearTimeout(navigationTimer.current);
    setActiveLaw(law);
    setIsTransitioning(true);
    navigationTimer.current = window.setTimeout(() => navigate(law.route), 760);
  };

  return (
    <main
      className={`hermetic-hall${isTransitioning ? ' is-transitioning' : ''}`}
      style={{ '--active-law': activeLaw?.accent || '#ff311c' }}
      aria-label="The Hermetic Hall at Reclamation University"
    >
      <div className="hh-scene" aria-hidden="true" />
      <div className="hh-atmosphere" aria-hidden="true">
        <span className="hh-haze" />
        <span className="hh-energy-line" />
        {Array.from({ length: 14 }, (_, index) => (
          <i
            key={index}
            style={{ '--particle-index': index, '--particle-x': (index * 37) % 100 }}
          />
        ))}
      </div>

      <section className="hh-display" aria-live="polite" aria-atomic="true">
        <div className="hh-display-glass" />
        <div className="hh-display-copy">
          <span>{activeLaw ? `Hermetic Law ${activeLaw.number}` : 'Reclamation University'}</span>
          <h1 className={activeLaw ? 'is-module-title' : undefined}>
            {activeLaw ? activeLaw.title : 'The Hermetic Hall'}
          </h1>
          <p>{activeLaw ? activeLaw.axiom : 'Select an illuminated law to begin the transmission.'}</p>
          {activeLaw && <b>Opening faculty protocol…</b>}
        </div>
      </section>

      <button
        type="button"
        className="hh-university-seal"
        onClick={() => navigate('/experiencemode/sovereign/reclamation-university/hermetic-hall/mentalism')}
        aria-label="Enter the first active Reclamation University module"
      >
        <span>Enter the University</span>
      </button>

      <nav className="hh-law-ring" aria-label="The Seven Hermetic Laws">
        {laws.map((law) => (
          <LawButton
            key={law.number}
            law={law}
            active={activeLaw?.number === law.number}
            onActivate={activateLaw}
          />
        ))}
      </nav>

      <p className="hh-mobile-instruction">Choose a law to enter its faculty</p>
    </main>
  );
}
