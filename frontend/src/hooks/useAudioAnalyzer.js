import { useEffect, useMemo, useState } from "react";

const audioGraphs = new WeakMap();
const EMPTY_FREQUENCIES = new Uint8Array(0);

const clamp01 = (value) => Math.max(0, Math.min(1, value));

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
  if (audioTarget instanceof HTMLAudioElement) return audioTarget;
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

    if (!enabled || !audioElement || !AudioContextClass) {
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

    if (!graph) {
      const ctx = new AudioContextClass();
      const source = ctx.createMediaElementSource(audioElement);
      const analyser = ctx.createAnalyser();

      analyser.fftSize = 512;
      analyser.smoothingTimeConstant = 0.78;
      source.connect(analyser);
      analyser.connect(ctx.destination);

      graph = { ctx, analyser, source };
      audioGraphs.set(audioElement, graph);
    }

    graph.ctx.resume?.().catch(() => {});

    const data = new Uint8Array(graph.analyser.frequencyBinCount);
    let frameId;

    const update = () => {
      graph.analyser.getByteFrequencyData(data);

      const bass = averageRange(data, 0, 0.12);
      const mid = averageRange(data, 0.12, 0.48);
      const treble = averageRange(data, 0.48, 1);
      const intensity = clamp01(bass * 0.48 + mid * 0.34 + treble * 0.18);

      setSnapshot({
        frequencies: new Uint8Array(data),
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
