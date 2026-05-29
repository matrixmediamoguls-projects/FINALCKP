const fmt = (seconds) => {
  const value = Number(seconds);
  if (!Number.isFinite(value) || value <= 0) return "0:00";
  const m = Math.floor(value / 60);
  const s = Math.floor(value % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
};

export default function LyricsProtocolPanel({
  lines,
  activeLineId,
  currentTime,
  empty,
}) {
  return (
    <section className="pva-panel pva-lyrics">
      <div className="pva-panel-title">LYRIC PROTOCOL</div>
      <div className="pva-lyrics-lines">
        {empty ? (
          <p className="pva-media-empty">No lyrics found for this track.</p>
        ) : (
          lines.map((line) => (
            <p key={line.id} className={line.id === activeLineId ? "is-active" : ""}>
              <span>{fmt(line.time)}</span>
              {line.text}
            </p>
          ))
        )}
      </div>
      <footer>{fmt(currentTime)}</footer>
    </section>
  );
}
