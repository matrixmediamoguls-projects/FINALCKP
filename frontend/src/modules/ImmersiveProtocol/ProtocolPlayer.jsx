import React from 'react';
import { useProtocol } from './context/ProtocolContext';
import AudioEngine from './AudioEngine';

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
    handleSeek,
    audioRef,
    handleTimeUpdate,
    handleLoadedMetadata,
    handleCanPlay,
    handlePlay,
    handlePause,
    handleAudioError,
    mediaStatus,
    audioError,
  } = useProtocol();
  const canPlay = Boolean(currentTrack?.audio_url);

  return (
    <footer className="ip-player">
      <AudioEngine
        ref={audioRef}
        src={currentTrack?.audio_url || ''}
        crossOrigin={currentTrack?.audio_cross_origin}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onCanPlay={handleCanPlay}
        onPlay={handlePlay}
        onPause={handlePause}
        onError={handleAudioError}
        onEnded={nextTrack}
      />
      <div className="ip-player-meta">
        <strong>{currentTrack?.title || 'No transmission selected'}</strong>
        <span>{currentTrack?.artist || currentTrack?.act || 'Act III'} / {mediaStatus}</span>
      </div>
      <button onClick={prevTrack} className="ip-control" type="button">PREV</button>
      <button onClick={togglePlay} className="ip-play" type="button" disabled={!canPlay}>
        {canPlay ? (isPlaying ? 'PAUSE' : 'PLAY') : 'NO AUDIO'}
      </button>
      <button onClick={nextTrack} className="ip-control" type="button">NEXT</button>
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
      {audioError && <span className="ip-player-error">{audioError}</span>}
    </footer>
  );
}
