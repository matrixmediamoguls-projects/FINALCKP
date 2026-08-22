/**
 * Sovereign Runtime — state shape (Phase 3 of the Sovereign OS migration).
 *
 * Canonical shape for the runtime's state tree. See docs/ARCHITECTURE.md for
 * the overall migration plan and docs/SOVEREIGN_STATE_MAP.md for the
 * inventory of existing, fragmented state this runtime is meant to
 * eventually replace. Nothing in the existing app reads or writes this yet —
 * it is standalone scaffolding until later migration phases (5+) wire it
 * into local persistence, Supabase, and the existing Reclamation University
 * components.
 *
 * @typedef {Object} SovereignModuleState
 * @property {string} moduleId
 * @property {string|null} currentStep
 * @property {string[]} viewedSteps - steps navigated to; "viewed" is not the same as "complete", see sovereignSteps.js
 * @property {string[]} completedSteps - explicit completion ledger, written by the completeStep() action
 * @property {string|null} startedAt
 * @property {string|null} lastActiveAt
 * @property {number} timeSpent
 * @property {number|null} estimatedRemaining
 * @property {number} interactionCount
 * @property {number} synthesisReadiness
 * @property {'available'|'in_progress'|'completed'} status
 */

/** @returns {SovereignModuleState} */
export function createModuleState(moduleId) {
  return {
    moduleId,
    currentStep: null,
    viewedSteps: [],
    completedSteps: [],
    startedAt: null,
    lastActiveAt: null,
    timeSpent: 0,
    estimatedRemaining: null,
    interactionCount: 0,
    synthesisReadiness: 0,
    status: 'available',
  };
}

export function createInitialState() {
  return {
    session: {
      status: 'idle', // idle | hydrating | ready
      syncStatus: 'local', // local | syncing | synced | error
      hydratedAt: null,
      lastSyncedAt: null,
    },
    identity: {
      userId: null,
      email: null,
      displayName: null,
      tier: null,
      level: 0,
      currentAct: 1,
      completedActs: [],
    },
    curriculum: {
      activeModuleId: null,
      modules: /** @type {Record<string, SovereignModuleState>} */ ({}),
    },
    media: {
      currentTrackId: null,
      position: 0,
      duration: 0,
      isPlaying: false,
      volume: 1,
      activeAnchor: null,
      activeConcept: null,
    },
    reflection: {
      entries: {},
    },
    concepts: {
      selected: [],
      connections: [],
    },
    synthesis: {
      protocolExecutions: [],
    },
    artifact: {
      status: 'empty', // empty | draft | sealed
      draft: null,
      sealedAt: null,
    },
  };
}
