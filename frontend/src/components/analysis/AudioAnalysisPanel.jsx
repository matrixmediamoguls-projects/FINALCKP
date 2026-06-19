export default function AudioAnalysisPanel({
  intensity,
  bass,
  mid,
  treble,
  bpm = 128,
  trackKey = "C# MINOR",
  isPlaying = false,
}) {
  const rows = [
    ["VOCAL DETECTION", isPlaying ? "ACTIVE" : "ARMED"],
    ["BEAT LOCK", isPlaying ? "LOCKED" : "READY"],
    ["BPM", bpm],
    ["KEY", trackKey],
    ["CHORUS DETECTED", intensity > 70 ? "YES" : "SCAN"],
    ["INTENSITY STATE", intensity > 70 ? "ASCENDING" : "STABLE"],
    ["SYNC ACCURACY", `${Math.max(91, Math.min(99, intensity + 19))}%`],
  ];

  return (
    <section className="pva-panel pva-analysis pva-sync-core">
      <div className="pva-panel-title">
        <span>SYNC CORE</span>
        <small>REAL TIME PROTOCOL</small>
      </div>
      <div className="pva-sync-table">
        {rows.map(([label, value]) => (
          <p key={label}>
            <span>{label}</span>
            <strong>{value}</strong>
          </p>
        ))}
      </div>

      <div className="pva-intensity-monitor">
        <span>INTENSITY MONITOR</span>
        <i />
        <strong>{intensity}%</strong>
        <em>CURRENT</em>
      </div>

      <div className="pva-frequency-core">
        <div className="pva-frequency-radar" aria-hidden="true"><i /></div>
        <div className="pva-analysis-bars">
          <p><span>SUB BASS</span><i style={{ width: `${Math.max(60, bass + 8)}%` }} /><em>{Math.max(60, bass + 8)}%</em></p>
          <p><span>BASS</span><i style={{ width: `${bass}%` }} /><em>{bass}%</em></p>
          <p><span>MIDS</span><i style={{ width: `${mid}%` }} /><em>{mid}%</em></p>
          <p><span>HIGHS</span><i style={{ width: `${treble}%` }} /><em>{treble}%</em></p>
        </div>
      </div>
    </section>
  );
}
