import React, { useMemo } from 'react';
import { normalizeLyricRows } from '../../services/supabase/trackService';
import { getVisualizerAct } from '../visualizer/visualizerAssets';

const FALLBACK_LINES = [
  "I'm breaking the code, I'm rewriting the system",
  "The keys in my hands, I'm taking back what's mine",
  'No firewall can hold me, no gate can keep me out',
  "I'm the glitch in their plan, watch the whole thing shut down",
  'Burn down the silence, let the signal rise',
];

const FALLBACK_KEYS = [
  'code',
  'system',
  'keys',
  'firewall',
  'gate',
  'glitch',
  'protocol',
  'override',
  'signal',
  'reclamation',
];

function getActiveIndex(lyrics, currentTime) {
  let idx = -1;
  for (let index = 0; index < lyrics.length; index += 1) {
    if (currentTime >= lyrics[index].time) idx = index;
    else break;
  }
  return idx;
}

function getContextLines(lyrics, activeIdx) {
  if (!lyrics.length) return [];
  const safeIndex = Math.max(0, activeIdx);

  return [0, 1, 2, 3, 4].map((offset) => {
    const index = safeIndex + offset;
    if (index < 0 || index >= lyrics.length) return null;
    return { ...lyrics[index], offset, index };
  });
}

function stripPunctuation(word) {
  return word.replace(/[^a-zA-Z0-9']/g, '').toLowerCase();
}

function highlightKeywords(text, actKeys) {
  const keySet = new Set((actKeys || []).map((key) => String(key).toLowerCase()));
  const words = String(text || '').split(/(\s+)/);

  return words.map((segment, index) => {
    if (/^\s+$/.test(segment)) return segment;
    const clean = stripPunctuation(segment);
    if (!keySet.has(clean)) return segment;

    return (
      <span key={`${segment}-${index}`} className="viz-kw">
        {segment}
      </span>
    );
  });
}

function formatTime(seconds) {
  const safe = Number.isFinite(seconds) ? Math.max(0, seconds) : 0;
  const mins = Math.floor(safe / 60);
  const secs = Math.floor(safe % 60);
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

function buildFallbackLyrics(track) {
  const displayText = track?.display_text || track?.lyric_text || '';
  const lines = displayText
    ? String(displayText).split(/\n+/).map((line) => line.trim()).filter(Boolean)
    : FALLBACK_LINES;

  return lines.map((text, index) => ({
    id: `viz-fallback-${index}`,
    time: index * 4.8,
    text,
    words: String(text).split(/\s+/).map((word, wordIndex) => ({ w: word, t: wordIndex * 0.42 })),
  }));
}

function LyricLine({ line, actKeys }) {
  if (!line) return <p className="viz-lyric-line is-empty" aria-hidden="true" />;
  const className = line.offset === 0 ? 'viz-lyric-line is-active' : 'viz-lyric-line';

  return (
    <p className={className}>
      {line.offset === 0 && <span className="viz-lyric-cue">{'>'}</span>}
      {line.offset === 0 ? highlightKeywords(line.text, actKeys) : line.text}
    </p>
  );
}

function LyricsMeter({ active, frequencyData }) {
  const bars = useMemo(() => Array.from({ length: 28 }), []);

  return (
    <div className="viz-lyrics-meter" aria-hidden="true">
      {bars.map((_, index) => {
        const sample = frequencyData?.[index * 4] || 0;
        const idle = 12 + ((index * 23) % 76);
        const height = sample && active ? 14 + (sample / 255) * 84 : idle;
        return <span key={index} style={{ height: `${height}%` }} />;
      })}
    </div>
  );
}

export default function LyricsEngine({ act_id, track = {}, playback, audioData }) {
  const act = getVisualizerAct(act_id, track);
  const lyrics = useMemo(() => {
    const normalized = normalizeLyricRows(track?.lyrics || []);
    return normalized.length ? normalized : buildFallbackLyrics(track);
  }, [track]);

  const duration = playback?.duration || track?.duration || Math.max(lyrics[lyrics.length - 1]?.time + 8 || 0, 0);
  const currentTime = playback?.currentTime || 0;
  const isPlaying = Boolean(playback?.isPlaying);
  const progress = duration ? Math.min(100, (currentTime / duration) * 100) : 0;
  const activeIdx = getActiveIndex(lyrics, currentTime);
  const contextLines = getContextLines(lyrics, activeIdx);
  const actKeys = track?.act_keys?.length ? track.act_keys : FALLBACK_KEYS;

  const seek = (event) => {
    const audio = playback?.audioRef?.current;
    if (!audio || !duration) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width));
    audio.currentTime = ratio * duration;
  };

  return (
    <section className="viz-lyrics-console" aria-live="polite">
      <div className="viz-track-card">
        <LyricsMeter active={isPlaying} frequencyData={audioData?.frequencyData} />
      </div>

      <div className="viz-lyrics-bank">
        <div className="viz-lyrics-tab">
          <span>Lyrics Protocol</span>
          <small>Decryption Active</small>
        </div>
        <div className="viz-lyrics-lines">
          {contextLines.map((line, index) => (
            <LyricLine key={line?.id || `empty-${index}`} line={line} actKeys={actKeys} />
          ))}
        </div>
        <div className="viz-progress-row">
          <span>{formatTime(currentTime)}</span>
          <button
            className="viz-progress"
            type="button"
            onClick={seek}
            aria-label="Seek track"
            style={{ '--viz-progress': `${progress}%` }}
          >
            <i />
          </button>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      <div className="viz-reactivity">
        <span>Signal Lock</span>
        <div className="viz-lyrics-dots" aria-hidden="true">
          {Array.from({ length: 5 }).map((_, index) => <i key={index} />)}
        </div>
        <small>{act.codename}</small>
      </div>
    </section>
  );
}
