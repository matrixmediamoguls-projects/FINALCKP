import { useCallback, useEffect, useRef, useState } from 'react';

export const EMPTY_AUDIO_DATA = {
  frequencyData: [],
  bass: 0,
  mid: 0,
  high: 0,
  energy: 0,
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

  for (let index = start; index < end; index += 1) {
    total += array[index] || 0;
  }

  return total / (end - start) / 255;
};

const smooth = (next, previous, factor = 0.76) => previous * factor + next * (1 - factor);

export function useAudioAnalysis() {
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const sourceRef = useRef(null);
  const sourceElementRef = useRef(null);
  const bufferRef = useRef(null);
  const rafRef = useRef(null);
  const previousRef = useRef(EMPTY_AUDIO_DATA);
  const [audioData, setAudioData] = useState(EMPTY_AUDIO_DATA);

  const stop = useCallback(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }

    previousRef.current = EMPTY_AUDIO_DATA;
    setAudioData(EMPTY_AUDIO_DATA);
  }, []);

  const tick = useCallback(() => {
    const analyser = analyserRef.current;
    if (!analyser) return;

    if (!bufferRef.current || bufferRef.current.length !== analyser.frequencyBinCount) {
      bufferRef.current = new Uint8Array(analyser.frequencyBinCount);
    }

    const buffer = bufferRef.current;
    analyser.getByteFrequencyData(buffer);

    const rawBass = averageRange(buffer, 0, 0.12);
    const rawMid = averageRange(buffer, 0.12, 0.55);
    const rawHigh = averageRange(buffer, 0.55, 1);
    const rawEnergy = (rawBass + rawMid + rawHigh) / 3;

    const previous = previousRef.current;
    const bass = smooth(rawBass, previous.bass);
    const mid = smooth(rawMid, previous.mid);
    const high = smooth(rawHigh, previous.high);
    const energy = smooth(rawEnergy, previous.energy);

    const nextData = {
      frequencyData: Array.from(buffer),
      bass,
      mid,
      high,
      energy,
      averageVolume: energy,
      bassLevel: bass,
      midLevel: mid,
      trebleLevel: high,
    };

    previousRef.current = nextData;
    setAudioData(nextData);
    rafRef.current = requestAnimationFrame(tick);
  }, []);

  const connectAudioElement = useCallback(async (audioElement) => {
    if (!audioElement) return false;

    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return false;

    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContextClass();
    }

    if (audioContextRef.current.state === 'suspended') {
      await audioContextRef.current.resume();
    }

    if (!analyserRef.current) {
      const analyser = audioContextRef.current.createAnalyser();
      analyser.fftSize = 1024;
      analyser.smoothingTimeConstant = 0.78;
      analyserRef.current = analyser;
    }

    if (sourceElementRef.current !== audioElement) {
      if (sourceRef.current) sourceRef.current.disconnect();
      sourceRef.current = audioContextRef.current.createMediaElementSource(audioElement);
      sourceRef.current.connect(analyserRef.current);
      analyserRef.current.connect(audioContextRef.current.destination);
      sourceElementRef.current = audioElement;
    }

    if (!rafRef.current) {
      rafRef.current = requestAnimationFrame(tick);
    }

    return true;
  }, [tick]);

  useEffect(() => () => stop(), [stop]);

  return {
    audioData,
    connectAudioElement,
    stopAudioAnalyser: stop,
  };
}
