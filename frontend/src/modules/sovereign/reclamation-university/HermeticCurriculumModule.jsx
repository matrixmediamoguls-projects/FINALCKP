import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Activity,
  ArrowRight,
  BookOpen,
  Check,
  ChevronLeft,
  ChevronRight,
  FileText,
  Home,
  Library,
  PenLine,
  Radio,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { COURSE_MODULES } from "../../../data/hermeticCourseData";
import {
  ARTIFACT_FIELDS,
  COHERENCE_QUESTIONS,
  LESSONS as VIBRATION_LESSONS,
  LIGHT_CODES,
  SHADOW_CODES,
  TRACKS,
} from "../../../data/hermeticVibrationModuleData";
import { useReclamationModuleProgress } from "../../../hooks/useReclamationModuleProgress";
import {
  getCurriculumAdvanceLabel,
  getNextCurriculumDestination,
} from "./hermeticCurriculumNavigation";
import { buildHermeticLessonContent } from "./hermeticLessonContent";
import {
  buildLessonJourneyTabs,
  getEmptyJourneyTabCopy,
} from "./hermeticJourneyTabs";
import ReclamationLessonMedia from "./ReclamationLessonMedia";
import "./hermeticCurriculumModule.css";
import "./hermeticJourneyTabs.css";

const EMPTY_RECORD = {
  completedLessons: [],
  reflections: {},
  artifact: {},
  answers: {},
};
const VIEW_LABELS = {
  orientation: "Orientation",
  lessons: "Lessons",
  lesson: "Lesson Reader",
  caseFiles: "Lyrical Case Files",
  codes: "Shadow / Light Codes",
  artifact: "Integration Artifact",
  assessment: "Coherence Test",
};
const LAW_ACCENTS = [
  "#d7a64a",
  "#ff268f",
  "#e0643d",
  "#39c6ba",
  "#8ebf67",
  "#7ea6ff",
  "#d68cff",
];

const MENTALISM_OBJECTIVES = [
  "Articulate the Principle of Mentalism as a first cause: “The ALL is Mind; the universe is mental,” and distinguish events from interpretations.",
  "Recognize hidden influences shaping perception, including conditioning, media environments, and digital systems.",
  "Identify inherited beliefs and thought forms that operate as unconscious code in daily decisions.",
  "Understand how repeated thinking, emotional memory, and reinforcement crystallize into stable thought forms and identity patterns.",
  "Evaluate the role of tools, technology, and language as extensions of prior vision instead of autonomous authors.",
  "Begin reclaiming authorship through reflection, protocol exercises, and a structured thirty day plan.",
];

const MENTALISM_PAGE_QUESTIONS = [
  "What is this?",
  "Why does it matter?",
  "Where do I already see this?",
  "How does it actually work?",
  "How does this connect to the Reclamation album?",
  "How can I apply it?",
  "What should I observe after finishing this page?",
];

const localRecordKey = (moduleId) => `ru_hermetic_curriculum_${moduleId}`;

function loadLocalRecord(moduleId) {
  try {
    return (
      JSON.parse(window.localStorage.getItem(localRecordKey(moduleId))) || null
    );
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
      : fallback?.completedLessons || [],
    reflections: saved?.reflections || fallback?.reflections || {},
    artifact: saved?.artifact || fallback?.artifact || {},
    answers: saved?.answers || fallback?.answers || {},
  };
}

function SectionIcon({ type }) {
  if (type === "warning") return <ShieldCheck size={15} />;
  if (type === "activation" || type === "exercise")
    return <Sparkles size={15} />;
  return <BookOpen size={15} />;
}

function LessonSectionBody({ body }) {
  const passages = String(body || "")
    .split(/\n{2,}/)
    .map((passage) => passage.trim())
    .filter(Boolean);

  return (
    <div className="hcm-prose">
      {passages.map((passage, index) => {
        const lines = passage.split("\n").map((line) => line.trim()).filter(Boolean);
        const isSequence = passage.includes("→") && lines.length === 1;
        const isQuote =
          lines.length === 1 &&
          (/^["“]/.test(passage) || /["”]$/.test(passage));
        const isList = lines.length >= 3;
        const isBeat = lines.length === 1 && passage.length <= 72;

        if (isSequence) {
          return (
            <div className="hcm-flow-sequence" key={`${passage}-${index}`}>
              {passage.split("→").map((step, stepIndex, steps) => (
                <span key={`${step}-${stepIndex}`}>
                  <b>{step.trim()}</b>
                  {stepIndex < steps.length - 1 && <ArrowRight size={14} />}
                </span>
              ))}
            </div>
          );
        }

        if (isQuote) {
          return <blockquote key={`${passage}-${index}`}>{passage}</blockquote>;
        }

        if (isList) {
          return (
            <ul className="hcm-observation-list" key={`${passage}-${index}`}>
              {lines.map((line, lineIndex) => (
                <li key={`${line}-${lineIndex}`}>{line}</li>
              ))}
            </ul>
          );
        }

        return (
          <p
            className={isBeat ? "hcm-prose-beat" : undefined}
            key={`${passage}-${index}`}
          >
            {passage}
          </p>
        );
      })}
    </div>
  );
}

function ChamberFieldLab({
  lesson,
  section,
  questions,
  values,
  saveState,
  onChange,
  onSave,
}) {
  const prompts = (questions?.length ? questions : lesson.keyPoints || [])
    .slice(0, 4);
  const responses = prompts.map((_, index) => values?.[index]?.trim()).filter(Boolean);
  const synthesis = responses.length
    ? responses.join(" · ")
    : "Your observations will assemble here as you work.";

  return (
    <div className="hcm-field-lab">
      <header>
        <div>
          <span><PenLine size={14} /> Field instrument</span>
          <h4>{section.heading} Ledger</h4>
        </div>
        <b>{lesson.number}</b>
      </header>
      <p>
        Work directly with the principle. Your responses remain attached to this
        lesson and can be revised as the pattern becomes clearer.
      </p>
      <div className="hcm-field-lab__grid">
        {prompts.map((prompt, index) => (
          <label key={prompt}>
            <span>{String(index + 1).padStart(2, "0")} · {prompt}</span>
            <input
              type="text"
              value={values?.[index] || ""}
              placeholder="Enter a specific observation…"
              onChange={(event) => onChange(index, event.target.value)}
            />
          </label>
        ))}
      </div>
      <div className="hcm-live-synthesis" aria-live="polite">
        <span>Live synthesis</span>
        <p>{synthesis}</p>
      </div>
      <footer>
        <small>
          {saveState === "saved"
            ? `Chamber ${lesson.number} · Ledger entry saved`
            : "Stored with your Reclamation University progress"}
        </small>
        <button
          type="button"
          className={saveState === "saved" ? "is-saved" : ""}
          onClick={onSave}
        >
          {saveState === "saved" ? "Recorded" : "Record in field ledger"}
          {saveState === "saved" ? <Check size={15} /> : <FileText size={15} />}
        </button>
      </footer>
    </div>
  );
}

function MentalismOrientation({ onContinue }) {
  return (
    <article className="hcm-orientation hcm-mentalism-intro">
      <section className="hcm-law-hero">
        <div className="hcm-law-hero__copy">
          <p className="hcm-eyebrow">Module I · The Hermetic Hall</p>
          <h1>Mentalism: Before the Body, The ALL Mind</h1>
        </div>
        <div className="hcm-resonance-visual" aria-hidden="true">
          <img
            src="/reclamation-university/hermetic-resonance-field.png"
            alt=""
          />
          <strong>01</strong>
        </div>
      </section>

      <section className="hcm-content-block is-doctrine">
        <div className="hcm-content-label">
          <BookOpen size={15} /> Module Overview
        </div>
        <p>
          Module I, “Mentalism: Before the Body, The ALL Mind,” is the opening
          architecture of Reclamation University and the first act in the
          Mentalism sequence. It moves the student from passive understanding of
          “mind” as an abstract concept into conscious reclamation of authorship
          over perception, interpretation, and identity. The module treats the
          mind not as a brain bound organ but as a medium, a field, and a
          primary creative interface through which all experience is interpreted
          before it becomes behavior.
        </p>
        <p>
          Across six lessons and a capstone audit, students travel from
          invisible influence to intentional authorship. Each lesson integrates
          hermetic philosophy, the Principle of Mentalism, modern information
          environments including algorithms, AI, and social media, and case
          studies from the Reclamation album to demonstrate how thought forms
          precede worlds, how inherited code writes lives, and how language and
          tools extend, rather than originate, vision.
        </p>
      </section>

      <section className="hcm-content-block is-activation">
        <div className="hcm-content-label">
          <Sparkles size={15} /> Educational Objectives
        </div>
        <h2>By the end of this module, students should be able to:</h2>
        <ul>
          {MENTALISM_OBJECTIVES.map((objective) => (
            <li key={objective}>{objective}</li>
          ))}
        </ul>
      </section>

      <section className="hcm-content-block is-exercise">
        <div className="hcm-content-label">
          <ShieldCheck size={15} /> Page Standard
        </div>
        <h2>
          Every page of the module is designed to answer at least one of the
          following:
        </h2>
        <ul>
          {MENTALISM_PAGE_QUESTIONS.map((question) => (
            <li key={question}>{question}</li>
          ))}
        </ul>
      </section>

      <button type="button" className="hcm-primary" onClick={onContinue}>
        Open Curriculum <ArrowRight size={16} />
      </button>
    </article>
  );
}

export default function HermeticCurriculumModule({ module, faculty }) {
  const navigate = useNavigate();
  const courseModule = useMemo(
    () => COURSE_MODULES.find((item) => item.number === module.order),
    [module.order],
  );
  const hasFullCurriculum = courseModule?.number === 3;
  const lessons = hasFullCurriculum
    ? VIBRATION_LESSONS
    : courseModule?.lessons || [];
  const [view, setView] = useState("orientation");
  const [activeLessonId, setActiveLessonId] = useState(lessons[0]?.id || "");
  const [activeSectionIndex, setActiveSectionIndex] = useState(0);
  const [chamberMode, setChamberMode] = useState("study");
  const [record, setRecord] = useState(() =>
    normalizeRecord(null, loadLocalRecord(module.id)),
  );
  const [saveState, setSaveState] = useState("idle");
  const { progress, isLoading, saveProgress } = useReclamationModuleProgress(
    module.id,
    faculty.slug,
    module.slug,
  );

  useEffect(() => {
    if (!isLoading)
      setRecord(normalizeRecord(progress, loadLocalRecord(module.id)));
  }, [isLoading, module.id, progress]);

  useEffect(() => {
    setActiveLessonId(lessons[0]?.id || "");
    setActiveSectionIndex(0);
    setView("orientation");
  }, [module.id, lessons]);

  const activeLesson =
    lessons.find((lesson) => lesson.id === activeLessonId) || lessons[0];
  const activeLessonIndex = lessons.findIndex(
    (lesson) => lesson.id === activeLesson?.id,
  );
  const activeLessonContent =
    activeLesson?.content ||
    buildHermeticLessonContent({
      lesson: activeLesson,
      lessonIndex: Math.max(activeLessonIndex, 0),
      lessonCount: lessons.length,
      curriculumSections: module.curriculumSections,
    });
  const completionPercent = lessons.length
    ? Math.round((record.completedLessons.length / lessons.length) * 100)
    : 0;
  const lessonSections = buildLessonJourneyTabs({
    content: activeLessonContent,
    lesson: activeLesson,
  });
  const activeSection = lessonSections[activeSectionIndex];
  const sectionPercent = lessonSections.length
    ? Math.round(((activeSectionIndex + 1) / lessonSections.length) * 100)
    : 100;
  const hallModules = faculty.modules || [];
  const relatedLaws = hallModules
    .filter((item) => item.order !== module.order)
    .slice(0, 3);

  const persistRecord = async (nextRecord) => {
    setRecord(nextRecord);
    window.localStorage.setItem(
      localRecordKey(module.id),
      JSON.stringify(nextRecord),
    );
    setSaveState("saving");
    const nextCompletionPercent = lessons.length
      ? Math.round((nextRecord.completedLessons.length / lessons.length) * 100)
      : 0;
    const result = await saveProgress({
      status: nextCompletionPercent === 100 ? "completed" : "in_progress",
      activeScene: 0,
      listenedTrackIds: nextRecord.completedLessons,
      declarationJson: { curriculum: nextRecord },
    });
    setSaveState(result?.error ? "local" : "saved");
    window.setTimeout(() => setSaveState("idle"), 1800);
  };

  const updateRecord = (patch) => persistRecord({ ...record, ...patch });
  const openLesson = (lessonId) => {
    setActiveLessonId(lessonId);
    setActiveSectionIndex(0);
    setChamberMode("study");
    setView("lesson");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const openSection = (sectionIndex) => {
    setActiveSectionIndex(sectionIndex);
    setChamberMode("study");
    document
      .querySelector(".hcm-guided-reader")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  useEffect(() => {
    if (view !== "lesson" || !lessonSections.length) return undefined;

    const navigateSections = (event) => {
      const element = event.target;
      if (
        element instanceof HTMLInputElement ||
        element instanceof HTMLTextAreaElement ||
        element instanceof HTMLSelectElement
      ) {
        return;
      }

      if (event.key === "ArrowRight" && activeSectionIndex < lessonSections.length - 1) {
        openSection(activeSectionIndex + 1);
      }
      if (event.key === "ArrowLeft" && activeSectionIndex > 0) {
        openSection(activeSectionIndex - 1);
      }
    };

    window.addEventListener("keydown", navigateSections);
    return () => window.removeEventListener("keydown", navigateSections);
  }, [activeSectionIndex, lessonSections.length, view]);
  const completeLesson = () => {
    if (!record.completedLessons.includes(activeLesson.id)) {
      updateRecord({
        completedLessons: [...record.completedLessons, activeLesson.id],
      });
    }
  };
  const activeLedgerValues = activeLesson
    ? record.answers?.[activeLesson.id]?.fieldLab || []
    : [];
  const updateFieldLab = (fieldIndex, value) => {
    const nextValues = [...activeLedgerValues];
    nextValues[fieldIndex] = value;
    setRecord({
      ...record,
      answers: {
        ...record.answers,
        [activeLesson.id]: {
          ...(record.answers?.[activeLesson.id] || {}),
          fieldLab: nextValues,
        },
      },
    });
  };
  const saveFieldLab = () => persistRecord(record);
  const nextDestination = activeLesson
    ? getNextCurriculumDestination({
        lessons,
        activeLessonId: activeLesson.id,
        hallModules,
        moduleOrder: module.order,
      })
    : { type: "hall" };
  const openNextLesson = () => {
    if (nextDestination.type === "lesson")
      return openLesson(nextDestination.lessonId);
    if (nextDestination.type === "module")
      return navigate(
        `/experiencemode/sovereign/reclamation-university/hermetic-hall/${nextDestination.slug}`,
      );
    navigate("/experiencemode/sovereign/reclamation-university");
  };

  if (!courseModule) return null;

  const navItems = [
    ["orientation", "Orientation"],
    ["lessons", "Lessons"],
    ...(hasFullCurriculum
      ? [
          ["caseFiles", "Case Files"],
          ["codes", "Codes"],
        ]
      : []),
    ["artifact", "Artifact"],
    ...(hasFullCurriculum ? [["assessment", "Assessment"]] : []),
  ];

  return (
    <main
      className="hcm-root"
      style={{ "--hcm-accent": module.accent || "#c9a461" }}
    >
      <div className="hcm-atmosphere" aria-hidden="true" />
      <header className="hcm-topbar">
        <div className="hcm-brand">
          <span className="hcm-brand-mark">
            <Library size={22} />
          </span>
          <strong>
            Reclamation
            <br />
            University
          </strong>
        </div>
        <div className="hcm-breadcrumbs">
          <button
            type="button"
            onClick={() =>
              navigate("/experiencemode/sovereign/reclamation-university")
            }
          >
            University Hall
          </button>
          <ChevronRight size={13} />
          <button
            type="button"
            onClick={() =>
              navigate("/experiencemode/sovereign/reclamation-university")
            }
          >
            The Hermetic Hall
          </button>
          <ChevronRight size={13} />
          <strong>{module.title}</strong>
        </div>
        <div
          className="hcm-progress"
          aria-label={`${completionPercent}% complete`}
        >
          <span>Your progress</span>
          <strong>{completionPercent}% complete</strong>
          <i>
            <b style={{ width: `${completionPercent}%` }} />
          </i>
        </div>
        <div className="hcm-seal">
          <Sparkles size={20} />
        </div>
      </header>

      <nav className="hcm-nav" aria-label="Module curriculum sections">
        {navItems.map(([id, label]) => (
          <button
            type="button"
            key={id}
            className={
              view === id || (view === "lesson" && id === "lessons")
                ? "is-active"
                : ""
            }
            onClick={() => setView(id)}
          >
            {label}
          </button>
        ))}
        <span className={`hcm-save-state is-${saveState}`} aria-live="polite">
          {saveState === "saving"
            ? "Saving…"
            : saveState === "saved"
              ? "Progress saved"
              : saveState === "local"
                ? "Saved in this session"
                : ""}
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
                    className={
                      activeLessonId === lesson.id && view === "lesson"
                        ? "is-active"
                        : ""
                    }
                    onClick={() => openLesson(lesson.id)}
                  >
                    <span>
                      {complete ? <Check size={13} /> : lesson.number}
                    </span>
                    <div>
                      <strong>{lesson.title}</strong>
                      <small>
                        {lesson.subtitle ||
                          lesson.duration ||
                          "Curriculum lesson"}
                      </small>
                    </div>
                  </button>
                </li>
              );
            })}
          </ol>
        </aside>

        <section className="hcm-stage" aria-label={VIEW_LABELS[view]}>
          {view === "orientation" &&
            (courseModule.number === 1 ? (
              <MentalismOrientation onContinue={() => setView("lessons")} />
            ) : (
              <article className="hcm-orientation">
                <p className="hcm-eyebrow">The Hermetic Hall</p>
                <h1>{module.title}</h1>
                <blockquote>{courseModule.centralQuestion}</blockquote>
                <section className="hcm-doctrine">
                  <Sparkles size={20} />
                  <div>
                    <span>Modern outcome</span>
                    <p>{courseModule.modernOutcome}</p>
                  </div>
                </section>
                <button
                  type="button"
                  className="hcm-primary"
                  onClick={() => setView("lessons")}
                >
                  Open Curriculum <ArrowRight size={16} />
                </button>
              </article>
            ))}

          {view === "lessons" && (
            <article className="hcm-lesson-catalog">
              <p className="hcm-eyebrow">Curriculum Sequence</p>
              <h1>{lessons.length} authored lessons</h1>
              <div className="hcm-lesson-grid">
                {lessons.map((lesson) => (
                  <button
                    type="button"
                    key={lesson.id}
                    onClick={() => openLesson(lesson.id)}
                  >
                    <span>{lesson.number}</span>
                    <h2>{lesson.title}</h2>
                    <p>{lesson.content?.intro || lesson.summary}</p>
                    <b>
                      {record.completedLessons.includes(lesson.id)
                        ? "Completed"
                        : "Read lesson"}{" "}
                      <ArrowRight size={13} />
                    </b>
                  </button>
                ))}
              </div>
            </article>
          )}

          {view === "lesson" && activeLesson && (
            <article
              className={`hcm-reader hcm-section-${activeSectionIndex}`}
              style={{
                "--hcm-law-accent":
                  LAW_ACCENTS[(module.order - 1) % LAW_ACCENTS.length],
              }}
            >
              <header>
                <button type="button" onClick={() => setView("lessons")}>
                  <ChevronLeft size={15} /> All lessons
                </button>
                <span>
                  {activeLesson.duration || `Lesson ${activeLesson.number}`}
                </span>
              </header>
              <div className="hcm-lesson-hero">
                <div>
                  <p className="hcm-eyebrow">Lesson {activeLesson.number}</p>
                  <h1>{activeLesson.title}</h1>
                  {activeLesson.subtitle && <h2>{activeLesson.subtitle}</h2>}
                </div>
                <div className="hcm-lesson-sigil" aria-hidden="true">
                  <span>{activeLesson.number}</span>
                  <i />
                  <b>{String(sectionPercent).padStart(2, "0")}%</b>
                </div>
              </div>
              {activeLessonContent?.intro && (
                <aside className="hcm-central-question">
                  <span>Central question</span>
                  <p>{activeLessonContent.intro}</p>
                </aside>
              )}
              {lessonSections.length > 0 && (
                <div className="hcm-guided-reader">
                  <div className="hcm-section-progress">
                    <div>
                      <span>Journey map</span>
                      <strong>
                        Tab {activeSectionIndex + 1} of {lessonSections.length}
                      </strong>
                    </div>
                    <i>
                      <b style={{ width: `${sectionPercent}%` }} />
                    </i>
                  </div>
                  <nav
                    className="hcm-section-steps"
                    aria-label="Lesson sections"
                  >
                    {lessonSections.map((section, index) => (
                      <button
                        type="button"
                        key={`${section.heading}-${index}`}
                        className={index === activeSectionIndex ? "is-active" : ""}
                        onClick={() => openSection(index)}
                        aria-label={`Open tab ${index + 1}: ${section.heading}`}
                        aria-current={index === activeSectionIndex ? "step" : undefined}
                      >
                        <span>{String(index + 1).padStart(2, "0")}</span>
                        <strong>{section.heading}</strong>
                      </button>
                    ))}
                  </nav>
                </div>
              )}
              {activeLessonContent ? (
                <>
                  {activeSection && (
                    <section
                      className={`hcm-content-block hcm-active-section is-${activeSection.type || "doctrine"}`}
                      aria-live="polite"
                    >
                      <div className="hcm-section-stage">
                        <div className="hcm-content-label">
                          <SectionIcon type={activeSection.type} />{" "}
                          {activeSection.type || "Doctrine"}
                        </div>
                        <span>
                          {String(activeSectionIndex + 1).padStart(2, "0")}
                        </span>
                      </div>
                      <h3>{activeSection.heading}</h3>
                      {activeSection.heading === "Protocol" && (
                        <div
                          className="hcm-mode-switch"
                          role="tablist"
                          aria-label="Chamber mode"
                        >
                          <button
                            type="button"
                            role="tab"
                            aria-selected={chamberMode === "study"}
                            className={chamberMode === "study" ? "is-active" : ""}
                            onClick={() => setChamberMode("study")}
                          >
                            Study the protocol
                          </button>
                          <button
                            type="button"
                            role="tab"
                            aria-selected={chamberMode === "practice"}
                            className={chamberMode === "practice" ? "is-active" : ""}
                            onClick={() => setChamberMode("practice")}
                          >
                            Enter practice mode
                          </button>
                        </div>
                      )}
                      {chamberMode === "study" ||
                      activeSection.heading !== "Protocol" ? (
                        <>
                          {activeSection.items.length ? (
                            <div className="hcm-journey-subsections">
                              {activeSection.items.map((journeySection, itemIndex) => (
                                <section
                                  className="hcm-journey-subsection"
                                  key={`${journeySection.heading}-${itemIndex}`}
                                >
                                  <h4>{journeySection.heading}</h4>
                                  <LessonSectionBody body={journeySection.body} />
                                  {journeySection.bullets && (
                                    <ul>
                                      {journeySection.bullets.map((item) => (
                                        <li key={item}>{item}</li>
                                      ))}
                                    </ul>
                                  )}
                                  {journeySection.numbered && (
                                    <ol>
                                      {journeySection.numbered.map((item) => (
                                        <li key={item}>{item}</li>
                                      ))}
                                    </ol>
                                  )}
                                  {journeySection.callout && (
                                    <blockquote>{journeySection.callout}</blockquote>
                                  )}
                                </section>
                              ))}
                            </div>
                          ) : (
                            <p className="hcm-empty-tab">
                              {getEmptyJourneyTabCopy(activeSection.heading, activeLesson)}
                            </p>
                          )}
                          {/reclamation lens/i.test(activeSection.heading) && (
                            <ReclamationLessonMedia
                              lesson={activeLesson}
                              contextBody={activeSection.body}
                              fallbackTitles={[
                                courseModule.primaryTrack,
                                ...(courseModule.supportingTracks || []),
                                ...(module.sourceTrackIds || []),
                              ].filter(Boolean)}
                              referenceAnnotations={module.lyricAnchors || []}
                            />
                          )}
                          {activeSection.heading === "Artifact" && (
                            <section className="hcm-lesson-artifact">
                              <span>Carry Forward</span>
                              <h4>Your usable takeaway</h4>
                              <p>
                                Preserve the insight, practice, or decision from this
                                lesson that you want available beyond this screen.
                              </p>
                              <textarea
                                value={
                                  record.artifact[`lesson-${activeLesson.id}`] || ""
                                }
                                placeholder="What are you carrying forward, and how will you use it?"
                                onChange={(event) =>
                                  setRecord({
                                    ...record,
                                    artifact: {
                                      ...record.artifact,
                                      [`lesson-${activeLesson.id}`]:
                                        event.target.value,
                                    },
                                  })
                                }
                                onBlur={() => persistRecord(record)}
                              />
                            </section>
                          )}
                        </>
                      ) : (
                        <ChamberFieldLab
                          lesson={activeLesson}
                          section={activeSection}
                          questions={activeLessonContent.reflection?.questions}
                          values={activeLedgerValues}
                          saveState={saveState}
                          onChange={updateFieldLab}
                          onSave={saveFieldLab}
                        />
                      )}
                      <div className="hcm-section-coda" aria-hidden="true">
                        <i />
                        <span>Continue the inquiry</span>
                      </div>
                    </section>
                  )}
                  <div className="hcm-section-controls">
                    <button type="button" className="hcm-secondary" disabled={activeSectionIndex === 0} onClick={() => openSection(activeSectionIndex - 1)}>
                      <ChevronLeft size={15} /> Previous
                    </button>
                    {activeSectionIndex < lessonSections.length - 1 ? (
                      <button type="button" className="hcm-primary" onClick={() => openSection(activeSectionIndex + 1)}>
                        Enter next chamber <ArrowRight size={15} />
                      </button>
                    ) : (
                      <span><Check size={15} /> Teaching complete — integrate below</span>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <p className="hcm-intro">{activeLesson.summary}</p>
                  <section className="hcm-content-block">
                    <div className="hcm-content-label">
                      <Library size={15} /> Lesson architecture
                    </div>
                    <h3>Core study points</h3>
                    <ul>
                      {activeLesson.keyPoints.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </section>
                </>
              )}
              {activeSection?.heading === "Reflect" && (
              <section className="hcm-reflection">
                <div className="hcm-reflection-mark" aria-hidden="true">
                  <PenLine size={24} />
                </div>
                <label htmlFor={`reflection-${activeLesson.id}`}>
                  {activeLessonContent?.reflection?.prompt ||
                    "Field notes and reflection"}
                </label>
                {activeLessonContent?.reflection?.questions?.map((question) => (
                  <p key={question}>{question}</p>
                ))}
                <textarea
                  id={`reflection-${activeLesson.id}`}
                  value={record.reflections[activeLesson.id] || ""}
                  placeholder={
                    activeLessonContent?.reflection?.placeholder ||
                    "Record what this lesson reveals, challenges, or requires…"
                  }
                  onChange={(event) =>
                    setRecord({
                      ...record,
                      reflections: {
                        ...record.reflections,
                        [activeLesson.id]: event.target.value,
                      },
                    })
                  }
                  onBlur={() => persistRecord(record)}
                />
              </section>
              )}
              <footer className="hcm-reader-footer">
                {activeSection?.heading === "Reflect" && (
                  <button
                    type="button"
                    className="hcm-secondary"
                    onClick={() => persistRecord(record)}
                  >
                    Save Reflection
                  </button>
                )}
                <div className="hcm-reader-footer__actions">
                  <button
                    type="button"
                    className="hcm-primary"
                    onClick={completeLesson}
                  >
                    {record.completedLessons.includes(activeLesson.id)
                      ? "Lesson Completed"
                      : "Complete Lesson"}{" "}
                    <Check size={15} />
                  </button>
                  <button
                    type="button"
                    className="hcm-primary hcm-next-lesson"
                    onClick={openNextLesson}
                  >
                    {getCurriculumAdvanceLabel(nextDestination)}{" "}
                    <ArrowRight size={15} />
                  </button>
                </div>
              </footer>
            </article>
          )}

          {view === "caseFiles" && hasFullCurriculum && (
            <article className="hcm-library-view">
              <p className="hcm-eyebrow">Lyrical Case Files</p>
              <h1>Signal evidence and annotation</h1>
              {TRACKS.map((track) => (
                <section key={track.id}>
                  <header>
                    <span>{track.role}</span>
                    <h2>{track.title}</h2>
                    <p>{track.description}</p>
                  </header>
                  <div className="hcm-lyrics">
                    {track.lyrics.map((line) => (
                      <div key={line.id}>
                        <q>{line.text}</q>
                        {line.annotation && <p>{line.annotation}</p>}
                      </div>
                    ))}
                  </div>
                  <dl>
                    <div>
                      <dt>Hermetic mechanism</dt>
                      <dd>{track.hermeticMechanism}</dd>
                    </div>
                    <div>
                      <dt>Shadow expression</dt>
                      <dd>{track.shadowExpression}</dd>
                    </div>
                    <div>
                      <dt>Light expression</dt>
                      <dd>{track.lightExpression}</dd>
                    </div>
                  </dl>
                </section>
              ))}
            </article>
          )}
          {view === "codes" && hasFullCurriculum && (
            <article className="hcm-library-view">
              <p className="hcm-eyebrow">Diagnostic Codex</p>
              <h1>Shadow and Light Codes</h1>
              <div className="hcm-code-columns">
                <section>
                  <h2>Shadow Codes</h2>
                  {SHADOW_CODES.map((code) => (
                    <div key={code.code}>
                      <strong>{code.code}</strong>
                      <p>{code.description}</p>
                    </div>
                  ))}
                </section>
                <section>
                  <h2>Light Codes</h2>
                  {LIGHT_CODES.map((code) => (
                    <div key={code.code}>
                      <strong>{code.code}</strong>
                      <p>{code.description}</p>
                    </div>
                  ))}
                </section>
              </div>
            </article>
          )}
          {view === "artifact" && (
            <article className="hcm-artifact">
              <p className="hcm-eyebrow">Integration Artifact</p>
              <h1>{courseModule.integrationArtifactTitle}</h1>
              <p>
                Translate curriculum into a durable record. Your entries save
                through the live Reclamation University progress layer.
              </p>
              {(hasFullCurriculum
                ? ARTIFACT_FIELDS
                : courseModule.integrationArtifactInstructions.map(
                    (instruction, index) => ({
                      id: `field-${index}`,
                      label: `Artifact Field ${String(index + 1).padStart(2, "0")}`,
                      prompt: instruction,
                      placeholder: "Write your response…",
                      required: true,
                    }),
                  )
              ).map((field) => (
                <label key={field.id}>
                  <span>
                    {field.label}
                    {field.required && " · Required"}
                  </span>
                  <p>{field.prompt}</p>
                  <textarea
                    value={record.artifact[field.id] || ""}
                    placeholder={field.placeholder}
                    onChange={(event) =>
                      setRecord({
                        ...record,
                        artifact: {
                          ...record.artifact,
                          [field.id]: event.target.value,
                        },
                      })
                    }
                    onBlur={() => persistRecord(record)}
                  />
                </label>
              ))}
              <button
                type="button"
                className="hcm-primary"
                onClick={() => persistRecord(record)}
              >
                Save Integration Artifact <FileText size={15} />
              </button>
            </article>
          )}
          {view === "assessment" && hasFullCurriculum && (
            <article className="hcm-assessment">
              <p className="hcm-eyebrow">Coherence Test</p>
              <h1>Test signal comprehension</h1>
              {COHERENCE_QUESTIONS.map((question, questionIndex) => (
                <fieldset key={question.id}>
                  <legend>
                    <span>{String(questionIndex + 1).padStart(2, "0")}</span>
                    {question.question}
                  </legend>
                  {question.options.map((option, optionIndex) => (
                    <label key={option}>
                      <input
                        type="radio"
                        name={question.id}
                        checked={record.answers[question.id] === optionIndex}
                        onChange={() =>
                          updateRecord({
                            answers: {
                              ...record.answers,
                              [question.id]: optionIndex,
                            },
                          })
                        }
                      />
                      <span>{option}</span>
                    </label>
                  ))}
                  {record.answers[question.id] !== undefined && (
                    <p
                      className={
                        record.answers[question.id] === question.correctIndex
                          ? "is-correct"
                          : "is-review"
                      }
                    >
                      {record.answers[question.id] === question.correctIndex
                        ? "Correct. "
                        : "Review this concept. "}
                      {question.explanation}
                    </p>
                  )}
                </fieldset>
              ))}
            </article>
          )}
        </section>

        <aside className="hcm-context">
          <section>
            <header>
              <span>Law Progress</span>
              <strong>{completionPercent}%</strong>
            </header>
            <ul>
              {lessons.map((lesson) => (
                <li
                  key={lesson.id}
                  className={
                    record.completedLessons.includes(lesson.id)
                      ? "is-complete"
                      : ""
                  }
                >
                  <i>
                    {record.completedLessons.includes(lesson.id) ? (
                      <Check size={10} />
                    ) : null}
                  </i>
                  {lesson.title}
                </li>
              ))}
            </ul>
          </section>
          <section>
            <header>
              <span>Related Laws</span>
            </header>
            {relatedLaws.map((law) => (
              <button
                type="button"
                key={law.id}
                onClick={() =>
                  navigate(
                    `/experiencemode/sovereign/reclamation-university/hermetic-hall/${law.slug}`,
                  )
                }
              >
                {law.title}
                <ChevronRight size={14} />
              </button>
            ))}
          </section>
          <span className={`hcm-save-state is-${saveState}`} aria-live="polite">
            {saveState === "saving"
              ? "Saving…"
              : saveState === "saved"
                ? "Progress saved"
                : saveState === "local"
                  ? "Saved in this session"
                  : ""}
          </span>
        </aside>
      </div>
    </main>
  );
}
