import { describe, expect, it } from 'vitest';
import { COURSE_MODULES } from '../../../data/hermeticCourseData';
import { HERMETIC_HALL_FACULTY } from '../../../data/hermeticHallCurriculum';
import { LESSONS as VIBRATION_LESSONS } from '../../../data/hermeticVibrationModuleData';
import { buildHermeticLessonContent } from './hermeticLessonContent';

const concepts = [
  {
    title: '01 · First Concept',
    anchor: 'Anchor statement',
    hook: 'Hook copy',
    scenario: 'Scenario copy',
    chromaLens: 'Chroma copy',
    timelessContext: 'Historical copy',
    practicalTranslation: 'Practice copy',
    value: 'Value copy',
    coherence: 'Coherence copy',
  },
  {
    title: '02 · Second Concept',
    anchor: 'Second anchor',
    hook: 'Second hook',
    scenario: 'Second scenario',
    chromaLens: 'Second chroma',
    timelessContext: 'Second history',
    practicalTranslation: 'Second practice',
    value: 'Second value',
    coherence: 'Second coherence',
  },
];

describe('Hermetic lesson content adapter', () => {
  it('mounts every required curriculum section into an active lesson body', () => {
    const content = buildHermeticLessonContent({
      lesson: {
        number: '1.1',
        title: 'The Mind as Medium',
        summary: 'Lesson-specific introduction.',
        keyPoints: ['Perception versus event'],
      },
      lessonIndex: 0,
      lessonCount: 4,
      curriculumSections: concepts,
    });

    expect(content.intro).toBe('Lesson-specific introduction.');
    expect(content.sections.map((section) => section.heading)).toEqual([
      'Lesson Focus',
      'Hook',
      'Real-World 2026 Scenario',
      'Chroma Key / Reclamation Lens',
      'Historical / Timeless Context',
      'Practical Translation',
      'Why This Matters',
      'Coherence Reinforcement',
    ]);
    expect(content.sections[0].bullets).toEqual(['Perception versus event']);
    expect(content.sections[1].body).toBe('Hook copy');
  });

  it('distributes later lessons across later authored concepts', () => {
    const content = buildHermeticLessonContent({
      lesson: { number: '1.4', title: 'Later Lesson', summary: 'Later summary', keyPoints: [] },
      lessonIndex: 3,
      lessonCount: 4,
      curriculumSections: concepts,
    });

    expect(content.sections[0].callout).toBe('Second anchor');
    expect(content.sections[1].body).toBe('Second hook');
  });

  it('provides full live lesson bodies for every Hermetic Hall lesson', () => {
    COURSE_MODULES.forEach((courseModule) => {
      if (courseModule.number === 3) {
        VIBRATION_LESSONS.forEach((lesson) => {
          expect(lesson.content?.sections?.length).toBeGreaterThan(0);
        });
        return;
      }

      const hallModule = HERMETIC_HALL_FACULTY.modules.find(
        (module) => module.order === courseModule.number
      );
      expect(hallModule?.curriculumSections?.length).toBeGreaterThan(0);

      courseModule.lessons.forEach((lesson, lessonIndex) => {
        const content = buildHermeticLessonContent({
          lesson,
          lessonIndex,
          lessonCount: courseModule.lessons.length,
          curriculumSections: hallModule.curriculumSections,
        });

        expect(content.intro).toBe(lesson.summary);
        expect(content.sections).toHaveLength(8);
        expect(content.reflection.questions).toHaveLength(3);
      });
    });
  });
});
