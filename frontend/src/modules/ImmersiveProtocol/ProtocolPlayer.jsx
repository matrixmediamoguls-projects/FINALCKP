import React from 'react';
import { Pause, Play, SkipBack, SkipForward } from 'lucide-react';
import { useProtocol } from './context/ProtocolContext';

const fmt = (s) => {
  if (!s || Number.isNaN(s)) return '0:00';
  return `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
};

export default function ProtocolPlayer() {
  const {
    currentTrack,
    isPlaying,
    togglePlay,
    nextTrack,
    prevTrack,
    progress,
    duration,
    currentTime,
    error,
    handleSeek,
    audioRef,
    handleTimeUpdate,
    handleLoadedMetadata,
  } = useProtocol();

  return (
    <footer className="ip-player">
      <audio
        ref={audioRef}
        crossOrigin="anonymous"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={nextTrack}
      />
      <button onClick={prevTrack} className="ip-control" type="button" title="Previous track" aria-label="Previous track">
        <SkipBack size={16} strokeWidth={1.8} />
      </button>
      <button onClick={togglePlay} className="ip-play" type="button" title={isPlaying ? 'Pause' : 'Play'} aria-label={isPlaying ? 'Pause' : 'Play'}>
        {isPlaying ? <Pause size={18} strokeWidth={1.9} /> : <Play size={18} strokeWidth={1.9} />}
      </button>
      <button onClick={nextTrack} className="ip-control" type="button" title="Next track" aria-label="Next track">
        <SkipForward size={16} strokeWidth={1.8} />
      </button>
      <div
        className="ip-progress"
        onClick={handleSeek}
        role="button"
        tabIndex={0}
        onKeyDown={() => {}}
      >
        <div style={{ width: `${progress}%`, background: currentTrack?.primary_color }} />
      </div>
      <span>{fmt(currentTime)} / {fmt(duration)}</span>
      {error && <strong className="ip-player-error">{error}</strong>}
    </footer>
  );
}
