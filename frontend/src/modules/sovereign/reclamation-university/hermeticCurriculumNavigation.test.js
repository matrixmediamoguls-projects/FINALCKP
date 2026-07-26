import { describe, expect, it } from 'vitest';
import { getNextCurriculumDestination } from './hermeticCurriculumNavigation';

const lessons = [
  { id: 'lesson-1' },
  { id: 'lesson-2' },
];

const hallModules = [
  { order: 1, slug: 'mentalism' },
  { order: 2, slug: 'correspondence' },
  { order: 7, slug: 'gender' },
];

describe('Hermetic curriculum next lesson navigation', () => {
  it('advances to the next lesson in the active module', () => {
    expect(getNextCurriculumDestination({
      lessons,
      activeLessonId: 'lesson-1',
      hallModules,
      moduleOrder: 1,
    })).toEqual({ type: 'lesson', lessonId: 'lesson-2' });
  });

  it('advances from the final lesson to the next Hermetic module', () => {
    expect(getNextCurriculumDestination({
      lessons,
      activeLessonId: 'lesson-2',
      hallModules,
      moduleOrder: 1,
    })).toEqual({ type: 'module', slug: 'correspondence' });
  });

  it('returns the final lesson of the final module to the Hall', () => {
    expect(getNextCurriculumDestination({
      lessons,
      activeLessonId: 'lesson-2',
      hallModules,
      moduleOrder: 7,
    })).toEqual({ type: 'hall' });
  });
});
