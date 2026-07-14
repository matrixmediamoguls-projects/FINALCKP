import { describe, expect, it } from 'vitest';
import { RECLAMATION_CURRICULUM, getModuleBySlug } from './reclamationUniversityCurriculum';

describe('Reclamation University curriculum integrity', () => {
  it('does not expose the removed legacy Foundations Module 1', () => {
    expect(getModuleBySlug('foundations', 'fire-door')).toBeUndefined();
    expect(
      RECLAMATION_CURRICULUM.faculties
        .flatMap((faculty) => faculty.modules)
        .some((module) => module.id === 'module-fire-door')
    ).toBe(false);
    expect(
      RECLAMATION_CURRICULUM.faculties.find((faculty) => faculty.slug === 'foundations')?.artwork
    ).toBeNull();
  });

  it('uses globally unique, faculty-namespaced Shadow Code IDs', () => {
    const ids = RECLAMATION_CURRICULUM.faculties.flatMap((faculty) =>
      faculty.modules.flatMap((module) => module.shadowCodes.map((code) => code.id))
    );

    expect(new Set(ids).size).toBe(ids.length);
    RECLAMATION_CURRICULUM.faculties.forEach((faculty) => {
      faculty.modules.forEach((module) => {
        module.shadowCodes.forEach((code) => expect(code.id).toMatch(new RegExp(`^${faculty.slug}-SC-\\d+$`)));
        module.lightMappings.forEach((mapping) => expect(ids).toContain(mapping.shadowId));
      });
    });
  });

  it('provides accessible artwork and measurable assessment metadata', () => {
    RECLAMATION_CURRICULUM.faculties.forEach((faculty) => {
      if (faculty.artwork) expect(faculty.artwork).toMatch(/^\/ui\/.+\.svg$/);
      expect(faculty.artworkAlt).toContain(faculty.title);

      faculty.modules.forEach((module) => {
        expect(module.learningObjectives).toHaveLength(3);
        module.declarationFields.forEach((field) => {
          expect(field.feedbackCopy.length).toBeGreaterThan(20);
          expect(field.rubricCriteria).toHaveLength(3);
        });
      });
    });
  });
});
