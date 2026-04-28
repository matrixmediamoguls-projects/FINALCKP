import React from 'react';
import { useProtocol } from '../context/ProtocolContext';

const fmt = (s) => {
  if (!s || Number.isNaN(s)) return '0:00';
  return `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
};

export default function TrackAudioInfo() {
  const { currentTrack, currentTime, duration } = useProtocol();

  return (
    <div className="track-audio-info">
      <span className="tai-act">{currentTrack?.act || ''}</span>
      <h3 className="tai-title">{currentTrack?.title || ''}</h3>
      <span className="tai-time">{fmt(currentTime)} / {fmt(duration)}</span>
    </div>
  );
}
