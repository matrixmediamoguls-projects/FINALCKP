import { describe, expect, it } from 'vitest';
import { HERMETIC_HALL_FACULTY, getHermeticHallModule } from './hermeticHallCurriculum';

describe('new Hermetic Hall shell', () => {
  it('defines seven selectable principles', () => {
    expect(HERMETIC_HALL_FACULTY.modules.map((module) => module.slug)).toEqual([
      'mentalism',
      'correspondence',
      'vibration',
      'polarity',
      'rhythm',
      'cause-and-effect',
      'gender',
    ]);
  });

  it('contains no legacy lessons or curriculum sections', () => {
    HERMETIC_HALL_FACULTY.modules.forEach((module) => {
      expect(module.lessons).toEqual([]);
      expect(module.curriculumSections).toEqual([]);
      expect(getHermeticHallModule(module.slug)).toBe(module);
    });
  });
});
