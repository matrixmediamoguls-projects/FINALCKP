export default function ProtocolEnginePanel({ track, isPlaying }) {
  const title = track?.title || track?.name || "NO ARTIFACT SELECTED";
  const feed = [
    isPlaying ? "Artifact resonance detected" : "Signal armed",
    track?.lyrics ? "Narrative integrity verified" : "Narrative text missing",
    track?.visual_media_url ? "Visual signal linked" : "Visual signal missing",
    "Protocol channel stable",
  ];

  return (
    <section className="pva-panel pva-protocol-engine">
      <div className="pva-panel-title">PROTOCOL ENGINE</div>
      <strong>{title}</strong>
      <ul>
        {feed.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  );
}
