import { describe, expect, it } from 'vitest';
import { SECTION_IDS } from '../modules/sovereign/reclamation-university/curriculumSections';
import * as CAUSE_EFFECT from './causeEffectModuleData';
import {
  AGENCY_BUCKETS,
  ARTIFACT_STAGES,
  CASCADE,
  CHAIN_NODES,
  COMPLETION_CONDITIONS,
  DOMAINS,
  KEY_CONCEPTS,
  LENS,
  LENS_TRACE_STEPS,
  PROTOCOL_STEPS,
  SUMMARY_CONTENT,
} from './causeEffectModuleData';

function collectStrings(value, out = []) {
  if (typeof value === 'string') out.push(value);
  else if (Array.isArray(value)) value.forEach((item) => collectStrings(item, out));
  else if (value && typeof value === 'object') Object.values(value).forEach((item) => collectStrings(item, out));
  return out;
}

const ALL_STRINGS = collectStrings(CAUSE_EFFECT);

describe('Module VI — Cause & Effect content', () => {
  /* The master separates learner copy from production direction and states that
     annotations "must not be rendered as instructional text". This is the guard. */
  it('carries no production annotations into learner-facing copy', () => {
    const leaked = ALL_STRINGS.filter((s) =>
      /\[ANNOTATION|LEARNER-FACING COPY|MASTER COPY|NOT LEARNER COPY/i.test(s));
    expect(leaked).toEqual([]);
  });

  it('runs the six-concept causal vocabulary the protocol depends on', () => {
    expect(KEY_CONCEPTS.map((c) => c.title)).toEqual([
      'CONDITION', 'CAUSE', 'OMISSION', 'FEEDBACK', 'DELAY', 'INTERVENTION',
    ]);
    KEY_CONCEPTS.forEach((c) => {
      expect(c.teaser).toBeTruthy();      /* definition */
      expect(c.body.length).toBeGreaterThan(0); /* example */
      expect(c.practice).toBeTruthy();    /* diagnostic question */
    });
  });

  it('models the cascade as richer than a linear cause → effect arrow', () => {
    expect(CASCADE.map((s) => s.label)).toEqual([
      'CONDITIONS', 'CHOICES', 'ACTIONS / OMISSIONS', 'EFFECTS', 'CONSEQUENCES', 'FEEDBACK',
    ]);
    CASCADE.forEach((stage) => expect(stage.role).toBeTruthy());
    expect(CHAIN_NODES).toHaveLength(6);
  });

  it('gives every domain and 2026 case a complexity caveat', () => {
    expect(DOMAINS).toHaveLength(6);
    expect(LENS).toHaveLength(6);
    /* The master forbids presenting these as deterministic equations, so the
       caveat is structural rather than optional. */
    DOMAINS.forEach((d) => {
      expect(d.causal).toBeTruthy();
      expect(d.complexity).toBeTruthy();
      expect(d.transfer).toBeTruthy();
    });
    LENS.forEach((l) => {
      expect(l.question).toBeTruthy();
      expect(l.complication).toBeTruthy();
      expect(l.intervention).toBeTruthy();
      expect(l.trace).toHaveLength(LENS_TRACE_STEPS.length);
    });
  });

  it('runs the Causal Trace as eight steps, splitting agency into four buckets', () => {
    expect(PROTOCOL_STEPS).toHaveLength(8);
    const ids = PROTOCOL_STEPS.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
    /* The three Personal Causal Trace questions must each land on a step. */
    expect(PROTOCOL_STEPS.filter((s) => s.workspace)).toHaveLength(3);

    const agencyStep = PROTOCOL_STEPS.find((s) => s.id === 'agency');
    expect(agencyStep.buckets).toBe(AGENCY_BUCKETS);
    expect(AGENCY_BUCKETS.map((b) => b.label)).toEqual([
      'OUTSIDE MY CONTROL', 'INFLUENCED BY ME', 'INFLUENCED BY OTHERS', 'UNCERTAIN',
    ]);
  });

  it('builds the artifact from six stages with unique field ids', () => {
    expect(ARTIFACT_STAGES.map((s) => s.stage)).toEqual([
      'IDENTIFY', 'OBSERVE', 'MAP', 'INTERPRET', 'APPLY', 'INTEGRATE',
    ]);
    const fieldIds = ARTIFACT_STAGES.flatMap((s) => s.fields.map((f) => f.id));
    expect(new Set(fieldIds).size).toBe(fieldIds.length);
    /* The lever is what makes the map actionable rather than a confession. */
    expect(fieldIds).toContain('lever');
    expect(fieldIds).toContain('evidence');
  });

  it('marks only the pattern statement as generated', () => {
    const generated = ARTIFACT_STAGES
      .flatMap((s) => s.fields)
      .filter((f) => f.generated)
      .map((f) => f.id);
    expect(generated).toEqual(['pattern']);
  });

  it('resolves every Summary "what you discovered" slot to real learner data', () => {
    const artifactFieldIds = ARTIFACT_STAGES.flatMap((s) => s.fields.map((f) => f.id));
    SUMMARY_CONTENT.discovered.forEach((item) => {
      expect(artifactFieldIds).toContain(item.id);
    });
  });

  it('defines a completion condition for each of the eleven sections', () => {
    expect(COMPLETION_CONDITIONS.map((c) => c.id)).toEqual(SECTION_IDS);
    /* Progress must represent meaningful learning: the sections the master calls
       out cannot complete on a visit alone. */
    const byId = Object.fromEntries(COMPLETION_CONDITIONS.map((c) => [c.id, c.kind]));
    expect(byId['key-concepts']).toBe('engagement');
    expect(byId.domains).toBe('engagement');
    expect(byId['2026-lens']).toBe('engagement');
    expect(byId.reflection).toBe('input');
    expect(byId.protocol).toBe('input');
    expect(byId.artifact).toBe('input');
  });
});
