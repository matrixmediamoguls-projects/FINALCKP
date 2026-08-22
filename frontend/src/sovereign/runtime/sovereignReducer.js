import { SOVEREIGN_ACTION_TYPES } from './sovereignActions';
import { createModuleState } from './sovereignState';

function getOrCreateModule(modules, moduleId) {
  return modules[moduleId] ?? createModuleState(moduleId);
}

function updateModule(state, moduleId, updater) {
  const existing = getOrCreateModule(state.curriculum.modules, moduleId);
  const nextModule = updater(existing);
  return {
    ...state,
    curriculum: {
      ...state.curriculum,
      modules: { ...state.curriculum.modules, [moduleId]: nextModule },
    },
  };
}

export function sovereignReducer(state, action) {
  switch (action.type) {
    case SOVEREIGN_ACTION_TYPES.HYDRATE: {
      return { ...state, ...action.payload.state };
    }

    case SOVEREIGN_ACTION_TYPES.SET_IDENTITY: {
      return { ...state, identity: { ...state.identity, ...action.payload.identity } };
    }

    case SOVEREIGN_ACTION_TYPES.START_MODULE: {
      const { moduleId } = action.payload;
      const withModule = updateModule(state, moduleId, (existing) => ({
        ...existing,
        status: existing.status === 'completed' ? existing.status : 'in_progress',
        startedAt: existing.startedAt ?? action.meta.timestamp,
        lastActiveAt: action.meta.timestamp,
      }));
      return {
        ...withModule,
        curriculum: { ...withModule.curriculum, activeModuleId: moduleId },
      };
    }

    case SOVEREIGN_ACTION_TYPES.ADVANCE_STEP: {
      const { moduleId, stepId } = action.payload;
      return updateModule(state, moduleId, (existing) => ({
        ...existing,
        currentStep: stepId,
        interactionCount: existing.interactionCount + 1,
        lastActiveAt: action.meta.timestamp,
      }));
    }

    case SOVEREIGN_ACTION_TYPES.COMPLETE_STEP: {
      const { moduleId, stepId } = action.payload;
      return updateModule(state, moduleId, (existing) => ({
        ...existing,
        completedSteps: existing.completedSteps.includes(stepId)
          ? existing.completedSteps
          : [...existing.completedSteps, stepId],
        lastActiveAt: action.meta.timestamp,
      }));
    }

    case SOVEREIGN_ACTION_TYPES.RECORD_REFLECTION: {
      const { moduleId, promptId, response } = action.payload;
      const entryId = `${moduleId}:${promptId}`;
      return {
        ...state,
        reflection: {
          ...state.reflection,
          entries: {
            ...state.reflection.entries,
            [entryId]: { moduleId, promptId, response, updatedAt: action.meta.timestamp },
          },
        },
      };
    }

    case SOVEREIGN_ACTION_TYPES.SELECT_CONCEPT: {
      const { conceptId } = action.payload;
      const selected = state.concepts.selected.includes(conceptId)
        ? state.concepts.selected
        : [...state.concepts.selected, conceptId];
      return { ...state, concepts: { ...state.concepts, selected } };
    }

    case SOVEREIGN_ACTION_TYPES.CONNECT_CONCEPTS: {
      const { fromConceptId, toConceptId, relationship } = action.payload;
      const connection = {
        fromConceptId,
        toConceptId,
        relationship,
        createdAt: action.meta.timestamp,
      };
      return {
        ...state,
        concepts: {
          ...state.concepts,
          connections: [...state.concepts.connections, connection],
        },
      };
    }

    case SOVEREIGN_ACTION_TYPES.EXECUTE_PROTOCOL: {
      const { protocolId, payload } = action.payload;
      const execution = { protocolId, payload, executedAt: action.meta.timestamp };
      return {
        ...state,
        synthesis: {
          ...state.synthesis,
          protocolExecutions: [...state.synthesis.protocolExecutions, execution],
        },
      };
    }

    case SOVEREIGN_ACTION_TYPES.GENERATE_ARTIFACT: {
      return {
        ...state,
        artifact: { ...state.artifact, status: 'draft', draft: action.payload.draft },
      };
    }

    case SOVEREIGN_ACTION_TYPES.SEAL_ARTIFACT: {
      if (!state.artifact.draft) return state;
      return {
        ...state,
        artifact: { ...state.artifact, status: 'sealed', sealedAt: action.meta.timestamp },
      };
    }

    default:
      return state;
  }
}
