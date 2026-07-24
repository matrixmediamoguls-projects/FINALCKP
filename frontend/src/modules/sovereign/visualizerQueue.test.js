import { describe, expect, it } from 'vitest';
import { getAdjacentTrackIndex, orderVisualizerQueue } from './visualizerQueue';

describe('visualizer queue', () => {
  it('uses committed playlist position as the display and playback order', () => {
    const tracks = [
      { id: 'c', track_order: 3 },
      { id: 'a', track_order: 1 },
      { id: 'b', track_order: 2 },
    ];

    expect(orderVisualizerQueue(tracks).map((track) => track.id)).toEqual(['a', 'b', 'c']);
  });

  it('advances without wrapping the final track back to the first', () => {
    expect(getAdjacentTrackIndex({ activeIndex: 0, direction: 1, queueLength: 3 })).toBe(1);
    expect(getAdjacentTrackIndex({ activeIndex: 2, direction: 1, queueLength: 3 })).toBe(-1);
  });

  it('does not wrap previous from the first track', () => {
    expect(getAdjacentTrackIndex({ activeIndex: 0, direction: -1, queueLength: 3 })).toBe(-1);
  });

  it('chooses a different track when shuffle is enabled', () => {
    expect(getAdjacentTrackIndex({
      activeIndex: 1,
      direction: 1,
      queueLength: 3,
      shuffle: true,
      random: () => 0,
    })).toBe(0);
  });
});
