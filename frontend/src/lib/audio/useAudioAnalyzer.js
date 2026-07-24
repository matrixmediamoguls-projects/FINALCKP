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
    if (!audio || analyzerRef.current) return audioContextRef.current;

    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return null;

    const context = new AudioContext();
    const analyzer = context.createAnalyser();
    analyzer.fftSize = 256;

    const captureStream = audio.captureStream || audio.mozCaptureStream;
    let source;

    try {
      if (captureStream) {
        // Analyze a copy of the media stream. The audio element keeps its own
        // direct speaker output, so a suspended AudioContext can never mute it.
        source = context.createMediaStreamSource(captureStream.call(audio));
        source.connect(analyzer);
      } else {
        // Safari does not expose captureStream. Its MediaElementSource must be
        // connected back to the destination to preserve audible output.
        source = context.createMediaElementSource(audio);
        source.connect(analyzer);
        analyzer.connect(context.destination);
      }
    } catch (error) {
      console.warn('Audio analysis unavailable; continuing direct playback.', error);
      context.close();
      return null;
    }

    audioContextRef.current = context;
    analyzerRef.current = analyzer;
    sourceRef.current = source;
    return context;
  }, [audioElementRef]);

  const start = useCallback(async () => {
    connect();

    const analyzer = analyzerRef.current;
    if (!analyzer) return;
    if (audioContextRef.current?.state === 'suspended') {
      await audioContextRef.current.resume();
    }

    const buffer = new Uint8Array(analyzer.frequencyBinCount);

    const tick = () => {
      analyzer.getByteFrequencyData(buffer);
      const values = Array.from(buffer);
      const average = values.reduce((sum, value) => sum + value, 0) / values.length;
      setFrequencyData(values);
      setAudioLevel(Math.round(average));
      frameRef.current = requestAnimationFrame(tick);
    };

    if (frameRef.current) cancelAnimationFrame(frameRef.current);
    tick();
  }, [connect]);

  const stop = useCallback(() => {
    if (frameRef.current) cancelAnimationFrame(frameRef.current);
    frameRef.current = null;
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
