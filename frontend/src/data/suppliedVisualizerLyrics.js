import lyricRecords from './suppliedVisualizerLyrics.json';

const TITLE_ALIASES = {
  reclamation: 'reclamation the day musiq matrix came back',
  'remember the price when you speak the name': 'remember the price when you speak the name',
  'the witness dont talk': 'the witness dont talk',
};

function normalizeTitle(title) {
  return String(title || '')
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

const lyricsByTitle = new Map(
  lyricRecords.map((record) => [normalizeTitle(record.title), record.lyrics]),
);

export function getSuppliedVisualizerLyrics(title) {
  const normalized = normalizeTitle(title);
  return lyricsByTitle.get(TITLE_ALIASES[normalized] || normalized) || '';
}
