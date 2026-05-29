function fmtTrackDuration(track) {
  if (track?.duration) return track.duration;
  const seconds = Number(track?.duration_seconds ?? track?.duration_in_seconds);
  if (!Number.isFinite(seconds) || seconds <= 0) return "--:--";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

export default function TrackListPanel({
  tracks,
  loading,
  error,
  activeTrackIndex,
  onSelectTrack,
  totalDuration,
}) {
  return (
    <section className="pva-panel pva-tracklist">
      <div className="pva-panel-title">TRACKLIST</div>
      {error && <p className="pva-error">{error}</p>}
      <ol>
        {loading ? (
          <li className="is-loading">Loading artifacts...</li>
        ) : (
          tracks.map((track, index) => {
            const active = index === activeTrackIndex;
            const number = String(track.sort_order ?? index + 1).padStart(2, "0");
            return (
              <li key={track.id || track.track_id || number} className={active ? "is-active" : ""}>
                <button type="button" onClick={() => onSelectTrack(track, index)}>
                  <span>{number}.</span>
                  <strong>{track.title || track.name || `Artifact ${number}`}</strong>
                  <em>{fmtTrackDuration(track)}</em>
                </button>
              </li>
            );
          })
        )}
      </ol>
      <footer>
        <span>TOTAL DURATION</span>
        <strong>{totalDuration}</strong>
      </footer>
    </section>
  );
}
