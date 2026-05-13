import React from 'react';
import { useProtocol } from '../context/ProtocolContext';
import TrackAudioInfo from './TrackAudioInfo';

export default function LyricsProtocol() {
  const { currentTrack, audioData } = useProtocol();
  if (currentTrack?.display_text_enabled === false || !currentTrack?.display_text) return null;

  const reactivity = (audioData?.midLevel || 0) * (Number(currentTrack?.intensity || 70) / 100);

  return (
    <section className="lyrics-protocol" style={{ opacity: 0.78 + reactivity * 0.22 }}>
      <TrackAudioInfo />
      <span className="lyrics-label">{currentTrack?.display_text_label || 'LYRICAL BANK'}</span>
      <p
        className={`lyrics-text is-${currentTrack?.display_text_animation || 'fade'} is-${currentTrack?.display_text_size || 'medium'}`}
      >
        {currentTrack?.display_text}
      </p>
    </section>
  );
}
