import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type AudioContextConstructor = typeof AudioContext;

type WebAudioWindow = Window &
  typeof globalThis & {
    webkitAudioContext?: AudioContextConstructor;
  };

type AudioGraph = {
  audioContext: AudioContext;
  analyser: AnalyserNode;
  source: MediaElementAudioSourceNode;
};

export type AudioAnalyzerRefs = {
  analyserRef: React.MutableRefObject<AnalyserNode | null>;
  frequencyDataRef: React.MutableRefObject<Uint8Array>;
  timeDomainDataRef: React.MutableRefObject<Uint8Array>;
  bassRef: React.MutableRefObject<number>;
  lowMidRef: React.MutableRefObject<number>;
  midRef: React.MutableRefObject<number>;
  trebleRef: React.MutableRefObject<number>;
  volumeRef: React.MutableRefObject<number>;
  isReady: boolean;
  isRunning: boolean;
  resume: () => Promise<void>;
};

export type UseAudioAnalyzerOptions = {
  enabled?: boolean;
  fftSize?: number;
  smoothingTimeConstant?: number;
};

const audioGraphs = new WeakMap<HTMLAudioElement, AudioGraph>();
const EMPTY_DATA = new Uint8Array(0);

const clamp01 = (value: number) => Math.max(0, Math.min(1, value));

const averageBand = (data: Uint8Array, startRatio: number, endRatio: number) => {
  if (!data.length) return 0;

  const start = Math.max(0, Math.floor(data.length * startRatio));
  const end = Math.min(data.length, Math.max(start + 1, Math.floor(data.length * endRatio)));
  let total = 0;

  for (let index = start; index < end; index += 1) {
    total += data[index];
  }

  return clamp01(total / Math.max(1, end - start) / 255);
};

const averageTimeDomainVolume = (data: Uint8Array) => {
  if (!data.length) return 0;

  let total = 0;
  for (let index = 0; index < data.length; index += 1) {
    const centered = (data[index] - 128) / 128;
    total += centered * centered;
  }

  return clamp01(Math.sqrt(total / data.length));
};

const getAudioContextConstructor = () => {
  if (typeof window === "undefined") return null;
  const audioWindow = window as WebAudioWindow;
  return audioWindow.AudioContext || audioWindow.webkitAudioContext || null;
};

const getOrCreateAudioGraph = (
  audioElement: HTMLAudioElement,
  fftSize: number,
  smoothingTimeConstant: number
) => {
  const AudioContextClass = getAudioContextConstructor();
  if (!AudioContextClass) return null;

  const existingGraph = audioGraphs.get(audioElement);
  if (existingGraph) {
    existingGraph.analyser.fftSize = fftSize;
    existingGraph.analyser.smoothingTimeConstant = smoothingTimeConstant;
    return existingGraph;
  }

  const audioContext = new AudioContextClass();
  const source = audioContext.createMediaElementSource(audioElement);
  const analyser = audioContext.createAnalyser();

  analyser.fftSize = fftSize;
  analyser.smoothingTimeConstant = smoothingTimeConstant;

  source.connect(analyser);
  analyser.connect(audioContext.destination);

  const graph = { audioContext, analyser, source };
  audioGraphs.set(audioElement, graph);
  return graph;
};

export default function useAudioAnalyzer(
  audioElement: HTMLAudioElement | null,
  options: UseAudioAnalyzerOptions = {}
): AudioAnalyzerRefs {
  const { enabled = true, fftSize = 2048, smoothingTimeConstant = 0.82 } = options;

  const analyserRef = useRef<AnalyserNode | null>(null);
  const graphRef = useRef<AudioGraph | null>(null);
  const frequencyDataRef = useRef<Uint8Array>(EMPTY_DATA);
  const timeDomainDataRef = useRef<Uint8Array>(EMPTY_DATA);
  const bassRef = useRef(0);
  const lowMidRef = useRef(0);
  const midRef = useRef(0);
  const trebleRef = useRef(0);
  const volumeRef = useRef(0);
  const [isReady, setIsReady] = useState(false);
  const [isRunning, setIsRunning] = useState(false);

  const resume = useCallback(async () => {
    const graph = graphRef.current;
    if (!graph) return;

    if (graph.audioContext.state === "suspended") {
      await graph.audioContext.resume();
    }
  }, []);

  useEffect(() => {
    if (!audioElement || !enabled) {
      setIsReady(false);
      setIsRunning(false);
      return undefined;
    }

    const graph = getOrCreateAudioGraph(audioElement, fftSize, smoothingTimeConstant);
    if (!graph) {
      setIsReady(false);
      setIsRunning(false);
      return undefined;
    }

    graphRef.current = graph;
    analyserRef.current = graph.analyser;
    frequencyDataRef.current = new Uint8Array(graph.analyser.frequencyBinCount);
    timeDomainDataRef.current = new Uint8Array(graph.analyser.fftSize);
    setIsReady(true);
    setIsRunning(true);

    let frameId = 0;
    let cancelled = false;

    const tick = () => {
      if (cancelled) return;

      graph.analyser.getByteFrequencyData(frequencyDataRef.current);
      graph.analyser.getByteTimeDomainData(timeDomainDataRef.current);

      bassRef.current = averageBand(frequencyDataRef.current, 0, 0.11);
      lowMidRef.current = averageBand(frequencyDataRef.current, 0.11, 0.28);
      midRef.current = averageBand(frequencyDataRef.current, 0.28, 0.58);
      trebleRef.current = averageBand(frequencyDataRef.current, 0.58, 1);
      volumeRef.current = averageTimeDomainVolume(timeDomainDataRef.current);

      frameId = window.requestAnimationFrame(tick);
    };

    tick();

    return () => {
      cancelled = true;
      if (frameId) window.cancelAnimationFrame(frameId);
      setIsRunning(false);
    };
  }, [audioElement, enabled, fftSize, smoothingTimeConstant]);

  return useMemo(
    () => ({
      analyserRef,
      frequencyDataRef,
      timeDomainDataRef,
      bassRef,
      lowMidRef,
      midRef,
      trebleRef,
      volumeRef,
      isReady,
      isRunning,
      resume,
    }),
    [isReady, isRunning, resume]
  );
}
