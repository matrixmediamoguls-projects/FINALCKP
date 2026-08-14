import { AudioLines, Eye, Flame, Radio, ScrollText } from 'lucide-react';

const CATEGORY_ICONS = {
  waveform: AudioLines,
  eye: Eye,
  flame: Flame,
  scroll: ScrollText,
  radiate: Radio,
};

export default function CategoryBadge({ category, isActive, bankedCount, onSelect }) {
  const Icon = CATEGORY_ICONS[category.icon] || AudioLines;

  return (
    <button
      type="button"
      className={`alchemizr-badge ${isActive ? 'is-active' : ''}`}
      style={{ '--badge-color': category.color }}
      aria-pressed={isActive}
      aria-label={`${category.label} tags`}
      onClick={() => onSelect(category.id)}
    >
      <span className="alchemizr-badge-dial">
        <Icon aria-hidden="true" />
        {bankedCount > 0 && <span className="alchemizr-badge-count">{bankedCount}</span>}
      </span>
      <span className="alchemizr-badge-label">{category.label}</span>
    </button>
  );
}
