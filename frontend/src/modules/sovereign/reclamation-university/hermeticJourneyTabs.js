export const JOURNEY_TAB_LABELS = [
  "Intro",
  "Principle",
  "Key Concepts",
  "Why It Matters",
  "Domains",
  "Reclamation",
  "2026 Lens",
  "Reflection",
  "Protocol",
  "Artifact",
  "Summary",
];

const TAB_TYPES = {
  Intro: "doctrine",
  Principle: "doctrine",
  "Key Concepts": "doctrine",
  "Why It Matters": "doctrine",
  Domains: "case-study",
  Reclamation: "activation",
  "2026 Lens": "case-study",
  Reflection: "exercise",
  Protocol: "exercise",
  Artifact: "activation",
  Summary: "doctrine",
};

const SECTION_MATCHERS = [
  ["Intro", ["introduction", "opening transmission", "lesson focus", "hook", "orientation"]],
  ["Principle", ["principle", "law", "central doctrine", "what is this"]],
  ["Key Concepts", ["key concept", "key concepts", "concept", "mechanic", "mechanics", "definition", "core idea"]],
  ["Why It Matters", ["why it matters", "why this matters", "importance", "significance", "stakes"]],
  ["Domains", ["domains", "domain", "where it appears", "application domains", "real world", "real-world"]],
  ["Reclamation", ["reclamation lens", "reclamation", "chroma key", "album reference", "album", "track", "lyric"]],
  ["2026 Lens", ["2026 lens", "2026", "contemporary lens", "present day", "digital age", "now"]],
  ["Reflection", ["reflection", "reflect", "field reflection", "self reflection", "your current", "observe", "question"]],
  ["Protocol", ["reclamation protocol", "protocol", "worked example", "practice lab", "field exercise", "worksheet", "activation"]],
  ["Artifact", ["artifact", "integration artifact", "integration exercise", "deliverable", "creation"]],
  ["Summary", ["summary", "lesson summary", "module summary", "key takeaway", "takeaway", "looking ahead", "closing", "carry forward"]],
];

export function classifyJourneySection(section, index = 0) {
  const heading = String(section?.heading || "").toLowerCase();

  // The longest matching term wins rather than the first one in list order.
  // Scanning in order would let a broad term shadow a specific one authored
  // further down the list -- "Reclamation Protocol" matches the Reclamation
  // tab's "reclamation" before ever reaching the Protocol tab's own
  // "reclamation protocol", which sent authored protocol work to the wrong tab.
  let matchedLabel = null;
  let matchedLength = 0;

  for (const [label, terms] of SECTION_MATCHERS) {
    for (const term of terms) {
      if (term.length > matchedLength && heading.includes(term)) {
        matchedLabel = label;
        matchedLength = term.length;
      }
    }
  }

  if (matchedLabel) return matchedLabel;

  // When authored content does not yet have a recognizable heading, preserve
  // the canonical 11-section order rather than collapsing it into a generic tab.
  return JOURNEY_TAB_LABELS[Math.min(index, JOURNEY_TAB_LABELS.length - 1)];
}

export function buildLessonJourneyTabs({ content, lesson }) {
  const groups = Object.fromEntries(
    JOURNEY_TAB_LABELS.map((label) => [label, []]),
  );

  (content?.sections || []).forEach((section, index) => {
    groups[classifyJourneySection(section, index)].push(section);
  });

  if (!(content?.sections || []).length && content?.intro) {
    groups.Intro.push({
      heading: "Central Question",
      type: "doctrine",
      body: content.intro,
    });
  }

  return JOURNEY_TAB_LABELS.map((label) => {
    const items = groups[label];
    return {
      id: label.toLowerCase().replace(/\s+/g, "-"),
      label,
      heading: label,
      type: TAB_TYPES[label],
      items,
      body: items.map((item) => item.body).filter(Boolean).join("\n\n"),
      lessonId: lesson?.id || "",
    };
  });
}

export function getEmptyJourneyTabCopy(tab, lesson) {
  if (tab === "Reclamation") {
    return "Carry the selected principle into the Reclamation album, its sound, lyric, symbolism, and lived context.";
  }
  if (tab === "2026 Lens") {
    return "Examine what this principle looks like in the technological, cultural, economic, creative, and social conditions of 2026.";
  }
  if (tab === "Reflection") {
    return "Use the reflection field below to name what this lesson reveals in your own experience.";
  }
  if (tab === "Protocol") {
    return "Translate the lesson into one observable practice you can test, repeat, and evaluate.";
  }
  if (tab === "Artifact") {
    return `Create and preserve the artifact for ${lesson?.number || "this lesson"}.`;
  }
  if (tab === "Summary") {
    return "Consolidate the principle, its contemporary meaning, and the action you are carrying forward.";
  }
  return "This section does not yet contain additional authored material.";
}
