/**
 * Sovereign Runtime — action types and creators.
 *
 * Every state mutation in the runtime goes through one of these. Components
 * never dispatch raw objects or mutate state directly — see
 * SovereignProvider.jsx, which only exposes these as bound functions.
 */

export const SOVEREIGN_ACTION_TYPES = Object.freeze({
  HYDRATE: 'sovereign/hydrate',
  SET_IDENTITY: 'sovereign/setIdentity',
  START_MODULE: 'sovereign/startModule',
  ADVANCE_STEP: 'sovereign/advanceStep',
  COMPLETE_STEP: 'sovereign/completeStep',
  RECORD_REFLECTION: 'sovereign/recordReflection',
  SELECT_CONCEPT: 'sovereign/selectConcept',
  CONNECT_CONCEPTS: 'sovereign/connectConcepts',
  EXECUTE_PROTOCOL: 'sovereign/executeProtocol',
  GENERATE_ARTIFACT: 'sovereign/generateArtifact',
  SEAL_ARTIFACT: 'sovereign/sealArtifact',
});

function withMeta(type, payload = {}) {
  return { type, payload, meta: { timestamp: new Date().toISOString() } };
}

export const hydrate = (state) => withMeta(SOVEREIGN_ACTION_TYPES.HYDRATE, { state });

export const setIdentity = (identity) =>
  withMeta(SOVEREIGN_ACTION_TYPES.SET_IDENTITY, { identity });

export const startModule = (moduleId) =>
  withMeta(SOVEREIGN_ACTION_TYPES.START_MODULE, { moduleId });

export const advanceStep = (moduleId, stepId) =>
  withMeta(SOVEREIGN_ACTION_TYPES.ADVANCE_STEP, { moduleId, stepId });

export const completeStep = (moduleId, stepId, criteria = {}) =>
  withMeta(SOVEREIGN_ACTION_TYPES.COMPLETE_STEP, { moduleId, stepId, criteria });

export const recordReflection = (moduleId, promptId, response) =>
  withMeta(SOVEREIGN_ACTION_TYPES.RECORD_REFLECTION, { moduleId, promptId, response });

export const selectConcept = (conceptId) =>
  withMeta(SOVEREIGN_ACTION_TYPES.SELECT_CONCEPT, { conceptId });

export const connectConcepts = (fromConceptId, toConceptId, relationship) =>
  withMeta(SOVEREIGN_ACTION_TYPES.CONNECT_CONCEPTS, {
    fromConceptId,
    toConceptId,
    relationship,
  });

export const executeProtocol = (protocolId, payload) =>
  withMeta(SOVEREIGN_ACTION_TYPES.EXECUTE_PROTOCOL, { protocolId, payload });

export const generateArtifact = (draft) =>
  withMeta(SOVEREIGN_ACTION_TYPES.GENERATE_ARTIFACT, { draft });

export const sealArtifact = () => withMeta(SOVEREIGN_ACTION_TYPES.SEAL_ARTIFACT);
