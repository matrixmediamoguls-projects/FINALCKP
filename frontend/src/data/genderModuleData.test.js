import { describe, expect, it } from 'vitest';
import { SECTION_IDS } from '../modules/sovereign/reclamation-university/curriculumSections';
import * as GENDER from './genderModuleData';
import {
  ARTIFACT_STAGES,
  COMPLETION_CONDITIONS,
  CURRENT_STATES,
  DOMAINS,
  KEY_CONCEPTS,
  LENS,
  PROTOCOL_STEPS,
  SUMMARY_CONTENT,
  WHY_IT_MATTERS,
} from './genderModuleData';

function collectStrings(value, out = []) {
  if (typeof value === 'string') out.push(value);
  else if (Array.isArray(value)) value.forEach((item) => collectStrings(item, out));
  else if (value && typeof value === 'object') Object.values(value).forEach((item) => collectStrings(item, out));
  return out;
}

const ALL_STRINGS = collectStrings(GENDER);

describe('Module VII — Gender content', () => {
  it('carries no production annotations into learner-facing copy', () => {
    const leaked = ALL_STRINGS.filter((s) =>
      /\[EDITORIAL|\[UI ANNOTATION|\[INTERACTION|\[VISUAL|\[SYSTEM|\[QA|MASTER COPY|LEARNER-FACING/i.test(s));
    expect(leaked).toEqual([]);
  });

  /* The master's central editorial correction: Gender is generative
     relationship, never a binary personality system or a prescription of
     identity or social roles. The historical wording survives only inside the
     quoted principle and the passage that immediately contextualizes it. */
  it('keeps the historical terminology quoted and contextualized, never prescriptive', () => {
    const gendered = ALL_STRINGS.filter((s) => /\bmasculine\b|\bfeminine\b/i.test(s));
    expect(gendered).toHaveLength(2);
    expect(gendered.some((s) => s.startsWith('Gender is in everything'))).toBe(true);
    expect(gendered.some((s) => s.includes('traditional Hermetic language'))).toBe(true);

    /* No copy may assign a force to men or to women. */
    const assigns = ALL_STRINGS.filter(
      (s) => /\b(men|women)\b/i.test(s) && !/does not mean that one force belongs/i.test(s));
    expect(assigns).toEqual([]);
  });

  it('models the three generative states rather than two opposing sides', () => {
    expect(CURRENT_STATES.map((s) => s.label)).toEqual(['INITIATE', 'RECEIVE', 'CREATE']);
    /* Each definition must be readable as text — the diagram is never the only
       route to the meaning. */
    CURRENT_STATES.forEach((s) => expect(s.role).toBeTruthy());
  });

  it('runs four operating concepts and six domains', () => {
    expect(KEY_CONCEPTS).toHaveLength(4);
    KEY_CONCEPTS.forEach((c) => expect(c.practice.length).toBeGreaterThan(0));
    expect(DOMAINS).toHaveLength(6);
    DOMAINS.forEach((d) => {
      expect(d.pattern).toBeTruthy();
      expect(d.why).toBeTruthy();
      expect(d.practice.length).toBeGreaterThan(0);
    });
    expect(LENS).toHaveLength(6);
  });

  it('makes the exile sequence educational rather than decorative', () => {
    expect(WHY_IT_MATTERS.sequence.map((s) => s.label)).toEqual([
      'EXILE', 'IMBALANCE', 'DISTORTION', 'BREAKDOWN', 'INTEGRATION',
    ]);
    /* Every stage carries both its definition and a worked expansion. */
    WHY_IT_MATTERS.sequence.forEach((stage) => {
      expect(stage.definition).toBeTruthy();
      expect(stage.example).toBeTruthy();
    });
  });

  it('runs Force Dialogue as seven steps closing on observation', () => {
    expect(PROTOCOL_STEPS).toHaveLength(7);
    const ids = PROTOCOL_STEPS.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
    /* Step 07 is the deliberate addition: evidence, not merely intention. */
    expect(PROTOCOL_STEPS[6].id).toBe('observe');

    /* The Personal Workspace has exactly three primary inputs; the remaining
       steps are state rather than additional fields. */
    const workspace = PROTOCOL_STEPS.flatMap((s) => (s.fields ? s.fields : [s]))
      .filter((f) => f.workspace);
    expect(workspace).toHaveLength(3);
  });

  it('builds the artifact from six stages with unique field ids', () => {
    expect(ARTIFACT_STAGES.map((s) => s.stage)).toEqual([
      'IDENTIFY', 'OBSERVE', 'MAP', 'INTERPRET', 'APPLY', 'INTEGRATE',
    ]);
    const fieldIds = ARTIFACT_STAGES.flatMap((s) => s.fields.map((f) => f.id));
    expect(new Set(fieldIds).size).toBe(fieldIds.length);
    expect(fieldIds).toContain('evidence');
    expect(fieldIds).toContain('notes');
  });

  it('marks only the pattern statement as generated', () => {
    const generated = ARTIFACT_STAGES
      .flatMap((s) => s.fields)
      .filter((f) => f.generated)
      .map((f) => f.id);
    expect(generated).toEqual(['statement']);
  });

  it('resolves every Summary "what you discovered" slot to an artifact field', () => {
    const fieldIds = ARTIFACT_STAGES.flatMap((s) => s.fields.map((f) => f.id));
    expect(SUMMARY_CONTENT.discovered).toHaveLength(5);
    SUMMARY_CONTENT.discovered.forEach((item) => expect(fieldIds).toContain(item.id));
  });

  it('defines a completion condition for each of the eleven sections', () => {
    expect(COMPLETION_CONDITIONS.map((c) => c.id)).toEqual(SECTION_IDS);
    /* Progress must represent meaningful learning actions, never tab-opening. */
    const byId = Object.fromEntries(COMPLETION_CONDITIONS.map((c) => [c.id, c.kind]));
    expect(byId['key-concepts']).toBe('engagement');
    expect(byId['why-it-matters']).toBe('engagement');
    expect(byId.domains).toBe('engagement');
    expect(byId.reclamation).toBe('engagement');
    expect(byId['2026-lens']).toBe('engagement');
    expect(byId.reflection).toBe('input');
    expect(byId.protocol).toBe('input');
    expect(byId.artifact).toBe('input');
  });
});
