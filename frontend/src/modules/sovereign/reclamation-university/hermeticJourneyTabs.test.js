import { describe, expect, it } from "vitest";
import {
  buildLessonJourneyTabs,
  classifyJourneySection,
  getEmptyJourneyTabCopy,
  JOURNEY_TAB_LABELS,
} from "./hermeticJourneyTabs";

// The engine is content-agnostic, so this fixture stands in for an authored
// lesson rather than reaching into curriculum data (which is a stub while
// lesson content lives in the per-module *ModuleData files).
const lesson = { id: "lesson-2-1", number: "2.1" };

const content = {
  sections: [
    { heading: "Introduction", type: "doctrine", body: "Opening." },
    { heading: "The Principle of Correspondence", type: "doctrine", body: "Law." },
    { heading: "Key Concepts", type: "doctrine", body: "Concepts." },
    { heading: "Why It Matters", type: "doctrine", body: "Stakes." },
    { heading: "Domains", type: "case-study", body: "Where it appears." },
    { heading: "The Reclamation Lens", type: "activation", body: "Album context." },
    { heading: "2026 Lens", type: "case-study", body: "Present day." },
    { heading: "Reflection", type: "exercise", body: "Reflect." },
    { heading: "Reclamation Protocol", type: "exercise", body: "Practice." },
    { heading: "Integration Artifact", type: "activation", body: "Deliverable." },
    { heading: "Lesson Summary", type: "doctrine", body: "Carry forward." },
  ],
};

describe("Hermetic lesson journey tabs", () => {
  it("exposes the canonical eleven-tab journey", () => {
    expect(JOURNEY_TAB_LABELS).toHaveLength(11);
    expect(JOURNEY_TAB_LABELS).toEqual([
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
    ]);
  });

  it("organizes an authored lesson into all eleven tabs, in order", () => {
    const tabs = buildLessonJourneyTabs({ content, lesson });

    expect(tabs).toHaveLength(11);
    expect(tabs.map((tab) => tab.label)).toEqual(JOURNEY_TAB_LABELS);
    expect(tabs.every((tab) => tab.lessonId === "lesson-2-1")).toBe(true);
  });

  it("preserves every authored section during organization", () => {
    const tabs = buildLessonJourneyTabs({ content, lesson });
    const organizedSectionCount = tabs.reduce(
      (total, tab) => total + tab.items.length,
      0,
    );

    expect(organizedSectionCount).toBe(content.sections.length);
  });

  it("routes album context, reflection, and practical work to their intended tabs", () => {
    const tabs = buildLessonJourneyTabs({ content, lesson });
    const headingsFor = (label) =>
      tabs.find((tab) => tab.label === label).items.map((item) => item.heading);

    expect(headingsFor("Reclamation")).toContain("The Reclamation Lens");
    expect(headingsFor("Reflection")).toContain("Reflection");
    expect(headingsFor("Protocol")).toContain("Reclamation Protocol");
    expect(headingsFor("Artifact")).toContain("Integration Artifact");
  });

  it("classifies unrecognized headings by position rather than collapsing them", () => {
    expect(classifyJourneySection({ heading: "Untitled Section" }, 4)).toBe(
      JOURNEY_TAB_LABELS[4],
    );
    // Index past the end clamps to the final tab instead of throwing.
    expect(classifyJourneySection({ heading: "Untitled Section" }, 99)).toBe(
      "Summary",
    );
  });

  it("falls back to the lesson intro when no sections are authored", () => {
    const tabs = buildLessonJourneyTabs({
      content: { intro: "What does correspondence reveal?" },
      lesson,
    });
    const intro = tabs.find((tab) => tab.label === "Intro");

    expect(intro.items).toHaveLength(1);
    expect(intro.items[0].heading).toBe("Central Question");
    expect(intro.body).toBe("What does correspondence reveal?");
  });

  it("provides guidance copy for tabs with no authored material", () => {
    expect(getEmptyJourneyTabCopy("Artifact", lesson)).toContain("2.1");
    expect(getEmptyJourneyTabCopy("Reclamation", lesson)).toMatch(/Reclamation album/i);
    expect(getEmptyJourneyTabCopy("Intro", lesson)).toMatch(/does not yet contain/i);
  });
});
