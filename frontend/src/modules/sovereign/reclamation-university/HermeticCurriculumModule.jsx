import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  ChevronLeft,
  FileText,
  Library,
  ScrollText,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { COURSE_MODULES } from '../../../data/hermeticCourseData';
import {
  ARTIFACT_FIELDS,
  COHERENCE_QUESTIONS,
  LESSONS as VIBRATION_LESSONS,
  LIGHT_CODES,
  SHADOW_CODES,
  TRACKS,
} from '../../../data/hermeticVibrationModuleData';
import { useReclamationModuleProgress } from '../../../hooks/useReclamationModuleProgress';
import './hermeticCurriculumModule.css';

const EMPTY_RECORD = {
  completedLessons: [],
  reflections: {},
  artifact: {},
  answers: {},
};

const VIEW_LABELS = {
  orientation: 'Orientation',
  lessons: 'Lessons',
  lesson: 'Lesson Reader',
  caseFiles: 'Lyrical Case Files',
  codes: 'Shadow / Light Codes',
  artifact: 'Integration Artifact',
  assessment: 'Coherence Test',
};

const localRecordKey = (moduleId) => `ru_hermetic_curriculum_${moduleId}`;

function loadLocalRecord(moduleId) {
  try {
    return JSON.parse(window.localStorage.getItem(localRecordKey(moduleId))) || null;
  } catch {
    return null;
  }
}

function normalizeRecord(progress, fallback = null) {
  const saved = progress?.declaration_json?.curriculum;
  return {
    ...EMPTY_RECORD,
    ...(fallback || {}),
    ...(saved || {}),
    completedLessons: Array.isArray(saved?.completedLessons)
      ? saved.completedLessons
      : (fallback?.completedLessons || []),
    reflections: saved?.reflections || fallback?.reflections || {},
    artifact: saved?.artifact || fallback?.artifact || {},
    answers: saved?.answers || fallback?.answers || {},
  };
}

function SectionIcon({ type }) {
  if (type === 'warning') return <ShieldCheck size={15} />;
  if (type === 'activation' || type === 'exercise') return <Sparkles size={15} />;
  return <BookOpen size={15} />;
}

export default function HermeticCurriculumModule({ module, faculty }) {
  const navigate = useNavigate();
  const courseModule = useMemo(
    () => COURSE_MODULES.find((item) => item.number === module.order),
    [module.order]
  );
  const hasFullCurriculum = courseModule?.number === 3;
  const lessons = hasFullCurriculum ? VIBRATION_LESSONS : (courseModule?.lessons || []);
  const [view, setView] = useState('orientation');
  const [activeLessonId, setActiveLessonId] = useState(lessons[0]?.id || '');
  const [record, setRecord] = useState(() => normalizeRecord(null, loadLocalRecord(module.id)));
  const [saveState, setSaveState] = useState('idle');

  const { progress, isLoading, saveProgress } = useReclamationModuleProgress(
    module.id,
    faculty.slug,
    module.slug
  );

  useEffect(() => {
    if (!isLoading) setRecord(normalizeRecord(progress, loadLocalRecord(module.id)));
  }, [isLoading, module.id, progress]);

  useEffect(() => {
    setActiveLessonId(lessons[0]?.id || '');
    setView('orientation');
  }, [module.id, lessons]);

  const activeLesson = lessons.find((lesson) => lesson.id === activeLessonId) || lessons[0];
  const completionPercent = lessons.length
    ? Math.round((record.completedLessons.length / lessons.length) * 100)
    : 0;

  const persistRecord = async (nextRecord) => {
    setRecord(nextRecord);
    window.localStorage.setItem(localRecordKey(module.id), JSON.stringify(nextRecord));
    setSaveState('saving');
    const nextCompletionPercent = lessons.length
      ? Math.round((nextRecord.completedLessons.length / lessons.length) * 100)
      : 0;
    const result = await saveProgress({
      status: nextCompletionPercent === 100 ? 'completed' : 'in_progress',
      activeScene: 0,
      listenedTrackIds: nextRecord.completedLessons,
      declarationJson: { curriculum: nextRecord },
    });
    setSaveState(result?.error ? 'local' : 'saved');
    window.setTimeout(() => setSaveState('idle'), 1800);
  };

  const updateRecord = (patch) => persistRecord({ ...record, ...patch });

  const openLesson = (lessonId) => {
    setActiveLessonId(lessonId);
    setView('lesson');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const completeLesson = () => {
    if (record.completedLessons.includes(activeLesson.id)) return;
    updateRecord({ completedLessons: [...record.completedLessons, activeLesson.id] });
  };

  if (!courseModule) return null;

  const navItems = [
    ['orientation', 'Orientation'],
    ['lessons', 'Lessons'],
    ...(hasFullCurriculum ? [['caseFiles', 'Case Files'], ['codes', 'Codes']] : []),
    ['artifact', 'Artifact'],
    ...(hasFullCurriculum ? [['assessment', 'Assessment']] : []),
  ];

  return (
    <main className="hcm-root" style={{ '--hcm-accent': module.accent || '#c9a461' }}>
      <div className="hcm-atmosphere" aria-hidden="true" />

      <header className="hcm-topbar">
        <button
          type="button"
          className="hcm-back"
          onClick={() => navigate('/experiencemode/sovereign/reclamation-university')}
        >
          <ArrowLeft size={16} /> Hermetic Hall
        </button>
        <div className="hcm-brand">
          <span>Reclamation University</span>
          <strong>The Hermetic Matrix</strong>
        </div>
        <div className="hcm-module-mark">
          <span>Module {String(courseModule.number).padStart(2, '0')}</span>
          <strong>{module.title}</strong>
        </div>
        <div className="hcm-progress" aria-label={`${completionPercent}% complete`}>
          <span>{completionPercent}% complete</span>
          <i><b style={{ width: `${completionPercent}%` }} /></i>
        </div>
      </header>

      <nav className="hcm-nav" aria-label="Module curriculum sections">
        {navItems.map(([id, label]) => (
          <button
            type="button"
            key={id}
            className={view === id || (view === 'lesson' && id === 'lessons') ? 'is-active' : ''}
            onClick={() => setView(id)}
          >
            {label}
          </button>
        ))}
        <span className={`hcm-save-state is-${saveState}`} aria-live="polite">
          {saveState === 'saving' ? 'Saving…' : saveState === 'saved' ? 'Progress saved' : saveState === 'local' ? 'Saved in this session' : ''}
        </span>
      </nav>

      <div className="hcm-layout">
        <aside className="hcm-index">
          <p className="hcm-eyebrow">Lesson Index</p>
          <h2>{courseModule.title}</h2>
          <p>{courseModule.subtitle}</p>
          <ol>
            {lessons.map((lesson) => {
              const complete = record.completedLessons.includes(lesson.id);
              return (
                <li key={lesson.id}>
                  <button
                    type="button"
                    className={activeLessonId === lesson.id && view === 'lesson' ? 'is-active' : ''}
                    onClick={() => openLesson(lesson.id)}
                  >
                    <span>{complete ? <Check size={13} /> : lesson.number}</span>
                    <div><strong>{lesson.title}</strong><small>{lesson.subtitle || lesson.duration || 'Curriculum lesson'}</small></div>
                  </button>
                </li>
              );
            })}
          </ol>
        </aside>

        <section className="hcm-stage" aria-label={VIEW_LABELS[view]}>
          {view === 'orientation' && (
            <article className="hcm-orientation">
              <p className="hcm-eyebrow">The {courseModule.law} Chamber</p>
              <h1>{module.title}</h1>
              <blockquote>{courseModule.centralQuestion}</blockquote>
              <div className="hcm-meta-grid">
                <div><span>Discipline</span><strong>{courseModule.discipline}</strong></div>
                <div><span>Stage</span><strong>{courseModule.stage}</strong></div>
                <div><span>Application</span><strong>{courseModule.modernApplication}</strong></div>
                <div><span>Curriculum depth</span><strong>{hasFullCurriculum ? 'Full six-lesson transmission' : 'Authored lesson framework'}</strong></div>
              </div>
              <section className="hcm-doctrine">
                <ScrollText size={20} />
                <div><span>Modern outcome</span><p>{courseModule.modernOutcome}</p></div>
              </section>
              <div className="hcm-track-list">
                <span>Primary lyrical case: <strong>{courseModule.primaryTrack}</strong></span>
                {courseModule.supportingTracks.map((track) => <span key={track}>Supporting: <strong>{track}</strong></span>)}
              </div>
              <button type="button" className="hcm-primary" onClick={() => setView('lessons')}>
                Open Curriculum <ArrowRight size={16} />
              </button>
            </article>
          )}

          {view === 'lessons' && (
            <article className="hcm-lesson-catalog">
              <p className="hcm-eyebrow">Curriculum Sequence</p>
              <h1>{lessons.length} authored lessons</h1>
              <div className="hcm-lesson-grid">
                {lessons.map((lesson) => (
                  <button type="button" key={lesson.id} onClick={() => openLesson(lesson.id)}>
                    <span>{lesson.number}</span>
                    <h2>{lesson.title}</h2>
                    <p>{lesson.content?.intro || lesson.summary}</p>
                    <b>{record.completedLessons.includes(lesson.id) ? 'Completed' : 'Read lesson'} <ArrowRight size={13} /></b>
                  </button>
                ))}
              </div>
            </article>
          )}

          {view === 'lesson' && activeLesson && (
            <article className="hcm-reader">
              <header>
                <button type="button" onClick={() => setView('lessons')}><ChevronLeft size={15} /> All lessons</button>
                <span>{activeLesson.duration || `Lesson ${activeLesson.number}`}</span>
              </header>
              <p className="hcm-eyebrow">Lesson {activeLesson.number}</p>
              <h1>{activeLesson.title}</h1>
              {activeLesson.subtitle && <h2>{activeLesson.subtitle}</h2>}

              {hasFullCurriculum ? (
                <>
                  <p className="hcm-intro">{activeLesson.content.intro}</p>
                  {activeLesson.content.sections.map((section, index) => (
                    <section className={`hcm-content-block is-${section.type || 'doctrine'}`} key={`${section.heading}-${index}`}>
                      <div className="hcm-content-label"><SectionIcon type={section.type} /> {section.type || 'Doctrine'}</div>
                      <h3>{section.heading}</h3>
                      <p>{section.body}</p>
                      {section.bullets && <ul>{section.bullets.map((item) => <li key={item}>{item}</li>)}</ul>}
                      {section.numbered && <ol>{section.numbered.map((item) => <li key={item}>{item}</li>)}</ol>}
                      {section.callout && <blockquote>{section.callout}</blockquote>}
                    </section>
                  ))}
                </>
              ) : (
                <>
                  <p className="hcm-intro">{activeLesson.summary}</p>
                  <section className="hcm-content-block">
                    <div className="hcm-content-label"><Library size={15} /> Lesson architecture</div>
                    <h3>Core study points</h3>
                    <ul>{activeLesson.keyPoints.map((item) => <li key={item}>{item}</li>)}</ul>
                  </section>
                </>
              )}

              <section className="hcm-reflection">
                <label htmlFor={`reflection-${activeLesson.id}`}>
                  {activeLesson.content?.reflection?.prompt || 'Field notes and reflection'}
                </label>
                {activeLesson.content?.reflection?.questions?.map((question) => <p key={question}>{question}</p>)}
                <textarea
                  id={`reflection-${activeLesson.id}`}
                  value={record.reflections[activeLesson.id] || ''}
                  placeholder={activeLesson.content?.reflection?.placeholder || 'Record what this lesson reveals, challenges, or requires…'}
                  onChange={(event) => setRecord({
                    ...record,
                    reflections: { ...record.reflections, [activeLesson.id]: event.target.value },
                  })}
                  onBlur={() => persistRecord(record)}
                />
              </section>

              <footer className="hcm-reader-footer">
                <button type="button" className="hcm-secondary" onClick={() => persistRecord(record)}>
                  Save Reflection
                </button>
                <button type="button" className="hcm-primary" onClick={completeLesson}>
                  {record.completedLessons.includes(activeLesson.id) ? 'Lesson Completed' : 'Complete Lesson'} <Check size={15} />
                </button>
              </footer>
            </article>
          )}

          {view === 'caseFiles' && hasFullCurriculum && (
            <article className="hcm-library-view">
              <p className="hcm-eyebrow">Lyrical Case Files</p>
              <h1>Signal evidence and annotation</h1>
              {TRACKS.map((track) => (
                <section key={track.id}>
                  <header><span>{track.role}</span><h2>{track.title}</h2><p>{track.description}</p></header>
                  <div className="hcm-lyrics">
                    {track.lyrics.map((line) => (
                      <div key={line.id}><q>{line.text}</q>{line.annotation && <p>{line.annotation}</p>}</div>
                    ))}
                  </div>
                  <dl>
                    <div><dt>Hermetic mechanism</dt><dd>{track.hermeticMechanism}</dd></div>
                    <div><dt>Shadow expression</dt><dd>{track.shadowExpression}</dd></div>
                    <div><dt>Light expression</dt><dd>{track.lightExpression}</dd></div>
                  </dl>
                </section>
              ))}
            </article>
          )}

          {view === 'codes' && hasFullCurriculum && (
            <article className="hcm-library-view">
              <p className="hcm-eyebrow">Diagnostic Codex</p>
              <h1>Shadow and Light Codes</h1>
              <div className="hcm-code-columns">
                <section><h2>Shadow Codes</h2>{SHADOW_CODES.map((code) => <div key={code.code}><strong>{code.code}</strong><p>{code.description}</p></div>)}</section>
                <section><h2>Light Codes</h2>{LIGHT_CODES.map((code) => <div key={code.code}><strong>{code.code}</strong><p>{code.description}</p></div>)}</section>
              </div>
            </article>
          )}

          {view === 'artifact' && (
            <article className="hcm-artifact">
              <p className="hcm-eyebrow">Integration Artifact</p>
              <h1>{courseModule.integrationArtifactTitle}</h1>
              <p>Translate curriculum into a durable record. Your entries save through the live Reclamation University progress layer.</p>
              {(hasFullCurriculum ? ARTIFACT_FIELDS : courseModule.integrationArtifactInstructions.map((instruction, index) => ({
                id: `field-${index}`,
                label: `Artifact Field ${String(index + 1).padStart(2, '0')}`,
                prompt: instruction,
                placeholder: 'Write your response…',
                required: true,
              }))).map((field) => (
                <label key={field.id}>
                  <span>{field.label}{field.required && ' · Required'}</span>
                  <p>{field.prompt}</p>
                  <textarea
                    value={record.artifact[field.id] || ''}
                    placeholder={field.placeholder}
                    onChange={(event) => setRecord({
                      ...record,
                      artifact: { ...record.artifact, [field.id]: event.target.value },
                    })}
                    onBlur={() => persistRecord(record)}
                  />
                </label>
              ))}
              <button type="button" className="hcm-primary" onClick={() => persistRecord(record)}>
                Save Integration Artifact <FileText size={15} />
              </button>
            </article>
          )}

          {view === 'assessment' && hasFullCurriculum && (
            <article className="hcm-assessment">
              <p className="hcm-eyebrow">Coherence Test</p>
              <h1>Test signal comprehension</h1>
              {COHERENCE_QUESTIONS.map((question, questionIndex) => (
                <fieldset key={question.id}>
                  <legend><span>{String(questionIndex + 1).padStart(2, '0')}</span>{question.question}</legend>
                  {question.options.map((option, optionIndex) => (
                    <label key={option}>
                      <input
                        type="radio"
                        name={question.id}
                        checked={record.answers[question.id] === optionIndex}
                        onChange={() => updateRecord({ answers: { ...record.answers, [question.id]: optionIndex } })}
                      />
                      <span>{option}</span>
                    </label>
                  ))}
                  {record.answers[question.id] !== undefined && (
                    <p className={record.answers[question.id] === question.correctIndex ? 'is-correct' : 'is-review'}>
                      {record.answers[question.id] === question.correctIndex ? 'Correct. ' : 'Review this concept. '}
                      {question.explanation}
                    </p>
                  )}
                </fieldset>
              ))}
            </article>
          )}
        </section>

      </div>
    </main>
  );
}
