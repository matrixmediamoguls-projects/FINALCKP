// Single reducer for The Matrx Alchemizr. All of the module's state transitions are
// interrelated (active category, rain field, banked tags, results), so they live here
// rather than in scattered useState calls.

import { CATEGORY_IDS, emptyBank } from './alchemizrTagCategories';

// Caps concurrent rain nodes so a long session cannot grow the DOM without bound.
export const MAX_FALLING_TAGS = 18;

export const initialAlchemizrState = {
  activeCategory: null,
  tagPools: {},
  fallingTags: [],
  bankedTags: emptyBank(),
  isRunning: false,
  hasRun: false,
  results: [],
  selectedTrack: null,
  error: null,
};

function isBanked(state, tag) {
  return (state.bankedTags[tag.category] || []).includes(tag.label);
}

export function alchemizrReducer(state, action) {
  switch (action.type) {
    case 'LOAD_TAG_POOLS':
      return { ...state, tagPools: action.tagPools };

    case 'SELECT_CATEGORY':
      // Switching categories clears the current rain set; the bank is untouched.
      return state.activeCategory === action.category
        ? { ...state, activeCategory: null, fallingTags: [] }
        : { ...state, activeCategory: action.category, fallingTags: [] };

    case 'SPAWN_TAG': {
      if (!action.tag || action.tag.category !== state.activeCategory) return state;
      if (state.fallingTags.length >= MAX_FALLING_TAGS) return state;
      if (isBanked(state, action.tag)) return state;
      return { ...state, fallingTags: [...state.fallingTags, action.tag] };
    }

    case 'EXPIRE_TAG':
      return { ...state, fallingTags: state.fallingTags.filter((tag) => tag.id !== action.tagId) };

    case 'COLLECT_TAG': {
      const { tag } = action;
      const fallingTags = state.fallingTags.filter((item) => item.id !== tag.id);
      if (isBanked(state, tag)) return { ...state, fallingTags };

      return {
        ...state,
        fallingTags,
        bankedTags: {
          ...state.bankedTags,
          [tag.category]: [...state.bankedTags[tag.category], tag.label],
        },
      };
    }

    case 'REMOVE_BANKED_TAG':
      return {
        ...state,
        bankedTags: {
          ...state.bankedTags,
          [action.category]: state.bankedTags[action.category].filter((label) => label !== action.label),
        },
      };

    case 'CLEAR_BANK':
      return { ...state, bankedTags: emptyBank(), results: [], hasRun: false, error: null };

    case 'RUN_START':
      // Ignoring a second RUN_START debounces a double-clicked GO button.
      return state.isRunning ? state : { ...state, isRunning: true, error: null };

    case 'RUN_SUCCESS':
      return { ...state, isRunning: false, hasRun: true, results: action.results, error: null };

    case 'RUN_FAILURE':
      return { ...state, isRunning: false, hasRun: true, results: [], error: action.error };

    case 'SELECT_TRACK':
      return { ...state, selectedTrack: action.track };

    case 'CLOSE_MODAL':
      return { ...state, selectedTrack: null };

    default:
      return state;
  }
}

export function selectBankedTagChips(state) {
  return CATEGORY_IDS.flatMap((category) =>
    (state.bankedTags[category] || []).map((label) => ({ category, label })),
  );
}
