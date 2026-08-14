import { getSovereignSupabase, readList } from './sovereignHelpers';
import {
  CATEGORY_IDS,
  TAG_COLUMNS,
  getCategoryColor,
} from '../../modules/sovereign/matrx-alchemizr/alchemizrTagCategories';
import {
  DEFAULT_RESULT_LIMIT,
  buildOverlapFilter,
  countBankedTags,
  scoreTracks,
} from '../../modules/sovereign/matrx-alchemizr/alchemizrMatching';

const R2_PUBLIC_BASE_URL = (
  import.meta.env.VITE_APP_R2_PUBLIC_BASE_URL || 'https://media.chromakeyprotocol.com'
).replace(/\/+$/, '');

const ALCHEMIZR_TRACK_COLUMNS = [
  'id',
  'title',
  'artist',
  'album',
  'duration_ms',
  'bpm',
  'spotify_uri',
  'r2_audio_key',
  'r2_cover_key',
  ...TAG_COLUMNS,
].join(', ');

function buildR2Url(objectKey) {
  if (!objectKey) return null;
  if (/^https?:\/\//i.test(objectKey)) return objectKey;
  return `${R2_PUBLIC_BASE_URL}/${String(objectKey).replace(/^\/+/, '')}`;
}

function normalizeAlchemizrTrack(row) {
  if (!row) return null;
  return {
    ...row,
    local_audio_url: buildR2Url(row.r2_audio_key),
    cover_art_url: buildR2Url(row.r2_cover_key),
  };
}

// Groups the dictionary into the rain word pool each category badge spawns from.
export function groupTagsByCategory(rows = []) {
  const pools = CATEGORY_IDS.reduce((grouped, id) => ({ ...grouped, [id]: [] }), {});
  rows.forEach((row) => {
    if (!pools[row.category]) return;
    pools[row.category].push({
      label: row.label,
      category: row.category,
      color: row.color_hex || getCategoryColor(row.category),
    });
  });
  return pools;
}

export async function getTagDictionary() {
  const supabase = getSovereignSupabase();
  if (!supabase) return groupTagsByCategory([]);

  const rows = await readList(
    supabase
      .from('tag_dictionary')
      .select('category, label, color_hex, sort_order')
      .order('category', { ascending: true })
      .order('sort_order', { ascending: true }),
  );

  return groupTagsByCategory(rows);
}

// Pulls every track overlapping at least one banked tag, then scores the partial
// matches client side so near-misses still surface with a percentage.
export async function fetchAlchemizrMatches(bankedTags, limit = DEFAULT_RESULT_LIMIT) {
  if (countBankedTags(bankedTags) === 0) return [];

  const supabase = getSovereignSupabase();
  if (!supabase) return [];

  const overlapFilter = buildOverlapFilter(bankedTags);
  if (!overlapFilter) return [];

  const { data, error } = await supabase
    .from('tracks')
    .select(ALCHEMIZR_TRACK_COLUMNS)
    .or(overlapFilter);

  if (error) {
    console.error('Unable to run the alchemizr match query.', error);
    throw error;
  }

  return scoreTracks(data || [], bankedTags, limit).map(normalizeAlchemizrTrack);
}
