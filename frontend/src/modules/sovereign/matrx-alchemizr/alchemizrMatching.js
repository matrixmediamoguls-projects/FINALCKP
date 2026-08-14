// Pure query-building and scoring helpers for The Matrx Alchemizr.
// Kept free of Supabase imports so the matching rules stay unit testable.

import { CATEGORY_IDS, getCategory } from './alchemizrTagCategories';

export const DEFAULT_RESULT_LIMIT = 3;

// PostgREST array literals are parsed like CSV, so every value is quoted to keep
// labels containing spaces, commas or ampersands (e.g. "Cause & Effect") intact.
export function quoteArrayValue(value) {
  return `"${String(value).replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`;
}

export function formatArrayLiteral(values) {
  return `{${values.map(quoteArrayValue).join(',')}}`;
}

export function countBankedTags(bankedTags = {}) {
  return CATEGORY_IDS.reduce((total, id) => total + (bankedTags[id]?.length || 0), 0);
}

// Builds the raw PostgREST `or` expression that pulls every track overlapping at
// least one banked tag. Returns null when nothing is banked, so callers can skip
// the round trip entirely.
export function buildOverlapFilter(bankedTags = {}) {
  const clauses = CATEGORY_IDS
    .filter((id) => bankedTags[id]?.length)
    .map((id) => `${getCategory(id).column}.ov.${formatArrayLiteral(bankedTags[id])}`);

  return clauses.length ? clauses.join(',') : null;
}

// Scores per category rather than against one flattened pool, so an "Fire"
// element tag never counts as a match for a "Fire" theme tag.
export function scoreTrack(track, bankedTags = {}) {
  const totalSelected = countBankedTags(bankedTags);
  if (!track || totalSelected === 0) return 0;

  const matched = CATEGORY_IDS.reduce((count, id) => {
    const selected = bankedTags[id] || [];
    if (!selected.length) return count;
    const trackTags = track[getCategory(id).column] || [];
    return count + selected.filter((label) => trackTags.includes(label)).length;
  }, 0);

  return Math.round((matched / totalSelected) * 100);
}

export function scoreTracks(tracks = [], bankedTags = {}, limit = DEFAULT_RESULT_LIMIT) {
  return tracks
    .map((track) => ({ ...track, score: scoreTrack(track, bankedTags) }))
    .filter((track) => track.score > 0)
    .sort((a, b) => b.score - a.score || String(a.title).localeCompare(String(b.title)))
    .slice(0, limit);
}

export function extractSpotifyId(spotifyUri) {
  if (!spotifyUri) return null;
  const match = String(spotifyUri).match(/(?:spotify:track:|open\.spotify\.com\/track\/)([A-Za-z0-9]+)/);
  return match ? match[1] : null;
}

export function formatDuration(durationMs) {
  if (!durationMs && durationMs !== 0) return '—';
  const totalSeconds = Math.round(durationMs / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = String(totalSeconds % 60).padStart(2, '0');
  return `${minutes}:${seconds}`;
}
