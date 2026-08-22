import { describe, expect, it } from 'vitest';
import { sovereignReducer } from '../runtime/sovereignReducer';
import { createInitialState } from '../runtime/sovereignState';
import {
  startModule,
  advanceStep,
  selectConcept,
  connectConcepts,
  recordReflection,
  executeProtocol,
  generateArtifact,
  sealArtifact,
} from '../runtime/sovereignActions';
import { SOVEREIGN_STEP_IDS } from '../runtime/sovereignSteps';
import { mapActionToEvents } from './mapActionToEvents';
import { SOVEREIGN_EVENT_TYPES } from './eventTypes';

function dispatchAndMap(prevState, action) {
  const nextState = sovereignReducer(prevState, action);
  const events = mapActionToEvents(action, { prevState, nextState });
  return { nextState, events };
}

function types(events) {
  return events.map((event) => event.type);
}

const STEPS_BEFORE_REFLECTION = [
  SOVEREIGN_STEP_IDS.INTRO,
  SOVEREIGN_STEP_IDS.PRINCIPLE,
  SOVEREIGN_STEP_IDS.KEY_CONCEPTS,
  SOVEREIGN_STEP_IDS.WHY_IT_MATTERS,
  SOVEREIGN_STEP_IDS.DOMAINS,
  SOVEREIGN_STEP_IDS.RECLAMATION,
  SOVEREIGN_STEP_IDS.LENS_2026,
];

/** Walks a module through every step that gates REFLECTION/PROTOCOL/ARTIFACT — steps lock in order, so those can't complete without this. */
function walkToReflectionGate(state, moduleId) {
  let next = state;
  next = sovereignReducer(next, selectConcept('shadow-work')); // satisfies KEY_CONCEPTS
  for (const stepId of STEPS_BEFORE_REFLECTION) {
    next = sovereignReducer(next, advanceStep(moduleId, stepId));
  }
  return next;
}

describe('mapActionToEvents', () => {
  it('maps startModule to MODULE_ENTERED', () => {
    const { events } = dispatchAndMap(createInitialState(), startModule('mentalism'));
    expect(types(events)).toEqual([SOVEREIGN_EVENT_TYPES.MODULE_ENTERED]);
    expect(events[0].payload).toEqual({ moduleId: 'mentalism' });
  });

  it('maps advanceStep to STEP_STARTED, and to STEP_COMPLETED once the step criteria are actually met', () => {
    let state = createInitialState();
    ({ nextState: state } = dispatchAndMap(state, startModule('mentalism')));

    const { events } = dispatchAndMap(state, advanceStep('mentalism', SOVEREIGN_STEP_IDS.INTRO));

    // Navigating to intro both starts it and, because "viewed" is intro's
    // whole completion criterion, immediately satisfies it.
    expect(types(events)).toEqual([
      SOVEREIGN_EVENT_TYPES.STEP_STARTED,
      SOVEREIGN_EVENT_TYPES.STEP_COMPLETED,
    ]);
    expect(events[1].payload).toEqual({ moduleId: 'mentalism', stepId: SOVEREIGN_STEP_IDS.INTRO });
  });

  it('does not emit STEP_COMPLETED again once a step is already complete', () => {
    let state = createInitialState();
    ({ nextState: state } = dispatchAndMap(state, startModule('mentalism')));
    ({ nextState: state } = dispatchAndMap(state, advanceStep('mentalism', SOVEREIGN_STEP_IDS.INTRO)));

    // Re-navigating to the same already-complete step should not re-fire
    // STEP_COMPLETED.
    const { events } = dispatchAndMap(state, advanceStep('mentalism', SOVEREIGN_STEP_IDS.INTRO));
    expect(types(events)).toEqual([SOVEREIGN_EVENT_TYPES.STEP_STARTED]);
  });

  it('a committed reflection completes the REFLECTION step and emits both events', () => {
    let state = createInitialState();
    ({ nextState: state } = dispatchAndMap(state, startModule('mentalism')));
    state = walkToReflectionGate(state, 'mentalism');

    const { events } = dispatchAndMap(
      state,
      recordReflection('mentalism', SOVEREIGN_STEP_IDS.REFLECTION, 'a real reflection'),
    );

    expect(types(events)).toEqual([
      SOVEREIGN_EVENT_TYPES.REFLECTION_COMMITTED,
      SOVEREIGN_EVENT_TYPES.STEP_COMPLETED,
    ]);
    expect(events[1].payload.stepId).toBe(SOVEREIGN_STEP_IDS.REFLECTION);
  });

  it('an executed protocol completes the PROTOCOL step for the active module', () => {
    let state = createInitialState();
    ({ nextState: state } = dispatchAndMap(state, startModule('mentalism')));
    state = walkToReflectionGate(state, 'mentalism');
    state = sovereignReducer(
      state,
      recordReflection('mentalism', SOVEREIGN_STEP_IDS.REFLECTION, 'a real reflection'),
    );

    const { events } = dispatchAndMap(state, executeProtocol('vision-quest', {}, 'mentalism'));

    expect(types(events)).toEqual([
      SOVEREIGN_EVENT_TYPES.PROTOCOL_COMPLETED,
      SOVEREIGN_EVENT_TYPES.STEP_COMPLETED,
    ]);
  });

  it('the first artifact draft is ARTIFACT_STARTED; a redraft is ARTIFACT_EDITED', () => {
    let state = createInitialState();
    ({ nextState: state } = dispatchAndMap(state, startModule('mentalism')));

    const first = dispatchAndMap(state, generateArtifact({ title: 'v1' }));
    expect(types(first.events)).toEqual([SOVEREIGN_EVENT_TYPES.ARTIFACT_STARTED]);

    const second = dispatchAndMap(first.nextState, generateArtifact({ title: 'v2' }));
    expect(types(second.events)).toEqual([SOVEREIGN_EVENT_TYPES.ARTIFACT_EDITED]);
  });

  it('ARTIFACT_SEALED fires only on the real transition, and completes the ARTIFACT step', () => {
    let state = createInitialState();
    ({ nextState: state } = dispatchAndMap(state, startModule('mentalism')));
    state = walkToReflectionGate(state, 'mentalism');
    state = sovereignReducer(
      state,
      recordReflection('mentalism', SOVEREIGN_STEP_IDS.REFLECTION, 'a real reflection'),
    );
    state = sovereignReducer(state, executeProtocol('vision-quest', {}, 'mentalism'));
    ({ nextState: state } = dispatchAndMap(state, generateArtifact({ title: 'v1' })));

    const sealed = dispatchAndMap(state, sealArtifact());
    expect(types(sealed.events)).toEqual([
      SOVEREIGN_EVENT_TYPES.ARTIFACT_SEALED,
      SOVEREIGN_EVENT_TYPES.STEP_COMPLETED,
    ]);

    // Sealing again (no draft state change — already sealed) must not
    // re-fire ARTIFACT_SEALED.
    const sealedAgain = dispatchAndMap(sealed.nextState, sealArtifact());
    expect(types(sealedAgain.events)).toEqual([]);
  });

  it("sealArtifact with no draft at all is a reducer no-op and emits nothing", () => {
    const { events } = dispatchAndMap(createInitialState(), sealArtifact());
    expect(events).toEqual([]);
  });

  it('maps concept actions to CONCEPT_SELECTED / CONCEPT_CONNECTED', () => {
    const selected = dispatchAndMap(createInitialState(), selectConcept('shadow-work'));
    expect(types(selected.events)).toEqual([SOVEREIGN_EVENT_TYPES.CONCEPT_SELECTED]);

    const connected = dispatchAndMap(selected.nextState, connectConcepts('a', 'b', 'CAUSES'));
    expect(types(connected.events)).toEqual([SOVEREIGN_EVENT_TYPES.CONCEPT_CONNECTED]);
  });
});
