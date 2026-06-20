import { useCallback, useEffect, useRef, useState } from 'react';

export function useAudioAnalyzer(audioElementRef) {
  const audioContextRef = useRef(null);
  const analyzerRef = useRef(null);
  const sourceRef = useRef(null);
  const frameRef = useRef(null);
  const [frequencyData, setFrequencyData] = useState([]);
  const [audioLevel, setAudioLevel] = useState(0);

  const connect = useCallback(() => {
    const audio = audioElementRef.current;
    if (!audio || analyzerRef.current) return;

    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;

    const context = new AudioContext();
    const analyzer = context.createAnalyser();
    analyzer.fftSize = 256;

    const source = context.createMediaElementSource(audio);
    source.connect(analyzer);
    analyzer.connect(context.destination);

    audioContextRef.current = context;
    analyzerRef.current = analyzer;
    sourceRef.current = source;
  }, [audioElementRef]);

  const start = useCallback(() => {
    connect();

    const analyzer = analyzerRef.current;
    if (!analyzer) return;

    const buffer = new Uint8Array(analyzer.frequencyBinCount);

    const tick = () => {
      analyzer.getByteFrequencyData(buffer);
      const values = Array.from(buffer);
      const average = values.reduce((sum, value) => sum + value, 0) / values.length;
      setFrequencyData(values);
      setAudioLevel(Math.round(average));
      frameRef.current = requestAnimationFrame(tick);
    };

    tick();
  }, [connect]);

  const stop = useCallback(() => {
    if (frameRef.current) cancelAnimationFrame(frameRef.current);
    frameRef.current = null;
  }, []);

  useEffect(() => stop, [stop]);

  return { connect, start, stop, frequencyData, audioLevel };
}
