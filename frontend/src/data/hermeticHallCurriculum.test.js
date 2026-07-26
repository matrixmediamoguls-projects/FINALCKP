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

  it('uses the authored Hermetic Hall module titles', () => {
    expect(HERMETIC_HALL_FACULTY.modules.map((module) => module.title)).toEqual([
      'I. Mentalism: Before the Body, The ALL-mind',
      'II. Correspondence: As Above, So Below',
      'III. Vibration: The Motion Manifest',
      'IV. Polarity: Duality Decoded',
      'Law 05: Rhythm',
      'VI. Cause and Effect: Direct the Effect',
      'VII. Gender: The Dual Currents of Creation',
    ]);
  });

  it('delivers the complete Mentalism curriculum through the Hall practicum', () => {
    const mentalism = getHermeticHallModule('mentalism');

    expect(mentalism.sourceTrackIds).toEqual([
      'Adjacent (Reroute It)',
      'Thought Form',
      'I Create As I Speak',
    ]);
    expect(mentalism.curriculumSections).toHaveLength(3);
    mentalism.curriculumSections.forEach((section) => {
      expect(section).toEqual(expect.objectContaining({
        hook: expect.any(String),
        scenario: expect.any(String),
        chromaLens: expect.any(String),
        timelessContext: expect.any(String),
        practicalTranslation: expect.any(String),
        value: expect.any(String),
        coherence: expect.any(String),
      }));
    });
    expect(mentalism.shadowCodes).toHaveLength(3);
    expect(mentalism.lightMappings).toHaveLength(3);
    expect(mentalism.integrationKey).toContain('behavior authenticates the signal');
  });

  it('delivers the complete Correspondence curriculum through the Hall practicum', () => {
    const correspondence = getHermeticHallModule('correspondence');

    expect(correspondence.sourceTrackIds).toEqual([
      'Chosen Ones',
      'As Above, So Below',
      'The Witness Don’t Talk',
    ]);
    expect(correspondence.curriculumSections).toHaveLength(3);
    correspondence.curriculumSections.forEach((section) => {
      expect(section).toEqual(expect.objectContaining({
        hook: expect.any(String),
        scenario: expect.any(String),
        chromaLens: expect.any(String),
        timelessContext: expect.any(String),
        practicalTranslation: expect.any(String),
        value: expect.any(String),
        coherence: expect.any(String),
      }));
    });
    expect(correspondence.shadowCodes).toHaveLength(3);
    expect(correspondence.lightMappings).toHaveLength(3);
    expect(correspondence.integrationKey).toContain('preserve the differences');
  });

  it('delivers the complete Polarity curriculum through the Hall practicum', () => {
    const polarity = getHermeticHallModule('polarity');

    expect(polarity.sourceTrackIds).toEqual([
      'Hold On Through The Burial',
      'Flip It',
      'Where The Phantom Fell',
    ]);
    expect(polarity.curriculumSections).toHaveLength(3);
    polarity.curriculumSections.forEach((section) => {
      expect(section).toEqual(expect.objectContaining({
        hook: expect.any(String),
        scenario: expect.any(String),
        chromaLens: expect.any(String),
        timelessContext: expect.any(String),
        practicalTranslation: expect.any(String),
        value: expect.any(String),
        coherence: expect.any(String),
      }));
    });
    expect(polarity.shadowCodes).toHaveLength(3);
    expect(polarity.lightMappings).toHaveLength(3);
    expect(polarity.integrationKey).toContain('spectrum beneath the binary');
  });

  it('delivers the complete Rhythm curriculum through the Hall practicum', () => {
    const rhythm = getHermeticHallModule('rhythm');

    expect(rhythm.sourceTrackIds).toEqual([
      'Concrete Warnings',
      'Remember the Price (When You Speak The Name)',
      'Blueprint of the Divine',
      'Through The Fog',
    ]);
    expect(rhythm.curriculumSections).toHaveLength(3);
    rhythm.curriculumSections.forEach((section) => {
      expect(section).toEqual(expect.objectContaining({
        hook: expect.any(String),
        scenario: expect.any(String),
        chromaLens: expect.any(String),
        timelessContext: expect.any(String),
        practicalTranslation: expect.any(String),
        value: expect.any(String),
        coherence: expect.any(String),
      }));
    });
    expect(rhythm.shadowCodes).toHaveLength(3);
    expect(rhythm.lightMappings).toHaveLength(3);
    expect(rhythm.integrationKey).toContain('protect my baseline');
  });
});
