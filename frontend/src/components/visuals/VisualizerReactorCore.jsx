import "./VisualizerReactorCore.css";

const clamp = (value, min = 0, max = 1) => Math.max(min, Math.min(max, Number(value) || 0));

const buildBars = (count, bass, mid, treble, intensity) => {
  const b = clamp(bass);
  const m = clamp(mid);
  const t = clamp(treble);
  const i = clamp(intensity);

  return Array.from({ length: count }, (_, index) => {
    const angle = (index / count) * 360;
    const band = index % 3 === 0 ? b : index % 3 === 1 ? m : t;
    const harmonic = Math.sin(index * 0.72) * 0.5 + 0.5;
    const height = 16 + Math.round((band * 42) + (i * 28) + (harmonic * 18));

    return {
      angle,
      height: Math.max(18, Math.min(104, height)),
      opacity: 0.42 + Math.min(0.5, band * 0.5),
    };
  });
};

export default function VisualizerReactorCore({
  isPlaying = false,
  intensity = 78,
  bass = 82,
  mid = 64,
  treble = 71,
  bpm,
  trackTitle = 'BREAK THE CODE',
  keySignature,
}) {
  const normalizedIntensity = clamp(intensity / 100);
  const normalizedBass = clamp(bass / 100);
  const normalizedMid = clamp(mid / 100);
  const normalizedTreble = clamp(treble / 100);
  const reactorBars = buildBars(96, normalizedBass, normalizedMid, normalizedTreble, normalizedIntensity);
  const pulseScale = 1 + normalizedBass * 0.055 + (isPlaying ? normalizedIntensity * 0.035 : 0);
  const resolvedBpm = bpm || 128;
  const resolvedKey = keySignature || 'C# MINOR';

  return (
    <section
      className={`reactor-core ${isPlaying ? 'is-live' : 'is-idle'}`}
      style={{
        '--reactor-pulse-scale': pulseScale,
        '--reactor-intensity': normalizedIntensity,
        '--reactor-bass': normalizedBass,
        '--reactor-mid': normalizedMid,
        '--reactor-treble': normalizedTreble,
      }}
      aria-label="Audio reactive visualizer reactor core"
    >
      <div className="reactor-core__halo reactor-core__halo--outer" />
      <div className="reactor-core__halo reactor-core__halo--middle" />
      <div className="reactor-core__halo reactor-core__halo--inner" />

      <div className="reactor-core__spectrum" aria-hidden="true">
        {reactorBars.map((bar, index) => (
          <i
            key={index}
            style={{
              '--bar-angle': `${bar.angle}deg`,
              '--bar-height': `${bar.height}px`,
              '--bar-opacity': bar.opacity,
            }}
          />
        ))}
      </div>

      <div className="reactor-core__orbit reactor-core__orbit--one" />
      <div className="reactor-core__orbit reactor-core__orbit--two" />
      <div className="reactor-core__orbit reactor-core__orbit--three" />

      <div className="reactor-core__node reactor-core__node--left">BPM<br /><strong>{resolvedBpm}</strong></div>
      <div className="reactor-core__node reactor-core__node--right">KEY<br /><strong>{resolvedKey}</strong></div>

      <div className="reactor-core__chamber">
        <div className="reactor-core__void" />
        <div className="reactor-core__crosshair" />
        <div className="reactor-core__readout">
          <span>REACTOR CORE</span>
          <strong>{Math.round(intensity)}%</strong>
          <em>{isPlaying ? 'LIVE SIGNAL' : 'ARMED'}</em>
        </div>
      </div>

      <div className="reactor-core__transport" aria-label="Core transport readout">
        <span>◀</span>
        <strong>{isPlaying ? 'Ⅱ' : '▶'}</strong>
        <span>▶</span>
      </div>

      <div className="reactor-core__caption">
        <span>NOW PLAYING</span>
        <strong>{trackTitle}</strong>
      </div>
    </section>
  );
}
