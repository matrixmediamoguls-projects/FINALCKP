import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HERMETIC_HALL_FACULTY } from '../../../data/hermeticHallCurriculum';
import './HermeticHallViewport.css';

const moduleBySlug = new Map(
  HERMETIC_HALL_FACULTY.modules.map((module) => [module.slug, module])
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
  module: moduleBySlug.get(law.slug),
  title: moduleBySlug.get(law.slug)?.title || law.name,
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

  const enterLaw = (law) => {
    setIsTransitioning(true);
    window.setTimeout(() => navigate(law.route), 420);
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

      <section className={`hh-display${activeLaw ? ' has-curriculum' : ''}`} aria-live="polite">
        <div className="hh-display-glass" />
        {activeLaw ? (
          <article key={activeLaw.slug} className="hh-curriculum-reader" aria-label={`${activeLaw.title} curriculum`}>
            <header>
              <span>Hermetic Curriculum · Chamber {activeLaw.number}</span>
              <h1>{activeLaw.title}</h1>
            </header>
            <div className="hh-curriculum-window" tabIndex={0}>
              <div className="hh-curriculum-scroll">
                <p className="hh-curriculum-axiom">{activeLaw.axiom}</p>
                {(activeLaw.module?.initiationCopy || []).map((paragraph, index) => (
                  <p key={`${activeLaw.slug}-reading-${index}`}>{paragraph}</p>
                ))}
                <h2>Field of Inquiry</h2>
                <p>{activeLaw.module?.lyricAnchors?.[0]?.line}</p>
                <h2>Curriculum Outcomes</h2>
                <ol>
                  {(activeLaw.module?.learningObjectives || []).map((objective) => (
                    <li key={objective}>{objective}</li>
                  ))}
                </ol>
                <h2>Integration Practice</h2>
                <p>{activeLaw.module?.integrationKey}</p>
                <p className="hh-curriculum-end">End of transmission · Enter the practicum when ready</p>
              </div>
            </div>
            <footer>
              <span>Scroll or hover to pause transmission</span>
              <button type="button" onClick={() => enterLaw(activeLaw)}>Enter Module</button>
            </footer>
          </article>
        ) : (
          <div className="hh-display-copy">
            <span>Reclamation University</span>
            <h1>The Hermetic Hall</h1>
            <p>Select an illuminated law to receive its curriculum transmission.</p>
          </div>
        )}
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
            onActivate={setActiveLaw}
          />
        ))}
      </nav>

      <p className="hh-mobile-instruction">Choose a law to enter its faculty</p>
    </main>
  );
}
