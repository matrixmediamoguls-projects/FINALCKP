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

  it("delivers the supplied Inherited Code curriculum for Lesson 1.2", () => {
    const lesson = COURSE_MODULES[0].lessons.find(
      (item) => item.number === "1.2",
    );

    expect(lesson.title).toBe("Inherited Code");
    expect(lesson.content.intro).toBe(
      "How many of your beliefs were chosen—and how many were handed to you?",
    );
    expect(lesson.content.sections[0].heading).toBe("Introduction");
    expect(lesson.content.sections.at(-1)).toEqual(
      expect.objectContaining({
        heading: "Looking Ahead",
        body: expect.stringContaining(
          "Next Lesson: The Algorithmic Thought Form",
        ),
      }),
    );
    expect(lesson.content.sections).toHaveLength(22);
  });

  it("delivers the supplied Algorithmic Thought Form curriculum for Lesson 1.3", () => {
    const lesson = COURSE_MODULES[0].lessons.find(
      (item) => item.number === "1.3",
    );

    expect(lesson.title).toBe("The Algorithmic Thought Form");
    expect(lesson.content.intro).toBe(
      "When does a passing thought become a pattern that begins directing your life?",
    );
    expect(lesson.content.sections[0].heading).toBe("Introduction");
    expect(lesson.content.sections).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          heading: "Reclamation Protocol",
          body: expect.stringContaining("Thought Form Audit"),
        }),
        expect.objectContaining({
          heading: "Looking Ahead",
          body: expect.stringContaining("Next Lesson: Vision Before the Tool"),
        }),
      ]),
    );
    expect(lesson.content.sections).toHaveLength(13);
  });

  it("delivers the supplied Vision Before the Tool curriculum for Lesson 1.4", () => {
    const lesson = COURSE_MODULES[0].lessons.find(
      (item) => item.number === "1.4",
    );

    expect(lesson.title).toBe("Vision Before the Tool");
    expect(lesson.content.intro).toBe(
      "Does a tool create the future—or does it reveal the mind of the person using it?",
    );
    expect(lesson.content.sections[0].heading).toBe("Introduction");
    expect(lesson.content.sections).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          heading: "Reclamation Protocol",
          body: expect.stringContaining("The Vision-First Brief"),
        }),
        expect.objectContaining({
          heading: "Looking Ahead",
          body: expect.stringContaining("Next Lesson: Speech as Construction"),
        }),
      ]),
    );
    expect(lesson.content.sections).toHaveLength(15);
  });

  it("delivers the supplied Speech as Construction curriculum for Lesson 1.5", () => {
    const lesson = COURSE_MODULES[0].lessons.find(
      (item) => item.number === "1.5",
    );

    expect(lesson.title).toBe("Speech as Construction");
    expect(lesson.content.intro).toBe(
      "What are your words building before the results become visible?",
    );
    expect(lesson.content.sections[0].heading).toBe("Introduction");
    expect(lesson.content.sections).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          heading: "Reclamation Protocol",
          body: expect.stringContaining("The Speech Audit"),
        }),
        expect.objectContaining({
          heading: "Looking Ahead",
          body: expect.stringContaining("Next Lesson: Authorship Returns"),
        }),
      ]),
    );
    expect(lesson.content.sections).toHaveLength(18);
  });

  it("delivers the supplied Authorship Returns curriculum for Lesson 1.6", () => {
    const lesson = COURSE_MODULES[0].lessons.find(
      (item) => item.number === "1.6",
    );

    expect(lesson.title).toBe("Authorship Returns");
    expect(lesson.content.intro).toBe(
      "If your mind has been shaped by inherited beliefs, repeated thoughts, tools, and language, what does it actually mean to become the author of your own life?",
    );
    expect(lesson.content.sections[0].heading).toBe("Introduction");
    expect(lesson.content.sections).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          heading: "Reclamation Protocol",
          body: expect.stringContaining("Personal Operating System Audit"),
        }),
        expect.objectContaining({
          heading: "Looking Ahead",
          body: expect.stringContaining(
            "Next Module: Correspondence — Patterns Across Worlds",
          ),
        }),
      ]),
    );
    expect(lesson.content.sections).toHaveLength(15);
  });

  it("delivers the supplied As Within, So Without curriculum for Lesson 2.1", () => {
    const lesson = COURSE_MODULES[1].lessons.find(
      (item) => item.number === "2.1",
    );

    expect(lesson.title).toBe("As Within, So Without");
    expect(lesson.content.intro).toBe(
      "What can the patterns in one part of your life reveal about the patterns operating elsewhere?",
    );
    expect(lesson.content.sections[0].heading).toBe("Introduction");
    expect(lesson.content.sections).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          heading: "Reclamation Protocol",
          body: expect.stringContaining("The Correspondence Map"),
        }),
        expect.objectContaining({
          heading: "Looking Ahead",
          body: expect.stringContaining("Next Lesson: The Part and the Pattern"),
        }),
      ]),
    );
    expect(lesson.content.sections).toHaveLength(17);
  });
});
