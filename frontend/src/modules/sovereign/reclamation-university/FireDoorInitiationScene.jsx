import { useEffect, useMemo, useState } from 'react';

const SYSTEM_LABELS = [
  'SIGNAL ACQUISITION: ACTIVE',
  'RISING SEEKER DETECTED',
  'ACT III: RECLAMATION PROTOCOL ONLINE',
  'MODULE 1: THE FIRE DOOR',
];

function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return undefined;
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = () => setPrefersReducedMotion(mediaQuery.matches);
    mediaQuery.addEventListener?.('change', handleChange);
    return () => mediaQuery.removeEventListener?.('change', handleChange);
  }, []);

  return prefersReducedMotion;
}

export default function FireDoorInitiationScene({ copy, onCross }) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [visibleSystemCount, setVisibleSystemCount] = useState(0);
  const [visibleParagraphs, setVisibleParagraphs] = useState([]);
  const [activeText, setActiveText] = useState('');
  const [isTransmissionComplete, setIsTransmissionComplete] = useState(false);

  const progress = useMemo(() => {
    const systemWeight = visibleSystemCount / SYSTEM_LABELS.length;
    const paragraphWeight = (visibleParagraphs.length + (activeText ? 0.5 : 0)) / copy.length;
    return Math.min(100, Math.round(((systemWeight * 0.3) + (paragraphWeight * 0.7)) * 100));
  }, [activeText, copy.length, visibleParagraphs.length, visibleSystemCount]);

  useEffect(() => {
    let cancelled = false;
    const timers = [];
    const delay = (ms) => new Promise((resolve) => {
      const timer = window.setTimeout(resolve, ms);
      timers.push(timer);
    });

    async function runTransmission() {
      setVisibleSystemCount(0);
      setVisibleParagraphs([]);
      setActiveText('');
      setIsTransmissionComplete(false);

      for (let index = 0; index < SYSTEM_LABELS.length; index += 1) {
        if (cancelled) return;
        setVisibleSystemCount(index + 1);
        await delay(prefersReducedMotion ? 260 : 560);
      }

      await delay(prefersReducedMotion ? 260 : 620);

      for (const paragraph of copy) {
        if (cancelled) return;

        if (prefersReducedMotion) {
          setVisibleParagraphs((current) => [...current, paragraph]);
          await delay(520);
        } else {
          setActiveText('');
          for (let index = 1; index <= paragraph.length; index += 1) {
            if (cancelled) return;
            setActiveText(paragraph.slice(0, index));
            await delay(20);
          }
          setVisibleParagraphs((current) => [...current, paragraph]);
          setActiveText('');
          await delay(820);
        }
      }

      await delay(prefersReducedMotion ? 420 : 1200);
      if (!cancelled) setIsTransmissionComplete(true);
    }

    runTransmission();

    return () => {
      cancelled = true;
      timers.forEach((timer) => window.clearTimeout(timer));
    };
  }, [copy, prefersReducedMotion]);

  return (
    <section className="fire-door-initiation" style={{ '--transmission-progress': `${progress}%` }} aria-label="Rising Seeker Fire Door initiation">
      <div className="fire-door-noise" aria-hidden="true" />
      <div className="fire-door-scanline" aria-hidden="true" />
      <div className="fire-door-threshold" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      <div className="fire-door-embers" aria-hidden="true">
        {Array.from({ length: 22 }).map((_, index) => <i key={index} />)}
      </div>

      <div className="fire-door-transmission-shell">
        <div className="fire-door-status-grid" aria-hidden="true">
          {SYSTEM_LABELS.map((label, index) => (
            <span key={label} className={visibleSystemCount > index ? 'is-visible' : ''}>{label}</span>
          ))}
        </div>

        <div className="sr-only">{copy.join('\n\n')}</div>

        <div className="fire-door-copy-panel" aria-hidden="true">
          <div className="fire-door-progress-track"><span /></div>
          <div className="fire-door-copy">
            {visibleParagraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            {activeText && <p className="is-typing">{activeText}<b aria-hidden="true" /></p>}
          </div>
        </div>

        {isTransmissionComplete && (
          <div className="fire-door-completion">
            <span>TRANSMISSION RECEIVED</span>
            <strong>FIRE DOOR READY</strong>
            <button type="button" onClick={onCross}>Cross The Fire Door</button>
          </div>
        )}
      </div>
    </section>
  );
}
