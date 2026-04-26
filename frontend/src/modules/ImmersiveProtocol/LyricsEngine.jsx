import React from 'react';

export default function LyricsEngine({ currentTrack, reactiveStrength }) {
  if (!currentTrack?.display_text_enabled) return null;

  const animation = currentTrack?.display_text_animation || 'fade';
  const size = currentTrack?.display_text_size || 'medium';
  const weight = currentTrack?.display_text_weight || 'bold';
  const text = currentTrack?.display_text || '';

  return (
    <section
      className={`lyrics-engine is-${animation} is-${size} is-${weight}`}
      style={{ opacity: 0.9 + Math.min(0.1, reactiveStrength * 0.15) }}
    >
      <span className="lyrics-label">{currentTrack?.display_text_label || 'LYRICAL BANK'}</span>
      <p>{text}</p>
    </section>
  );
}
