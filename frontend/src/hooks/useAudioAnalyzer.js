import { useEffect, useState } from "react";

export default function useAudioAnalyzer(audioRef) {
  const [intensity, setIntensity] = useState(0);

  useEffect(() => {
    const ctx = new AudioContext();
    const analyser = ctx.createAnalyser();

    const source = ctx.createMediaElementSource(audioRef.current);

    source.connect(analyser);
    analyser.connect(ctx.destination);

    analyser.fftSize = 256;

    const data = new Uint8Array(analyser.frequencyBinCount);

    const update = () => {
      analyser.getByteFrequencyData(data);

      const avg =
        data.reduce((a, b) => a + b, 0) / data.length;

      setIntensity(avg / 255);

      requestAnimationFrame(update);
    };

    update();
  }, []);

  return intensity;
}