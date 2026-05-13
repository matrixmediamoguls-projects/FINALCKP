export const ACTS = {
  EARTH: {
    id: 'earth',
    key: 'EARTH',
    number: 1,
    title: 'ACT ONE',
    field: 'ROOTLINE',
    color: '#5ab038',
    secondaryColor: '#80d050',
  },
  WATER: {
    id: 'water',
    key: 'WATER',
    number: 2,
    title: 'ACT TWO',
    field: 'TIDELINE',
    color: '#50a0e0',
    secondaryColor: '#80c8f8',
  },
  FIRE: {
    id: 'fire',
    key: 'FIRE',
    number: 3,
    title: 'ACT THREE',
    field: 'RECLAMATION',
    color: '#ff2a2a',
    secondaryColor: '#ff7060',
  },
  AIR: {
    id: 'air',
    key: 'AIR',
    number: 4,
    title: 'ACT FOUR',
    field: 'SIGNAL',
    color: '#f0cc40',
    secondaryColor: '#fff0a3',
  },
};

const ACT_ALIASES = {
  '1': 'EARTH',
  ONE: 'EARTH',
  EARTH: 'EARTH',
  ROOTLINE: 'EARTH',
  'ACT 1': 'EARTH',
  'ACT ONE': 'EARTH',
  'ACT I': 'EARTH',
  '2': 'WATER',
  TWO: 'WATER',
  WATER: 'WATER',
  TIDELINE: 'WATER',
  'ACT 2': 'WATER',
  'ACT TWO': 'WATER',
  'ACT II': 'WATER',
  '3': 'FIRE',
  THREE: 'FIRE',
  FIRE: 'FIRE',
  RECLAMATION: 'FIRE',
  FIREWALL: 'FIRE',
  'ACT 3': 'FIRE',
  'ACT THREE': 'FIRE',
  'ACT III': 'FIRE',
  '4': 'AIR',
  FOUR: 'AIR',
  AIR: 'AIR',
  SIGNAL: 'AIR',
  'ACT 4': 'AIR',
  'ACT FOUR': 'AIR',
  'ACT IV': 'AIR',
};

export function normalizeActKey(value) {
  const raw = value || 'FIRE';
  const key = String(raw).trim().toUpperCase().replace(/[_-]+/g, ' ');

  if (ACTS[key]) return key;
  if (ACT_ALIASES[key]) return ACT_ALIASES[key];
  if (key.includes('EARTH') || key.includes('ONE') || key.includes('ACT 1')) return 'EARTH';
  if (key.includes('WATER') || key.includes('TWO') || key.includes('ACT 2')) return 'WATER';
  if (key.includes('FIRE') || key.includes('THREE') || key.includes('RECLAMATION') || key.includes('ACT 3')) return 'FIRE';
  if (key.includes('AIR') || key.includes('FOUR') || key.includes('SIGNAL') || key.includes('ACT 4')) return 'AIR';

  return 'FIRE';
}

export function getActConfig(trackOrAct) {
  const key = normalizeActKey(
    trackOrAct?.act_id ||
      trackOrAct?.act ||
      trackOrAct?.act_name ||
      trackOrAct?.act_logo_subtitle ||
      trackOrAct
  );

  return ACTS[key] || ACTS.FIRE;
}

export function resolveTrackColor(track) {
  return track?.primary_color || track?.color || getActConfig(track).color;
}
