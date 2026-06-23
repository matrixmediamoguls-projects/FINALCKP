export default function PairedTrackPortal({ sourceTracks, lyricAnchors, listenedTracks, selectedAnchorKey, onMarkListened, onAnchorSelect }) {
  return (
    <section className="fire-door-panel">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="fire-door-kicker">Scene 02 • Signal Keys</p>
          <h4 className="mt-2 text-2xl font-semibold uppercase tracking-[0.12em] text-white">Paired Track Portal</h4>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-zinc-400">The Rising Seeker receives the two ignition keys before any shadow work begins. These are not music cards. They are signal gates.</p>
        </div>
        <span className="fire-door-badge is-hot">
          {listenedTracks.length}/{sourceTracks.length} signals received
        </span>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        {sourceTracks.map((track) => {
          const isComplete = listenedTracks.includes(track.trackOrder);
          return (
            <article key={track.trackOrder} className={`fire-door-card p-4 ${isComplete ? 'is-complete' : ''}`}>
              <div className="flex h-full flex-col justify-between gap-5">
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <span className="fire-door-badge">{track.keyLabel}</span>
                    <span className={`fire-door-badge ${isComplete ? 'is-hot' : ''}`}>{isComplete ? 'Signal Received' : 'Awaiting Signal'}</span>
                  </div>
                  <h5 className="mt-4 text-lg font-semibold uppercase tracking-[0.1em] text-white">{track.title}</h5>
                  <p className="mt-3 text-sm leading-7 text-zinc-400">{track.function}</p>
                  <div className="mt-4 rounded-2xl border border-red-500/15 bg-red-950/10 p-3">
                    <span className="fire-door-micro text-red-200/70">Lyric Anchor</span>
                    <p className="mt-2 text-sm leading-6 text-zinc-200">{track.lyricAnchor}</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onMarkListened(track.trackOrder)}
                  className="fire-door-action w-full justify-center"
                >
                  {isComplete ? 'Signal Received' : 'Receive Signal'}
                </button>
              </div>
            </article>
          );
        })}
      </div>

      <div className="mt-5 rounded-3xl border border-white/10 bg-white/[0.03] p-4">
        <p className="fire-door-kicker">Signal Anchors</p>
        <div className="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {lyricAnchors.map((anchor) => {
            const active = selectedAnchorKey === anchor.key;
            return (
              <button
                type="button"
                key={anchor.key}
                onClick={() => onAnchorSelect(anchor.key)}
                className={`fire-door-card p-3 text-left transition ${active ? 'is-active' : ''}`}
              >
                <span className="fire-door-badge">{anchor.label}</span>
                <strong className="mt-3 block text-xs uppercase tracking-[0.14em] text-white">{anchor.teaching}</strong>
                <p className="mt-2 text-xs leading-6 text-zinc-400">{anchor.line}</p>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
