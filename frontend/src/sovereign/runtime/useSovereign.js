import { useContext, useMemo } from 'react';
import { SovereignContext } from './SovereignProvider';
import {
  selectSession,
  selectIdentity,
  selectCurriculum,
  selectActiveModule,
  selectMedia,
  selectReflection,
  selectConcepts,
  selectSynthesis,
  selectArtifact,
} from './sovereignSelectors';
import { evaluateModuleSteps } from './sovereignSteps';

/**
 * The one way app code reads or mutates Sovereign state. Each domain bundles
 * its own slice of state alongside the actions that mutate it — e.g.
 * `concepts.selectConcept(id)`, `artifact.sealArtifact()` — so components
 * never touch a raw dispatch.
 */
export function useSovereign() {
  const ctx = useContext(SovereignContext);
  if (!ctx) {
    throw new Error('useSovereign must be used within a SovereignProvider');
  }
  const { state, actions } = ctx;

  return useMemo(() => {
    const activeModule = selectActiveModule(state);

    return {
      identity: { ...selectIdentity(state), setIdentity: actions.setIdentity },
      curriculum: { ...selectCurriculum(state), startModule: actions.startModule },
      module: activeModule && {
        ...activeModule,
        steps: evaluateModuleSteps(state, activeModule.moduleId),
        advanceStep: (stepId) => actions.advanceStep(activeModule.moduleId, stepId),
        completeStep: (stepId, criteria) =>
          actions.completeStep(activeModule.moduleId, stepId, criteria),
      },
      media: selectMedia(state),
      reflection: { ...selectReflection(state), recordReflection: actions.recordReflection },
      concepts: {
        ...selectConcepts(state),
        selectConcept: actions.selectConcept,
        connectConcepts: actions.connectConcepts,
      },
      synthesis: {
        ...selectSynthesis(state),
        executeProtocol: (protocolId, payload, moduleId) =>
          actions.executeProtocol(protocolId, payload, moduleId ?? activeModule?.moduleId),
      },
      artifact: {
        ...selectArtifact(state),
        generateArtifact: actions.generateArtifact,
        sealArtifact: actions.sealArtifact,
      },
      session: selectSession(state),
    };
  }, [state, actions]);
}
