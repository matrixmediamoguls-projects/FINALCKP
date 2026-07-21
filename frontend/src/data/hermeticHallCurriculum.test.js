import { describe, expect, it } from 'vitest';
import { HERMETIC_HALL_FACULTY, getHermeticHallModule } from './hermeticHallCurriculum';

describe('Hermetic Hall curriculum', () => {
  it('defines one unique module for each Hermetic law', () => {
    const modules = HERMETIC_HALL_FACULTY.modules;
    expect(modules).toHaveLength(7);
    expect(new Set(modules.map((module) => module.id)).size).toBe(7);
    expect(new Set(modules.map((module) => module.slug)).size).toBe(7);
  });

  it('resolves every Hall module without reusing an Act or legacy faculty module', () => {
    HERMETIC_HALL_FACULTY.modules.forEach((module) => {
      expect(getHermeticHallModule(module.slug)).toBe(module);
      expect(module.id).toMatch(/^hermetic-law-/);
    });
  });
});
