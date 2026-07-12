import { useState } from 'react';

export default function PairedTrackPortal({ sourceTracks, lyricAnchors, listenedTracks, selectedAnchorKey, onMarkListened, onAnchorSelect, onTrackError }) {
  const [trackErrors, setTrackErrors] = useState({});

  const receiveTrack = async (track) => {
    try {
      if (track.unavailable) throw new Error(track.errorMessage || 'Track unavailable — check your connection.');
      await onMarkListened(track.trackOrder);
      setTrackErrors((current) => ({ ...current, [track.trackOrder]: null }));
    } catch (error) {
      const message = error?.message || 'Track unavailable — check your connection.';
      setTrackErrors((current) => ({ ...current, [track.trackOrder]: message }));
      onTrackError?.(track, error);
    }
  };

  return (
    <section className="fire-door-panel" aria-labelledby="paired-track-heading">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="fire-door-kicker">Scene 02 • Signal Keys</p>
          <h4 id="paired-track-heading" className="mt-2 text-2xl font-semibold uppercase tracking-[0.12em] text-white">Paired Track Portal</h4>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-zinc-400">Receive each signal key before shadow work begins. A written lyric anchor remains available if a track cannot load.</p>
        </div>
        <span className="fire-door-badge is-hot" aria-live="polite">{listenedTracks.length}/{sourceTracks.length} signals received</span>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        {sourceTracks.map((track) => {
          const isComplete = listenedTracks.includes(track.trackOrder);
          const trackError = trackErrors[track.trackOrder];
          return (
            <article key={track.trackOrder} className={`fire-door-card p-4 ${isComplete ? 'is-complete' : ''}`}>
              <div className="flex h-full flex-col justify-between gap-5">
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <span className="fire-door-badge">{track.keyLabel}</span>
                    <span className={`fire-door-badge ${isComplete ? 'is-hot' : ''}`}>{isComplete ? 'Signal Received' : trackError ? 'Signal interrupted' : 'Awaiting Signal'}</span>
                  </div>
                  <h5 className="mt-4 text-lg font-semibold uppercase tracking-[0.1em] text-white">{track.title}</h5>
                  <p className="mt-3 text-sm leading-7 text-zinc-400">{track.function}</p>
                  <div className="mt-4 rounded-2xl border border-red-500/15 bg-red-950/10 p-3">
                    <span className="fire-door-micro text-red-200/70">Lyric anchor / text alternative</span>
                    <p className="mt-2 text-sm leading-6 text-zinc-200">{track.lyricAnchor}</p>
                  </div>
                  {trackError && <p className="mt-3 text-sm text-red-200" role="alert">{trackError} You can still use the lyric anchor above, then retry.</p>}
                </div>
                <button type="button" onClick={() => receiveTrack(track)} className="fire-door-action w-full justify-center">
                  {isComplete ? 'Signal Received' : trackError ? 'Retry Signal' : 'Receive Signal'}
                </button>
              </div>
            </article>
          );
        })}
      </div>

      <div className="mt-5 rounded-3xl border border-white/10 bg-white/[0.03] p-4">
        <p className="fire-door-kicker">Signal Anchors</p>
        <div className="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-4" role="group" aria-label="Choose a signal anchor">
          {lyricAnchors.map((anchor) => {
            const active = selectedAnchorKey === anchor.key;
            return (
              <button type="button" key={anchor.key} onClick={() => onAnchorSelect(anchor.key)} aria-pressed={active} className={`fire-door-card p-3 text-left transition ${active ? 'is-active' : ''}`}>
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
