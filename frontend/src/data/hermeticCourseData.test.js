import { describe, expect, it } from "vitest";
import { COURSE_MODULES } from "./hermeticCourseData";

describe("Hermetic course data", () => {
  it("delivers the complete interactive curriculum for Lesson 1.1", () => {
    const lesson = COURSE_MODULES[0].lessons.find(
      (item) => item.number === "1.1",
    );

    expect(lesson.title).toBe("The Mind as Medium");
    expect(lesson.content.sections.map((section) => section.heading)).toEqual([
      "Reality as a Translation",
      "Event, Interpretation, Observer",
      "Where This Shows Up in Your Life",
      "Mind in the Attention Economy",
    ]);
    expect(
      [lesson.content.intro, ...lesson.content.sections.map(({ body }) => body)]
        .join("\n\n")
        .includes(
          "It requires you to recognize that your mind is the interface they are trying to reach.",
        ),
    ).toBe(true);
    expect(lesson.content.reflection.questions).toHaveLength(3);
  });
});
