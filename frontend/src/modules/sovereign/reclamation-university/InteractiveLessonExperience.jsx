import { useEffect, useMemo, useState } from 'react';
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Eye,
  Layers3,
  LockKeyhole,
  Radio,
  RotateCcw,
} from 'lucide-react';
import './interactiveLessonExperience.css';

function Copy({ paragraphs = [] }) {
  return paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>);
}

export default function InteractiveLessonExperience({
  lesson,
  savedState = {},
  reflection = '',
  onStateChange,
  onReflectionChange,
  onSaveReflection,
  onComplete,
  isComplete,
}) {
  const screens = lesson.experience?.screens || [];
  const [screenIndex, setScreenIndex] = useState(savedState.screenIndex || 0);
  const [responses, setResponses] = useState(savedState.responses || {});
  const screen = screens[screenIndex];
  const isLast = screenIndex === screens.length - 1;

  useEffect(() => {
    setScreenIndex(savedState.screenIndex || 0);
    setResponses(savedState.responses || {});
  }, [lesson.id]);

  const saveState = (nextIndex, nextResponses = responses) => {
    setScreenIndex(nextIndex);
    setResponses(nextResponses);
    onStateChange({ screenIndex: nextIndex, responses: nextResponses });
  };

  const setResponse = (value) => {
    const nextResponses = { ...responses, [screen.id]: value };
    setResponses(nextResponses);
    onStateChange({ screenIndex, responses: nextResponses });
  };

  const selectedChoice = screen?.kind === 'choice'
    ? screen.options?.find((option) => option.id === responses[screen.id])
    : null;
  const classificationResponses = screen?.kind === 'classification'
    ? (responses[screen.id] || {})
    : {};

  const canContinue = useMemo(() => {
    if (!screen) return false;
    if (screen.kind === 'choice') return Boolean(responses[screen.id]);
    if (screen.kind === 'pipeline') return Boolean(responses[screen.id]);
    if (screen.kind === 'classification') {
      return screen.items.every((item) => classificationResponses[item.id]);
    }
    if (screen.kind === 'reflection') return reflection.trim().length >= 20;
    return true;
  }, [classificationResponses, reflection, responses, screen]);

  const goTo = (nextIndex) => {
    const bounded = Math.max(0, Math.min(screens.length - 1, nextIndex));
    saveState(bounded);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!screen) return null;

  return (
    <article className={`ile-root is-${screen.kind}`}>
      <header className="ile-header">
        <button type="button" onClick={() => goTo(screenIndex - 1)} disabled={screenIndex === 0}>
          <ChevronLeft size={15} /> Previous
        </button>
        <div>
          <span>Lesson {lesson.number}</span>
          <strong>{lesson.title}</strong>
        </div>
        <span>{String(screenIndex + 1).padStart(2, '0')} / {String(screens.length).padStart(2, '0')}</span>
      </header>

      <div className="ile-progress" aria-label={`${Math.round(((screenIndex + 1) / screens.length) * 100)}% through lesson`}>
        <i style={{ width: `${((screenIndex + 1) / screens.length) * 100}%` }} />
      </div>

      <section key={screen.id} className="ile-screen">
        <p className="ile-label"><Radio size={14} /> {screen.label}</p>
        <h1>{screen.title}</h1>
        <div className="ile-copy"><Copy paragraphs={screen.copy} /></div>

        {screen.callout && <blockquote className="ile-callout">{screen.callout}</blockquote>}

        {screen.kind === 'choice' && (
          <div className="ile-choice">
            {screen.prompt && <p>{screen.prompt}</p>}
            <div>
              {screen.options.map((option) => (
                <button
                  type="button"
                  key={option.id}
                  className={responses[screen.id] === option.id ? 'is-selected' : ''}
                  onClick={() => setResponse(option.id)}
                >
                  <span>{responses[screen.id] === option.id ? <Check size={15} /> : null}</span>
                  {option.label}
                </button>
              ))}
            </div>
            {selectedChoice && <aside><Eye size={17} /><p>{selectedChoice.feedback}</p></aside>}
          </div>
        )}

        {screen.kind === 'pipeline' && (
          <div className="ile-pipeline">
            <div>
              {screen.nodes.map((node, index) => (
                <button
                  type="button"
                  key={node.id}
                  className={responses[screen.id] === node.id ? 'is-selected' : ''}
                  onClick={() => setResponse(node.id)}
                >
                  <small>{String(index + 1).padStart(2, '0')}</small>
                  <strong>{node.label}</strong>
                  {index < screen.nodes.length - 1 && <ChevronRight size={15} />}
                </button>
              ))}
            </div>
            {responses[screen.id] && (
              <aside>
                <Layers3 size={20} />
                <div>
                  <strong>{screen.nodes.find((node) => node.id === responses[screen.id])?.label}</strong>
                  <p>{screen.nodes.find((node) => node.id === responses[screen.id])?.detail}</p>
                </div>
              </aside>
            )}
          </div>
        )}

        {screen.kind === 'comparison' && (
          <div className="ile-comparison">
            <p><span>Same event</span>{screen.event}</p>
            <div>
              {screen.paths.map((path) => (
                <section key={path.id}>
                  <small>{path.title}</small>
                  <q>{path.thought}</q>
                  <p>{path.result}</p>
                </section>
              ))}
            </div>
          </div>
        )}

        {screen.kind === 'classification' && (
          <div className="ile-classification">
            {screen.items.map((item) => {
              const selected = classificationResponses[item.id];
              const correct = selected === item.answer;
              return (
                <section key={item.id} className={selected ? (correct ? 'is-correct' : 'is-review') : ''}>
                  <p>{item.text}</p>
                  <div>
                    {screen.categories.map((category) => (
                      <button
                        type="button"
                        key={category}
                        className={selected === category ? 'is-selected' : ''}
                        onClick={() => setResponse({ ...classificationResponses, [item.id]: category })}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                  {selected && <small>{correct ? 'Signal identified' : `Review: this is ${item.answer.toLowerCase()}`}</small>}
                </section>
              );
            })}
          </div>
        )}

        {screen.kind === 'album' && (
          <div className="ile-album">
            <nav aria-label="Reclamation track cases">
              {screen.tracks.map((track) => (
                <button
                  type="button"
                  key={track.id}
                  className={responses[screen.id] === track.id ? 'is-selected' : ''}
                  onClick={() => setResponse(track.id)}
                >
                  <small>{track.role}</small><strong>{track.title}</strong>
                </button>
              ))}
            </nav>
            {responses[screen.id] ? (
              <section>
                <h2>{screen.tracks.find((track) => track.id === responses[screen.id])?.title}</h2>
                <p>{screen.tracks.find((track) => track.id === responses[screen.id])?.teaching}</p>
                <blockquote>{screen.tracks.find((track) => track.id === responses[screen.id])?.question}</blockquote>
              </section>
            ) : (
              <p className="ile-album-prompt">Select a track to open its Mentalism case file.</p>
            )}
          </div>
        )}

        {screen.kind === 'mechanism' && (
          <ol className="ile-mechanism">
            {screen.steps.map((step) => (
              <li key={step.number}>
                <span>{step.number}</span>
                <div><strong>{step.title}</strong><p>{step.detail}</p></div>
              </li>
            ))}
          </ol>
        )}

        {screen.kind === 'reflection' && (
          <label className="ile-reflection">
            <span>{screen.prompt}</span>
            <textarea
              value={reflection}
              placeholder={screen.placeholder}
              onChange={(event) => onReflectionChange(event.target.value)}
              onBlur={onSaveReflection}
            />
            <small>{reflection.trim().length < 20 ? 'Write at least one complete thought to continue.' : 'Signal captured. You may continue.'}</small>
          </label>
        )}

        {screen.lock && <blockquote className="ile-knowledge-lock"><LockKeyhole size={18} />{screen.lock}</blockquote>}
      </section>

      <footer className="ile-footer">
        <button type="button" className="ile-restart" onClick={() => saveState(0, {})}>
          <RotateCcw size={14} /> Restart lesson
        </button>
        <button
          type="button"
          className="hcm-primary"
          disabled={!canContinue}
          onClick={() => {
            if (isLast) {
              onSaveReflection();
              onComplete();
            } else {
              goTo(screenIndex + 1);
            }
          }}
        >
          {isLast ? (isComplete ? 'Lesson Completed' : 'Lock Lesson') : 'Continue'}
          {isLast ? <Check size={15} /> : <ChevronRight size={15} />}
        </button>
      </footer>
    </article>
  );
}
