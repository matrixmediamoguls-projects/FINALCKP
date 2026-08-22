import React, { createContext, useEffect, useMemo, useReducer, useRef } from 'react';
import { createInitialState } from './sovereignState';
import { sovereignReducer } from './sovereignReducer';
import * as actions from './sovereignActions';
import { loadPersistedState, createAutosave } from './sovereignLocalPersistence';

export const SovereignContext = createContext(null);

function initSovereignState({ initialState, namespace, storage }) {
  const base = initialState ?? createInitialState();
  if (!namespace) {
    return { ...base, session: { ...base.session, status: 'ready' } };
  }

  const persisted = loadPersistedState(namespace, storage);
  if (!persisted) {
    return { ...base, session: { ...base.session, status: 'ready' } };
  }

  return {
    ...base,
    ...persisted,
    session: {
      ...base.session,
      ...persisted.session,
      status: 'ready',
      hydratedAt: new Date().toISOString(),
    },
  };
}

/**
 * Owns the Sovereign Runtime's state tree. Components never get a raw
 * `dispatch` — only the bound action functions below, so state can only
 * change through the explicit actions defined in sovereignActions.js.
 *
 * Local-first autosave (Phase 5): if `namespace` is set, state is restored
 * from localStorage on mount and debounce-saved back on every change, so a
 * refresh or closed tab never loses a reflection or declaration in
 * progress. `namespace` should be scoped to the signed-in user once
 * identity is wired up (Phase 7) — an unscoped namespace would let two
 * accounts on the same shared browser see each other's local state.
 * Autosave is opt-in per instance (omit `namespace` to run with no local
 * persistence, e.g. in tests).
 */
export function SovereignProvider({
  children,
  initialState,
  namespace,
  autosaveDelayMs = 500,
  storage,
}) {
  const [state, dispatch] = useReducer(
    sovereignReducer,
    { initialState, namespace, storage },
    initSovereignState,
  );

  const stateRef = useRef(state);
  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  const autosaveRef = useRef(null);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (!namespace) return undefined;
    autosaveRef.current = createAutosave(namespace, { delayMs: autosaveDelayMs, storage });
    return () => {
      // Flush on unmount so the last debounce window isn't silently dropped.
      autosaveRef.current?.flush(stateRef.current);
      autosaveRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [namespace, autosaveDelayMs, storage]);

  useEffect(() => {
    if (isFirstRender.current) {
      // Don't immediately re-save exactly what was just restored (or the
      // freshly-created initial state) on the mount render.
      isFirstRender.current = false;
      return;
    }
    autosaveRef.current?.schedule(state);
  }, [state]);

  useEffect(() => {
    if (!namespace || typeof window === 'undefined') return undefined;
    const handleBeforeUnload = () => autosaveRef.current?.flush(stateRef.current);
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [namespace]);

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
