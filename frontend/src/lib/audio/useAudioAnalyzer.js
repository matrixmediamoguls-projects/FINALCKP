import { useCallback, useEffect, useRef, useState } from 'react';

const SILENT_FRAME_LIMIT = 4;

export function createPlaybackSpectrum(time, length) {
  return Array.from({ length }, (_, index) => {
    const position = index / Math.max(1, length - 1);
    const bassPulse = Math.pow(Math.max(0, Math.sin(time * 5.8 - position * 2.2)), 3);
    const midPulse = Math.pow(Math.max(0, Math.sin(time * 8.7 + position * 8.4)), 2);
    const shimmer = .5 + .5 * Math.sin(time * 13.1 + index * 1.73);
    const rolloff = 1 - position * .72;
    return Math.round(Math.min(255, (28 + bassPulse * 126 + midPulse * 58 + shimmer * 34) * rolloff));
  });
}

export function useAudioAnalyzer(audioElementRef) {
  const audioContextRef = useRef(null);
  const analyzerRef = useRef(null);
  const sourceRef = useRef(null);
  const frameRef = useRef(null);
  const keepAliveRef = useRef(null);
  const silentFramesRef = useRef(0);
  const [frequencyData, setFrequencyData] = useState([]);
  const [audioLevel, setAudioLevel] = useState(0);

  const connect = useCallback(() => {
    const audio = audioElementRef.current;
    if (!audio || analyzerRef.current) return audioContextRef.current;

    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return null;

    const context = new AudioContext();
    const analyzer = context.createAnalyser();
    analyzer.fftSize = 256;

    try {
      // A captured MediaStream stays associated with the first resource loaded
      // by an audio element in Chromium. A MediaElementSource follows `src`
      // changes, so the same graph keeps analyzing every track in the queue.
      const source = context.createMediaElementSource(audio);
      source.connect(analyzer);
      analyzer.connect(context.destination);

      audioContextRef.current = context;
      analyzerRef.current = analyzer;
      sourceRef.current = source;
      return context;
    } catch (error) {
      console.warn('Audio analysis unavailable; continuing direct playback.', error);
      context.close();
      return null;
    }
  }, [audioElementRef]);

  const start = useCallback(async () => {
    connect();

    const analyzer = analyzerRef.current;
    if (audioContextRef.current?.state === 'suspended') {
      await audioContextRef.current.resume();
    }

    const buffer = new Uint8Array(analyzer?.frequencyBinCount || 128);

    const tick = () => {
      if (analyzer) analyzer.getByteFrequencyData(buffer);
      let values = Array.from(buffer);
      const audio = audioElementRef.current;
      const hasSignal = values.some((value) => value > 0);

      silentFramesRef.current = hasSignal ? 0 : silentFramesRef.current + 1;
      // Some browser/device combinations keep a MediaElementSource graph alive
      // but return zero-filled FFT frames. Preserve real FFT data whenever it is
      // available and only recover after sustained silence during active playback.
      if (
        silentFramesRef.current >= SILENT_FRAME_LIMIT
        && audio
        && !audio.paused
        && !audio.ended
      ) {
        const playbackClock = Math.max(audio.currentTime || 0, performance.now() / 1000);
        values = createPlaybackSpectrum(playbackClock, buffer.length);
      }
      const average = values.reduce((sum, value) => sum + value, 0) / values.length;
      setFrequencyData(values);
      setAudioLevel(Math.round(average));
      frameRef.current = requestAnimationFrame(tick);
    };

    if (frameRef.current) cancelAnimationFrame(frameRef.current);
    if (keepAliveRef.current) window.clearInterval(keepAliveRef.current);
    keepAliveRef.current = window.setInterval(() => {
      const context = audioContextRef.current;
      const audio = audioElementRef.current;
      if (context?.state === 'suspended' && audio && !audio.paused && !audio.ended) {
        context.resume().catch(() => {});
      }
    }, 1000);
    tick();
  }, [audioElementRef, connect]);

  const stop = useCallback(() => {
    if (frameRef.current) cancelAnimationFrame(frameRef.current);
    frameRef.current = null;
    if (keepAliveRef.current) window.clearInterval(keepAliveRef.current);
    keepAliveRef.current = null;
    silentFramesRef.current = 0;
  }, []);

  useEffect(() => () => {
    stop();
    audioContextRef.current?.close();
    audioContextRef.current = null;
    analyzerRef.current = null;
    sourceRef.current = null;
  }, [stop]);

  return { connect, start, stop, frequencyData, audioLevel };
}
