import { useEffect, useRef } from 'react';

export const keywordFX = {
  AIR: 'airlift',
  ASCEND: 'airlift',
  BREAK: 'shockwave',
  BURN: 'burst',
  CHROMA: 'prism',
  CODE: 'glitch',
  EARTH: 'root',
  FIRE: 'burst',
  FLAME: 'burst',
  GLITCH: 'glitch',
  KEY: 'prism',
  LIGHT: 'prism',
  RISE: 'airlift',
  ROOT: 'root',
  SYSTEM: 'shockwave',
  VOID: 'shockwave',
  WATER: 'ripple',
  WAVE: 'ripple',
};

export function useKeywordFX(line, wordIndex, triggerFX) {
  const lastTriggerRef = useRef('');

  useEffect(() => {
    if (!line || wordIndex < 0 || !triggerFX) return;

    const word = line.words?.[wordIndex]?.w?.replace(/[^\w]/g, '').toUpperCase();
    if (!word || !keywordFX[word]) return;

    const triggerKey = `${line.id}:${wordIndex}:${word}`;
    if (lastTriggerRef.current === triggerKey) return;

    lastTriggerRef.current = triggerKey;
    triggerFX(keywordFX[word], { word, source: 'keyword' });
  }, [line, triggerFX, wordIndex]);
}
