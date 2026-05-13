import React, { useMemo } from 'react';

const MAX_ORBITAL_WORDS = 18;

export default function OrbitalLyrics({ line, idx, audio, color = '#ff5a34' }) {
  const words = line?.words || [];
  const visibleWords = useMemo(() => {
    if (words.length <= MAX_ORBITAL_WORDS) return words;
    const activeIndex = Math.max(0, idx);
    const start = Math.max(0, Math.min(words.length - MAX_ORBITAL_WORDS, activeIndex - 8));
    return words.slice(start, start + MAX_ORBITAL_WORDS).map((word, offset) => ({
      ...word,
      originalIndex: start + offset,
    }));
  }, [idx, words]);

  if (!line || !words.length) return null;

  const activeWord = words[idx]?.w || '';
  const bass = audio?.bass || audio?.bassLevel || 0;

  return (
    <section
      className="orbital-lyrics"
      style={{
        '--lyric-color': color,
        '--lyric-bass': bass,
      }}
      aria-live="polite"
    >
      <div className="orbital-lyrics-ring" aria-hidden="true">
        {visibleWords.map((word, visibleIndex) => {
          const originalIndex = word.originalIndex ?? visibleIndex;
          const angle = -112 + (visibleIndex / Math.max(1, visibleWords.length - 1)) * 224;
          const active = originalIndex === idx;
          const passed = originalIndex <= idx;

          return (
            <span
              key={`${line.id}-${originalIndex}-${word.w}`}
              className={active ? 'is-active' : passed ? 'is-passed' : ''}
              style={{
                transform: `translate(-50%, -50%) rotate(${angle}deg) translate(var(--orbit-radius)) rotate(${-angle}deg)`,
              }}
            >
              {word.w}
            </span>
          );
        })}
      </div>
      <p className="orbital-lyrics-active">{activeWord || line.text}</p>
    </section>
  );
}
