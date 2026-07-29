import { describe, expect, it } from "vitest";
import { COURSE_MODULES } from "../../../data/hermeticCourseData";
import {
  buildLessonJourneyTabs,
  JOURNEY_TAB_LABELS,
} from "./hermeticJourneyTabs";

const completedLessons = COURSE_MODULES.flatMap((courseModule) =>
  courseModule.lessons.filter((lesson) => lesson.content),
);

describe("Hermetic lesson journey tabs", () => {
  it("organizes every completed lesson into the required seven tabs", () => {
    expect(completedLessons.length).toBeGreaterThan(0);

    completedLessons.forEach((lesson) => {
      const tabs = buildLessonJourneyTabs({
        content: lesson.content,
        lesson,
      });

      expect(tabs.map((tab) => tab.label)).toEqual(JOURNEY_TAB_LABELS);
      expect(tabs).toHaveLength(7);
    });
  });

  it("preserves every authored curriculum section during organization", () => {
    completedLessons.forEach((lesson) => {
      const tabs = buildLessonJourneyTabs({
        content: lesson.content,
        lesson,
      });
      const organizedSectionCount = tabs.reduce(
        (total, tab) => total + tab.items.length,
        0,
      );

      expect(organizedSectionCount).toBe(lesson.content.sections.length);
    });
  });

  it("places Lesson 2.1 album context and practical work in their intended tabs", () => {
    const lesson = COURSE_MODULES.find((module) => module.number === 2).lessons.find(
      (item) => item.number === "2.1",
    );
    const tabs = buildLessonJourneyTabs({ content: lesson.content, lesson });
    const reclamation = tabs.find((tab) => tab.heading === "Reclamation Lens");
    const reflect = tabs.find((tab) => tab.heading === "Reflect");
    const protocol = tabs.find((tab) => tab.heading === "Protocol");

    expect(reclamation.items.map((item) => item.heading)).toContain(
      "The Reclamation Lens",
    );
    expect(reflect.items.map((item) => item.heading)).toContain("Reflection");
    expect(protocol.items.map((item) => item.heading)).toContain(
      "Reclamation Protocol",
    );
  });
});
