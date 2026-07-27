import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Gauge,
  Pause,
  Play,
  RotateCcw,
  Volume2,
  VolumeX,
} from 'lucide-react';
import './mentalismIntroSequence.css';

const SEQUENCE_STEPS = [
  {
    id: 'title',
    duration: 11000,
    eyebrow: 'ACT I',
    title: 'LAW OF MENTALISM',
    subtitle: 'BEFORE THE BODY, THE ALL-MIND',
    status: 'MODULE ONE',
  },
  {
    id: 'sequence',
    duration: 12000,
    eyebrow: 'SEQUENCING',
    title: 'CHROMA KEY',
    status: 'SIGNAL ACQUISITION IN PROGRESS',
    meter: true,
  },
  {
    id: 'protocol',
    duration: 14000,
    eyebrow: 'INITIALIZING',
    title: 'THE PROTOCOL',
    diagnostics: [
      ['SIGNAL', 'ONLINE'],
      ['PERCEPTION', 'CALIBRATING'],
      ['REALITY FILTER', 'ACTIVE'],
      ['CONSCIOUS OBSERVER', 'CONFIRMED'],
    ],
  },
  {
    id: 'observer',
    duration: 9000,
    eyebrow: 'AUTHORIZATION',
    title: 'CONSCIOUS OBSERVER',
    subtitle: 'CONFIRMED',
    status: 'HERMETIC HALL ACCESS GRANTED',
  },
  {
    id: 'reveal',
    duration: 11000,
    eyebrow: 'RECLAMATION UNIVERSITY',
    title: 'THE HERMETIC HALL',
    subtitle: 'MODULE ONE ONLINE',
    status: 'RECEIVE THE TRANSMISSION',
    revealHall: true,
  },
  {
    id: 'voice',
    duration: 12000,
    eyebrow: 'BEFORE YOU THINK ANOTHER THOUGHT',
    title: 'THERE IS A VOICE...',
    body: 'It was speaking before you chose your first belief.',
    revealHall: true,
  },
  {
    id: 'familiar',
    duration: 15000,
    eyebrow: 'SIGNAL DETECTED',
    title: 'IT BECAME SO FAMILIAR',
    body: 'You stopped recognizing it as influence and started calling it you.',
    revealHall: true,
  },
  {
    id: 'signal-check',
    eyebrow: 'SIGNAL CHECK',
    title: 'WHO AUTHORED THE BELIEF?',
    body: 'Choose the answer that most accurately describes the first belief that came to mind.',
    revealHall: true,
    interactive: true,
  },
  {
    id: 'ready',
    eyebrow: 'PARTICIPANT STATUS',
    title: 'CONSCIOUS',
    subtitle: 'AND PRESENT',
    body: 'The lesson will not ask you to accept another voice. It will teach you how to identify the one already speaking.',
    status: 'ENTER WHEN READY',
    revealHall: true,
    final: true,
  },
];

const PACE_OPTIONS = [
  { label: 'Reflective', value: 0.75 },
  { label: 'Guided', value: 1 },
  { label: 'Focused', value: 1.25 },
];

export default function MentalismIntroSequence({ onComplete }) {
  const [stepIndex, setStepIndex] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [pace, setPace] = useState(0.75);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [signalAnswer, setSignalAnswer] = useState('');

  const step = SEQUENCE_STEPS[stepIndex];
  const isLastStep = stepIndex === SEQUENCE_STEPS.length - 1;
  const canAutoAdvance = Boolean(step.duration && !step.interactive && !step.final);
  const progress = step.duration
    ? Math.min(100, (elapsed / (step.duration / pace)) * 100)
    : 100;

  const goToStep = useCallback((nextIndex) => {
    const boundedIndex = Math.max(0, Math.min(SEQUENCE_STEPS.length - 1, nextIndex));
    setStepIndex(boundedIndex);
    setElapsed(0);
    setIsPlaying(!SEQUENCE_STEPS[boundedIndex].interactive && !SEQUENCE_STEPS[boundedIndex].final);
  }, []);

  const nextStep = useCallback(() => {
    if (isLastStep) {
      onComplete();
      return;
    }
    goToStep(stepIndex + 1);
  }, [goToStep, isLastStep, onComplete, stepIndex]);

  const previousStep = useCallback(() => goToStep(stepIndex - 1), [goToStep, stepIndex]);

  useEffect(() => {
    if (!isPlaying || !canAutoAdvance) return undefined;
    const timer = window.setInterval(() => {
      setElapsed((current) => {
        const nextElapsed = current + 100;
        if (nextElapsed >= step.duration / pace) {
          window.clearInterval(timer);
          window.setTimeout(nextStep, 80);
          return step.duration / pace;
        }
        return nextElapsed;
      });
    }, 100);
    return () => window.clearInterval(timer);
  }, [canAutoAdvance, isPlaying, nextStep, pace, step.duration]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) return;
      if (event.key === 'ArrowRight') nextStep();
      if (event.key === 'ArrowLeft') previousStep();
      if (event.key === ' ') {
        event.preventDefault();
        setIsPlaying((current) => !current);
      }
      if (event.key === 'Escape') onComplete();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextStep, onComplete, previousStep]);

  const screenClassName = useMemo(
    () => `mhi-screen-content is-${step.id}`,
    [step.id]
  );

  const selectAnswer = (answer) => {
    setSignalAnswer(answer);
    setIsPlaying(false);
  };

  return (
    <section
      className={`mhi-root${step.revealHall ? ' is-hall-revealed' : ''}`}
      aria-label="Law of Mentalism initiation"
    >
      <div className="mhi-hall-camera" aria-hidden="true">
        <div className="mhi-hall-scene" />
        <div className="mhi-hall-vignette" />
      </div>

      <div className="mhi-screen" aria-live="polite" aria-atomic="true">
        <div className="mhi-screen-glass" aria-hidden="true" />
        <div key={step.id} className={screenClassName}>
          <p className="mhi-eyebrow">{step.eyebrow}</p>
          <h1>{step.title}</h1>
          {step.subtitle && <h2>{step.subtitle}</h2>}
          {step.body && <p className="mhi-body">{step.body}</p>}

          {step.meter && (
            <div className="mhi-sequence-meter" aria-label="Chroma Key sequencing progress">
              <span><i style={{ width: `${progress}%` }} /></span>
              <b>{Math.round(progress)}%</b>
            </div>
          )}

          {step.diagnostics && (
            <dl className="mhi-diagnostics">
              {step.diagnostics.map(([label, value], index) => (
                <div key={label} style={{ '--diagnostic-index': index }}>
                  <dt>{label}</dt><dd>{value}</dd>
                </div>
              ))}
            </dl>
          )}

          {step.interactive && (
            <div className="mhi-signal-options" role="group" aria-label="Belief authorship reflection">
              {['I inherited it', 'I absorbed it through repetition', 'I chose it consciously'].map((answer) => (
                <button
                  type="button"
                  key={answer}
                  className={signalAnswer === answer ? 'is-selected' : ''}
                  onClick={() => selectAnswer(answer)}
                >
                  {answer}
                </button>
              ))}
              {signalAnswer && <p>Signal recorded. Awareness begins when the source becomes visible.</p>}
            </div>
          )}

          {step.status && <p className="mhi-status">{step.status}</p>}
        </div>
      </div>

      <div className="mhi-step-meter" aria-label={`Transmission ${stepIndex + 1} of ${SEQUENCE_STEPS.length}`}>
        {SEQUENCE_STEPS.map((item, index) => (
          <button
            type="button"
            key={item.id}
            className={index === stepIndex ? 'is-current' : index < stepIndex ? 'is-complete' : ''}
            onClick={() => goToStep(index)}
            aria-label={`Open transmission ${index + 1}`}
            aria-current={index === stepIndex ? 'step' : undefined}
          />
        ))}
      </div>

      <footer className="mhi-controls">
        <button type="button" onClick={previousStep} disabled={stepIndex === 0}>
          <ChevronLeft size={17} /> Previous
        </button>
        <button
          type="button"
          className="mhi-play-control"
          onClick={() => setIsPlaying((current) => !current)}
          disabled={!canAutoAdvance}
        >
          {isPlaying ? <Pause size={17} /> : <Play size={17} />}
          {isPlaying ? 'Pause' : 'Resume'}
        </button>
        <label className="mhi-pace-control">
          <Gauge size={16} />
          <span>Pace</span>
          <select value={pace} onChange={(event) => setPace(Number(event.target.value))}>
            {PACE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </label>
        <button
          type="button"
          className="mhi-sound-control"
          onClick={() => setSoundEnabled((current) => !current)}
          aria-pressed={soundEnabled}
          title="Audio atmosphere is prepared for a future sound asset"
        >
          {soundEnabled ? <Volume2 size={17} /> : <VolumeX size={17} />}
          Sound {soundEnabled ? 'on' : 'off'}
        </button>
        <button
          type="button"
          className="mhi-next-control"
          onClick={nextStep}
          disabled={step.interactive && !signalAnswer}
        >
          {isLastStep ? 'Enter Module' : 'Continue'} <ChevronRight size={17} />
        </button>
      </footer>

      <button type="button" className="mhi-skip" onClick={onComplete}>
        Skip initiation
      </button>
      <button type="button" className="mhi-restart" onClick={() => goToStep(0)}>
        <RotateCcw size={14} /> Restart
      </button>
    </section>
  );
}
