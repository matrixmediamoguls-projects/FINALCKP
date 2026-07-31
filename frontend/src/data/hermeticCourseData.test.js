import { describe, expect, it } from 'vitest';
import { COURSE_MODULES, COURSE_MODULE_MAP } from './hermeticCourseData';

describe('new Reclamation University course shell', () => {
  it('keeps seven principle modules with no legacy lessons', () => {
    expect(COURSE_MODULES).toHaveLength(7);
    expect(COURSE_MODULES.every((module) => module.lessons.length === 0)).toBe(true);
  });

  it('maps every empty module shell by id', () => {
    COURSE_MODULES.forEach((module) => {
      expect(COURSE_MODULE_MAP[module.id]).toBe(module);
    });
  });
});
