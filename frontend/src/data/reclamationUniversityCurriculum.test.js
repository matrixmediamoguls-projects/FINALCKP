import { describe, expect, it } from 'vitest';
import { RECLAMATION_CURRICULUM } from './reclamationUniversityCurriculum';

describe('Reclamation University curriculum integrity', () => {
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
      expect(faculty.artwork).toMatch(/^\/ui\/.+\.svg$/);
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
