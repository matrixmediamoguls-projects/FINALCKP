import actThreeBackground from '../../public/visualizer/act_three_visualizer_background_image.png';
import actOneEmblem from '../../public/emblems/act_one_emblem.gif';
import actTwoEmblem from '../../public/emblems/act_two_emblem.gif';
import actThreeEmblem from '../../public/emblems/act_three_emblem.gif';
import actFourEmblem from '../../public/emblems/act_four_emblem.gif';
import actThreeSigil from '../../public/visualizer/act_three_sigil.svg';

export const VISUALIZER_ACTS = {
  act_one: {
    label: 'ACT ONE',
    codename: 'ROOTLINE',
    color: '#5ab038',
    color2: '#80d050',
    bg: '/visualizer/act_one_visualizer_background_image.png',
    emblem: actOneEmblem,
  },
  act_two: {
    label: 'ACT TWO',
    codename: 'TIDELINE',
    color: '#50a0e0',
    color2: '#80c8f8',
    bg: '/visualizer/act_two_visualizer_background_image.png',
    emblem: actTwoEmblem,
  },
  act_three: {
    label: 'ACT THREE',
    codename: 'RECLAMATION',
    color: '#ff2a2a',
    color2: '#ff7060',
    bg: actThreeBackground,
    emblem: actThreeEmblem,
    protocolEmblem: actThreeSigil,
  },
  act_four: {
    label: 'ACT FOUR',
    codename: 'SIGNAL',
    color: '#f0cc40',
    color2: '#fff0a3',
    bg: '/visualizer/act_four_visualizer_background_image.png',
    emblem: actFourEmblem,
  },
};

export const DEFAULT_VISUALIZER_PATH = '/visualizer/act_three';

const ACT_ID_ALIASES = {
  EARTH: 'act_one',
  WATER: 'act_two',
  FIRE: 'act_three',
  AIR: 'act_four',
  '1': 'act_one',
  ONE: 'act_one',
  'ACT 1': 'act_one',
  'ACT ONE': 'act_one',
  'ACT I': 'act_one',
  '2': 'act_two',
  TWO: 'act_two',
  'ACT 2': 'act_two',
  'ACT TWO': 'act_two',
  'ACT II': 'act_two',
  '3': 'act_three',
  THREE: 'act_three',
  'ACT 3': 'act_three',
  'ACT THREE': 'act_three',
  'ACT III': 'act_three',
  RECLAMATION: 'act_three',
  FIREWALL: 'act_three',
  '4': 'act_four',
  FOUR: 'act_four',
  'ACT 4': 'act_four',
  'ACT FOUR': 'act_four',
  'ACT IV': 'act_four',
};

export function normalizeVisualizerActId(value, track) {
  if (VISUALIZER_ACTS[value]) return value;

  const raw = value || track?.act_id || track?.act || track?.act_name || track?.act_logo_subtitle || 'act_three';
  const key = String(raw).trim().toUpperCase().replace(/[_-]+/g, ' ');

  if (ACT_ID_ALIASES[key]) return ACT_ID_ALIASES[key];
  if (key.includes('EARTH') || key.includes('ONE') || key.includes('ACT 1')) return 'act_one';
  if (key.includes('WATER') || key.includes('TWO') || key.includes('ACT 2')) return 'act_two';
  if (key.includes('FIRE') || key.includes('THREE') || key.includes('RECLAMATION') || key.includes('ACT 3')) {
    return 'act_three';
  }
  if (key.includes('AIR') || key.includes('FOUR') || key.includes('ACT 4')) return 'act_four';

  return 'act_three';
}

export function getVisualizerAct(value, track) {
  const actId = normalizeVisualizerActId(value, track);
  return {
    id: actId,
    ...VISUALIZER_ACTS[actId],
  };
}
