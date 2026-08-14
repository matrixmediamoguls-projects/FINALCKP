import { describe, expect, it } from 'vitest';
import {
  buildOverlapFilter,
  countBankedTags,
  extractSpotifyId,
  formatArrayLiteral,
  formatDuration,
  scoreTrack,
  scoreTracks,
} from './alchemizrMatching';
import { emptyBank } from './alchemizrTagCategories';

function bank(overrides) {
  return { ...emptyBank(), ...overrides };
}

describe('alchemizr matching', () => {
  it('quotes array literal values so labels with spaces and ampersands survive', () => {
    expect(formatArrayLiteral(['Cause & Effect', 'Rhythm'])).toBe('{"Cause & Effect","Rhythm"}');
  });

  it('escapes embedded quotes and backslashes in array literals', () => {
    expect(formatArrayLiteral(['He said "go"'])).toBe('{"He said \\"go\\""}');
  });

  it('builds one overlap clause per populated category', () => {
    expect(buildOverlapFilter(bank({ vibe: ['Dark'], theme: ['Power', 'Legacy'] }))).toBe(
      'vibe_tags.ov.{"Dark"},theme_tags.ov.{"Power","Legacy"}',
    );
  });

  it('returns null when nothing is banked so the query round trip is skipped', () => {
    expect(buildOverlapFilter(emptyBank())).toBeNull();
    expect(countBankedTags(emptyBank())).toBe(0);
  });

  it('scores a track as the share of banked tags it carries', () => {
    const track = { vibe_tags: ['Dark'], theme_tags: ['Power'], element_tags: [] };
    expect(scoreTrack(track, bank({ vibe: ['Dark'], theme: ['Power'] }))).toBe(100);
    expect(scoreTrack(track, bank({ vibe: ['Dark'], theme: ['Power'], element: ['Fire'] }))).toBe(67);
  });

  it('does not let a tag in one category match the same label in another', () => {
    const track = { element_tags: ['Fire'], theme_tags: [] };
    expect(scoreTrack(track, bank({ theme: ['Fire'] }))).toBe(0);
    expect(scoreTrack(track, bank({ element: ['Fire'] }))).toBe(100);
  });

  it('returns the top three scoring tracks and drops non-matches', () => {
    const tracks = [
      { id: '1', title: 'Alpha', vibe_tags: ['Dark'], theme_tags: ['Power'] },
      { id: '2', title: 'Beta', vibe_tags: ['Dark'], theme_tags: [] },
      { id: '3', title: 'Gamma', vibe_tags: [], theme_tags: ['Power'] },
      { id: '4', title: 'Delta', vibe_tags: ['Chill'], theme_tags: ['Love'] },
    ];

    const results = scoreTracks(tracks, bank({ vibe: ['Dark'], theme: ['Power'] }));

    expect(results.map((track) => [track.title, track.score])).toEqual([
      ['Alpha', 100],
      ['Beta', 50],
      ['Gamma', 50],
    ]);
  });

  it('reads a spotify id from either a uri or an open.spotify link', () => {
    expect(extractSpotifyId('spotify:track:4cOdK2wGLETKBW3PvgPWqT')).toBe('4cOdK2wGLETKBW3PvgPWqT');
    expect(extractSpotifyId('https://open.spotify.com/track/4cOdK2wGLETKBW3PvgPWqT?si=x')).toBe(
      '4cOdK2wGLETKBW3PvgPWqT',
    );
    expect(extractSpotifyId(null)).toBeNull();
  });

  it('formats durations as minutes and padded seconds', () => {
    expect(formatDuration(215000)).toBe('3:35');
    expect(formatDuration(null)).toBe('—');
  });
});
