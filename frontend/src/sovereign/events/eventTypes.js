/**
 * The Sovereign event taxonomy (Phase 6 of the Sovereign OS migration).
 *
 * Not every event below is emitted yet — several depend on runtime pieces
 * later phases haven't built (the Media Runtime in Phase 9, the Concept
 * Graph in Phase 10, the richer reflection lifecycle in Phase 12). Each one
 * is commented with whether it's wired to a real action today via
 * mapActionToEvents.js, so it's obvious what a consumer can actually rely
 * on right now versus what's reserved for a later phase.
 */
export const SOVEREIGN_EVENT_TYPES = Object.freeze({
  MODULE_ENTERED: 'MODULE_ENTERED', // wired: startModule()
  STEP_STARTED: 'STEP_STARTED', // wired: advanceStep()
  STEP_COMPLETED: 'STEP_COMPLETED', // wired: derived from evaluateModuleSteps() after any action

  CONCEPT_OPENED: 'CONCEPT_OPENED', // pending Phase 10 — no "viewed without selecting" action yet
  CONCEPT_SELECTED: 'CONCEPT_SELECTED', // wired: selectConcept()
  CONCEPT_CONNECTED: 'CONCEPT_CONNECTED', // wired: connectConcepts()

  MEDIA_STARTED: 'MEDIA_STARTED', // pending Phase 9 — media domain has no actions yet
  MEDIA_PAUSED: 'MEDIA_PAUSED', // pending Phase 9
  MEDIA_SEEKED: 'MEDIA_SEEKED', // pending Phase 9
  LYRIC_ANCHOR_SELECTED: 'LYRIC_ANCHOR_SELECTED', // pending Phase 9

  REFLECTION_STARTED: 'REFLECTION_STARTED', // pending Phase 12 — recordReflection() is one atomic commit today
  REFLECTION_UPDATED: 'REFLECTION_UPDATED', // pending Phase 12
  REFLECTION_COMMITTED: 'REFLECTION_COMMITTED', // wired: recordReflection()

  PROTOCOL_STARTED: 'PROTOCOL_STARTED', // pending — executeProtocol() is atomic (call = execution complete)
  PROTOCOL_COMPLETED: 'PROTOCOL_COMPLETED', // wired: executeProtocol()

  ARTIFACT_STARTED: 'ARTIFACT_STARTED', // wired: generateArtifact(), first draft (status was 'empty')
  ARTIFACT_EDITED: 'ARTIFACT_EDITED', // wired: generateArtifact(), redraft (status was already draft/sealed)
  ARTIFACT_SEALED: 'ARTIFACT_SEALED', // wired: sealArtifact(), only when it actually transitions to 'sealed'
});
