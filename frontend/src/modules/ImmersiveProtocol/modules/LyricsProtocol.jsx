import React from 'react';
import { useProtocol } from '../context/ProtocolContext';
import TrackAudioInfo from './TrackAudioInfo';

export default function LyricsProtocol() {
  const {
    currentTrack,
    audioData,
    activeLyric,
    activeLyricIndex,
    visibleLyrics,
    playbackState,
  } = useProtocol();
  if (currentTrack?.display_text_enabled === false || !visibleLyrics.length) return null;

  const reactivity = (audioData?.midLevel || 0) * (Number(currentTrack?.intensity || 70) / 100);

  return (
    <section className="lyrics-protocol" style={{ opacity: 0.78 + reactivity * 0.22 }}>
      <TrackAudioInfo />
      <span className="lyrics-label">
        {currentTrack?.display_text_label || 'LYRICS PROTOCOL'} / {playbackState.mediaStatus}
      </span>
      <div className={`lyrics-stack is-${currentTrack?.display_text_animation || 'fade'} is-${currentTrack?.display_text_size || 'medium'}`}>
        {visibleLyrics.map((line) => (
          <p
            key={line.id}
            className={line.id === activeLyric?.id ? 'lyrics-text is-active' : 'lyrics-text'}
          >
            {line.text}
          </p>
        ))}
      </div>
      <span className="lyrics-index">
        {activeLyricIndex + 1 > 0 ? activeLyricIndex + 1 : 0}/{playbackState.lyricCount}
      </span>
    </section>
  );
}
