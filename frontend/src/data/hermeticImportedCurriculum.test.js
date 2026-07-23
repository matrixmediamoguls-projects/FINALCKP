import { describe, expect, it } from 'vitest';
import { COURSE_MODULES } from './hermeticCourseData';
import {
  COHERENCE_QUESTIONS,
  LESSONS,
  LIGHT_CODES,
  SHADOW_CODES,
  TRACKS,
} from './hermeticVibrationModuleData';

describe('imported Hermetic Matrix curriculum', () => {
  it('preserves all seven modules and forty-four authored lesson records', () => {
    expect(COURSE_MODULES).toHaveLength(7);
    expect(COURSE_MODULES.flatMap((module) => module.lessons)).toHaveLength(44);
  });

  it('preserves the complete Vibration curriculum package', () => {
    expect(LESSONS).toHaveLength(6);
    expect(LESSONS.every((lesson) => lesson.content.sections.length > 0)).toBe(true);
    expect(TRACKS).toHaveLength(3);
    expect(SHADOW_CODES).toHaveLength(9);
    expect(LIGHT_CODES).toHaveLength(9);
    expect(COHERENCE_QUESTIONS).toHaveLength(10);
  });
});
