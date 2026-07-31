import { useState } from 'react';
import './HermeticHallViewport.css';

const principles = [
  { number: 'I', name: 'Mentalism', subtitle: 'Before the Body, the All-Mind.', progress: 18 },
  { number: 'II', name: 'Correspondence', subtitle: 'As Above, So Below.', progress: 0 },
  { number: 'III', name: 'Vibration', subtitle: 'Nothing Rests. Everything Moves.', progress: 0 },
  { number: 'IV', name: 'Polarity', subtitle: 'Everything Is Dual.', progress: 0 },
  { number: 'V', name: 'Rhythm', subtitle: 'Everything Flows, Out and In.', progress: 0 },
  { number: 'VI', name: 'Cause & Effect', subtitle: 'Every Cause Has Its Effect.', progress: 0 },
  { number: 'VII', name: 'Gender', subtitle: 'Creation Holds Both Principles.', progress: 0 },
];

export default function HermeticHallViewport() {
  const [selected, setSelected] = useState(principles[0]);
  const [notice, setNotice] = useState('');

  const choosePrinciple = (principle) => {
    setSelected(principle);
    setNotice('');
  };

  const enterModule = () => {
    setNotice(`${selected.name} is ready for the new curriculum.`);
  };

  return (
    <main className="hermetic-hall" aria-label="Reclamation University Hermetic Hall">
      <header className="hh-topbar" aria-label="Hermetic Hall heading">
        <span className="hh-brand">Reclamation University</span>
        <h1>Hermetic Hall</h1>
        <span className="hh-instruction">Select a Principle</span>
      </header>

      <nav className="hh-principle-map" aria-label="Seven Hermetic principles">
        {principles.map((principle, index) => (
          <button
            key={principle.number}
            type="button"
            className={`hh-hotspot hh-hotspot-${index + 1}${selected.number === principle.number ? ' is-selected' : ''}`}
            onClick={() => choosePrinciple(principle)}
            aria-label={`Select Principle ${principle.number}: ${principle.name}`}
            aria-pressed={selected.number === principle.number}
          />
        ))}
      </nav>

      <section className="hh-focus-card" aria-live="polite">
        <div className="hh-focus-copy">
          <span>Principle {selected.number}</span>
          <h2>{selected.name}</h2>
          <p>{selected.subtitle}</p>
        </div>
        <div className={`hh-orb hh-orb-${selected.number.toLowerCase().replace(/[^a-z]/g, '')}`} aria-hidden="true" />
        <div className="hh-progress">
          <span>{selected.progress}% Complete</span>
          <div className="hh-progress-track">
            <i style={{ width: `${selected.progress}%` }} />
          </div>
        </div>
        <button type="button" className="hh-enter" onClick={enterModule}>
          Enter Module <span aria-hidden="true">→</span>
        </button>
        {notice && <p className="hh-notice" role="status">{notice}</p>}
      </section>

      <footer className="hh-footer">
        <strong>7 Principles · 7 Paths · One System</strong>
        <span>Select a module to change the screen.</span>
      </footer>
    </main>
  );
}
