// Category configuration for The Matrx Alchemizr top bar.
// Colors mirror the color_hex values seeded into public.tag_dictionary so the
// module still renders on brand if the dictionary fetch fails.

export const TAG_CATEGORIES = [
  { id: 'vibe', label: 'Vibe', color: '#FF7A1A', column: 'vibe_tags', icon: 'waveform' },
  { id: 'intention', label: 'Intention', color: '#1AA7FF', column: 'intention_tags', icon: 'eye' },
  { id: 'element', label: 'Element', color: '#F5F5F5', column: 'element_tags', icon: 'flame' },
  { id: 'theme', label: 'Theme', color: '#B14AFF', column: 'theme_tags', icon: 'scroll' },
  { id: 'vibration', label: 'Vibration', color: '#3CFF6E', column: 'vibration_tags', icon: 'radiate' },
];

export const CATEGORY_IDS = TAG_CATEGORIES.map((category) => category.id);

export const TAG_COLUMNS = TAG_CATEGORIES.map((category) => category.column);

export function getCategory(categoryId) {
  return TAG_CATEGORIES.find((category) => category.id === categoryId) || null;
}

export function getCategoryColor(categoryId) {
  return getCategory(categoryId)?.color || '#FF7A1A';
}

export function emptyBank() {
  return CATEGORY_IDS.reduce((bank, id) => ({ ...bank, [id]: [] }), {});
}

// Background buzzwords burning behind the device, matching the vibe glow.
export const AMBIENT_BUZZWORDS = [
  'Frequency',
  'Resonance',
  'Groove',
  'Flow',
  'Energy',
  'Rhythm',
];
