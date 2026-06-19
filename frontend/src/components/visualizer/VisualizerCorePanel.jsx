import VisualResonanceCore from "../protocol/core/VisualResonanceCore";

export default function VisualizerCorePanel({
  track,
  currentTime,
  duration,
  progress,
  visualMode,
  bpm = 128,
  trackKey = "C# MINOR",
}) {
  const title = track?.title || track?.name || "BREAK THE CODE";

  return (
    <section className={`pva-panel pva-visualizer-core is-${visualMode || "cinematic"}`}>
      <div className="pva-reactor-grid" aria-hidden="true" />
      <div className="pva-core-side-chip pva-core-side-chip--left">
        <span>BPM</span>
        <strong>{bpm}</strong>
      </div>
      <div className="pva-core-side-chip pva-core-side-chip--right">
        <span>KEY</span>
        <strong>{trackKey}</strong>
      </div>

      <div className="pva-core-frame">
        <VisualResonanceCore track={track} />
      </div>

      <div className="pva-now-playing">
        <span>NOW PLAYING</span>
        <strong>{title}</strong>
      </div>

      <div className="pva-core-time">
        <span>{currentTime}</span>
        <i style={{ width: `${progress}%` }} />
        <span>{duration}</span>
      </div>
    </section>
  );
}
