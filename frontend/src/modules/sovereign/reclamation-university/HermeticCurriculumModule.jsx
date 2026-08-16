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
  Maximize2,
  PenLine,
  Radio,
  ShieldCheck,
  Sparkles,
  X,
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
  JOURNEY_TAB_LABELS,
  buildLessonJourneyTabs,
  getEmptyJourneyTabCopy,
} from "./hermeticJourneyTabs";
import ReclamationLessonMedia from "./ReclamationLessonMedia";
import "./hermeticCurriculumModule.css";
import "./hermeticLearningExperience.css";
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
  "#ef2b2d",
  "#e0643d",
  "#39c6ba",
  "#8ebf67",
  "#7ea6ff",
  "#d68cff",
];
const JOURNEY_PHASES = JOURNEY_TAB_LABELS.map((label, index) => ({
  id: label.toLowerCase().replace(/\s+/g, "-"),
  label,
  icon: [
    Sparkles,
    BookOpen,
    Library,
    Activity,
    Radio,
    Radio,
    Sparkles,
    PenLine,
    ShieldCheck,
    FileText,
    Check,
  ][index],
}));

export function getSectionPhase(section, index, total) {
  const heading = section?.heading?.toLowerCase() || "";
  const matchedPhase = JOURNEY_PHASES.find((phase) => {
    const label = phase.label.toLowerCase();
    return heading === label || heading.includes(label);
  });
  if (matchedPhase) return matchedPhase.id;

  // Keep the curriculum in the canonical 11-section order when authored
  // headings are not yet explicit enough to classify themselves.
  return JOURNEY_PHASES[Math.min(index, JOURNEY_PHASES.length - 1)].id;
}

function LessonJourneyMap({ sections, activeIndex, onOpen }) {
  const phaseMap = JOURNEY_PHASES.map((phase) => {
    const sectionIndexes = sections
      .map((section, index) =>
        getSectionPhase(section, index, sections.length) === phase.id
          ? index
          : -1,
      )
      .filter((index) => index >= 0);
    return { ...phase, sectionIndexes };
  });
  const activePhase = getSectionPhase(
    sections[activeIndex],
    activeIndex,
    sections.length,
  );

  return (
    <nav className="hcm-journey-map" aria-label="11-section lesson journey">
      {phaseMap.map((phase) => {
        const PhaseIcon = phase.icon;
        const isComplete = phase.sectionIndexes.length > 0 && phase.sectionIndexes.every(
          (index) => index < activeIndex,
        );
        const isActive = activePhase === phase.id;
        return (
          <button
            type="button"
            key={phase.id}
            className={[
              isActive ? "is-active" : "",
              isComplete ? "is-complete" : "",
              !phase.sectionIndexes.length ? "is-empty" : "",
            ].filter(Boolean).join(" ")}
            onClick={() => phase.sectionIndexes.length && onOpen(phase.sectionIndexes[0])}
            disabled={!phase.sectionIndexes.length}
            aria-current={isActive ? "step" : undefined}
          >
            <span>
              {isComplete ? <Check size={16} /> : <PhaseIcon size={17} />}
            </span>
            <strong>{phase.label}</strong>
            <small>{phase.sectionIndexes.length}</small>
          </button>
        );
      })}
    </nav>
  );
}

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

function lessonTextEditsKey(moduleId, lessonId) {
  return `reclamation-university:text-edits:${moduleId}:${lessonId}`;
}

function loadLessonTextEdits(moduleId, lessonId) {
  if (!moduleId || !lessonId || typeof window === "undefined") return {};
  try {
    return JSON.parse(
      window.localStorage.getItem(lessonTextEditsKey(moduleId, lessonId)) || "{}",
    );
  } catch {
    return {};
  }
}

function SectionIcon({ type }) {
  if (type === "warning") return <ShieldCheck size={15} />;
  if (type === "activation" || type === "exercise")
    return <Sparkles size={15} />;
  return <BookOpen size={15} />;
}

function groupLessonPassages(body) {
  const sourcePassages = String(body || "")
    .split(/\n{2,}/)
    .map((passage) => passage.trim())
    .filter(Boolean);
  const groupedPassages = [];
  let proseBuffer = [];

  const flushProse = () => {
    if (!proseBuffer.length) return;
    groupedPassages.push(proseBuffer.join(" "));
    proseBuffer = [];
  };

  sourcePassages.forEach((passage) => {
    const lines = passage.split("\n").map((line) => line.trim()).filter(Boolean);
    const isStandalone =
      lines.length > 1 ||
      passage.includes("→") ||
      /^["“]/.test(passage) ||
      /["”]$/.test(passage) ||
      /[:?]$/.test(passage);
    const bufferedLength =
      proseBuffer.join(" ").length + passage.length + proseBuffer.length;

    if (isStandalone) {
      flushProse();
      groupedPassages.push(passage);
      return;
    }

    if (proseBuffer.length >= 4 || bufferedLength > 440) flushProse();
    proseBuffer.push(passage);
  });

  flushProse();
  return groupedPassages;
}

function LessonSectionBody({ body }) {
  const [activePassageGroup, setActivePassageGroup] = useState(0);
  const passages = groupLessonPassages(body);
  const passageGroups = Array.from(
    { length: Math.ceil(passages.length / 5) },
    (_, index) => passages.slice(index * 5, index * 5 + 5),
  );

  useEffect(() => {
    setActivePassageGroup(0);
  }, [body]);

  const visiblePassages = passageGroups[activePassageGroup] || [];

  return (
    <div className="hcm-reading-flow">
      <div className="hcm-prose">
      {visiblePassages.map((passage, index) => {
        const lines = passage.split("\n").map((line) => line.trim()).filter(Boolean);
        const isSequence = passage.includes("→") && lines.length === 1;
        const isQuote =
          lines.length === 1 &&
          (/^["“]/.test(passage) || /["”]$/.test(passage));
        const isLineGroup = lines.length >= 3;

        let renderedPassage;

        if (isSequence) {
          renderedPassage = (
            <div className="hcm-flow-sequence" key={`${passage}-${index}`}>
              {passage.split("→").map((step, stepIndex, steps) => (
                <span key={`${step}-${stepIndex}`}>
                  <b>{step.trim()}</b>
                  {stepIndex < steps.length - 1 && <ArrowRight size={14} />}
                </span>
              ))}
            </div>
          );
        } else if (isQuote) {
          renderedPassage = (
            <blockquote key={`${passage}-${index}`}>{passage}</blockquote>
          );
        } else if (isLineGroup) {
          renderedPassage = (
            <div className="hcm-line-group" key={`${passage}-${index}`}>
              {lines.map((line, lineIndex) => (
                <span key={`${line}-${lineIndex}`}>{line}</span>
              ))}
            </div>
          );
        } else {
          renderedPassage = <p key={`${passage}-${index}`}>{passage}</p>;
        }

        return (
          <div className="hcm-passage-unit" key={`${passage}-${index}`}>
            {renderedPassage}
          </div>
        );
      })}
      </div>
      {passageGroups.length > 1 && (
        <div className="hcm-passage-controls" aria-label="Section reading flow">
          <button
            type="button"
            disabled={activePassageGroup === 0}
            onClick={() => setActivePassageGroup((index) => index - 1)}
          >
            <ChevronLeft size={14} /> Previous part
          </button>
          <div>
            <span>
              Part {activePassageGroup + 1} of {passageGroups.length}
            </span>
            <i>
              {passageGroups.map((_, index) => (
                <b
                  key={index}
                  className={index <= activePassageGroup ? "is-read" : ""}
                />
              ))}
            </i>
          </div>
          <button
            type="button"
            disabled={activePassageGroup === passageGroups.length - 1}
            onClick={() => setActivePassageGroup((index) => index + 1)}
          >
            Next part <ArrowRight size={14} />
          </button>
        </div>
      )}
    </div>
  );
}

function LessonExhibits({
  exhibits = [],
  variant = "inline",
  lessonNumber = "",
}) {
  const [expandedExhibit, setExpandedExhibit] = useState(null);
  const sourcedExhibits = exhibits.filter((exhibit) => exhibit.src);
  const visibleExhibits =
    variant === "concept-panel"
      ? Array.from({ length: 2 }, (_, index) => {
          const exhibit = sourcedExhibits[index] || sourcedExhibits[0];
          if (exhibit) {
            return index === 0
              ? exhibit
              : {
                  ...exhibit,
                  id: `${exhibit.id}-study-${index + 1}`,
                  label: `Exhibit ${lessonNumber || ""}${lessonNumber ? "." : ""}${index + 1}`,
                };
          }
          return {
            id: `exhibit-${lessonNumber || "lesson"}-${index + 1}-pending`,
            label: `Exhibit ${lessonNumber || ""}${lessonNumber ? "." : ""}${index + 1}`,
            title: "Exhibit awaiting curation",
            status: "pending",
          };
        })
      : exhibits;

  useEffect(() => {
    if (!expandedExhibit) return undefined;
    const closeOnEscape = (event) => {
      if (event.key === "Escape") setExpandedExhibit(null);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [expandedExhibit]);

  if (!visibleExhibits.length) return null;

  return (
    <>
      {variant === "artifact-panel" || variant === "concept-panel" ? (
        <section
          className={`hcm-artifact-panel${variant === "concept-panel" ? " is-concept-exhibits" : ""}`}
          aria-label="Lesson exhibits"
        >
          <header>
            <span><BookOpen size={14} /> Exhibits</span>
            <small>Two framed studies</small>
          </header>
          <div className="hcm-artifact-panel__grid">
            {visibleExhibits.map((exhibit) =>
              exhibit.src ? (
                <button
                  type="button"
                  key={exhibit.id}
                  className="hcm-artifact-slot"
                  onClick={() => setExpandedExhibit(exhibit)}
                  aria-label={`Expand ${exhibit.label}: ${exhibit.title}`}
                >
                  <img src={exhibit.src} alt={exhibit.alt} />
                  <span>
                    <small>{exhibit.label}</small>
                    <strong>{exhibit.title}</strong>
                    <i><Maximize2 size={13} /> Expand</i>
                  </span>
                </button>
              ) : (
                <div key={exhibit.id} className="hcm-artifact-slot is-pending">
                  <small>{exhibit.label}</small>
                  <strong>{exhibit.title}</strong>
                  <span>Awaiting exhibit asset</span>
                </div>
              ),
            )}
          </div>
        </section>
      ) : (
        <section className="hcm-exhibit-gallery" aria-label="Lesson exhibits">
          {exhibits.map((exhibit) => (
            <figure key={exhibit.id} className="hcm-exhibit-card">
              {exhibit.src ? (
                <button
                  type="button"
                  onClick={() => setExpandedExhibit(exhibit)}
                  aria-label={`Expand ${exhibit.label}: ${exhibit.title}`}
                >
                  <img src={exhibit.src} alt={exhibit.alt} />
                </button>
              ) : null}
              <figcaption>
                <small>{exhibit.label}</small>
                <strong>{exhibit.title}</strong>
                {exhibit.description ? <span>{exhibit.description}</span> : null}
              </figcaption>
            </figure>
          ))}
        </section>
      )}

      {expandedExhibit && (
        <div className="hcm-exhibit-lightbox" role="dialog" aria-modal="true" aria-label={expandedExhibit.title}>
          <button type="button" className="hcm-exhibit-lightbox__close" onClick={() => setExpandedExhibit(null)} aria-label="Close exhibit">
            <X size={18} />
          </button>
          <div className="hcm-exhibit-lightbox__frame">
            {expandedExhibit.src ? <img src={expandedExhibit.src} alt={expandedExhibit.alt} /> : null}
            <div>
              <small>{expandedExhibit.label}</small>
              <strong>{expandedExhibit.title}</strong>
              {expandedExhibit.description ? <span>{expandedExhibit.description}</span> : null}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// The remainder of this component remains the dedicated Hermetic curriculum
// renderer. Its lesson content, persistence, exhibits, reflection, protocol,
// artifact, and summary views are intentionally preserved while the journey
// navigation above now exposes the canonical 11-section sequence.
