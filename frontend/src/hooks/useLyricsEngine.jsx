import { useEffect, useMemo, useState } from 'react';
import { normalizeLyricRows } from '../services/supabase/trackService';

const EMPTY_LYRIC_STATE = {
  current: null,
  currentIndex: -1,
  activeWordIndex: -1,
  activeWord: null,
};

const findLineIndex = (lyrics, time) => {
  for (let index = lyrics.length - 1; index >= 0; index -= 1) {
    if (time >= lyrics[index].time) return index;
  }
  return -1;
};

const findWordIndex = (words, elapsed) => {
  if (!words?.length) return -1;
  if (elapsed < words[0].t) return -1;

  for (let index = words.length - 1; index >= 0; index -= 1) {
    if (elapsed >= words[index].t) return index;
  }

  return -1;
};

export function useLyricsEngine(audioRef, lyrics = []) {
  const normalizedLyrics = useMemo(() => normalizeLyricRows(lyrics), [lyrics]);
  const [state, setState] = useState(EMPTY_LYRIC_STATE);

  useEffect(() => {
    let rafId;

    const loop = () => {
      const audio = audioRef.current;
      const time = audio?.currentTime || 0;
      const lineIndex = findLineIndex(normalizedLyrics, time);

      if (lineIndex < 0) {
        setState((previous) => (previous.current ? EMPTY_LYRIC_STATE : previous));
        rafId = requestAnimationFrame(loop);
        return;
      }

      const line = normalizedLyrics[lineIndex];
      const elapsed = time - line.time;
      const activeWordIndex = findWordIndex(line.words, elapsed);
      const activeWord = activeWordIndex >= 0 ? line.words[activeWordIndex] : null;

      setState((previous) => {
        if (
          previous.current?.id === line.id &&
          previous.activeWordIndex === activeWordIndex &&
          previous.currentIndex === lineIndex
        ) {
          return previous;
        }

        return {
          current: line,
          currentIndex: lineIndex,
          activeWordIndex,
          activeWord,
        };
      });

      rafId = requestAnimationFrame(loop);
    };

    loop();

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [audioRef, normalizedLyrics]);

  return state;
}
