import { useEffect, useState } from "react";

const audioGraphs = new WeakMap();

export default function useAudioAnalyzer(audioRef) {
  const [intensity, setIntensity] = useState(0);

  useEffect(() => {
    if (!audioRef.current || typeof AudioContext === "undefined") return;

    const audioElement = audioRef.current;
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;

    if (!AudioContextClass) return;

    let graph = audioGraphs.get(audioElement);

    if (!graph) {
      const ctx = new AudioContextClass();
      const source = ctx.createMediaElementSource(audioElement);

      graph = { ctx, source };
      audioGraphs.set(audioElement, graph);
    }

    const analyser = graph.ctx.createAnalyser();

    graph.source.connect(analyser);
    analyser.connect(graph.ctx.destination);

    analyser.fftSize = 256;

    const data = new Uint8Array(analyser.frequencyBinCount);
    let frameId;

    const update = () => {
      analyser.getByteFrequencyData(data);

      const avg =
        data.reduce((a, b) => a + b, 0) / data.length;

      setIntensity(avg / 255);

      frameId = requestAnimationFrame(update);
    };

    update();

    return () => {
      if (frameId) cancelAnimationFrame(frameId);
      graph.source.disconnect(analyser);
      analyser.disconnect();
    };
  }, [audioRef]);

  return intensity;
}
