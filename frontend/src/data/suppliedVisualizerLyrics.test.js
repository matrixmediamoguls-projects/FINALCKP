import { describe, expect, it } from 'vitest';
import { getSuppliedVisualizerLyrics } from './suppliedVisualizerLyrics';

describe('getSuppliedVisualizerLyrics', () => {
  it('matches the live Reclamation title to its supplied long-form title', () => {
    expect(getSuppliedVisualizerLyrics('Reclamation').length).toBeGreaterThan(1000);
  });

  it('normalizes punctuation and capitalization', () => {
    expect(getSuppliedVisualizerLyrics("THE WITNESS DON’T TALK").length).toBeGreaterThan(1000);
  });

  it('does not assign lyrics to an unrelated title', () => {
    expect(getSuppliedVisualizerLyrics('Unknown transmission')).toBe('');
  });
});
