import { describe, expect, it } from "vitest";
import { COURSE_MODULES } from "./hermeticCourseData";
import { LESSONS as VIBRATION_LESSONS } from "./hermeticVibrationModuleData";

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
    expect(lesson.exhibits).toEqual([
      expect.objectContaining({
        id: "exhibit-2-1",
        label: "Exhibit 2-1",
        title: "The Tree of Correspondence",
        src: "/reclamation-university/exhibits/exhibit-2-1.png",
      }),
    ]);
  });

  it("delivers the supplied Part and the Pattern curriculum for Lesson 2.2", () => {
    const lesson = COURSE_MODULES[1].lessons.find(
      (item) => item.number === "2.2",
    );

    expect(lesson.title).toBe("The Part and the Pattern");
    expect(lesson.content.intro).toBe(
      "How does one person shape a system—and how does the system shape the person in return?",
    );
    expect(lesson.content.sections[0].heading).toBe("Introduction");
    expect(lesson.content.sections).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          heading: "Reclamation Protocol",
          body: expect.stringContaining("The System Loop Map"),
        }),
        expect.objectContaining({
          heading: "Looking Ahead",
          body: expect.stringContaining(
            "Next Lesson: The Pattern Across Generations",
          ),
        }),
      ]),
    );
    expect(lesson.content.sections).toHaveLength(18);
  });

  it("delivers the supplied Pattern Across Generations curriculum for Lesson 2.3", () => {
    const lesson = COURSE_MODULES[1].lessons.find(
      (item) => item.number === "2.3",
    );

    expect(lesson.title).toBe("The Pattern Across Generations");
    expect(lesson.content.intro).toBe(
      "What if some of the patterns shaping your life began long before you were born?",
    );
    expect(lesson.content.sections[0].heading).toBe("Introduction");
    expect(lesson.content.sections).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          heading: "Reclamation Protocol",
          body: expect.stringContaining("Generational Pattern Map"),
        }),
        expect.objectContaining({
          heading: "Looking Ahead",
          body: expect.stringContaining("Next Lesson: The Fractal Mind"),
        }),
      ]),
    );
    expect(lesson.content.sections).toHaveLength(15);
  });

  it("delivers the supplied Fractal Mind curriculum for Lesson 2.4", () => {
    const lesson = COURSE_MODULES[1].lessons.find(
      (item) => item.number === "2.4",
    );

    expect(lesson.title).toBe("The Fractal Mind");
    expect(lesson.content.intro).toBe(
      "What can a small recurring pattern reveal about the larger structure of your life?",
    );
    expect(lesson.content.sections[0].heading).toBe("Introduction");
    expect(lesson.content.sections).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          heading: "Reclamation Protocol",
          body: expect.stringContaining("The Fractal Pattern Audit"),
        }),
        expect.objectContaining({
          heading: "Looking Ahead",
          body: expect.stringContaining("Next Lesson: Analogy Without Illusion"),
        }),
      ]),
    );
    expect(lesson.content.sections).toHaveLength(23);
  });

  it("delivers the supplied Analogy Without Illusion curriculum for Lesson 2.5", () => {
    const lesson = COURSE_MODULES[1].lessons.find(
      (item) => item.number === "2.5",
    );

    expect(lesson.title).toBe("Analogy Without Illusion");
    expect(lesson.content.intro).toBe(
      "How can comparison reveal truth without becoming a substitute for evidence?",
    );
    expect(lesson.content.sections[0].heading).toBe("Introduction");
    expect(lesson.content.sections).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          heading: "Reclamation Protocol",
          body: expect.stringContaining("The Analogy Test"),
        }),
        expect.objectContaining({
          heading: "Looking Ahead",
          body: expect.stringContaining("Next Lesson: Alignment Across Worlds"),
        }),
      ]),
    );
    expect(lesson.content.sections).toHaveLength(27);
  });

  it("delivers the supplied Alignment Across Worlds curriculum for Lesson 2.6", () => {
    const lesson = COURSE_MODULES[1].lessons.find(
      (item) => item.number === "2.6",
    );

    expect(lesson.title).toBe("Alignment Across Worlds");
    expect(lesson.content.intro).toBe(
      "What happens when your inner world and outer life begin moving in the same direction?",
    );
    expect(lesson.content.sections[0].heading).toBe("Introduction");
    expect(lesson.content.sections).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          heading: "Reclamation Protocol",
          body: expect.stringContaining("Personal Pattern Map"),
        }),
        expect.objectContaining({
          heading: "Looking Ahead",
          body: expect.stringContaining(
            "Next Module: Vibration — Everything Moves",
          ),
        }),
      ]),
    );
    expect(
      lesson.content.sections.filter(({ heading }) => heading === "Reflection"),
    ).toHaveLength(1);
    expect(lesson.content.sections).toHaveLength(21);
  });

  it("delivers the supplied Everything Is in Motion curriculum for Lesson 3.1", () => {
    const lesson = VIBRATION_LESSONS.find(
      (item) => item.number === "3.1",
    );

    expect(lesson.title).toBe("Everything Is in Motion");
    expect(lesson.content.intro).toBe(
      "What changes when you stop treating stillness as the natural state of life?",
    );
    expect(lesson.content.sections[0].heading).toBe("Introduction");
    expect(lesson.content.sections).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          heading: "Reclamation Protocol",
          body: expect.stringContaining("The Movement Audit"),
        }),
        expect.objectContaining({
          heading: "Looking Ahead",
          body: expect.stringContaining("Next Lesson: Receive the Signal"),
        }),
      ]),
    );
    expect(lesson.content.sections).toHaveLength(44);
  });

  it("delivers the supplied Receive the Signal curriculum for Lesson 3.2", () => {
    const lesson = VIBRATION_LESSONS.find(
      (item) => item.number === "3.2",
    );

    expect(lesson.title).toBe("Receive the Signal");
    expect(lesson.content.intro).toBe(
      "Why do some experiences shape us deeply while others pass through us almost unnoticed?",
    );
    expect(lesson.content.sections[0].heading).toBe("Introduction");
    expect(lesson.content.sections).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          heading: "Reclamation Protocol",
          body: expect.stringContaining("Signal Inventory"),
        }),
        expect.objectContaining({
          heading: "Looking Ahead",
          body: expect.stringContaining("Next Lesson: Living Frequencies"),
        }),
      ]),
    );
    expect(lesson.content.sections).toHaveLength(23);
  });

  it("delivers the supplied Living Frequencies curriculum for Lesson 3.3", () => {
    const lesson = VIBRATION_LESSONS.find(
      (item) => item.number === "3.3",
    );

    expect(lesson.title).toBe("Living Frequencies");
    expect(lesson.content.intro).toBe(
      "How do repeated states become the patterns from which we think, act, and relate?",
    );
    expect(lesson.content.sections[0].heading).toBe("Introduction");
    expect(lesson.content.sections).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          heading: "Reclamation Protocol",
          body: expect.stringContaining("The Living Frequency Audit"),
        }),
        expect.objectContaining({
          heading: "Looking Ahead",
          body: expect.stringContaining(
            "Next Lesson: Resonance and Environment",
          ),
        }),
      ]),
    );
    expect(lesson.content.sections).toHaveLength(29);
  });

  it("delivers the supplied Resonance and Environment curriculum for Lesson 3.4", () => {
    const lesson = VIBRATION_LESSONS.find(
      (item) => item.number === "3.4",
    );

    expect(lesson.title).toBe("Resonance and Environment");
    expect(lesson.content.intro).toBe(
      "How do people, places, and systems strengthen the patterns we already carry?",
    );
    expect(lesson.content.sections[0].heading).toBe("Introduction");
    expect(lesson.content.sections).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          heading: "Reclamation Protocol",
          body: expect.stringContaining("The Resonance Map"),
        }),
        expect.objectContaining({
          heading: "Looking Ahead",
          body: expect.stringContaining("Next Lesson: Amplify the Signal"),
        }),
      ]),
    );
    expect(lesson.content.sections).toHaveLength(31);
  });

  it("delivers the supplied Amplify the Signal curriculum for Lesson 3.5", () => {
    const lesson = VIBRATION_LESSONS.find(
      (item) => item.number === "3.5",
    );

    expect(lesson.title).toBe("Amplify the Signal");
    expect(lesson.content.intro).toBe(
      "What happens when a thought, emotion, message, or action continues beyond the person who first expressed it?",
    );
    expect(lesson.content.sections[0].heading).toBe("Introduction");
    expect(lesson.content.sections).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          heading: "Reclamation Protocol",
          body: expect.stringContaining("Signal Amplification Audit"),
        }),
        expect.objectContaining({
          heading: "Looking Ahead",
          body: expect.stringContaining("Next Lesson: Preparing for Rhythm"),
        }),
      ]),
    );
    expect(lesson.content.sections).toHaveLength(25);
  });

  it("delivers the supplied Preparing for Rhythm curriculum for Lesson 3.6", () => {
    const lesson = VIBRATION_LESSONS.find(
      (item) => item.number === "3.6",
    );

    expect(lesson.title).toBe("Preparing for Rhythm");
    expect(lesson.content.intro).toBe(
      "How does repeated movement become a cycle, and how can we respond without being controlled by it?",
    );
    expect(lesson.content.sections[0].heading).toBe("Introduction");
    expect(lesson.content.sections).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          heading: "Reclamation Protocol",
          body: expect.stringContaining("The Frequency and Rhythm Audit"),
        }),
        expect.objectContaining({
          heading: "Module Artifact",
          body: expect.stringContaining("The Personal Frequency Audit"),
        }),
        expect.objectContaining({
          heading: "Looking Ahead",
          body: expect.stringContaining("Next Module: Rhythm"),
        }),
      ]),
    );
    expect(lesson.content.sections).toHaveLength(32);
  });

  it("delivers the supplied Nature of Cycles curriculum for Lesson 4.1", () => {
    const lesson = COURSE_MODULES[3].lessons.find(
      (item) => item.number === "4.1",
    );

    expect(lesson.title).toBe("The Nature of Cycles");
    expect(lesson.content.intro).toBe(
      "Why do patterns repeat across nature, people, societies, and history—and what can those repetitions teach us?",
    );
    expect(lesson.content.sections[0].heading).toBe("Introduction");
    expect(lesson.content.sections).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          heading: "Reclamation Protocol",
          body: expect.stringContaining("Pattern Recognition Audit"),
        }),
        expect.objectContaining({
          heading: "Looking Ahead",
          body: expect.stringContaining(
            "Next Lesson: Oscillation — Why Systems Swing",
          ),
        }),
      ]),
    );
    expect(lesson.content.sections).toHaveLength(22);
  });
});
