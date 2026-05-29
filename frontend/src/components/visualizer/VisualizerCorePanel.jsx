import VisualResonanceCore from "../protocol/core/VisualResonanceCore";

export default function VisualizerCorePanel({
  track,
  currentTime,
  duration,
  progress,
  visualMode,
}) {
  return (
    <section className={`pva-panel pva-visualizer-core is-${visualMode || "cinematic"}`}>
      <div className="pva-core-title">ACT 3 : RECLAMATION</div>

      <div className="pva-core-frame">
        <VisualResonanceCore track={track} />
      </div>

      <div className="pva-core-time">
        <span>{currentTime}</span>
        <i style={{ width: `${progress}%` }} />
        <span>{duration}</span>
      </div>
    </section>
  );
}
