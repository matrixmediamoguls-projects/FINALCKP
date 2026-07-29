export const JOURNEY_TAB_LABELS = [
  "Intro",
  "Concept",
  "Patterns",
  "Reclamation",
  "Reflect",
  "Protocol",
  "Artifact",
];

const TAB_TYPES = {
  Intro: "doctrine",
  Concept: "doctrine",
  Patterns: "case-study",
  Reclamation: "activation",
  Reflect: "exercise",
  Protocol: "exercise",
  Artifact: "activation",
};

const PATTERN_TERMS = [
  "pattern",
  "relationship",
  "institution",
  "system",
  "body",
  "digital",
  "work",
  "money",
  "leadership",
  "everyday life",
  "real-world",
  "scenario",
  "case study",
  "example",
  "outer life",
  "attention economy",
  "reading results",
  "small and large",
  "across generations",
];

function includesAny(value, terms) {
  return terms.some((term) => value.includes(term));
}

export function classifyJourneySection(section, index = 0) {
  const heading = String(section?.heading || "").toLowerCase();

  if (
    heading.includes("reclamation lens") ||
    heading.includes("chroma key") ||
    heading.includes("album reference")
  ) {
    return "Reclamation";
  }

  if (heading === "reflection" || heading.includes("field reflection")) {
    return "Reflect";
  }

  if (
    heading.includes("reclamation protocol") ||
    heading.includes("worked example") ||
    heading.includes("practice lab") ||
    heading.includes("field exercise") ||
    heading.includes("worksheet")
  ) {
    return "Protocol";
  }

  if (
    heading.includes("key takeaway") ||
    heading.includes("looking ahead") ||
    heading.includes("module summary") ||
    heading.includes("lesson summary") ||
    heading.includes("integration") ||
    heading.includes("artifact")
  ) {
    return "Artifact";
  }

  if (
    heading === "introduction" ||
    heading === "lesson focus" ||
    heading === "hook" ||
    heading.includes("opening transmission")
  ) {
    return "Intro";
  }

  if (includesAny(heading, PATTERN_TERMS) || section?.type === "case-study") {
    return "Patterns";
  }

  if (index === 0 && heading.includes("introduction")) return "Intro";
  return "Concept";
}

export function buildLessonJourneyTabs({ content, lesson }) {
  const groups = Object.fromEntries(
    JOURNEY_TAB_LABELS.map((label) => [label, []]),
  );

  (content?.sections || []).forEach((section, index) => {
    groups[classifyJourneySection(section, index)].push(section);
  });

  if (!groups.Intro.length && content?.intro) {
    groups.Intro.push({
      heading: "Central Question",
      type: "doctrine",
      body: content.intro,
    });
  }

  return JOURNEY_TAB_LABELS.map((label) => {
    const items = groups[label];
    return {
      id: label.toLowerCase(),
      label,
      heading: label === "Reclamation" ? "Reclamation Lens" : label,
      type: TAB_TYPES[label],
      items,
      body: items.map((item) => item.body).filter(Boolean).join("\n\n"),
      lessonId: lesson?.id || "",
    };
  });
}

export function getEmptyJourneyTabCopy(tab, lesson) {
  if (tab === "Reclamation" || tab === "Reclamation Lens") {
    return "The selected Reclamation album reference carries the lesson principle into sound, lyric, and lived context.";
  }
  if (tab === "Reflect") {
    return "Use the reflection field below to name what this lesson reveals in your own experience.";
  }
  if (tab === "Protocol") {
    return "Translate the lesson into one observable practice you can test and repeat.";
  }
  if (tab === "Artifact") {
    return `Complete ${lesson?.number || "this lesson"} by preserving the insight, evidence, and action you will carry forward.`;
  }
  return "This lesson does not yet contain additional authored material for this section.";
}
