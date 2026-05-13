import { useEffect, useMemo, useRef, useState } from 'react';

const EMPTY_ARRAY = new Uint8Array(128);

function average(buffer) {
  if (!buffer?.length) return 0;
  let total = 0;
  for (let index = 0; index < buffer.length; index += 1) total += buffer[index];
  return total / buffer.length / 255;
}

function toUint8Array(data) {
  if (!data) return EMPTY_ARRAY;
  if (data instanceof Uint8Array) return data;
  if (Array.isArray(data)) return new Uint8Array(data);
  return EMPTY_ARRAY;
}

export function useAudio(track, externalAudioData) {
  const [dataArray, setData] = useState(EMPTY_ARRAY);
  const [pulse, setPulse] = useState(0);
  const audioRef = useRef(null);
  const contextRef = useRef(null);
  const analyserRef = useRef(null);
  const sourceRef = useRef(null);
  const rafRef = useRef(null);

  const externalFrequency = externalAudioData?.frequencyData;
  const externalPulse = externalAudioData?.energy ?? externalAudioData?.averageVolume;

  useEffect(() => {
    if (!externalFrequency && externalPulse == null) return undefined;
    const nextArray = toUint8Array(externalFrequency);
    setData(nextArray);
    setPulse(Math.max(0, Math.min(1, externalPulse ?? average(nextArray))));
    return undefined;
  }, [externalFrequency, externalPulse]);

  const sourceUrl = useMemo(() => track?.src || track?.audio_url || track?.audioUrl || '', [track]);

  useEffect(() => {
    if (externalFrequency || externalPulse != null || !sourceUrl || typeof window === 'undefined') return undefined;

    let disposed = false;
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return undefined;

    const audio = new Audio(sourceUrl);
    audio.crossOrigin = 'anonymous';
    audio.preload = 'auto';
    audioRef.current = audio;

    const context = new AudioContextClass();
    const analyser = context.createAnalyser();
    analyser.fftSize = 1024;
    analyser.smoothingTimeConstant = 0.78;

    const source = context.createMediaElementSource(audio);
    source.connect(analyser);
    analyser.connect(context.destination);

    contextRef.current = context;
    analyserRef.current = analyser;
    sourceRef.current = source;

    const buffer = new Uint8Array(analyser.frequencyBinCount);

    const tick = () => {
      if (disposed) return;
      analyser.getByteFrequencyData(buffer);
      const snapshot = new Uint8Array(buffer);
      setData(snapshot);
      setPulse(average(snapshot));
      rafRef.current = requestAnimationFrame(tick);
    };

    tick();

    if (track?.autoplay) {
      audio.play().catch(() => {
        setPulse(0);
      });
    }

    return () => {
      disposed = true;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      audio.pause();
      source.disconnect();
      analyser.disconnect();
      if (context.state !== 'closed') context.close();
    };
  }, [externalFrequency, externalPulse, sourceUrl, track?.autoplay]);

  return { dataArray, pulse, audioElement: audioRef.current };
}
