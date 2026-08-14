import { X } from 'lucide-react';
import { getCategoryColor } from './alchemizrTagCategories';

export default function ActiveTagBank({ chips, onRemove, onClear }) {
  return (
    <div className="alchemizr-plinth">
      <div className="alchemizr-plinth-header">
        <span className="alchemizr-eyebrow">Active Tags</span>
        {chips.length > 0 && (
          <button type="button" className="alchemizr-clear" onClick={onClear}>
            Clear
          </button>
        )}
      </div>
      <div className="alchemizr-bank">
        {chips.length === 0 && (
          <p className="alchemizr-hint">Select a category above, then catch the falling tags.</p>
        )}
        {chips.map((chip) => (
          <span
            key={`${chip.category}-${chip.label}`}
            className="alchemizr-chip"
            style={{ '--chip-color': getCategoryColor(chip.category) }}
          >
            {chip.label}
            <button
              type="button"
              aria-label={`Remove ${chip.label}`}
              onClick={() => onRemove(chip.category, chip.label)}
            >
              <X aria-hidden="true" />
            </button>
          </span>
        ))}
      </div>
    </div>
  );
}
