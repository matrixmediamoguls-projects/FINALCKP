import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  ChevronLeft,
  ChevronRight,
  FileText,
  Library,
  PenLine,
  Radio,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { COURSE_MODULES } from "../../../data/hermeticCourseData";
import { LESSONS as VIBRATION_LESSONS } from "../../../data/hermeticVibrationModuleData";
import { LESSONS as POLARITY_LESSONS } from "../../../data/hermeticPolarityModuleData";
import { useReclamationModuleProgress } from "../../../hooks/useReclamationModuleProgress";
import {
  getCurriculumAdvanceLabel,
  getNextCurriculumDestination,
} from "./hermeticCurriculumNavigation";
import { buildHermeticLessonContent } from "./hermeticLessonContent";
import {
  JOURNEY_TAB_LABELS,
  buildLessonJourneyTabs,
  getEmptyJourneyTabCopy,
} from "./hermeticJourneyTabs";
import ReclamationLessonMedia from "./ReclamationLessonMedia";
import "./hermeticCurriculumModule.css";
import "./hermeticLearningExperience.css";
import "./hermeticJourneyTabs.css";

const ICONS = [
  Sparkles,
  BookOpen,
  Library,
  ShieldCheck,
  Radio,
  Radio,
  Sparkles,
  PenLine,
  ShieldCheck,
  FileText,
  Check,
];

const EMPTY_RECORD = {
  completedLessons: [],
  reflections: {},
  artifact: {},
};

const JOURNEY_PROCESS_STEPS = {
  Intro: ["Frame the inquiry", "Locate the principle", "Prepare to observe"],
  Principle: ["Name the law", "Define its mechanism", "Establish the governing idea"],
  "Key Concepts": ["Identify the terms", "Connect the mechanics", "Build the model"],
  "Why It Matters": ["Locate the stakes", "Recognize the consequence", "Establish relevance"],
  Domains: ["Observe the domain", "Trace the pattern", "Compare expressions"],
  Reclamation: ["Hear the signal", "Recognize the motif", "Claim the meaning"],
  "2026 Lens": ["Observe the present", "Read the system", "Locate the implication"],
  Reflection: ["Observe", "Recognize", "Connect", "Choose"],
  Protocol: ["Name", "Test", "Record", "Repeat"],
  Artifact: ["Preserve the insight", "Name the evidence", "Carry it forward"],
  Summary: ["Consolidate", "Integrate", "Continue"],
};

const localRecordKey = (moduleId) => `ru_hermetic_curriculum_${moduleId}`;

function loadLocalRecord(moduleId) {
  if (typeof window === "undefined") return null;
  try {
    return JSON.parse(window.localStorage.getItem(localRecordKey(moduleId))) || null;
  } catch {
    return null;
  }
}

function saveLocalRecord(moduleId, record) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(localRecordKey(moduleId), JSON.stringify(record));
}

function normalizeRecord(progress, fallback) {
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
  };
}

function SectionIcon({ index }) {
  const Icon = ICONS[index] || BookOpen;
  return <Icon size={15} />;
}

function LessonJourneyMap({ sections, activeIndex, onOpen }) {
  return (
    <nav className="hcm-section-steps" aria-label="11-section curriculum">
      {sections.map((section, index) => (
        <button
          key={section.id || section.label || index}
          type="button"
          className={[
            index === activeIndex ? "is-active" : "",
            index < activeIndex ? "is-complete" : "",
          ].filter(Boolean).join(" ")}
          onClick={() => onOpen(index)}
          aria-current={index === activeIndex ? "step" : undefined}
        >
          <span>{String(index + 1).padStart(2, "0")}</span>
          <strong>{section.label}</strong>
        </button>
      ))}
    </nav>
  );
}

function JourneyProcessDiagram({ label }) {
  const steps = JOURNEY_PROCESS_STEPS[label];
  if (!steps) return null;
  return (
    <section className="hcm-process-diagram" aria-label={`${label} process`}>
      <span>{label} journey</span>
      <div>
        {steps.map((step, index) => (
          <article key={step}>
            <b>{String(index + 1).padStart(2, "0")}</b>
            <strong>{step}</strong>
            {index < steps.length - 1 && <ArrowRight size={16} aria-hidden="true" />}
          </article>
        ))}
      </div>
    </section>
  );
}

function LessonSectionBody({ item }) {
  const paragraphs = String(item?.body || "")
    .split(/\n{2,}/)
    .map((value) => value.trim())
    .filter(Boolean);

  return (
    <div className="hcm-reading-flow">
      <div className="hcm-prose">
        {paragraphs.map((paragraph, index) => {
          const lines = paragraph.split("\n").map((line) => line.trim()).filter(Boolean);
          if (lines.length > 2) {
            return (
              <div className="hcm-line-group" key={index}>
                {lines.map((line) => <span key={line}>{line}</span>)}
              </div>
            );
          }
          if (/^[“\"]/.test(paragraph)) {
            return <blockquote key={index}>{paragraph}</blockquote>;
          }
          return <p key={index}>{paragraph}</p>;
        })}
      </div>
      {item?.bullets?.length ? (
        <ul>
          {item.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}
        </ul>
      ) : null}
      {item?.numbered?.length ? (
        <ol>
          {item.numbered.map((entry) => <li key={entry}>{entry}</li>)}
        </ol>
      ) : null}
      {item?.callout ? <blockquote>{item.callout}</blockquote> : null}
    </div>
  );
}

export default function HermeticCurriculumModule({ module, faculty }) {
  const navigate = useNavigate();
  const courseModule = useMemo(
    () => COURSE_MODULES.find((item) => item.number === module.order),
    [module.order],
  );
  const lessons = courseModule?.number === 3
    ? VIBRATION_LESSONS
    : courseModule?.number === 4
      ? POLARITY_LESSONS
      : courseModule?.lessons || [];

  const [activeLessonId, setActiveLessonId] = useState(lessons[0]?.id || "");
  const [activeSectionIndex, setActiveSectionIndex] = useState(0);
  const [activeItemIndex, setActiveItemIndex] = useState(0);
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
    if (!isLoading) setRecord(normalizeRecord(progress, loadLocalRecord(module.id)));
  }, [isLoading, module.id, progress]);

  useEffect(() => {
    setActiveLessonId(lessons[0]?.id || "");
    setActiveSectionIndex(0);
    setActiveItemIndex(0);
  }, [module.id, lessons]);

  const activeLesson = lessons.find((lesson) => lesson.id === activeLessonId) || lessons[0];
  const activeLessonIndex = Math.max(0, lessons.findIndex((lesson) => lesson.id === activeLesson?.id));
  const activeContent = activeLesson
    ? activeLesson.content || buildHermeticLessonContent({
        lesson: activeLesson,
        lessonIndex: activeLessonIndex,
        lessonCount: lessons.length,
        curriculumSections: module.curriculumSections,
      })
    : null;

  const sections = useMemo(
    () => buildLessonJourneyTabs({ content: activeContent, lesson: activeLesson }),
    [activeContent, activeLesson],
  );
  const activeSection = sections[activeSectionIndex] || sections[0];
  const activeItems = activeSection?.items || [];
  const activeItem = activeItems[activeItemIndex] || activeItems[0] || activeSection;
  const completionPercent = lessons.length
    ? Math.round((record.completedLessons.length / lessons.length) * 100)
    : 0;
  const sectionPercent = sections.length
    ? Math.round(((activeSectionIndex + 1) / sections.length) * 100)
    : 0;

  const persist = async (nextRecord) => {
    setRecord(nextRecord);
    saveLocalRecord(module.id, nextRecord);
    setSaveState("saving");
    const result = await saveProgress({
      status: nextRecord.completedLessons.length === lessons.length ? "completed" : "in_progress",
      activeScene: activeSectionIndex,
      listenedTrackIds: nextRecord.completedLessons,
      declarationJson: { curriculum: nextRecord },
    });
    setSaveState(result?.error ? "local" : "saved");
    window.setTimeout(() => setSaveState("idle"), 1800);
  };

  const updateReflection = (value) => {
    setRecord((current) => ({
      ...current,
      reflections: { ...current.reflections, [activeLesson.id]: value },
    }));
  };

  const completeLesson = () => {
    if (!activeLesson || record.completedLessons.includes(activeLesson.id)) return;
    persist({
      ...record,
      completedLessons: [...record.completedLessons, activeLesson.id],
    });
  };

  const nextDestination = activeLesson
    ? getNextCurriculumDestination({
        lessons,
        activeLessonId: activeLesson.id,
        hallModules: faculty.modules || [],
        moduleOrder: module.order,
      })
    : { type: "hall" };

  const openNextLesson = () => {
    if (nextDestination.type === "lesson") {
      setActiveLessonId(nextDestination.lessonId);
      setActiveSectionIndex(0);
      setActiveItemIndex(0);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    if (nextDestination.type === "module") {
      navigate(`/experiencemode/sovereign/reclamation-university/hermetic-hall/${nextDestination.slug}`);
      return;
    }
    navigate("/experiencemode/sovereign/reclamation-university");
  };

  if (!activeLesson) return null;

  return (
    <main className="hcm-root" style={{ "--hcm-accent": module.accent || "#c9a461" }}>
      <div className="hcm-atmosphere" aria-hidden="true" />

      <header className="hcm-topbar">
        <div className="hcm-brand">
          <span className="hcm-brand-mark"><Library size={22} /></span>
          <strong>Reclamation<br />University</strong>
        </div>
        <div className="hcm-breadcrumbs">
          <button type="button" onClick={() => navigate("/experiencemode/sovereign/reclamation-university")}>University Hall</button>
          <ChevronRight size={13} />
          <button type="button" onClick={() => navigate("/experiencemode/sovereign/reclamation-university/hermetic-hall")}>The Hermetic Hall</button>
          <ChevronRight size={13} />
          <strong>{module.title}</strong>
        </div>
        <div className="hcm-progress" aria-label={`${completionPercent}% complete`}>
          <span>Course progress</span>
          <strong>{completionPercent}%</strong>
          <i><b style={{ width: `${completionPercent}%` }} /></i>
        </div>
      </header>

      <div className="hcm-layout is-lesson-view">
        <aside className="hcm-campus-nav">
          <button type="button" className="hcm-campus-seal" onClick={() => navigate("/experiencemode/sovereign/reclamation-university")}>
            <span><Library size={28} /></span>
            <strong>RU</strong>
            <small>Reclamation University</small>
          </button>
          <nav>
            <button type="button" className="is-current"><BookOpen size={17} /><span>Curriculum</span></button>
            <button type="button" onClick={() => navigate("/experiencemode/sovereign/reclamation-university/hermetic-hall")}><ArrowLeft size={17} /><span>Hermetic Hall</span></button>
          </nav>
        </aside>

        <aside className="hcm-index">
          <p className="hcm-eyebrow">Principle Curriculum</p>
          <h2>{module.title}</h2>
          <p>{courseModule?.subtitle || faculty.title}</p>
          <ol>
            {lessons.map((lesson) => (
              <li key={lesson.id}>
                <button
                  type="button"
                  className={activeLessonId === lesson.id ? "is-active" : ""}
                  onClick={() => {
                    setActiveLessonId(lesson.id);
                    setActiveSectionIndex(0);
                    setActiveItemIndex(0);
                  }}
                >
                  <span>{record.completedLessons.includes(lesson.id) ? <Check size={13} /> : lesson.number}</span>
                  <div><strong>{lesson.title}</strong><small>{lesson.subtitle || "Curriculum lesson"}</small></div>
                </button>
              </li>
            ))}
          </ol>
        </aside>

        <section className="hcm-stage" aria-label="Principle curriculum">
          <article className={`hcm-reader hcm-section-${activeSectionIndex}`}>
            <div className="hcm-lesson-hero">
              <div>
                <p className="hcm-eyebrow">{faculty.title} · Lesson {activeLesson.number}</p>
                <h1>{activeLesson.title}</h1>
                {activeLesson.subtitle && <h2>{activeLesson.subtitle}</h2>}
              </div>
              <div className="hcm-lesson-sigil" aria-label={`${sectionPercent}% curriculum progress`}>
                <span>{String(sectionPercent).padStart(2, "0")}%</span>
                <b>Curriculum</b>
              </div>
            </div>

            {activeLessonContentIntro(activeContent) && (
              <aside className="hcm-central-question">
                <span>Central question</span>
                <p>{activeLessonContentIntro(activeContent)}</p>
              </aside>
            )}

            <div className="hcm-guided-reader">
              <div className="hcm-section-progress">
                <div>
                  <span>Curriculum sequence</span>
                  <strong>Section {activeSectionIndex + 1} of {JOURNEY_TAB_LABELS.length}</strong>
                </div>
                <i><b style={{ width: `${sectionPercent}%` }} /></i>
              </div>
              <LessonJourneyMap sections={sections} activeIndex={activeSectionIndex} onOpen={(index) => { setActiveSectionIndex(index); setActiveItemIndex(0); }} />
            </div>

            {activeSection && (
              <section className="hcm-content-block hcm-active-section is-doctrine">
                <div className="hcm-learning-grid">
                  <div className="hcm-teaching-canvas">
                    <div className="hcm-section-stage">
                      <div className="hcm-content-label"><SectionIcon index={activeSectionIndex} /> {activeSection.label}</div>
                      <span>{String(activeSectionIndex + 1).padStart(2, "0")}</span>
                    </div>
                    <h3>{activeSection.label}</h3>

                    {activeItems.length ? (
                      <section className="hcm-journey-subsections is-paged">
                        <article className="hcm-journey-subsection is-active-card">
                          <header className="hcm-card-heading">
                            <span>Page {activeItemIndex + 1} of {activeItems.length}</span>
                            <h4>{activeItem?.heading || activeSection.label}</h4>
                          </header>
                          <LessonSectionBody item={activeItem} />
                        </article>
                        {activeItems.length > 1 && (
                          <nav className="hcm-card-pagination" aria-label={`${activeSection.label} pages`}>
                            <button type="button" disabled={activeItemIndex === 0} onClick={() => setActiveItemIndex((value) => Math.max(0, value - 1))}><ChevronLeft size={15} /> Previous</button>
                            <div>
                              {activeItems.map((item, index) => (
                                <button key={`${item.heading}-${index}`} type="button" className={index === activeItemIndex ? "is-active" : ""} onClick={() => setActiveItemIndex(index)} aria-label={`Page ${index + 1}`} />
                              ))}
                            </div>
                            <button type="button" disabled={activeItemIndex === activeItems.length - 1} onClick={() => setActiveItemIndex((value) => Math.min(activeItems.length - 1, value + 1))}>Next <ChevronRight size={15} /></button>
                          </nav>
                        )}
                      </section>
                    ) : (
                      <p className="hcm-empty-tab">{getEmptyJourneyTabCopy(activeSection.label, activeLesson)}</p>
                    )}

                    {activeSection.label === "Reclamation" && (
                      <ReclamationLessonMedia lesson={activeLesson} contextBody={activeSection.body} referenceAnnotations={module.lyricAnchors || []} />
                    )}

                    {activeSection.label === "Reflection" && (
                      <label className="hcm-inline-reflection">
                        <span>Guided reflection</span>
                        <textarea value={record.reflections[activeLesson.id] || ""} placeholder="What does this principle reveal in your experience?" onChange={(event) => updateReflection(event.target.value)} onBlur={() => persist(record)} />
                        <small>Saved with your lesson progress</small>
                      </label>
                    )}

                    {activeSection.label === "Artifact" && (
                      <section className="hcm-lesson-artifact">
                        <span>Artifact</span>
                        <h4>Preserve what you are carrying forward</h4>
                        <p>Create a durable record of the insight, evidence, or decision you want beyond this lesson.</p>
                        <textarea value={record.artifact[activeLesson.id] || ""} placeholder="Create your artifact…" onChange={(event) => setRecord((current) => ({ ...current, artifact: { ...current.artifact, [activeLesson.id]: event.target.value } }))} onBlur={() => persist(record)} />
                      </section>
                    )}
                  </div>

                  <aside className="hcm-insight-stack">
                    <section className="hcm-key-insight">
                      <span><Sparkles size={15} /> {activeSection.label}</span>
                      <h4>{activeItem?.heading || activeSection.label}</h4>
                      <p>{String(activeItem?.body || activeSection.body || "").split(/\n{2,}/)[0]}</p>
                    </section>
                    <section className="hcm-pattern-gallery">
                      <article><span>01</span><p>Understand the principle.</p></article>
                      <article><span>02</span><p>Observe its expression.</p></article>
                      <article><span>03</span><p>Translate it into practice.</p></article>
                    </section>
                  </aside>
                </div>
                <JourneyProcessDiagram label={activeSection.label} />
              </section>
            )}

            <div className="hcm-section-controls">
              <button type="button" className="hcm-secondary" disabled={activeSectionIndex === 0} onClick={() => { setActiveSectionIndex((value) => value - 1); setActiveItemIndex(0); }}><ChevronLeft size={15} /> Previous</button>
              {activeSectionIndex < sections.length - 1 ? (
                <button type="button" className="hcm-primary" onClick={() => { setActiveSectionIndex((value) => value + 1); setActiveItemIndex(0); }}>Continue to {sections[activeSectionIndex + 1]?.label} <ArrowRight size={15} /></button>
              ) : (
                <button type="button" className="hcm-primary" onClick={completeLesson}>Complete Lesson <Check size={15} /></button>
              )}
            </div>

            <footer className="hcm-reader-footer">
              <span>{saveState === "saving" ? "Saving…" : saveState === "saved" ? "Progress saved" : saveState === "local" ? "Saved locally" : ""}</span>
              <button type="button" className="hcm-primary hcm-next-lesson" onClick={openNextLesson}>{getCurriculumAdvanceLabel(nextDestination)} <ArrowRight size={15} /></button>
            </footer>
          </article>
        </section>
      </div>
    </main>
  );
}

function activeLessonContentIntro(content) {
  return content?.intro || content?.centralQuestion || "";
}
