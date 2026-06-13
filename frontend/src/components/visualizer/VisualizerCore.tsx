import { useEffect, useRef } from "react";
import type { CSSProperties } from "react";
import type { AudioAnalyzerRefs } from "./useAudioAnalyzer";

type Particle = {
  angle: number;
  radius: number;
  speed: number;
  size: number;
  depth: number;
  drift: number;
};

export type VisualizerCoreProps = {
  analyzer: AudioAnalyzerRefs;
  isPlaying?: boolean;
  className?: string;
  style?: CSSProperties;
};

const shellStyle: CSSProperties = {
  position: "relative",
  width: "100%",
  aspectRatio: "16 / 9",
  overflow: "hidden",
  borderRadius: 28,
  background: "#030304",
  boxShadow:
    "0 30px 90px rgba(0,0,0,.72), inset 0 0 0 1px rgba(255,55,38,.18), inset 0 0 90px rgba(160,0,0,.12)",
};

const canvasStyle: CSSProperties = {
  position: "absolute",
  inset: 0,
  width: "100%",
  height: "100%",
  display: "block",
};

const clamp01 = (value: number) => Math.max(0, Math.min(1, value));
const lerp = (from: number, to: number, amount: number) => from + (to - from) * amount;

const createParticles = (count: number): Particle[] =>
  Array.from({ length: count }, () => ({
    angle: Math.random() * Math.PI * 2,
    radius: 0.22 + Math.random() * 0.64,
    speed: 0.045 + Math.random() * 0.2,
    size: 0.55 + Math.random() * 2.1,
    depth: 0.2 + Math.random() * 0.8,
    drift: Math.random() > 0.5 ? 1 : -1,
  }));

const drawBackground = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  time: number,
  bass: number,
  intensity: number
) => {
  const cx = width / 2;
  const cy = height / 2;
  const base = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(width, height) * 0.74);
  base.addColorStop(0, `rgba(22,3,3,${0.74 + intensity * 0.14})`);
  base.addColorStop(0.42, "rgba(7,5,6,.98)");
  base.addColorStop(1, "#000");
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, width, height);

  const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.min(width, height) * 0.55);
  glow.addColorStop(0, `rgba(255,30,12,${0.075 + bass * 0.16})`);
  glow.addColorStop(0.55, `rgba(120,0,0,${0.05 + intensity * 0.08})`);
  glow.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, width, height);

  ctx.save();
  ctx.globalAlpha = 0.08 + intensity * 0.055;
  ctx.strokeStyle = "rgba(255,55,43,.16)";
  ctx.lineWidth = 1;
  const spacing = Math.max(34, width * 0.035);
  const offset = (time * 8) % spacing;

  for (let x = -spacing + offset; x < width + spacing; x += spacing) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x + width * 0.12, height);
    ctx.stroke();
  }

  for (let y = -spacing + offset; y < height + spacing; y += spacing) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y + height * 0.06);
    ctx.stroke();
  }
  ctx.restore();
};

const drawParticles = (
  ctx: CanvasRenderingContext2D,
  particles: Particle[],
  width: number,
  height: number,
  time: number,
  bass: number,
  treble: number
) => {
  const cx = width / 2;
  const cy = height / 2;
  const limit = Math.min(width, height) * 0.5;

  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  for (const particle of particles) {
    const angle = particle.angle + time * particle.speed * particle.drift * (0.45 + bass);
    const distance = limit * (particle.radius + Math.sin(time * 1.4 + particle.angle) * 0.025);
    const x = cx + Math.cos(angle) * distance * 1.55;
    const y = cy + Math.sin(angle) * distance * 0.84;
    const alpha = (0.08 + particle.depth * 0.22) * (0.7 + treble * 1.45);

    ctx.beginPath();
    ctx.fillStyle = `rgba(255,${82 + Math.floor(particle.depth * 80)},34,${alpha})`;
    ctx.shadowBlur = 6 + particle.depth * 12 + treble * 18;
    ctx.shadowColor = "rgba(255,55,20,.8)";
    ctx.arc(x, y, particle.size * (0.85 + treble * 0.55), 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
};

const drawMechanicalDepth = (ctx: CanvasRenderingContext2D, width: number, height: number, time: number, intensity: number) => {
  const cx = width / 2;
  const cy = height / 2;
  const minSide = Math.min(width, height);

  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(time * 0.018);
  ctx.strokeStyle = `rgba(148,155,155,${0.06 + intensity * 0.045})`;
  ctx.lineWidth = 1;
  for (let ring = 0; ring < 4; ring += 1) {
    ctx.setLineDash([18, 14 + ring * 6]);
    ctx.beginPath();
    ctx.arc(0, 0, minSide * (0.18 + ring * 0.078), 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.setLineDash([]);
  ctx.restore();
};

const drawBassRings = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  bass: number,
  lowMid: number,
  time: number
) => {
  const cx = width / 2;
  const cy = height / 2;
  const minSide = Math.min(width, height);
  const openRadius = minSide * 0.13;

  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  for (let index = 0; index < 5; index += 1) {
    const wave = Math.sin(time * (1.2 + index * 0.18) + index * 1.3) * 0.5 + 0.5;
    const radius = openRadius + minSide * (0.058 + index * 0.055) + bass * minSide * 0.052 + wave * lowMid * 14;
    const alpha = Math.max(0.035, 0.2 - index * 0.024 + bass * 0.18);
    ctx.beginPath();
    ctx.lineWidth = 1.15 + bass * 2.4;
    ctx.strokeStyle = `rgba(255,${48 + index * 24},${22 + index * 6},${alpha})`;
    ctx.shadowBlur = 12 + bass * 34;
    ctx.shadowColor = "rgba(255,22,12,.86)";
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.stroke();
  }

  const voidGradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, openRadius * 1.2);
  voidGradient.addColorStop(0, "rgba(0,0,0,.44)");
  voidGradient.addColorStop(0.72, "rgba(10,1,1,.18)");
  voidGradient.addColorStop(1, "rgba(0,0,0,0)");
  ctx.globalCompositeOperation = "source-over";
  ctx.fillStyle = voidGradient;
  ctx.beginPath();
  ctx.arc(cx, cy, openRadius * 1.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
};

const drawRadialSpectrum = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  data: Uint8Array,
  bass: number,
  mid: number,
  treble: number,
  time: number
) => {
  const cx = width / 2;
  const cy = height / 2;
  const minSide = Math.min(width, height);
  const barCount = 192;
  const baseRadius = minSide * 0.285;
  const maxBarLength = minSide * 0.16;
  const dataLength = Math.max(1, data.length);

  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  ctx.lineCap = "round";
  for (let index = 0; index < barCount; index += 1) {
    const normalized = index / barCount;
    const dataIndex = Math.floor(Math.pow(normalized, 1.85) * (dataLength - 1));
    const energy = clamp01((data[dataIndex] || 0) / 255);
    const angle = normalized * Math.PI * 2 - Math.PI / 2;
    const tick = Math.sin(time * 1.2 + index * 0.08) * 0.5 + 0.5;
    const length = 7 + Math.pow(energy, 1.55) * maxBarLength * (0.42 + bass * 0.46 + mid * 0.24 + tick * treble * 0.16);
    const inner = baseRadius + Math.sin(time * 0.6 + index * 0.035) * 2;
    const outer = inner + length;
    const ember = 42 + Math.floor(energy * 96);

    ctx.beginPath();
    ctx.lineWidth = 1.1 + energy * 2.1 + bass * 0.8;
    ctx.strokeStyle = `rgba(255,${ember},28,${0.18 + energy * 0.58})`;
    ctx.shadowBlur = 9 + energy * 24 + bass * 18;
    ctx.shadowColor = "rgba(255,27,16,.9)";
    ctx.moveTo(cx + Math.cos(angle) * inner, cy + Math.sin(angle) * inner);
    ctx.lineTo(cx + Math.cos(angle) * outer, cy + Math.sin(angle) * outer);
    ctx.stroke();
  }
  ctx.restore();
};

const drawWaveformPulse = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  data: Uint8Array,
  volume: number,
  bass: number,
  time: number
) => {
  if (!data.length) return;

  const centerY = height / 2;
  const left = width * 0.16;
  const right = width * 0.84;
  const usableWidth = right - left;
  const amplitude = Math.min(height * 0.105, 20 + volume * height * 0.2);

  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.shadowBlur = 14 + bass * 18;
  ctx.shadowColor = "rgba(255,34,20,.68)";

  for (let pass = 0; pass < 2; pass += 1) {
    ctx.beginPath();
    ctx.lineWidth = pass === 0 ? 2.1 : 0.75;
    ctx.strokeStyle = pass === 0 ? "rgba(255,62,40,.36)" : "rgba(255,178,82,.28)";
    for (let index = 0; index < data.length; index += 3) {
      const x = left + (index / (data.length - 1)) * usableWidth;
      const centered = (data[index] - 128) / 128;
      const envelope = Math.sin((index / data.length) * Math.PI);
      const y = centerY + centered * amplitude * envelope + Math.sin(time * 2 + index * 0.018) * bass * 2;
      if (index === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }
  ctx.restore();
};

const drawFrame = (ctx: CanvasRenderingContext2D, width: number, height: number, bass: number, intensity: number) => {
  const margin = Math.max(14, Math.min(width, height) * 0.025);
  const cut = Math.max(22, Math.min(width, height) * 0.058);
  const left = margin;
  const right = width - margin;
  const top = margin;
  const bottom = height - margin;

  ctx.save();
  ctx.lineJoin = "bevel";
  ctx.lineCap = "square";
  ctx.lineWidth = 2.2;
  ctx.shadowBlur = 18 + bass * 26;
  ctx.shadowColor = `rgba(255,23,15,${0.32 + intensity * 0.38})`;
  ctx.strokeStyle = `rgba(255,48,36,${0.42 + intensity * 0.24})`;
  ctx.beginPath();
  ctx.moveTo(left + cut, top);
  ctx.lineTo(width * 0.34, top);
  ctx.lineTo(width * 0.38, top + margin * 0.82);
  ctx.lineTo(width * 0.62, top + margin * 0.82);
  ctx.lineTo(width * 0.66, top);
  ctx.lineTo(right - cut, top);
  ctx.lineTo(right, top + cut);
  ctx.lineTo(right, bottom - cut);
  ctx.lineTo(right - cut, bottom);
  ctx.lineTo(width * 0.66, bottom);
  ctx.lineTo(width * 0.62, bottom - margin * 0.82);
  ctx.lineTo(width * 0.38, bottom - margin * 0.82);
  ctx.lineTo(width * 0.34, bottom);
  ctx.lineTo(left + cut, bottom);
  ctx.lineTo(left, bottom - cut);
  ctx.lineTo(left, top + cut);
  ctx.closePath();
  ctx.stroke();
  ctx.restore();
};

export default function VisualizerCore({ analyzer, isPlaying = false, className, style }: VisualizerCoreProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const smooth = useRef({ bass: 0, lowMid: 0, mid: 0, treble: 0, volume: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d", { alpha: false });
    if (!canvas || !ctx) return undefined;

    particlesRef.current = createParticles(150);
    let frameId = 0;
    let width = 1;
    let height = 1;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);
    resize();

    const render = (now: number) => {
      const time = now * 0.001;
      const targetBass = isPlaying ? analyzer.bassRef.current : 0;
      const targetLowMid = isPlaying ? analyzer.lowMidRef.current : 0;
      const targetMid = isPlaying ? analyzer.midRef.current : 0;
      const targetTreble = isPlaying ? analyzer.trebleRef.current : 0;
      const targetVolume = isPlaying ? analyzer.volumeRef.current : 0;

      smooth.current.bass = lerp(smooth.current.bass, targetBass, 0.11);
      smooth.current.lowMid = lerp(smooth.current.lowMid, targetLowMid, 0.1);
      smooth.current.mid = lerp(smooth.current.mid, targetMid, 0.09);
      smooth.current.treble = lerp(smooth.current.treble, targetTreble, 0.12);
      smooth.current.volume = lerp(smooth.current.volume, targetVolume, 0.1);

      const { bass, lowMid, mid, treble, volume } = smooth.current;
      const intensity = clamp01(bass * 0.5 + lowMid * 0.18 + mid * 0.2 + treble * 0.12 + volume * 0.28);

      drawBackground(ctx, width, height, time, bass, intensity);
      drawParticles(ctx, particlesRef.current, width, height, time, bass, treble);
      drawMechanicalDepth(ctx, width, height, time, intensity);
      drawBassRings(ctx, width, height, bass, lowMid, time);
      drawRadialSpectrum(ctx, width, height, analyzer.frequencyDataRef.current, bass, mid, treble, time);
      drawWaveformPulse(ctx, width, height, analyzer.timeDomainDataRef.current, volume, bass, time);
      drawFrame(ctx, width, height, bass, intensity);

      frameId = window.requestAnimationFrame(render);
    };

    frameId = window.requestAnimationFrame(render);

    return () => {
      resizeObserver.disconnect();
      window.cancelAnimationFrame(frameId);
    };
  }, [analyzer, isPlaying]);

  return (
    <div className={className} style={{ ...shellStyle, ...style }}>
      <canvas ref={canvasRef} style={canvasStyle} aria-label="CKP Reclamation audio-reactive visualizer" />
    </div>
  );
}
