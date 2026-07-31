import { describe, expect, it } from 'vitest';
import { COURSE_MODULES } from '../../../data/hermeticCourseData';
import { HERMETIC_HALL_FACULTY } from '../../../data/hermeticHallCurriculum';

describe('retired Hermetic lesson content', () => {
  it('has been removed from both live curriculum sources', () => {
    expect(COURSE_MODULES.flatMap((module) => module.lessons)).toEqual([]);
    expect(HERMETIC_HALL_FACULTY.modules.flatMap((module) => module.curriculumSections)).toEqual([]);
  });
});
