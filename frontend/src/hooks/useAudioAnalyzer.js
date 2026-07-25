import { useEffect, useMemo, useState } from "react";

const audioGraphs = new WeakMap();
const EMPTY_FREQUENCIES = new Uint8Array(0);

const clamp01 = (value) => Math.max(0, Math.min(1, value));
const SILENT_FRAME_LIMIT = 4;

export const createPlaybackSpectrum = (time, length = 256) => (
  Uint8Array.from({ length }, (_, index) => {
    const position = index / Math.max(1, length - 1);
    const bass = Math.pow(Math.max(0, Math.sin(time * 6.2 - position * 3.1)), 2.4);
    const mid = Math.pow(Math.max(0, Math.sin(time * 10.1 + position * 11.7)), 2);
    const high = 0.5 + 0.5 * Math.sin(time * 16.4 + index * 1.91);
    const rolloff = 1 - position * 0.68;
    return Math.min(255, Math.round((24 + bass * 144 + mid * 62 + high * 38) * rolloff));
  })
);

const averageRange = (data, startRatio, endRatio) => {
  if (!data?.length) return 0;

  const start = Math.max(0, Math.floor(data.length * startRatio));
  const end = Math.max(start + 1, Math.floor(data.length * endRatio));
  let total = 0;

  for (let index = start; index < Math.min(end, data.length); index += 1) {
    total += data[index];
  }

  return clamp01(total / Math.max(1, end - start) / 255);
};

const resolveAudioElement = (audioTarget) => {
  if (!audioTarget) return null;
  if (typeof HTMLAudioElement !== "undefined" && audioTarget instanceof HTMLAudioElement) return audioTarget;
  return audioTarget.current || null;
};

export default function useAudioAnalyzer(audioTarget, enabled = true) {
  const [snapshot, setSnapshot] = useState({
    frequencies: EMPTY_FREQUENCIES,
    bass: 0,
    mid: 0,
    treble: 0,
    intensity: 0,
  });

  useEffect(() => {
    const audioElement = resolveAudioElement(audioTarget);
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;

    if (!enabled || !audioElement) {
      setSnapshot((current) => ({
        frequencies: current.frequencies,
        bass: current.bass * 0.86,
        mid: current.mid * 0.86,
        treble: current.treble * 0.86,
        intensity: current.intensity * 0.86,
      }));
      return undefined;
    }

    let graph = audioGraphs.get(audioElement);

    if (!graph && AudioContextClass) {
      try {
        const ctx = new AudioContextClass();
        const source = ctx.createMediaElementSource(audioElement);
        const analyser = ctx.createAnalyser();

        analyser.fftSize = 512;
        analyser.smoothingTimeConstant = 0.72;
        source.connect(analyser);
        analyser.connect(ctx.destination);

        graph = { ctx, analyser, source };
        audioGraphs.set(audioElement, graph);
      } catch (error) {
        console.warn("Live FFT graph unavailable; using playback-synced spectrum.", error);
        graph = { ctx: null, analyser: null, source: null };
      }
    }

    if (!graph) graph = { ctx: null, analyser: null, source: null };

    graph.ctx?.resume?.().catch(() => {});

    const data = new Uint8Array(graph.analyser?.frequencyBinCount || 256);
    let frameId;
    let silentFrames = 0;

    const update = () => {
      if (graph.analyser) graph.analyser.getByteFrequencyData(data);

      const hasSignal = data.some((value) => value > 1);
      silentFrames = hasSignal ? 0 : silentFrames + 1;
      const frameData = silentFrames >= SILENT_FRAME_LIMIT
        ? createPlaybackSpectrum(Math.max(audioElement.currentTime || 0, performance.now() / 1000), data.length)
        : data;

      const bass = averageRange(frameData, 0, 0.12);
      const mid = averageRange(frameData, 0.12, 0.48);
      const treble = averageRange(frameData, 0.48, 1);
      const intensity = clamp01(bass * 0.48 + mid * 0.34 + treble * 0.18);

      setSnapshot({
        frequencies: new Uint8Array(frameData),
        bass,
        mid,
        treble,
        intensity,
      });

      frameId = window.requestAnimationFrame(update);
    };

    update();

    return () => {
      if (frameId) window.cancelAnimationFrame(frameId);
    };
  }, [audioTarget, enabled]);

  return useMemo(() => snapshot, [snapshot]);
}
