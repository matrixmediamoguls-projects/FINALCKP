import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useAudioAnalyser } from '../useAudioAnalyser';
import useReclamationTracks from '../useReclamationTracks';

const ProtocolContext = createContext(null);

const shouldUseAudioAnalyser = (track) => {
  if (!track?.audio_url) return false;

  if (track.audio_cross_origin) return true;

  try {
    return new URL(track.audio_url, window.location.origin).origin === window.location.origin;
  } catch {
    return false;
  }
};

export function ProtocolProvider({ children }) {
  const { tracks, loading, error } = useReclamationTracks();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [mediaStatus, setMediaStatus] = useState('idle');
  const [audioError, setAudioError] = useState('');
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef(null);
  const autoplayNextRef = useRef(false);
  const { audioData, connectAudioElement, stopAudioAnalyser } = useAudioAnalyser();

  const currentTrack = tracks[currentIndex];
  const lyricLines = currentTrack?.lyric_lines || [];
  const timedLyricLines = lyricLines.filter((line) => Number.isFinite(line.time));

  const activeLyricIndex = useMemo(() => {
    if (!lyricLines.length) return -1;

    if (timedLyricLines.length) {
      let timedIndex = 0;
      timedLyricLines.forEach((line, index) => {
        if (currentTime >= line.time) timedIndex = index;
      });

      return lyricLines.indexOf(timedLyricLines[timedIndex]);
    }

    if (!duration) return 0;
    return Math.min(lyricLines.length - 1, Math.floor((currentTime / duration) * lyricLines.length));
  }, [currentTime, duration, lyricLines, timedLyricLines]);

  const activeLyric = activeLyricIndex >= 0 ? lyricLines[activeLyricIndex] : null;
  const visibleLyrics = useMemo(() => {
    if (!lyricLines.length) return [];
    const center = Math.max(0, activeLyricIndex);
    const start = Math.max(0, center - 1);
    return lyricLines.slice(start, start + 4);
  }, [activeLyricIndex, lyricLines]);

  const playbackState = useMemo(() => ({
    currentTime,
    duration,
    progress,
    isPlaying,
    mediaStatus,
    audioError,
    activeLyric,
    activeLyricIndex,
    visibleLyrics,
    lyricCount: lyricLines.length,
  }), [
    activeLyric,
    activeLyricIndex,
    audioError,
    currentTime,
    duration,
    isPlaying,
    lyricLines.length,
    mediaStatus,
    progress,
    visibleLyrics,
  ]);

  const playAudioElement = useCallback(async (audio, track) => {
    if (!audio || !track?.audio_url) return;
    setMediaStatus('buffering');
    setAudioError('');

    if (shouldUseAudioAnalyser(track)) {
      try {
        await connectAudioElement(audio);
      } catch {
        stopAudioAnalyser();
        setAudioError('Audio active; analyzer requires CORS-enabled Cloudflare media.');
      }
    } else {
      stopAudioAnalyser();
    }

    await audio.play();
    setIsPlaying(true);
    setMediaStatus('playing');
  }, [connectAudioElement, stopAudioAnalyser]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack?.audio_url) return;

    if (audio.src !== currentTrack.audio_url) {
      audio.src = currentTrack.audio_url;
      audio.load();
    }

    if (!autoplayNextRef.current) return;
    autoplayNextRef.current = false;

    playAudioElement(audio, currentTrack).catch((playError) => {
      setIsPlaying(false);
      setMediaStatus('error');
      setAudioError(playError?.message || 'Unable to start audio playback.');
    });
  }, [currentTrack, playAudioElement]);

  const selectTrack = useCallback((index, options = {}) => {
    autoplayNextRef.current = Boolean(options.autoplay);
    if (audioRef.current) audioRef.current.pause();
    stopAudioAnalyser();
    setIsPlaying(false);
    setMediaStatus('idle');
    setAudioError('');
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
      setMediaStatus('paused');
      return;
    }
    try {
      await playAudioElement(audio, currentTrack);
    } catch (playError) {
      setIsPlaying(false);
      setMediaStatus('error');
      setAudioError(playError?.message || 'Unable to start audio playback.');
    }
  }, [currentTrack, isPlaying, playAudioElement]);

  const nextTrack = useCallback(
    () => {
      if (!tracks.length) return;
      selectTrack((currentIndex + 1) % tracks.length, { autoplay: isPlaying });
    },
    [currentIndex, isPlaying, selectTrack, tracks.length]
  );

  const prevTrack = useCallback(
    () => {
      if (!tracks.length) return;
      selectTrack((currentIndex - 1 + tracks.length) % tracks.length, { autoplay: isPlaying });
    },
    [currentIndex, isPlaying, selectTrack, tracks.length]
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
    setMediaStatus((status) => (status === 'buffering' ? 'ready' : status));
  }, []);

  const handleCanPlay = useCallback(() => {
    setMediaStatus((status) => (status === 'buffering' || status === 'idle' ? 'ready' : status));
  }, []);

  const handlePlay = useCallback(() => {
    setIsPlaying(true);
    setMediaStatus('playing');
  }, []);

  const handlePause = useCallback(() => {
    setIsPlaying(false);
    setMediaStatus('paused');
  }, []);

  const handleAudioError = useCallback(() => {
    setIsPlaying(false);
    setMediaStatus('error');
    setAudioError('Audio source could not be loaded.');
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
      mediaStatus,
      audioError,
      lyricLines,
      activeLyric,
      activeLyricIndex,
      visibleLyrics,
      playbackState,
      selectTrack,
      togglePlay,
      nextTrack,
      prevTrack,
      handleTimeUpdate,
      handleLoadedMetadata,
      handleCanPlay,
      handlePlay,
      handlePause,
      handleAudioError,
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
