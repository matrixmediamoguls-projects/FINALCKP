export default function PairedTrackPortal({ sourceTracks, lyricAnchors, listenedTracks, selectedAnchorKey, onMarkListened, onAnchorSelect }) {
  return (
    <section className="rounded-3xl border border-white/10 bg-black/55 p-5">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[10px] uppercase tracking-[0.3em] text-red-300/70">Listening Chamber</p>
          <h4 className="mt-2 text-xl font-semibold uppercase tracking-[0.12em] text-white">Paired Portal Tracks</h4>
        </div>
        <span className="rounded-full border border-red-400/25 bg-red-950/25 px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-red-100">
          {listenedTracks.length}/{sourceTracks.length} marked complete
        </span>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        {sourceTracks.map((track) => {
          const isComplete = listenedTracks.includes(track.trackOrder);
          return (
            <article key={track.trackOrder} className="rounded-2xl border border-red-500/20 bg-red-950/10 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="text-[10px] uppercase tracking-[0.24em] text-zinc-500">Track {track.trackOrder}</span>
                  <h5 className="mt-1 text-base font-semibold uppercase tracking-[0.1em] text-white">{track.title}</h5>
                  <p className="mt-3 text-xs leading-6 text-zinc-400">{track.function}</p>
                </div>
                <button
                  type="button"
                  onClick={() => onMarkListened(track.trackOrder)}
                  className={`rounded-full border px-3 py-2 text-[10px] uppercase tracking-[0.18em] ${isComplete ? 'border-red-200/60 bg-red-600/25 text-red-50' : 'border-white/10 bg-white/[0.03] text-zinc-400 hover:border-red-300/40 hover:text-red-100'}`}
                >
                  {isComplete ? 'Complete' : 'Mark Listened'}
                </button>
              </div>
            </article>
          );
        })}
      </div>

      <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
        <p className="text-[10px] uppercase tracking-[0.28em] text-red-300/70">Timed Teaching Cards</p>
        <div className="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {lyricAnchors.map((anchor) => {
            const active = selectedAnchorKey === anchor.key;
            return (
              <button
                type="button"
                key={anchor.key}
                onClick={() => onAnchorSelect(anchor.key)}
                className={`rounded-2xl border p-3 text-left transition ${active ? 'border-red-300/55 bg-red-950/35' : 'border-white/10 bg-black/35 hover:border-red-400/35'}`}
              >
                <span className="text-[10px] uppercase tracking-[0.22em] text-red-200/70">{anchor.label}</span>
                <strong className="mt-2 block text-xs uppercase tracking-[0.14em] text-white">{anchor.teaching}</strong>
                <p className="mt-2 text-xs leading-6 text-zinc-400">{anchor.line}</p>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
