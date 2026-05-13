import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
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
  const [playbackError, setPlaybackError] = useState('');
  const audioRef = useRef(null);
  const { audioData, connectAudioElement, stopAudioAnalyser } = useAudioAnalyser();

  const currentTrack = tracks[currentIndex] || tracks[0];

  useEffect(() => {
    if (currentIndex >= tracks.length) setCurrentIndex(0);
  }, [currentIndex, tracks.length]);

  const selectTrack = useCallback((index) => {
    if (audioRef.current) audioRef.current.pause();
    stopAudioAnalyser();
    setIsPlaying(false);
    setPlaybackError('');
    setProgress(0);
    setDuration(0);
    setCurrentTime(0);
    setCurrentIndex(index);
  }, [stopAudioAnalyser]);

  const togglePlay = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio || !currentTrack?.audio_url) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
      return;
    }

    try {
      if (audio.getAttribute('src') !== currentTrack.audio_url) {
        audio.setAttribute('src', currentTrack.audio_url);
        audio.load();
      }

      setPlaybackError('');
      await connectAudioElement(audio);
      await audio.play();
      setIsPlaying(true);
    } catch (playError) {
      setIsPlaying(false);
      setPlaybackError('Audio could not start. Check the track file or browser audio permission.');
    }
  }, [connectAudioElement, currentTrack, isPlaying]);

  const nextTrack = useCallback(() => {
    if (!tracks.length) return;
    selectTrack((currentIndex + 1) % tracks.length);
  }, [currentIndex, selectTrack, tracks.length]);

  const prevTrack = useCallback(() => {
    if (!tracks.length) return;
    selectTrack((currentIndex - 1 + tracks.length) % tracks.length);
  }, [currentIndex, selectTrack, tracks.length]);

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
      error: playbackError || error,
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
