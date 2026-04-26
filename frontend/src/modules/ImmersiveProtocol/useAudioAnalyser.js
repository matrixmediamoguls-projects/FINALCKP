import { useCallback, useEffect, useRef, useState } from 'react';

const smoothStep = (previous, next, easing = 0.15) => previous + (next - previous) * easing;

export default function useAudioAnalyser() {
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const sourceRef = useRef(null);
  const frameRef = useRef(null);
  const dataRef = useRef(new Uint8Array(256));
  const smoothRef = useRef({ averageVolume: 0, bassLevel: 0, midLevel: 0, trebleLevel: 0 });

  const [audioData, setAudioData] = useState({
    frequencyData: Array(128).fill(0),
    averageVolume: 0,
    bassLevel: 0,
    midLevel: 0,
    trebleLevel: 0,
  });

  const stop = useCallback(() => {
    if (frameRef.current) cancelAnimationFrame(frameRef.current);
    frameRef.current = null;
  }, []);

  const tick = useCallback(() => {
    const analyser = analyserRef.current;
    if (!analyser) return;

    analyser.getByteFrequencyData(dataRef.current);
    const spectrum = dataRef.current;
    const chunkSize = spectrum.length;

    let total = 0;
    let bass = 0;
    let mid = 0;
    let treble = 0;

    for (let i = 0; i < chunkSize; i += 1) {
      const value = spectrum[i] / 255;
      total += value;
      if (i < chunkSize * 0.2) bass += value;
      else if (i < chunkSize * 0.65) mid += value;
      else treble += value;
    }

    const averageVolumeRaw = total / chunkSize;
    const bassRaw = bass / Math.max(1, chunkSize * 0.2);
    const midRaw = mid / Math.max(1, chunkSize * 0.45);
    const trebleRaw = treble / Math.max(1, chunkSize * 0.35);

    smoothRef.current = {
      averageVolume: smoothStep(smoothRef.current.averageVolume, averageVolumeRaw, 0.22),
      bassLevel: smoothStep(smoothRef.current.bassLevel, bassRaw, 0.2),
      midLevel: smoothStep(smoothRef.current.midLevel, midRaw, 0.18),
      trebleLevel: smoothStep(smoothRef.current.trebleLevel, trebleRaw, 0.16),
    };

    const sampled = Array.from(spectrum).filter((_, i) => i % 2 === 0).map((n) => n / 255);

    setAudioData({ frequencyData: sampled, ...smoothRef.current });
    frameRef.current = requestAnimationFrame(tick);
  }, []);

  const connect = useCallback((audioElement) => {
    if (!audioElement) return;

    const audioContext =
      audioContextRef.current ||
      new (window.AudioContext || window.webkitAudioContext)();

    audioContextRef.current = audioContext;

    if (!sourceRef.current) {
      sourceRef.current = audioContext.createMediaElementSource(audioElement);
    }

    if (!analyserRef.current) {
      analyserRef.current = audioContext.createAnalyser();
      analyserRef.current.fftSize = 512;
      dataRef.current = new Uint8Array(analyserRef.current.frequencyBinCount);
      sourceRef.current.connect(analyserRef.current);
      analyserRef.current.connect(audioContext.destination);
    }

    if (audioContext.state === 'suspended') audioContext.resume();
    stop();
    frameRef.current = requestAnimationFrame(tick);
  }, [stop, tick]);

  useEffect(() => () => stop(), [stop]);

  return { audioData, connect, stop };
}
