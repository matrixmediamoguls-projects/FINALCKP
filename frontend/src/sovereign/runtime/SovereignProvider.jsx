import React, { createContext, useMemo, useReducer } from 'react';
import { createInitialState } from './sovereignState';
import { sovereignReducer } from './sovereignReducer';
import * as actions from './sovereignActions';

export const SovereignContext = createContext(null);

/**
 * Owns the Sovereign Runtime's state tree. Components never get a raw
 * `dispatch` — only the bound action functions below, so state can only
 * change through the explicit actions defined in sovereignActions.js.
 */
export function SovereignProvider({ children, initialState }) {
  const [state, dispatch] = useReducer(sovereignReducer, initialState ?? createInitialState());

  const boundActions = useMemo(
    () => ({
      hydrate: (nextState) => dispatch(actions.hydrate(nextState)),
      setIdentity: (identity) => dispatch(actions.setIdentity(identity)),
      startModule: (moduleId) => dispatch(actions.startModule(moduleId)),
      advanceStep: (moduleId, stepId) => dispatch(actions.advanceStep(moduleId, stepId)),
      completeStep: (moduleId, stepId, criteria) =>
        dispatch(actions.completeStep(moduleId, stepId, criteria)),
      recordReflection: (moduleId, promptId, response) =>
        dispatch(actions.recordReflection(moduleId, promptId, response)),
      selectConcept: (conceptId) => dispatch(actions.selectConcept(conceptId)),
      connectConcepts: (fromConceptId, toConceptId, relationship) =>
        dispatch(actions.connectConcepts(fromConceptId, toConceptId, relationship)),
      executeProtocol: (protocolId, payload, moduleId) =>
        dispatch(actions.executeProtocol(protocolId, payload, moduleId)),
      generateArtifact: (draft) => dispatch(actions.generateArtifact(draft)),
      sealArtifact: () => dispatch(actions.sealArtifact()),
    }),
    [dispatch],
  );

  const value = useMemo(() => ({ state, actions: boundActions }), [state, boundActions]);

  return <SovereignContext.Provider value={value}>{children}</SovereignContext.Provider>;
}
