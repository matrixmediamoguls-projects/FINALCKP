import React, { useMemo, useRef, useState } from 'react';
import AudioEngine from './AudioEngine';

const formatTime = (seconds) => {
  if (!Number.isFinite(seconds)) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60).toString().padStart(2, '0');
  return `${mins}:${secs}`;
};

export default function ProtocolPlayer({ tracks, currentTrackIndex, setCurrentTrackIndex, connectAudio }) {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  const currentTrack = tracks[currentTrackIndex];

  const controls = useMemo(() => ({
    previous: () => setCurrentTrackIndex((index) => (index - 1 + tracks.length) % tracks.length),
    next: () => setCurrentTrackIndex((index) => (index + 1) % tracks.length),
  }), [setCurrentTrackIndex, tracks.length]);

  const togglePlayback = async () => {
    if (!audioRef.current) return;
    if (audioRef.current.paused) {
      await audioRef.current.play();
      connectAudio(audioRef.current);
      setIsPlaying(true);
    } else {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const onSeek = (event) => {
    if (!audioRef.current || !duration) return;
    const next = Number(event.target.value);
    audioRef.current.currentTime = (next / 1000) * duration;
    setProgress(next);
  };

  return (
    <footer className="protocol-player">
      <AudioEngine
        ref={audioRef}
        src={currentTrack?.audio_url}
        onLoadedMetadata={() => setDuration(audioRef.current?.duration || 0)}
        onTimeUpdate={() => {
          const current = audioRef.current?.currentTime || 0;
          setProgress(duration ? (current / duration) * 1000 : 0);
        }}
        onEnded={controls.next}
      />

      <div className="protocol-player-now">
        <span className="kicker">NOW PLAYING</span>
        <h3>{currentTrack?.title || 'NO TRACK'}</h3>
        <p>{currentTrack?.act || ''}</p>
      </div>

      <div className="protocol-player-controls">
        <button type="button" onClick={controls.previous}>Prev</button>
        <button type="button" onClick={togglePlayback}>{isPlaying ? 'Pause' : 'Play'}</button>
        <button type="button" onClick={controls.next}>Next</button>
      </div>

      <div className="protocol-player-timeline">
        <span>{formatTime((progress / 1000) * duration)}</span>
        <input type="range" min="0" max="1000" value={progress} onChange={onSeek} />
        <span>{formatTime(duration)}</span>
      </div>
    </footer>
  );
}
