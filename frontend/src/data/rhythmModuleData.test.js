import { describe, expect, it } from 'vitest';
import { SECTION_IDS } from '../modules/sovereign/reclamation-university/curriculumSections';
import * as RHYTHM from './rhythmModuleData';
import {
  ARTIFACT_STAGES,
  ARTIFACT_VIEWS,
  DOMAINS,
  LENS,
  PHASES,
  PROTOCOL_STEPS,
  SUMMARY_CONTENT,
} from './rhythmModuleData';

/* Every string reachable from the module's exports, so the annotation guard
   below cannot be defeated by nesting. */
function collectStrings(value, out = []) {
  if (typeof value === 'string') out.push(value);
  else if (Array.isArray(value)) value.forEach((item) => collectStrings(item, out));
  else if (value && typeof value === 'object') Object.values(value).forEach((item) => collectStrings(item, out));
  return out;
}

const ALL_STRINGS = collectStrings(RHYTHM);

describe('Module V — Rhythm content', () => {
  /* The master document interleaves learner copy with production direction and
     is explicit that the latter must never render. This is the guard. */
  it('carries no production annotations into learner-facing copy', () => {
    const leaked = ALL_STRINGS.filter((s) => /ANNOTATION|MASTER DOCUMENT|LEARNER-FACING COPY/i.test(s));
    expect(leaked).toEqual([]);
  });

  it('runs the four phases used by the cycle, the phase model and the artifact ring', () => {
    expect(PHASES.map((p) => p.label)).toEqual([
      'EXPANSION',
      'PEAK',
      'CONTRACTION',
      'RESTORATION',
    ]);
    /* Each phase must answer what it supports, what goes wrong, what to watch. */
    PHASES.forEach((phase) => {
      expect(phase.supports).toBeTruthy();
      expect(phase.risk).toBeTruthy();
      expect(phase.response).toBeTruthy();
    });
  });

  it('covers six domains and six 2026-lens systems', () => {
    expect(DOMAINS).toHaveLength(6);
    expect(LENS).toHaveLength(6);
    DOMAINS.forEach((d) => expect(d.timeline).toHaveLength(4));
    LENS.forEach((l) => expect(l.phases).toHaveLength(4));
  });

  it('runs the Rhythm Audit as eight steps with unique ids', () => {
    expect(PROTOCOL_STEPS).toHaveLength(8);
    const ids = PROTOCOL_STEPS.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
    /* The four Personal Workspace questions must each land on a step. */
    expect(PROTOCOL_STEPS.filter((s) => s.workspace)).toHaveLength(4);
  });

  it('builds the artifact from six stages with unique field ids', () => {
    expect(ARTIFACT_STAGES.map((s) => s.stage)).toEqual([
      'IDENTIFY',
      'OBSERVE',
      'MAP',
      'INTERPRET',
      'APPLY',
      'INTEGRATE',
    ]);
    const fieldIds = ARTIFACT_STAGES.flatMap((s) => s.fields.map((f) => f.id));
    expect(new Set(fieldIds).size).toBe(fieldIds.length);
    /* The intervention point is what distinguishes the Rhythm Map from the
       Module IV Polarity Map — it must exist for the artifact to mean anything. */
    expect(fieldIds).toContain('intervention');
  });

  it('reaches every artifact stage across the three views, and pins the intervention', () => {
    const stageNumbers = ARTIFACT_STAGES.map((s) => s.n);
    const reached = new Set(ARTIFACT_VIEWS.flatMap((v) => v.stages));
    stageNumbers.forEach((n) => expect(reached).toContain(n));

    /* APPLY carries the intervention point. It is the artifact's differentiator,
       so no view may hide it behind a toggle the learner has to discover. */
    const applyStage = ARTIFACT_STAGES.find((s) => s.stage === 'APPLY');
    ARTIFACT_VIEWS.forEach((view) => expect(view.stages).toContain(applyStage.n));
  });

  it('resolves every Summary "what you discovered" slot to real learner data', () => {
    const artifactFieldIds = ARTIFACT_STAGES.flatMap((s) => s.fields.map((f) => f.id));
    const protocolIds = PROTOCOL_STEPS.map((s) => s.id);
    SUMMARY_CONTENT.discovered.forEach((item) => {
      expect(artifactFieldIds).toContain(item.id);
      expect(protocolIds).toContain(item.id);
    });
  });

  it('keeps the eleven canonical curriculum section ids as the contract', () => {
    expect(SECTION_IDS).toHaveLength(11);
    expect(SECTION_IDS).toContain('protocol');
    expect(SECTION_IDS).toContain('artifact');
  });
});
