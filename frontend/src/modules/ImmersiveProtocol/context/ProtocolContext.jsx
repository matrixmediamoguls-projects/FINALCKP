import React, { createContext, useCallback, useContext, useRef, useState } from 'react';
import { useAudioAnalyser } from '../useAudioAnalyser';
import useReclamationTracks from '../useReclamationTracks';

const ProtocolContext = createContext(null);

export function ProtocolProvider({ children }) {
  const { tracks, loading, error } = useReclamationTracks();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef(null);
  const { audioData, connectAudioElement, stopAudioAnalyser } = useAudioAnalyser();

  const currentTrack = tracks[currentIndex];

  const selectTrack = useCallback((index) => {
    if (audioRef.current) audioRef.current.pause();
    stopAudioAnalyser();
    setIsPlaying(false);
    setProgress(0);
    setDuration(0);
    setCurrentTime(0);
    setCurrentIndex(index);
  }, [stopAudioAnalyser]);

  const togglePlay = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio || !currentTrack?.audio_url) return;
    if (audio.src !== currentTrack.audio_url) {
      audio.src = currentTrack.audio_url;
      audio.load();
    }
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
      return;
    }
    await connectAudioElement(audio);
    await audio.play();
    setIsPlaying(true);
  }, [connectAudioElement, currentTrack, isPlaying]);

  const nextTrack = useCallback(
    () => selectTrack((currentIndex + 1) % tracks.length),
    [currentIndex, selectTrack, tracks.length]
  );

  const prevTrack = useCallback(
    () => selectTrack((currentIndex - 1 + tracks.length) % tracks.length),
    [currentIndex, selectTrack, tracks.length]
  );

  const handleTimeUpdate = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    setCurrentTime(audio.currentTime);
    setDuration(audio.duration || 0);
    setProgress(audio.duration ? (audio.currentTime / audio.duration) * 100 : 0);
  }, []);

  const handleLoadedMetadata = useCallback(() => {
    setDuration(audioRef.current?.duration || 0);
  }, []);

  const handleSeek = useCallback((event) => {
    const audio = audioRef.current;
    if (!audio || !duration) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width));
    audio.currentTime = ratio * duration;
  }, [duration]);

  return (
    <ProtocolContext.Provider value={{
      tracks,
      loading,
      error,
      currentIndex,
      currentTrack,
      audioData,
      audioRef,
      isPlaying,
      progress,
      duration,
      currentTime,
      selectTrack,
      togglePlay,
      nextTrack,
      prevTrack,
      handleTimeUpdate,
      handleLoadedMetadata,
      handleSeek,
    }}>
      {children}
    </ProtocolContext.Provider>
  );
}

export function useProtocol() {
  const ctx = useContext(ProtocolContext);
  if (!ctx) throw new Error('useProtocol must be used within ProtocolProvider');
  return ctx;
}
