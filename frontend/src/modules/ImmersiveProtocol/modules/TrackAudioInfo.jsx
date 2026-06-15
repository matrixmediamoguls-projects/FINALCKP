import React from 'react';
import { useProtocol } from '../context/ProtocolContext';

const fmt = (s) => {
  if (!s || Number.isNaN(s)) return '0:00';
  return `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
};

export default function TrackAudioInfo() {
  const {
    currentTrack,
    currentTime,
    duration,
    isPlaying,
    togglePlay,
    nextTrack,
    prevTrack,
  } = useProtocol();
  const canPlay = Boolean(currentTrack?.audio_url);

  return (
    <div className="track-audio-info">
      <span className="tai-act">{currentTrack?.act || ''}</span>
      <h3 className="tai-title">{currentTrack?.title || ''}</h3>
      <span className="tai-time">{fmt(currentTime)} / {fmt(duration)}</span>
      <div className="tai-controls" aria-label="Track controls">
        <button type="button" onClick={prevTrack}>Prev</button>
        <button type="button" onClick={togglePlay} disabled={!canPlay}>
          {canPlay ? (isPlaying ? 'Pause' : 'Play') : 'No audio'}
        </button>
        <button type="button" onClick={nextTrack}>Next</button>
      </div>
    </div>
  );
}
