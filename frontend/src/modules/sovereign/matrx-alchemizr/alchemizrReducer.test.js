import { describe, expect, it } from 'vitest';
import {
  MAX_FALLING_TAGS,
  alchemizrReducer,
  initialAlchemizrState,
  selectBankedTagChips,
} from './alchemizrReducer';

const darkTag = { id: 'vibe-dark-1', label: 'Dark', category: 'vibe', color: '#FF7A1A' };

function withActiveVibe(overrides = {}) {
  return { ...initialAlchemizrState, activeCategory: 'vibe', ...overrides };
}

describe('alchemizr reducer', () => {
  it('clears the rain set when switching categories but keeps the bank', () => {
    const banked = alchemizrReducer(withActiveVibe(), { type: 'COLLECT_TAG', tag: darkTag });
    const switched = alchemizrReducer(
      { ...banked, fallingTags: [darkTag] },
      { type: 'SELECT_CATEGORY', category: 'theme' },
    );

    expect(switched.activeCategory).toBe('theme');
    expect(switched.fallingTags).toEqual([]);
    expect(switched.bankedTags.vibe).toEqual(['Dark']);
  });

  it('toggles a category off when its badge is pressed again', () => {
    const state = alchemizrReducer(withActiveVibe(), { type: 'SELECT_CATEGORY', category: 'vibe' });
    expect(state.activeCategory).toBeNull();
  });

  it('caps how many tags can be airborne at once', () => {
    const full = withActiveVibe({
      fallingTags: Array.from({ length: MAX_FALLING_TAGS }, (_, index) => ({
        ...darkTag,
        id: `vibe-${index}`,
      })),
    });

    const state = alchemizrReducer(full, { type: 'SPAWN_TAG', tag: { ...darkTag, id: 'overflow' } });
    expect(state.fallingTags).toHaveLength(MAX_FALLING_TAGS);
  });

  it('ignores spawns for a category that is no longer active', () => {
    const state = alchemizrReducer(withActiveVibe(), {
      type: 'SPAWN_TAG',
      tag: { ...darkTag, category: 'theme' },
    });
    expect(state.fallingTags).toEqual([]);
  });

  it('never re-spawns or re-banks a tag already in the bank', () => {
    const banked = alchemizrReducer(withActiveVibe(), { type: 'COLLECT_TAG', tag: darkTag });

    expect(alchemizrReducer(banked, { type: 'SPAWN_TAG', tag: darkTag }).fallingTags).toEqual([]);
    expect(
      alchemizrReducer(banked, { type: 'COLLECT_TAG', tag: { ...darkTag, id: 'vibe-dark-2' } })
        .bankedTags.vibe,
    ).toEqual(['Dark']);
  });

  it('moves a collected tag out of the rain and into its category bank', () => {
    const state = alchemizrReducer(
      withActiveVibe({ fallingTags: [darkTag] }),
      { type: 'COLLECT_TAG', tag: darkTag },
    );

    expect(state.fallingTags).toEqual([]);
    expect(selectBankedTagChips(state)).toEqual([{ category: 'vibe', label: 'Dark' }]);
  });

  it('removes a banked tag and clears the whole bank on demand', () => {
    const banked = alchemizrReducer(withActiveVibe(), { type: 'COLLECT_TAG', tag: darkTag });

    expect(
      alchemizrReducer(banked, { type: 'REMOVE_BANKED_TAG', category: 'vibe', label: 'Dark' })
        .bankedTags.vibe,
    ).toEqual([]);
    expect(selectBankedTagChips(alchemizrReducer(banked, { type: 'CLEAR_BANK' }))).toEqual([]);
  });

  it('debounces a second RUN_START so a double-clicked GO runs once', () => {
    const running = alchemizrReducer(initialAlchemizrState, { type: 'RUN_START' });
    expect(running.isRunning).toBe(true);
    expect(alchemizrReducer(running, { type: 'RUN_START' })).toBe(running);
  });

  it('records results on success and surfaces the error on failure', () => {
    const running = alchemizrReducer(initialAlchemizrState, { type: 'RUN_START' });
    const results = [{ id: '1', title: 'Alpha', score: 87 }];

    const success = alchemizrReducer(running, { type: 'RUN_SUCCESS', results });
    expect(success).toMatchObject({ isRunning: false, hasRun: true, results, error: null });

    const failure = alchemizrReducer(running, { type: 'RUN_FAILURE', error: 'offline' });
    expect(failure).toMatchObject({ isRunning: false, hasRun: true, results: [], error: 'offline' });
  });

  it('opens and closes the track detail modal', () => {
    const track = { id: '1', title: 'Alpha' };
    const opened = alchemizrReducer(initialAlchemizrState, { type: 'SELECT_TRACK', track });
    expect(opened.selectedTrack).toBe(track);
    expect(alchemizrReducer(opened, { type: 'CLOSE_MODAL' }).selectedTrack).toBeNull();
  });
});
