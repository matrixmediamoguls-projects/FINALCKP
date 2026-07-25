import { describe, expect, it } from 'vitest';
import { getVisibleLyricLines } from './visualizerLyrics';

const lines = [
  { line_text: 'First', start_ms: 0, end_ms: 1000 },
  { line_text: 'Second', start_ms: 2000, end_ms: 3000 },
  { line_text: 'Third', start_ms: 4000, end_ms: 5000 },
];

describe('getVisibleLyricLines', () => {
  it('starts at the active timed line', () => {
    expect(getVisibleLyricLines(lines, 2.5)).toEqual(['Second', 'Third']);
  });

  it('keeps the latest lyric visible during timing gaps', () => {
    expect(getVisibleLyricLines(lines, 3.5)).toEqual(['Second', 'Third']);
  });

  it('does not jump back to the beginning after the final line', () => {
    expect(getVisibleLyricLines(lines, 8)).toEqual(['Third']);
  });
});
