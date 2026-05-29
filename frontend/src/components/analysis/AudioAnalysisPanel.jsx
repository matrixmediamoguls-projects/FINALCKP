export default function AudioAnalysisPanel({
  intensity,
  bass,
  mid,
  treble,
}) {
  return (
    <section className="pva-panel pva-analysis">
      <div className="pva-panel-title">AUDIO ANALYSIS</div>
      <div className="pva-analysis-gauge">
        <span>INTENSITY</span>
        <strong>{intensity}%</strong>
      </div>
      <div className="pva-analysis-bars">
        <p><span>BASS</span><i style={{ width: `${bass}%` }} /></p>
        <p><span>MIDS</span><i style={{ width: `${mid}%` }} /></p>
        <p><span>TREBLE</span><i style={{ width: `${treble}%` }} /></p>
      </div>
    </section>
  );
}
