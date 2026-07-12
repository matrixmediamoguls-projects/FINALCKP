import { useState } from 'react';
import { ArrowRight, BookOpen, Check, ChevronDown, Clock3, Headphones, ListChecks } from 'lucide-react';

const MODULE_STEPS = [
  ['01', 'Receive the signal', 'Listen to each paired track and identify its teaching.'],
  ['02', 'Name the pattern', 'Choose the Shadow Code that describes the restriction.'],
  ['03', 'Retrieve the law', 'Translate that pattern into a usable Light Code.'],
  ['04', 'Write your declaration', 'Put the recovered law into your own words.'],
  ['05', 'Integrate and save', 'Receive the Integration Key and preserve your record.'],
];

export default function FireDoorInitiationScene({ copy = [], module, onCross }) {
  const [showTransmission, setShowTransmission] = useState(false);
  const trackCount = module?.sourceTrackIds?.length || 0;

  return (
    <main className="module-brief" aria-labelledby="module-brief-title">
      <div className="module-brief-glow" aria-hidden="true" />

      <header className="module-brief-header">
        <p className="fire-door-kicker">Reclamation University · Module Brief</p>
        <h1 id="module-brief-title">{module?.title || 'The Fire Door'}</h1>
        <p>{module?.subtitle || 'Cross the threshold where authorship returns.'}</p>
      </header>

      <div className="module-brief-meta" aria-label="Module details">
        <span><Clock3 size={17} /><strong>{module?.estimatedMinutes || 45}</strong> minutes</span>
        <span><Headphones size={17} /><strong>{trackCount}</strong> track signals</span>
        <span><ListChecks size={17} /><strong>5</strong> guided steps</span>
      </div>

      <section className="module-brief-outcome" aria-labelledby="module-outcome-title">
        <span className="module-brief-icon"><BookOpen size={23} /></span>
        <div>
          <p className="fire-door-kicker">Your outcome</p>
          <h2 id="module-outcome-title">Turn one restrictive pattern into a law you can live by.</h2>
          <p>Your work saves as you move through the sequence. You can leave and return at any point.</p>
        </div>
      </section>

      <section className="module-brief-roadmap" aria-labelledby="module-roadmap-title">
        <div className="module-brief-section-heading">
          <p className="fire-door-kicker">The sequence</p>
          <h2 id="module-roadmap-title">What you will do</h2>
        </div>
        <ol>
          {MODULE_STEPS.map(([number, title, description]) => (
            <li key={number}>
              <span>{number}</span>
              <div><strong>{title}</strong><p>{description}</p></div>
              <Check size={16} aria-hidden="true" />
            </li>
          ))}
        </ol>
      </section>

      <section className={`module-transmission ${showTransmission ? 'is-open' : ''}`}>
        <button
          type="button"
          className="module-transmission-toggle"
          onClick={() => setShowTransmission((current) => !current)}
          aria-expanded={showTransmission}
        >
          <span><strong>Opening transmission</strong><small>{copy.length} short readings · optional before beginning</small></span>
          <ChevronDown size={19} />
        </button>
        {showTransmission && (
          <div className="module-transmission-copy">
            {copy.map((paragraph, index) => <p key={`${index}-${paragraph.slice(0, 18)}`}>{paragraph}</p>)}
          </div>
        )}
      </section>

      <footer className="module-brief-footer">
        <p><strong>Progress saves automatically.</strong> Begin when you are ready.</p>
        <button type="button" className="fire-door-action" onClick={onCross}>
          Begin Module <ArrowRight size={18} />
        </button>
      </footer>
    </main>
  );
}
