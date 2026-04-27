import { useCallback, useEffect, useRef, useState } from 'react';

const EMPTY_AUDIO_DATA = {
  frequencyData: [],
  averageVolume: 0,
  bassLevel: 0,
  midLevel: 0,
  trebleLevel: 0,
};

const averageRange = (array, startRatio, endRatio) => {
  if (!array || array.length === 0) return 0;
  const start = Math.floor(array.length * startRatio);
  const end = Math.max(start + 1, Math.floor(array.length * endRatio));
  let total = 0;
  for (let i = start; i < end; i += 1) total += array[i] || 0;
  return total / (end - start) / 255;
};

export const useAudioAnalyser = () => {
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const sourceRef = useRef(null);
  const rafRef = useRef(null);
  const previousRef = useRef(EMPTY_AUDIO_DATA);
  const [audioData, setAudioData] = useState(EMPTY_AUDIO_DATA);

  const stop = useCallback(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    setAudioData(EMPTY_AUDIO_DATA);
  }, []);

  const tick = useCallback(() => {
    const analyser = analyserRef.current;
    if (!analyser) return;

    const buffer = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(buffer);

    const rawAverage = averageRange(buffer, 0, 1);
    const rawBass = averageRange(buffer, 0, 0.12);
    const rawMid = averageRange(buffer, 0.12, 0.55);
    const rawTreble = averageRange(buffer, 0.55, 1);

    const previous = previousRef.current;
    const smooth = (next, prev, factor = 0.78) => prev * factor + next * (1 - factor);

    const nextData = {
      frequencyData: Array.from(buffer),
      averageVolume: smooth(rawAverage, previous.averageVolume),
      bassLevel: smooth(rawBass, previous.bassLevel),
      midLevel: smooth(rawMid, previous.midLevel),
      trebleLevel: smooth(rawTreble, previous.trebleLevel),
    };

    previousRef.current = nextData;
    setAudioData(nextData);
    rafRef.current = requestAnimationFrame(tick);
  }, []);

  const connectAudioElement = useCallback(async (audioElement) => {
    if (!audioElement) return;

    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;

    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContextClass();
    }

    if (audioContextRef.current.state === 'suspended') {
      await audioContextRef.current.resume();
    }

    if (!analyserRef.current) {
      const analyser = audioContextRef.current.createAnalyser();
      analyser.fftSize = 1024;
      analyser.smoothingTimeConstant = 0.82;
      analyserRef.current = analyser;
    }

    if (!sourceRef.current) {
      sourceRef.current = audioContextRef.current.createMediaElementSource(audioElement);
      sourceRef.current.connect(analyserRef.current);
      analyserRef.current.connect(audioContextRef.current.destination);
    }

    if (!rafRef.current) tick();
  }, [tick]);

  useEffect(() => () => stop(), [stop]);

  return {
    audioData,
    connectAudioElement,
    stopAudioAnalyser: stop,
  };
};
